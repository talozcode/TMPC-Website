'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImageCropModal } from '@/components/admin/image-crop-modal'
import { PHASES, PHASE_LABELS_LONG, type ProjectPhase } from '@/lib/project-phases'
import type { ProjectImage } from '@/lib/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

interface Props {
  projectId: string
  existing: ProjectImage[]
  onUpdate: (images: ProjectImage[]) => void
}

/**
 * One drop zone per phase, so a batch of site photographs goes straight into the
 * right group with no extra clicks. Each zone owns its own file input; a single
 * shared ref across three zones would send every drop to whichever one rendered last.
 */
function PhaseDropZone({
  phase,
  uploading,
  onFiles,
}: {
  phase: ProjectPhase
  uploading: boolean
  onFiles: (files: FileList | null, phase: ProjectPhase) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className="border-2 border-dashed border-gray-300 hover:border-accent/50 px-4 py-5 text-center cursor-pointer transition-colors"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        onFiles(e.dataTransfer.files, phase)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files, phase)}
      />
      {uploading ? (
        <p className="text-sm text-gray-500">Uploading...</p>
      ) : (
        <p className="text-xs text-gray-500">
          Drop {PHASE_LABELS_LONG[phase].toLowerCase()} images here, or click to browse
        </p>
      )}
    </div>
  )
}

