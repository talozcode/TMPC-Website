import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Services',
  description: `${siteConfig.name} provides project consulting, development management, project coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects in Thailand.`,
}

const processSteps = [
  {
    number: '01',
    title: 'Project Review',
    description: 'Understanding what is being built, what can go wrong, and what the coordination structure needs to look like.',
  },
  {
    number: '02',
    title: 'Planning & Structuring',
    description: 'Setting the right structure before work starts. Consultants, timelines, budgets, and the coordination approach all confirmed before commitment.',
  },
  {
    number: '03',
    title: 'Coordination & Oversight',
    description: 'Managing all party communication, tracking progress against plan, and keeping the owner informed throughout delivery.',
  },
  {
    number: '04',
    title: 'Operational Support',
    description: 'Managing the final steps so the project transitions cleanly from construction into operation.',
  },
]

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: serviceRows } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  const coreServices = ((serviceRows as Service[]) ?? []).map((s, i) => ({
    number: s.number ?? String(i + 1).padStart(2, '0'),
    title: s.title,
    description: s.description ?? '',
    scope: s.scope_items ?? [],
  }))

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas border-b border-line py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Services
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight mb-4 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              How TMPC manages your project
            </h1>
            <p
              className="text-lg text-ink-secondary leading-relaxed max-w-2xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              From the first planning conversation to handover, TMPC manages the coordination, oversight, and reporting across every phase. One accountable partner throughout.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Core Services */}
      <section className="bg-canvas-subtle border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6 lg:mb-9">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Core Services
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              What We Provide
            </h2>
          </div>

          <div className="relative">
            {coreServices.map((service, index) => (
              <div
                key={service.title}
                className={`sticky bg-canvas border border-line shadow-[0_6px_32px_rgba(10,22,40,0.09)]${index > 0 ? ' -mt-px' : ''}`}
                style={{ top: `${68 + index * 20}px`, zIndex: index + 1 }}
              >
                <div className="py-10 lg:py-14 px-6 lg:px-8 grid lg:grid-cols-[80px_1fr_1fr] gap-8 lg:gap-12">
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
                      Fact Sheet
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Process */}
      <section className="bg-canvas border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6 lg:mb-8">
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
      <section className="bg-canvas-dark py-10 lg:py-14">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Get in Touch
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Discuss Your Project
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            Tell us what you are building. We will tell you what it takes to deliver it correctly.
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
