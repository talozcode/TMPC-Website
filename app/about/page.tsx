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
      <section className="bg-canvas py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-6 animate-fade-in">
                About TMPC
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-ink tracking-tight leading-[1.13] mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Strategic Project Consulting and Development Management
              </h1>
              <p
                className="text-lg text-ink-muted leading-relaxed animate-fade-up"
                style={{ animationDelay: '0.22s' }}
              >
                TMPC supports commercial, industrial, hospitality, wellness, and real estate projects across Thailand through structured coordination, development management, and execution oversight.
              </p>
            </div>
            <div
              className="hidden lg:block relative min-h-[520px] rounded-sm overflow-hidden animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <Image
                src="/images/hero-about.jpg"
                alt="Project coordination and professional management team"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 0px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="bg-canvas border-t border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
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
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
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
              <p className="text-sm font-medium text-ink mb-4">We prioritize:</p>
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

      {/* 4. Project Types & Sectors */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              Our Scope
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Project Types & Sectors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line overflow-hidden">
            {projectTypes.map((type) => (
              <div key={type.title} className="bg-canvas p-8 transition-colors duration-200 hover:bg-canvas-subtle">
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug">
                  {type.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              Our Team
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Leadership
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-2xl">
              TMPC combines project development, operational coordination, and technology-driven management support through a multidisciplinary leadership structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line overflow-hidden max-w-3xl">
            {leadership.map((person) => (
              <div key={person.name} className="bg-canvas p-8 lg:p-10 transition-colors duration-200 hover:bg-canvas-subtle">
                <div className="w-7 h-px bg-accent mb-7" />
                <p className="text-lg font-semibold text-ink mb-1">
                  {person.name}
                </p>
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-5">
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

      {/* 6. Closing */}
      <section className="bg-canvas py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight mb-6 leading-snug">
            Built Around Coordination, Execution, and Long-Term Project Support
          </h2>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            TMPC supports projects through structured planning, practical coordination, and execution-focused management across Thailand.
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-4">
            Whether supporting a commercial renovation, operational facility, hospitality concept, industrial environment, or development project, our focus remains the same:
          </p>
          <p className="text-base font-medium text-ink mb-10">
            Clear communication. Organized coordination. Practical execution support.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-6 py-3 rounded hover:bg-ink-secondary transition-colors duration-150"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
