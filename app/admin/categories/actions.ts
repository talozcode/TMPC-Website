'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function createCategory(formData: FormData): Promise<void> {
  const name = (formData.get('name') as string).trim()
  if (!name) return
  const supabase = createAdminClient()
  const { data: existing } = await supabase.from('categories').select('display_order').order('display_order', { ascending: false }).limit(1).single()
  const next_order = (existing?.display_order ?? 0) + 1
  await supabase.from('categories').insert({ name, slug: toSlug(name), display_order: next_order })
  revalidatePath('/admin/categories')
  revalidatePath('/projects')
}

export async function updateCategory(id: string, formData: FormData): Promise<void> {
  const name = (formData.get('name') as string).trim()
  if (!name) return
  const supabase = createAdminClient()
  await supabase.from('categories').update({ name, slug: toSlug(name) }).eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/projects')
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/projects')
}

export async function moveCategoryOrder(id: string, dir: 'up' | 'down') {
  const supabase = createAdminClient()
  const { data: all } = await supabase.from('categories').select('id,display_order').order('display_order')
  if (!all) return
  const idx = all.findIndex((c) => c.id === id)
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return
  const a = all[idx], b = all[swapIdx]
  await supabase.from('categories').update({ display_order: b.display_order }).eq('id', a.id)
  await supabase.from('categories').update({ display_order: a.display_order }).eq('id', b.id)
  revalidatePath('/admin/categories')
  revalidatePath('/projects')
}
