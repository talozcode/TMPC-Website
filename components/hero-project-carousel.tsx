'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createSpring, project, VelocityTracker, type SpringHandle } from '@/lib/spring'

export interface HeroProject {
  id: string
  title: string
  category: string
  image: string
  deliverables: string[]
}

const DEFAULT_INTERVAL = 4000
/** Movement before a press is treated as a drag rather than a tap. */
const DRAG_THRESHOLD = 8

/** Signed shortest step from slide `from` to slide `to` around a ring of `count`. */
function shortestDelta(to: number, from: number, count: number) {
  const forward = (((to - from) % count) + count) % count
  return forward > count / 2 ? forward - count : forward
}

/**
 * The project stage tracks the finger one to one for the whole gesture, then
 * lands where the throw was going rather than snapping back from wherever the
 * finger happened to stop. Position is one continuous float in slide units, so
 * the same value drives dragging, the spring, and the auto-advance, and any of
 * them can be grabbed and reversed mid flight.
 */
export function HeroProjectCarousel({
  projects,
  intervalMs = DEFAULT_INTERVAL,
}: {
  projects: HeroProject[]
  intervalMs?: number
}) {
  const count = projects.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const springRef = useRef<SpringHandle | null>(null)
  const activeRef = useRef(0)
  const tracker = useRef(new VelocityTracker())
  const dragRef = useRef({ active: false, startX: 0, startValue: 0, pointerId: -1, moved: 0 })
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /** Position is in slide units and unbounded, which is what makes it wrap. */
  const paint = useCallback((pos: number) => {
    const stage = stageRef.current
    if (!stage) return
    const width = stage.offsetWidth || 1
    for (const node of Array.from(stage.children) as HTMLElement[]) {
      const k = Number(node.dataset.k)
      if (Number.isNaN(k)) continue
      node.style.transform = `translate3d(${((k - pos) * width).toFixed(2)}px, 0, 0)`
    }
    const nearest = Math.round(pos)
    if (nearest !== activeRef.current) {
      activeRef.current = nearest
      setActive(nearest)
    }
  }, [])

  const ensureSpring = useCallback(() => {
    if (springRef.current) return springRef.current
    springRef.current = createSpring({
      from: 0,
      damping: 1,
      response: 0.4,
      onUpdate: (v) => paint(v),
    })
    return springRef.current
  }, [paint])

  const goTo = useCallback(
    (slide: number, velocity = 0) => {
      const spring = ensureSpring()
      if (reduced.current) {
        // A gentler, non vestibular equivalent: land on the slide, no travel.
        spring.set(slide)
        return
      }
      // Bounce only when a throw put momentum into it. A slide that advanced on
      // a timer and still overshoots reads as sloppy rather than physical.
      const thrown = Math.abs(velocity) > 0.4
      spring.damping = thrown ? 0.82 : 1
      spring.response = 0.4
      spring.setTarget(slide, velocity)
    },
    [ensureSpring]
  )

  // Auto-advance, paused on hover, focus, and for the whole of a drag.
  useEffect(() => {
    if (paused || dragging || count <= 1) return
    const id = setInterval(() => goTo(activeRef.current + 1), intervalMs)
    return () => clearInterval(id)
  }, [paused, dragging, count, intervalMs, goTo])

  // Keep the slides painted through mount and any resize.
  useEffect(() => {
    if (count === 0) return
    paint(ensureSpring().value)
    const onResize = () => paint(springRef.current?.value ?? 0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [count, paint, ensureSpring])

  // --- direct manipulation -------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const stage = stageRef.current
    if (!stage) return
    const spring = ensureSpring()
    // Pick the stage up from exactly where it is right now, mid flight or not.
    spring.stop()
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startValue: spring.value,
      pointerId: e.pointerId,
      moved: 0,
    }
    tracker.current.reset()
    tracker.current.add(e.clientX, e.timeStamp)
    stage.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag.active || e.pointerId !== drag.pointerId) return
    const width = stageRef.current?.offsetWidth || 1
    const dx = e.clientX - drag.startX
    drag.moved = Math.max(drag.moved, Math.abs(dx))
    if (!dragging && drag.moved > DRAG_THRESHOLD) setDragging(true)
    tracker.current.add(e.clientX, e.timeStamp)
    // The offset from where they grabbed is preserved, and the feedback is
    // continuous through the gesture rather than only on release.
    const pos = drag.startValue - dx / width
    paint(pos)
    ensureSpring().set(pos)
  }

  const endDrag = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag.active || e.pointerId !== drag.pointerId) return
    drag.active = false
    const stage = stageRef.current
    if (stage?.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId)
    if (drag.moved <= DRAG_THRESHOLD) return

    const width = stage?.offsetWidth || 1
    const spring = ensureSpring()
    // Velocity in slide units per second, negated because dragging left (a
    // negative pixel velocity) advances the position.
    const velocity = -tracker.current.velocity / width
    // Land where the throw was going, not where the finger stopped. Capped at
    // one slide so a hard flick still reads as one deliberate step.
    const projected = spring.value + project(velocity)
    const target = Math.max(
      drag.startValue - 1,
      Math.min(drag.startValue + 1, Math.round(projected))
    )
    goTo(target, velocity)
    // Released with the finger still down elsewhere would leave this stuck on.
    window.setTimeout(() => setDragging(false), 0)
  }

  if (count === 0) return null

  const slideOf = (k: number) => projects[((k % count) + count) % count]
  const current = slideOf(active)
  const displayIndex = ((active % count) + count) % count
  // A window around the active slide, so a long project list does not download
  // every image up front.
  const slots = [active - 2, active - 1, active, active + 1, active + 2]

  return (
    <div
      className="on-dark panel bg-canvas-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Title bar */}
      <div className="px-7 py-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.55rem] font-bold text-accent-light uppercase tracking-[0.28em] mb-2.5">
            {current.category || 'Project'}
          </p>
          <p
            key={current.id}
            className="font-display font-bold text-[1.45rem] text-white tracking-[-0.03em] leading-tight truncate animate-fade-up"
          >
            {current.title}
          </p>
        </div>
        <span className="flex-shrink-0 text-[0.62rem] font-semibold text-white/30 tabular-nums tracking-[0.14em] pb-1.5">
          {String(displayIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      </div>

      {/* Image stage: grabbed anywhere, tracked one to one, thrown with a flick. */}
      <div className="relative">
        <div
          ref={stageRef}
          className="relative overflow-hidden h-[300px] sm:h-[350px] lg:h-[370px] touch-pan-y select-none"
          style={{ cursor: count > 1 ? (dragging ? 'grabbing' : 'grab') : undefined }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {slots.map((k) => {
            const p = slideOf(k)
            return (
              <div key={k} data-k={k} className="absolute inset-0 will-change-transform">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  priority={k === 0}
                  draggable={false}
                  sizes="(max-width: 1024px) 100vw, 30rem"
                  className="object-cover pointer-events-none"
                />
              </div>
            )
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/70 via-transparent to-transparent pointer-events-none" />
        </div>

        <Link
          href="/projects"
          className="absolute bottom-4 right-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-3.5 py-2 hover:border-accent-light/60 transition-colors press"
        >
          View Projects <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>

      {/* Scope, changing with the slide */}
      {current.deliverables.length > 0 && (
        <div key={current.id} className="px-7 py-5 border-t border-white/10 animate-fade-in">
          <p className="text-[0.55rem] font-bold text-accent-light uppercase tracking-[0.28em] mb-3">
            TMPC Scope
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
            {current.deliverables.slice(0, 4).map((d) => (
              <li key={d} className="flex items-start gap-2 text-[0.8rem] text-white/55 leading-snug">
                <span className="w-1 h-1 rounded-full bg-accent-light mt-1.5 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between px-7 py-4 border-t border-white/10">
        <div className="flex items-center gap-1">
          {projects.map((p, i) => (
            <button
              key={p.id}
              // Take the shortest way round rather than winding all the way
              // back through the set.
              onClick={() => goTo(activeRef.current + shortestDelta(i, displayIndex, count))}
              aria-label={`Go to ${p.title}`}
              aria-current={i === displayIndex}
              className="py-3 -my-3 px-1 flex items-center press"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === displayIndex ? 'w-6 bg-accent-light' : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {[
            { dir: -1, label: 'Previous project', d: 'M15 19l-7-7 7-7' },
            { dir: 1, label: 'Next project', d: 'M9 5l7 7-7 7' },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => goTo(activeRef.current + b.dir)}
              aria-label={b.label}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-accent-light/60 transition-colors press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
