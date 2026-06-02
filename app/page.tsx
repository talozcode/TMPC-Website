import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
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

  // Admin-configurable slide duration (Settings → "Hero Slide Duration"); defaults to 4s.
  const slideSeconds = Number(slideRows?.[0]?.value)
  const heroIntervalMs = Number.isFinite(slideSeconds) && slideSeconds >= 1 ? slideSeconds * 1000 : 4000

  return (
    <>
      {/* ── HERO: Site to Strategy ── */}
      <section className="bg-canvas border-b border-line overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_520px] gap-16 items-stretch py-20 lg:py-0">

            {/* Left: text */}
            <div className="flex flex-col justify-center lg:py-14">
              <p className="text-[0.65rem] font-semibold text-ink-muted uppercase tracking-[0.2em] mb-6 animate-fade-in">
                Bangkok, Thailand
              </p>
              <h1
                className="font-display font-bold text-5xl lg:text-[3.75rem] text-ink leading-[1.06] tracking-tight mb-7 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Planning a project in Thailand? You need someone on the ground.
              </h1>
              <p
                className="text-base lg:text-lg text-ink-secondary leading-relaxed max-w-lg mb-6 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                For international clients and investors, Thailand projects bring real complexity: unfamiliar contractors, approval processes, language barriers, and a delivery environment where local presence makes the difference. TMPC provides that presence.
              </p>
              <div
                className="flex flex-wrap items-center gap-4 mb-8 animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200"
                >
                  Discuss Your Project
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5 hover:border-accent/60 hover:text-accent transition-all duration-200"
                >
                  Our Services <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
              <div
                className="hidden lg:flex items-center gap-0 pt-6 border-t border-line animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                {[
                  { value: '1', label: 'Point of Accountability' },
                  { value: '10+', label: 'Parties per Project' },
                  { value: 'Full', label: 'Lifecycle Coverage' },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex flex-col ${i > 0 ? 'pl-6 border-l border-line ml-6' : ''}`}>
                    <span className="font-display font-bold text-xl text-ink leading-none mb-1">{stat.value}</span>
                    <span className="text-[0.56rem] text-ink-muted uppercase tracking-[0.15em]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: project carousel */}
          <HeroProjectCarousel projects={heroProjects} intervalMs={heroIntervalMs} />

          </div>
        </div>
      </section>

      {/* ── THE COORDINATION CHALLENGE ── */}
      <section className="bg-canvas border-b border-line py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <FadeIn className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">The Challenge</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight mb-4">
              What most projects are missing from day one.
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              International projects in Thailand bring together architects, contractors, subcontractors, MEP engineers, government approval processes, and suppliers, often managed by an owner who is overseas and unfamiliar with how things work here. No single party coordinates the whole. Communication breaks down, timelines drift, and accountability disappears. TMPC closes that gap.
            </p>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="relative overflow-hidden bg-canvas-dark border border-white/[0.08] p-8 lg:p-10">
              <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
              <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
                <div className="max-w-2xl">
                  <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.25em] mb-3">One Coordination Layer</p>
                  <p className="font-display text-xl lg:text-[1.7rem] text-white leading-snug tracking-tight">
                    TMPC sits between 8+ parties, two languages, and every approval &mdash; turning fragmented input into <span className="text-accent-light">aligned delivery</span>.
                  </p>
                </div>
                <div className="flex gap-5 sm:gap-6 mt-7 lg:mt-0 lg:flex-shrink-0">
                  {[
                    { v: '8+', l: 'Parties' },
                    { v: '2', l: 'Languages' },
                    { v: '1', l: 'Accountable Partner' },
                  ].map((s, i) => (
                    <div key={s.l} className={i > 0 ? 'pl-5 sm:pl-6 border-l border-white/10' : ''}>
                      <p className="font-display font-bold text-2xl lg:text-3xl text-white leading-none mb-1">{s.v}</p>
                      <p className="text-[0.52rem] text-white/40 uppercase tracking-[0.15em] leading-tight">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-canvas-subtle border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">Services</p>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">What We Do</h2>
              </div>
              <Link href="/services" className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150">
                All services <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </FadeIn>

          {/* Mobile: sticky stacked deck (cards slide up over each other on scroll).
              sm+: regular grid. */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.title}
                style={{ top: `${80 + i * 12}px`, zIndex: i + 1 }}
                className="group sticky sm:static top-20 flex flex-col min-h-[210px] sm:min-h-0 bg-canvas border border-line p-7 lg:p-8 shadow-[0_-8px_28px_rgba(10,22,40,0.06)] sm:shadow-none hover:border-accent/50 sm:hover:shadow-lg sm:hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-[0.65rem] font-bold text-accent uppercase tracking-widest mb-5">{s.number}</p>
                <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight leading-snug">{s.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{s.description}</p>
                <div className="mt-6 w-8 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-canvas-dark py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-home.jpg" alt="" aria-hidden="true" fill className="object-cover opacity-[0.06]" />
        </div>
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark pointer-events-none" />
        <FadeIn className="relative z-10 max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">Work With TMPC</p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Most project problems are preventable.
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            Talk to TMPC before work begins.
          </p>
          <Link href="/contact" className="inline-flex items-center text-sm font-semibold bg-accent text-white px-8 py-4 hover:bg-accent-dark transition-colors duration-200">
            Schedule a Consultation
          </Link>
        </FadeIn>
      </section>
    </>
  )
}
