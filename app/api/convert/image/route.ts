import { CONSTANTS } from "@/lib/constants"
import { ConversionSettings, imageConversionRequestSchema } from "@/lib/schemas/image-conversion-request"
import { rateLimit } from "@/utils/rate-limit"
import { responseHandler } from "@/utils/response-handler"
import archiver from "archiver"
import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const allowed = await rateLimit(request)
    if (!allowed) {
      return responseHandler({
        error: "Too many requests",
        message: "Server is busy, please try again later",
        status: 429,
      })
    }
    const formData = await request.formData()
    const files = formData.getAll("images") as File[]
    const settings = JSON.parse(formData.get("settings") as string) as ConversionSettings

    // Validate payload
    const parsedData = imageConversionRequestSchema.safeParse({
      images: files,
      settings,
    })

    if (!parsedData.success) {
      return responseHandler({
        error: "Validation Error",
        message: parsedData.error.errors.map((err) => err.message).join(", "),
        status: 400,
      })
    }
    const archive = archiver("zip", { zlib: { level: 9 } })

    const quality = settings.quality || CONSTANTS.IMAGE_PROCESSING.QUALITY

    const { images, settings: validSettings } = parsedData.data
    for (const [index, file] of images.entries()) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const image = sharp(buffer)

      if (validSettings.width || validSettings.height) {
        image.resize(validSettings.width, validSettings.height, {
          fit: validSettings.maintainAspectRatio ? "inside" : "fill",
        })
      }

      let outputFormat = validSettings.format || CONSTANTS.CONVERSION.DEFAULT_FORMAT

      let processedBuffer: Buffer
      switch (outputFormat) {
        case "dz":
        case "fits":
        case "jp2k":
        case "magick":
        case "openslide":
        case "pdf":
        case "ppm":
        case "svg":
        case "raw":
        case "vips":
          throw new Error(`Unsupported output format: ${outputFormat}`)
        default:
          processedBuffer = await image[outputFormat]({ quality }).toBuffer()
      }
      archive.append(processedBuffer, { name: `image-${index + 1}.${outputFormat}` })
    }

    archive.finalize()

    const streamToResponse = new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      archive.on("data", (chunk) => chunks.push(chunk))
      archive.on("end", () => resolve(Buffer.concat(chunks as unknown as Uint8Array[])))
      archive.on("error", (error) => reject(error))
    })

    const zipBuffer = await streamToResponse

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="converted-images.zip"',
      },
    })
  } catch (error) {
    console.error("Conversion error: ", error)
    return responseHandler({
      error: "Failed to convert images",
      status: 500,
      message: (error as Error).message,
      stack: (error as Error).stack,
    })
  }
}
