import { CONSTANTS } from "@/lib/constants"
import { type ConversionSettings } from "@/lib/types"
import { generateUniqueHash } from "@/utils/generate-unique-hash"
import { rateLimit } from "@/utils/rate-limit"
import { responseHandler } from "@/utils/response-handler"
import archiver from "archiver"
import { randomUUID } from "crypto"
import { mkdir, readFile, stat } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    // + Apply rate limiting
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

    if (!files.length) {
      return responseHandler({
        error: "Bad Request",
        message: "No images were provided for conversion",
        status: 400,
      })
    }

    const filesHash = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer()
        return Buffer.from(buffer).toString("base64")
      })
    )
    // Generate unique path based on image properties
    const uniquePath = generateUniqueHash(filesHash, settings)
    const outputDir = join(process.cwd(), CONSTANTS.FILESYSTEM.IMAGE.OUTPUT_DIR, uniquePath)
    const zipPath = join(outputDir, `converted-images.zip`)

    // + Check if the zip file already exists
    try {
      await stat(zipPath)
      const zipBuffer = await readFile(zipPath)
      console.info("Zip file exists, returning cached file...")

      return new NextResponse(zipBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": 'attachment; filename="converted-images.zip"',
        },
      })
    } catch {
      // + Continue processing if zip does not exist
      console.info("Zip file does not exist, processing images...")
    }

    await mkdir(outputDir, { recursive: true })

    // + Process images
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const image = sharp(buffer)
        const quality = settings.quality || CONSTANTS.IMAGE_PROCESSING.QUALITY

        if (settings.width || settings.height) {
          image.resize(settings.width, settings.height, {
            fit: settings.maintainAspectRatio ? "inside" : "fill",
          })
        }

        switch (settings.format || CONSTANTS.CONVERSION.DEFAULT_FORMAT) {
          case "webp":
            image.webp({ quality: quality })
            break
          case "png":
            image.png({ quality: quality })
            break
          case "jpg":
            image.jpeg({ quality: quality })
            break
          case "gif":
            image.gif()
            break
        }

        const outputPath = join(outputDir, `${randomUUID()}.${settings.format}`)
        await image.toFile(outputPath)
        return outputPath
      })
    )

    // + Create ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } })
    archive.pipe(require("fs").createWriteStream(zipPath))

    processedFiles.forEach((file, index) => {
      archive.file(file, {
        name: `image-${index + 1}.${settings.format}`,
      })
    })

    await archive.finalize()

    // Read and send the ZIP file
    const zipBuffer = await readFile(zipPath)
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
