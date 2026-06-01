'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Project } from '@/lib/types'

export async function createProject(data: Partial<Project>): Promise<{ id: string } | { error: string }> {
  if (!data.title?.trim()) return { error: 'Title is required' }
  const supabase = createAdminClient()
  const { data: project, error } = await supabase.from('projects').insert(data).select().single()
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { id: project.id }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<{ id: string } | { error: string }> {
  if (!data.title?.trim()) return { error: 'Title is required' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
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
  return {}
}

export async function togglePublished(id: string, published: boolean): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').update({ published }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return {}
}
