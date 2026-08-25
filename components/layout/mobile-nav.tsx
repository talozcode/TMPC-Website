'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSpring, project, rubberband, VelocityTracker, type SpringHandle } from '@/lib/spring'
import { navLinks, siteConfig } from '@/lib/data'

/**
 * The small-screen navigation, built as a bottom sheet you can throw away with
 * your thumb rather than a panel that drops open and waits to be dismissed.
 *
 * The mechanics follow the fluid interface rules: the sheet tracks the finger
 * one to one from wherever it was grabbed, resists past its open position
 * instead of stopping dead, projects the release velocity forward to decide
 * whether it lands open or dismissed, and hands that same velocity to the
 * spring so there is no seam between dragging and animating. Grabbing it mid
 * flight picks it up at its current position with its current velocity, so a
 * reversal never hits a brick wall.
 */

const DISMISS_FRACTION = 0.42

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const springRef = useRef<SpringHandle | null>(null)
  const heightRef = useRef(0)
  const dragRef = useRef({ active: false, startY: 0, startValue: 0, pointerId: -1 })
  const tracker = useRef(new VelocityTracker())
  const reduced = useRef(false)

  useEffect(() => {
    setMounted(true)
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /** Paint the sheet and the scrim from one source of truth: sheet offset in px. */
  const paint = useCallback((y: number) => {
    const sheet = sheetRef.current
    const scrim = scrimRef.current
    if (!sheet) return
    const h = heightRef.current || sheet.offsetHeight || 1
    sheet.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    const progress = Math.max(0, Math.min(1, 1 - y / h))
    if (scrim) {
      scrim.style.opacity = String(progress)
      // Materialise rather than simply fade: the blur builds with the surface,
      // so it reads as a real material arriving instead of an opacity ramp.
      const blur = `blur(${(progress * 16).toFixed(1)}px)`
      scrim.style.backdropFilter = blur
    }
  }, [])

  const ensureSpring = useCallback(() => {
    if (springRef.current) return springRef.current
    springRef.current = createSpring({
      from: heightRef.current,
      damping: 1,
      response: 0.4,
      onUpdate: (v) => paint(v),
    })
    return springRef.current
  }, [paint])

  const settle = useCallback(
    (toOpen: boolean, velocity = 0) => {
      const h = heightRef.current || sheetRef.current?.offsetHeight || 1
      const spring = ensureSpring()
      if (reduced.current) {
        spring.set(toOpen ? 0 : h)
        if (!toOpen) setOpen(false)
        return
      }
      // Bounce only when a throw put momentum into it. A sheet that was tapped
      // open and still overshoots reads as sloppy rather than physical.
      const thrown = Math.abs(velocity) > 80
      spring.damping = thrown ? 0.8 : 1
      spring.response = 0.35
      spring.setTarget(toOpen ? 0 : h, velocity)
      if (!toOpen) window.setTimeout(() => setOpen(false), 260)
    },
    [ensureSpring]
  )

  // Open: measure, park the sheet off screen, then spring it up.
  useEffect(() => {
    if (!open) return
    const sheet = sheetRef.current
    if (!sheet) return
    heightRef.current = sheet.offsetHeight
    const spring = ensureSpring()
    spring.set(heightRef.current)
    paint(heightRef.current)
    const id = requestAnimationFrame(() => settle(true))

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus the dialog itself so it is announced, deferred a frame: the click
    // that opened it would otherwise pull focus straight back to the trigger.
    const focusId = requestAnimationFrame(() => sheet.focus({ preventScroll: true }))

    return () => {
      cancelAnimationFrame(id)
      cancelAnimationFrame(focusId)
      document.body.style.overflow = prevOverflow
    }
  }, [open, ensureSpring, paint, settle])

  const close = useCallback(() => {
    settle(false, 0)
    triggerRef.current?.focus({ preventScroll: true })
  }, [settle])

  // Escape closes, and focus stays inside while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const sheet = sheetRef.current
      if (!sheet) return
      const focusable = sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!focusable.length) return
      if (document.activeElement === sheet) {
        e.preventDefault()
        ;(e.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  // --- direct manipulation -------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const sheet = sheetRef.current
    if (!sheet) return
    const spring = ensureSpring()
    // Pick the sheet up from exactly where it is right now, mid flight or not.
    spring.stop()
    heightRef.current = sheet.offsetHeight || heightRef.current
    dragRef.current = {
      active: true,
      startY: e.clientY,
      startValue: spring.value,
      pointerId: e.pointerId,
    }
    tracker.current.reset()
    tracker.current.add(e.clientY, e.timeStamp)
    sheet.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag.active || e.pointerId !== drag.pointerId) return
    const h = heightRef.current || 1
    // The offset from where they grabbed is preserved. Snapping to a fixed
    // point on grab is what breaks the illusion immediately.
    let y = drag.startValue + (e.clientY - drag.startY)
    if (y < 0) y = -rubberband(-y, h)
    tracker.current.add(e.clientY, e.timeStamp)
    // Continuous feedback for the whole gesture, not only on release.
    paint(y)
    ensureSpring().set(y)
  }

  const endDrag = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag.active || e.pointerId !== drag.pointerId) return
    drag.active = false
    const sheet = sheetRef.current
    if (sheet?.hasPointerCapture(e.pointerId)) sheet.releasePointerCapture(e.pointerId)

    const h = heightRef.current || 1
    const velocity = tracker.current.velocity
    // Land where the throw was going, not where the finger happened to stop.
    const projected = ensureSpring().value + project(velocity)
    settle(!(projected > h * DISMISS_FRACTION), velocity)
  }

  const trigger = (
    <button
      ref={triggerRef}
      className="menu-btn"
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={open ? 'Close menu' : 'Open menu'}
      // Opening on pointer-down rather than click: the sheet starts moving the
      // instant the finger lands, which is the whole difference in feel.
      onPointerDown={() => {
        if (!open) setOpen(true)
      }}
      onClick={() => {
        if (open) close()
      }}
    >
      <span aria-hidden="true" />
    </button>
  )

  if (!mounted) return trigger

  return (
    <>
      {trigger}

      {/* Portalled to the body on purpose. The header carries a backdrop-filter,
          which establishes a containing block for fixed-position descendants, so
          a sheet rendered inside it would be trapped in the header's height
          instead of covering the viewport. */}
      {open &&
        createPortal(
          <div className="sheet-root">
            <div ref={scrimRef} className="sheet-scrim" style={{ opacity: 0 }} onPointerDown={close} />
            <div
              ref={sheetRef}
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              tabIndex={-1}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div className="sheet-grip" aria-hidden="true">
                <span />
              </div>
              <nav aria-label="Site">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="sheet-link"
                    data-active={pathname === link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link href="/contact" onClick={close} className="btn sheet-cta">
                Discuss Your Project
              </Link>
              <a href={`mailto:${siteConfig.email}`} className="sheet-mail">
                {siteConfig.email}
              </a>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
