import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const projectSide = ['Owner / Investor', 'Architect', 'Interior Designer', 'MEP Engineers']
const executionSide = ['Main Contractor', 'Subcontractors', 'Suppliers', 'Operations Team']

const services = [
  {
    number: '01',
    title: 'Project Consulting',
    description: 'Early-stage planning, scope definition, budgeting, and coordination strategy for projects of all scales.',
  },
  {
    number: '02',
    title: 'Development Management',
    description: 'Oversight and coordination across all development phases, from concept through implementation.',
  },
  {
    number: '03',
    title: 'Project Coordination',
    description: 'Structured communication between consultants, contractors, suppliers, and operational teams.',
  },
  {
    number: '04',
    title: 'Execution Oversight',
    description: 'Timeline tracking, progress reporting, site coordination, and issue management.',
  },
  {
    number: '05',
    title: 'Operational Setup',
    description: 'Pre-opening planning, vendor coordination, and operational environment preparation.',
  },
]

const sectors = [
  'Commercial',
  'Industrial & Factory Setup',
  'Real Estate & Renovation',
  'Wellness & Hospitality',
  'Warehousing & Operations',
]

const whyItems = [
  {
    title: 'International Communication Standards',
    description: 'Clear, structured project communication built to international working expectations, regardless of project location or team composition.',
  },
  {
    title: 'Bangkok-Based Coordination',
    description: 'On-the-ground presence in Thailand providing real-time coordination support, local knowledge, and consistent execution management.',
  },
  {
    title: 'Agile, Cross-Sector Experience',
    description: 'Practical experience across commercial, industrial, and real estate environments, with an adaptable approach to each project scope.',
  },
]

const processSteps = [
  { step: '01', label: 'Project Review' },
  { step: '02', label: 'Planning & Structure' },
  { step: '03', label: 'Coordination' },
  { step: '04', label: 'Execution' },
  { step: '05', label: 'Handover' },
]

const scenarios = [
  {
    title: 'Commercial Projects',
    sector: 'Commercial',
    image: '/images/scenario-commercial.jpg',
  },
  {
    title: 'Industrial & Factory',
    sector: 'Industrial',
    image: '/images/scenario-industrial.jpg',
  },
  {
    title: 'Wellness & Hospitality',
    sector: 'Wellness',
    image: '/images/scenario-wellness.jpg',
  },
  {
    title: 'Real Estate & Renovation',
    sector: 'Real Estate',
    image: '/images/scenario-realestate.jpg',
  },
  {
    title: 'Warehousing & Operations',
    sector: 'Operations',
    image: '/images/scenario-warehouse.jpg',
  },
]

