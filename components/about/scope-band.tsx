'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'

/** Phones only. Tablet and laptop keep the band exactly as it was. */
const PHONE = '(max-width: 767px)'

/**
 * About, "We do not build": on a phone the band is told with one mark, the
 * strike. As the reader scrolls, an orange line is drawn through "build." in
 * the heading, and then through each thing TMPC does not do, so the list reads
 * as crossed off. Between the two, Plan, Coordinate and Oversee hang on a
 * survey spine whose orange fill follows the reading line; each stage's node
 * and number light as the fill reaches it.
 *
 * Everything is scrubbed from scroll position, so it runs forward and back
 * with the reader and nothing is tapped or dragged. Without JavaScript, or
 * with reduced motion, the CSS shows the finished state: struck, filled, lit.
 */
export function ScopeBand({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(`${PHONE} and ${MOTION_OK}`, () => {
        const scrub = { scrub: true, invalidateOnRefresh: true }

        el.querySelectorAll<HTMLElement>('[data-strike]').forEach((s) => {
          // The heading is struck once its lines have risen; list items as
          // each one reaches the upper half of the screen.
          const head = s.closest<HTMLElement>('[data-split]')
          gsap.fromTo(
            s,
            { '--strike': 0 },
            {
              '--strike': 1,
              ease: 'none',
              scrollTrigger: head
                ? { trigger: head, start: 'top 58%', end: 'top 34%', ...scrub }
                : { trigger: s, start: 'top 74%', end: 'top 56%', ...scrub },
            }
          )
        })

        // The spine fill ends exactly on the reading line (62% down), so it
        // reads as a pen following the eye, not a progress bar.
        const spine = el.querySelector<HTMLElement>('[data-spine]')
        if (spine) {
          gsap.fromTo(
            spine,
            { '--spine': 0 },
            { '--spine': 1, ease: 'none', scrollTrigger: { trigger: spine, start: 'top 62%', end: 'bottom 62%', ...scrub } }
          )
          spine.querySelectorAll<HTMLElement>('[data-stage]').forEach((li) => {
            gsap.fromTo(
              li,
              { '--on': 0 },
              { '--on': 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top+=6 62%', end: 'top+=6 56%', ...scrub } }
            )
          })
        }
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={`ab-scope ${className}`}>
      {children}
    </div>
  )
}
