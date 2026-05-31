'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertTeamMember(id: string | null, formData: FormData) {
  const supabase = createAdminClient()
  const data = {
    name: formData.get('name') as string,
    role_title: formData.get('role_title') as string || null,
    description: formData.get('description') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active: formData.get('active') === 'true',
  }
  if (id) {
    await supabase.from('team_members').update(data).eq('id', id)
  } else {
    await supabase.from('team_members').insert(data)
  }
  revalidatePath('/admin/team')
  revalidatePath('/about')
}

export async function deleteTeamMember(id: string) {
  const supabase = createAdminClient()
  await supabase.from('team_members').delete().eq('id', id)
  revalidatePath('/admin/team')
}
