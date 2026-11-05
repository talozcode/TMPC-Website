'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

/** The running Lenis instance, or null where native scrolling is in charge. */
export function getLenis() {
  return lenis
}

/**
 * Inertial smooth scrolling for mouse and trackpad, synced to ScrollTrigger so
 * every scroll-linked effect reads the same position on the same frame.
 *
 * Deliberately left off for touch (phones already have native momentum, and
 * hijacking it feels wrong) and for anyone who asked for reduced motion. In
 * both cases the page simply scrolls natively and every effect still works,
 * because ScrollTrigger listens to native scroll too.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      anchors: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  // The page settles taller after load (photos, fonts, the footer wordmark),
  // but <html> is height: 100%, so neither Lenis nor ScrollTrigger sees it
  // grow. Without this Lenis stops short of the real end of the page and the
  // triggers below the change read from stale positions. Watch the body, and
  // re-measure both once it has stopped changing.
  useEffect(() => {
    let last = document.body.scrollHeight
    let id = 0
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight
      if (Math.abs(h - last) < 1) return
      last = h
      window.clearTimeout(id)
      id = window.setTimeout(() => {
        lenis?.resize()
        ScrollTrigger.refresh()
        last = document.body.scrollHeight
      }, 150)
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      window.clearTimeout(id)
    }
  }, [])

  // A client-side navigation lands at the top of the new page, and every
  // trigger re-measures against the new layout once it has painted.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
