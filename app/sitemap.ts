import { LINKS } from "@/configs/router.config"
import { execSync } from "child_process"
import { statSync } from "fs"
import { MetadataRoute } from "next"
import { join } from "path"

// Function to recursively collect all internal routes from the LINKS object
function collectInternalRoutes(obj: any): string[] {
  let routes: string[] = []
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      // Only include routes that start with "/" (internal routes)
      if (obj[key].startsWith("/")) {
        routes.push(obj[key])
      }
    } else if (typeof obj[key] === "object") {
      // Recursively collect routes from nested objects
      routes = routes.concat(collectInternalRoutes(obj[key]))
    }
  }
  return routes
}

// Function to get the last modification date of a file
function getLastModifiedDate(filePath: string): Date {
  try {
    // Attempt to get the last commit date from Git
    const command = `git log -1 --format=%cd --date=iso-strict ${filePath}`
    const gitDate = execSync(command).toString().trim()
    if (gitDate) {
      return new Date(gitDate)
    }
  } catch (error) {
    console.warn(`Git not available or file not tracked for ${filePath}. Using file metadata instead.`)
  }

  // Fallback to file system metadata
  try {
    const stats = statSync(filePath)
    return stats.mtime // Last modified time from the file system
  } catch (error) {
    console.warn(`Could not access file metadata for ${filePath}:`, error)
    return new Date() // Default to current date if all else fails
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL as string
  // Get all internal routes from LINKS
  const internalRoutes = collectInternalRoutes(LINKS)

  return internalRoutes.map((route) => {
    const filePath = join("app", route === "/" ? "page.ts" : `${route}/page.ts`)
    const lastModified = getLastModifiedDate(filePath)

    return {
      url: baseUrl + route,
      lastModified,
      priority: route === "/" ? 1 : 0.8,
    }
  })
}
