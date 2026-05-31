'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function markRead(id: string, read: boolean) {
  const supabase = createAdminClient()
  await supabase.from('contact_inquiries').update({ read }).eq('id', id)
  revalidatePath('/admin/inquiries')
}

export async function archiveInquiry(id: string) {
  const supabase = createAdminClient()
  await supabase.from('contact_inquiries').update({ archived: true }).eq('id', id)
  revalidatePath('/admin/inquiries')
}

export async function deleteInquiry(id: string) {
  const supabase = createAdminClient()
  await supabase.from('contact_inquiries').delete().eq('id', id)
  revalidatePath('/admin/inquiries')
}
