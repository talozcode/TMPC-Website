'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/anim/gsap'

export interface ProcessStep {
  title: string
  when: string
  description: string
  services: string
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
/** Progress worked out from the page, for a refresh, before the trigger has updated. */
const progressOf = (t: ScrollTrigger) => clamp01((window.scrollY - t.start) / (t.end - t.start || 1))
/** The reading line, as a share of the viewport from the top. */
const LINE = 58

/**
 * The engagement, start to opening, as a ruled, numbered list: the number in
 * the gutter, the stage itself, then when it happens and the service that
 * covers it. No photographs (the v3 process photos are stock).
 *
 * With `scrub` (the home page, 05/11/2026) it is v3's scroll-scrubbed index:
 * the rule over the row being read fills with teal at the reader's pace as
 * the row crosses the reading line, its number comes up to full strength,
 * and it settles to a quiet line once read past. Computed from scroll
 * position on every update, so it moves exactly with the page, both ways,
 * and never on its own. Reduced motion: no fill; the row being read is
 * simply marked (its number and rule switch, no travel). Without `scrub`
 * (Services) the list is static, as before.
 */
export function ProcessTimeline({
  steps,
  heading,
  scrub = false,
}: {
  steps: ProcessStep[]
  heading: React.ReactNode
  scrub?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !scrub) return
      const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'))
      const mm = gsap.matchMedia()
      mm.add({ motion: MOTION_OK, reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const { motion } = ctx.conditions as { motion: boolean }
        const place = (row: HTMLElement, p: number) => {
          const state = p <= 0 ? 'next' : p >= 1 ? 'done' : 'now'
          if (row.dataset.state !== state) row.dataset.state = state
          if (motion) row.style.setProperty('--f', p.toFixed(4))
        }
        const triggers = rows.map((row) => {
          const t = ScrollTrigger.create({
            trigger: row,
            start: `top ${LINE}%`,
            end: `bottom ${LINE}%`,
            onUpdate: (self) => place(row, self.progress),
            onRefresh: (self) => place(row, progressOf(self)),
          })
          place(row, progressOf(t))
          return t
        })
        return () => {
          triggers.forEach((t) => t.kill())
          rows.forEach((row) => {
            delete row.dataset.state
            row.style.removeProperty('--f')
          })
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [scrub] }
  )

  return (
    <div ref={ref} className="proc" data-scrub={scrub || undefined}>
      <div className="proc-head">{heading}</div>
      <ol className="proc-list">
        {steps.map((s, i) => (
          <li key={s.title} className="pr-row" data-step>
            {scrub && (
              <span className="pr-rule" aria-hidden="true">
                <span className="pr-fill" />
              </span>
            )}
            <span className="pr-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="pr-main">
              <h3 className="pr-title">{s.title}</h3>
              <p className="t-body pr-desc">{s.description}</p>
            </div>
            <dl className="pr-meta">
              <div>
                <dt className="t-micro">When</dt>
                <dd>{s.when}</dd>
              </div>
              <div>
                <dt className="t-micro">Service</dt>
                <dd>{s.services}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
