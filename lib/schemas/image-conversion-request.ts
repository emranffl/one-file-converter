import { z } from "zod"

// Define the schema for conversion settings
export const conversionSettingsSchema = z.object({
  format: z
    .enum([
      'dz', 'fits', 'gif', 'heif', 'jp2k', 'jpeg', 'jxl', 'magick', 'openslide', 'pdf', 'png', 'ppm', 'raw', 'svg', 'tiff', 'vips', 'webp',
    ])
    .optional()
    .default("webp"),
  quality: z.number().min(1).max(100).default(80),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  maintainAspectRatio: z.boolean().default(true),
})

// Define the schema for the request payload
export const imageConversionRequestSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  settings: conversionSettingsSchema,
})

export type ConversionSettings = z.infer<typeof conversionSettingsSchema>
