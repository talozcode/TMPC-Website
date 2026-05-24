import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Thailand-based project consulting and development management company supporting clients across commercial, industrial, hospitality, wellness, and real estate projects.`,
}

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
      <section className="bg-canvas border-b border-line py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
                About TMPC
              </p>
              <h1
                className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight mb-8 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Strategic Project Consulting in Bangkok
              </h1>
              <p
                className="text-lg text-ink-secondary leading-relaxed max-w-xl animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                TMPC supports commercial, industrial, hospitality, wellness, and real estate projects across Thailand through structured coordination, development management, and execution oversight.
              </p>
            </div>

            <div
              className="hidden lg:block relative mt-4 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative h-[440px] overflow-hidden">
                <Image
                  src="/images/hero-about.jpg"
                  alt="Project planning and coordination"
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/25 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                The Company
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight">
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
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                Methodology
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
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

      {/* 4. Leadership */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Team
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              Leadership
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-2xl">
              TMPC combines project development, operational coordination, and technology-driven management support through a multidisciplinary leadership structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {leadership.map((person) => (
              <div key={person.name} className="bg-canvas border border-line p-8 lg:p-10 hover:border-accent/40 hover:shadow-sm transition-all duration-200">
                <div className="w-8 h-0.5 bg-accent mb-6" />
                <p className="font-display font-bold text-2xl text-ink mb-1 tracking-tight">
                  {person.name}
                </p>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-5">
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

      {/* 6. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Work With Us
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-6">
            Built Around Coordination, Execution, and Project Outcomes
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            TMPC supports projects through structured planning, practical coordination, and execution-focused management across Thailand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
