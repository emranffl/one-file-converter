import { ImageConverter } from "@/app/convert/image/ImageConverter.Client"
import SectionHeader from "@/components/commons/SectionHeader"

export default function Page() {
  return (
    <>
      <section className="container px-4 py-8 sm:px-8 sm:py-12">
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
