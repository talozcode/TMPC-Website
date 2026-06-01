'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveSetting(key: string, formData: FormData): Promise<void> {
  const value = formData.get('value') as string
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) redirect(`/admin/settings?formError=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/settings')
  redirect('/admin/settings?saved=1')
}
