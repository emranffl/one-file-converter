import { CONSTANTS } from "@/lib/constants"
import AdmZip from "adm-zip"
import fs from "fs/promises"
import { NextRequest } from "next/server"
import path from "path"
import sharp from "sharp"
import { POST } from "./route"

// Mock rateLimit with Jest
jest.mock("@/utils/rate-limit", () => ({
  rateLimit: jest.fn().mockResolvedValue(true),
}))

const createMockRequest = async (
  images: { name: string; data: Buffer }[],
  settings: object,
  rateLimitAllowed: boolean = true
): Promise<NextRequest> => {
  const formData = {
    getAll: (key: string) =>
      key === "images" ? images.map((img) => new File([img.data], img.name, { type: "image/png" })) : [],
    get: (key: string) => (key === "settings" ? JSON.stringify(settings) : null),
  }
  const mockRequest = { formData: async () => formData } as unknown as NextRequest
  ;(jest.requireMock("@/utils/rate-limit").rateLimit as jest.Mock).mockResolvedValue(rateLimitAllowed)
  return mockRequest
}

const extractImagesFromZip = async (zipBuffer: Buffer): Promise<{ name: string; data: Buffer }[]> => {
  const zip = new AdmZip(zipBuffer)
  const entries = zip.getEntries()
  return entries.map((entry) => ({
    name: entry.entryName,
    data: entry.getData(),
  }))
}

describe("Image Conversion API", () => {
  let testImageBuffer: Buffer
  let expectedBuffers: Record<string, Buffer>
  let originalWidth: number
  let originalHeight: number

  beforeAll(async () => {
    const testImagePath = path.join(__dirname, "test-assets", "test-image.png")
    testImageBuffer = await fs.readFile(testImagePath)
    const metadata = await sharp(testImageBuffer).metadata()
    originalWidth = metadata.width!
    originalHeight = metadata.height!
    expectedBuffers = {
      jpeg: await fs.readFile(path.join(__dirname, "test-assets", "expected-image.jpeg")),
      // png: await fs.readFile(path.join(__dirname, "test-assets", "expected-png.png")),
    }
  })

  it("should convert a single PNG to JPEG", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/zip")

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
    expect(extractedImages[0].name).toBe("image-1.jpeg")

    const convertedPixels = await sharp(extractedImages[0].data).raw().toBuffer()
    const expectedPixels = await sharp(expectedBuffers.jpeg).raw().toBuffer()
    expect(convertedPixels).toEqual(expectedPixels)
  })

  it("should convert multiple images to JPEG", async () => {
    const mockRequest = await createMockRequest(
      [
        { name: "test-image1.png", data: testImageBuffer },
        { name: "test-image2.png", data: testImageBuffer },
      ],
      { format: "jpeg", quality: 80 }
    )
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(2)
    expect(extractedImages.map((img) => img.name)).toEqual(["image-1.jpeg", "image-2.jpeg"])
  })

  // * Format Conversion Tests
  const formats = CONSTANTS.FORMATS.DEFAULT
  const unsupportedFormats = CONSTANTS.FORMATS.UNSUPPORTED as unknown as string[]
  formats.forEach((format) => {
    it(`should convert to ${format} with specified settings`, async () => {
      const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
        format,
        quality: 80,
      })
      const response = await POST(mockRequest)

      if (unsupportedFormats.includes(format)) {
        expect(response.status).toBe(500)
        const json = await response.json()
        expect(json.error).toBe("Failed to convert images")
      } else {
        expect(response.status).toBe(200)
        const responseBuffer = Buffer.from(await response.arrayBuffer())
        const extractedImages = await extractImagesFromZip(responseBuffer)
        expect(extractedImages).toHaveLength(1)
        expect(extractedImages[0].name).toBe(`image-1.${format}`)

        const metadata = await sharp(extractedImages[0].data).metadata()
        // Handle AVIF quirk: Sharp reports it as "heif"
        expect(metadata.format).toBe(format === "avif" ? "heif" : format)
      }
    })
  })

  it("should rotate an image", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
      rotate: { angle: 90, background: "black" },
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)

    const metadata = await sharp(extractedImages[0].data).metadata()
    expect(metadata.width).toBe(originalHeight) // Swap dimensions after 90° rotation
    expect(metadata.height).toBe(originalWidth)
  })

  it("should flip an image vertically", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
      flip: true,
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })

  it("should flop an image horizontally", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
      flop: true,
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })

  it("should apply blur to an image", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
      blur: { sigma: 5 },
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })

  it("should apply sharpen to an image", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 80,
      sharpen: { sigma: 1, flat: 1, jagged: 2 },
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })

  it("should return 429 when rate limit is exceeded", async () => {
    const mockRequest = await createMockRequest(
      [{ name: "test-image.png", data: testImageBuffer }],
      { format: "jpeg", quality: 80 },
      false
    )
    const response = await POST(mockRequest)
    expect(response.status).toBe(429)
    const json = await response.json()
    expect(json.error).toBe("Too many requests")
  })

  it("should return 400 if no images are provided", async () => {
    const mockRequest = await createMockRequest([], { format: "jpeg", quality: 80 })
    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toBe("Validation Error")
  })

  it("should return 400 for invalid settings", async () => {
    const mockRequest = await createMockRequest([{ name: "test-image.png", data: testImageBuffer }], {
      format: "jpeg",
      quality: 101,
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toBe("Validation Error")
  })

  it("should handle a large image file", async () => {
    const largeImageBuffer = Buffer.alloc(1024 * 1024, 0)
    await sharp(largeImageBuffer, { raw: { width: 1024, height: 1024, channels: 1 } })
      .png()
      .toBuffer()
      .then((buf) => largeImageBuffer.set(buf))

    const mockRequest = await createMockRequest([{ name: "large-image.png", data: largeImageBuffer }], {
      format: "jpeg",
      quality: 80,
    })
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })
})
