import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/data'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name} to discuss your project in Thailand. Project consulting, coordination, and development management inquiries welcome.`,
}

const contactMethods = [
  {
    label: 'Email',
    description: 'For project inquiries, documentation, and coordination discussions.',
    action: (
      <a
        href={`mailto:${siteConfig.email}`}
        className="text-sm font-semibold text-ink underline underline-offset-4 decoration-clay/40 hover:decoration-clay transition-colors duration-150 break-all"
      >
        {siteConfig.email}
      </a>
    ),
  },
  {
    label: 'WhatsApp',
    description: 'Direct communication for initial project discussions and coordination inquiries.',
    action: (
      <a
        href="https://wa.me/66XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium bg-clay text-white px-5 py-2.5 hover:bg-clay-light transition-colors duration-200"
      >
        Chat on WhatsApp <span aria-hidden="true">&#8594;</span>
      </a>
    ),
  },
  {
    label: 'Location',
    description: 'Thailand-based coordination and project management support.',
    action: (
      <p className="text-sm font-semibold text-ink">{siteConfig.location}</p>
    ),
  },
]

const approachItems = [
  'Planning and structuring',
  'Consultant coordination',
  'Project oversight',
  'Operational setup support',
  'Execution management',
]

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="w-8 h-0.5 bg-clay mb-6" />
            <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-6 animate-fade-in">
              Get in Touch
            </p>
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.06] mb-8 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Discuss Your Project
            </h1>
            <p
              className="text-lg text-ink-muted leading-relaxed max-w-xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              Whether you are planning a commercial, industrial, hospitality, wellness, operational, or real estate project, TMPC can support the planning, coordination, and execution process across Thailand.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Intro */}
      <section className="bg-canvas-subtle border-y border-line py-14 lg:py-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <p className="text-base text-ink leading-relaxed mb-4">
            TMPC works with businesses, investors, operators, and project owners across multiple industries and project environments.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            We welcome early-stage discussions, project inquiries, and coordination consultations related to projects throughout Thailand.
          </p>
        </div>
      </section>

      {/* 3. Contact Methods */}
      <section className="bg-canvas py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line overflow-hidden">
            {contactMethods.map((method) => (
              <div key={method.label} className="bg-canvas p-8 lg:p-10 hover:bg-canvas-subtle transition-colors duration-200">
                <p className="text-xs font-semibold text-clay uppercase tracking-[0.2em] mb-4">
                  {method.label}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  {method.description}
                </p>
                {method.action}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Contact Form */}
      <section id="inquiry-form" className="bg-canvas-subtle border-y border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <div className="w-8 h-0.5 bg-clay mb-4" />
              <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-4">
                Inquiry Form
              </p>
              <h2 className="font-display text-2xl lg:text-3xl text-ink mb-3">
                Start a Conversation
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                Share a few details about your project. TMPC will follow up to arrange an initial discussion.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 5. How We Typically Work */}
      <section className="bg-canvas py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="w-8 h-0.5 bg-clay mb-4" />
          <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-4">
            Our Process
          </p>
          <h2 className="font-display text-2xl lg:text-3xl text-ink mb-8">
            How We Typically Work
          </h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            Most projects begin with an initial discussion to understand project scope, operational requirements, timelines, and coordination needs.
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-6">
            Depending on the project, TMPC may support:
          </p>
          <ul className="space-y-3 mb-8">
            {approachItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-ink-secondary">
                <span className="w-1 h-1 rounded-full bg-clay flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-base text-ink-muted leading-relaxed">
            Every project is approached individually based on scope and complexity.
          </p>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-canvas-dark py-20 lg:py-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-clay uppercase tracking-[0.28em] mb-6">
            Ready to Begin
          </p>
          <h2 className="font-display text-2xl lg:text-3xl text-canvas leading-tight mb-5">
            Structured Coordination. Practical Execution Support.
          </h2>
          <p className="text-base text-canvas/55 leading-relaxed mb-10">
            TMPC supports projects throughout Thailand with a focus on communication clarity, organized coordination, and execution-focused management support.
          </p>
          <Link
            href="#inquiry-form"
            className="inline-flex items-center text-sm font-medium bg-clay text-white px-7 py-3.5 hover:bg-clay-light transition-colors duration-200"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
