'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils'
import type { Project } from '@/lib/types'

export async function createProject(data: Partial<Project>): Promise<{ id: string } | { error: string }> {
  if (!data.title?.trim()) return { error: 'Title is required' }
  const supabase = createAdminClient()
  const payload = { ...data, slug: data.slug?.trim() || slugify(data.title) }
  const { data: project, error } = await supabase.from('projects').insert(payload).select().single()
  if (error) {
    if (error.code === '23505') return { error: 'That URL slug is already used by another project.' }
    return { error: error.message }
  }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
  return { id: project.id }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<{ id: string } | { error: string }> {
  if (!data.title?.trim()) return { error: 'Title is required' }
  const supabase = createAdminClient()
  // Only ever fill a blank slug. Regenerating it from a changed title would
  // silently break every link that already points at this project.
  const payload = { ...data, slug: data.slug?.trim() || slugify(data.title) }
  const { error } = await supabase.from('projects').update(payload).eq('id', id)
  if (error) {
    if (error.code === '23505') return { error: 'That URL slug is already used by another project.' }
    return { error: error.message }
  }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
  return { id }
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  // Fetch storage paths before cascade-deleting rows
  const { data: images } = await supabase
    .from('project_images')
    .select('storage_path')
    .eq('project_id', id)

  if (images?.length) {
    await supabase.storage
      .from('project-images')
      .remove(images.map((i) => i.storage_path))
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
  return {}
}

export async function togglePublished(id: string, published: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').update({ published }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/projects/[slug]', 'page')
  return {}
}
