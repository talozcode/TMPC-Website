'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/anim/gsap'

export interface ProcessStep {
  title: string
  when: string
  description: string
  services: string
  image?: { src: string; alt: string }
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
/** The same soft S as the Services building: eases off the floor, eases to rest. */
const glide = (t: number) => (1 - Math.cos(Math.PI * t)) / 2
/** Progress worked out from the page, for a refresh, before the trigger has updated. */
const progressOf = (t: ScrollTrigger) => clamp01((window.scrollY - t.start) / (t.end - t.start || 1))

/** Wide enough for the plate beside the index, and tall enough to hold it in view. Matches globals.css. */
const VIEWER = '(min-width: 1024px) and (min-height: 560px)'
const REDUCE = '(prefers-reduced-motion: reduce)'
/** The reading line, as a share of the viewport from the top. */
const LINE = 58

/**
 * The engagement, start to opening, set as an index rather than a timeline.
 * Each stage is a ruled row: a light numeral in the gutter, when it happens
 * and the service that covers it on one line, then the stage itself. The reader's place is the rule
 * over the row they are in, which fills with signal orange at their pace and
 * settles to a quiet line once they have read past it.
 *
 * On a laptop the photographs leave the rows for one small plate that holds
 * still beside the index. As each row comes up to the reading line its
 * photograph is built up over the last one from the bottom edge, behind a thin
 * orange edge, settling from a slight enlargement, and the plate drifts a few
 * percent against the page while the index passes. On phones and tablets each
 * row carries its own short strip instead, built up the same way as it rises.
 *
 * All of it is computed from scroll position on every update, so it moves
 * exactly with the page, both ways, and never on its own.
 *
 * Without JavaScript the plate shows the first photograph and every strip is
 * in view. Reduced motion: no fills or wipes; the plate simply changes to the
 * row being read.
 */
export function ProcessTimeline({ steps, heading }: { steps: ProcessStep[]; heading: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pictured = steps.some((s) => s.image)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const list = el.querySelector<HTMLElement>('[data-list]')
      const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'))
      const plate = el.querySelector<HTMLElement>('[data-plate]')
      const slots = Array.from(el.querySelectorAll<HTMLElement>('[data-slot]'))
      const strips = Array.from(el.querySelectorAll<HTMLElement>('[data-photo]'))
      const mm = gsap.matchMedia()

      mm.add({ motion: MOTION_OK, reduce: REDUCE, viewer: VIEWER }, (ctx) => {
        const { motion, viewer } = ctx.conditions as { motion: boolean; viewer: boolean }
        const triggers: ScrollTrigger[] = []

        // Which side of the reading line each row is on, from the trigger's own
        // progress so a row never reads as current once the line has left it.
        // The slot for a row follows it, which is all the plate does under
        // reduced motion.
        const place = (row: HTMLElement, i: number, p: number) => {
          const state = p <= 0 ? 'next' : p >= 1 ? 'done' : 'now'
          if (row.dataset.state !== state) row.dataset.state = state
          if (motion) row.style.setProperty('--f', p.toFixed(4))
          else if (viewer) {
            const slot = slots.find((sl) => sl.dataset.slot === String(i))
            if (slot && slot !== slots[0]) slot.dataset.on = String(state !== 'next')
          }
        }

        // Hold the plate's centre a little below the middle of the screen.
        const measure = () => plate?.style.setProperty('--ph', `${plate.offsetHeight / 2}px`)
        if (viewer && plate) {
          measure()
          ScrollTrigger.addEventListener('refreshInit', measure)
        }

        // Where the plate lets go of the screen: the end of the index meets the
        // plate's lower edge. The last row has to be read by then, or its rule
        // is left half filled as the plate scrolls away with it.
        const release = () => {
          if (!viewer || !plate || !list) return Infinity
          const top = parseFloat(getComputedStyle(plate).top) || 0
          return list.getBoundingClientRect().bottom + window.scrollY - (top + plate.offsetHeight)
        }
        rows.forEach((row, i) => {
          const last = i === rows.length - 1
          const t = ScrollTrigger.create({
            trigger: row,
            start: `top ${LINE}%`,
            end: last
              ? (self) => {
                  const line = row.getBoundingClientRect().bottom + window.scrollY - (window.innerHeight * LINE) / 100
                  const by = release()
                  return by > self.start + 40 ? Math.min(line, by) : line
                }
              : `bottom ${LINE}%`,
            onUpdate: (self) => place(row, i, self.progress),
            onRefresh: (self) => place(row, i, progressOf(self)),
          })
          triggers.push(t)
          place(row, i, progressOf(t))
        })

        if (motion && viewer && plate) {
          // Each photograph is built up over the last in the short run before its
          // row reaches the line, so the plate is still while a row is read.
          slots.slice(1).forEach((slot) => {
            const row = rows[Number(slot.dataset.slot)]
            if (!row) return
            const paint = (p: number) => slot.style.setProperty('--w', glide(p).toFixed(4))
            const t = ScrollTrigger.create({
              trigger: row,
              start: `top ${LINE + 14}%`,
              end: `top ${LINE}%`,
              onUpdate: (self) => paint(self.progress),
              onRefresh: (self) => paint(progressOf(self)),
            })
            triggers.push(t)
            paint(progressOf(t))
          })
          const drift = (p: number) => plate.style.setProperty('--d', ((0.5 - p) * 5).toFixed(3))
          const t = ScrollTrigger.create({
            trigger: list,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => drift(self.progress),
            onRefresh: (self) => drift(progressOf(self)),
          })
          triggers.push(t)
          drift(progressOf(t))
        }

        if (motion && !viewer) {
          // The row's strip, across its whole pass through the screen.
          const paint = (fig: HTMLElement, t: ScrollTrigger, p: number) => {
            const vh = window.innerHeight
            const top = vh - p * (t.end - t.start) // the strip's top edge, from the viewport top
            const r = glide(clamp01((vh * 0.96 - top) / (vh * 0.36))) // built up from the bottom
            const v = clamp01((vh * 0.74 - top) / (vh * 0.3)) // veil lifts near the reading line
            const y = (p - 0.5) * 6 // drift against the page, in percent
            fig.style.setProperty('--r', r.toFixed(4))
            fig.style.setProperty('--v', v.toFixed(4))
            fig.style.setProperty('--y', y.toFixed(3))
          }
          strips.forEach((fig) => {
            const t = ScrollTrigger.create({
              trigger: fig,
              start: 'top bottom',
              end: 'bottom top',
              onUpdate: (self) => paint(fig, self, self.progress),
              onRefresh: (self) => paint(fig, self, progressOf(self)),
            })
            triggers.push(t)
            paint(fig, t, progressOf(t))
          })
        }

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure)
          triggers.forEach((t) => t.kill())
          rows.forEach((row) => {
            delete row.dataset.state
            row.style.removeProperty('--f')
          })
          slots.forEach((slot) => {
            delete slot.dataset.on
            slot.style.removeProperty('--w')
          })
          plate?.style.removeProperty('--d')
          plate?.style.removeProperty('--ph')
          strips.forEach((fig) => ['--r', '--v', '--y'].forEach((p) => fig.style.removeProperty(p)))
        }
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="proc" data-pictured={pictured || undefined}>
      <div className="proc-head">{heading}</div>
      <div className="proc-body">
        {pictured && (
          <div className="proc-aside">
            <figure data-plate className="pv">
              <div className="pv-frame">
                {steps.map((s, i) =>
                  s.image ? (
                    <div key={s.title} data-slot={i} className="pv-slot">
                      <div className="pv-layer">
                        <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 30vw, 1px" className="pv-img" />
                        <span className="pv-veil" aria-hidden="true" />
                      </div>
                      <span className="pv-edge" aria-hidden="true" />
                    </div>
                  ) : null
                )}
              </div>
              <span className="pv-marks" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </figure>
          </div>
        )}
        <ol data-list className="proc-list">
          {steps.map((s, i) => (
            <li key={s.title} data-step className="pr-row">
              <span className="pr-rule" aria-hidden="true">
                <span className="pr-fill" />
              </span>
              <span className="pr-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="pr-when t-meta">{s.when}</p>
              <p className="pr-svc t-meta">{s.services}</p>
              <div className="pr-body">
                <h3 className="pr-title">{s.title}</h3>
                {s.image && (
                  <figure data-photo className="pr-photo">
                    <div className="pr-frame">
                      <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 640px) 26rem, 88vw" className="pr-img" />
                      <span className="pr-veil" aria-hidden="true" />
                    </div>
                    <span className="pv-marks" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </figure>
                )}
                <p className="t-body pr-desc">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
