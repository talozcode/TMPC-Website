'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { flattenPhases, type PhaseGroup } from '@/lib/project-phases'

/**
 * One project's images, as a reel that runs straight through every phase.
 *
 * The thumbnail strip divides into a block per phase, the slideshow keeps
 * advancing across the boundaries between them, and the label on the image
 * swaps as it crosses. Arrows step through manually; clicking a thumbnail jumps.
 *
 * Two independent hide rules, because they answer different questions:
 *   - the phase chip and the block labels appear only when a project actually
 *     has more than one phase, so the existing catalogue renders unchanged
 *   - the arrows and the strip appear whenever there is more than one image,
 *     since that is plain navigation and has nothing to do with phases
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
  const frames = useMemo(() => flattenPhases(phases), [phases])
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // An image an admin deleted must not leave the reel pointing past the end.
  const safeIndex = Math.min(index, frames.length - 1)
  const frame = frames[safeIndex]
  const group = phases[frame.groupIndex]

  const showPhases = phases.length > 1
  const showNav = frames.length > 1

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + frames.length) % frames.length),
    [frames.length]
  )

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
    const id = setInterval(() => step(1), ADVANCE_MS)
    return () => clearInterval(id)
  }, [showNav, paused, onScreen, lightboxOpen, step])

  // Only the current frame and its neighbours are mounted, so a long project
  // does not download every photograph up front.
  const near = (i: number) =>
    i === safeIndex ||
    i === (safeIndex + 1) % frames.length ||
    i === (safeIndex - 1 + frames.length) % frames.length

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
        {frames.map((f, i) =>
          near(i) ? (
            <Image
              key={`${f.groupIndex}-${f.imageIndex}`}
              src={f.src}
              alt={
                showPhases
                  ? `${title}, ${phases[f.groupIndex].labelLong.toLowerCase()}`
                  : title
              }
              fill
              priority={i === 0 && isDetail}
              sizes={isDetail ? '(max-width: 1024px) 100vw, 60rem' : '(max-width: 1024px) 100vw, 50vw'}
              className="object-cover transition-opacity duration-500 ease-out"
              style={{ opacity: i === safeIndex ? 1 : 0 }}
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
          <span
            // Re-keyed on the phase so it fades in again each time the reel
            // crosses a boundary, which is the whole point of the label.
            key={group.phase}
            className="animate-fade-in absolute top-5 left-5 z-20 inline-flex items-center rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white text-[0.58rem] font-bold uppercase tracking-[0.18em] px-3.5 py-2 pointer-events-none"
          >
            {group.label}
          </span>
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
            {/* Carries its own backdrop: over a bright photograph, bare white
                text at 50 percent is unreadable while the arrows beside it are fine. */}
            <span className="rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 px-3 py-1.5 text-[0.58rem] font-semibold text-white/75 tabular-nums tracking-[0.14em] select-none">
              {String(safeIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
            </span>
            {[
              { delta: -1, label: 'Previous photograph', d: 'M15 19l-7-7 7-7' },
              { delta: 1, label: 'Next photograph', d: 'M9 5l7 7-7 7' },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => step(b.delta)}
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
        <div className="flex gap-2.5 p-3 bg-canvas-dark flex-shrink-0 overflow-x-auto">
          {phases.map((g, gi) => {
            const active = gi === frame.groupIndex
            return (
              <div
                key={g.phase}
                className={`flex-none flex flex-col gap-1.5 rounded-[14px] border transition-colors duration-300 ${
                  showPhases
                    ? active
                      ? 'bg-accent-light/10 border-accent-light/35 p-2'
                      : 'bg-white/[0.04] border-white/[0.09] p-2'
                    : 'border-transparent p-0'
                }`}
              >
                {showPhases && (
                  <span
                    className={`text-[0.5rem] font-bold uppercase tracking-[0.16em] px-0.5 transition-colors duration-300 ${
                      active ? 'text-accent-light' : 'text-white/45'
                    }`}
                  >
                    {g.label}
                  </span>
                )}
                <div className="flex gap-1.5">
                  {g.images.map((src, ii) => {
                    const flat = frames.findIndex(
                      (f) => f.groupIndex === gi && f.imageIndex === ii
                    )
                    const isActive = flat === safeIndex
                    return (
                      <button
                        key={`${g.phase}-${ii}`}
                        type="button"
                        onClick={() => setIndex(flat)}
                        aria-label={`Show ${showPhases ? g.labelLong + ' ' : ''}photograph ${ii + 1} of ${title}`}
                        aria-current={isActive}
                        className={`press relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-[10px] border-2 transition-all duration-200 ${
                          isActive
                            ? 'border-accent-light'
                            : 'border-white/10 hover:border-white/40 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Scoped to the phase on screen. With finite:false a combined list would
          wrap from the last completed photograph into an unlabelled rendering,
          contradicting the label the visitor just read. */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={frame.imageIndex}
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
