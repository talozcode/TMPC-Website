'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { CompareToggle } from '@/components/compare/compare-stage'
import { createTimeline, imagesReady, inOutQuart, motionOk, outExpo, stagger, utils } from '@/components/anim/anime'
import { clipFor, gridCells } from './geometry'

/**
 * About: a survey grid over the cleared site, then the finished project
 * developing square by square. When the frame arrives a hairline grid is
 * pegged out from the bottom-left corner (the datum), the squares turn to the
 * after photograph in a wave from that corner, and the grid lifts off. The
 * switch on the image plays it either way, so a reader can go back to the
 * site as it was.
 *
 * Without JavaScript the finished photograph shows. With reduced motion the
 * switch still works, instantly.
 */
export function TransformGrid({
  before,
  after,
  labels,
  cols = 4,
  rows = 5,
  sizes,
  className = '',
}: {
  before: CompareImage
  after: CompareImage
  labels: { before: string; after: string }
  cols?: number
  rows?: number
  sizes: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const api = useRef<{ show: (side: 'before' | 'after') => void } | null>(null)
  const [showing, setShowing] = useState<'before' | 'after'>('after')

  useEffect(() => {
    const el = ref.current
    const top = topRef.current
    if (!el || !top) return
    const cells = gridCells(cols, rows, 1)
    const vLines = Array.from(el.querySelectorAll<HTMLElement>('[data-gl="v"]'))
    const hLines = Array.from(el.querySelectorAll<HTMLElement>('[data-gl="h"]'))
    const lines = [...vLines, ...hLines]
    const datum = (rows - 1) * cols
    const far = cols - 1
    const paint = () => {
      top.style.clipPath = clipFor(cells, 'center')
    }
    let tl: ReturnType<typeof createTimeline> | null = null

    const set = (side: 'before' | 'after') => {
      const on = side === 'after' ? 1 : 0
      cells.forEach((c) => (c.p = on))
      utils.set(vLines, { scaleY: 1 })
      utils.set(hLines, { scaleX: 1 })
      utils.set(lines, { opacity: on ? 0 : 1 })
      paint()
    }

    const play = (side: 'before' | 'after') => {
      tl?.pause()
      if (!motionOk()) {
        set(side)
        return
      }
      if (side === 'after') {
        tl = createTimeline({ defaults: { ease: outExpo } })
          .add(lines, { opacity: 1, duration: 300 }, 0)
          .add(vLines, { scaleY: 1, duration: 800, ease: inOutQuart, delay: stagger(60) }, 0)
          .add(hLines, { scaleX: 1, duration: 800, ease: inOutQuart, delay: stagger(60, { reversed: true }) }, 0)
          .add(cells, { p: 1, duration: 900, delay: stagger(55, { grid: [cols, rows], from: datum }), onUpdate: paint }, 420)
          .add(lines, { opacity: 0, duration: 500, ease: 'outQuad' }, '-=380')
      } else {
        tl = createTimeline({ defaults: { ease: outExpo } })
          .add(lines, { opacity: 1, duration: 300 }, 0)
          .add(vLines, { scaleY: 1, duration: 300 }, 0)
          .add(hLines, { scaleX: 1, duration: 300 }, 0)
          .add(cells, { p: 0, duration: 650, ease: inOutQuart, delay: stagger(40, { grid: [cols, rows], from: far }), onUpdate: paint }, 120)
      }
    }

    api.current = {
      show: (side) => {
        setShowing(side)
        play(side)
      },
    }

    // Arrive on the cleared site and develop it once, the first time the
    // frame is properly in view. Already on screen at load: leave it finished.
    const r = el.getBoundingClientRect()
    if (!motionOk() || r.top < window.innerHeight) return
    cells.forEach((c) => (c.p = 0))
    utils.set(vLines, { scaleY: 0, opacity: 1 })
    utils.set(hLines, { scaleX: 0, opacity: 1 })
    paint()
    setShowing('before')
    let live = true
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        imagesReady(el).then(() => {
          if (!live) return
          setShowing('after')
          play('after')
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      live = false
      io.disconnect()
      tl?.pause()
    }
  }, [cols, rows])

  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${labels.before} and ${labels.after}`}
      className={`tf tf-grid ${className}`}
    >
      <div className="tf-layer">
        <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover tf-before" />
      </div>
      <div ref={topRef} className="tf-layer tf-top">
        <Image src={after.src} alt={after.alt} fill sizes={sizes} className="object-cover tf-after" />
      </div>
      <div className="tf-gridlines" aria-hidden="true">
        {Array.from({ length: cols - 1 }, (_, i) => (
          <span key={`v${i}`} data-gl="v" style={{ left: `${((i + 1) / cols) * 100}%` }} />
        ))}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <span key={`h${i}`} data-gl="h" style={{ top: `${((i + 1) / rows) * 100}%` }} />
        ))}
      </div>
      <CompareToggle
        showing={showing}
        onShow={(side) => api.current?.show(side)}
        labels={labels}
        className="bottom-4 right-4"
      />
    </div>
  )
}
