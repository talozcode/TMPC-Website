import { createAdminClient } from '@/lib/supabase/admin'
import { SavedBanner } from '@/components/admin/saved-banner'
import { upsertTestimonial, deleteTestimonial } from './actions'

const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

export default async function TestimonialsPage() {
  const supabase = createAdminClient()
  const [{ data: testimonials }, { data: projects }] = await Promise.all([
    supabase.from('testimonials').select('*').order('display_order'),
    supabase.from('projects').select('id, title').order('title'),
  ])

  function TestimonialForm({ t }: { t?: any }) {
    return (
      <form action={upsertTestimonial.bind(null, t?.id ?? null)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Client Name *</label>
            <input name="client_name" required defaultValue={t?.client_name} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title / Role</label>
            <input name="client_title" defaultValue={t?.client_title ?? ''} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company</label>
            <input name="client_company" defaultValue={t?.client_company ?? ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Linked Project</label>
            <select name="project_id" defaultValue={t?.project_id ?? ''} className={inputClass}>
              <option value="">None</option>
              {projects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Quote *</label>
          <textarea name="quote" required rows={3} defaultValue={t?.quote} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex items-center gap-4">
          <input name="display_order" type="number" defaultValue={t?.display_order ?? 0} className={`${inputClass} w-20`} placeholder="Order" />
          <select name="active" defaultValue={t?.active !== false ? 'true' : 'false'} className={`${inputClass} w-auto`}>
            <option value="true">Active</option>
            <option value="false">Hidden</option>
          </select>
          <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors">
            {t ? 'Save' : 'Add'}
          </button>
          {t && (
            <form action={deleteTestimonial.bind(null, t.id)}>
              <button type="submit" className="text-sm text-red-500 hover:text-red-700 transition-colors">Delete</button>
            </form>
          )}
        </div>
      </form>
    )
  }

  return (
    <div className="p-8">
      <SavedBanner />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Testimonials</h1>
      </div>
      <div className="space-y-6">
        {testimonials?.map((t) => (
          <div key={t.id} className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t.client_name}</p>
            <TestimonialForm t={t} />
          </div>
        ))}
        <div className="bg-white border border-dashed border-gray-300 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Add Testimonial</p>
          <TestimonialForm />
        </div>
      </div>
    </div>
  )
}
