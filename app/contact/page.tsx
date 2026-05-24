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
        className="text-sm font-semibold text-accent hover:text-accent-dark transition-colors duration-150 break-all"
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
        className="inline-flex items-center gap-2 text-sm font-semibold bg-accent text-white px-5 py-2.5 hover:bg-accent-dark transition-colors duration-200"
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

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-canvas-dark py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Get in Touch
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-white leading-[1.08] tracking-tight mb-8 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Discuss Your Project
            </h1>
            <p
              className="text-lg text-white/55 leading-relaxed max-w-xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              Whether you are planning a commercial, industrial, hospitality, wellness, operational, or real estate project, TMPC can support the planning, coordination, and execution process across Thailand.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Methods */}
      <section className="bg-canvas-subtle border-b border-line py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method) => (
              <div key={method.label} className="bg-canvas border border-line p-8 lg:p-10 hover:border-accent/40 hover:shadow-sm transition-all duration-200">
                <p className="text-[0.65rem] font-semibold text-accent uppercase tracking-[0.2em] mb-4">
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
      <section id="inquiry-form" className="bg-canvas border-b border-line py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                Inquiry Form
              </p>
              <h2 className="font-display font-semibold text-2xl lg:text-3xl text-ink tracking-tight mb-3">
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

      {/* 5. CTA */}
      <section className="bg-canvas-dark py-20 lg:py-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Ready to Begin
          </p>
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-white tracking-tight leading-tight mb-5">
            Structured Coordination. Practical Execution.
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            TMPC supports projects throughout Thailand with a focus on communication clarity, organized coordination, and execution-focused management.
          </p>
          <Link
            href="#inquiry-form"
            className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
