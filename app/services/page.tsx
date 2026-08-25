import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
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
    title: 'Planning and Structuring',
    description: 'Setting the right structure before work starts. Consultants, timelines, budgets, and the coordination approach all confirmed before commitment.',
  },
  {
    number: '03',
    title: 'Coordination and Oversight',
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
      <section id="svc-hero" className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-services.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 scale-110"
            style={{ translate: '0 var(--par, 0%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas-dark via-canvas-dark/85 to-canvas-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark/60" />
        </div>
        <div className="wrap relative z-10 py-[clamp(4.5rem,9vw,8rem)]">
          <Reveal>
            <p className="eye">Services</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6 max-w-[16ch]">How TMPC manages your project</h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7">
              From the first planning conversation to handover, TMPC manages the coordination,
              oversight, and reporting across every phase. One accountable partner throughout.
            </p>
          </Reveal>
        </div>
      </section>
      <HeroParallax targetId="svc-hero" amount={8} />

      {/* 2. Core Services, a stacking deck */}
      <section className="bg-canvas-subtle sec">
        <div className="wrap">
          <Reveal className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <p className="eye">Core Services</p>
            <h2 className="t-h1 text-ink mt-6">What We Provide</h2>
          </Reveal>

          {/* Each card parks under the floating chrome as the next one arrives,
              so the set reads as one deck rather than a list that scrolls past. */}
          <div className="relative">
            {coreServices.map((service, index) => (
              <div
                key={service.title}
                className="card sticky"
                style={{ top: `${5.5 + index * 1.1}rem`, zIndex: index + 1, marginTop: index ? '-1px' : 0 }}
              >
                <div className="grid lg:grid-cols-[4.5rem_1fr_1fr] gap-8 lg:gap-12 px-7 py-10 lg:px-12 lg:py-14">
                  <p className="font-display font-bold text-[2.6rem] text-accent/25 leading-none tabular-nums tracking-[-0.04em]">
                    {service.number}
                  </p>

                  <div>
                    <h3 className="t-h2 !text-[1.6rem] lg:!text-[2rem] text-ink mb-5">{service.title}</h3>
                    <p className="t-body text-ink-muted max-w-[46ch]">{service.description}</p>
                  </div>

                  {service.scope.length > 0 && (
                    <div className="lg:pt-1.5">
                      <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.2em] mb-4">
                        Fact Sheet
                      </p>
                      <ul className="space-y-2.5">
                        {service.scope.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-[0.92rem] text-ink-muted leading-snug">
                            <span className="w-1 h-1 rounded-full bg-accent/45 mt-2.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Process */}
      <section className="bg-canvas sec">
        <div className="wrap">
          <Reveal className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <p className="eye">Process</p>
            <h2 className="t-h1 text-ink mt-6">How TMPC Works</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80} className="flex">
                <div className="card card-hover press-sm flex-1 p-8">
                  <p className="font-display font-bold text-[2rem] text-accent/25 mb-6 tabular-nums leading-none tracking-[-0.04em]">
                    {step.number}
                  </p>
                  <h3 className="t-h4 text-ink mb-3">{step.title}</h3>
                  <p className="text-[0.92rem] text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Get in Touch</p>
            <h2 className="t-h1 text-white mt-6">Discuss Your Project</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              Tell us what you are building. We will tell you what it takes to deliver it correctly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/contact" className="btn">Schedule a Consultation</Link>
              <Link href="/projects" className="btn-2">
                See our work <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
