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
      <section className="relative min-h-[88vh] flex items-center bg-canvas overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[50vw] hidden lg:block overflow-hidden">
          <Image
            src="/images/hero-home.jpg"
            alt="Project coordination and development management in Thailand"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-canvas to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-7 animate-fade-in">
                TMPC Development Co., Ltd.
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold text-ink tracking-tight leading-[1.13] max-w-lg mb-7 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Your Project Development Partner in Thailand
              </h1>
              <p
                className="text-lg text-ink-muted leading-relaxed max-w-md mb-10 animate-fade-up"
                style={{ animationDelay: '0.22s' }}
              >
                TMPC provides project consulting, coordination, and execution oversight across commercial, industrial, hospitality, wellness, and real estate projects.
              </p>
              <div
                className="flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: '0.36s' }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-6 py-3 rounded hover:bg-ink-secondary transition-colors duration-150"
                >
                  Discuss Your Project
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-medium border border-line text-ink px-6 py-3 rounded hover:border-ink transition-colors duration-150"
                >
                  Explore Services
                </Link>
              </div>
            </div>
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
              <div key={service.title} className="bg-canvas p-8 lg:p-9 transition-colors duration-200 hover:bg-canvas-subtle">
                <p className="text-xs text-ink-muted mb-5 tabular-nums">
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
      <section className="bg-canvas-subtle border-y border-line py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-8 lg:mb-10">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              Where We Work
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight">
              Sectors
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {homeSectors.map((sector) => (
              <span
                key={sector}
                className="text-sm text-ink-secondary border border-line bg-canvas px-5 py-2.5 rounded"
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

      {/* 6. CTA */}
      <section className="bg-canvas-subtle border-t border-line py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink tracking-tight mb-4">
            Discuss Your Project
          </h2>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            TMPC supports projects across planning, coordination, and execution phases throughout Thailand.
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
