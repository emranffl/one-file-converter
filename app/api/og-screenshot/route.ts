import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function GET(req: NextRequest) {
  // Launch the Puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()
  const view = req.nextUrl.searchParams.get("view") || "/"

  // Navigate to the specified URL
  await page.goto(process.env.NEXT_PUBLIC_APP_URL! + view, {
    waitUntil: "networkidle2",
  })

  // Set viewport dimensions
  await page.setViewport({ width: 1200, height: 630 })

  // Capture the screenshot as a buffer
  const imageBuffer = await page.screenshot({ type: "webp" })

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
