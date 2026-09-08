'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImageCropModal } from '@/components/admin/image-crop-modal'
import { HeroBeforeAfter } from '@/components/hero-before-after'
import type { HeroBeforeAfter as HeroBeforeAfterRow } from '@/lib/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
// Matches the hero card's own proportions, so the before and after crop stay
// aligned to the same frame instead of the comparison jumping at the edges.
const ASPECT = 3 / 2

type Side = 'before' | 'after'

const SIDE_LABEL: Record<Side, string> = { before: 'Before', after: 'After' }

export function HeroBeforeAfterForm({ initial }: { initial: HeroBeforeAfterRow }) {
  const [record, setRecord] = useState(initial)
  const [projectName, setProjectName] = useState(initial.project_name ?? '')
  const [projectDetails, setProjectDetails] = useState(initial.project_details ?? '')
  const [pendingSide, setPendingSide] = useState<Side | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<Side | null>(null)
  const [savingLabel, setSavingLabel] = useState(false)
  const [error, setError] = useState('')
  const beforeInput = useRef<HTMLInputElement>(null)
  const afterInput = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function pickFile(side: Side, files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(`${file.name} is not an image`)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`${file.name} exceeds 10 MB limit`)
      return
    }
    setError('')
    setPendingSide(side)
    setPendingFile(file)
  }

  async function applyCrop(file: File) {
    const side = pendingSide
    setPendingSide(null)
    setPendingFile(null)
    if (!side) return
    setUploading(side)

    const ext = file.name.split('.').pop()
    const path = `hero/${side}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      setUploading(null)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('media-library').getPublicUrl(path)
    const patch =
      side === 'before'
        ? { before_storage_path: path, before_url: publicUrl }
        : { after_storage_path: path, after_url: publicUrl }

    const { error: dbError } = await supabase.from('hero_before_after').update(patch).eq('id', record.id)
    if (dbError) {
      setError(`Could not save: ${dbError.message}`)
      setUploading(null)
      return
    }

    // Clean up the file it replaced, once the new one is safely saved.
    const prevPath = side === 'before' ? record.before_storage_path : record.after_storage_path
    if (prevPath) await supabase.storage.from('media-library').remove([prevPath])

    setRecord((r) => ({ ...r, ...patch }))
    setUploading(null)
  }

  function cancelCrop() {
    setPendingSide(null)
    setPendingFile(null)
  }

  async function saveLabel() {
    setSavingLabel(true)
    setError('')
    const patch = {
      project_name: projectName.trim() || null,
      project_details: projectDetails.trim() || null,
    }
    const { error: dbError } = await supabase.from('hero_before_after').update(patch).eq('id', record.id)
    if (dbError) setError(`Could not save: ${dbError.message}`)
    else setRecord((r) => ({ ...r, ...patch }))
    setSavingLabel(false)
  }

  const labelDirty =
    projectName.trim() !== (record.project_name ?? '') || projectDetails.trim() !== (record.project_details ?? '')

  return (
    <div className="space-y-8">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-5">
        {(['before', 'after'] as Side[]).map((side) => {
          const url = side === 'before' ? record.before_url : record.after_url
          const inputRef = side === 'before' ? beforeInput : afterInput
          return (
            <div key={side}>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {SIDE_LABEL[side]}
                </h4>
              </div>
              <div
                className="relative w-full aspect-[3/2] bg-gray-100 border-2 border-dashed border-gray-300 hover:border-accent/50 cursor-pointer transition-colors overflow-hidden"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  pickFile(side, e.dataTransfer.files)
                }}
              >
                {url && <Image src={url} alt={SIDE_LABEL[side]} fill className="object-cover" sizes="320px" />}
                {uploading === side && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs text-gray-500">
                    Uploading...
                  </div>
                )}
                {!url && !uploading && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 px-4 text-center">
                    Drop a {SIDE_LABEL[side].toLowerCase()} photo here, or click to browse
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickFile(side, e.target.files)}
              />
              <p className="text-[11px] text-gray-400 mt-1.5">Click the image to replace it.</p>
            </div>
          )
        })}
      </div>

      <div className="max-w-md">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Project label <span className="text-gray-400 normal-case font-normal">(optional)</span>
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-gray-500">Project name</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Regional Distribution Hub"
              className="w-full mt-1 border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500">Details</label>
            <input
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              placeholder="e.g. Industrial, Bangkok"
              className="w-full mt-1 border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={saveLabel}
            disabled={savingLabel || !labelDirty}
            className="bg-accent text-white text-xs font-semibold px-4 py-2 hover:bg-accent-dark transition-colors disabled:opacity-40"
          >
            {savingLabel ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Live preview</h4>
        <div className="max-w-[30rem]">
          <HeroBeforeAfter
            beforeUrl={record.before_url}
            afterUrl={record.after_url}
            projectName={record.project_name}
            projectDetails={record.project_details}
          />
        </div>
      </div>

      {pendingFile && (
        <ImageCropModal
          file={pendingFile}
          fixedAspect={ASPECT}
          onComplete={applyCrop}
          onSkip={applyCrop}
          onCancel={cancelCrop}
        />
      )}
    </div>
  )
}
