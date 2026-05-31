'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertService(id: string | null, formData: FormData) {
  const supabase = createAdminClient()
  const scopeRaw = formData.get('scope_items') as string
  const scope_items = scopeRaw ? scopeRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
  const data = {
    number: formData.get('number') as string || null,
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    scope_items,
    active: formData.get('active') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  if (id) {
    await supabase.from('services').update(data).eq('id', id)
  } else {
    await supabase.from('services').insert(data)
  }
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function deleteService(id: string) {
  const supabase = createAdminClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/admin/services')
}
