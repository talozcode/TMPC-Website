import { createAdminClient } from '@/lib/supabase/admin'
import { createCategory, updateCategory, deleteCategory, moveCategoryOrder } from './actions'
import { SavedBanner } from '@/components/admin/saved-banner'
import { ConfirmDeleteButton } from '@/components/admin/confirm-delete-button'

export default async function CategoriesPage() {
  const supabase = createAdminClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, projects:projects(count)')
    .order('display_order')

  const thClass = 'text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'

  return (
    <div className="p-8">
      <SavedBanner />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage project categories and their display order</p>
      </div>

      {/* Add new */}
      <div className="bg-white border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Category</h2>
        <form action={createCategory} className="flex gap-3">
          <input name="name" required placeholder="Category name"
            className="border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent flex-1" />
          <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors">
            Add
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className={thClass}>Name</th>
              <th className={thClass}>Slug</th>
              <th className={thClass}>Projects</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories?.map((cat, idx) => {
              const projectCount = (cat.projects as { count: number }[])?.[0]?.count ?? 0
              return (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <form action={updateCategory.bind(null, cat.id)} className="flex gap-2">
                      <input name="name" defaultValue={cat.name}
                        className="border border-gray-300 text-sm px-2 py-1 outline-none focus:border-accent w-48" />
                      <button type="submit" className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors">
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs font-mono">{cat.slug}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${projectCount > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                      {projectCount}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={moveCategoryOrder.bind(null, cat.id, 'up')}>
                        <button type="submit" disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs px-1 transition-colors">↑</button>
                      </form>
                      <form action={moveCategoryOrder.bind(null, cat.id, 'down')}>
                        <button type="submit" disabled={idx === (categories.length - 1)}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs px-1 transition-colors">↓</button>
                      </form>
                      <ConfirmDeleteButton
                        action={deleteCategory.bind(null, cat.id)}
                        message={projectCount > 0
                          ? `Delete "${cat.name}"? This will remove the category from ${projectCount} project${projectCount > 1 ? 's' : ''}.`
                          : `Delete "${cat.name}"?`}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                      >
                        Delete{projectCount > 0 ? ` (${projectCount})` : ''}
                      </ConfirmDeleteButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
