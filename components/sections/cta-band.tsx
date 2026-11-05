import Link from 'next/link'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { ArrowSwap } from '@/components/ui/arrow-link'
import { CtaBandScroll, BangkokTime } from '@/components/sections/cta-band-motion'

/**
 * The home page's closing band, after v3's (components/sections/cta-band.tsx
 * on feat/v3), in the professional styling: a navy band with no photograph
 * (v3's was stock). One statement, then the two ways in as full-width ruled
 * rows you can hit anywhere. The band arrives on a datum, a teal hairline
 * drawn across its top edge at the pace of the scroll, and a low teal glow
 * gathers along its foot as the footer comes up (CtaBandScroll).
 *
 * Pointing at a row draws its rule in teal from the left, steps the title in
 * and hands the arrow on while the other row steps back; none of it reacts
 * while the page is moving. The form row carries the time in Bangkok, which
 * is what an overseas client needs to pick a moment to write or call.
 */
export function CtaBand({
  title = (
    <>
      Most project problems are <em>preventable.</em>
    </>
  ),
  lead = 'Talk to TMPC before work begins.',
}: {
  title?: ReactNode
  lead?: string
}) {
  const paths = [
    {
      href: '/contact',
      label: 'Schedule a Consultation',
      body: 'A short note about the project. We reply by email with next steps.',
      primary: true,
    },
    {
      href: '/projects',
      label: 'See our work',
      body: 'Projects TMPC has coordinated, from rendering to completion.',
      primary: false,
    },
  ]
  return (
    <section className="cta-band dark-band on-dark sec relative isolate overflow-hidden" data-cta-band="">
      <CtaBandScroll />
      <div className="wrap relative grid lg:grid-cols-12 gap-y-12 gap-x-10">
        <div className="lg:col-span-6">
          <p className="eye">Work With TMPC</p>
          <SplitHeading className="t-h1 text-fog mt-6 max-w-[14ch]">{title}</SplitHeading>
          <Reveal delay={120}>
            <p className="t-lead mt-7">{lead}</p>
          </Reveal>
        </div>
        <div className="cta-paths lg:col-span-5 lg:col-start-8 self-end">
          {paths.map((p, i) => (
            <Reveal key={p.href} delay={160 + i * 90}>
              <Link href={p.href} className="cta-path" data-primary={p.primary ? 'true' : undefined}>
                <span className="cta-path-text">
                  <span className="cta-path-label t-h3 text-fog block">{p.label}</span>
                  <span className="cta-path-body block text-[0.95rem] mt-2 max-w-[38ch]">{p.body}</span>
                  {p.primary && <BangkokTime />}
                </span>
                <span className="cta-tile" aria-hidden="true">
                  <ArrowSwap className="relative w-4 h-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
