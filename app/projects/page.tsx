import type { Metadata } from 'next'
import { siteConfig } from '@/lib/data'
import { getSeoRow } from '@/lib/seo'
import { getCategoryNames, getProjects } from '@/lib/content'
import { ProjectsGallery, type GalleryProject } from '@/components/projects-gallery'
import { PageHero } from '@/components/sections/page-hero'
import { CtaBand } from '@/components/sections/cta-band'
import { toPhaseGroups } from '@/lib/project-phases'
import { COMPARE } from '@/lib/compare-slots'
import { ScannerCardStream } from '@/components/ui/scanner-card-stream'
import { SplitHeading } from '@/components/anim/split-heading'

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
  const [rows, allCategories] = await Promise.all([getProjects(), getCategoryNames()])

  const projects: GalleryProject[] = rows.map((p, i) => ({
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

  // Only offer filters that would show something.
  const categories = allCategories.filter((c) => projects.some((p) => p.category === c))

  return (
    <>
      <PageHero
        label="Projects"
        title={
          <>
            Some of our <em>projects</em>
          </>
        }
        lead="Selected work across residential, hospitality, commercial, industrial, and community projects, each one coordinated end to end by TMPC."
      />
      {/* Transformations: before and after, one card per sector */}
      <section className="dark-band pt-[clamp(1rem,3vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)]" data-tone="dark" data-first="">
        <div className="wrap">
          <SplitHeading className="t-h1 max-w-[16ch] mb-[clamp(2.5rem,5vw,4rem)]">
            {COMPARE.projects.heading.lead} <em>{COMPARE.projects.heading.em}</em>
          </SplitHeading>
        </div>
        <ScannerCardStream
          interactive={false}
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
      <CtaBand
        title={
          <>
            Discuss your <em>project</em>
          </>
        }
        lead="Tell us what you are planning. We will give you an honest picture of what it takes to deliver it in Thailand."
      />
    </>
  )
}
