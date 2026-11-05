'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

/**
 * One place that registers GSAP plugins, so every animated component imports
 * from here and the plugins are registered exactly once, client side only.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
  gsap.defaults({ ease: 'expo.out', duration: 1.1 })
}

/** The media query every scroll-driven effect is gated on. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/** Phones: the opening band ([data-first]) paints static, see globals.css. */
export const FIRST_STATIC = '(max-width: 899px)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
