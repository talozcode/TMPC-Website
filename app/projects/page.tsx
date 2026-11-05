import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { getSeoRow } from '@/lib/seo'
import { ProjectsGallery, type GalleryProject } from '@/components/projects-gallery'
import { COMPARE } from '@/lib/compare-slots'
import { ScannerCardStream } from '@/components/ui/scanner-card-stream'
import { SplitHeading } from '@/components/anim/split-heading'
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
      images: ['/images/scenario-realestate.jpg'],
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

      {/* Hybrid: v3's transformations stream. One before/after card per
          sector slides through the scanner line, on a navy band that carries
          on from the hero. The three.js particle layer is off (particles={false}). */}
      <section className="dark-band on-dark pt-[clamp(1rem,3vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)] overflow-hidden">
        <div className="wrap">
          <p className="eye">Transformations</p>
          <SplitHeading className="t-h1 text-white mt-6 max-w-[16ch] mb-[clamp(2rem,4vw,3.5rem)]">
            {COMPARE.projects.heading.lead} <em>{COMPARE.projects.heading.em}</em>
          </SplitHeading>
        </div>
        <ScannerCardStream
          interactive={false}
          particles={false}
          tone="dark"
          ariaLabel="Before and after, one project per sector"
          cardImages={COMPARE.projects.cards.map((card) => ({
            before: card.before.src,
            after: card.after.src,
            beforeAlt: card.before.alt,
            afterAlt: card.after.alt,
            meta: `${card.sector} / ${card.location}`,
            title: card.title,
          }))}
        />
      </section>

      <ProjectsGallery projects={projects} categories={categories} />
    </>
  )
}
