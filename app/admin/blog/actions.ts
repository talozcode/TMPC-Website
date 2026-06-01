'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function createPost(formData: FormData): Promise<void> {
  const title = (formData.get('title') as string)?.trim()
  if (!title) redirect('/admin/blog/new?formError=Title+is+required')

  const supabase = createAdminClient()
  const published = formData.get('published') === 'true'

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title,
      slug: toSlug(title) + '-' + Date.now().toString(36),
      excerpt: (formData.get('excerpt') as string) || null,
      content: (formData.get('content') as string) || null,
      cover_image_url: (formData.get('cover_image_url') as string) || null,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error || !data) {
    redirect(`/admin/blog/new?formError=${encodeURIComponent(error?.message ?? 'Failed to create post')}`)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(`/admin/blog/${data.id}/edit?saved=1`)
}

export async function updatePost(id: string, formData: FormData): Promise<void> {
  const title = (formData.get('title') as string)?.trim()
  if (!title) redirect(`/admin/blog/${id}/edit?formError=Title+is+required`)

  const supabase = createAdminClient()
  const published = formData.get('published') === 'true'
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('published_at')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title,
      excerpt: (formData.get('excerpt') as string) || null,
      content: (formData.get('content') as string) || null,
      cover_image_url: (formData.get('cover_image_url') as string) || null,
      published,
      published_at: published && !existing?.published_at ? new Date().toISOString() : existing?.published_at,
    })
    .eq('id', id)

  if (error) redirect(`/admin/blog/${id}/edit?formError=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(`/admin/blog/${id}/edit?saved=1`)
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('blog_posts').delete().eq('id', id)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}
