import { responseHandler } from "@/utils/response-handler"
import chrome from "chrome-aws-lambda"
import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core"

export async function GET(req: NextRequest) {
  let browser = null

  try {
    // Use chrome-aws-lambda in serverless environments
    const options = process.env.AWS_REGION
      ? {
          args: chrome.args,
          executablePath: (await chrome.executablePath) || "/usr/bin/google-chrome",
          headless: chrome.headless,
          userDataDir: "/tmp/chrome-user-data",
        }
      : {
          args: [],
          executablePath:
            process.platform === "win32"
              ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
              : process.platform === "linux"
                ? "/usr/bin/google-chrome"
                : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        }

    // Launch Puppeteer
    browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    const view = req.nextUrl.searchParams.get("view") || "/"

    // Navigate to the specified URL
    await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}${view}`, {
      waitUntil: "networkidle2",
    })

    // Set viewport dimensions
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1, isMobile: false })

    // Capture the screenshot as a buffer
    const imageBuffer = (await page.screenshot({
      type: "jpeg",
      clip: {
        width: 1200,
        height: 630,
        x: 0,
        y: 0,
      },
    })) as Buffer

    // Return the screenshot buffer in a NextResponse with correct headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": 'inline; filename="og-image.jpeg"',
      },
    })
  } catch (error) {
    console.error("Error taking screenshot:", error)

    return responseHandler({
      status: 500,
      error: "Internal Server Error",
      message: (error as Error).message,
      stack: (error as Error).stack,
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
