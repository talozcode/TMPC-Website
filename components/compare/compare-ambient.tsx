'use client'

import { useRef } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'
import { CompareStage } from './compare-stage'

/**
 * Variant 7: not interactive. Behind a band's content, a slow diagonal wipe
 * ping-pongs between two photographs, held down to a faint texture by low
 * opacity and an ink veil so the text over it stays well above AA. It pauses
 * whenever the band is off screen.
 *
 * Reduced motion and no JavaScript both get the still after image.
 */
export function CompareAmbient({ before, after }: { before: CompareImage; after: CompareImage }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const sweep = gsap.fromTo(
        el,
        { '--pos': 0 },
        { '--pos': 100, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, repeatDelay: 2.5, paused: true }
      )
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sweep.play() : sweep.pause()))
      io.observe(el)
      return () => io.disconnect()
    })
    return () => mm.revert()
  })

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <CompareStage
        stageRef={ref}
        before={before}
        after={after}
        shape="diagonal"
        initial={0}
        sizes="100vw"
        className="absolute inset-0 opacity-25"
      />
      <div className="absolute inset-0 bg-ink/75" />
    </div>
  )
}
