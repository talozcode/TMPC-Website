import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Services',
  description: `${siteConfig.name} provides project consulting, development management, project coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects in Thailand.`,
}

const coreServices = [
  {
    number: '01',
    title: 'Project Consulting',
    description:
      'Strategic support during early-stage planning, project structuring, budgeting, coordination planning, and execution preparation.',
    scope: [
      'Project planning support',
      'Feasibility discussions',
      'Scope definition',
      'Coordination strategy',
      'Budget alignment',
      'Project structure planning',
      'Consultant identification support',
    ],
  },
  {
    number: '02',
    title: 'Development Management',
    description:
      'Coordination and oversight support throughout project development phases, from concept planning through implementation stages.',
    scope: [
      'Development coordination',
      'Stakeholder management',
      'Planning oversight',
      'Consultant coordination',
      'Timeline supervision',
      'Reporting support',
      'Budget monitoring',
    ],
  },
  {
    number: '03',
    title: 'Project Coordination',
    description:
      'Structured coordination between consultants, suppliers, contractors, operational teams, and project stakeholders.',
    scope: [
      'Communication management',
      'Coordination meetings',
      'Workflow organization',
      'Vendor coordination',
      'Supplier sourcing support',
      'Information flow management',
      'Project updates and reporting',
    ],
  },
  {
    number: '04',
    title: 'Execution Oversight',
    description:
      'Execution-focused project support with attention to timelines, coordination flow, operational requirements, and implementation progress.',
    scope: [
      'Site coordination',
      'Timeline tracking',
      'Progress reporting',
      'Issue coordination',
      'Execution monitoring',
      'Contractor communication support',
      'Operational alignment',
    ],
  },
  {
    number: '05',
    title: 'Operational Setup Support',
    description:
      'Support for operational planning and project-related setup requirements across commercial, hospitality, industrial, and operational environments.',
    scope: [
      'Operational planning support',
      'Vendor setup coordination',
      'Workflow planning',
      'Facility preparation',
      'Operational coordination',
      'Technology and system coordination support',
    ],
  },
]

const projectTypes = [
  {
    title: 'Commercial Projects',
    description: 'Retail, office, mixed-use, and business-related environments.',
  },
  {
    title: 'Industrial & Factory Setup',
    description:
      'Industrial coordination, operational facilities, warehouse environments, and factory-related project support.',
  },
  {
    title: 'Real Estate & Renovation',
    description:
      'Condominium renovations, property upgrades, villa improvements, and development-related coordination.',
  },
  {
    title: 'Wellness & Hospitality',
    description:
      'Hospitality concepts, wellness facilities, boutique environments, and operational hospitality projects.',
  },
  {
    title: 'Warehousing & Operations',
    description:
      'Warehouse environments, logistics support spaces, and operational project coordination.',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Project Review',
    description:
      'Understanding project scope, operational goals, stakeholders, and coordination requirements.',
  },
  {
    number: '02',
    title: 'Planning & Structuring',
    description:
      'Establishing coordination workflows, consultant involvement, timelines, and execution planning support.',
  },
  {
    number: '03',
    title: 'Coordination & Oversight',
    description:
      'Supporting communication, execution flow, reporting, and project coordination throughout implementation.',
  },
  {
    number: '04',
    title: 'Operational Support',
    description:
      'Helping projects move toward organized delivery and operational readiness.',
  },
]

const whyItems = [
  {
    title: 'Strategic Coordination',
    description:
      'Structured project coordination focused on communication clarity and execution flow.',
  },
  {
    title: 'Multi-Sector Perspective',
    description:
      'Experience supporting operational, industrial, hospitality, commercial, and development-oriented projects.',
  },
  {
    title: 'Thailand-Based Execution Support',
    description:
      'Local coordination experience combined with internationally aligned communication and project management standards.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-6 animate-fade-in">
                Our Services
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-ink tracking-tight leading-[1.13] mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Project Consulting and Development Management
              </h1>
              <p
                className="text-lg text-ink-muted leading-relaxed animate-fade-up"
                style={{ animationDelay: '0.22s' }}
              >
                TMPC supports projects across planning, coordination, development management, and execution oversight throughout Thailand.
              </p>
            </div>
            <div
              className="hidden lg:block relative min-h-[500px] rounded-sm overflow-hidden animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <Image
                src="/images/hero-services.jpg"
                alt="Project consulting and development management workspace"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 0px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <p className="text-base text-ink leading-relaxed mb-5">
            TMPC provides project consulting and development management support across commercial, industrial, hospitality, wellness, operational, and real estate projects.
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-5">
            Our role is to help structure, coordinate, and support projects through organized planning, communication management, consultant coordination, and execution oversight.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            TMPC does not operate as a construction contractor. We work as a strategic project partner focused on coordination, oversight, and practical execution support.
          </p>
        </div>
      </section>

      {/* 3. Core Services */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              What We Do
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Core Services
            </h2>
          </div>

          <div className="divide-y divide-line">
            {coreServices.map((service) => (
              <div
                key={service.title}
                className="py-12 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-20"
              >
                {/* Left: number, title, description */}
                <div>
                  <p className="text-xs text-ink-muted tabular-nums mb-5">
                    {service.number}
                  </p>
                  <h3 className="text-2xl lg:text-[1.75rem] font-semibold text-ink tracking-tight leading-tight mb-5">
                    {service.title}
                  </h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Right: scope */}
                <div className="lg:pt-10">
                  <p className="text-xs font-medium text-ink-muted uppercase tracking-widest mb-4">
                    Scope Includes
                  </p>
                  <ul className="border-l border-line pl-5 space-y-2.5">
                    {service.scope.map((item) => (
                      <li key={item} className="text-sm text-ink-muted leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Project Types */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              Scope of Work
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Projects We Support
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line overflow-hidden">
            {projectTypes.map((type) => (
              <div key={type.title} className="bg-canvas-subtle p-7">
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-2.5 leading-snug">
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

      {/* 5. How TMPC Works */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              Our Process
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              How TMPC Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line overflow-hidden">
            {processSteps.map((step) => (
              <div key={step.title} className="bg-canvas p-8 transition-colors duration-200 hover:bg-canvas-subtle">
                <p className="text-xs text-ink-muted tabular-nums mb-5">
                  {step.number}
                </p>
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why TMPC */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-medium text-accent uppercase tracking-widest">
              Why TMPC
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {whyItems.map((item) => (
              <div key={item.title}>
                <div className="w-7 h-px bg-accent mb-7" />
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug">
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

      {/* 7. Closing CTA */}
      <section className="bg-canvas py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink tracking-tight mb-4">
            Discuss Your Project
          </h2>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            TMPC supports projects across planning, coordination, development management, and execution oversight throughout Thailand.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-6 py-3 rounded hover:bg-ink-secondary transition-colors duration-150"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium border border-line text-ink px-6 py-3 rounded hover:border-ink transition-colors duration-150"
            >
              Contact TMPC
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
