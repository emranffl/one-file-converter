import chrome from "chrome-aws-lambda"
import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core"

export async function GET(req: NextRequest) {
  // Launch the Playwright browser
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
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
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  const view = req.nextUrl.searchParams.get("view") || "/"

  // Navigate to the specified URL
  await page.goto(process.env.NEXT_PUBLIC_APP_URL! + view, {
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

  // Close the browser
  await browser.close()

  // Return the screenshot buffer in a NextResponse with correct headers
  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": 'inline; filename="og-image.webp"',
    },
  })
}
