"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversionSettings } from "@/lib/schemas/image-conversion-request"
import { SOCIAL_MEDIA_PRESETS } from "@/lib/types"

interface SocialMediaPresetsProps {
  onPresetSelect: (settings: Partial<ConversionSettings>) => void
}

export function SocialMediaPresets({ onPresetSelect }: SocialMediaPresetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Presets</CardTitle>
        <CardDescription>Quick settings for popular social media platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SOCIAL_MEDIA_PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant="outline"
              className="h-auto flex-col items-start p-4 text-left"
              onClick={() =>
                onPresetSelect({
                  format: preset.format,
                  resize: {
                    width: preset.width,
                    height: preset.height,
                    maintainAspectRatio: false,
                  },
                })
              }
            >
              <div className="text-sm font-semibold">{preset.name}</div>
              <div className="text-xs text-muted-foreground">
                {preset.width} x {preset.height}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
