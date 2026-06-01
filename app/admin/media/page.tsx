'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB for media library

interface MediaFile {
  id: string
  filename: string
  url: string
  storage_path: string
  mime_type: string | null
  file_size: number | null
  alt_text: string | null
  created_at: string
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadFiles()
  }, [])

  async function loadFiles() {
    setLoading(true)
    setLoadError('')
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setLoadError('Failed to load files. Please refresh.')
    } else {
      setFiles((data as MediaFile[]) ?? [])
    }
    setLoading(false)
  }

  async function handleUpload(fileList: FileList | null) {
    if (!fileList) return
    setUploading(true)
    setUploadError('')

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`${file.name} exceeds 20 MB limit`)
        continue
      }
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: storageError } = await supabase.storage.from('media-library').upload(path, file)
      if (storageError) {
        setUploadError(`Upload failed: ${storageError.message}`)
        continue
      }
      const { data: { publicUrl } } = supabase.storage.from('media-library').getPublicUrl(path)
      await supabase.from('media_files').insert({
        filename: file.name,
        storage_path: path,
        url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })
    }

    await loadFiles()
    setUploading(false)
  }

  async function handleDelete(f: MediaFile) {
    if (!confirm('Delete this file?')) return
    await supabase.storage.from('media-library').remove([f.storage_path])
    await supabase.from('media_files').delete().eq('id', f.id)
    setFiles((prev) => prev.filter((x) => x.id !== f.id))
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? '…' : `${files.length} files`}</p>
        </div>
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-dark transition-colors disabled:opacity-50">
          {uploading ? 'Uploading…' : '+ Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {uploadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{uploadError}</div>
      )}

      {loadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex items-center justify-between">
          {loadError}
          <button onClick={loadFiles} className="text-xs underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading…</div>
      ) : !files.length ? (
        <div
          className="border-2 border-dashed border-gray-300 p-20 text-center cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        >
          <p className="text-gray-400 text-sm">Drag & drop images or click to upload</p>
          <p className="text-gray-300 text-xs mt-1">Max 20 MB per file</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        >
          {files.map((f) => (
            <div key={f.id} className="group relative bg-white border border-gray-200 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <Image src={f.url} alt={f.alt_text || f.filename} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{f.filename}</p>
                {f.file_size && <p className="text-[10px] text-gray-400">{(f.file_size / 1024).toFixed(0)} KB</p>}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(f.url)}
                  className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 hover:bg-gray-100 transition-colors">
                  {copied === f.url ? 'Copied!' : 'Copy URL'}
                </button>
                <button onClick={() => handleDelete(f)}
                  className="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
