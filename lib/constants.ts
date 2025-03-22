import { ConversionSettings } from "./schemas/image-conversion-request"

interface Preset {
  title: string
  width: number
  height: number
  format: ConversionSettings["format"]
}
interface SocialMediaPreset {
  name: string
  presets: Preset[]
}

export type SocialMediaPresets = SocialMediaPreset[]

const SOCIAL_MEDIA_PRESETS: SocialMediaPresets = [
  {
    name: "Facebook",
    presets: [
      { title: "Facebook Cover", width: 851, height: 315, format: "jpeg" },
      { title: "Facebook Landscape Post", width: 1200, height: 630, format: "jpeg" },
      { title: "Facebook Portrait Post", width: 630, height: 1200, format: "jpeg" },
      { title: "Facebook Profile Photo", width: 170, height: 170, format: "jpeg" },
    ],
  },
  {
    name: "Instagram",
    presets: [
      { title: "Instagram Square", width: 1080, height: 1080, format: "jpeg" },
      { title: "Instagram Portrait", width: 1080, height: 1350, format: "jpeg" },
      { title: "Instagram Story", width: 1080, height: 1920, format: "jpeg" },
      { title: "Instagram Profile Photo", width: 320, height: 320, format: "jpeg" },
    ],
  },
  {
    name: "Twitter",
    presets: [
      { title: "Twitter Landscape Post", width: 1600, height: 900, format: "jpeg" },
      { title: "Twitter Portrait Post", width: 1080, height: 1350, format: "jpeg" },
      { title: "Twitter Cover Photo", width: 1500, height: 500, format: "jpeg" },
      { title: "Twitter Profile Photo", width: 400, height: 400, format: "jpeg" },
    ],
  },
  {
    name: "LinkedIn",
    presets: [
      { title: "LinkedIn Landscape Post", width: 1200, height: 628, format: "jpeg" },
      { title: "LinkedIn Portrait Post", width: 628, height: 1200, format: "jpeg" },
      { title: "LinkedIn Cover Photo", width: 1128, height: 191, format: "jpeg" },
      { title: "LinkedIn Profile Photo", width: 400, height: 400, format: "jpeg" },
    ],
  },
  {
    name: "TikTok",
    presets: [
      { title: "TikTok Landscape Post", width: 1920, height: 1080, format: "jpeg" },
      { title: "TikTok Portrait Post", width: 1080, height: 1920, format: "jpeg" },
      { title: "TikTok Story", width: 1080, height: 1920, format: "jpeg" },
      { title: "TikTok Profile Photo", width: 200, height: 200, format: "jpeg" },
    ],
  },
]

export const CONSTANTS = {
  // + Filesystem settings
  FILESYSTEM: {
    IMAGE: {
      OUTPUT_DIR: "tmp/images", // Output directory for processed images
    },
  },
  // + Image processing settings
  IMAGE_PROCESSING: {
    CONVERSION: {
      DEFAULT_FORMAT: "webp", // Default image format
    },
    FORMATS: {
      // ["avif", "gif", "heif", "jp2", "jpeg", "jxl", "png", "tiff", "webp"]
      DEFAULT: ["avif", "gif", "heif", "jp2", "jpeg", "jxl", "png", "tiff", "webp"],
      SUPPORTED: ["avif", "gif", "jpeg", "png", "tiff", "webp"],
      UNSUPPORTED: ["heif", "jp2", "jxl"],
    },
    SOCIAL_MEDIA_PRESETS,
    // MAX_SIZE: 5000, // Max image size in KB
    QUALITY: 80, // Default image quality
  },
  // + Rate limiting settings
  RATE_LIMIT: {
    WINDOW: 60, // 60 seconds
    MAX: 10, // Max 10 requests per second
  },
} as const
