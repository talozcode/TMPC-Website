import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { getSeoRow } from '@/lib/seo'
import { HeroBeforeAfter } from '@/components/hero-before-after'
import { Testimonials } from '@/components/testimonials'
import { CoordinationFlow } from '@/components/coordination-flow'
import type { HeroBeforeAfter as HeroBeforeAfterRow, Testimonial } from '@/lib/types'

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

const services = [
  { number: '01', title: 'Project Consulting', description: 'Not sure where to start? We structure the scope, budget, and coordination plan before anything is committed.' },
  { number: '02', title: 'Development Management', description: 'One party accountable for every consultant, contractor, and milestone. From concept through completion.' },
  { number: '03', title: 'Project Coordination', description: 'Multiple parties, fragmented communication. We run the coordination and documentation so nothing gets dropped.' },
  { number: '04', title: 'Execution Oversight', description: 'Cannot be on site every day? We are. Progress tracked, issues resolved, and the owner informed throughout.' },
  { number: '05', title: 'Operational Setup', description: 'Construction finished but operations not ready. We coordinate the handover so opening day is not improvised.' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: hero }, { data: testimonialRows }] = await Promise.all([
    supabase.from('hero_before_after').select('*').limit(1).maybeSingle<HeroBeforeAfterRow>(),
    supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true }),
  ])
  const testimonials = (testimonialRows as Testimonial[]) ?? []

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-canvas overflow-hidden">
        {/* Top padding shrunk (was clamp(3rem,7vw,6rem)): the eyebrow above the
            h1 is gone, and the client flagged the header-to-h1 gap as too big. */}
        <div className="wrap pt-[clamp(1.5rem,3.5vw,3rem)] pb-[clamp(3.5rem,7vw,6.5rem)]">
          {/* items-center here centers the image against just this row (headline,
              lead, CTAs) - the stats strip is deliberately outside it, below, so
              its extra height does not pull the image down off that center. */}
          <div className="grid lg:grid-cols-[1fr_minmax(0,30rem)] gap-14 lg:gap-16 items-center">
            <div className="flex flex-col">
              <Reveal>
                <h1 className="t-display text-ink">
                  Planning a project in Thailand? You need someone on the ground.
                </h1>
              </Reveal>
              <Reveal delay={90}>
                <p className="t-lead mt-7">
                  For international clients and investors, Thailand projects bring real complexity:
                  unfamiliar contractors, approval processes, language barriers, and a delivery
                  environment where local presence makes the difference. TMPC provides that presence.
                </p>
              </Reveal>
              <Reveal delay={170}>
                <div className="flex flex-wrap items-center gap-3 mt-9">
                  <Link href="/contact" className="btn">Discuss Your Project</Link>
                  <Link href="/services" className="btn-2">
                    Our Services <span aria-hidden="true">&#8594;</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <HeroBeforeAfter
                beforeUrl={hero?.before_url}
                afterUrl={hero?.after_url}
                projectName={hero?.project_name}
                projectDetails={hero?.project_details}
              />
            </Reveal>
          </div>

          {/* Client-advocacy line, replacing the old numeric stat row (1 / 10+ /
              Full): reuses the value+caption pattern the Quick Facts Rail used
              before it was removed, since that pairing was built for a short
              bold phrase plus a sentence-case caption, not for single tokens.
              Visible on every width now, not desktop-only, since the rail's
              mobile real estate is free. */}
          <Reveal delay={260}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mt-12 pt-8 border-t border-line">
              {[
                { value: 'We Represent You', label: 'Not the contractor. Your interests, first.' },
                { value: 'One Point of Contact', label: 'One team, start to finish.' },
                { value: 'Concept to Completion', label: 'Full lifecycle coverage, on the ground.' },
              ].map((stat, i) => (
                <div
                  key={stat.value}
                  className={
                    i > 0
                      ? 'pt-5 sm:pt-0 border-t sm:border-t-0 sm:border-l border-line sm:pl-6'
                      : ''
                  }
                >
                  <p className="font-display font-semibold text-[1.05rem] text-ink tracking-[-0.02em] leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[0.85rem] text-ink-muted leading-snug mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE CHALLENGE ── */}
      <section className="bg-canvas sec">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal>
              <p className="eye">Cost Protection</p>
              <h2 className="t-h1 text-ink mt-6">We save you money.</h2>
              <p className="t-lead mt-7">
                Projects in Thailand involve many people, many steps, and countless decisions.
                Without one team managing the full process, mistakes happen, costs increase, and
                timelines slip.
              </p>
              <p className="t-body text-ink-muted mt-5 max-w-[56ch]">
                TMPC represents you: we check quotes, negotiate with contractors and suppliers, and
                use our local network to find the right people at the right price. We manage the
                process and protect your budget.
              </p>
              <div className="mt-9">
                <Link href="/about" className="btn-2">
                  How we work <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </Reveal>

            {/* Placeholder: the client wants an image combining construction and
                budget/finance here. No such photo exists in public/images yet;
                swap this for a real one once available. */}
            <Reveal variant="image" delay={120}>
              <div className="panel relative aspect-[4/3]">
                <Image
                  src="/images/scenario-office.jpg"
                  alt="An office workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/45 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>

          {/* Coordination flow: replaces the old one-sentence statement band.
              See components/coordination-flow.tsx for why this shape and not
              the multi-box diagram this homepage tried and removed before. */}
          <Reveal delay={100}>
            <CoordinationFlow />
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-canvas-subtle sec">
        <div className="wrap">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(2.5rem,4vw,3.5rem)]">
              <div>
                <p className="eye">Services</p>
                <h2 className="t-h1 text-ink mt-6">What We Do</h2>
              </div>
              <Link href="/services" className="lnk">
                All services <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>

          {/* First row fills the 3-column grid exactly; the last two are their
              own centered row, so 5 cards never leave an empty slot on lg. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="flex">
                <div className="card card-hover press-sm group flex flex-col flex-1 p-8 lg:p-9">
                  <p className="text-[0.68rem] font-bold text-accent tracking-[0.2em] mb-6">{s.number}</p>
                  <h3 className="t-h3 text-ink mb-3.5">{s.title}</h3>
                  <p className="text-[0.95rem] text-ink-muted leading-relaxed flex-1">{s.description}</p>
                  <div className="mt-7 w-9 h-0.5 rounded-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:max-w-[calc(2/3*100%+1.25rem)] mt-5 lg:mx-auto">
            {services.slice(3).map((s, i) => (
              <Reveal key={s.title} delay={(i + 3) * 80} className="flex">
                <div className="card card-hover press-sm group flex flex-col flex-1 p-8 lg:p-9">
                  <p className="text-[0.68rem] font-bold text-accent tracking-[0.2em] mb-6">{s.number}</p>
                  <h3 className="t-h3 text-ink mb-3.5">{s.title}</h3>
                  <p className="text-[0.95rem] text-ink-muted leading-relaxed flex-1">{s.description}</p>
                  <div className="mt-7 w-9 h-0.5 rounded-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials testimonials={testimonials} />

      {/* ── CTA ── */}
      <section className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/scenario-commercial.jpg" alt="" aria-hidden="true" fill className="object-cover opacity-[0.09]" />
        </div>
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark pointer-events-none" />
        <div className="wrap relative z-10 sec">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Work With TMPC</p>
            <h2 className="t-h1 text-white mt-6">Most project problems are preventable.</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">Talk to TMPC before work begins.</p>
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
