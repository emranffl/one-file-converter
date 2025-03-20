"use client"

import { LINKS } from "@/configs/router.config"
import { cn } from "@/lib/utils"
import { Inter, Playfair_Display } from "next/font/google"
import Link from "next/link"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "700"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "700"],
  display: "swap",
})

const Logo = ({ href = LINKS.home, width = 150 }: { href?: string; width?: number }) => {
  return (
    <Link href={href}>
      <svg width={width} height="250" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
        <polygon className="fill-blue-700" points="50,10 70,30 50,50 30,30" />
        <polygon className="fill-blue-700" points="70,50 90,70 70,90 50,70" />
        <polygon className="fill-blue-700" points="90,10 110,30 90,50 70,30" />

        <text
          x="130"
          y="45"
          className={cn("fill-teal-700 text-4xl font-bold dark:fill-foreground", playfairDisplay.className)}
        >
          One File
        </text>
        <text x="130" y="75" className={cn("fill-teal-700 text-2xl dark:fill-foreground", inter.className)}>
          Converter
        </text>
      </svg>
    </Link>
  )
}

export { Logo }
