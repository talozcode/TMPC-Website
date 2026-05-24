import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const scenarios = [
  {
    title: 'Commercial Projects',
    sector: 'Commercial',
    description: 'Offices, retail spaces, and mixed-use environments across Thailand.',
    image: '/images/scenario-commercial.jpg',
  },
  {
    title: 'Industrial & Factory Setup',
    sector: 'Industrial',
    description: 'Manufacturing and operational facility coordination.',
    image: '/images/scenario-industrial.jpg',
  },
  {
    title: 'Wellness & Hospitality',
    sector: 'Wellness',
    description: 'Spas, boutique hotels, and lifestyle concepts.',
    image: '/images/scenario-wellness.jpg',
  },
  {
    title: 'Real Estate & Renovation',
    sector: 'Real Estate',
    description: 'Villa, condo, and property development management.',
    image: '/images/scenario-realestate.jpg',
  },
  {
    title: 'Warehousing & Operations',
    sector: 'Operations',
    description: 'Logistics facilities and operational environment setup.',
    image: '/images/scenario-warehouse.jpg',
  },
]

const timelineSteps = [
  { number: '01', title: 'Idea & Vision', description: 'Project goals, scope, and early requirements defined.' },
  { number: '02', title: 'Planning & Structure', description: 'Budget framing, timelines, and coordination strategy.' },
  { number: '03', title: 'Consultant Coordination', description: 'Architect, engineers, designers, and specialists aligned.' },
  { number: '04', title: 'Execution Oversight', description: 'Site progress, contractor management, reporting.' },
  { number: '05', title: 'Project Readiness', description: 'Operational handover and final coordination.' },
]

const coreServices = [
  { title: 'Project Consulting', description: 'Early-stage planning, structuring, and coordination strategy.' },
  { title: 'Development Management', description: 'Oversight across all phases from concept to execution.' },
  { title: 'Project Coordination', description: 'Consultants, contractors, suppliers, and stakeholder communication.' },
  { title: 'Execution Oversight', description: 'Timeline, reporting, site coordination, and progress tracking.' },
  { title: 'Operational Setup', description: 'Pre-opening coordination and operational environment preparation.' },
]

const whyItems = [
  {
    number: '01',
    title: 'International Standards, Local Knowledge',
    description: 'TMPC bridges the gap between international communication expectations and Thailand-based project realities.',
  },
  {
    number: '02',
    title: 'Cross-Sector Experience',
    description: 'From commercial fit-outs to industrial facilities and hospitality concepts, we adapt to the demands of each project type.',
  },
  {
    number: '03',
    title: 'Coordination as a Core Discipline',
    description: 'We treat coordination as a skill in itself: structured, consistent, and built around project outcomes.',
  },
]

const clientSideParties = [
  'Owner / Investor',
  'Architect',
  'Interior Designer',
  'MEP Engineers',
  'Government Authorities',
]

