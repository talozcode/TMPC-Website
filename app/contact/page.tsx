import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
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
        className="lnk break-all"
      >
        {siteConfig.email}
      </a>
    ),
  },
  {
    label: 'WhatsApp',
    description: 'For quick questions and initial project discussions.',
    action: (
      <a
        href="https://wa.me/66XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm"
      >
        Chat on WhatsApp <span aria-hidden="true">&#8594;</span>
      </a>
    ),
  },
  {
    label: 'Location',
    description: 'On the ground in Bangkok, available across Thailand.',
    action: <p className="t-h4 text-ink">{siteConfig.location}</p>,
  },
]

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero */}
      <section id="contact-hero" className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 scale-110"
            style={{ translate: '0 var(--par, 0%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas-dark via-canvas-dark/85 to-canvas-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark/60" />
        </div>
        <div className="wrap relative z-10 py-[clamp(4rem,8vw,7rem)]">
          <Reveal>
            <p className="eye">Get in Touch</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6">Discuss Your Project</h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7">
              Tell us what you are working on. TMPC will give you a clear picture of what delivery
              looks like in Thailand.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link href="#inquiry-form" className="btn">Start the conversation</Link>
              <a href={`mailto:${siteConfig.email}`} className="btn-2">
                Email us <span aria-hidden="true">&#8594;</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <HeroParallax targetId="contact-hero" amount={8} />

      {/* 2. Contact Methods */}
      <section className="bg-canvas-subtle sec-tight">
        <div className="wrap grid gap-5 md:grid-cols-3">
          {contactMethods.map((method, i) => (
            <Reveal key={method.label} delay={i * 80} className="flex">
              <div className="card card-hover flex flex-col flex-1 p-8 lg:p-9">
                <p className="text-[0.62rem] font-bold text-accent uppercase tracking-[0.2em] mb-4">
                  {method.label}
                </p>
                <p className="text-[0.95rem] text-ink-muted leading-relaxed mb-6 flex-1">
                  {method.description}
                </p>
                {method.action}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Contact Form */}
      <section id="inquiry-form" className="bg-canvas sec scroll-mt-24">
        <div className="wrap grid lg:grid-cols-[minmax(0,19rem)_1fr] gap-10 lg:gap-20">
          <Reveal>
            <p className="eye">Inquiry Form</p>
            <h2 className="t-h2 text-ink mt-6 mb-4">Start a Conversation</h2>
            <p className="t-body text-ink-muted max-w-[34ch]">
              Share a few details about your project. TMPC will follow up to set up an initial call.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="card p-7 lg:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec-tight">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Ready to Begin</p>
            <h2 className="t-h1 text-white mt-6">One partner. Full accountability.</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              Most project problems are easier to manage with the right partner involved early.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="#inquiry-form" className="btn">Discuss Your Project</Link>
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
