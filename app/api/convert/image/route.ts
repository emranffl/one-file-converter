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
    const { images, settings: validSettings } = parsedData.data

    for (const [index, file] of images.entries()) {
      const buffer = Buffer.from(await file.arrayBuffer())
      let image = sharp(buffer)

      // Apply rotation if specified
      if (validSettings.rotate) {
        image = image.rotate(validSettings.rotate.angle, {
          background: validSettings.rotate.background,
        })
      }

      // Apply flip (vertical) if specified
      if (validSettings.flip) {
        image = image.flip()
      }

      // Apply flop (horizontal) if specified
      if (validSettings.flop) {
        image = image.flop()
      }

      // Apply resize if specified
      if (validSettings.resize) {
        const resizeOptions: sharp.ResizeOptions = {
          width: validSettings.resize.width,
          height: validSettings.resize.height,
          fit: validSettings.resize.fit || (validSettings.resize.maintainAspectRatio ? "inside" : "fill"),
          position: validSettings.resize.position,
        }
        image = image.resize(resizeOptions)
      }

      // Apply blur if specified
      if (validSettings.blur) {
        image = image.blur(validSettings.blur.sigma)
      }

      // Apply sharpen if specified
      if (validSettings.sharpen) {
        image = image.sharpen(validSettings.sharpen.sigma, validSettings.sharpen.flat, validSettings.sharpen.jagged)
      }

      // Add more operations here (e.g., image.grayscale(), image.tint(), etc.)

      type FormatOptions = Record<string, Parameters<typeof image.toFormat>[1]>
      // Handle output format and quality
      const outputFormat = validSettings.format || CONSTANTS.CONVERSION.DEFAULT_FORMAT
      const unsupportedFormats = CONSTANTS.FORMATS.UNSUPPORTED as unknown as string[]
      if (unsupportedFormats.includes(outputFormat)) {
        throw new Error(`Format '${outputFormat}' is not supported in this environment`)
      }

      const formatOptions: FormatOptions = {
        avif: { quality: validSettings.quality },
        gif: { quality: validSettings.quality },
        heif: { quality: validSettings.quality, compression: "hevc" },
        jpeg: { quality: validSettings.quality },
        jp2: { quality: validSettings.quality },
        jxl: { quality: validSettings.quality },
        png: { quality: validSettings.quality },
        tiff: { quality: validSettings.quality },
        webp: { quality: validSettings.quality },
      }

      const processedBuffer = await image.toFormat(outputFormat, formatOptions[outputFormat] || {}).toBuffer()
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
