'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Arrow } from '@/components/ui/arrow-link'
import { useBangkokTime } from '@/components/contact/bangkok-time'

/**
 * The Bangkok plate on the contact page, after D's 21st.dev LocationMap.
 *
 * As it scrolls into view a schematic of the city draws itself in, faint: the
 * river first, then the arterial roads, the side streets and the blocks. Open
 * it (click, tap, Enter) and the plate grows, the drawing comes up to full
 * strength, the pin lands with a survey ring and the coordinates replace the
 * line about the office. The drawing is not a tile service; "Open in Maps"
 * opens the real one.
 *
 * TMPC publishes a city, not a street address, so the pin and the coordinates
 * are Bangkok's (city centre), never an invented office point. Where the
 * "Live" chip was, Bangkok's own clock runs, which is what someone booking a
 * call from abroad actually needs.
 *
 * The plate leans a few degrees toward the pointer on desktop, from real
 * pointer movement only: the zero-movement events a browser sends while the
 * page scrolls under a resting mouse are ignored, so scrolling never tilts it.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Plate heights in px: closed and open, phone and from 768px up. */
export const MAP_HEIGHTS = { closed: 260, open: 400, closedMd: 400, openMd: 560 }

// Schematic Bangkok in a 720 x 420 box: the Chao Phraya bending south past the
// old town, the arterial roads running east, side streets and blocks.
const RIVER = 'M296 -20 C 276 58, 362 104, 334 176 S 238 262, 300 322 S 436 356, 404 446'
const ROADS = [
  { d: 'M338 186 L 740 252', w: 4, o: 0.34, at: 0.45 },
  { d: 'M318 300 L 740 384', w: 3.5, o: 0.3, at: 0.52 },
  { d: 'M486 -20 L 522 446', w: 3.5, o: 0.28, at: 0.58 },
  { d: 'M-20 132 L 304 160', w: 3, o: 0.26, at: 0.64 },
  { d: 'M-20 340 L 284 302', w: 3, o: 0.24, at: 0.7 },
  { d: 'M-20 60 C 210 34, 450 92, 740 46', w: 2.5, o: 0.2, at: 0.76 },
]
const STREETS = [
  'M150 -20 L 186 446', 'M622 -20 L 646 446', 'M404 -20 L 418 170', 'M560 230 L 580 446',
  'M60 -20 L 84 446', 'M-20 236 L 300 232', 'M380 110 L 740 140', 'M400 250 L 740 316', 'M330 410 L 740 430',
]
const BLOCKS = [
  { x: 380, y: 196, w: 46, h: 34 }, { x: 540, y: 160, w: 40, h: 52 }, { x: 420, y: 310, w: 52, h: 30 },
  { x: 596, y: 286, w: 34, h: 40 }, { x: 664, y: 180, w: 44, h: 36 }, { x: 196, y: 172, w: 48, h: 38 },
  { x: 92, y: 260, w: 40, h: 30 }, { x: 210, y: 352, w: 52, h: 34 }, { x: 540, y: 64, w: 46, h: 30 },
  { x: 664, y: 72, w: 36, h: 44 }, { x: 98, y: 82, w: 34, h: 30 }, { x: 430, y: 380, w: 40, h: 26 },
]
const PIN = { x: 362, y: 214 }
const VB = { w: 720, h: 420 }

