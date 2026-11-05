import type { Metadata } from 'next'
import Image from 'next/image'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { getSeoRow } from '@/lib/seo'
import { getServices } from '@/lib/content'
import { isCore, orderServices, PROCESS, serviceImage, serviceSlug } from '@/lib/service-meta'
import { PageHero } from '@/components/sections/page-hero'
import { CtaBand } from '@/components/sections/cta-band'
import { ProcessTimeline } from '@/components/sections/process-timeline'
import { ServiceIndex } from '@/components/sections/service-index'
import { Arrow } from '@/components/ui/arrow-link'
import { SplitHeading } from '@/components/anim/split-heading'
import { Parallax } from '@/components/anim/parallax'
import { TransformFloors } from '@/components/transform/transform-floors'
import { COMPARE } from '@/lib/compare-slots'

// Cached and refreshed at most once a minute; admin edits call revalidatePath so they show sooner.
export const revalidate = 60

// The two core services show their before/after pair as floors rising
// (TransformFloors), so swapping that pair in lib/compare-slots.ts updates
// this page too. The other services keep a single photograph.
const CORE_COMPARE: Record<string, (typeof COMPARE)['services-dm' | 'services-eo']> = {
  'development-management': COMPARE['services-dm'],
  'execution-oversight': COMPARE['services-eo'],
}

const FALLBACK_TITLE = 'TMPC Services: Consulting, Coordination & Execution Oversight'
const FALLBACK_DESCRIPTION = `${siteConfig.name} provides project consulting, development management, project coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects in Thailand.`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('services')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || FALLBACK_DESCRIPTION
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/services' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/services',
      images: ['/images/hero-services.jpg'],
    },
  }
}

export default async function ServicesPage() {
  const services = await getServices()
  const { core, rest } = orderServices(services)
  const ordered = [...core, ...rest]
  const items = ordered.map((s) => ({ slug: serviceSlug(s.title), number: s.number ?? '', title: s.title }))

  return (
    <>
      <PageHero
        label="Services"
        title={
          <>
            How TMPC manages <em>your project</em>
          </>
        }
        lead="From the first planning conversation to handover, TMPC manages the coordination, oversight, and reporting across every phase, in Bangkok, Phuket, and beyond. One accountable partner throughout."
      />

      <section className="sec bg-paper">
        <div className="wrap grid lg:grid-cols-12 gap-x-10">
          <aside className="hidden lg:block lg:col-span-3">
            <ServiceIndex items={items} />
          </aside>

          <div className="lg:col-span-8 lg:col-start-5 grid gap-[clamp(5rem,10vw,8rem)]">
            {/* Below 1024px the rail has no room beside the text, so the same
                index opens the section: every service, numbered, one tap away. */}
            <nav aria-label="Services on this page" className="lg:hidden -mb-[clamp(1.5rem,4vw,3rem)]">
              <ol className="grid sm:grid-cols-2 sm:gap-x-10 border-t border-ink">
                {items.map((i) => (
                  <li key={i.slug}>
                    <a
                      href={`#${i.slug}`}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-2 min-h-[3.25rem] py-3.5 border-b border-rule-soft"
                    >
                      <span className="t-meta text-ink-muted">{i.number}</span>
                      <span className="font-semibold [font-variation-settings:'wdth'_106]">{i.title}</span>
                      <Arrow className="w-3.5 h-3.5 rotate-90 self-center text-ink-muted transition-transform duration-300 group-active:translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {ordered.map((s, i) => {
              const slug = serviceSlug(s.title)
              const img = serviceImage(s.title)
              const core = isCore(s)
              const compare = core ? CORE_COMPARE[slug] : undefined
              return (
                <article key={s.id} id={slug} className="scroll-mt-[calc(var(--hdr-h)+2rem)]">
                  <Reveal>
                    <p className="t-meta text-ink-muted flex items-center gap-3">
                      <span>{s.number}</span>
                      {core && (
                        <>
                          <span className="inline-block w-1.5 h-1.5 bg-signal" aria-hidden="true" />
                          <span className="text-ink">Core service</span>
                        </>
                      )}
                    </p>
                  </Reveal>
                  <SplitHeading className="t-h1 mt-4">{s.title}</SplitHeading>
                  {s.description && (
                    <Reveal delay={80}>
                      <p className="t-lead mt-6 !max-w-[56ch]">{s.description}</p>
                    </Reveal>
                  )}
                  {compare ? (
                    <Reveal delay={120} className="mt-10">
                      <TransformFloors
                        before={compare.before}
                        after={compare.after}
                        labels={compare.labels}
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        preload={i === 0}
                        className="aspect-[16/9]"
                      />
                    </Reveal>
                  ) : (
                    <Reveal variant="image" delay={120} className="mt-10">
                      <div className="frame aspect-[16/9]">
                        <Parallax amount={6}>
                          <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 100vw, 66vw" priority={i === 0} className="object-cover photo" />
                        </Parallax>
                        <div className="photo-tint" />
                      </div>
                    </Reveal>
                  )}
                  {s.scope_items.length > 0 && (
                    <div className="mt-10 grid md:grid-cols-[12rem_1fr] gap-x-10 gap-y-4">
                      <h3 className="t-meta text-ink-muted pt-1">What it covers</h3>
                      <ul className="grid sm:grid-cols-2 gap-x-8">
                        {s.scope_items.map((item) => (
                          <li key={item} className="flex gap-3 py-3 border-b border-rule-soft">
                            <span className="mt-[0.62em] w-1.5 h-1.5 bg-signal shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="dark-band sec" data-tone="dark">
        <div className="wrap">
          <ProcessTimeline
            steps={PROCESS}
            heading={
              <>
                <SplitHeading className="t-h1 text-fog max-w-[13ch]">
                  How TMPC <em>works</em>
                </SplitHeading>
                <Reveal delay={120}>
                  <p className="t-lead mt-7">
                    Each stage of a project, and the service that covers it. Join at any point; the earlier, the more we can protect.
                  </p>
                </Reveal>
              </>
            }
          />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Discuss your <em>project</em>
          </>
        }
        lead="Tell us what you are building. We will tell you what it takes to deliver it correctly."
      />
    </>
  )
}
