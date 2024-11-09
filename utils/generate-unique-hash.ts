import { ConversionSettings } from "@/lib/types"
import { createHash } from "crypto"

export function generateUniqueHash(filesHash: string[], settings: ConversionSettings): string {
  const hash = createHash("sha1")
  hash.update(JSON.stringify({ filesHash, settings }))
  return hash.digest("hex").slice(0, 20) // Limit to 20 characters
}
