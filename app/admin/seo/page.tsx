import { createAdminClient } from '@/lib/supabase/admin'
import { saveSeo } from './actions'

export default async function SeoPage() {
  const supabase = createAdminClient()
  const { data: pages } = await supabase.from('seo_metadata').select('*').order('page')

  const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent'
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SEO</h1>
        <p className="text-sm text-gray-500 mt-1">Meta titles and descriptions for each page</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {pages?.map((p) => (
          <div key={p.page} className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">/{p.page === 'home' ? '' : p.page}</p>
            <form action={saveSeo.bind(null, p.page)} className="space-y-4">
              <div>
                <label className={labelClass}>Page Title</label>
                <input name="title" defaultValue={p.title ?? ''} className={inputClass} placeholder="Page title — shown in browser tab" />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea name="description" rows={2} defaultValue={p.description ?? ''} className={`${inputClass} resize-none`} placeholder="160 characters max" />
              </div>
              <div>
                <label className={labelClass}>OG Title (Social Share)</label>
                <input name="og_title" defaultValue={p.og_title ?? ''} className={inputClass} placeholder="Defaults to Page Title if empty" />
              </div>
              <div>
                <label className={labelClass}>OG Description</label>
                <textarea name="og_description" rows={2} defaultValue={p.og_description ?? ''} className={`${inputClass} resize-none`} placeholder="Defaults to Meta Description if empty" />
              </div>
              <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors">
                Save
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
