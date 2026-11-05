'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK, FIRST_STATIC } from './gsap'

/**
 * A heading whose lines rise out of their own masks. The split is redone
 * automatically on resize and once web fonts load (autoSplit), so lines are
 * always real rendered lines, not a guess.
 *
 * on="load" plays immediately (heroes); on="view" waits until the heading
 * scrolls into view. With reduced motion, or before JavaScript runs, the
 * heading is simply there. Inside an opening band ([data-first]) on a phone it
 * is also simply there: the first screen paints at once instead of waiting
 * for the script, which is what keeps mobile load under two seconds.
 */
export function SplitHeading({
  as: Tag = 'h2',
  children,
  className = '',
  on = 'view',
  delay = 0,
  id,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  on?: 'load' | 'view'
  delay?: number
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (el.closest('[data-first]') && window.matchMedia(FIRST_STATIC).matches) {
          el.dataset.splitReady = 'true'
          return
        }
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            el.dataset.splitReady = 'true'
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.25,
              stagger: 0.09,
              ease: 'expo.out',
              delay: delay / 1000,
              scrollTrigger:
                on === 'view' ? { trigger: el, start: 'top 88%', once: true } : undefined,
            })
          },
        })
        return () => split.revert()
      })
      // Reduced motion: nothing to wait for.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        el.dataset.splitReady = 'true'
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} id={id} className={className} data-split="">
      {children}
    </Tag>
  )
}
