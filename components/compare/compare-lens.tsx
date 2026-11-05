'use client'

import { useEffect, useRef } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { createSpring, type SpringHandle } from '@/lib/spring'
import { CompareStage, CompareToggle } from './compare-stage'
import { useCompareToggle } from './use-compare'

/**
 * Variant 4: a square lens follows the pointer and shows the after image
 * inside it, over the before. The lens springs open on enter and closed on
 * leave. Desktop with motion only; touch, keyboard and reduced motion get the
 * Before / After switch, which is always on the image anyway.
 */
export function CompareLens({
  before,
  after,
  labels,
  className = '',
  sizes = '(max-width: 1024px) 100vw, 50vw',
}: {
  before: CompareImage
  after: CompareImage
  labels: { before: string; after: string }
  className?: string
  sizes?: string
}) {
  const t = useCompareToggle()
  const { stageRef } = t
  const lensRef = useRef<HTMLDivElement>(null)
  const sizeSpring = useRef<SpringHandle | null>(null)
  const geo = useRef({ left: 0, top: 0, side: 240, scrollY: 0 })

  const lensOn = t.hover && t.showing === 'before' && !t.wiping
  const shape = t.reduced ? 'fade' : lensOn ? 'lens' : 'x'

  useEffect(() => () => sizeSpring.current?.stop(), [])

  // Read once per hover (and again only if the page scrolled under the pointer).
  const measure = () => {
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    geo.current = { left: r.left, top: r.top, side: Math.round(Math.min(r.width * 0.42, 280)), scrollY: window.scrollY }
    lensRef.current?.style.setProperty('width', `${geo.current.side}px`)
    lensRef.current?.style.setProperty('height', `${geo.current.side}px`)
  }

  const size = () => {
    if (!sizeSpring.current) {
      sizeSpring.current = createSpring({
        from: 0,
        damping: 0.78,
        response: 0.45,
        onUpdate: (v) => {
          const el = stageRef.current
          if (!el) return
          const s = Math.max(0, v)
          el.style.setProperty('--ls', `${s.toFixed(1)}px`)
          el.style.setProperty('--lk', (s / geo.current.side).toFixed(4))
        },
      })
    }
    return sizeSpring.current
  }

  const follow = (e: React.PointerEvent) => {
    if (window.scrollY !== geo.current.scrollY) measure()
    const el = stageRef.current
    el?.style.setProperty('--lx', `${(e.clientX - geo.current.left).toFixed(1)}px`)
    el?.style.setProperty('--ly', `${(e.clientY - geo.current.top).toFixed(1)}px`)
  }

  return (
    <CompareStage
      stageRef={stageRef}
      before={before}
      after={after}
      top="after"
      shape={shape}
      sizes={sizes}
      className={className}
      onPointerEnter={(e) => {
        if (!lensOn || e.pointerType !== 'mouse') return
        measure()
        follow(e)
        size().setTarget(geo.current.side)
      }}
      onPointerMove={(e) => {
        if (!lensOn || e.pointerType !== 'mouse') return
        follow(e)
        // Re-entering after a switch: the lens opens again without a fresh enter.
        if (sizeSpring.current && sizeSpring.current.value < 1 && !sizeSpring.current.isAnimating) size().setTarget(geo.current.side)
      }}
      onPointerLeave={() => sizeSpring.current?.setTarget(0)}
    >
      <div ref={lensRef} className="cmp-lens" aria-hidden="true" />
      <CompareToggle showing={t.showing} labels={labels} onShow={t.show} />
    </CompareStage>
  )
}