export default function HomePage() {
  return (
    <>
      {/* 1. Hero: dark navy, coordination diagram */}
      <section className="relative bg-canvas-dark min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-canvas-dark via-navy/60 to-canvas-dark pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/50 mb-8 tracking-[0.2em] uppercase animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                Bangkok, Thailand
              </div>

              <h1
                className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.25rem] text-white leading-[1.08] tracking-tight mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Project Consulting and Development Management in Thailand
              </h1>

              <p
                className="text-base text-white/55 leading-relaxed max-w-lg mb-10 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC provides structured coordination, development management, and execution oversight across commercial, industrial, hospitality, and real estate projects throughout Thailand.
              </p>

              <div
                className="flex flex-wrap items-center gap-4 animate-fade-up"
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
                  className="text-sm text-white/45 hover:text-white flex items-center gap-1.5 transition-colors duration-150"
                >
                  Our Services <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>

              {/* Process strip */}
              <div className="hidden lg:flex items-center gap-0 mt-14 pt-8 border-t border-white/8">
                {processSteps.map((s, i) => (
                  <div key={s.step} className="flex items-center gap-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] font-semibold text-accent">{s.step}</span>
                      <span className="text-[0.7rem] text-white/35 whitespace-nowrap">{s.label}</span>
                    </div>
                    {i < processSteps.length - 1 && (
                      <span className="mx-3 text-white/15 text-xs" aria-hidden="true">&#8594;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Coordination diagram */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[0.6rem] text-white/25 uppercase tracking-[0.25em] mb-5 text-center">
                  Project Ecosystem
                </p>

                {/* Project side */}
                <div className="grid grid-cols-2 gap-2 mb-0">
                  {projectSide.map((p) => (
                    <div key={p} className="border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.7rem] text-white/50 text-center leading-tight">
                      {p}
                    </div>
                  ))}
                </div>

                {/* Connectors */}
                <div className="grid grid-cols-4 py-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-center">
                      <div className="w-px h-4 bg-accent/25" />
                    </div>
                  ))}
                </div>

                {/* TMPC bar */}
                <div className="border border-accent/40 bg-accent/10 py-5 px-5 flex items-center justify-between">
                  <div>
                    <p className="text-[0.55rem] text-accent/70 uppercase tracking-[0.2em] mb-0.5">Coordination Layer</p>
                    <p className="text-white font-bold text-lg leading-none">TMPC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.55rem] text-white/20 uppercase tracking-[0.15em]">Development</p>
                    <p className="text-[0.6rem] text-white/30 mt-0.5">Bangkok, Thailand</p>
                  </div>
                </div>

                {/* Connectors */}
                <div className="grid grid-cols-4 py-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-center">
                      <div className="w-px h-4 bg-accent/25" />
                    </div>
                  ))}
                </div>

                {/* Execution side */}
                <div className="grid grid-cols-2 gap-2">
                  {executionSide.map((p) => (
                    <div key={p} className="border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.7rem] text-white/50 text-center leading-tight">
                      {p}
                    </div>
                  ))}
                </div>

                <p className="text-[0.6rem] text-white/15 text-center mt-4 tracking-wide">
                  One coordination layer. Every party aligned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Challenge */}
      <section className="bg-canvas py-16 lg:py-24 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-5">
                The Challenge
              </p>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight leading-snug">
                Large-scale projects involve dozens of stakeholders. They do not naturally coordinate.
              </h2>
            </div>
            <div className="space-y-5 lg:pt-1">
              <p className="text-base text-ink leading-relaxed">
                Owners, architects, engineers, contractors, suppliers, and operations teams all work on different timelines, communicate differently, and answer to different priorities.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                Without a dedicated coordination layer, projects face delays, miscommunication, budget overruns, and missed milestones.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                TMPC is that coordination layer. We sit at the center of your project, providing the structure that keeps every stakeholder aligned and every phase moving forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                Services
              </p>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
                What We Do
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150"
            >
              Full services <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 3).map((s) => (
              <div
                key={s.title}
                className="bg-canvas border border-line p-7 hover:border-accent/40 hover:shadow-sm transition-all duration-200 group"
              >
                <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-widest mb-4">{s.number}</p>
                <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight">{s.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
            {services.slice(3).map((s) => (
              <div
                key={s.title}
                className="bg-canvas border border-line p-7 hover:border-accent/40 hover:shadow-sm transition-all duration-200 group"
              >
                <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-widest mb-4">{s.number}</p>
                <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight">{s.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sectors */}
      <section className="bg-canvas py-16 lg:py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                Sectors
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight mb-4">
                Where We Work
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                TMPC supports projects across five key sectors throughout Thailand.
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 pt-1">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="border border-line text-sm text-ink-secondary px-5 py-2.5 hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Project Scenarios: image cards */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Project Types
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              Projects We Support
            </h2>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {scenarios.slice(0, 2).map((s) => (
              <div key={s.title} className="col-span-6 sm:col-span-3 group relative overflow-hidden aspect-[4/3]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/80 via-canvas-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                  <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-[0.2em] mb-2">{s.sector}</p>
                  <h3 className="font-display font-semibold text-xl lg:text-2xl text-white tracking-tight">{s.title}</h3>
                </div>
              </div>
            ))}
            {scenarios.slice(2).map((s) => (
              <div key={s.title} className="col-span-6 sm:col-span-2 group relative overflow-hidden aspect-[4/3]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/80 via-canvas-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-[0.2em] mb-2">{s.sector}</p>
                  <h3 className="font-display font-semibold text-xl text-white tracking-tight">{s.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why TMPC */}
      <section className="bg-canvas py-16 lg:py-24 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Why TMPC
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyItems.map((item, i) => (
              <div key={item.title} className="border-l-2 border-accent/30 pl-5">
                <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-widest mb-3">0{i + 1}</p>
                <h3 className="font-display font-semibold text-lg text-ink tracking-tight mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="relative max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Get Started
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, and execution throughout Thailand. Get in touch to arrange an initial consultation.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors duration-150"
            >
              Contact TMPC <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
