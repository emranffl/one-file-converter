import { CONSTANTS } from "@/lib/constants"
import { type ConversionSettings } from "@/lib/types"
import { rateLimit } from "@/utils/rate-limit"
import { responseHandler } from "@/utils/response-handler"
import archiver from "archiver"
import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

// Extend ConversionSettings to include "jpeg"
type ExtendedConversionSettings = ConversionSettings & { format?: "webp" | "png" | "jpeg" | "gif" }

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
    const settings = JSON.parse(formData.get("settings") as string) as ExtendedConversionSettings

    if (!files.length) {
      return responseHandler({
        error: "Bad Request",
        message: "No images were provided for conversion",
        status: 400,
      })
    }

    const archive = archiver("zip", { zlib: { level: 9 } })

    const quality = settings.quality || CONSTANTS.IMAGE_PROCESSING.QUALITY

    for (const [index, file] of files.entries()) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const image = sharp(buffer)

      if (settings.width || settings.height) {
        image.resize(settings.width, settings.height, {
          fit: settings.maintainAspectRatio ? "inside" : "fill",
        })
      }

      let outputFormat = settings.format || CONSTANTS.CONVERSION.DEFAULT_FORMAT
      // if (outputFormat === "jpg") outputFormat = "jpeg"

      const processedBuffer = await image[outputFormat]({ quality }).toBuffer()
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
