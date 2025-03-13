// export interface ConversionSettings {
//   format: "webp" | "png" | "jpeg" | "gif"
//   quality: number
//   width?: number
//   height?: number
//   maintainAspectRatio: boolean
//   preset?: SocialMediaPreset
// }

import { ConversionSettings } from "./schemas/image-conversion-request"

export interface SocialMediaPreset {
  name: string
  width: number
  height: number
  format: ConversionSettings["format"]
}

export const SOCIAL_MEDIA_PRESETS: Record<string, SocialMediaPreset> = {
  "instagram-square": {
    name: "Instagram Square",
    width: 1080,
    height: 1080,
    format: "jpeg",
  },
  "instagram-portrait": {
    name: "Instagram Portrait",
    width: 1080,
    height: 1350,
    format: "jpeg",
  },
  "twitter-post": {
    name: "Twitter Post",
    width: 1200,
    height: 675,
    format: "jpeg",
  },
  "facebook-cover": {
    name: "Facebook Cover",
    width: 1640,
    height: 624,
    format: "jpeg",
  },
  "linkedin-post": {
    name: "LinkedIn Post",
    width: 1200,
    height: 627,
    format: "jpeg",
  },
}