export function ImageUploader({ projectId, existing, onUpdate }: Props) {
  const [images, setImages] = useState<ProjectImage[]>(existing)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Crop queue: each selected file passes through the crop modal before upload.
  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [cropIdx, setCropIdx] = useState(0)
  const cropResults = useRef<File[]>([])
  // The upload path is async through the crop modal, so the phase that was
  // dropped onto has to be stashed rather than threaded down the call stack.
  const pendingPhase = useRef<ProjectPhase>('completed')

  const inPhase = (list: ProjectImage[], phase: ProjectPhase) =>
    list.filter((i) => i.phase === phase).sort((a, b) => a.display_order - b.display_order)

  function commit(next: ProjectImage[]) {
    setImages(next)
    onUpdate(next)
  }

  /**
   * Renumber one phase and persist it.
   *
   * Per-row update, not upsert. The previous code sent partial rows through
   * .upsert(), which PostgREST turns into an INSERT ... ON CONFLICT; Postgres
   * checks NOT NULL on the proposed tuple before resolving the conflict, so
   * project_id, storage_path and url being absent made every reorder fail. The
   * error was never checked and local state updated anyway, so the order looked
   * right until the next refresh. update() names only the columns it touches,
   * which also means no future NOT NULL column can break this path.
   */
  async function persistOrder(list: ProjectImage[], phase: ProjectPhase): Promise<ProjectImage[]> {
    const ordered = inPhase(list, phase).map((img, idx) => ({
      ...img,
      display_order: idx,
      is_primary: idx === 0,
    }))
    const results = await Promise.all(
      ordered.map((img) =>
        supabase
          .from('project_images')
          .update({ display_order: img.display_order, is_primary: img.is_primary })
          .eq('id', img.id)
      )
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) setError(`Could not save the new order: ${failed.error.message}`)
    const byId = new Map(ordered.map((i) => [i.id, i]))
    return list.map((i) => byId.get(i.id) ?? i)
  }

  function handleFiles(files: FileList | null, phase: ProjectPhase) {
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
    pendingPhase.current = phase
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
      void uploadFiles(results, pendingPhase.current)
    } else {
      setCropIdx(next)
    }
  }

  function cancelCrop() {
    setCropQueue([])
    setCropIdx(0)
    cropResults.current = []
  }

  async function uploadFiles(files: File[], phase: ProjectPhase) {
    setUploading(true)
    const newImages: ProjectImage[] = []
    // display_order is scoped per phase, so the offset is the size of this
    // phase rather than of the whole project.
    const base = inPhase(images, phase).length

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
          phase,
          display_order: base + newImages.length,
          is_primary: base + newImages.length === 0,
        })
        .select()
        .single()

      if (dbError) {
        setError(`DB error: ${dbError.message}`)
        continue
      }

      newImages.push(imgRecord as ProjectImage)
    }

    commit([...images, ...newImages])
    setUploading(false)
  }

  async function handleDelete(img: ProjectImage) {
    await supabase.storage.from('project-images').remove([img.storage_path])
    const { error: delError } = await supabase.from('project_images').delete().eq('id', img.id)
    if (delError) {
      setError(`Could not delete: ${delError.message}`)
      return
    }
    const remaining = images.filter((i) => i.id !== img.id)
    commit(await persistOrder(remaining, img.phase))
  }

  /** Adjacent swap inside one phase; idx indexes that phase, not the whole list. */
  async function moveImage(phase: ProjectPhase, idx: number, dir: -1 | 1) {
    const list = inPhase(images, phase)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= list.length) return

    const reordered = [...list]
    ;[reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]]
    const others = images.filter((i) => i.phase !== phase)
    // Stamp the new positions before persisting so persistOrder renumbers this order.
    const stamped = reordered.map((img, i) => ({ ...img, display_order: i }))
    commit(await persistOrder([...others, ...stamped], phase))
  }

  /** Move one image to another phase, renumbering both sides. */
  async function setPhase(img: ProjectImage, next: ProjectPhase) {
    if (img.phase === next) return
    const from = img.phase
    const target = inPhase(images, next).length

    const { error: updError } = await supabase
      .from('project_images')
      .update({ phase: next, display_order: target, is_primary: target === 0 })
      .eq('id', img.id)
    if (updError) {
      setError(`Could not change phase: ${updError.message}`)
      return
    }

    let list = images.map((i) =>
      i.id === img.id ? { ...i, phase: next, display_order: target, is_primary: target === 0 } : i
    )
    list = await persistOrder(list, from)
    list = await persistOrder(list, next)
    commit(list)
  }

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>
      )}

      <div className="space-y-5">
        {PHASES.map((phase) => {
          const list = inPhase(images, phase)
          return (
            <section key={phase}>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {PHASE_LABELS_LONG[phase]}
                </h4>
                <span className="text-[11px] text-gray-400">
                  {list.length} {list.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              {list.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {list.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <div
                        className={`relative w-28 h-20 overflow-hidden border-2 ${
                          img.is_primary ? 'border-accent' : 'border-gray-200'
                        }`}
                      >
                        <Image src={img.url} alt="" fill className="object-cover" sizes="112px" />
                        {img.is_primary && (
                          <span className="absolute bottom-0 left-0 right-0 bg-accent/80 text-white text-[9px] text-center py-0.5 uppercase tracking-wider">
                            Main
                          </span>
                        )}
                      </div>
                      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveImage(phase, idx, -1)}
                            className="w-5 h-5 bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black"
                            title="Move left">&#8592;</button>
                        )}
                        {idx < list.length - 1 && (
                          <button type="button" onClick={() => moveImage(phase, idx, 1)}
                            className="w-5 h-5 bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black"
                            title="Move right">&#8594;</button>
                        )}
                        <button type="button" onClick={() => handleDelete(img)}
                          className="w-5 h-5 bg-red-600/90 text-white text-xs flex items-center justify-center hover:bg-red-700"
                          title="Delete">&#215;</button>
                      </div>
                      {/* A native select is the only control that fits under a
                          112px thumbnail and stays keyboard accessible. */}
                      <select
                        value={img.phase}
                        onChange={(e) => setPhase(img, e.target.value as ProjectPhase)}
                        aria-label="Phase for this image"
                        className="mt-1 w-28 text-[10px] border border-gray-200 bg-white px-1 py-1 text-gray-600"
                      >
                        {PHASES.map((p) => (
                          <option key={p} value={p}>{PHASE_LABELS_LONG[p]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <PhaseDropZone phase={phase} uploading={uploading} onFiles={handleFiles} />
            </section>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        JPG, PNG, WebP. Max 10 MB. Crop on upload. The first image in each phase becomes that
        phase&apos;s main photo. A project with images in only one phase shows no phase control on
        the public site.
      </p>

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
