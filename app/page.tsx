import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { HeroProjectCarousel, type HeroProject } from '@/components/hero-project-carousel'
import type { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const services = [
  { number: '01', title: 'Project Consulting', description: 'Not sure where to start? We structure the scope, budget, and coordination plan before anything is committed.' },
  { number: '02', title: 'Development Management', description: 'One party accountable for every consultant, contractor, and milestone. From concept through completion.' },
  { number: '03', title: 'Project Coordination', description: 'Multiple parties, fragmented communication. We run the coordination and documentation so nothing gets dropped.' },
  { number: '04', title: 'Execution Oversight', description: 'Cannot be on site every day? We are. Progress tracked, issues resolved, and the owner informed throughout.' },
  { number: '05', title: 'Operational Setup', description: 'Construction finished but operations not ready. We coordinate the handover so opening day is not improvised.' },
]

const rail = [
  { value: 'Bangkok based', label: 'On the ground in Thailand' },
  { value: 'English and Thai', label: 'Bilingual coordination' },
  { value: 'Owner side', label: 'We do not build, we manage' },
  { value: 'Concept to handover', label: 'Full lifecycle coverage' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: heroRows }, { data: slideRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, deliverables, category:categories(name), project_images(url, display_order, is_primary)')
      .eq('published', true)
      .order('display_order', { ascending: true })
      .limit(6),
    supabase.from('site_settings').select('value').eq('key', 'hero_slide_seconds').limit(1),
  ])

  const heroProjects: HeroProject[] = ((heroRows as unknown as Project[]) ?? [])
    .map((p) => {
      const imgs = (p.project_images ?? []).slice().sort((a, b) => a.display_order - b.display_order)
      const primary = imgs.find((im) => im.is_primary) ?? imgs[0]
      return primary
        ? {
            id: p.id,
            title: p.title,
            category: p.category?.name ?? '',
            image: primary.url,
            deliverables: p.deliverables ?? [],
          }
        : null
    })
    .filter((p): p is HeroProject => p !== null)

  // Admin-configurable slide duration (Settings, "Hero Slide Duration"); defaults to 4s.
  const slideSeconds = Number(slideRows?.[0]?.value)
  const heroIntervalMs = Number.isFinite(slideSeconds) && slideSeconds >= 1 ? slideSeconds * 1000 : 4000

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-canvas overflow-hidden">
        <div className="wrap">
          <div className="grid lg:grid-cols-[1fr_minmax(0,30rem)] gap-14 lg:gap-16 items-center pt-[clamp(3rem,7vw,6rem)] pb-[clamp(3.5rem,7vw,6.5rem)]">

            <div className="flex flex-col">
              <Reveal>
                <p className="eye">Bangkok, Thailand</p>
              </Reveal>
              <Reveal delay={90}>
                <h1 className="t-display text-ink mt-6">
                  Planning a project in Thailand? You need someone on the ground.
                </h1>
              </Reveal>
              <Reveal delay={170}>
                <p className="t-lead mt-7">
                  For international clients and investors, Thailand projects bring real complexity:
                  unfamiliar contractors, approval processes, language barriers, and a delivery
                  environment where local presence makes the difference. TMPC provides that presence.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="flex flex-wrap items-center gap-3 mt-9">
                  <Link href="/contact" className="btn">Discuss Your Project</Link>
                  <Link href="/services" className="btn-2">
                    Our Services <span aria-hidden="true">&#8594;</span>
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={330}>
                {/* An even three-up grid rather than inline dividers: the labels
                    set at different widths, so hand-spaced rules collided with them. */}
                <div className="hidden lg:grid grid-cols-3 max-w-lg mt-12 pt-8 border-t border-line">
                  {[
                    { value: '1', label: 'Point of Accountability' },
                    { value: '10+', label: 'Parties per Project' },
                    { value: 'Full', label: 'Lifecycle Coverage' },
                  ].map((stat, i) => (
                    <div key={stat.label} className={i > 0 ? 'pl-6 border-l border-line' : 'pr-6'}>
                      <p className="font-display font-bold text-[1.6rem] text-ink leading-none tracking-[-0.03em] mb-2.5">
                        {stat.value}
                      </p>
                      <p className="text-[0.6rem] text-ink-muted uppercase tracking-[0.11em] leading-[1.5]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <HeroProjectCarousel projects={heroProjects} intervalMs={heroIntervalMs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── QUICK FACTS RAIL ── */}
      <section className="bg-canvas-subtle border-y border-line-subtle">
        <div className="wrap">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7 py-9">
            {rail.map((r, i) => (
              <Reveal key={r.value} delay={i * 70}>
                <p className="font-display font-semibold text-[1.05rem] text-ink tracking-[-0.02em] leading-tight">
                  {r.value}
                </p>
                <p className="text-[0.85rem] text-ink-muted leading-snug mt-1.5">{r.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CHALLENGE ── */}
      <section className="bg-canvas sec">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal>
              <p className="eye">The Challenge</p>
              <h2 className="t-h1 text-ink mt-6">What most projects are missing from day one.</h2>
              <p className="t-lead mt-7">
                International projects in Thailand bring together architects, contractors,
                subcontractors, MEP engineers, government approval processes, and suppliers, often
                managed by an owner who is overseas and unfamiliar with how things work here.
              </p>
              <p className="t-body text-ink-muted mt-5 max-w-[56ch]">
                No single party coordinates the whole. Communication breaks down, timelines drift,
                and accountability disappears. TMPC closes that gap.
              </p>
              <div className="mt-9">
                <Link href="/about" className="btn-2">
                  How we work <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </Reveal>

            <Reveal variant="image" delay={120}>
              <div className="panel relative aspect-[4/3]">
                <Image
                  src="/images/hero-home.jpg"
                  alt="The Bangkok skyline at night"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/45 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>

          {/* Statement band */}
          <Reveal delay={100}>
            <div className="on-dark panel relative bg-canvas-dark mt-[clamp(3rem,6vw,5rem)] px-8 py-10 lg:px-14 lg:py-14">
              <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
              <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-14">
                <div className="max-w-2xl">
                  <p className="eye">One Coordination Layer</p>
                  <p className="t-h3 text-white mt-5 !text-[1.35rem] lg:!text-[1.75rem] !leading-snug">
                    TMPC sits between 8+ parties, two languages, and every approval, turning
                    fragmented input into <span className="text-accent-light">aligned delivery</span>.
                  </p>
                </div>
                <div className="flex gap-7 mt-9 lg:mt-0 lg:flex-shrink-0">
                  {[
                    { v: '8+', l: 'Parties' },
                    { v: '2', l: 'Languages' },
                    { v: '1', l: 'Accountable Partner' },
                  ].map((s, i) => (
                    <div key={s.l} className={i > 0 ? 'pl-7 border-l border-white/10' : ''}>
                      <p className="font-display font-bold text-[1.9rem] lg:text-[2.2rem] text-white leading-none tracking-[-0.035em] mb-2">
                        {s.v}
                      </p>
                      <p className="text-[0.58rem] text-white/40 uppercase tracking-[0.16em] leading-tight max-w-[9ch]">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 80} className="flex">
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
