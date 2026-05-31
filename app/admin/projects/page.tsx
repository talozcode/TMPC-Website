import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteProject, togglePublished } from './actions'
import type { Project } from '@/lib/types'

export default async function AdminProjectsPage() {
  const supabase = createAdminClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, category:categories(name)')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects?.length ?? 0} total</p>
        </div>
        <Link href="/admin/projects/new"
          className="bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-dark transition-colors">
          + New Project
        </Link>
      </div>

      {!projects?.length ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          No projects yet. <Link href="/admin/projects/new" className="text-accent hover:underline">Create the first one.</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(projects as Project[]).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    {p.subtitle && <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {(p as any).category?.name ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <form action={async () => {
                      'use server'
                      await togglePublished(p.id, !p.published)
                    }}>
                      <button type="submit"
                        className={`text-xs font-semibold px-2.5 py-1 border transition-colors ${
                          p.published
                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                            : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}>
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/projects/${p.id}/edit`}
                        className="text-accent hover:text-accent-dark text-xs font-semibold transition-colors">
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteProject(p.id)
                      }}>
                        <button type="submit"
                          className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
                          onClick={(e) => { if (!confirm('Delete this project?')) e.preventDefault() }}>
                          Delete
                        </button>
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
