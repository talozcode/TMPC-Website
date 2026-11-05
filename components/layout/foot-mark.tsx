'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'

/**
 * The TMPC logo set full width at the foot of every page, rising out of the
 * floor as the footer arrives. A signature, not information, so it is hidden
 * from assistive tech.
 */
export function FootMark() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el.firstElementChild,
          { yPercent: 55 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} aria-hidden="true" className="wrap mt-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={480} height={148} className="foot-mark translate-y-[8%]" loading="lazy" />
    </div>
  )
}
