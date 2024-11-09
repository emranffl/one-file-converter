import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/providers/Query.Provider"
import { ThemeProvider } from "@/providers/Theme.Provider"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import "/styles/globals.scss"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Image Converter - Convert Images Online",
  description:
    "Free online tool to convert images between different formats with advanced options for quality and size.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lato.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Navbar />
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
