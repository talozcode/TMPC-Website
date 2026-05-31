import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deletePost } from './actions'

export default async function BlogAdminPage() {
  const supabase = createAdminClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blog / Insights</h1>
          <p className="text-sm text-gray-500 mt-1">{posts?.length ?? 0} posts</p>
        </div>
        <Link href="/admin/blog/new" className="bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-dark transition-colors">
          + New Post
        </Link>
      </div>

      {!posts?.length ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          No posts yet. <Link href="/admin/blog/new" className="text-accent hover:underline">Write the first one.</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    {p.excerpt && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.excerpt}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 border ${p.published ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/blog/${p.id}/edit`} className="text-accent hover:text-accent-dark text-xs font-semibold transition-colors">Edit</Link>
                      <form action={deletePost.bind(null, p.id)}>
                        <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
