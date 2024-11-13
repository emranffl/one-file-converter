import { ImageConverter } from "@/app/convert/image/ImageConverter.Client"
import SectionHeader from "@/components/commons/SectionHeader"
import { LINKS } from "@/configs/router.config"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Image Converter",
  description:
    "Experience fast and reliable image conversions with our online tool. Convert images to various formats such as PNG, WEBP, JPG, and GIF while maintaining quality and aspect ratio.",
  openGraph: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.CONVERT.IMAGE.home}`,
    },
  },
  twitter: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.CONVERT.IMAGE.home}`,
    },
  },
}

export default function Page() {
  return (
    <>
      <section className="container">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* <div className="mb-8 text-left">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Convert Your Images</h2>
            <p className="text-muted-foreground">
              Upload images and convert them to different formats with advanced options
            </p>
          </div> */}
          <SectionHeader
            title="Convert Your Images"
            desc="Upload images and convert them to different formats with advanced options"
            renderAs="h3"
            balance
          />
          <ImageConverter />
        </div>
      </section>
    </>
  )
}
