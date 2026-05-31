'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveSetting(key: string, formData: FormData) {
  const value = formData.get('value') as string
  const supabase = createAdminClient()
  await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() })
  revalidatePath('/admin/settings')
}
