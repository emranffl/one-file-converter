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
    // MAX_SIZE: 5000, // Max image size in KB
    QUALITY: 80, // Default image quality
  },
  // + Rate limiting settings
  RATE_LIMIT: {
    WINDOW: 60, // 60 seconds
    MAX: 10, // Max 10 requests per second
  },
} as const
