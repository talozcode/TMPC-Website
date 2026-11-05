import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { ArrowSwap } from '@/components/ui/arrow-link'
import { CtaBandScroll, BangkokTime } from '@/components/sections/cta-band-motion'
import { COMPARE } from '@/lib/compare-slots'

/**
 * The closing band on every page, and the first half of the ending: the
 * footer below it is the second. One statement, then the two ways in.
 *
 * Behind it, Bangkok at blue hour, held under an ink veil that keeps every
 * line of text above AA and lets the skyline through between the columns. The
 * photograph settles from a slight enlargement as the band arrives and drifts
 * a few percent against the page while it passes. The band arrives on a datum:
 * an orange hairline drawn across its top edge at the pace of the scroll. Its
 * ground settles into the footer's tone so the seam between them disappears, and as the footer comes up a low warmth from
 * its beam gathers along the bottom edge (CtaBandScroll). Both follow the
 * scroll position exactly, both ways.
 *
 * Each way in is a full-width row you can hit anywhere. The form is the
 * primary action, a solid tile; the call is its quieter companion, an outlined
 * tile that fills from the bottom when you point at it. Pointing at a row
 * draws its rule in orange from the left, steps the title in, pins the survey
 * marks round its tile and hands the arrow on, while the other row steps back.
 * None of it reacts while the page is moving. The call row carries the time in
 * Bangkok, which is what an overseas client needs to pick a window.
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
      label: 'Discuss Your Project',
      body: 'A short form about the project. We reply by email with next steps.',
      primary: true,
    },
    {
      href: '/contact?mode=call',
      label: 'Book a call',
      body: 'Choose a time window that suits your time zone for an introductory call.',
      primary: false,
    },
  ]
  return (
    <section className="cta-band ink-band sec relative isolate overflow-hidden" data-tone="dark" data-cta-band="">
      <div className="cta-photo" aria-hidden="true">
        <Image src={COMPARE.cta.after.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="cta-veil" aria-hidden="true" />
      <CtaBandScroll />
      <div className="wrap relative grid lg:grid-cols-12 gap-y-12 gap-x-10">
        <div className="lg:col-span-6">
          <SplitHeading className="t-h1 text-fog max-w-[14ch]">{title}</SplitHeading>
          <Reveal delay={120}>
            <p className="t-lead mt-7">{lead}</p>
          </Reveal>
        </div>
        <div className="cta-paths lg:col-span-5 lg:col-start-8 self-end">
          {paths.map((p, i) => (
            <Reveal key={p.href} delay={160 + i * 90}>
              <Link href={p.href} className="cta-path group" data-primary={p.primary ? 'true' : undefined}>
                <span className="cta-path-text">
                  <span className="cta-path-label t-h3 text-fog block">{p.label}</span>
                  <span className="cta-path-body block text-[0.95rem] mt-2 max-w-[38ch]">{p.body}</span>
                  {!p.primary && <BangkokTime />}
                </span>
                <span className="cta-tile marks" aria-hidden="true">
                  <span className="mk" />
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
