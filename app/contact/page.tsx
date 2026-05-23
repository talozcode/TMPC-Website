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
        className="text-sm font-medium text-ink underline underline-offset-4 hover:text-ink-secondary transition-colors duration-150 break-all"
      >
        {siteConfig.email}
      </a>
    ),
  },
  {
    label: 'WhatsApp',
    description: 'Direct communication for initial project discussions and coordination inquiries.',
    action: (
      // Replace +66XXXXXXXXX with the actual WhatsApp number before launch
      <a
        href="https://wa.me/66XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-4 py-2 rounded hover:bg-ink-secondary transition-colors duration-150"
      >
        Chat on WhatsApp
      </a>
    ),
  },
  {
    label: 'Location',
    description: 'Thailand-based coordination and project management support.',
    action: (
      <p className="text-sm font-medium text-ink">{siteConfig.location}</p>
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
      <section className="bg-canvas py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-medium text-accent uppercase tracking-widest mb-6 animate-fade-in">
            Get in Touch
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-ink tracking-tight leading-[1.13] max-w-2xl mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Discuss Your Project
          </h1>
          <p
            className="text-lg text-ink-muted leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: '0.22s' }}
          >
            Whether you are planning a commercial, industrial, hospitality, wellness, operational, or real estate project, TMPC can support the planning, coordination, and execution process across Thailand.
          </p>
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
              <div key={method.label} className="bg-canvas p-8 lg:p-10 transition-colors duration-200 hover:bg-canvas-subtle">
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-4">
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
              <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight mb-3">
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
          <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight mb-8">
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
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
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
      <section className="bg-canvas-subtle border-t border-line py-20 lg:py-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-ink tracking-tight mb-4 leading-snug">
            Structured Coordination. Practical Execution Support.
          </h2>
          <p className="text-base text-ink-muted leading-relaxed mb-8">
            TMPC supports projects throughout Thailand with a focus on communication clarity, organized coordination, and execution-focused management support.
          </p>
          <Link
            href="#inquiry-form"
            className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-6 py-3 rounded hover:bg-ink-secondary transition-colors duration-150"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
