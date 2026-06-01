'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertTeamMember(id: string | null, formData: FormData): Promise<void> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) redirect('/admin/team?formError=Name+is+required')

  const supabase = createAdminClient()
  const data = {
    name,
    role_title: (formData.get('role_title') as string) || null,
    description: (formData.get('description') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active: formData.get('active') === 'true',
  }

  const { error } = id
    ? await supabase.from('team_members').update(data).eq('id', id)
    : await supabase.from('team_members').insert(data)

  if (error) redirect(`/admin/team?formError=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/team')
  revalidatePath('/about')
  redirect('/admin/team?saved=1')
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('team_members').delete().eq('id', id)
  revalidatePath('/admin/team')
}
