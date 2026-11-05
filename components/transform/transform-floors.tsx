'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { gsap, ScrollTrigger, MOTION_OK } from '@/components/anim/gsap'
import { clipFor, type Cell } from './geometry'

/** A soft S, the same as the project cards: eases off the floor, rises evenly, eases to rest. */
const glide = (t: number) => (1 - Math.cos(Math.PI * t)) / 2
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
/** How far each floor starts after the one below it, as a share of the build. */
const STAGGER = 0.11
/** Hairline overlap between floors, in percent, so finished floors never seam. */
const BLEED = 0.15
/** One cycle, in seconds: build, hold the finished building, dissolve back to the site, pause. */
const BUILD = 3.8
const HOLD = 3.2
const DISSOLVE = 1.4
const REST = 0.9

/** Each floor's progress, bottom floor first, for an overall progress 0 to 1. */
function floorsAt(progress: number, floors: number): number[] {
  const len = 1 - (floors - 1) * STAGGER
  return Array.from({ length: floors }, (_, i) => glide(clamp01((progress - i * STAGGER) / len)))
}

/** Bottom floor first. Floors alternate the side they are laid from, like slabs craned in. */
function clipForFloors(levels: number[]): string {
  const n = levels.length
  const h = 100 / n
  const cells: Cell[] = levels.map((p, i) => {
    const y = (n - 1 - i) * h
    const y0 = Math.max(0, y - BLEED)
    const y1 = Math.min(100, y + h + BLEED)
    return { x: 0, y: y0, w: 100, h: y1 - y0, p, grow: i % 2 ? 'right' : 'left' }
  })
  return clipFor(cells, 'left')
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Services: the building goes up, floor by floor, on its own. The finished
 * photograph is laid over the site one floor at a time, bottom first, each
 * slab sliding in from alternate sides behind a signal edge carrying its
 * level, overlapping the next so the whole thing reads as one move. The
 * finished photograph settles into place as it is uncovered. It holds, then
 * dissolves back to the site and builds again. Under the frame a legend
 * counts the floors laid, one segment per floor, filling with its floor.
 *
 * It runs on a clock, not the scroll, and takes no input (D asked that the
 * visitor can't touch it). It only plays while the frame is on screen.
 * Only clip-path, transform and opacity change. Without JavaScript, or with
 * reduced motion, the lower half is built so both states are in view.
 */
export function TransformFloors({
  before,
  after,
  labels,
  floors = 6,
  sizes,
  preload = false,
  className = '',
}: {
  before: CompareImage
  after: CompareImage
  labels: { before: string; after: string }
  floors?: number
  sizes: string
  preload?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const half = Math.floor(floors / 2)
  const still = Array.from({ length: floors }, (_, i) => (i < half ? 1 : 0))

  useEffect(() => {
    const root = ref.current
    if (!root || !window.matchMedia(MOTION_OK).matches) return

    const stage = root.querySelector<HTMLElement>('.tf-stage')!
    const top = root.querySelector<HTMLElement>('.tf-top')!
    const edges = Array.from(root.querySelectorAll<HTMLElement>('.tf-edge'))
    const segs = Array.from(root.querySelectorAll<HTMLElement>('.tf-seg i'))
    const count = root.querySelector<HTMLElement>('.tf-count')!
    let lastClip = ''
    let lastCount = -1
    let lastDone: boolean | null = null

    const paint = (progress: number, drain = 0) => {
      const lv = floorsAt(progress, floors)
      root.style.setProperty('--p', progress.toFixed(4))

      const clip = clipForFloors(lv)
      if (clip !== lastClip) top.style.clipPath = lastClip = clip
      top.style.opacity = (1 - drain).toFixed(3)

      lv.forEach((p, i) => {
        // Edge sits on the slab's leading side, fading in off the frame edge and out as it lands.
        const e = edges[i]
        const side = i % 2 ? -1 : 1
        e.style.transform = `translate3d(${(side * p * 100).toFixed(3)}%,0,0)`
        e.style.opacity = clamp01(Math.min(p * 12, (1 - p) * 9)).toFixed(3)
        segs[i].style.transform = `scaleX(${(p * (1 - drain)).toFixed(4)})`
      })

      const laid = drain > 0.5 ? 0 : lv.filter((p) => p > 0.5).length
      if (laid !== lastCount) {
        // Replace the number so it rolls in from the side it moved toward
        // (not on the first paint, which only sets it).
        const span = document.createElement('span')
        span.textContent = pad(laid)
        if (lastCount >= 0) count.dataset.dir = laid > lastCount ? '1' : '-1'
        count.replaceChildren(span)
        lastCount = laid
      }
      const done = progress > 0.5 && drain < 0.5
      if (done !== lastDone) root.dataset.state = (lastDone = done) ? 'after' : 'before'
    }

    const state = { p: 0, d: 0 }
    const draw = () => paint(state.p, state.d)
    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } })
    tl.to(state, { p: 1, duration: BUILD, onUpdate: draw })
      .to(state, { d: 1, duration: DISSOLVE, ease: 'power2.inOut', onUpdate: draw }, `+=${HOLD}`)
      .call(() => {
        state.p = 0
        state.d = 0
        draw()
      })
      .to({}, { duration: REST })
    draw()

    // Plays only while the frame is on screen, picking up where it left off.
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top 85%',
      end: 'bottom 15%',
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    })
    if (st.isActive) tl.play()
    root.dataset.live = 'true'

    return () => {
      st.kill()
      tl.kill()
      top.style.removeProperty('opacity')
      delete root.dataset.live
      delete root.dataset.state
    }
  }, [floors])

  return (
    <div ref={ref} className="tf-floors" style={{ '--p': 0.5 } as CSSProperties}>
      <div
        role="img"
        aria-label={`${labels.before}: ${before.alt}. ${labels.after}: ${after.alt}.`}
        className={`tf tf-stage ${className}`}
      >
        <div className="tf-layer tf-base">
          <Image src={before.src} alt="" fill sizes={sizes} preload={preload} className="object-cover tf-before" />
        </div>
        <div className="tf-layer tf-top" style={{ clipPath: clipForFloors(still) }}>
          <Image src={after.src} alt="" fill sizes={sizes} preload={preload} className="object-cover tf-after" />
        </div>
        <div className="tf-seams" aria-hidden="true">
          {Array.from({ length: floors - 1 }, (_, i) => (
            <span key={i} style={{ top: `${((i + 1) / floors) * 100}%` }} />
          ))}
        </div>
        {Array.from({ length: floors }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="tf-edge"
            data-from={i % 2 ? 'right' : 'left'}
            style={{ top: `${((floors - 1 - i) / floors) * 100}%`, height: `${100 / floors}%` }}
          >
            <b className="tf-tag">L{pad(i + 1)}</b>
          </div>
        ))}
      </div>

      <div className="tf-legend" aria-hidden="true">
        <span className="tf-lab tf-lab-before">{labels.before}</span>
        <span className="tf-track">
          {still.map((p, i) => (
            <span key={i} className="tf-seg">
              <i style={{ transform: `scaleX(${p})` }} />
            </span>
          ))}
        </span>
        <span className="tf-lab tf-lab-after">{labels.after}</span>
        <span className="tf-tally">
          <span className="tf-count count-roll">
            <span>{pad(half)}</span>
          </span>
          <span className="tf-of">/{pad(floors)}</span>
        </span>
      </div>
    </div>
  )
}
