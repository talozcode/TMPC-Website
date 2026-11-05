'use client'

import { useEffect, useState, type CSSProperties } from 'react'

export type ContactProgress = { filled: number; total: number; sent: boolean }

/** Fired by ContactForm as the visitor fills it in, and once it is sent. */
export const CONTACT_PROGRESS_EVENT = 'tmpc:contact-progress'

const NEXT = [
  { title: 'Share a few details', body: 'Tell us what you are planning, where, and roughly when.' },
  { title: 'We set up a call', body: 'TMPC follows up to arrange an initial conversation.' },
  { title: 'A straight assessment', body: 'A clear picture of what delivery looks like in Thailand.' },
]

/**
 * "What happens next", answering the form beside it. The rule over step 01
 * fills in signal orange as the form is filled; once the form is sent, step
 * 01 is signed off and step 02 becomes the one in hand. Nothing moves on
 * scroll or hover: the steps only ever report what the visitor has done.
 */
export function ContactSteps() {
  const [p, setP] = useState<ContactProgress>({ filled: 0, total: 4, sent: false })

  useEffect(() => {
    const on = (e: Event) => setP((e as CustomEvent<ContactProgress>).detail)
    window.addEventListener(CONTACT_PROGRESS_EVENT, on)
    return () => window.removeEventListener(CONTACT_PROGRESS_EVENT, on)
  }, [])

  const fill = (i: number) => {
    if (i === 0) return p.sent ? 1 : p.filled / p.total
    if (i === 1) return p.sent ? 1 : 0
    return 0
  }
  const state = (i: number) => {
    if (p.sent) return i === 0 ? 'done' : i === 1 ? 'now' : 'next'
    return i === 0 ? (p.filled > 0 ? 'now' : 'next') : 'next'
  }

  return (
    <>
      <h2 className="t-meta text-ink-muted">What happens next</h2>
      <ol className="mt-5 steps">
        {NEXT.map((s, i) => (
          <li key={s.title} className="step" data-state={state(i)} style={{ '--fill': fill(i) } as CSSProperties}>
            <span className="step-rule" aria-hidden="true" />
            <span className="step-num t-meta">
              <span className="step-digits">{String(i + 1).padStart(2, '0')}</span>
              <svg className="step-tick" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m3 8.5 3 3L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" pathLength={1} />
              </svg>
            </span>
            <div>
              <p className="font-semibold [font-variation-settings:'wdth'_106]">{s.title}</p>
              <p className="text-[0.94rem] text-ink-soft mt-1.5 leading-relaxed">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {p.sent ? 'Step one done. TMPC will be in touch to set up a call.' : ''}
      </p>
    </>
  )
}
