'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertTestimonial(id: string | null, formData: FormData) {
  const supabase = createAdminClient()
  const data = {
    client_name: formData.get('client_name') as string,
    client_title: formData.get('client_title') as string || null,
    client_company: formData.get('client_company') as string || null,
    quote: formData.get('quote') as string,
    project_id: formData.get('project_id') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active: formData.get('active') === 'true',
  }
  if (id) {
    await supabase.from('testimonials').update(data).eq('id', id)
  } else {
    await supabase.from('testimonials').insert(data)
  }
  revalidatePath('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/admin/testimonials')
}
