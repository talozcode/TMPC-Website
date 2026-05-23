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
    description: 'Strategic planning and project structuring support.',
  },
  {
    title: 'Development Management',
    description: 'Coordination and oversight throughout project phases.',
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
      <section className="relative min-h-screen flex items-end lg:items-center bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 lg:py-0">
          <p className="text-xs font-medium text-accent-soft uppercase tracking-[0.2em] mb-8 animate-fade-in">
            TMPC Development Co., Ltd.
          </p>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.06] max-w-4xl mb-8 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Your Project Development Partner in Thailand
          </h1>
          <p
            className="text-lg text-white/60 leading-relaxed max-w-xl mb-12 animate-fade-up"
            style={{ animationDelay: '0.22s' }}
          >
            TMPC provides project consulting, coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: '0.36s' }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold bg-white text-navy px-7 py-3.5 rounded hover:bg-canvas transition-colors duration-200"
            >
              Discuss Your Project
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium border border-white/30 text-white px-7 py-3.5 rounded hover:bg-white/10 transition-colors duration-200"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Positioning */}
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-20">
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
          <div className="mb-10 lg:mb-14">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              What We Do
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line overflow-hidden">
            {homeServices.map((service, i) => (
              <div key={service.title} className="bg-canvas p-8 lg:p-10 transition-colors duration-200 hover:bg-canvas-subtle">
                <div className="w-6 h-0.5 bg-accent mb-6" />
                <p className="text-xs font-medium text-accent mb-4 tabular-nums">
                  0{i + 1}
                </p>
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <Link
              href="/services"
              className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline underline-offset-4"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Sectors */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-8 lg:mb-10">
            <p className="text-xs font-medium text-accent-soft uppercase tracking-widest mb-3">
              Where We Work
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
              Sectors
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {homeSectors.map((sector) => (
              <span
                key={sector}
                className="text-sm text-white/70 border border-white/20 bg-white/5 px-5 py-2.5 rounded hover:border-white/50 hover:text-white transition-colors duration-200"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why TMPC */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-medium text-accent uppercase tracking-widest">
              Why TMPC
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {whyItems.map((item) => (
              <div key={item.title}>
                <div className="w-7 h-0.5 bg-accent mb-7" />
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

      {/* 6. CTA */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white tracking-tight mb-5">
            Discuss Your Project
          </h2>
          <p className="text-base text-white/60 leading-relaxed mb-10">
            TMPC supports projects across planning, coordination, and execution phases throughout Thailand.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold bg-white text-navy px-7 py-3.5 rounded hover:bg-canvas transition-colors duration-200"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium border border-white/30 text-white px-7 py-3.5 rounded hover:bg-white/10 transition-colors duration-200"
            >
              Contact TMPC
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
