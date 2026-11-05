import type { Metadata } from 'next'
import { siteConfig } from '@/lib/data'
import { getSeoRow } from '@/lib/seo'
import { getHero, getProjects, getServices, getTestimonials } from '@/lib/content'
import { pickLeadImage } from '@/lib/project-phases'
import { orderServices, PROCESS, serviceImage, serviceSlug } from '@/lib/service-meta'
import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { HomeHero } from '@/components/home/home-hero'
import { FxStrip } from '@/components/home/fx-strip'
import { OwnerTable } from '@/components/home/owner-table'
import { CoreServices } from '@/components/home/core-services'
import { HeroBeforeAfter } from '@/components/hero-before-after'
import { Testimonials } from '@/components/testimonials'
import { ProcessTimeline } from '@/components/sections/process-timeline'
import { CtaBand } from '@/components/sections/cta-band'
import { FeaturedProjects, type FeaturedProject } from '@/components/sections/featured-projects'
import Link from 'next/link'
import { ArrowSwap, TextLink } from '@/components/ui/arrow-link'
import { COMPARE } from '@/lib/compare-slots'
import { PhoneMotion } from '@/components/home/phone-motion'

const FALLBACK_TITLE = `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('home')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || siteConfig.description
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/',
      images: ['/images/hero-home.jpg'],
    },
  }
}

const SECTORS = ['Commercial', 'Industrial', 'Hospitality', 'Wellness', 'Real Estate', 'Residential', 'Fit-Out']

// The short lines the v2 home page used for each service, keyed by anchor.
const BLURBS: Record<string, string> = {
  'project-consulting': 'Not sure where to start? We structure the scope, budget, and coordination plan before anything is committed.',
  'development-management': 'One party accountable for every consultant, contractor, and milestone. From concept through completion.',
  'project-coordination': 'Multiple parties, fragmented communication. We run the coordination and documentation so nothing gets dropped.',
  'execution-oversight': 'Cannot be on site every day? We are. Progress tracked, issues resolved, and the owner informed throughout.',
  'operational-setup': 'Construction finished but operations not ready. We coordinate the handover so opening day is not improvised.',
}

export default async function HomePage() {
  const [hero, testimonials, projects, services] = await Promise.all([
    getHero(),
    getTestimonials(),
    getProjects(),
    getServices(),
  ])

  const { core, rest } = orderServices(services)

  const featured: FeaturedProject[] = projects
    .map((p) => ({
      slug: p.slug ?? p.id,
      title: p.title,
      subtitle: p.subtitle ?? undefined,
      category: p.category?.name ?? 'Project',
      location: p.location ?? '',
      image: pickLeadImage(p.project_images) ?? '',
      role: p.role ?? undefined,
      scope: p.scope ?? undefined,
    }))
    .filter((p) => p.image)
    // Several projects can share a photograph; never show the same one twice.
    .filter((p, i, all) => all.findIndex((q) => q.image === p.image) === i)
    .slice(0, 3)

  // The admin's hero pair when both images are set, otherwise the registry
  // stand-ins, so the section always renders (locally there is no database).
  const fromAdmin = Boolean(hero?.before_url && hero?.after_url)
  const home = COMPARE.home

  return (
    <>
      <HomeHero />
      <FxStrip />

      {/* Position: who we are, as a diagram rather than a claim */}
      <section className="sec bg-paper">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-8">
            <SplitHeading className="t-h1 lg:col-span-7 max-w-[16ch]">
              Many teams on your project. <em>One conversation for you.</em>
            </SplitHeading>
            <Reveal delay={120} className="lg:col-span-5 lg:pt-3">
              <p className="t-lead">
                Architects, engineers, contractors and suppliers all report through TMPC. You get the decisions that need you, and none of the noise that does not.
              </p>
            </Reveal>
          </div>

          <div className="mt-[clamp(3.5rem,7vw,6rem)]">
            <OwnerTable />
          </div>

          <Reveal className="pm-sectors mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-3 rule-t pt-6">
            <p className="t-meta text-ink-muted">Sectors</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 font-semibold [font-variation-settings:'wdth'_108]" data-pm-lit>
              {SECTORS.map((s, i) => (
                <li key={s}>
                  <span className="pm-idx md:hidden t-meta" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* The two services we lead with */}
      {core.length > 0 && (
        <section className="bg-concrete pt-[var(--sec)] lg:pb-[calc(var(--sec)/2)] max-lg:pb-[var(--sec)]">
          <div className="wrap">
            <SplitHeading className="t-h1 max-w-[18ch] mb-[clamp(3rem,6vw,5rem)] lg:mb-10">
              Most clients come to us for <em>two things.</em>
            </SplitHeading>
            <CoreServices
              services={core.map((s) => {
                const img = serviceImage(s.title)
                return {
                  slug: serviceSlug(s.title),
                  number: s.number ?? '',
                  title: s.title,
                  description: s.description ?? '',
                  scope: s.scope_items.slice(0, 6),
                  image: img.src,
                  imageAlt: img.alt,
                }
              })}
            />
          </div>
        </section>
      )}

      {/* The rest of the practice */}
      {rest.length > 0 && (
        <section className="sec-sm bg-concrete !pt-0">
          <div className="wrap">
            <h2 className="t-h3 mb-6">Also across the project</h2>
            <div>
              {rest.map((s, i) => (
                <Reveal key={s.id} delay={i * 70}>
                  <Link href={`/services#${serviceSlug(s.title)}`} className="svc-row group">
                    <span className="t-meta text-ink-muted">{s.number}</span>
                    <span className="t-h2">{s.title}</span>
                    <span className="text-[0.98rem] text-ink-soft max-w-[52ch]">{BLURBS[serviceSlug(s.title)] ?? s.description}</span>
                    <ArrowSwap className="svc-arrow w-5 h-5 max-md:hidden justify-self-end" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How an engagement runs */}
      <section className="dark-band sec" data-tone="dark">
        <div className="wrap">
          <ProcessTimeline
            steps={PROCESS}
            heading={
              <>
                <SplitHeading className="t-h1 text-fog max-w-[13ch]">
                  One team, from first conversation <em>to opening day.</em>
                </SplitHeading>
                <Reveal delay={120}>
                  <p className="t-lead mt-7">
                    Bring us in at any stage. The earlier we start, the more of the cost and risk we can take out.
                  </p>
                </Reveal>
              </>
            }
          />
        </div>
      </section>

      {/* Before and after: the admin's pair, or the registry stand-ins */}
      <section className="sec bg-paper">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <SplitHeading className="t-h1">
              {home.heading.lead} <em>{home.heading.em}</em>
            </SplitHeading>
            <p className="t-meta text-ink-muted">{home.hint}</p>
          </div>
          <Reveal>
            <HeroBeforeAfter
              beforeUrl={fromAdmin ? hero?.before_url : home.before.src}
              afterUrl={fromAdmin ? hero?.after_url : home.after.src}
              projectName={fromAdmin ? hero?.project_name : null}
              projectDetails={fromAdmin ? hero?.project_details : null}
            />
          </Reveal>
        </div>
      </section>

      {/* Selected work */}
      {featured.length > 0 && (
        <section className="sec bg-paper !pt-0">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(2.5rem,5vw,4.5rem)]">
              <SplitHeading className="t-h1 max-w-[14ch]">
                Coordinated <em>end to end</em> by TMPC
              </SplitHeading>
              <Reveal>
                <TextLink href="/projects">All projects</TextLink>
              </Reveal>
            </div>
            <FeaturedProjects projects={featured} />
          </div>
        </section>
      )}

      <Testimonials testimonials={testimonials} />

      <CtaBand />
      <PhoneMotion />
    </>
  )
}
