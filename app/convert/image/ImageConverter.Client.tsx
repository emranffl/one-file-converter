"use client"

import { ImagePreviewer } from "@/app/convert/Components/ImagePreviewer.Client.tsx"
import { ImageSettings } from "@/app/convert/Components/ImageSettings.Client"
import { SocialMediaPresets } from "@/app/convert/Components/SocialMediaPresets.Client"
import { Button } from "@/components/ui/button"
import { PATHS } from "@/configs/router.config"
import { ConversionSettings, conversionSettingsSchema } from "@/lib/schemas/image-conversion-request"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { ImagePlus, RefreshCw, Upload } from "lucide-react"
import { Line } from "rc-progress"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

const MAX_FILES = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function ImageConverter() {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [settings, setSettings] = useState<ConversionSettings>({
    format: "webp",
    quality: 80,
    width: undefined,
    height: undefined,
    maintainAspectRatio: true,
  })

  const validateSettings = () => {
    const result = conversionSettingsSchema.safeParse(settings)
    if (!result.success) {
      toast.error(result.error.errors.map((err) => err.message).join(", "))
      return false
    }
    return true
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles
        .filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE)
        .slice(0, MAX_FILES - files.length)

      if (validFiles.length !== acceptedFiles.length) {
        toast.error(`Some files were rejected. Maximum ${MAX_FILES} files, ${MAX_FILE_SIZE / 1024 / 1024}MB each.`)
      }

      setFiles((prev) => [...prev, ...validFiles])
    },
    [files.length]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
  })

  const convertMutation = useMutation({
    mutationFn: async () => {
      if (!validateSettings()) return

      const formData = new FormData()
      files.forEach((file) => formData.append("images", file))
      formData.append("settings", JSON.stringify(settings))

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", PATHS.CONVERT.IMAGE.root, true)

        // Set up progress event listener for upload
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setProgress(percentComplete) // Update the progress state
          }
        }

        // Handle the response
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response)
          } else {
            try {
              const error = JSON.parse(xhr.responseText)
              reject(new Error(error.message || "Conversion failed"))
            } catch {
              reject(new Error("Conversion failed"))
            }
          }
        }

        // Handle network errors
        xhr.onerror = () => reject(new Error("Network error occurred"))

        // Send the form data
        xhr.responseType = "blob"
        xhr.send(formData)
      })
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob as Blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `converted-images.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Images converted successfully!")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to convert images")
    },
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop up to {MAX_FILES} images here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground">Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <ImagePreviewer key={index} file={file} onRemove={() => removeFile(index)} />
            ))}
          </div>
          <SocialMediaPresets onPresetSelect={(preset) => setSettings({ ...settings, ...preset })} />

          <ImageSettings settings={settings} onSettingsChange={setSettings} />

          {convertMutation.isPending && (
            <Line
              percent={progress}
              strokeWidth={0.75}
              strokeColor="hsl(var(--foreground))"
              trailColor="hsl(var(--muted))"
            />
          )}

          <div className="flex justify-end gap-4">
            <Button onClick={() => setFiles([])} variant="outline" disabled={convertMutation.isPending}>
              Clear All
            </Button>
            <Button onClick={() => convertMutation.mutate()} disabled={convertMutation.isPending}>
              {convertMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Converting {files.length} {files.length === 1 ? "image" : "images"}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Convert {files.length} {files.length === 1 ? "image" : "images"}
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
