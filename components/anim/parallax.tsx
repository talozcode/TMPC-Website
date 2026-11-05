'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, MOTION_OK } from './gsap'

/**
 * Moves its child against the scroll by up to `amount` percent of its own
 * height while the frame crosses the viewport. Put it inside a `.frame` (which
 * clips) so the travel never exposes an edge; `.frame-inner` is oversized by
 * 8% top and bottom for exactly that.
 */
export function Parallax({
  children,
  amount = 8,
  className = 'frame-inner',
}: {
  children: ReactNode
  amount?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
