'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, useGSAP, gsap, MOTION_OK } from '@/components/anim/gsap'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * The closing band's scroll layer, drawn behind its content.
 *
 * --cta-y (0 to 1) is the band's whole pass up the screen, which drifts the
 * photograph against the page. --cta-p (0 to 1) draws the datum, the orange hairline along the top edge,
 * from the left as the band comes up the screen. --cta-g (0 to 1) gathers the
 * warmth along the bottom edge as the footer arrives under it. Both are read
 * straight off the scroll position on every update, so they move with the page
 * in both directions and never on their own.
 *
 * While the page is moving the band carries data-scrolling, which switches the
 * rows' pointer effects off (globals.css), so a mouse resting on the screen
 * never sets a row off as it slides past.
 *
 * Without JavaScript, and with reduced motion, the photograph holds still and
 * centred, the line is drawn and the warmth is there.
 */
export function CtaBandScroll() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const band = ref.current?.closest<HTMLElement>('[data-cta-band]')
    if (!band) return

    const onStart = () => band.setAttribute('data-scrolling', '')
    const onEnd = () => band.removeAttribute('data-scrolling')
    ScrollTrigger.addEventListener('scrollStart', onStart)
    ScrollTrigger.addEventListener('scrollEnd', onEnd)

    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const set = (name: string) => (self: ScrollTrigger) => band.style.setProperty(name, clamp01(self.progress).toFixed(4))
      const datum = ScrollTrigger.create({
        trigger: band,
        start: 'top 92%',
        end: 'top 30%',
        onUpdate: set('--cta-p'),
        onRefresh: set('--cta-p'),
      })
      const warmth = ScrollTrigger.create({
        trigger: band,
        start: 'bottom 112%',
        end: 'bottom 55%',
        onUpdate: set('--cta-g'),
        onRefresh: set('--cta-g'),
      })
      const pass = ScrollTrigger.create({
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: set('--cta-y'),
        onRefresh: set('--cta-y'),
      })
      set('--cta-y')(pass)
      set('--cta-p')(datum)
      set('--cta-g')(warmth)
      return () => {
        band.style.removeProperty('--cta-y')
        band.style.removeProperty('--cta-p')
        band.style.removeProperty('--cta-g')
      }
    })

    return () => {
      mm.revert()
      ScrollTrigger.removeEventListener('scrollStart', onStart)
      ScrollTrigger.removeEventListener('scrollEnd', onEnd)
      onEnd()
    }
  })

  return (
    <div ref={ref} className="cta-sky" aria-hidden="true">
      <span className="cta-warmth" />
      <span className="cta-datum" />
    </div>
  )
}

const fmt = () => {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  } catch {
    return ''
  }
}

/**
 * The time in Bangkok, for someone choosing a call window from abroad. It is
 * filled in on the client and then kept to the minute; until then the slot
 * holds its width, invisible, so nothing moves when it arrives.
 */
export function BangkokTime() {
  const [now, setNow] = useState('')

  useEffect(() => {
    let timer = 0
    const tick = () => {
      setNow(fmt())
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <span className="cta-time t-meta" data-ready={now ? 'true' : undefined}>
      Bangkok now <span className="cta-time-v">{now || '00:00'}</span> GMT+7
    </span>
  )
}
