import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
  description: siteConfig.description,
}

const homeServices = [
  {
    title: 'Project Consulting',
    description: 'Strategic planning and project structuring support during early-stage development.',
  },
  {
    title: 'Development Management',
    description: 'Coordination and oversight throughout all project development phases.',
  },
  {
    title: 'Project Coordination',
    description: 'Management of consultants, suppliers, contractors, and communication flow.',
  },
  {
    title: 'Execution Oversight',
    description: 'Timeline, reporting, operational coordination, and execution support.',
  },
]

const homeSectors = [
  'Commercial',
  'Industrial & Factory',
  'Real Estate & Renovation',
  'Wellness & Hospitality',
  'Warehousing & Operations',
]

const whyItems = [
  {
    title: 'International Communication',
    description: 'Clear and structured project coordination aligned with international working standards.',
  },
  {
    title: 'Multi-Sector Experience',
    description: 'Support across operational and development-focused projects in diverse sectors.',
  },
  {
    title: 'Thailand-Based Execution',
    description: 'Local coordination with international working standards and structured reporting.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-20 items-center">

            {/* Text */}
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-7 animate-fade-in">
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
                TMPC provides project consulting, coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects throughout Thailand.
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

            {/* Photo with offset border */}
            <div
              className="hidden lg:block relative animate-fade-in"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="relative h-[580px] overflow-hidden">
                <Image
                  src="/images/hero-home.jpg"
                  alt="Project coordination and development management"
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-full h-full border border-accent/30 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Intro strip */}
      <section className="bg-canvas-subtle border-y border-line py-14 lg:py-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-base text-ink leading-relaxed mb-4">
            TMPC is a Thailand-based project consulting and development management company supporting clients through planning, coordination, consultant management, and execution oversight.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            We work across commercial, industrial, operational, hospitality, wellness, and real estate projects with a focus on structured coordination and practical execution support.
          </p>
        </div>
      </section>

      {/* 3. Services */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 lg:mb-14">
            <div>
              <div className="w-8 h-0.5 bg-accent mb-4" />
              <h2 className="font-display text-3xl lg:text-4xl text-ink">
                What We Do
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors duration-150"
            >
              View all services <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line overflow-hidden">
            {homeServices.map((service, i) => (
              <div
                key={service.title}
                className="bg-canvas p-8 lg:p-9 hover:bg-canvas-subtle transition-colors duration-200 relative overflow-hidden"
              >
                <span
                  className="absolute -top-1 right-3 font-display text-8xl text-accent leading-none select-none opacity-[0.06]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-5 tabular-nums relative">
                  0{i + 1}
                </p>
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug relative">
                  {service.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed relative">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sectors */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <div className="w-8 h-0.5 bg-accent mb-4" />
              <h2 className="font-display text-2xl lg:text-3xl text-ink">
                Where We Work
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {homeSectors.map((sector) => (
                <span
                  key={sector}
                  className="text-sm text-ink-secondary border border-line bg-canvas px-5 py-2.5 hover:border-accent/50 hover:text-accent transition-colors duration-200 cursor-default"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why TMPC */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <div className="w-8 h-0.5 bg-accent mb-4" />
            <h2 className="font-display text-3xl lg:text-4xl text-ink">
              Why TMPC
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {whyItems.map((item, i) => (
              <div key={item.title}>
                <p className="font-display text-6xl text-accent leading-none mb-5 opacity-20 select-none">
                  {String(i + 1).padStart(2, '0')}
                </p>
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

      {/* 6. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-[2.75rem] text-canvas leading-tight mb-5">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-base text-canvas/55 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, and execution phases throughout Thailand. Get in touch to arrange an initial consultation.
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
