export const CONSTANTS = {
  // + Rate limiting settings
  RATE_LIMIT: {
    WINDOW: 60, // 60 seconds
    MAX: 10, // Max 10 requests per second
  },
  // + Image processing settings
  IMAGE_PROCESSING: {
    QUALITY: 80, // Default image quality
    // MAX_SIZE: 5000, // Max image size in KB
  },
  // + Filesystem settings
  FILESYSTEM: {
    IMAGE: {
      OUTPUT_DIR: "tmp/images", // Output directory for processed images
    },
  },
  // + Conversion settings
  CONVERSION: {
    DEFAULT_FORMAT: "webp", // Default image format
  },
  // + Formats
  FORMATS: {
    // ["avif", "gif", "heif", "jp2", "jpeg", "jxl", "png", "tiff", "webp"]
    DEFAULT: ["avif", "gif", "heif", "jp2", "jpeg", "jxl", "png", "tiff", "webp"],
    SUPPORTED: ["avif", "gif", "jpeg", "png", "tiff", "webp"],
    UNSUPPORTED: ["heif", "jp2", "jxl"],
  },
} as const
