'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface HeroProject {
  id: string
  title: string
  category: string
  image: string
  deliverables: string[]
}

const DEFAULT_INTERVAL = 4000
const SWIPE_THRESHOLD = 40

export function HeroProjectCarousel({
  projects,
  intervalMs = DEFAULT_INTERVAL,
}: {
  projects: HeroProject[]
  intervalMs?: number
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = projects.length

  const go = useCallback((next: number) => setActive((next + count) % count), [count])

  // Auto-advance, paused on hover. Interval is admin-configurable via settings.
  useEffect(() => {
    if (paused || count <= 1) return
    const id = setInterval(() => setActive((a) => (a + 1) % count), intervalMs)
    return () => clearInterval(id)
  }, [paused, count, intervalMs])

  // Touch swipe (mobile). Tap still navigates to /projects; a swipe changes slide.
  const touchStartX = useRef<number | null>(null)
  const swiped = useRef(false)
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    swiped.current = false
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || count <= 1) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swiped.current = true
      go(active + (dx < 0 ? 1 : -1))
    }
    touchStartX.current = null
  }

  if (count === 0) return null

  const current = projects[active]
  // Only mount nearby slides so a long project list doesn't download every image.
  const isNear = (i: number) =>
    i === active || i === (active + 1) % count || i === (active - 1 + count) % count

  return (
    <div
      className="flex flex-col justify-center animate-fade-in"
      style={{ animationDelay: '0.2s' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="border-2 border-canvas-dark bg-canvas-dark">
        {/* Title bar - project title ABOVE the image */}
        <div className="px-6 py-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.5rem] font-bold text-accent uppercase tracking-[0.3em] mb-2">
              {current.category}
            </p>
            <p
              key={current.id}
              className="font-display font-bold text-2xl text-white tracking-tight leading-tight truncate animate-fade-up"
            >
              {current.title}
            </p>
          </div>
          <span className="flex-shrink-0 text-[0.6rem] font-semibold text-white/30 tabular-nums tracking-[0.15em] pb-1">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>

        {/* Image stage - swipeable, crossfade + slow Ken Burns on the active slide */}
        <Link
          href="/projects"
          aria-label={`View projects: ${current.title}`}
          className="relative block overflow-hidden group h-[300px] sm:h-[360px] lg:h-[380px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (swiped.current) {
              e.preventDefault()
              swiped.current = false
            }
          }}
        >
          {projects.map((p, i) =>
            isNear(i) ? (
              <Image
                key={p.id}
                src={p.image}
                alt={p.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 520px"
                className={`object-cover ease-out ${
                  i === active ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                style={{
                  transitionProperty: 'opacity, transform',
                  // fast crossfade, slow Ken Burns zoom on the active slide
                  transitionDuration: i === active ? '700ms, 4000ms' : '700ms, 700ms',
                }}
              />
            ) : null
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold text-white uppercase tracking-[0.18em] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 transition-all duration-300">
            View Projects
            <span aria-hidden="true">&#8594;</span>
          </span>
        </Link>

        {/* TMPC Scope - under the image, changes with the slide */}
        {current.deliverables.length > 0 && (
          <div key={current.id} className="px-6 py-5 border-t border-white/10 animate-fade-in">
            <p className="text-[0.5rem] font-bold text-accent uppercase tracking-[0.3em] mb-3">TMPC Scope</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
              {current.deliverables.slice(0, 4).map((d) => (
                <li key={d} className="flex items-start gap-2 text-[0.78rem] text-white/55 leading-snug">
                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-1">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                aria-label={`Go to ${p.title}`}
                aria-current={i === active}
                className="py-3 -my-3 px-1 -mx-0.5 flex items-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-accent' : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous project"
              className="w-10 h-10 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-accent/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next project"
              className="w-10 h-10 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-accent/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
