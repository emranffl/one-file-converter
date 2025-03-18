import ROBOTS_TXT from "@/app/robots"
import { Metadata } from "next"

// @ts-ignore
const ALLOW_ROBOTS = ROBOTS_TXT().rules?.allow

const TITLE = {
  /**
   * `title.template` can be used to add a prefix or a suffix
   * to title's defined in child route segments
   */
  template: `%s • ${process.env.NEXT_PUBLIC_APP_NAME}`,
  /**
   * `title.default` can be used to provide a fallback title
   * to child route segments that don't define a title
   */
  default: `${process.env.NEXT_PUBLIC_APP_NAME}`,
}
const DESCRIPTION = String(process.env.NEXT_PUBLIC_SEO_DESCRIPTION)

export const SEO: Metadata = {
  authors: {
    name: "Emran Hossain",
    url: "https://emranffl.com",
  },
  category: "website",
  creator: "@emranffl",
  description: DESCRIPTION,
  keywords: String(process.env.NEXT_PUBLIC_SEO_KEYWORDS)
    .split("|")
    .map((str: string) => str.trim()),
  metadataBase: new URL(String(process.env.NEXT_PUBLIC_APP_URL)),
  openGraph: {
    countryName: "Bangladesh",
    description: DESCRIPTION,
    locale: "en_US",
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    title: TITLE,
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: {
      url: `/api/og-screenshot?view=/`,
      alt: `${process.env.NEXT_PUBLIC_APP_NAME} OG image`,
      width: 1280,
      height: 720,
    },
  },
  robots: ALLOW_ROBOTS ? "index, follow" : "noindex, nofollow",
  title: TITLE,
  twitter: {
    card: "summary_large_image",
    creator: "@emranffl",
    description: DESCRIPTION,
    title: TITLE,
    images: {
      url: `/api/og-screenshot?view=/`,
      alt: `${process.env.NEXT_PUBLIC_APP_NAME} Twitter image`,
      width: 1280,
      height: 720,
    },
  },
  verification: {
    other: {
      "google-adsense-account": "ca-pub-5556640164844079",
    },
  },
}
