import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const challengeInput = [
  'Owner / Investor', 'Architect', 'MEP Engineers', 'Interior Design',
  'Main Contractor', 'Subcontractors', 'Suppliers', 'Government Bodies',
]
const challengeOutput = [
  'Aligned Scope', 'Clear Communication', 'Execution Visibility', 'Timeline Confidence',
  'Budget Clarity', 'Stakeholder Alignment', 'Operational Readiness', 'On-time Delivery',
]
const services = [
  { number: '01', title: 'Project Consulting', description: 'Early-stage planning, scope definition, budgeting, and coordination strategy.' },
  { number: '02', title: 'Development Management', description: 'Oversight and coordination across all development phases, from concept through execution.' },
  { number: '03', title: 'Project Coordination', description: 'Structured communication between consultants, contractors, suppliers, and teams.' },
  { number: '04', title: 'Execution Oversight', description: 'Timeline tracking, progress reporting, site coordination, and issue management.' },
  { number: '05', title: 'Operational Setup', description: 'Pre-opening planning, vendor coordination, and operational environment preparation.' },
]
const projectTeasers = [
  { title: 'Mixed-Use Commercial', sector: 'Commercial', image: '/images/scenario-commercial.jpg' },
  { title: 'Industrial Expansion', sector: 'Industrial', image: '/images/scenario-industrial.jpg' },
  { title: 'Wellness Resort', sector: 'Wellness', image: '/images/scenario-wellness.jpg' },
  { title: 'Corporate Office Fit-Out', sector: 'Office', image: '/images/scenario-office.jpg' },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO: Site to Strategy ── */}
      <section className="bg-canvas border-b border-line overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-stretch py-20 lg:py-0">

            {/* Left: text */}
            <div className="flex flex-col justify-center lg:py-24">
              <p className="text-[0.65rem] font-semibold text-ink-muted uppercase tracking-[0.2em] mb-6 animate-fade-in">
                Bangkok, Thailand
              </p>
              <h1
                className="font-display font-bold text-5xl lg:text-[3.75rem] text-ink leading-[1.06] tracking-tight mb-7 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Project consulting for complex work in Thailand
              </h1>
              <p
                className="text-base lg:text-lg text-ink-secondary leading-relaxed max-w-lg mb-10 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC provides structured coordination, development management, and execution oversight for commercial, industrial, hospitality, and real estate projects across Thailand.
              </p>
              <div
                className="flex flex-wrap items-center gap-4 mb-12 animate-fade-up"
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
                className="hidden lg:flex items-center pt-6 border-t border-line animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                {['Bangkok-Based', 'Multi-Sector', 'Execution Oversight'].map((tag, i) => (
                  <span
                    key={tag}
                    className={`text-[0.65rem] font-semibold text-ink-muted uppercase tracking-[0.15em] pr-5 ${i > 0 ? 'pl-5 border-l border-line' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: image panel */}
            <div
              className="hidden lg:block relative overflow-hidden animate-fade-in"
              style={{ animationDelay: '0.15s', minHeight: '580px' }}
            >
              <Image
                src="/images/hero-about.jpg"
                alt="Project planning and coordination"
                fill
                className="object-cover"
                style={{ animation: 'img-drift 8s ease-in-out infinite' }}
                sizes="480px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628]/30 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A1628]/55 to-transparent" />

              {/* Coordination overlay */}
              <div
                className="absolute bottom-8 left-6 right-6"
                style={{ animation: 'fade-in 0.5s ease-out 0.65s both' }}
              >
                <div className="bg-[#0A1628]/90 border border-white/[0.1] p-5">
                  <p className="text-[0.48rem] font-bold text-accent uppercase tracking-[0.3em] mb-4">
                    TMPC Coordination Layer
                  </p>
                  <div className="mb-4">
                    {['Planning', 'Coordination', 'Oversight'].map((item, i) => (
                      <div
                        key={item}
                        style={{ animation: `fade-in 0.4s ease-out ${0.8 + i * 0.15}s both` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="text-[0.8rem] font-semibold text-white/80 uppercase tracking-[0.1em]">{item}</span>
                        </div>
                        {i < 2 && (
                          <div
                            className="w-px h-4 bg-accent/30 animate-flow-pulse ml-[2.5px]"
                            style={{ animationDelay: `${i * 0.4}s` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    className="pt-3 border-t border-white/[0.08] flex items-center gap-2"
                    style={{ animation: 'fade-in 0.4s ease-out 1.25s both' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                    <span className="text-[0.48rem] font-medium text-white/45 uppercase tracking-[0.22em]">
                      Project Flow Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THE COORDINATION CHALLENGE ── */}
      <section className="bg-canvas border-b border-line py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <FadeIn className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">The Challenge</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight mb-4">
              Complex projects need structure.
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              When owners, consultants, suppliers, contractors, timelines, budgets, and operations are all in motion at once, alignment does not happen on its own. Without a dedicated coordination layer, communication fragments, timelines slip, and execution falls behind. TMPC sits between the complexity and the outcome.
            </p>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="flex flex-col lg:flex-row items-stretch">

              <div className="flex-1 border border-line p-6 lg:p-8">
                <p className="text-[0.6rem] font-bold text-ink-muted uppercase tracking-[0.2em] mb-5">What comes in</p>
                <div className="space-y-2">
                  {challengeInput.map((s) => (
                    <div key={s} className="border border-line bg-canvas-subtle px-4 py-2.5 text-sm text-ink-secondary hover:border-accent/30 hover:text-ink transition-colors duration-200">{s}</div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center justify-center w-14 border-y border-line bg-canvas-subtle flex-shrink-0">
                <div className="flex-1 w-px bg-accent/20 animate-flow-pulse" />
                <span className="text-accent/60 text-sm my-3 flex-shrink-0" aria-hidden="true">&#8594;</span>
                <div className="flex-1 w-px bg-accent/20 animate-flow-pulse" style={{ animationDelay: '0.5s' }} />
              </div>

              <div className="lg:w-52 flex-shrink-0 bg-canvas-dark border border-white/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />
                <div className="relative z-10 p-6 lg:px-6 lg:py-10 flex flex-col h-full justify-center text-center">
                  <p className="text-[0.5rem] text-accent uppercase tracking-[0.3em] mb-3">Coordination Layer</p>
                  <p className="font-display font-bold text-[2.5rem] text-white tracking-tight leading-none mb-5 animate-hub-glow inline-block">TMPC</p>
                  <div className="space-y-1.5 mb-5">
                    {['Planning', 'Coordination', 'Oversight', 'Reporting'].map((s) => (
                      <div key={s} className="border border-accent/20 px-3 py-1.5 text-[0.55rem] text-white/50 uppercase tracking-wider">{s}</div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {[0, 0.4, 0.8].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center justify-center w-14 border-y border-accent/25 bg-accent/[0.03] flex-shrink-0">
                <div className="flex-1 w-px bg-accent/35 animate-flow-pulse" style={{ animationDelay: '0.8s' }} />
                <span className="text-accent/60 text-sm my-3 flex-shrink-0" aria-hidden="true">&#8594;</span>
                <div className="flex-1 w-px bg-accent/35 animate-flow-pulse" style={{ animationDelay: '1.2s' }} />
              </div>

              <div className="flex-1 border border-accent/30 bg-accent/[0.02] p-6 lg:p-8">
                <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-5">What TMPC delivers</p>
                <div className="space-y-2">
                  {challengeOutput.map((s) => (
                    <div key={s} className="border border-accent/20 bg-accent/[0.04] px-4 py-2.5 text-sm text-accent/80 hover:bg-accent/[0.09] transition-colors duration-200">{s}</div>
                  ))}
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">Services</p>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">What We Do</h2>
              </div>
              <Link href="/services" className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150">
                All services <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 80}>
                <div className="group bg-canvas border border-line p-7 lg:p-8 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <p className="text-[0.65rem] font-bold text-accent uppercase tracking-widest mb-5">{s.number}</p>
                  <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight leading-snug">{s.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1">{s.description}</p>
                  <div className="mt-6 w-8 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELECTED PROJECTS ── */}
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">Selected Work</p>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">Projects We Support</h2>
              </div>
              <Link href="/projects" className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150">
                View all projects <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-6 gap-3">
            {projectTeasers.slice(0, 2).map((p, i) => (
              <FadeIn key={p.title} delay={i * 100} className="col-span-6 sm:col-span-3">
                <Link href="/projects" className="group block relative overflow-hidden aspect-[4/3]">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/90 via-canvas-dark/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                    <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.22em] mb-2">{p.sector}</p>
                    <h3 className="font-display font-semibold text-xl lg:text-2xl text-white tracking-tight">{p.title}</h3>
                  </div>
                </Link>
              </FadeIn>
            ))}
            {projectTeasers.slice(2).map((p, i) => (
              <FadeIn key={p.title} delay={i * 80} className="col-span-6 sm:col-span-3 lg:col-span-2">
                <Link href="/projects" className="group block relative overflow-hidden aspect-[4/3]">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/90 via-canvas-dark/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.22em] mb-2">{p.sector}</p>
                    <h3 className="font-display font-semibold text-xl text-white tracking-tight">{p.title}</h3>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-canvas-dark py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-home.jpg" alt="" aria-hidden="true" fill className="object-cover opacity-[0.06]" />
        </div>
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark pointer-events-none" />
        <FadeIn className="relative z-10 max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">Get Started</p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, and execution throughout Thailand.
          </p>
          <Link href="/contact" className="inline-flex items-center text-sm font-semibold bg-accent text-white px-8 py-4 hover:bg-accent-dark transition-colors duration-200">
            Schedule a Consultation
          </Link>
        </FadeIn>
      </section>
    </>
  )
}
