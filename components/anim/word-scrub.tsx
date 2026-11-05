'use client'

import { useRef, type ElementType } from 'react'
import { gsap, useGSAP, MOTION_OK } from './gsap'

/**
 * A statement that "reads itself" as you scroll: every word starts in the
 * muted ink (5.6:1 on paper, so it passes AA before it is read) and comes up
 * to full ink in order, tied to scroll position so it moves exactly
 * as fast as the reader does. Words wrapped in *asterisks* get the italic
 * accent treatment.
 */
export function WordScrub({
  text,
  as: Tag = 'p',
  className = '',
}: {
  text: string
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const words = el.querySelectorAll<HTMLElement>('[data-w]')
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          words,
          { color: '#56646C' },
          {
            color: '#162D3A',
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 52%',
              scrub: 0.6,
            },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  const tokens = text.split(/(\*[^*]+\*)/g).filter(Boolean)

  return (
    <Tag ref={ref} className={className}>
      {tokens.map((token, ti) => {
        const accent = token.startsWith('*') && token.endsWith('*')
        const words = (accent ? token.slice(1, -1) : token).split(/(\s+)/)
        return words.map((w, wi) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={`${ti}-${wi}`} data-w="" className="inline-block">
              {accent ? <em>{w}</em> : w}
            </span>
          )
        )
      })}
    </Tag>
  )
}
