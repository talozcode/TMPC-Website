'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

const ASPECTS: { label: string; value: number | undefined }[] = [
  { label: 'Free', value: undefined },
  { label: '3:2', value: 3 / 2 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '1:1', value: 1 },
]

interface Props {
  file: File
  /** e.g. "Image 1 of 3" — optional progress label */
  label?: string
  /** crop applied → returns a new cropped File */
  onComplete: (result: File) => void
  /** upload this file as-is, no crop */
  onSkip: (original: File) => void
  /** abort the whole upload */
  onCancel: () => void
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function cropToFile(src: string, area: Area, original: File): Promise<File> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(area.width)
  canvas.height = Math.round(area.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) return original
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height)

  const type = original.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), type, 0.92)
  )
  if (!blob) return original // fall back to the original if encoding fails
  const base = original.name.replace(/\.[^.]+$/, '')
  const ext = type === 'image/png' ? 'png' : 'jpg'
  return new File([blob], `${base}-cropped.${ext}`, { type })
}

export function ImageCropModal({ file, label, onComplete, onSkip, onCancel }: Props) {
  const [src, setSrc] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(3 / 2)
  const [areaPixels, setAreaPixels] = useState<Area | null>(null)
  const [working, setWorking] = useState(false)

  // Object URL for the selected file, revoked on unmount / file change.
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setAreaPixels(null) // avoid cropping a new file with the previous file's rect
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => setAreaPixels(areaPx), [])

  async function apply() {
    if (!areaPixels) return
    setWorking(true)
    try {
      const cropped = await cropToFile(src, areaPixels, file)
      onComplete(cropped)
    } catch {
      onSkip(file) // if cropping fails, fall back to the original
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Crop image</h2>
            {label && <p className="text-[11px] text-gray-400">{label}</p>}
          </div>
          <button onClick={onCancel} aria-label="Cancel upload" className="text-gray-400 hover:text-gray-700 text-lg leading-none">
            ×
          </button>
        </div>

        {/* Crop stage */}
        <div className="relative flex-1 bg-gray-900" style={{ minHeight: '320px' }}>
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-5 py-4 border-t border-gray-200 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mr-1">Aspect</span>
            {ASPECTS.map((a) => (
              <button
                key={a.label}
                onClick={() => setAspect(a.value)}
                className={`text-xs font-semibold px-3 py-1.5 border transition-colors ${
                  aspect === a.value
                    ? 'bg-accent text-white border-accent'
                    : 'border-gray-300 text-gray-600 hover:border-accent/50'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-accent"
              aria-label="Zoom"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={() => onSkip(file)}
              disabled={working}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Use original
            </button>
            <button
              onClick={apply}
              disabled={working || !areaPixels}
              className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {working ? 'Cropping…' : 'Apply crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
