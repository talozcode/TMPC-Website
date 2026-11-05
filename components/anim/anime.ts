'use client'

import { animate, createDrawable, createTimeline, cubicBezier, spring, stagger, utils } from 'animejs'

/**
 * anime.js does the small, hand-tuned motion: the transformation reveals and
 * the micro-interactions. GSAP keeps the scroll choreography (ScrollTrigger,
 * SplitText), so scroll positions come from ScrollTrigger and
 * the movement itself from here. One import point, so every tween shares the
 * same two curves as the CSS (--ease-out-expo and --ease-in-out-quart).
 */
export const outExpo = cubicBezier(0.16, 1, 0.3, 1)
export const inOutQuart = cubicBezier(0.76, 0, 0.24, 1)

/** A short, firm settle with a trace of overshoot, for things that land. */
export const land = spring({ bounce: 0.28, duration: 520 })

/**
 * Resolves once every photograph inside `el` has loaded and decoded, or after
 * `ms` at the latest, so a reveal never plays over an empty frame.
 */
export function imagesReady(el: HTMLElement, ms = 1500) {
  const imgs = Array.from(el.querySelectorAll('img'))
  const all = Promise.all(imgs.map((img) => (img.complete && img.naturalWidth ? Promise.resolve() : img.decode().catch(() => undefined))))
  return Promise.race([all, new Promise((r) => setTimeout(r, ms))])
}

export function motionOk() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

export { animate, createDrawable, createTimeline, stagger, utils }
