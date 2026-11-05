'use client'

import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'

/**
 * As the hero scrolls away the photograph settles back and dims while the
 * copy lifts a little faster than the page: depth, without anything moving on
 * its own. Scrubbed straight from scroll position, transform and opacity only.
 * Renders nothing; it drives the hero's existing elements.
 */
export function HeroMotion() {
  useGSAP(() => {
    const hero = document.getElementById('hero')
    const layers = hero?.querySelector('[data-hero-layers]')
    const veil = hero?.querySelector('[data-hero-veil]')
    const copy = hero?.querySelector('[data-hero-copy]')
    if (!hero || !layers || !veil || !copy) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' },
      })
      tl.to(layers, { scale: 1.07, yPercent: 6 }, 0)
      tl.to(veil, { opacity: 0.6 }, 0)
      tl.to(copy, { yPercent: -14, opacity: 0.2 }, 0)
    })
    return () => mm.revert()
  })
  return null
}

// Bangkok, roughly the inner city: the readout maps the hero's width and
// height onto this box so the numbers are plausible for where the photo is.
const LAT = [13.7742, 13.7316]
const LON = [100.4921, 100.5262]

/**
 * A surveyor's reticle that follows a fine pointer across the hero, with a
 * live coordinate readout. Decorative, so hidden from assistive tech; off for
 * touch and for reduced motion. Position is written straight to transforms,
 * never to React state.
 */
export function Reticle() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const hero = el?.parentElement
    if (!el || !hero) return
    const ok = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    if (!ok) return
    const x = el.querySelector<HTMLElement>('.reticle-y')!
    const y = el.querySelector<HTMLElement>('.reticle-x')!
    const box = el.querySelector<HTMLElement>('.reticle-box')!
    const read = el.querySelector<HTMLElement>('.reticle-read')!
    const xTo = gsap.quickTo([x, box, read], 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo([y, box, read], 'y', { duration: 0.45, ease: 'power3.out' })
    // The vertical hair only moves on x, the horizontal only on y.
    let raf = 0
    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      el.dataset.on = 'true'
      xTo(px)
      yTo(py)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const lat = LAT[0] + (LAT[1] - LAT[0]) * (py / r.height)
        const lon = LON[0] + (LON[1] - LON[0]) * (px / r.width)
        read.textContent = `${lat.toFixed(4)}° N   ${lon.toFixed(4)}° E`
      })
    }
    const leave = () => {
      el.dataset.on = 'false'
    }
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className="reticle" aria-hidden="true">
      <span className="reticle-x" />
      <span className="reticle-y" />
      <span className="reticle-box" />
      <span className="reticle-read t-meta" />
    </div>
  )
}
