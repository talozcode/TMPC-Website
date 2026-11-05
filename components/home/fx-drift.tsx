'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/anim/gsap'

/** Resting pace of the belt, in px per second: slow enough to read the figures. */
const SPEED = 22

/**
 * The rates row as a belt, after the GVL site's rate board. The set of
 * currencies is drawn twice, end to end, and the pair slides left and wraps,
 * so the row never runs out.
 *  - it only runs while the band is on screen, and eases up to pace the first
 *    time it arrives rather than starting at full speed
 *  - scrolling pushes it: faster while the page moves, and a firm scroll up
 *    briefly runs it backwards; the push fades out on its own
 *  - hover never touches it; keyboard focus in the row brings it to a gentle
 *    stop so a keyboard user can read it, and it picks up again on leaving
 *
 * Without JavaScript or with reduced motion there is one set and nothing
 * moves: the row is a plain sideways scroller, as on the static version.
 */
export function FxDrift({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      const track = el?.firstElementChild as HTMLElement | null
      const set = track?.firstElementChild as HTMLElement | null
      if (!el || !track || !set) return
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        el.dataset.running = ''
        el.scrollLeft = 0

        let width = set.offsetWidth
        let x = 0
        let boost = 0 // from scroll velocity, signed
        let boostNow = 0
        let hold = 1 // 0 while keyboard focus is in the row
        let holdNow = 1
        let visible = false
        // 0 to 1: the belt's share of its resting pace, raised once on first arrival
        const pace = { v: 0 }
        let ramp: gsap.core.Tween | null = null

        const setX = gsap.quickSetter(track, 'x', 'px')
        const tick = (_t: number, dt: number) => {
          if (!visible) return
          boostNow += (boost - boostNow) * 0.08
          boost *= 0.92
          holdNow += (hold - holdNow) * 0.1
          const v = SPEED * (pace.v + Math.abs(boostNow)) * holdNow * (boostNow < -0.6 ? -1 : 1)
          x = gsap.utils.wrap(-width, 0, x - v * (dt / 1000))
          setX(x)
        }
        gsap.ticker.add(tick)

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: ({ isActive }) => {
            visible = isActive
            if (isActive && !ramp) ramp = gsap.to(pace, { v: 1, duration: 2.4, delay: 0.3, ease: 'power2.inOut' })
          },
          onUpdate: (self) => {
            boost = gsap.utils.clamp(-3, 3, self.getVelocity() / 600)
          },
        })

        // Only keyboard focus holds the belt (:focus-visible, so a click or tap does not)
        const stop = () => {
          if (el.matches(':focus-visible')) hold = 0
        }
        const go = () => (hold = 1)
        el.addEventListener('focusin', stop)
        el.addEventListener('focusout', go)

        // The set's width moves with fonts loading and the viewport
        const ro = new ResizeObserver(() => (width = set.offsetWidth))
        ro.observe(set)

        return () => {
          gsap.ticker.remove(tick)
          ramp?.kill()
          st.kill()
          ro.disconnect()
          el.removeEventListener('focusin', stop)
          el.removeEventListener('focusout', go)
          gsap.set(track, { clearProps: 'transform' })
          delete el.dataset.running
        }
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Rates in Thai baht"
      tabIndex={0}
      data-lenis-prevent-horizontal
      className={`group ${className}`}
    >
      <div className="flex w-max min-w-full will-change-transform">
        <div className="flex shrink-0">{children}</div>
        {/* The second copy closes the loop; it only exists while the belt runs */}
        <div aria-hidden="true" className="hidden shrink-0 group-data-[running]:flex">
          {children}
        </div>
      </div>
    </div>
  )
}
