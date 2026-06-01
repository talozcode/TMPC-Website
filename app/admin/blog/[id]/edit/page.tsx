import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updatePost, deletePost } from '../../actions'
import { SavedBanner } from '@/components/admin/saved-banner'

const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2.5 outline-none focus:border-accent'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div className="p-8">
      <SavedBanner />
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Blog</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight line-clamp-1">{post.title}</h1>
      </div>

      <form action={updatePost.bind(null, id)} className="space-y-5 max-w-3xl">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" required defaultValue={post.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ''} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input name="cover_image_url" type="url" defaultValue={post.cover_image_url ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Content</label>
          <textarea name="content" rows={20} defaultValue={post.content ?? ''} className={`${inputClass} resize-none font-mono text-xs`} />
        </div>
        <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
          <select name="published" defaultValue={post.published ? 'true' : 'false'} className={`${inputClass} w-auto`}>
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
          <button type="submit" className="bg-accent text-white text-sm font-semibold px-6 py-2.5 hover:bg-accent-dark transition-colors">
            Save Changes
          </button>
          <form action={deletePost.bind(null, id)} className="ml-auto">
            <button type="submit" className="text-sm text-red-500 hover:text-red-700 transition-colors">Delete Post</button>
          </form>
        </div>
      </form>
      <div className="mt-4 max-w-3xl">
        <p className="text-xs text-gray-400">Slug: <span className="font-mono">{post.slug}</span></p>
      </div>
    </div>
  )
}
