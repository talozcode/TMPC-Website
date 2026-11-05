import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { getSeoRow } from '@/lib/seo'
import { ProjectsGallery, type GalleryProject } from '@/components/projects-gallery'
import { getShareImage } from '@/lib/projects'
import { toPhaseGroups } from '@/lib/project-phases'
import type { Project } from '@/lib/types'

const FALLBACK_TITLE = 'TMPC Projects: Completed Work Across Thailand'
const FALLBACK_DESCRIPTION = `Selected project work by ${siteConfig.name} across residential, hospitality, commercial, industrial, and community projects in Thailand.`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('projects')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || FALLBACK_DESCRIPTION
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/projects' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/projects',
      images: await getShareImage(),
    },
  }
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const [{ data: projectRows }, { data: categoryRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, category:categories(name), project_images(url, display_order, phase)')
      .eq('published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('name').order('display_order'),
  ])

  const projects: GalleryProject[] = ((projectRows as Project[]) ?? []).map((p, i) => ({
    id: p.id,
    // Falls back to the uuid so a project created without a slug is still reachable.
    slug: p.slug ?? p.id,
    number: String(i + 1).padStart(2, '0'),
    title: p.title,
    subtitle: p.subtitle ?? '',
    category: p.category?.name ?? 'Uncategorized',
    location: p.location ?? '',
    scope: p.scope ?? '',
    role: p.role ?? '',
    brief: p.brief ?? '',
    deliverables: p.deliverables ?? [],
    phases: toPhaseGroups(p.project_images),
  }))

  const categories = (categoryRows ?? []).map((c) => c.name as string)

  return (
    <>
      <section className="on-dark bg-canvas-dark">
        <div className="wrap py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <p className="eye">Projects</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6">Some of Our Projects</h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7">
              Selected work across residential, hospitality, commercial, industrial, and community
              projects, each one coordinated end to end by TMPC.
            </p>
          </Reveal>
        </div>
      </section>
      <ProjectsGallery projects={projects} categories={categories} />
    </>
  )
}
