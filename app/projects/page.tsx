import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { ProjectsGallery, type GalleryProject } from '@/components/projects-gallery'
import { toPhaseGroups } from '@/lib/project-phases'
import type { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Projects',
  description: `Selected project work by ${siteConfig.name} across residential, hospitality, commercial, industrial, and community projects in Thailand.`,
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
      <section id="proj-hero" className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/scenario-realestate.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 scale-110"
            style={{ translate: '0 var(--par, 0%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas-dark via-canvas-dark/85 to-canvas-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark/60" />
        </div>
        <div className="wrap relative z-10 py-[clamp(3.5rem,7vw,6rem)]">
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
      <HeroParallax targetId="proj-hero" amount={8} />

      <ProjectsGallery projects={projects} categories={categories} />
    </>
  )
}
