import { createAdminClient } from '@/lib/supabase/admin'
import { upsertTeamMember, deleteTeamMember } from './actions'
import type { TeamMember } from '@/lib/types'

const inputClass = 'w-full border border-gray-300 bg-white text-gray-900 text-sm px-3 py-2 outline-none focus:border-accent'
const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5'

function TeamForm({ member }: { member?: TeamMember }) {
  return (
    <form action={upsertTeamMember.bind(null, member?.id ?? null)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" required defaultValue={member?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Role / Title</label>
          <input name="role_title" defaultValue={member?.role_title ?? ''} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={3} defaultValue={member?.description ?? ''} className={`${inputClass} resize-none`} />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label className={labelClass}>Order</label>
          <input name="display_order" type="number" defaultValue={member?.display_order ?? 0} className={`${inputClass} w-20`} />
        </div>
        <select name="active" defaultValue={member?.active !== false ? 'true' : 'false'} className={`${inputClass} w-auto mt-5`}>
          <option value="true">Active</option>
          <option value="false">Hidden</option>
        </select>
        <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2 hover:bg-accent-dark transition-colors mt-5">
          {member ? 'Save' : 'Add Member'}
        </button>
        {member && (
          <form action={deleteTeamMember.bind(null, member.id)} className="mt-5">
            <button type="submit" className="text-sm text-red-500 hover:text-red-700 transition-colors">Delete</button>
          </form>
        )}
      </div>
    </form>
  )
}

export default async function TeamAdminPage() {
  const supabase = createAdminClient()
  const { data: members } = await supabase.from('team_members').select('*').order('display_order')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the leadership team shown on the About page</p>
      </div>
      <div className="space-y-6">
        {members?.map((m) => (
          <div key={m.id} className="bg-white border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{m.name}</p>
            <TeamForm member={m as TeamMember} />
          </div>
        ))}
        <div className="bg-white border border-dashed border-gray-300 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Add Team Member</p>
          <TeamForm />
        </div>
      </div>
    </div>
  )
}
