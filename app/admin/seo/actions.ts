'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveSeo(page: string, formData: FormData) {
  const supabase = createAdminClient()
  await supabase.from('seo_metadata').upsert({
    page,
    title: formData.get('title') as string || null,
    description: formData.get('description') as string || null,
    og_title: formData.get('og_title') as string || null,
    og_description: formData.get('og_description') as string || null,
    updated_at: new Date().toISOString(),
  })
  revalidatePath('/admin/seo')
  revalidatePath(`/${page === 'home' ? '' : page}`)
}
