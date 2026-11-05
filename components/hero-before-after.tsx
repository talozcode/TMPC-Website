'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createSpring, type SpringHandle } from '@/lib/spring'

export const FALLBACK_BEFORE_IMAGE = '/images/scenario-warehouse.jpg'
export const FALLBACK_AFTER_IMAGE = '/images/scenario-commercial.jpg'

/** Keyboard nudge, in percent of the stage width. */
const STEP = 5

/**
 * A drag-to-reveal before/after comparison. Position is a single 0-100 float
 * driven through the spring used everywhere else in this codebase: dragging
 * jumps the spring straight to the pointer (no lag chasing a direct-manipulation
 * gesture), while a keyboard nudge and the one-time mount hint ease into place.
 */
export function HeroBeforeAfter({
  beforeUrl = FALLBACK_BEFORE_IMAGE,
  afterUrl = FALLBACK_AFTER_IMAGE,
  projectName,
  projectDetails,
}: {
  beforeUrl?: string | null
  afterUrl?: string | null
  projectName?: string | null
  projectDetails?: string | null
}) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const springRef = useRef<SpringHandle | null>(null)
  const dragRef = useRef({ active: false, pointerId: -1 })
  const interacted = useRef(false)

  const ensureSpring = useCallback(() => {
    if (springRef.current) return springRef.current
    springRef.current = createSpring({ from: 50, damping: 1, response: 0.35, onUpdate: setPosition })
    return springRef.current
  }, [])

  const positionFromClientX = (clientX: number) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return position
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }

  // A brief, one-time wiggle so a static-looking photograph reads as
  // draggable. Cancelled outright the moment a visitor actually touches it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const spring = ensureSpring()
    const hint = window.setTimeout(() => {
      if (interacted.current) return
      spring.damping = 0.9
      spring.response = 0.5
      spring.setTarget(38)
      window.setTimeout(() => {
        if (interacted.current) return
        spring.setTarget(50)
      }, 550)
    }, 900)
    return () => window.clearTimeout(hint)
  }, [ensureSpring])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const stage = stageRef.current
    if (!stage) return
    interacted.current = true
    const spring = ensureSpring()
    spring.stop()
    dragRef.current = { active: true, pointerId: e.pointerId }
    setDragging(true)
    stage.setPointerCapture(e.pointerId)
    // A tap moves the handle straight to where you touched, no separate grab step.
    spring.set(positionFromClientX(e.clientX))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return
    ensureSpring().set(positionFromClientX(e.clientX))
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return
    dragRef.current.active = false
    setDragging(false)
    const stage = stageRef.current
    if (stage?.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    interacted.current = true
    const spring = ensureSpring()
    spring.damping = 1
    spring.response = 0.3
    if (e.key === 'ArrowLeft') spring.setTarget(Math.max(0, spring.value - STEP))
    else if (e.key === 'ArrowRight') spring.setTarget(Math.min(100, spring.value + STEP))
    else if (e.key === 'Home') spring.setTarget(0)
    else if (e.key === 'End') spring.setTarget(100)
    else return
    e.preventDefault()
  }

  const clamped = Math.max(0, Math.min(100, position))

  return (
    <div className="on-dark panel bg-canvas-dark">
      <div className="px-7 py-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.55rem] font-bold text-accent-light uppercase tracking-[0.28em] mb-2.5">
            Before / After
          </p>
          {projectName && (
            <p className="font-display font-bold text-[1.45rem] text-white tracking-[-0.03em] leading-tight truncate">
              {projectName}
            </p>
          )}
        </div>
        {projectDetails && (
          <span className="flex-shrink-0 text-[0.68rem] text-white/60 leading-snug text-right max-w-[9rem]">
            {projectDetails}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          ref={stageRef}
          className="relative overflow-hidden h-[300px] sm:h-[350px] lg:h-[370px] touch-pan-y select-none"
          style={{ cursor: dragging ? 'grabbing' : 'ew-resize' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* After: the full-bleed base layer, and the LCP candidate, so priority
              lives here only. The before layer below loads normally instead of
              doubling the hero's eager image payload for a photo that starts
              half clipped away anyway. */}
          <Image
            src={afterUrl || FALLBACK_AFTER_IMAGE}
            alt={projectName ? `${projectName}, after` : 'After'}
            fill
            priority
            draggable={false}
            sizes="(max-width: 1024px) 100vw, 30rem"
            className="object-cover pointer-events-none"
          />
          <span className="absolute top-3 right-3 z-10 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white text-[0.55rem] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
            After
          </span>

          {/* Before: clipped to the handle so only the left `clamped`% shows. */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - clamped}% 0 0)` }}>
            <Image
              src={beforeUrl || FALLBACK_BEFORE_IMAGE}
              alt={projectName ? `${projectName}, before` : 'Before'}
              fill
              draggable={false}
              sizes="(max-width: 1024px) 100vw, 30rem"
              className="object-cover pointer-events-none"
            />
            <span className="absolute top-3 left-3 z-10 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white text-[0.55rem] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
              Before
            </span>
          </div>

          {/* Handle */}
          <div
            role="slider"
            aria-label="Reveal before or after"
            aria-orientation="horizontal"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="absolute inset-y-0 z-10 flex items-center justify-center w-9 -ml-[1.125rem] focus:outline-none"
            style={{ left: `${clamped}%` }}
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/70" />
            <span className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-canvas-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/40 via-transparent to-transparent pointer-events-none" />
        </div>

        <Link
          href="/projects"
          className="absolute bottom-4 right-5 z-20 inline-flex items-center gap-1.5 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-3.5 py-2 hover:border-accent-light/60 transition-colors press"
        >
          View Projects <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>
    </div>
  )
}
