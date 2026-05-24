import type { Metadata } from 'next'
import Link from 'next/link'
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

const processSteps = [
  {
    number: '01',
    title: 'Project Review',
    description: 'Understanding scope, operational goals, stakeholders, and coordination requirements.',
  },
  {
    number: '02',
    title: 'Planning & Structuring',
    description: 'Establishing workflows, consultant involvement, timelines, and execution planning.',
  },
  {
    number: '03',
    title: 'Coordination & Oversight',
    description: 'Supporting communication, execution flow, reporting, and coordination throughout.',
  },
  {
    number: '04',
    title: 'Operational Support',
    description: 'Helping projects move toward organized delivery and operational readiness.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas border-b border-line py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Services
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight mb-8 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Project Consulting and Development Management
            </h1>
            <p
              className="text-lg text-ink-secondary leading-relaxed max-w-2xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              TMPC supports projects across planning, coordination, development management, and execution oversight throughout Thailand. We do not operate as a construction contractor.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Core Services */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Core Services
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              What We Provide
            </h2>
          </div>

          <div className="divide-y divide-line">
            {coreServices.map((service) => (
              <div
                key={service.title}
                className="py-12 lg:py-16 grid lg:grid-cols-[80px_1fr_1fr] gap-8 lg:gap-12"
              >
                <div>
                  <p className="font-display font-bold text-4xl text-accent opacity-25 leading-none tabular-nums tracking-tight">
                    {service.number}
                  </p>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-2xl lg:text-3xl text-ink mb-5 leading-snug tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="lg:pt-1">
                  <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-[0.2em] mb-4">
                    Scope Includes
                  </p>
                  <ul className="space-y-2.5">
                    {service.scope.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                        <span className="w-1 h-1 rounded-full bg-accent/40 mt-2 flex-shrink-0" />
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

      {/* 4. Process */}
      <section className="bg-canvas border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Process
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              How TMPC Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step) => (
              <div key={step.title} className="bg-canvas-subtle border border-line p-8 hover:border-accent/40 hover:shadow-sm transition-all duration-200">
                <p className="font-display font-bold text-3xl text-accent opacity-20 mb-5 tabular-nums leading-none tracking-tight">
                  {step.number}
                </p>
                <h3 className="font-display font-semibold text-base text-ink mb-3 leading-snug tracking-tight">
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

      {/* 5. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Get in Touch
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Discuss Your Project
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, development management, and execution oversight throughout Thailand.
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