const executionSideParties = [
  'Main Contractor',
  'Subcontractors',
  'Suppliers',
  'Operations Team',
  'Site Management',
]

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-20 items-center">

            <div>
              <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-7 animate-fade-in">
                Project Consulting. Development Management.
              </p>
              <h1
                className="font-display text-5xl sm:text-6xl lg:text-[5rem] text-ink leading-[1.05] mb-8 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Your Project Development Partner in Thailand
              </h1>
              <p
                className="text-lg text-ink-muted leading-relaxed max-w-md mb-10 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC provides structured coordination, development management, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects throughout Thailand.
              </p>
              <div
                className="flex flex-wrap items-center gap-6 animate-fade-up"
                style={{ animationDelay: '0.32s' }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium bg-accent text-white px-7 py-3.5 hover:bg-accent-light transition-colors duration-200"
                >
                  Discuss Your Project
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-medium text-ink-muted hover:text-accent transition-colors duration-150 flex items-center gap-1.5"
                >
                  Explore Services <span aria-hidden="true">&#8594;</span>
                </Link>
              </div>
            </div>

            <div
              className="hidden lg:block relative animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="relative h-[580px] overflow-hidden">
                <Image
                  src="/images/hero-home.jpg"
                  alt="Project coordination and development management in Thailand"
                  fill
                  className="object-cover"
                  sizes="420px"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-full h-full border border-clay/30 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Situation */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
                The Reality of Projects in Thailand
              </p>
              <h2 className="font-display text-3xl lg:text-4xl text-ink leading-snug mb-6">
                Every project involves dozens of moving parts. Most of them do not naturally communicate with each other.
              </h2>
            </div>
            <div className="space-y-5 lg:pt-1">
              <p className="text-base text-ink leading-relaxed">
                Architects, engineers, interior designers, contractors, suppliers, and operations teams all work on different timelines, in different languages, with different priorities.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                Without a dedicated coordination layer, projects face delays, miscommunication, budget overruns, and missed milestones. This is especially true in Thailand, where navigating the local project environment requires both on-the-ground knowledge and international working standards.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                TMPC sits at the center of this complexity, providing the structure that keeps all parties aligned, informed, and moving toward the same goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Moving Parts */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16 max-w-2xl">
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
              The Moving Parts
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink leading-snug mb-4">
              TMPC sits at the center of every project
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              A single coordination point connecting all stakeholders, consultants, and execution teams across your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-center">
            {/* Project / Client side */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">
                Project Side
              </p>
              {clientSideParties.map((party) => (
                <div
                  key={party}
                  className="flex items-center justify-between border border-line bg-canvas-subtle px-4 py-3 lg:justify-end"
                >
                  <span className="text-sm text-ink-secondary">{party}</span>
                  <span className="hidden lg:block w-4 h-px bg-line ml-4 flex-shrink-0" />
                </div>
              ))}
            </div>

            {/* TMPC center */}
            <div className="flex flex-col items-center py-6">
              <div className="w-px h-8 bg-line hidden lg:block" />
              <div className="bg-accent text-white px-8 py-10 text-center my-2">
                <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-3">Coordination Layer</p>
                <p className="font-display text-3xl text-white mb-1">TMPC</p>
                <p className="text-xs text-white/50 tracking-wide">Development</p>
              </div>
              <div className="w-px h-8 bg-line hidden lg:block" />
            </div>

            {/* Execution side */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">
                Execution Side
              </p>
              {executionSideParties.map((party) => (
                <div
                  key={party}
                  className="flex items-center border border-line bg-canvas-subtle px-4 py-3"
                >
                  <span className="hidden lg:block w-4 h-px bg-line mr-4 flex-shrink-0" />
                  <span className="text-sm text-ink-secondary">{party}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Scenarios */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-12">
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
              Project Scenarios
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              Where TMPC Makes an Impact
            </h2>
          </div>

          <div className="grid grid-cols-6 gap-3 lg:gap-4">
            {scenarios.slice(0, 2).map((s) => (
              <div
                key={s.title}
                className="col-span-6 sm:col-span-3 group relative overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/75 via-canvas-dark/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                  <p className="text-xs font-semibold text-clay uppercase tracking-[0.22em] mb-2">
                    {s.sector}
                  </p>
                  <h3 className="font-display text-xl lg:text-2xl text-white leading-snug mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed hidden sm:block">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
            {scenarios.slice(2).map((s) => (
              <div
                key={s.title}
                className="col-span-6 sm:col-span-2 group relative overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/75 via-canvas-dark/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <p className="text-xs font-semibold text-clay uppercase tracking-[0.22em] mb-2">
                    {s.sector}
                  </p>
                  <h3 className="font-display text-xl text-white leading-snug">
                    {s.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What TMPC Does */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
                What TMPC Does
              </p>
              <h2 className="font-display text-3xl lg:text-4xl text-ink mb-6 leading-snug">
                Structured coordination from planning through execution
              </h2>
              <p className="text-base text-ink-muted leading-relaxed mb-10">
                TMPC does not build, design, or supply. We manage the people and processes that do, providing a clear, consistent coordination structure across every phase of the project.
              </p>
              <ul className="space-y-0 divide-y divide-line">
                {coreServices.map((service) => (
                  <li key={service.title} className="py-5 flex items-start gap-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{service.title}</p>
                      <p className="text-sm text-ink-muted leading-relaxed">{service.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-medium bg-accent text-white px-7 py-3.5 hover:bg-accent-light transition-colors duration-200"
                >
                  View All Services
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative h-[640px] overflow-hidden">
                <Image
                  src="/images/hero-services.jpg"
                  alt="Project coordination and development management"
                  fill
                  className="object-cover"
                  sizes="480px"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 w-full h-full border border-accent/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Timeline */}
      <section className="bg-canvas-stone border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
              From Idea to Execution
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              How TMPC Supports the Full Project Arc
            </h2>
          </div>

          {/* Desktop timeline */}
          <div className="hidden lg:grid grid-cols-5 relative">
            <div className="absolute top-4 left-[10%] right-[10%] h-px bg-line" />
            {timelineSteps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center px-4 relative">
                <div className="w-8 h-8 bg-accent text-white flex items-center justify-center text-xs font-semibold relative z-10 mb-5">
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-clay uppercase tracking-[0.18em] mb-2">
                  {step.number}
                </p>
                <h3 className="text-sm font-semibold text-ink mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile timeline: vertical */}
          <div className="lg:hidden space-y-0 divide-y divide-line">
            {timelineSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-5 py-6">
                <div className="w-8 h-8 bg-accent text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-1">{step.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why TMPC */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-5">
              Why TMPC
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              What Makes the Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {whyItems.map((item) => (
              <div key={item.title}>
                <p className="font-display text-6xl text-clay leading-none mb-5 opacity-20 select-none">
                  {item.number}
                </p>
                <div className="w-6 h-px bg-clay mb-5 opacity-50" />
                <h3 className="text-base font-semibold text-ink mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-6">
            Get Started
          </p>
          <h2 className="font-display text-3xl lg:text-[2.75rem] text-canvas leading-tight mb-5">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-base text-canvas/55 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, and execution throughout Thailand. Get in touch to arrange an initial consultation.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium bg-canvas text-canvas-dark px-7 py-3.5 hover:bg-canvas-subtle transition-colors duration-200"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/contact"
              className="text-sm text-canvas/55 hover:text-canvas flex items-center gap-1.5 transition-colors duration-150"
            >
              Contact TMPC <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
