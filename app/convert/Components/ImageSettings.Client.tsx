"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { type ConversionSettings } from "@/lib/schemas/image-conversion-request"

interface ImageSettingsProps {
  settings: ConversionSettings
  onSettingsChange: (settings: ConversionSettings) => void
}

export function ImageSettings({ settings, onSettingsChange }: ImageSettingsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select
            value={settings.format}
            onValueChange={(value) =>
              onSettingsChange({ ...settings, format: value as ConversionSettings["format"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quality ({settings.quality}%)</Label>
          <Slider
            value={[settings.quality]}
            min={1}
            max={100}
            step={1}
            onValueChange={([value]) => onSettingsChange({ ...settings, quality: value })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Maintain Aspect Ratio</Label>
            <Switch
              checked={settings.maintainAspectRatio}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, maintainAspectRatio: checked })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={settings.width || ""}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    width: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Original width"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={settings.height || ""}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    height: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Original height"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
