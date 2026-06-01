import Link from 'next/link'
import { createPost } from '../actions'
import { SavedBanner } from '@/components/admin/saved-banner'

const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-accent'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

export default function NewBlogPostPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Blog</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Post</h1>
      </div>
      <form action={createPost} className="space-y-5 max-w-3xl">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" required className={inputClass} placeholder="Post title" />
        </div>
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea name="excerpt" rows={2} className={`${inputClass} resize-none`} placeholder="Short summary shown in listings" />
        </div>
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input name="cover_image_url" type="url" className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>Content</label>
          <textarea name="content" rows={16} className={`${inputClass} resize-none font-mono text-xs`} placeholder="Write your post content here..." />
        </div>
        <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
          <select name="published" defaultValue="false" className={`${inputClass} w-auto`}>
            <option value="false">Save as Draft</option>
            <option value="true">Publish Now</option>
          </select>
          <button type="submit" className="bg-accent text-white text-sm font-semibold px-6 py-2.5 hover:bg-accent-dark transition-colors">
            Create Post
          </button>
        </div>
      </form>
    </div>
  )
}
