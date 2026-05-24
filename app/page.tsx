import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const inputParties = [
  'Owner / Investor',
  'Architect',
  'MEP Engineers',
  'Interior Design',
  'Main Contractor',
  'Operations Team',
]

const outputResults = [
  'Aligned Scope',
  'Clear Communication',
  'Execution Visibility',
  'Operational Readiness',
]

const services = [
  {
    number: '01',
    title: 'Project Consulting',
    description: 'Early-stage planning, scope definition, budgeting, and coordination strategy.',
  },
  {
    number: '02',
    title: 'Development Management',
    description: 'Oversight and coordination across all development phases, from concept through execution.',
  },
  {
    number: '03',
    title: 'Project Coordination',
    description: 'Structured communication between consultants, contractors, suppliers, and teams.',
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

const processSteps = [
  { number: '01', title: 'Project Review', description: 'Scope, stakeholders, and coordination requirements.' },
  { number: '02', title: 'Planning & Structure', description: 'Workflows, timelines, and consultant involvement.' },
  { number: '03', title: 'Coordination', description: 'Communication, reporting, and stakeholder alignment.' },
  { number: '04', title: 'Execution', description: 'Site coordination, progress tracking, issue resolution.' },
  { number: '05', title: 'Handover Ready', description: 'Operational delivery and final coordination.' },
]

const whyItems = [
  {
    title: 'International Standards, Bangkok Presence',
    description: 'TMPC bridges international communication expectations with on-the-ground Thailand execution. You get clarity, structure, and local coordination in one partner.',
  },
  {
    title: 'Cross-Sector Agility',
    description: 'From commercial fit-outs to industrial setup and hospitality development, we adapt our coordination approach to the demands of each project type.',
  },
  {
    title: 'Coordination as a Core Discipline',
    description: 'We treat coordination as a specialist skill, not a side function. Every project gets a structured communication layer, consistent reporting, and clear execution oversight.',
  },
]

const scenarios = [
  { title: 'Commercial Projects', sector: 'Commercial', image: '/images/scenario-commercial.jpg' },
  { title: 'Industrial & Factory', sector: 'Industrial', image: '/images/scenario-industrial.jpg' },
  { title: 'Wellness & Hospitality', sector: 'Wellness', image: '/images/scenario-wellness.jpg' },
  { title: 'Real Estate & Renovation', sector: 'Real Estate', image: '/images/scenario-realestate.jpg' },
  { title: 'Warehousing & Operations', sector: 'Operations', image: '/images/scenario-warehouse.jpg' },
]

const challengeInput = [
  'Owner / Investor',
  'Architect',
  'MEP Engineers',
  'Interior Design',
  'Main Contractor',
  'Subcontractors',
  'Suppliers',
  'Government Bodies',
]

const challengeOutput = [
  'Aligned Scope',
  'Clear Communication',
  'Execution Visibility',
  'Timeline Confidence',
  'Budget Clarity',
  'Stakeholder Alignment',
  'Operational Readiness',
  'On-time Delivery',
]

export default function HomePage() {
  return (
    <>
      {/* HERO: Light split - bold navy text left, Bangkok photo + coordination visual right */}
      <section className="bg-canvas border-b border-line overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-8 items-center py-20 lg:py-24">

            {/* Left: Text block */}
            <div>
              <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-dot-blink" />
                Bangkok, Thailand
              </div>

              <h1
                className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.06] tracking-tight mb-7 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Project Consulting and Development Management in Thailand
              </h1>

              <p
                className="text-base lg:text-lg text-ink-secondary leading-relaxed max-w-lg mb-10 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC provides structured coordination, development management, and execution oversight for complex projects across Thailand.
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
                {['Bangkok-Based', 'Commercial', 'Industrial', 'Hospitality', 'Real Estate'].map((tag, i) => (
                  <span
                    key={tag}
                    className={`text-[0.65rem] font-semibold text-ink-muted uppercase tracking-[0.15em] pr-5 ${i > 0 ? 'pl-5 border-l border-line' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Bangkok photo + coordination overlay */}
            <div
              className="hidden lg:block relative overflow-hidden h-[580px] animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Image
                src="/images/hero-home.jpg"
                alt="Bangkok business district"
                fill
                className="object-cover"
                priority
                sizes="460px"
              />
              {/* Gradient: city lights visible at top, dark overlay grows toward bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-canvas-dark/75 to-canvas-dark/15" />

              {/* Coordination cards overlay - sits in dark zone */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 pb-6">

                {/* Input parties row */}
                <div className="mb-3.5">
                  <p className="text-[0.52rem] text-white/35 uppercase tracking-[0.25em] mb-2">Project Parties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {inputParties.map((p) => (
                      <div
                        key={p}
                        className="border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-[0.65rem] text-white/65 leading-none"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flow arrow down */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-accent/50 to-accent/80 animate-flow-pulse" />
                  <span className="text-accent/70 text-xs flex-shrink-0" aria-hidden="true">&#8595;</span>
                </div>

                {/* TMPC Hub card */}
                <div className="border border-accent/55 bg-canvas-dark/92 px-5 py-4 mb-3.5 animate-hub-glow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.48rem] text-accent uppercase tracking-[0.3em] mb-1.5">Coordination Layer</p>
                      <p className="font-display font-bold text-[1.75rem] text-white leading-none tracking-tight">TMPC</p>
                    </div>
                    <div className="text-right space-y-0.5 mx-4">
                      {['Planning', 'Coordination', 'Oversight', 'Reporting'].map((s) => (
                        <p key={s} className="text-[0.48rem] text-white/30 uppercase tracking-widest">{s}</p>
                      ))}
                    </div>
                    <div className="flex gap-1 items-center">
                      {[0, 0.4, 0.8].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flow arrow down */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="flex-1 h-px bg-gradient-to-r from-accent/80 via-accent/50 to-white/10 animate-flow-pulse" style={{ animationDelay: '0.5s' }} />
                  <span className="text-accent/70 text-xs flex-shrink-0" aria-hidden="true">&#8595;</span>
                </div>

                {/* Output results row */}
                <div>
                  <p className="text-[0.52rem] text-accent/60 uppercase tracking-[0.25em] mb-2">Project Output</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {outputResults.map((r) => (
                      <div
                        key={r}
                        className="border border-accent/25 bg-accent/[0.07] px-2.5 py-1.5 text-[0.65rem] text-accent/85 leading-none"
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-canvas-subtle border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center divide-x divide-line">
            {[
              { label: 'Bangkok-Based', note: 'On-the-ground coordination' },
              { label: '5 Core Services', note: 'Planning through execution' },
              { label: '5 Sectors', note: 'Commercial to industrial' },
              { label: 'International Standards', note: 'Global working expectations' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-6 py-4 first:pl-0 last:pr-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-ink">{item.label}</span>
                  <span className="hidden lg:inline text-sm text-ink-muted ml-2">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CHALLENGE: 3-column flow visual */}
      <section className="bg-canvas border-b border-line py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <FadeIn className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              The Challenge
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight mb-4">
              Complex projects need a dedicated coordination layer.
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              Every large project in Thailand involves multiple parties, each with different priorities, timelines, and expectations. Without dedicated coordination, communication breaks down and execution suffers.
            </p>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="flex flex-col lg:flex-row items-stretch">

              {/* Column 1: Input complexity */}
              <div className="flex-1 border border-line p-6 lg:p-8">
                <p className="text-[0.6rem] font-bold text-ink-muted uppercase tracking-[0.2em] mb-5">What comes in</p>
                <div className="space-y-2">
                  {challengeInput.map((s) => (
                    <div
                      key={s}
                      className="border border-line bg-canvas-subtle px-4 py-2.5 text-sm text-ink-secondary hover:border-accent/30 hover:text-ink transition-colors duration-200"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector left */}
              <div className="hidden lg:flex flex-col items-center justify-center w-14 border-y border-line bg-canvas-subtle flex-shrink-0">
                <div className="flex-1 w-px bg-accent/20 animate-flow-pulse" />
                <span className="text-accent/60 text-sm my-3 flex-shrink-0" aria-hidden="true">&#8594;</span>
                <div className="flex-1 w-px bg-accent/20 animate-flow-pulse" style={{ animationDelay: '0.5s' }} />
              </div>

              {/* Column 2: TMPC Hub */}
              <div className="lg:w-52 flex-shrink-0 bg-canvas-dark border-x-0 border lg:border-x-0 border-white/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />
                <div className="relative z-10 p-6 lg:px-6 lg:py-10 flex flex-col h-full justify-center text-center">
                  <p className="text-[0.5rem] text-accent uppercase tracking-[0.3em] mb-3">Coordination Layer</p>
                  <p className="font-display font-bold text-[2.5rem] text-white tracking-tight leading-none mb-5 animate-hub-glow inline-block">
                    TMPC
                  </p>
                  <div className="space-y-1.5 mb-5">
                    {['Planning', 'Coordination', 'Oversight', 'Reporting'].map((s) => (
                      <div
                        key={s}
                        className="border border-accent/20 px-3 py-1.5 text-[0.55rem] text-white/50 uppercase tracking-wider"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {[0, 0.4, 0.8].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector right */}
              <div className="hidden lg:flex flex-col items-center justify-center w-14 border-y border-accent/25 bg-accent/[0.03] flex-shrink-0">
                <div className="flex-1 w-px bg-accent/35 animate-flow-pulse" style={{ animationDelay: '0.8s' }} />
                <span className="text-accent/60 text-sm my-3 flex-shrink-0" aria-hidden="true">&#8594;</span>
                <div className="flex-1 w-px bg-accent/35 animate-flow-pulse" style={{ animationDelay: '1.2s' }} />
              </div>

              {/* Column 3: Output clarity */}
              <div className="flex-1 border border-accent/30 bg-accent/[0.02] p-6 lg:p-8">
                <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-5">What TMPC delivers</p>
                <div className="space-y-2">
                  {challengeOutput.map((s) => (
                    <div
                      key={s}
                      className="border border-accent/20 bg-accent/[0.04] px-4 py-2.5 text-sm text-accent/80 hover:bg-accent/[0.09] transition-colors duration-200"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">Services</p>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
                  What We Do
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150"
              >
                All services <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 80}>
                <div className="group bg-canvas border border-line p-7 lg:p-8 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <p className="text-[0.65rem] font-bold text-accent uppercase tracking-widest mb-5">
                    {s.number}
                  </p>
                  <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1">{s.description}</p>
                  <div className="mt-6 w-8 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE: dark section */}
      <section className="bg-canvas-dark border-b border-navy py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-60" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              How We Work
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white tracking-tight mb-16">
              From Planning to Execution
            </h2>
          </FadeIn>

          {/* Desktop timeline */}
          <div className="hidden lg:block relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-px bg-white/8" />
            <div className="grid grid-cols-5 gap-4">
              {processSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 100} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 border border-accent/50 bg-canvas-dark flex items-center justify-center text-xs font-bold text-accent relative z-10 mb-5 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 cursor-default">
                    {i + 1}
                  </div>
                  <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-2">
                    {step.number}
                  </p>
                  <h3 className="text-sm font-semibold text-white mb-2 leading-snug tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {step.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden divide-y divide-white/8">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 80}>
                <div className="flex items-start gap-5 py-5">
                  <div className="w-9 h-9 border border-accent/50 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">{step.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SCENARIOS */}
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-10">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Sectors
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              Projects We Support
            </h2>
          </FadeIn>

          <div className="grid grid-cols-6 gap-3">
            {scenarios.slice(0, 2).map((s, i) => (
              <FadeIn key={s.title} delay={i * 100} className="col-span-6 sm:col-span-3">
                <div className="group relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/90 via-canvas-dark/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                    <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.22em] mb-2">
                      {s.sector}
                    </p>
                    <h3 className="font-display font-semibold text-xl lg:text-2xl text-white tracking-tight">
                      {s.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
            {scenarios.slice(2).map((s, i) => (
              <FadeIn key={s.title} delay={i * 80} className="col-span-6 sm:col-span-2">
                <div className="group relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/90 via-canvas-dark/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.22em] mb-2">
                      {s.sector}
                    </p>
                    <h3 className="font-display font-semibold text-xl text-white tracking-tight">
                      {s.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TMPC */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Why TMPC
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              What Sets Us Apart
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyItems.map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="group border-l-2 border-line pl-6 hover:border-accent transition-colors duration-300 h-full">
                  <p className="text-[0.65rem] font-bold text-accent uppercase tracking-widest mb-3">
                    0{i + 1}
                  </p>
                  <h3 className="font-display font-semibold text-lg text-ink tracking-tight mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-canvas-dark py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-home.jpg"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover opacity-[0.08]"
          />
        </div>
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark pointer-events-none" />

        <FadeIn className="relative z-10 max-w-xl mx-auto px-6 lg:px-8 text-center">
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
              className="inline-flex items-center text-sm font-semibold bg-accent text-white px-8 py-4 hover:bg-accent-dark transition-colors duration-200"
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
        </FadeIn>
      </section>
    </>
  )
}
