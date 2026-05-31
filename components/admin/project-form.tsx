'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from './image-uploader'
import type { Project, Category, ProjectImage } from '@/lib/types'

interface Props {
  project?: Project
  categories: Category[]
  onSave: (data: Partial<Project>) => Promise<{ id: string } | { error: string }>
}

const inputClass =
  'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2'

export function ProjectForm({ project, categories, onSave }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<string | null>(project?.id ?? null)
  const [images, setImages] = useState<ProjectImage[]>(project?.project_images ?? [])

  const [deliverables, setDeliverables] = useState<string[]>(
    project?.deliverables?.length ? project.deliverables : ['']
  )

  function updateDeliverable(idx: number, val: string) {
    setDeliverables((prev) => prev.map((d, i) => (i === idx ? val : d)))
  }
  function addDeliverable() {
    setDeliverables((prev) => [...prev, ''])
  }
  function removeDeliverable(idx: number) {
    setDeliverables((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const data: Partial<Project> = {
      title: fd.get('title') as string,
      subtitle: (fd.get('subtitle') as string) || null,
      category_id: (fd.get('category_id') as string) || null,
      location: (fd.get('location') as string) || null,
      scope: (fd.get('scope') as string) || null,
      role: (fd.get('role') as string) || null,
      brief: (fd.get('brief') as string) || null,
      deliverables: deliverables.filter(Boolean),
      published: fd.get('published') === 'true',
    }

    const result = await onSave(data)

    if ('error' in result) {
      setError(result.error)
      setSaving(false)
      return
    }

    setSavedId(result.id)
    setSaving(false)

    if (!project) {
      router.push(`/admin/projects/${result.id}/edit`)
    } else {
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {/* Title + Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" required defaultValue={project?.title} className={inputClass} placeholder="Project title" />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <input name="subtitle" defaultValue={project?.subtitle ?? ''} className={inputClass} placeholder="e.g. Mixed-Use Commercial Development" />
        </div>
      </div>

      {/* Category + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Category</label>
          <select name="category_id" defaultValue={project?.category_id ?? ''} className={inputClass}>
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" defaultValue={project?.location ?? ''} className={inputClass} placeholder="e.g. Sukhumvit, Bangkok" />
        </div>
      </div>

      {/* Scope + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Scope</label>
          <input name="scope" defaultValue={project?.scope ?? ''} className={inputClass} placeholder="e.g. 3,800 sqm across 4 levels" />
        </div>
        <div>
          <label className={labelClass}>TMPC Role</label>
          <input name="role" defaultValue={project?.role ?? ''} className={inputClass} placeholder="e.g. Development Management" />
        </div>
      </div>

      {/* Brief */}
      <div>
        <label className={labelClass}>Project Brief</label>
        <textarea name="brief" rows={5} defaultValue={project?.brief ?? ''} className={`${inputClass} resize-none`} placeholder="Describe the project..." />
      </div>

      {/* Deliverables */}
      <div>
        <label className={labelClass}>Key Deliverables</label>
        <div className="space-y-2">
          {deliverables.map((d, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={d}
                onChange={(e) => updateDeliverable(idx, e.target.value)}
                className={inputClass}
                placeholder={`Deliverable ${idx + 1}`}
              />
              {deliverables.length > 1 && (
                <button type="button" onClick={() => removeDeliverable(idx)}
                  className="px-3 border border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 text-sm transition-colors">
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDeliverable}
            className="text-xs text-accent hover:text-accent-dark font-semibold uppercase tracking-wider transition-colors">
            + Add deliverable
          </button>
        </div>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3 pt-2">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</label>
        <select name="published" defaultValue={project?.published !== false ? 'true' : 'false'} className="border border-gray-300 bg-white text-sm px-3 py-2 outline-none focus:border-accent">
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
        <button type="submit" disabled={saving}
          className="bg-accent text-white text-sm font-semibold px-6 py-2.5 hover:bg-accent-dark transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : project ? 'Save Changes' : 'Create Project'}
        </button>
        <button type="button" onClick={() => router.push('/admin/projects')}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
      </div>

      {/* Images — only shown after project is saved */}
      {savedId && (
        <div className="pt-6 border-t border-gray-200">
          <label className={labelClass}>Project Images</label>
          <p className="text-xs text-gray-500 mb-4">First image is the main photo. Hover thumbnails to reorder or delete.</p>
          <ImageUploader
            projectId={savedId}
            existing={images}
            onUpdate={setImages}
          />
        </div>
      )}

      {!savedId && (
        <div className="pt-6 border-t border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-500">Save the project first — then you can upload images.</p>
        </div>
      )}
    </form>
  )
}
