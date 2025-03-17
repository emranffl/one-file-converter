import { POST } from "./route"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import AdmZip from "adm-zip"
import sharp from "sharp"

// Mock NextRequest and formData
const createMockRequest = async (images: { name: string; data: Buffer }[], settings: object): Promise<NextRequest> => {
  const formData = {
    getAll: (key: string) => (key === "images" ? images.map((img) => ({
      name: img.name,
      arrayBuffer: async () => new Uint8Array(img.data).buffer,
    })) : []),
    get: (key: string) => (key === "settings" ? JSON.stringify(settings) : null),
  }

  return {
    formData: async () => formData,
  } as unknown as NextRequest // Type assertion for simplicity
}

// Helper to unzip and extract image buffers
const extractImagesFromZip = async (zipBuffer: Buffer): Promise<{ name: string; data: Buffer }[]> => {
  const zip = new AdmZip(zipBuffer)
  const entries = zip.getEntries()
  return entries.map((entry) => ({
    name: entry.entryName,
    data: entry.getData(),
  }))
}

describe("Image Conversion API", () => {
  // Load test assets before all tests
  let testImageBuffer: Buffer
  let expectedImageBuffer: Buffer

  beforeAll(async () => {
    const testImagePath = path.join(__dirname, "test-assets", "test-image.png")
    const expectedImagePath = path.join(__dirname, "test-assets", "expected-image.jpeg")
    testImageBuffer = await fs.readFile(testImagePath)
    expectedImageBuffer = await fs.readFile(expectedImagePath)
  })

  // 1. Basic Conversion Test
  it("should convert a single PNG to JPEG and return a zip file", async () => {
    const mockRequest = await createMockRequest(
      [{ name: "test-image.png", data: testImageBuffer }],
      { format: "jpeg", quality: 80 }
    )

    const response = await POST(mockRequest)
    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/zip")
    expect(response.headers.get("Content-Disposition")).toContain("attachment filename=")

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
    expect(extractedImages[0].name).toBe("image-1.jpeg")

    // Compare pixel data
    const convertedPixels = await sharp(extractedImages[0].data).raw().toBuffer()
    const expectedPixels = await sharp(expectedImageBuffer).raw().toBuffer()
    expect(convertedPixels).toEqual(expectedPixels)
  })

  // 2. Multiple Images Test
  it("should handle multiple images and return them in a zip", async () => {
    const mockRequest = await createMockRequest(
      [
        { name: "test-image1.png", data: testImageBuffer },
        { name: "test-image2.png", data: testImageBuffer },
      ],
      { format: "jpeg", quality: 80 }
    )

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/zip")

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(2)
    expect(extractedImages.map((img) => img.name)).toEqual(["image-1.jpeg", "image-2.jpeg"])
  })

  // 3. Different Format Test
  it("should convert to PNG with specified settings", async () => {
    const mockRequest = await createMockRequest(
      [{ name: "test-image.png", data: testImageBuffer }],
      { format: "png" }
    )

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
    expect(extractedImages[0].name).toBe("image-1.png")

    // Verify it’s a valid PNG
    const metadata = await sharp(extractedImages[0].data).metadata()
    expect(metadata.format).toBe("png")
  })

  // 4. Advanced Settings Test (e.g., Resize)
  it("should resize an image according to settings", async () => {
    const mockRequest = await createMockRequest(
      [{ name: "test-image.png", data: testImageBuffer }],
      { format: "jpeg", quality: 80, width: 50, height: 50 }
    )

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)

    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)

    const metadata = await sharp(extractedImages[0].data).metadata()
    expect(metadata.width).toBe(50)
    expect(metadata.height).toBe(50)
  })

  // 5. Error Case: No Images Provided
  it("should return an error if no images are provided", async () => {
    const mockRequest = await createMockRequest([], { format: "jpeg", quality: 80 })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400) // Assuming 400 for bad request
    const json = await response.json()
    expect(json).toHaveProperty("error")
  })

  // 6. Error Case: Invalid Settings
  it("should return an error for invalid settings", async () => {
    const mockRequest = await createMockRequest(
      [{ name: "test-image.png", data: testImageBuffer }],
      { format: "invalid", quality: 80 }
    )

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toHaveProperty("error")
  })

  // 7. Large File Test
  it("should handle a large image file", async () => {
    const largeImageBuffer = Buffer.alloc(1024 * 1024, 0) // 1MB black image
    await sharp(largeImageBuffer, { raw: { width: 1024, height: 1024, channels: 1 } })
      .png()
      .toBuffer()
      .then((buf) => (largeImageBuffer.set(buf)))

    const mockRequest = await createMockRequest(
      [{ name: "large-image.png", data: largeImageBuffer }],
      { format: "jpeg", quality: 80 }
    )

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
    const responseBuffer = Buffer.from(await response.arrayBuffer())
    const extractedImages = await extractImagesFromZip(responseBuffer)
    expect(extractedImages).toHaveLength(1)
  })
})