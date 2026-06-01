import type { Metadata } from 'next'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { ProjectsGallery, type GalleryProject } from '@/components/projects-gallery'
import type { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Projects',
  description: `Selected project work by ${siteConfig.name} across residential, hospitality, commercial, industrial, and community projects in Thailand.`,
}

const FALLBACK_IMAGE = '/images/scenario-commercial.jpg'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const [{ data: projectRows }, { data: categoryRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, category:categories(name), project_images(url, display_order, is_primary)')
      .eq('published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('name').order('display_order'),
  ])

  const projects: GalleryProject[] = ((projectRows as Project[]) ?? []).map((p, i) => {
    const images = (p.project_images ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((im) => im.url)
    return {
      id: p.id,
      number: String(i + 1).padStart(2, '0'),
      title: p.title,
      subtitle: p.subtitle ?? '',
      category: p.category?.name ?? 'Uncategorized',
      location: p.location ?? '',
      scope: p.scope ?? '',
      role: p.role ?? '',
      brief: p.brief ?? '',
      deliverables: p.deliverables ?? [],
      images: images.length ? images : [FALLBACK_IMAGE],
    }
  })

  const categories = (categoryRows ?? []).map((c) => c.name as string)

  return (
    <>
      {/* HERO */}
      <section className="bg-canvas border-b border-line py-8 lg:py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-5 animate-fade-in">
              Projects
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Some of Our Projects
            </h1>
          </div>
        </div>
      </section>

      <ProjectsGallery projects={projects} categories={categories} />
    </>
  )
}
