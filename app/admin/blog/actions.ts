'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').slice(0, 80)
}

export async function createPost(formData: FormData): Promise<void> {
  const supabase = createAdminClient()
  const title = formData.get('title') as string
  const published = formData.get('published') === 'true'
  const { data } = await supabase.from('blog_posts').insert({
    title,
    slug: toSlug(title) + '-' + Date.now().toString(36),
    excerpt: formData.get('excerpt') as string || null,
    content: formData.get('content') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    published,
    published_at: published ? new Date().toISOString() : null,
  }).select().single()
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(`/admin/blog/${data?.id}/edit`)
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = createAdminClient()
  const published = formData.get('published') === 'true'
  const { data: existing } = await supabase.from('blog_posts').select('published, published_at').eq('id', id).single()
  await supabase.from('blog_posts').update({
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string || null,
    content: formData.get('content') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    published,
    published_at: published && !existing?.published_at ? new Date().toISOString() : existing?.published_at,
  }).eq('id', id)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function deletePost(id: string) {
  const supabase = createAdminClient()
  await supabase.from('blog_posts').delete().eq('id', id)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}
