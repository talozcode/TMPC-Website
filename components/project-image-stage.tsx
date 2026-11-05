'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { initialPhase, type PhaseGroup, type ProjectPhase } from '@/lib/project-phases'

/**
 * One project's images, viewed one phase at a time.
 *
 * Three segmented tabs sit on the image chrome. Picking one scopes everything
 * below it, the strip, the arrows, the counter, the lightbox, to that phase
 * only. The slideshow keeps auto-advancing, but stays inside whichever phase
 * is active rather than crossing into the next one on its own.
 *
 * Two independent hide rules, because they answer different questions:
 *   - the tabs appear only when a project actually has more than one phase,
 *     so the existing catalogue (all single-phase) renders unchanged
 *   - the arrows, counter and strip appear whenever the active phase has more
 *     than one image, which is plain navigation and has nothing to do with phases
 *
 * A per-phase index is remembered, so switching tabs and back restores the
 * photograph you were looking at rather than resetting to the first one.
 *
 * Autoplay runs only while the card is on screen and the pointer is elsewhere.
 * A projects page with seven cards all cycling at once would be unreadable.
 */

const ADVANCE_MS = 4000

interface Props {
  title: string
  phases: PhaseGroup[]
  category?: string
  /** The big translucent number on the card variant. */
  number?: string
  variant?: 'card' | 'detail'
}

export function ProjectImageStage({ title, phases, category, number, variant = 'card' }: Props) {
  const [active, setActive] = useState<ProjectPhase>(() => initialPhase(phases))
  const [indices, setIndices] = useState<Partial<Record<ProjectPhase, number>>>({})
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const showPhases = phases.length > 1
  // An admin can delete the phase a visitor currently has open; fall back to
  // the most advanced remaining one rather than rendering nothing.
  const group = phases.find((g) => g.phase === active) ?? phases[phases.length - 1]
  // A phase can shrink out from under a stored index (an admin deleting a photo).
  const index = Math.min(indices[group.phase] ?? 0, group.images.length - 1)
  const showNav = group.images.length > 1

  function setIndex(next: number) {
    const wrapped = (next + group.images.length) % group.images.length
    setIndices((prev) => ({ ...prev, [group.phase]: wrapped }))
  }

  function selectPhase(phase: ProjectPhase) {
    setActive(phase)
  }

  // Only cycle what the visitor can actually see.
  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOnScreen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!showNav || paused || !onScreen || lightboxOpen || reduced.current) return
    const id = setInterval(() => setIndex(index + 1), ADVANCE_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNav, paused, onScreen, lightboxOpen, group.phase, index])

  // Only the current frame and its neighbours are mounted, so a long phase
  // does not download every photograph up front.
  const near = (i: number) =>
    i === index ||
    i === (index + 1) % group.images.length ||
    i === (index - 1 + group.images.length) % group.images.length

  const isDetail = variant === 'detail'

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        className={`relative overflow-hidden group bg-canvas-dark ${
          isDetail ? 'aspect-[16/10] rounded-[var(--radius-panel)]' : 'flex-1 min-h-[320px]'
        }`}
      >
        {group.images.map((src, i) =>
          near(i) ? (
            <Image
              key={`${group.phase}-${i}`}
              src={src}
              alt={showPhases ? `${title}, ${group.labelLong.toLowerCase()}` : title}
              fill
              priority={i === 0 && isDetail}
              sizes={isDetail ? '(max-width: 1024px) 100vw, 60rem' : '(max-width: 1024px) 100vw, 50vw'}
              className="object-cover transition-opacity duration-500 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ) : null
        )}

        {/* Sits above the images and below the controls, so the whole frame zooms. */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${title} photographs fullscreen`}
          className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-inset"
        />

        {showPhases && (
          <div className="absolute top-5 left-5 z-20 inline-flex gap-0.5 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 p-[3px]">
            {phases.map((g) => (
              <button
                key={g.phase}
                type="button"
                onClick={() => selectPhase(g.phase)}
                aria-pressed={g.phase === group.phase}
                className={`rounded-full px-3 py-1.5 text-[0.56rem] font-bold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  g.phase === group.phase
                    ? 'bg-accent-light text-canvas-dark'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {number && !isDetail && (
          <span className="absolute top-6 right-7 z-20 font-display font-bold text-[5rem] text-white/10 leading-none tracking-[-0.05em] select-none pointer-events-none">
            {number}
          </span>
        )}

        {category && (
          <span className="absolute bottom-5 left-6 z-20 rounded-full text-[0.58rem] font-bold text-accent-light uppercase tracking-[0.22em] border border-accent-light/40 bg-canvas-dark/70 backdrop-blur-sm px-3.5 py-2 pointer-events-none">
            {category}
          </span>
        )}

        {showNav && (
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
            <span className="rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 px-3 py-1.5 text-[0.58rem] font-semibold text-white/75 tabular-nums tracking-[0.14em] select-none">
              {String(index + 1).padStart(2, '0')} / {String(group.images.length).padStart(2, '0')}
            </span>
            {[
              { delta: -1, label: 'Previous photograph', d: 'M15 19l-7-7 7-7' },
              { delta: 1, label: 'Next photograph', d: 'M9 5l7 7-7 7' },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setIndex(index + b.delta)}
                aria-label={b.label}
                className="press w-9 h-9 rounded-full flex items-center justify-center bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white/75 hover:text-white hover:border-accent-light/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.d} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {showNav && (
        <div className="flex gap-1.5 p-3 bg-canvas-dark flex-shrink-0 overflow-x-auto">
          {group.images.map((src, i) => (
            <button
              key={`${group.phase}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${showPhases ? group.labelLong + ' ' : ''}photograph ${i + 1} of ${title}`}
              aria-current={i === index}
              className={`press relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-[10px] border-2 transition-all duration-200 ${
                i === index
                  ? 'border-accent-light'
                  : 'border-white/10 hover:border-white/40 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Scoped to the active phase. With finite:false a combined list would
          wrap from the last completed photograph into an unlabelled rendering,
          contradicting the tab the visitor just chose. */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={index}
        slides={group.images.map((src) => ({
          src,
          title,
          description: showPhases ? group.labelLong : undefined,
        }))}
        plugins={[Zoom, Captions]}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3, doubleTapDelay: 250, doubleClickMaxStops: 2 }}
        captions={{ descriptionTextAlign: 'center' }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 300, swipe: 400 }}
        carousel={{ finite: false, padding: '5%' }}
        styles={{
          container: { backgroundColor: 'rgba(11,33,55,0.95)' },
          root: { '--yarl__color_button': 'rgba(255,255,255,0.7)', '--yarl__color_button_active': '#57BACE' },
        }}
      />
    </div>
  )
}
