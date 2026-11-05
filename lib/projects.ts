import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { isRealProjectImage, pickLeadImage } from '@/lib/project-phases'
import type { Project } from '@/lib/types'

/**
 * Real project photographs for the marketing sections (home, about, services).
 * The site shows no stock photography: a section either carries a photograph
 * from a TMPC project, captioned with that project, or no image at all.
 *
 * Same query, same anon server client, as the projects page. Wrapped in
 * cache() so a page and its generateMetadata share one read per request.
 */
export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*, category:categories(name), project_images(url, display_order, phase)')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  return (data as Project[]) ?? []
})

export interface ProjectPhoto {
  src: string
  alt: string
  title: string
  slug: string
  location: string
}

/**
 * One photograph from one project, by slug. Without a phase it is the
 * project's lead image (pickLeadImage); with one, the first real image of that
 * phase. Null when the project or a real photograph is missing, so the caller
 * lays the section out without an image.
 */
export function projectPhoto(
  projects: Project[],
  slug: string,
  phase?: 'rendering' | 'in_progress' | 'completed'
): ProjectPhoto | null {
  const p = projects.find((x) => x.slug === slug)
  if (!p) return null
  const src = phase
    ? (p.project_images ?? [])
        .filter((i) => (i.phase ?? 'completed') === phase && isRealProjectImage(i.url))
        .sort((a, b) => a.display_order - b.display_order)[0]?.url ?? null
    : pickLeadImage(p.project_images)
  if (!src) return null
  return {
    src,
    alt: `${p.title}${p.location ? `, ${p.location}` : ''}`,
    title: p.title,
    slug: p.slug ?? p.id,
    location: p.location ?? '',
  }
}

/** The share image for the main pages: a real project, never a stock photograph. */
export async function getShareImage(): Promise<string[] | undefined> {
  const photo = projectPhoto(await getPublishedProjects(), 'aura-wellness-phuket')
  return photo ? [photo.src] : undefined
}
