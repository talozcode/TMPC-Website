import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { getSeoRow } from '@/lib/seo'
import type { Service } from '@/lib/types'
import { isCore, PROCESS, serviceSlug } from '@/lib/service-meta'
import { ServiceIndex } from '@/components/sections/service-index'
import { ProcessTimeline } from '@/components/sections/process-timeline'
import { ProjectPhoto } from '@/components/project-photo'
import { getPublishedProjects, getShareImage, projectPhoto, type ProjectPhoto as Photo } from '@/lib/projects'

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
      images: await getShareImage(),
    },
  }
}

export default async function ServicesPage() {
  const supabase = await createClient()
  const [{ data: serviceRows }, projects] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true }),
    getPublishedProjects(),
  ])

  // Only the two core services carry a photograph, each a real TMPC project;
  // the rest are text. No stock, no compare sliders.
  const photos: Record<string, { photo: Photo | null; note?: string }> = {
    'development-management': { photo: projectPhoto(projects, 'bright-phuket') },
    'execution-oversight': { photo: projectPhoto(projects, 'aura-wellness-phuket', 'in_progress'), note: 'On site' },
  }

  const coreServices = ((serviceRows as Service[]) ?? []).map((s, i) => ({
    slug: serviceSlug(s.title),
    number: s.number ?? String(i + 1).padStart(2, '0'),
    title: s.title,
    description: s.description ?? '',
    scope: s.scope_items ?? [],
    core: isCore(s),
  }))
  const indexItems = coreServices.map((s) => ({ slug: s.slug, number: s.number, title: s.title }))

  return (
    <>
      {/* 1. Hero */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap py-[clamp(4.5rem,9vw,8rem)]">
          <Reveal>
            <p className="eye">Services</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6 max-w-[16ch]">How TMPC manages your project</h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7">
              From the first planning conversation to handover, TMPC manages the coordination,
              oversight, and reporting across every phase, in Bangkok, Phuket, and beyond. One
              accountable partner throughout.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Core Services. Hybrid: v3's services rail beside one article per
          service, so the reader always sees where they are in the list. */}
      <section className="bg-canvas-subtle sec">
        <div className="wrap">
          <Reveal className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <p className="eye">Core Services</p>
            <h2 className="t-h1 text-ink mt-6">What We Provide</h2>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-x-10">
            <aside className="hidden lg:block lg:col-span-3">
              <ServiceIndex items={indexItems} />
            </aside>

            <div className="lg:col-span-9 grid gap-[clamp(4rem,8vw,6.5rem)]">
              {/* Below 1024px the rail has no room beside the text, so the same
                  index opens the section: every service, numbered, one tap away. */}
              <nav aria-label="Services on this page" className="lg:hidden -mb-[clamp(1rem,3vw,2rem)]">
                <ol className="grid sm:grid-cols-2 sm:gap-x-8 border-t border-line">
                  {indexItems.map((i) => (
                    <li key={i.slug}>
                      <a
                        href={`#${i.slug}`}
                        className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-2 min-h-[3.25rem] py-3.5 border-b border-line"
                      >
                        <span className="t-meta text-ink-muted">{i.number}</span>
                        <span className="font-display font-semibold text-ink">{i.title}</span>
                        <span aria-hidden="true" className="text-ink-muted">&#8595;</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {coreServices.map((service, i) => {
                const pic = service.core ? photos[service.slug] : undefined
                return (
                  <article key={service.title} id={service.slug} className="scroll-mt-[calc(var(--hdr-h)+2rem)]">
                    <Reveal>
                      <p className="t-meta text-accent flex items-center gap-3">
                        <span>{service.number}</span>
                        {service.core && (
                          <>
                            <span className="inline-block w-4 h-px bg-line" aria-hidden="true" />
                            <span className="text-ink">Core service</span>
                          </>
                        )}
                      </p>
                    </Reveal>
                    <h2 className="t-h2 text-ink mt-4">{service.title}</h2>
                    {service.description && (
                      <Reveal delay={80}>
                        <p className="t-lead mt-5">{service.description}</p>
                      </Reveal>
                    )}
                    {pic?.photo && (
                      <Reveal delay={120} className="mt-9">
                        <ProjectPhoto
                          photo={pic.photo}
                          note={pic.note}
                          aspect="aspect-[4/3] md:aspect-[16/9]"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          priority={i === 0}
                        />
                      </Reveal>
                    )}
                    {service.scope.length > 0 && (
                      <Reveal delay={80} className="mt-9 grid md:grid-cols-[10rem_1fr] gap-x-10 gap-y-4">
                        <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.2em] pt-1.5">
                          Fact Sheet
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-x-8">
                          {service.scope.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 py-3 border-b border-line text-[0.95rem] text-ink-secondary leading-snug">
                              <span className="w-1 h-1 bg-ink-muted mt-2.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Reveal>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Process. Hybrid: the v3 process index on a navy band. */}
      <section className="dark-band on-dark sec">
        <div className="wrap">
          <ProcessTimeline
            steps={PROCESS}
            heading={
              <>
                <div>
                  <p className="eye">Process</p>
                  <h2 className="t-h1 text-white mt-6 max-w-[14ch]">
                    How TMPC <em>works</em>
                  </h2>
                </div>
                <Reveal delay={120}>
                  <p className="t-lead">
                    Each stage of a project, and the service that covers it. Join at any point; the earlier, the more we can protect.
                  </p>
                </Reveal>
              </>
            }
          />
        </div>
      </section>

      {/* 4. CTA */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Get in Touch</p>
            <h2 className="t-h1 text-white mt-6">Discuss Your Project</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              Tell us what you are building. We will tell you what it takes to deliver it correctly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/contact" className="btn">Schedule a Consultation</Link>
              <Link href="/projects" className="btn-2">
                See our work <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
