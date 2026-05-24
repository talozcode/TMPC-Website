import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Thailand-based project consulting and development management company supporting clients across commercial, industrial, hospitality, wellness, and real estate projects.`,
}

const projectTypes = [
  {
    title: 'Commercial Projects',
    description: 'Retail, office, mixed-use, and business-related environments.',
  },
  {
    title: 'Industrial & Factory Setup',
    description: 'Industrial coordination, warehouse environments, and operational project support.',
  },
  {
    title: 'Real Estate & Renovation',
    description: 'Condominium renovations, property upgrades, villa improvements, and development support.',
  },
  {
    title: 'Wellness & Hospitality',
    description: 'Hospitality concepts, wellness spaces, boutique developments, and operational environments.',
  },
  {
    title: 'Warehousing & Operations',
    description: 'Operational facilities, logistics-related spaces, and project coordination support.',
  },
]

const leadership = [
  {
    name: 'Tom',
    title: 'Managing Partner',
    description:
      'Focused on project development, planning, coordination, execution oversight, and business development across commercial, operational, industrial, and real estate projects.',
  },
  {
    name: 'Tal',
    title: 'Operations & Technology Partner',
    description:
      'Focused on operational systems, coordination support, technology implementation, workflow optimization, and Thailand-based operational structure.',
  },
]

const approachPriorities = [
  'Structured communication',
  'Execution-focused planning',
  'Operational awareness',
  'Practical coordination',
  'Long-term project functionality',
]

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">
            <div>
              <div className="w-8 h-0.5 bg-clay mb-6" />
              <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-6 animate-fade-in">
                About TMPC
              </p>
              <h1
                className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.06] mb-8 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Strategic Project Consulting and Development Management
              </h1>
              <p
                className="text-lg text-ink-muted leading-relaxed max-w-xl animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC supports commercial, industrial, hospitality, wellness, and real estate projects across Thailand through structured coordination, development management, and execution oversight.
              </p>
            </div>

            {/* Photo with offset border */}
            <div
              className="hidden lg:block relative mt-8 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative h-[480px] overflow-hidden">
                <Image
                  src="/images/hero-about.jpg"
                  alt="Project coordination and professional management"
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border border-clay/25 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <div className="w-8 h-0.5 bg-clay mb-4" />
              <h2 className="font-display text-2xl lg:text-3xl text-ink">
                Who We Are
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-base text-ink leading-relaxed">
                TMPC Development is a Thailand-based project consulting and development management company supporting clients across multiple industries and project environments.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                We work closely with project owners, businesses, investors, consultants, and operational teams to help structure, coordinate, and support projects from planning through execution.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                Our role is not construction contracting. TMPC acts as a strategic project partner focused on coordination, communication, oversight, and execution support throughout the project lifecycle.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                We combine local coordination experience with international communication standards and a practical, execution-focused approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <div className="w-8 h-0.5 bg-clay mb-4" />
              <h2 className="font-display text-2xl lg:text-3xl text-ink">
                Our Approach
              </h2>
            </div>
            <div>
              <p className="text-base text-ink leading-relaxed mb-5">
                Every project requires a different structure, team, timeline, and operational approach.
              </p>
              <p className="text-base text-ink-muted leading-relaxed mb-8">
                TMPC focuses on building clear coordination systems between stakeholders, consultants, suppliers, contractors, and operational teams to help projects move forward in an organized and practical way.
              </p>
              <p className="text-sm font-semibold text-ink mb-5 uppercase tracking-wider">We prioritize</p>
              <ul className="space-y-3 mb-8">
                {approachPriorities.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ink-secondary">
                    <span className="w-1 h-1 rounded-full bg-clay flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-base text-ink-muted leading-relaxed">
                Our goal is to support projects with clarity, consistency, and reliable on-the-ground coordination throughout Thailand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Types & Sectors */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <div className="w-8 h-0.5 bg-clay mb-4" />
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-4">
              Sectors
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              Project Types & Sectors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line overflow-hidden">
            {projectTypes.map((type, i) => (
              <div key={type.title} className="bg-canvas-subtle p-8 hover:bg-canvas transition-colors duration-200 relative overflow-hidden">
                <span
                  className="absolute -top-1 right-3 font-display text-8xl text-clay leading-none select-none opacity-[0.07]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug relative">
                  {type.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed relative">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <div className="w-8 h-0.5 bg-clay mb-4" />
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-4">
              Team
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              Leadership
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-2xl">
              TMPC combines project development, operational coordination, and technology-driven management support through a multidisciplinary leadership structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line overflow-hidden max-w-3xl">
            {leadership.map((person) => (
              <div key={person.name} className="bg-canvas p-8 lg:p-10 hover:bg-canvas-subtle transition-colors duration-200">
                <div className="w-8 h-0.5 bg-clay mb-7" />
                <p className="font-display text-2xl text-ink mb-1">
                  {person.name}
                </p>
                <p className="text-xs font-semibold text-clay uppercase tracking-wider mb-5">
                  {person.title}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {person.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-6">
            Work With Us
          </p>
          <h2 className="font-display text-3xl lg:text-4xl text-canvas leading-tight mb-6">
            Built Around Coordination, Execution, and Long-Term Project Support
          </h2>
          <p className="text-base text-canvas/55 leading-relaxed mb-4">
            TMPC supports projects through structured planning, practical coordination, and execution-focused management across Thailand.
          </p>
          <p className="text-base font-medium text-canvas/80 mb-10">
            Clear communication. Organized coordination. Practical execution support.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium bg-clay text-white px-7 py-3.5 hover:bg-clay-light transition-colors duration-200"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
