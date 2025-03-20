import Footer from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"
import { SEO } from "@/configs/seo.config"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/providers/Query.Provider"
import { ThemeProvider } from "@/providers/Theme.Provider"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { headers } from "next/headers"
import "../styles/globals.scss"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...SEO,
    // dynamically get the host from the Next headers
    metadataBase: new URL(`https://${(await headers()).get("host")}`),
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(lato.className, "flex min-h-screen flex-col")} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
