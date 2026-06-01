'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface HeroProject {
  id: string
  title: string
  category: string
  image: string
}

const DEFAULT_INTERVAL = 4000

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

  if (count === 0) return null

  const current = projects[active]

  return (
    <div
      className="flex flex-col justify-center animate-fade-in"
      style={{ animationDelay: '0.2s' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="border-2 border-canvas-dark bg-canvas-dark">
        {/* Title bar — project title ABOVE the image */}
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

        {/* Image stage — crossfade + slow Ken Burns on the active slide */}
        <Link
          href="/projects"
          aria-label={`View projects — ${current.title}`}
          className="relative block overflow-hidden group"
          style={{ height: '380px' }}
        >
          {projects.map((p, i) => (
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
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold text-white uppercase tracking-[0.18em] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View Projects
            <span aria-hidden="true">&#8594;</span>
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                aria-label={`Go to ${p.title}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-accent' : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous project"
              className="w-8 h-8 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-accent/60 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next project"
              className="w-8 h-8 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-accent/60 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
