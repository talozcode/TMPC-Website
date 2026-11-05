'use client'

import { useEffect, useRef } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { ScrollTrigger, MOTION_OK } from '@/components/anim/gsap'
import { CompareSeam, CompareStage, CompareToggle } from './compare-stage'
import { useCompareToggle } from './use-compare'

/** A soft S: the seam eases off the edge, travels evenly, and eases to rest. */
const glide = (t: number) => (1 - Math.cos(Math.PI * t)) / 2

/**
 * Variant 5: a card whose seam is carried by the scroll. As the card rises
 * through the screen the after image wipes in from the left, exactly with
 * the page (the same clock as Lenis), and finishes as the card passes the
 * middle; scroll back and it wipes out again. The seam only shows while it
 * is moving. The Before / After switch on the image takes over for good once
 * pressed, and is the whole interaction with reduced motion (a crossfade).
 * The card carries the survey marks on hover, like the project images.
 */
export function CompareCard({
  before,
  after,
  sector,
  location,
  title,
  className = '',
  preload = false,
}: {
  before: CompareImage
  after: CompareImage
  sector: string
  location: string
  title: string
  className?: string
  /** The first card is the largest paint on Projects: load it eagerly. */
  preload?: boolean
}) {
  const t = useCompareToggle()
  const { stageRef, set, setShowing } = t
  // Once the switch is pressed, the reader is in charge and the scroll lets go.
  const manual = useRef(false)

  useEffect(() => {
    const el = stageRef.current
    if (!el || !window.matchMedia(MOTION_OK).matches) return
    let side = ''
    const paint = (progress: number) => {
      if (manual.current) return
      const v = glide(progress) * 100
      set(v)
      const next = v > 50 ? 'after' : 'before'
      if (next !== side) {
        side = next
        setShowing(next)
      }
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'center 40%',
      onUpdate: (self) => paint(self.progress),
    })
    paint(st.progress)
    return () => st.kill()
  }, [stageRef, set, setShowing])

  return (
    <article className={`marks-host group ${className}`}>
      <div className="marks">
        <span className="mk" />
        <CompareStage
          stageRef={stageRef}
          before={before}
          after={after}
          top="after"
          shape={t.reduced ? 'fade' : 'x'}
          initial={0}
          sizes="(max-width: 768px) 100vw, 33vw"
          preload={preload}
          className="aspect-[4/5]"
        >
          <CompareSeam axis="x" interactive={false} className="cmp-seam-auto" />
          <CompareToggle
            showing={t.showing}
            labels={{ before: 'Before', after: 'After' }}
            onShow={(s) => {
              manual.current = true
              t.show(s)
            }}
          />
        </CompareStage>
      </div>
      <p className="t-meta text-ink-muted mt-5 flex flex-wrap gap-x-3">
        <span className="text-ink">{sector}</span>
        <span>{location}</span>
      </p>
      <h3 className="t-h3 mt-2 max-w-[24ch]">{title}</h3>
    </article>
  )
}
