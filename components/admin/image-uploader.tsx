'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImageCropModal } from '@/components/admin/image-crop-modal'
import type { ProjectImage } from '@/lib/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

interface Props {
  projectId: string
  existing: ProjectImage[]
  onUpdate: (images: ProjectImage[]) => void
}

export function ImageUploader({ projectId, existing, onUpdate }: Props) {
  const [images, setImages] = useState<ProjectImage[]>(existing)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Crop queue: each selected file passes through the crop modal before upload.
  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [cropIdx, setCropIdx] = useState(0)
  const cropResults = useRef<File[]>([])

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError('')
    const valid: File[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds 10 MB limit`)
        continue
      }
      valid.push(file)
    }
    if (valid.length === 0) return
    cropResults.current = []
    setCropIdx(0)
    setCropQueue(valid)
  }

  function resolveCrop(result: File) {
    cropResults.current.push(result)
    const next = cropIdx + 1
    if (next >= cropQueue.length) {
      const results = cropResults.current
      setCropQueue([])
      setCropIdx(0)
      void uploadFiles(results)
    } else {
      setCropIdx(next)
    }
  }

  function cancelCrop() {
    setCropQueue([])
    setCropIdx(0)
    cropResults.current = []
  }

  async function uploadFiles(files: File[]) {
    setUploading(true)
    const newImages: ProjectImage[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(path)

      const { data: imgRecord, error: dbError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          storage_path: path,
          url: publicUrl,
          display_order: images.length + newImages.length,
          is_primary: images.length + newImages.length === 0,
        })
        .select()
        .single()

      if (dbError) {
        setError(`DB error: ${dbError.message}`)
        continue
      }

      newImages.push(imgRecord as ProjectImage)
    }

    const updated = [...images, ...newImages]
    setImages(updated)
    onUpdate(updated)
    setUploading(false)
  }

  async function handleDelete(img: ProjectImage) {
    await supabase.storage.from('project-images').remove([img.storage_path])
    await supabase.from('project_images').delete().eq('id', img.id)

    const reordered = images
      .filter((i) => i.id !== img.id)
      .map((i, idx) => ({ ...i, display_order: idx, is_primary: idx === 0 }))

    if (reordered.length > 0) {
      await supabase.from('project_images').upsert(
        reordered.map(({ id, display_order, is_primary }) => ({ id, display_order, is_primary }))
      )
    }

    setImages(reordered)
    onUpdate(reordered)
  }

  async function moveImage(idx: number, dir: -1 | 1) {
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= images.length) return

    const updated = [...images]
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
    const reordered = updated.map((img, i) => ({ ...img, display_order: i, is_primary: i === 0 }))

    await supabase.from('project_images').upsert(
      reordered.map(({ id, display_order, is_primary }) => ({ id, display_order, is_primary }))
    )

    setImages(reordered)
    onUpdate(reordered)
  }

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group">
              <div className={`relative w-28 h-20 overflow-hidden border-2 ${img.is_primary ? 'border-accent' : 'border-gray-200'}`}>
                <Image src={img.url} alt="" fill className="object-cover" sizes="112px" />
                {img.is_primary && (
                  <span className="absolute bottom-0 left-0 right-0 bg-accent/80 text-white text-[9px] text-center py-0.5 uppercase tracking-wider">
                    Main
                  </span>
                )}
              </div>
              <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                {idx > 0 && (
                  <button type="button" onClick={() => moveImage(idx, -1)}
                    className="w-5 h-5 bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black"
                    title="Move left">←</button>
                )}
                {idx < images.length - 1 && (
                  <button type="button" onClick={() => moveImage(idx, 1)}
                    className="w-5 h-5 bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black"
                    title="Move right">→</button>
                )}
                <button type="button" onClick={() => handleDelete(img)}
                  className="w-5 h-5 bg-red-600/90 text-white text-xs flex items-center justify-center hover:bg-red-700"
                  title="Delete">×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="border-2 border-dashed border-gray-300 hover:border-accent/50 p-6 text-center cursor-pointer transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
        {uploading ? (
          <p className="text-sm text-gray-500">Uploading…</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-1">Drag & drop images or click to browse</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 10 MB · First image becomes main photo · Crop on upload</p>
          </>
        )}
      </div>

      {cropQueue.length > 0 && cropQueue[cropIdx] && (
        <ImageCropModal
          file={cropQueue[cropIdx]}
          label={cropQueue.length > 1 ? `Image ${cropIdx + 1} of ${cropQueue.length}` : undefined}
          onComplete={resolveCrop}
          onSkip={resolveCrop}
          onCancel={cancelCrop}
        />
      )}
    </div>
  )
}
