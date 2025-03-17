import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const URL = String(process.env.NEXT_PUBLIC_APP_URL)
  const disallowedEnvironments = ["staging", "stage", "development", "dev", "git", "local"];
  const rules = disallowedEnvironments.some(env => URL.includes(env))
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
