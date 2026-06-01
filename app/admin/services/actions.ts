'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertService(id: string | null, formData: FormData): Promise<void> {
  const title = (formData.get('title') as string)?.trim()
  if (!title) redirect('/admin/services?formError=Title+is+required')

  const supabase = createAdminClient()
  const scopeRaw = formData.get('scope_items') as string
  const scope_items = scopeRaw ? scopeRaw.split('\n').map((s) => s.trim()).filter(Boolean) : []
  const data = {
    number: (formData.get('number') as string) || null,
    title,
    description: (formData.get('description') as string) || null,
    scope_items,
    active: formData.get('active') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }

  const { error } = id
    ? await supabase.from('services').update(data).eq('id', id)
    : await supabase.from('services').insert(data)

  if (error) redirect(`/admin/services?formError=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/services')
  revalidatePath('/services')
  redirect('/admin/services?saved=1')
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/admin/services')
}
