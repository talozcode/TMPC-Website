'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/data'
import { ButtonLink } from '@/components/ui/arrow-link'

/**
 * Phones only (CSS shows .cmk under 768px): a contact bar docked at the
 * bottom of the screen. A paper square holding the Gmail mark (a new email to
 * the office) and the site's own orange "Discuss Your Project" button, on a
 * frosted ink strip.
 *
 * It arrives once the visitor has read past half the first screen (the hero
 * has its own buttons): the strip rises, the orange button draws in from the
 * left, its label rolls up letter by letter, the arrow is handed on and one
 * sheen crosses it. A hairline along the top edge fills orange with the
 * scroll, reaching the end exactly where the closing band (or the footer)
 * takes over. The bar steps aside there, while the menu is open, and on the
 * Contact page, which is all contact already.
 */

const PHONE = '(max-width: 767px)'

const GmailMark = () => (
  <svg viewBox="52 42 88 66" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
    <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
    <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
    <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
    <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
  </svg>
)

export function ContactMarks() {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const hidden = pathname.startsWith('/contact')

  useEffect(() => {
    const bar = ref.current
    if (!bar || hidden) return
    const mq = window.matchMedia(PHONE)
    // Where the bar hands over: the closing band if the page has one, else the footer.
    const end = () => document.querySelector<HTMLElement>('[data-cta-band]') ?? document.querySelector('footer')

    let raf = 0
    let lastShown = ''
    let lastP = -1
    const read = () => {
      raf = 0
      if (!mq.matches) return
      const y = window.scrollY
      const vh = window.innerHeight
      const shown = String(y > vh * 0.5)
      if (shown !== lastShown) bar.dataset.shown = lastShown = shown
      const el = end()
      const stop = el ? el.getBoundingClientRect().top + y - vh : document.documentElement.scrollHeight - vh
      const p = stop > 0 ? Math.min(1, Math.max(0, y / stop)) : 1
      if (Math.abs(p - lastP) > 0.001) {
        bar.style.setProperty('--cmk-p', p.toFixed(4))
        lastP = p
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    // Steps aside while the closing band or the footer is on screen.
    const on = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? on.add(e.target) : on.delete(e.target))
      bar.dataset.away = String(on.size > 0)
    })
    document.querySelectorAll('[data-cta-band], footer').forEach((el) => io.observe(el))

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io.disconnect()
    }
  }, [hidden, pathname])

  if (hidden) return null

  return (
    <div ref={ref} className="cmk" role="region" aria-label="Contact TMPC" data-shown="false" data-away="false">
      <span className="cmk-line" aria-hidden="true" />
      <a className="cmk-mail" href={`mailto:${siteConfig.email}`} aria-label={`Gmail: email TMPC at ${siteConfig.email}`}>
        <span className="cmk-mark"><GmailMark /></span>
      </a>
      <ButtonLink href="/contact" className="cmk-cta" magnetic={false}>Discuss Your Project</ButtonLink>
    </div>
  )
}
