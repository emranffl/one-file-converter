import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const rules =
    String(process.env.NEXT_PUBLIC_APP_URL).includes("staging") ||
    String(process.env.NEXT_PUBLIC_APP_URL).includes("stage")
      ? { disallow: "*" }
      : { allow: "*" }
  return {
    rules: {
      userAgent: "*",
      ...rules,
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL as string}/sitemap.xml`,
  }
}
