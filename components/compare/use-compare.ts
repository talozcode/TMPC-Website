'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createSpring, type SpringHandle } from '@/lib/spring'

/**
 * The engine under every before/after variant. Position is one 0-100 float,
 * driven through the same spring as the rest of the site: dragging jumps the
 * spring straight to the pointer (no lag chasing a direct-manipulation
 * gesture), while a keyboard nudge, a snap and the one-time hint ease there.
 *
 * The value is written to the stage as the --pos custom property and to the
 * handle's ARIA attributes, never into React state, so a drag re-renders
 * nothing and the CSS turns --pos into clip-path and transform.
 */

export type CompareAxis = 'x' | 'y'

/** Keyboard nudge, in percent of the stage. */
const STEP = 5
const PAGE_STEP = 20

export function clamp(v: number) {
  return Math.max(0, Math.min(100, v))
}

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
}

/** A media query as render input. False on the server and during hydration. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false
  )
}

export const REDUCED = '(prefers-reduced-motion: reduce)'
/** A real hover with a precise pointer: the lens and hover-follow cards need both. */
export const FINE_HOVER = '(hover: hover) and (pointer: fine)'

export function writePos(el: HTMLElement | null, v: number) {
  el?.style.setProperty('--pos', v.toFixed(2))
}

export function useCompare({
  axis = 'x',
  initial = 50,
  hint = false,
  stops,
  touchHandleOnly = false,
  disabled = false,
  valueText = (v: number) => `${Math.round(v)}% before`,
  onValue,
  onRest,
}: {
  axis?: CompareAxis
  initial?: number
  /** A one-time wiggle the first time the stage scrolls into view. */
  hint?: boolean
  /** Snap targets, ascending. The keyboard steps between them and a release settles on the nearest. */
  stops?: readonly number[]
  /** On touch, only the handle starts a drag; the image scrolls the page and a tap moves the seam. */
  touchHandleOnly?: boolean
  /** Pointer and keyboard input ignored (something else, like scroll, is driving). */
  disabled?: boolean
  valueText?: (v: number) => string
  onValue?: (v: number) => void
  onRest?: () => void
} = {}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const springRef = useRef<SpringHandle | null>(null)
  const drag = useRef({ active: false, pointerId: -1, start: 0, size: 1, type: 'mouse' })
  const interacted = useRef(false)
  const shown = useRef('')
  // Where the spring is heading, so held keys accumulate instead of restarting from a lagging value.
  const goal = useRef(initial)

  // Latest callbacks without re-creating the spring.
  const cb = useRef({ valueText, onValue, onRest, disabled })
  useEffect(() => {
    cb.current = { valueText, onValue, onRest, disabled }
  })

  const apply = useCallback((v: number) => {
    const c = clamp(v)
    writePos(stageRef.current, c)
    const h = handleRef.current
    const text = cb.current.valueText(c)
    if (h && text !== shown.current) {
      shown.current = text
      h.setAttribute('aria-valuenow', String(Math.round(c)))
      h.setAttribute('aria-valuetext', text)
    }
    cb.current.onValue?.(c)
  }, [])

  const spring = useCallback(() => {
    if (!springRef.current) {
      springRef.current = createSpring({
        from: initial,
        damping: 1,
        response: 0.35,
        onUpdate: apply,
        onRest: () => cb.current.onRest?.(),
      })
    }
    return springRef.current
  }, [initial, apply])

  useEffect(() => () => springRef.current?.stop(), [])

  const set = useCallback(
    (v: number) => {
      goal.current = clamp(v)
      spring().set(goal.current)
    },
    [spring]
  )
  const setTarget = useCallback(
    (v: number, damping = 1, response = 0.35) => {
      const s = spring()
      s.damping = damping
      s.response = response
      goal.current = clamp(v)
      s.setTarget(goal.current)
    },
    [spring]
  )

  const nearestStop = useCallback(
    (v: number) => (stops?.length ? stops.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)) : v),
    [stops]
  )

  // A brief, one-time wiggle so a still photograph reads as draggable, played
  // when it first scrolls into view. Cancelled the moment anyone touches it.
  useEffect(() => {
    const el = stageRef.current
    if (!hint || !el || window.matchMedia(REDUCED).matches) return
    let t1 = 0
    let t2 = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        t1 = window.setTimeout(() => {
          if (interacted.current || cb.current.disabled) return
          setTarget(initial - 12, 0.9, 0.5)
          t2 = window.setTimeout(() => {
            if (!interacted.current) setTarget(initial, 0.9, 0.5)
          }, 550)
        }, 500)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [hint, initial, setTarget])

  // The stage rect is read once, when a gesture starts, never during it.
  const measure = () => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return null
    return axis === 'x' ? { start: r.left, size: r.width || 1 } : { start: r.top, size: r.height || 1 }
  }
  const fromPoint = (e: { clientX: number; clientY: number }) =>
    ((((axis === 'x' ? e.clientX : e.clientY) - drag.current.start) / drag.current.size) * 100)

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (cb.current.disabled) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current.type = e.pointerType
    if (touchHandleOnly && e.pointerType !== 'mouse' && !handleRef.current?.contains(e.target as Node)) return
    const m = measure()
    if (!m) return
    interacted.current = true
    spring().stop()
    drag.current = { active: true, pointerId: e.pointerId, start: m.start, size: m.size, type: e.pointerType }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.dataset.dragging = 'true'
    // A press moves the handle straight to where you touched, no separate grab step.
    set(fromPoint(e))
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
    set(fromPoint(e))
  }

  const endDrag = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
    drag.current.active = false
    delete e.currentTarget.dataset.dragging
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (stops?.length) setTarget(nearestStop(spring().value), 0.85, 0.4)
  }

  // Touch on a handle-only stage: a tap on the image is the single-pointer
  // alternative to dragging, and moves the seam there with the spring.
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    if (cb.current.disabled || !touchHandleOnly || drag.current.type === 'mouse') return
    if (handleRef.current?.contains(e.target as Node)) return
    const m = measure()
    if (!m) return
    interacted.current = true
    drag.current.start = m.start
    drag.current.size = m.size
    setTarget(nearestStop(fromPoint(e)))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (cb.current.disabled) return
    const from = goal.current
    const up = ['ArrowRight', 'ArrowDown', 'PageDown']
    const down = ['ArrowLeft', 'ArrowUp', 'PageUp']
    let next: number
    if (e.key === 'Home') next = stops?.[0] ?? 0
    else if (e.key === 'End') next = stops?.[stops.length - 1] ?? 100
    else if (up.includes(e.key) || down.includes(e.key)) {
      const dir = up.includes(e.key) ? 1 : -1
      if (stops?.length) {
        const at = stops.indexOf(nearestStop(from))
        next = stops[Math.max(0, Math.min(stops.length - 1, at + dir))]
      } else {
        next = from + dir * (e.key.startsWith('Page') ? PAGE_STEP : STEP)
      }
    } else return
    e.preventDefault()
    interacted.current = true
    setTarget(next, 1, 0.3)
  }

  return {
    stageRef,
    handleRef,
    set,
    setTarget,
    spring,
    stageProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClick,
    },
    handleProps: { onKeyDown },
  }
}

/**
 * For the variants that live on hover (lens, hover-follow cards): a
 * before/after switch that also serves touch, keyboard and reduced motion.
 * The after image is on top; --pos 0 shows before, 100 shows after. A switch
 * wipes across with the spring, or crossfades when motion is reduced.
 *
 * Without JavaScript the stage keeps its server-rendered 50/50 split; once
 * hydrated it settles on before.
 */
export function useCompareToggle() {
  const reduced = useMediaQuery(REDUCED)
  const fine = useMediaQuery(FINE_HOVER)
  const [showing, setShowing] = useState<'before' | 'after'>('before')
  // True while a switch is wiping, so the lens waits for it to finish.
  const [wiping, setWiping] = useState(false)
  const c = useCompare({ onRest: () => setWiping(false) })
  const { set, setTarget } = c

  useEffect(() => set(0), [set])

  const show = (side: 'before' | 'after') => {
    setShowing(side)
    setWiping(true)
    setTarget(side === 'after' ? 100 : 0, 1, reduced ? 0.5 : 0.6)
  }

  return { ...c, showing, setShowing, show, wiping, reduced, hover: fine && !reduced }
}
