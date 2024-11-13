import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LINKS } from "@/configs/router.config"
import { cn } from "@/lib/utils"
import { ArrowRight, Gauge, Image, Settings, Shield, Upload, Zap } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Convert Images for Free`,
}

export default function Page() {
  const features = [
    {
      title: "Batch Processing",
      description: "Convert multiple images at once with our efficient batch processing system",
      icon: Upload,
    },
    {
      title: "Format Support",
      description: "Convert between WebP, PNG, JPG, and GIF formats with quality control",
      icon: Image,
    },
    {
      title: "Lightning Fast",
      description: "Optimized conversion engine with caching for instant results",
      icon: Zap,
    },
    {
      title: "Secure",
      description: "Your images are processed securely and deleted after conversion",
      icon: Shield,
    },
    {
      title: "Social Media Ready",
      description: "Pre-configured sizes for all major social media platforms",
      icon: Settings,
    },
    {
      title: "High Performance",
      description: "Advanced compression algorithms for optimal file sizes",
      icon: Gauge,
    },
  ]

  return (
    <>
      <section className="container pt-8 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* <div className="relative mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Image className="h-6 w-6 text-primary" />
              <div className="animate-pulse-ring absolute inset-0 rounded-full" />
            </div> */}
          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl">
            Convert Images for Free
          </h1>
          <p className="lead mb-8 text-muted-foreground">
            Professional-grade image conversion tool with support for multiple formats, batch processing, and
            advanced optimization options.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={LINKS.CONVERT.IMAGE.home}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })
              )}
            >
              Start Converting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* // + features */}
      <section className="container">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">Features</span>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="mb-4 h-6 w-6 text-primary" />
              <h5>{feature.title}</h5>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* <section className="border-t px-4 py-12 sm:px-8">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of users who trust our image converter for their needs.
            </p>
            <Link href="/image-converter">
              <Button size="lg">
                Try Image Converter
                <Image className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}
    </>
  )
}
