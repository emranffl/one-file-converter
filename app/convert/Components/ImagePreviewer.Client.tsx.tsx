"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export function ImagePreviewer({ file, onRemove }: ImagePreviewProps) {
  return (
    <Card className="relative overflow-hidden">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
      <div className="relative aspect-square">
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          fill
          className="object-cover"
          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
        />
      </div>
      <div className="p-4">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
    </Card>
  )
}