export function LocationMap({
  location = 'Bangkok, Thailand',
  coordinates = '13.7563° N, 100.5018° E',
  note,
  mapsUrl,
  className = '',
}: {
  location?: string
  coordinates?: string
  note?: string
  mapsUrl?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const [md, setMd] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const uid = useId()
  const time = useBangkokTime()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 220, damping: 30 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 220, damping: 30 })

  const tiltOk = useRef(false)
  useEffect(() => {
    tiltOk.current =
      window.matchMedia('(pointer: fine)').matches && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    const q = window.matchMedia('(min-width: 768px)')
    const sync = () => setMd(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  function onMove(e: React.PointerEvent) {
    if (!tiltOk.current || !ref.current) return
    // Synthetic moves fired while the page scrolls carry no movement.
    if (e.movementX === 0 && e.movementY === 0) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
    setHover(false)
  }

  const height = open ? (md ? MAP_HEIGHTS.openMd : MAP_HEIGHTS.open) : md ? MAP_HEIGHTS.closedMd : MAP_HEIGHTS.closed
  const draw = (delay: number, duration = 0.9) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: seen ? 1 : 0 },
    transition: { duration, ease: EASE, delay },
  })

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          ref={ref}
          className={`map-plate ${className}`}
          style={{ perspective: 1400 }}
          onPointerMove={onMove}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
          onPointerLeave={onLeave}
          data-open={open}
        >
          <m.div
            className="map-card"
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
            initial={false}
            animate={{ height }}
            transition={{ type: 'spring', stiffness: 260, damping: 34 }}
          >
            <m.div
              id={`${uid}-map`}
              className="map-art"
              aria-hidden="true"
              initial={false}
              animate={{ opacity: open ? 1 : hover ? 0.62 : 0.5 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" fill="none">
                <m.path d={RIVER} className="map-river" strokeWidth="26" strokeLinecap="round" {...draw(0.05, 1.4)} />
                {ROADS.map((r) => (
                  <m.path key={r.d} d={r.d} className="map-road" strokeWidth={r.w} strokeOpacity={r.o} {...draw(r.at)} />
                ))}
                {STREETS.map((d, i) => (
                  <m.path key={d} d={d} className="map-road" strokeWidth="1.25" strokeOpacity={0.14} {...draw(0.8 + i * 0.04, 0.7)} />
                ))}
                {BLOCKS.map((b, i) => (
                  <m.rect
                    key={i}
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    className="map-block"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={seen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 1 + i * 0.04 }}
                  />
                ))}
                <AnimatePresence>
                  {open && (
                    <m.circle
                      key="ring"
                      cx={PIN.x}
                      cy={PIN.y}
                      r="34"
                      className="map-ring"
                      strokeWidth="1.25"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                    />
                  )}
                </AnimatePresence>
              </svg>
              <AnimatePresence>
                {open && (
                  <m.div
                    key="pin"
                    className="map-pin"
                    style={{ left: `${(PIN.x / VB.w) * 100}%`, top: `${(PIN.y / VB.h) * 100}%` }}
                    initial={{ y: -22, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.2 }}
                  >
                    <svg width="28" height="34" viewBox="0 0 24 30" fill="none">
                      <path d="M12 1C6.5 1 2.5 5 2.5 10.2 2.5 17.4 12 28 12 28s9.5-10.6 9.5-17.8C21.5 5 17.5 1 12 1Z" className="map-pin-body" />
                      <rect x="9" y="7.2" width="6" height="6" className="map-pin-eye" />
                    </svg>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
            <div className="map-fade" aria-hidden="true" />

            {/* The whole plate is the toggle; the maps link sits above it. */}
            <button
              type="button"
              className="map-toggle"
              aria-expanded={open}
              aria-controls={`${uid}-map`}
              aria-label={open ? `Close the map of ${location}` : `Open the map of ${location}`}
              onClick={() => setOpen((v) => !v)}
            />

            <div className="map-content">
              <div className="flex items-start justify-between gap-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="map-icon"
                  aria-hidden="true"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </svg>
                <p className="map-clock t-meta" aria-label={time ? `Bangkok time ${time}` : 'Bangkok time, GMT+7'}>
                  <span className="text-ink-muted">Bangkok</span>
                  <span className="map-clock-time">{time ?? '--:--'}</span>
                  <span className="text-ink-muted">GMT+7</span>
                </p>
              </div>

              <div>
                <m.p
                  className="map-title"
                  initial={false}
                  animate={{ x: hover && !open ? 6 : 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                >
                  {location}
                </m.p>
                <div className="map-sub-slot">
                  <AnimatePresence initial={false} mode="wait">
                    {open && coordinates ? (
                      <m.p
                        key="coords"
                        className="map-sub font-mono"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        {coordinates} <span className="text-ink-muted whitespace-nowrap">· city centre</span>
                      </m.p>
                    ) : (
                      note && (
                        <m.p
                          key="note"
                          className="map-sub"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          {note}
                        </m.p>
                      )
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <m.span
                    className="map-rule"
                    aria-hidden="true"
                    initial={false}
                    animate={{ scaleX: open ? 1 : hover ? 0.55 : 0.22 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                  {open && mapsUrl ? (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-link t-meta">
                      Open in Maps <Arrow className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="map-hint t-meta" aria-hidden="true">
                      <span className="map-hint-mark" />
                      View map
                    </span>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
