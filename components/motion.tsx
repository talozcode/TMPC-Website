'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Scroll choreography, kept to two primitives so the whole site reads as one
 * system rather than a pile of separate effects:
 *
 *   Reveal        fade and rise, or an image wiping open, with a stagger delay
 *   HeroParallax  a hero photograph drifting slower than the page
 *
 * Both are progressive. Without JavaScript the `.js` class is never set, so the
 * hidden state never applies and the page renders fully visible. With reduced
 * motion requested, everything is simply visible and static.
 */

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function Reveal({
  children,
  delay = 0,
  variant = 'rise',
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  variant?: 'rise' | 'image'
  className?: string
  as?: 'div' | 'section' | 'article' | 'li'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced() || typeof IntersectionObserver === 'undefined') {
      el.classList.add('in')
      return
    }

    // Reveal anything already on screen without waiting for an intersection
    // change. An observer only reports when something moves, so a page opened
    // at a hash, or restored to a previous scroll position, can otherwise leave
    // mid-page content hidden forever.
    const onScreen = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    }
    if (onScreen()) {
      el.classList.add('in')
      return
    }

    // threshold 0, deliberately. The image variant clips itself to zero height
    // before revealing, so its intersectionRatio is always 0; any threshold
    // above zero would leave it permanently clipped and never fire.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    )
    io.observe(el)

    // Belt and braces: one cheap re-check on the first scroll, in case the
    // observer was attached during a scroll the browser had already finished.
    const recheck = () => {
      if (onScreen()) {
        el.classList.add('in')
        io.unobserve(el)
      }
    }
    window.addEventListener('scroll', recheck, { passive: true, once: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', recheck)
    }
  }, [])

  const base = variant === 'image' ? 'rv-img' : 'rv'

  return (
    <Tag
      ref={ref as never}
      className={`${base} ${className}`.trim()}
      style={delay ? ({ '--d': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/**
 * Drifts a hero photograph at a fraction of scroll speed. The element it is
 * pointed at must contain an <img>; the drift is published as a custom property
 * so the CSS decides how to use it.
 */
export function HeroParallax({ targetId, amount = 10 }: { targetId: string; amount?: number }) {
  useEffect(() => {
    if (prefersReduced()) return
    const el = document.getElementById(targetId)
    const img = el?.querySelector('img')
    if (!el || !img) return

    let ticking = false
    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)))
      img.style.setProperty('--par', `${(-progress * amount).toFixed(2)}%`)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId, amount])

  return null
}
