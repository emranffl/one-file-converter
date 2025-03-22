"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONSTANTS } from "@/lib/constants"
import { ConversionSettings } from "@/lib/schemas/image-conversion-request"

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
      {/* <pre className="whitespace-pre-wrap">{JSON.stringify({ data: SOCIAL_MEDIA_PRESETS }, null, 2)}</pre> */}
      <CardContent>
        <div className="grid gap-12">
          {CONSTANTS.IMAGE_PROCESSING.SOCIAL_MEDIA_PRESETS.sort((a, b) => a.name.localeCompare(b.name)).map(
            ({ name, presets }) => (
              <div key={name} className="grid gap-4">
                <h4>{name}</h4>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {presets
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((preset, key) => (
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
                        <h6>{preset.title}</h6>
                        <p>
                          {preset.width} x {preset.height}
                        </p>
                      </Button>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
