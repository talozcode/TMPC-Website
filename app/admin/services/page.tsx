import { createAdminClient } from '@/lib/supabase/admin'
import { upsertService, deleteService } from './actions'
import type { Service } from '@/lib/types'

const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

function ServiceForm({ service }: { service?: Service }) {
  return (
    <form action={upsertService.bind(null, service?.id ?? null)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Number</label>
          <input name="number" defaultValue={service?.number ?? ''} className={inputClass} placeholder="01" />
        </div>
        <div>
          <label className={labelClass}>Display Order</label>
          <input name="display_order" type="number" defaultValue={service?.display_order ?? 0} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Title *</label>
        <input name="title" required defaultValue={service?.title} className={inputClass} placeholder="Service name" />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={3} defaultValue={service?.description ?? ''} className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className={labelClass}>Scope Items (one per line)</label>
        <textarea name="scope_items" rows={5} defaultValue={service?.scope_items?.join('\n') ?? ''} className={`${inputClass} resize-none font-mono text-xs`} />
      </div>
      <div className="flex items-center gap-4">
        <select name="active" defaultValue={service?.active !== false ? 'true' : 'false'} className={`${inputClass} w-auto`}>
          <option value="true">Active</option>
          <option value="false">Hidden</option>
        </select>
        <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors">
          {service ? 'Save' : 'Add Service'}
        </button>
        {service && (
          <form action={deleteService.bind(null, service.id)} className="ml-auto">
            <button type="submit" className="text-sm text-red-500 hover:text-red-700 transition-colors">Delete</button>
          </form>
        )}
      </div>
    </form>
  )
}

export default async function ServicesAdminPage() {
  const supabase = createAdminClient()
  const { data: services } = await supabase.from('services').select('*').order('display_order')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Services</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the services shown on the Services page</p>
      </div>

      <div className="space-y-6">
        {services?.map((s) => (
          <div key={s.id} className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{s.title}</p>
            <ServiceForm service={s as Service} />
          </div>
        ))}

        <div className="bg-white border border-dashed border-gray-300 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Add New Service</p>
          <ServiceForm />
        </div>
      </div>
    </div>
  )
}
