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
        {/* Output Format */}
        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select
            value={settings.format}
            onValueChange={(value) => onSettingsChange({ ...settings, format: value as ConversionSettings["format"] })}
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

        {/* Quality */}
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

        {/* Resize Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Maintain Aspect Ratio</Label>
            <Switch
              checked={settings.resize?.maintainAspectRatio ?? true}
              onCheckedChange={(checked) =>
                onSettingsChange({
                  ...settings,
                  resize: { ...settings.resize, maintainAspectRatio: checked },
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={settings.resize?.width || ""}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    resize: { ...settings.resize, width: e.target.value ? parseInt(e.target.value) : undefined },
                  })
                }
                placeholder="Original width"
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={settings.resize?.height || ""}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    resize: { ...settings.resize, height: e.target.value ? parseInt(e.target.value) : undefined },
                  })
                }
                placeholder="Original height"
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fit</Label>
            <Select
              value={settings.resize?.fit || "inside"}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  resize: { ...settings.resize, fit: value as "cover" | "contain" | "fill" | "inside" | "outside" },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="inside">Inside</SelectItem>
                <SelectItem value="outside">Outside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <Input
              type="text"
              value={settings.resize?.position || ""}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  resize: { ...settings.resize, position: e.target.value },
                })
              }
              placeholder="e.g., center, top, left"
            />
          </div>
        </div>

        {/* Additional Operations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Flip (Vertical)</Label>
            <Switch
              checked={settings.flip || false}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, flip: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Flop (Horizontal)</Label>
            <Switch
              checked={settings.flop || false}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, flop: checked })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Rotate</Label>
              <Switch
                checked={!!settings.rotate}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    rotate: checked ? { angle: 0, background: "transparent" } : undefined,
                  })
                }
              />
            </div>
            {settings.rotate && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Angle (°)</Label>
                  <Input
                    type="number"
                    value={settings.rotate.angle}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        rotate: { ...settings.rotate, angle: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    type="text"
                    value={settings.rotate.background || ""}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        rotate: { ...settings.rotate, background: e.target.value },
                      })
                    }
                    placeholder="e.g., #ffffff"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Blur</Label>
              <Switch
                checked={!!settings.blur}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    blur: checked ? { sigma: 0.3 } : undefined,
                  })
                }
              />
            </div>
            {settings.blur && (
              <div className="space-y-2">
                <Label>Sigma</Label>
                <Input
                  type="number"
                  value={settings.blur.sigma}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      blur: { sigma: parseFloat(e.target.value) },
                    })
                  }
                  min={0.3}
                  max={1000}
                  step={0.1}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sharpen</Label>
              <Switch
                checked={!!settings.sharpen}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    sharpen: checked ? { sigma: 1, flat: 1, jagged: 2 } : undefined,
                  })
                }
              />
            </div>
            {settings.sharpen && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Sigma</Label>
                  <Input
                    type="number"
                    value={settings.sharpen.sigma}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        sharpen: { ...settings.sharpen, sigma: parseFloat(e.target.value) },
                      })
                    }
                    min={0.3}
                    max={1000}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Flat</Label>
                  <Input
                    type="number"
                    value={settings.sharpen.flat || ""}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        sharpen: { ...settings.sharpen, flat: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jagged</Label>
                  <Input
                    type="number"
                    value={settings.sharpen.jagged || ""}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        sharpen: { ...settings.sharpen, jagged: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
