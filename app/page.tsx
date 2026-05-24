import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const projectSide = ['Owner / Investor', 'Architect', 'MEP Engineers', 'Interior Design']
const executionSide = ['Main Contractor', 'Subcontractors', 'Suppliers', 'Operations Team']

const stakeholders = [
  'Owner / Investor',
  'Architect',
  'MEP Engineers',
  'Interior Design',
  'Structural Engineers',
  'Main Contractor',
  'Subcontractors',
  'Suppliers',
  'Operations Team',
  'Government Bodies',
  'Budget & Finance',
  'Timeline Management',
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

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-canvas-dark min-h-screen flex items-center overflow-hidden">
        {/* Bangkok photo as subtle bg texture */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-home.jpg"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover opacity-[0.07]"
            priority
          />
        </div>
        {/* Dot grid + gradient */}
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-canvas-dark/90 via-navy/50 to-canvas-dark/95 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/50 mb-8 tracking-[0.2em] uppercase animate-fade-in">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-dot-blink"
                  style={{ animationDelay: '0s' }}
                />
                Bangkok, Thailand
              </div>

              <h1
                className="font-display font-bold text-5xl sm:text-6xl lg:text-[4rem] text-white leading-[1.08] tracking-tight mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Project Consulting and Development Management in Thailand
              </h1>

              <p
                className="text-base text-white/55 leading-relaxed max-w-md mb-10 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC provides structured coordination, development management, and execution oversight across commercial, industrial, hospitality, and real estate projects throughout Thailand.
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
                  className="text-sm text-white/45 hover:text-white flex items-center gap-1.5 transition-colors duration-150"
                >
                  Our Services <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>

              {/* Process flow */}
              <div
                className="hidden lg:flex items-center gap-0 pt-6 border-t border-white/8 animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                {processSteps.map((s, i) => (
                  <div key={s.number} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[0.6rem] font-bold text-accent tabular-nums">{s.number}</span>
                      <span className="text-[0.68rem] text-white/30 whitespace-nowrap">{s.title}</span>
                    </div>
                    {i < processSteps.length - 1 && (
                      <span className="mx-2.5 text-white/15 text-xs" aria-hidden="true">&#8594;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Animated coordination diagram */}
            <div
              className="hidden lg:block animate-fade-in"
              style={{ animationDelay: '0.25s' }}
            >
              <div className="border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6">

                {/* Live label */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="flex gap-1">
                    {[0, 0.4, 0.8].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-[0.6rem] text-white/25 uppercase tracking-[0.3em]">
                    Project Coordination Layer
                  </p>
                </div>

                {/* Project side chips */}
                <div className="mb-0">
                  <p className="text-[0.55rem] text-white/20 uppercase tracking-[0.25em] mb-2 text-right pr-1">Project Side</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {projectSide.map((p) => (
                      <div
                        key={p}
                        className="border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.68rem] text-white/50 text-center leading-tight hover:border-white/20 hover:text-white/65 transition-colors duration-300"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated connectors top */}
                <div className="grid grid-cols-4 py-2 px-1">
                  {[0, 0.3, 0.6, 0.9].map((d) => (
                    <div key={d} className="flex justify-center">
                      <div
                        className="w-px h-5 bg-gradient-to-b from-white/20 to-accent/70 animate-flow-pulse"
                        style={{ animationDelay: `${d}s` }}
                      />
                    </div>
                  ))}
                </div>

                {/* TMPC hub */}
                <div
                  className="border border-accent/50 bg-accent/10 py-5 px-5 flex items-center justify-between animate-hub-glow"
                >
                  <div>
                    <p className="text-[0.5rem] text-accent uppercase tracking-[0.25em] mb-1">
                      Coordination Hub
                    </p>
                    <p className="font-display font-bold text-[1.4rem] text-white leading-none tracking-tight">
                      TMPC
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[0.5rem] text-white/20 uppercase tracking-widest">Development</p>
                    <p className="text-[0.5rem] text-white/15 uppercase tracking-widest">Bangkok</p>
                    <div className="flex justify-end gap-1 mt-1">
                      {[0, 0.5, 1].map((d) => (
                        <span
                          key={d}
                          className="w-1 h-1 rounded-full bg-accent/50 animate-dot-blink"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Animated connectors bottom */}
                <div className="grid grid-cols-4 py-2 px-1">
                  {[0.9, 0.6, 0.3, 0].map((d) => (
                    <div key={d} className="flex justify-center">
                      <div
                        className="w-px h-5 bg-gradient-to-b from-accent/70 to-white/20 animate-flow-pulse"
                        style={{ animationDelay: `${d + 0.5}s` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Execution side chips */}
                <div>
                  <p className="text-[0.55rem] text-white/20 uppercase tracking-[0.25em] mb-2 pl-1">Execution Side</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {executionSide.map((p) => (
                      <div
                        key={p}
                        className="border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.68rem] text-white/50 text-center leading-tight hover:border-white/20 hover:text-white/65 transition-colors duration-300"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[0.55rem] text-white/15 tracking-wider">
                    One coordination layer. Every party aligned.
                  </span>
                  <div className="w-4 h-px bg-accent/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-canvas border-b border-line">
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

      {/* THE CHALLENGE: stakeholder complexity visual */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              The Challenge
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight mb-4">
              Managing a project means managing all of this.
            </h2>
            <p className="text-base text-ink-muted">
              Every large-scale project involves a complex web of parties, each with different priorities, timelines, and communication styles.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            {/* Stakeholder grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
              {stakeholders.map((s, i) => (
                <div
                  key={s}
                  className="border border-line bg-canvas px-4 py-3 text-sm text-ink-secondary text-center hover:border-accent/40 hover:text-accent transition-all duration-200"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Convergence visual */}
            <div className="flex flex-col items-center gap-0 mb-8">
              <div className="grid grid-cols-8 w-full max-w-xl">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="w-px h-8 bg-gradient-to-b from-transparent to-accent/40" />
                  </div>
                ))}
              </div>
              <div className="w-full max-w-xl h-px bg-accent/30" />
            </div>

            {/* TMPC resolution card */}
            <div className="max-w-lg mx-auto border border-accent/35 bg-accent/[0.04] p-7 text-center">
              <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-[0.25em] mb-3">
                The Solution
              </p>
              <p className="font-display font-bold text-2xl text-ink tracking-tight mb-3">
                TMPC: One Coordination Layer
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Structured communication. Clear oversight. All parties aligned toward the same outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
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
                <div className="group bg-canvas border border-line p-7 hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 h-full">
                  <p className="text-[0.65rem] font-bold text-accent uppercase tracking-widest mb-4">
                    {s.number}
                  </p>
                  <h3 className="font-display font-semibold text-lg text-ink mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{s.description}</p>
                  <div className="mt-5 w-6 h-px bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white tracking-tight mb-14">
              From Planning to Execution
            </h2>
          </FadeIn>

          {/* Desktop timeline */}
          <div className="hidden lg:block relative">
            {/* Horizontal connector line */}
            <div className="absolute top-5 left-[calc(10%)] right-[calc(10%)] h-px bg-white/10" />

            <div className="grid grid-cols-5 gap-4">
              {processSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 100} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 border border-accent/60 bg-canvas-dark flex items-center justify-center text-xs font-bold text-accent relative z-10 mb-5 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 cursor-default">
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
          <div className="lg:hidden space-y-0 divide-y divide-white/8">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 80}>
                <div className="flex items-start gap-5 py-5">
                  <div className="w-9 h-9 border border-accent/60 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
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
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/85 via-canvas-dark/25 to-transparent" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/85 via-canvas-dark/25 to-transparent" />
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
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
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
                <div className="border-l-2 border-accent/35 pl-5 hover:border-accent transition-colors duration-300">
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
            className="object-cover opacity-[0.06]"
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
