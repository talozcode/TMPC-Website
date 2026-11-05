'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger, MOTION_OK } from '@/components/anim/gsap'

/** Phones only. Tablets and laptops keep their own choreography untouched. */
const PHONE = '(max-width: 767px)'

/**
 * The Home page's phone details, all read from the scroll position so they
 * move exactly as fast as the reader does, and run back when scrolling up:
 *
 *   [data-pm-spine]   the owner diagram's line fills orange down to the
 *                     reading line, a square riding at its head, and each
 *                     party is wired in (tick, index, name) as it passes
 *   [data-pm-lit]     list items light up as they cross the reading line:
 *                     sectors, and each service's scope ticking off
 *   [data-pm-reveal]  a lead service's photo opens from the bottom behind an
 *                     orange edge, settling from a slight zoom
 *   [data-pm-par]     a featured project's photo drifts inside its frame
 *   [data-pm-live]    whatever photo sits in the middle of the screen gets
 *                     the hover state a phone never has: full colour, the
 *                     survey marks, the title underline
 *   .svc-row          the orange rule over each other service draws across
 *
 * Nothing here runs with reduced motion or above 767px; without the
 * `pm-on` class on <html> every element shows its finished state.
 */
export function PhoneMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia()
    // Nothing here is near the first screen, so the triggers are only built
    // once the owner diagram comes within half a screen. That keeps the
    // fifty-odd measurements out of the page load.
    let io: IntersectionObserver | null = null
    const first = document.querySelector('.table-diagram')
    const start = () => {
      io?.disconnect()
      io = null
      setup(mm)
    }
    if (!first || typeof IntersectionObserver === 'undefined') start()
    else {
      io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), {
        rootMargin: '0px 0px 50% 0px',
      })
      io.observe(first)
    }
    return () => {
      io?.disconnect()
      mm.revert()
    }
  }, [])

  return null
}

function setup(mm: gsap.MatchMedia) {
  mm.add(`${PHONE} and ${MOTION_OK}`, () => {
    const root = document.documentElement
    root.classList.add('pm-on')
    const triggers: ScrollTrigger[] = []
    const tweens: gsap.core.Animation[] = []
    const setLit = (el: HTMLElement, on: boolean) => {
      el.dataset.lit = on ? 'true' : 'false'
    }

    // Owner diagram: the spine's head sits on the reading line (62%), and
    // a party is wired in the moment its centre crosses that same line.
    document.querySelectorAll<HTMLElement>('[data-pm-spine]').forEach((box) => {
      const t = ScrollTrigger.create({
        trigger: box,
        start: 'top 62%',
        end: 'bottom-=24px 62%',
        onUpdate: (self) => box.style.setProperty('--spine', self.progress.toFixed(4)),
        onRefresh: (self) => box.style.setProperty('--spine', self.progress.toFixed(4)),
      })
      box.style.setProperty('--spine', t.progress.toFixed(4))
      triggers.push(t)
      box.querySelectorAll<HTMLElement>('[data-pm-item]').forEach((item) => {
        triggers.push(lineTrigger(item, 'center 62%', setLit))
      })
    })

    // You to TMPC: the short ink link draws down before the spine starts.
    document.querySelectorAll<HTMLElement>('.pm-link').forEach((el) => {
      tweens.push(
        gsap.fromTo(
          el,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 62%', scrub: true } },
        ),
      )
    })

    document.querySelectorAll<HTMLElement>('[data-pm-lit] > li').forEach((li) => {
      triggers.push(lineTrigger(li, 'center 70%', setLit))
    })

    document.querySelectorAll<HTMLElement>('[data-pm-reveal]').forEach((frame) => {
      const img = frame.querySelector('img')
      const edge = frame.querySelector<HTMLElement>('.pm-edge')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 94%', end: 'top 46%', scrub: true },
      })
      tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, ease: 'none' }, 0)
      if (edge) {
        tl.fromTo(edge, { yPercent: 0 }, { yPercent: -100, ease: 'none' }, 0)
        tl.fromTo(edge, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.12 }, 0.88)
      }
      tweens.push(tl)
    })

    document.querySelectorAll<HTMLElement>('[data-pm-par]').forEach((frame) => {
      const img = frame.querySelector('img')
      if (!img) return
      tweens.push(
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.12 },
          {
            yPercent: 5,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        ),
      )
    })

    // The photo in the middle of the screen: from when its top passes 62%
    // until its bottom passes 38%.
    document.querySelectorAll<HTMLElement>('[data-pm-live]').forEach((frame) => {
      const host = frame.closest<HTMLElement>('a, article') ?? frame
      const marks = host.querySelector<HTMLElement>('.marks')
      triggers.push(
        ScrollTrigger.create({
          trigger: frame,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: (self) => {
            host.dataset.live = self.isActive ? 'true' : 'false'
            if (marks) marks.dataset.on = self.isActive ? 'true' : 'false'
          },
        }),
      )
    })

    document.querySelectorAll<HTMLElement>('.svc-row').forEach((row) => {
      const set = (p: number) => {
        row.style.setProperty('--fill', p.toFixed(4))
        setLit(row, p > 0.99)
      }
      const t = ScrollTrigger.create({
        trigger: row,
        start: 'top 86%',
        end: 'top 56%',
        onUpdate: (self) => set(self.progress),
        onRefresh: (self) => set(self.progress),
      })
      set(t.progress)
      triggers.push(t)
    })

    return () => {
      triggers.forEach((t) => t.kill())
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.revert()
      })
      root.classList.remove('pm-on')
      document.querySelectorAll<HTMLElement>('[data-lit], [data-live]').forEach((el) => {
        delete el.dataset.lit
        delete el.dataset.live
      })
      document.querySelectorAll<HTMLElement>('[data-pm-spine], .svc-row').forEach((el) => {
        el.style.removeProperty('--spine')
        el.style.removeProperty('--fill')
      })
    }
  })
}

/**
 * On once the element's `start` point has passed the reading line, off again
 * when scrolling back above it. There is no end: reaching the bottom of the
 * page must not switch it off.
 */
function lineTrigger(el: HTMLElement, start: string, set: (el: HTMLElement, on: boolean) => void) {
  const t = ScrollTrigger.create({
    trigger: el,
    start,
    end: 'max',
    onEnter: () => set(el, true),
    onEnterBack: () => set(el, true),
    onLeave: () => set(el, true),
    onLeaveBack: () => set(el, false),
    onRefresh: (self) => set(el, self.scroll() >= self.start),
  })
  set(el, t.scroll() >= t.start)
  return t
}
