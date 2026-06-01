import { createAdminClient } from '@/lib/supabase/admin'
import { saveSetting } from './actions'
import { SavedBanner } from '@/components/admin/saved-banner'

export default async function SettingsPage() {
  const supabase = createAdminClient()
  const { data: settings } = await supabase.from('site_settings').select('*').order('key')

  const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent'

  return (
    <div className="p-8">
      <SavedBanner />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Global site configuration</p>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-100 max-w-2xl">
        {settings?.map((s) => (
          <form key={s.key} action={saveSetting.bind(null, s.key)} className="flex items-center gap-4 px-5 py-4">
            <div className="w-48 flex-shrink-0">
              <p className="text-xs font-semibold text-gray-700">{s.label || s.key}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.key}</p>
            </div>
            <input name="value" defaultValue={s.value ?? ''} className={`${inputClass} flex-1`} />
            <button type="submit" className="flex-shrink-0 bg-accent text-white text-xs font-semibold px-4 py-2 hover:bg-accent-dark transition-colors">
              Save
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
