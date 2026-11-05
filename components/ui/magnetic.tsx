'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/components/anim/gsap'

/**
 * Leans its child a few pixels toward the pointer while the pointer is near,
 * and springs back when it leaves. Fine pointers only, never with reduced
 * motion. Written with quickTo so no React state changes per frame.
 */
export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ok = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    if (!ok) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <span ref={ref} className="inline-flex will-change-transform">
      {children}
    </span>
  )
}
