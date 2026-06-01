'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertTestimonial(id: string | null, formData: FormData): Promise<void> {
  const client_name = (formData.get('client_name') as string)?.trim()
  const quote = (formData.get('quote') as string)?.trim()
  if (!client_name) redirect('/admin/testimonials?formError=Client+name+is+required')
  if (!quote) redirect('/admin/testimonials?formError=Quote+is+required')

  const supabase = createAdminClient()
  const data = {
    client_name,
    client_title: (formData.get('client_title') as string) || null,
    client_company: (formData.get('client_company') as string) || null,
    quote,
    project_id: (formData.get('project_id') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active: formData.get('active') === 'true',
  }

  const { error } = id
    ? await supabase.from('testimonials').update(data).eq('id', id)
    : await supabase.from('testimonials').insert(data)

  if (error) redirect(`/admin/testimonials?formError=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/testimonials')
  redirect('/admin/testimonials?saved=1')
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/admin/testimonials')
}
