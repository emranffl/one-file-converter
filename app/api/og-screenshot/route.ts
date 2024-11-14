import { NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"

export async function GET(req: NextRequest) {
  // Launch the Playwright browser
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const view = req.nextUrl.searchParams.get("view") || "/"

  // Navigate to the specified URL
  await page.goto(process.env.NEXT_PUBLIC_APP_URL! + view, {
    waitUntil: "networkidle",
  })

  // Set viewport dimensions
  await page.setViewportSize({ width: 1200, height: 630 })

  // Capture the screenshot as a buffer
  const imageBuffer = await page.screenshot({ type: "jpeg" })

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
