'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, land, motionOk } from '@/components/anim/anime'

/**
 * The services page's left rail: every service, with the one you are reading
 * marked. Clicking jumps to it (the browser handles the anchor scroll).
 *
 * The mark is one signal square that travels down the rail to the service in
 * view and settles there, rather than one square blinking out and another
 * blinking on. Without JavaScript each row keeps its own square.
 */
export function ServiceIndex({ items }: { items: { slug: string; number: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug)
  const listRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.slug)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  useEffect(() => {
    const list = listRef.current
    const mark = markRef.current
    if (!list || !mark) return
    const place = (instant: boolean) => {
      const row = list.querySelector<HTMLElement>(`[data-slug="${active}"] [data-anchor]`)
      if (!row) return
      const lr = list.getBoundingClientRect()
      const rr = row.getBoundingClientRect()
      // In the gutter just left of the numbers, level with the title.
      const x = rr.left - lr.left - 40 - 18
      const y = rr.top - lr.top + rr.height / 2 - 3
      animate(mark, instant ? { x, y, opacity: 1, duration: 0 } : { x, y, opacity: 1, ease: land })
    }
    const first = !placed.current
    place(first || !motionOk())
    placed.current = true
    // Re-seat it without motion if the rail reflows (fonts arriving, a resize).
    const reseat = () => place(true)
    if (first) document.fonts?.ready.then(reseat)
    window.addEventListener('resize', reseat, { passive: true })
    return () => window.removeEventListener('resize', reseat)
  }, [active])

  return (
    <nav aria-label="Services on this page" className="sticky top-[calc(var(--hdr-h)+2.5rem)]">
      <div ref={listRef} className="relative">
        <span ref={markRef} className="svc-glide" aria-hidden="true" />
        <ol className="grid">
          {items.map((i) => {
            const on = active === i.slug
            return (
              <li key={i.slug} data-slug={i.slug}>
                <a
                  href={`#${i.slug}`}
                  aria-current={on ? 'location' : undefined}
                  className={`group grid grid-cols-[2.5rem_1fr] items-baseline py-3 border-b border-rule-soft transition-colors duration-300 ${on ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                >
                  <span className="t-meta">{i.number}</span>
                  <span data-anchor className="relative font-semibold [font-variation-settings:'wdth'_106]">
                    {i.title}
                    <span
                      className={`svc-dot absolute -left-[calc(2.5rem+18px)] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-signal transition-transform duration-500 ${on ? 'scale-100' : 'scale-0'}`}
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
