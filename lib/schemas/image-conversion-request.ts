import { z } from "zod"
import { CONSTANTS } from "../constants"

// Define the schema for conversion settings
export const conversionSettingsSchema = z.object({
  blur: z
    .object({
      sigma: z.number().min(0.3).max(1000),
    })
    .optional(),
  flip: z.boolean().optional(),
  flop: z.boolean().optional(),
  format: z.enum(CONSTANTS.FORMATS.DEFAULT).optional().default("webp"),
  height: z.number().min(1).optional(),
  maintainAspectRatio: z.boolean().default(true),
  quality: z.number().min(1).max(100).default(80),
  resize: z
    .object({
      width: z.number().min(1).optional(),
      height: z.number().min(1).optional(),
      maintainAspectRatio: z.boolean().default(true).optional(),
      fit: z.enum(["cover", "contain", "fill", "inside", "outside"]).optional(),
      position: z.string().optional(),
    })
    .optional(),
  rotate: z
    .object({
      angle: z.number().optional(),
      background: z.string().optional(),
    })
    .optional(),
  sharpen: z
    .object({
      sigma: z.number().min(0.3).max(1000).optional(),
      flat: z.number().optional(),
      jagged: z.number().optional(),
    })
    .optional(),
  width: z.number().min(1).optional(),
  // Add more Sharp operations as needed (e.g., grayscale, tint, etc.)
})

// Define the schema for the request payload
export const imageConversionRequestSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  settings: conversionSettingsSchema,
})

export type ConversionSettings = z.infer<typeof conversionSettingsSchema>
