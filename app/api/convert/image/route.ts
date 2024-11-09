import { type ConversionSettings } from "@/lib/types"
import { rateLimit } from "@/utils/rate-limit"
import { responseHandler } from "@/utils/response-handler"
import { Redis } from "@upstash/redis"
import archiver from "archiver"
import { randomUUID } from "crypto"
import { mkdir } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import sharp from "sharp"

const redis = Redis.fromEnv()
const CACHE_TTL = 3600 // 1 hour

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

    // Generate cache key based on files and settings
    const filesHash = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer()
        return Buffer.from(buffer).toString("base64")
      })
    )
    const cacheKey = `image-conversion:${JSON.stringify({
      filesHash,
      settings,
    })}`

    // Check cache
    // const cachedResult = await redis.get(cacheKey)
    // if (cachedResult) {
    //   return new NextResponse(Buffer.from(cachedResult as string, "base64"), {
    //     headers: {
    //       "Content-Type": "application/zip",
    //       "Content-Disposition": 'attachment; filename="converted-images.zip"',
    //     },
    //   })
    // }

    const sessionId = randomUUID()
    const outputDir = join(process.cwd(), "tmp", sessionId)
    await mkdir(outputDir, { recursive: true })

    // Process images
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const image = sharp(buffer)

        if (settings.width || settings.height) {
          image.resize(settings.width, settings.height, {
            fit: settings.maintainAspectRatio ? "inside" : "fill",
          })
        }

        switch (settings.format) {
          case "webp":
            image.webp({ quality: settings.quality })
            break
          case "png":
            image.png({ quality: settings.quality })
            break
          case "jpg":
            image.jpeg({ quality: settings.quality })
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

    // Create ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } })
    const chunks: Buffer[] = []

    archive.on("data", (chunk) => chunks.push(chunk))

    processedFiles.forEach((file, index) => {
      archive.file(file, {
        name: `image-${index + 1}.${settings.format}`,
      })
    })

    await archive.finalize()

    const zipBuffer = Buffer.concat(chunks as unknown as readonly Uint8Array[])

    // Cache the result
    // await redis.set(cacheKey, zipBuffer.toString("base64"), {
    //   ex: CACHE_TTL,
    // })

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
