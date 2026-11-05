'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * A stream of before/after cards sliding through a fixed scanner line.
 *
 * Every card starts on its Before photo. As a card crosses the scanner, the
 * After photo is revealed from the card's left edge to its right edge, and the
 * card counts as done only once the reveal reaches the far edge. A card keeps
 * its result until it leaves the stream and comes round again, when it starts
 * over on Before.
 *
 * Moving left (the default) the reveal edge sits exactly on the scanner line.
 * Dragged or run the other way, the right edge crosses first, so the reveal
 * still runs left to right, by the share of the card that has crossed.
 *
 * Adapted from the 21st.dev "Scanner Card Stream" (rahil1202): the stream,
 * scanner, particle field, drag inertia and the clip and scramble effects are
 * kept; the ASCII-for-image swap is replaced by Before and After photos.
 *  - `clip`: a clean wipe, with an orange hairline at the reveal edge
 *  - `scramble`: the same wipe, plus a band of survey glyphs trailing the edge
 *    that re-scrambles while the card is being scanned
 *
 * Motion: it only runs while on screen and the tab is visible. Hover never
 * touches it; keyboard focus on the stream holds it. Pointer drag (mouse,
 * pen, touch) throws it with inertia, sideways wheel or shift + wheel moves
 * it, and vertical page scroll is never captured. With reduced motion it does
 * not run on its own and has no particles; drag, arrow keys and the controls
 * still move it and reveal cards the same way.
 *
 * The particle field loads three.js on demand, only on large screens with a
 * fine pointer, and only once the stream is on screen and the browser is idle.
 * The scanner sparks are drawn in a handful of batched fills per frame, and
 * fewer of them on small screens, so phones stay smooth.
 */

export interface ScannerCardImage {
  /** URL of the Before photo. */
  before: string
  /** URL of the After photo. Same aspect ratio as `before`. */
  after: string
  /** Describes the Before photo for screen readers. */
  beforeAlt?: string
  /** Describes the After photo for screen readers. */
  afterAlt?: string
  /** Optional heading under the card. */
  title?: string
  /** Optional small line under the card, e.g. sector and location. */
  meta?: string
}

export type ScanEffect = 'clip' | 'scramble'

export interface ScannerCardStreamProps {
  /** The cards, in order. Nothing renders if this is empty. */
  cardImages: ScannerCardImage[]
  /** Show pause, reverse and reset buttons. */
  showControls?: boolean
  /** Show the live speed in px/s. */
  showSpeed?: boolean
  /** Resting speed in px per second (0 to 1200). */
  initialSpeed?: number
  /** -1 runs right to left (default), 1 runs left to right. */
  direction?: -1 | 1
  /** Minimum copies of the set in the stream; more are added to fill wide screens. */
  repeat?: number
  /** Space between cards in px. */
  cardGap?: number
  /** Card width in px; shrinks to fit narrow containers. */
  cardWidth?: number
  /** Card photo aspect ratio, width / height. Default 4 / 5. */
  aspectRatio?: number
  /** How quickly a throw settles back to resting speed, 0.8 to 0.995 per frame. */
  friction?: number
  scanEffect?: ScanEffect
  /** Draw the drifting particle field (three.js). */
  particles?: boolean
  labels?: { before: string; after: string }
  /** Let people drag, swipe, wheel or arrow-key the stream. Off, it only runs on its own. */
  interactive?: boolean
  /** Caption colours: `light` for paper sections, `dark` for dark bands. */
  tone?: 'light' | 'dark'
  /** Accessible name of the stream. */
  ariaLabel?: string
  className?: string
}

type Side = 'left' | 'right'

/** Card width as the stream lays it out: a share of the container, capped. */
const PHONE_SHARE = 0.64
const WIDE_SHARE = 0.78

/**
 * One `sizes` value for every card, server and client alike, so the first
 * frame rendered on the server and the live stream ask for the same files.
 */
function cardSizes(maxW: number) {
  const parts: string[] = []
  const phoneBp = Math.min(Math.ceil(maxW / PHONE_SHARE), 640)
  if (phoneBp > 1) parts.push(`(max-width: ${phoneBp - 1}px) ${PHONE_SHARE * 100}vw`)
  const wideBp = Math.ceil(maxW / WIDE_SHARE)
  if (wideBp > 640) parts.push(`(max-width: ${wideBp - 1}px) ${WIDE_SHARE * 100}vw`)
  parts.push(`${maxW}px`)
  return parts.join(', ')
}

interface SlotState {
  x: number
  p: number
  entry: Side
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?"
const GLYPH_W = 6.5
const GLYPH_H = 13
/** Width of the scramble band, as a share of the card. */
const BAND = 0.45

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const mod = (a: number, n: number) => ((a % n) + n) % n
const finite = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)

function glyphs(cols: number, rows: number) {
  let out = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
    out += '\n'
  }
  return out
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function ScannerCardStream({
  cardImages,
  showControls = false,
  showSpeed = false,
  initialSpeed = 60,
  direction = -1,
  repeat = 2,
  cardGap = 40,
  cardWidth = 320,
  aspectRatio = 4 / 5,
  friction = 0.95,
  scanEffect = 'clip',
  particles = true,
  labels = { before: 'Before', after: 'After' },
  tone = 'dark',
  interactive = true,
  ariaLabel = 'Before and after project stream',
  className = '',
}: ScannerCardStreamProps) {
  // ---- Props, made safe ----
  const items = useMemo(
    () =>
      (Array.isArray(cardImages) ? cardImages : []).filter(
        (c): c is ScannerCardImage => !!c && typeof c.before === 'string' && !!c.before && typeof c.after === 'string' && !!c.after,
      ),
    [cardImages],
  )
  const n = items.length
  const baseSpeed = clamp(finite(initialSpeed, 60), 0, 1200)
  const baseDir: -1 | 1 = direction === 1 ? 1 : -1
  const copies = Math.max(1, Math.round(finite(repeat, 2)))
  const gap = clamp(finite(cardGap, 40), 0, 400)
  const wantW = clamp(finite(cardWidth, 320), 120, 1200)
  const ratio = clamp(finite(aspectRatio, 4 / 5), 0.3, 3)
  const settle = clamp(finite(friction, 0.95), 0.8, 0.995)
  const effect: ScanEffect = scanEffect === 'scramble' ? 'scramble' : 'clip'

  const reduced = useReducedMotion()

  // ---- Layout, from the container (not the viewport) ----
  const rootRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{ cw: number; w: number; h: number; slots: number } | null>(null)
  const [captionH, setCaptionH] = useState(0)

  useEffect(() => {
    const el = rootRef.current
    if (!el || n === 0) return
    const measure = () => {
      const cw = el.clientWidth
      if (!cw) return
      // On phones a card is a little narrower than the screen's half-width
      // plus margin, so the card being read sits wholly in view.
      // Rounded down, so the live cards never come out a fraction larger
      // than the first frame drawn with CSS.
      const w = Math.floor(Math.min(wantW, cw * (cw < 640 ? PHONE_SHARE : WIDE_SHARE)))
      const h = Math.floor(w / ratio)
      const pitch = w + gap
      // Enough slots that the loop never shows a hole, rounded to whole sets
      // so the order of the cards survives the wrap.
      const need = Math.ceil((cw + pitch) / pitch) + 1
      const slots = n * Math.max(copies, Math.ceil(need / n))
      setLayout((prev) =>
        prev && prev.cw === cw && prev.w === w && prev.h === h && prev.slots === slots ? prev : { cw, w, h, slots },
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [n, wantW, ratio, gap, copies])

  // The caption area is as tall as the tallest caption, not a guess.
  useEffect(() => {
    const track = trackRef.current
    if (!track || !layout) return
    const measure = () => {
      let max = 0
      track.querySelectorAll<HTMLElement>('[data-caption]').forEach((el) => {
        max = Math.max(max, el.offsetHeight)
      })
      setCaptionH(max)
    }
    measure()
    document.fonts?.ready.then(measure)
  }, [layout])

  // ---- Live settings the loop reads without restarting ----
  // `v` is signed px/s (negative runs left); `rest` is the direction it settles back to.
  const motion = useRef({ offset: 0, v: baseSpeed * baseDir, rest: baseDir as number, dragging: false })
  const cfg = useRef({ baseSpeed, settle, effect, reduced })
  useEffect(() => {
    cfg.current = { baseSpeed, settle, effect, reduced }
  }, [baseSpeed, settle, effect, reduced])
  useEffect(() => {
    motion.current.rest = baseDir
  }, [baseDir])

  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  // Shared between the loop and the controls
  const trackRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef<HTMLSpanElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null)
  const slotsRef = useRef<SlotState[]>([])
  const scanningRef = useRef(false)
  const runRef = useRef({ visible: false, held: false })
  const resetRef = useRef<() => void>(() => {})
  const kickRef = useRef<() => void>(() => {})

  // ---- The stream ----
  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track || !layout || n === 0) return
    const { cw, w, h, slots } = layout
    const pitch = w + gap
    const L = slots * pitch
    const sx = cw / 2
    const run = runRef.current
    const m0 = motion.current
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-slot]'))
    if (cards.length !== slots) return
    const parts = cards.map((card) => ({
      card,
      before: card.querySelector<HTMLElement>('[data-before]')!,
      edge: card.querySelector<HTMLElement>('[data-edge]')!,
      band: card.querySelector<HTMLElement>('[data-band]')!,
      pre: card.querySelector<HTMLElement>('[data-band] pre')!,
      lastP: -1,
      lastGlyphs: 0,
    }))
    const cols = Math.ceil(w / GLYPH_W)
    const rows = Math.ceil(h / GLYPH_H)

    const xOf = (j: number) => mod(j * pitch + motion.current.offset, L) - pitch
    const sideOf = (x: number): Side => (x + w / 2 < sx ? 'left' : 'right')

    // Start with the scanner in the gap before the first card, so no card
    // begins part way through the scanner and every card shows Before.
    const place = () => {
      motion.current.offset = sx + gap / 2 + pitch
      slotsRef.current = cards.map((_, j) => {
        const x = xOf(j)
        return { x, p: 0, entry: sideOf(x) }
      })
    }
    // Keep the stream where it was across a resize, but restart the reveals.
    if (slotsRef.current.length !== slots || motion.current.offset === 0) place()
    else slotsRef.current = cards.map((_, j) => ({ x: xOf(j), p: 0, entry: sideOf(xOf(j)) }))

    const paint = (now: number) => {
      const state = slotsRef.current
      const fx = cfg.current.effect
      const showBand = fx === 'scramble' && !cfg.current.reduced
      let scanning = false
      for (let j = 0; j < slots; j++) {
        const s = state[j]
        const x = xOf(j)
        // Wrapped round the loop: a fresh pass, back to Before.
        if (Math.abs(x - s.x) > L / 2) {
          s.p = 0
          s.entry = sideOf(x)
        }
        s.x = x
        const inside = x < sx && x + w > sx
        // `entry` is the side the card stands on while it shows Before. The
        // reveal is the share of the card that has crossed the beam from that
        // side, so it always grows from the card's left edge and the edge sits
        // on the beam for a card coming in from the right (the normal flow).
        // It follows the card both ways: drag a finished card back across the
        // beam and it rewinds to Before, edge still on the beam.
        s.p = clamp(s.entry === 'right' ? (sx - x) / w : (x + w - sx) / w, 0, 1)
        if (inside && s.p < 1) scanning = true

        const part = parts[j]
        part.card.style.transform = `translate3d(${x}px,0,0)`
        if (s.p !== part.lastP) {
          part.lastP = s.p
          const pct = s.p * 100
          part.before.style.clipPath = `inset(0 0 0 ${pct}%)`
          const live = s.p > 0 && s.p < 1
          part.edge.style.opacity = live ? '1' : '0'
          part.edge.style.transform = `translate3d(${s.p * w}px,0,0)`
          part.card.dataset.state = s.p >= 1 ? 'after' : s.p > 0 ? 'scanning' : 'before'
          if (showBand && live) {
            const lo = Math.max(0, s.p - BAND) * 100
            part.band.style.opacity = '1'
            part.band.style.clipPath = `inset(0 ${100 - pct}% 0 ${lo}%)`
          } else {
            part.band.style.opacity = '0'
          }
        }
        if (showBand && inside && s.p < 1 && now - part.lastGlyphs > 70) {
          part.lastGlyphs = now
          part.pre.textContent = glyphs(cols, rows)
        }
      }
      if (scanning !== scanningRef.current) {
        scanningRef.current = scanning
        root.dataset.scanning = scanning ? 'true' : 'false'
      }
    }

    let raf = 0
    let last = 0
    let lastSpeedText = ''
    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      const m = motion.current
      const auto = !pausedRef.current && !runRef.current.held && !cfg.current.reduced
      if (!m.dragging) {
        // A throw eases back to the resting speed and direction.
        const target = auto ? cfg.current.baseSpeed * m.rest : 0
        m.v = target + (m.v - target) * Math.pow(cfg.current.settle, dt * 60)
        if (Math.abs(m.v - target) < (target ? 0.5 : 4)) m.v = target
        m.offset += m.v * dt
      }
      paint(now)
      if (speedRef.current) {
        const t = `${Math.round(m.dragging ? 0 : Math.abs(m.v))}`
        if (t !== lastSpeedText) speedRef.current.textContent = lastSpeedText = t
      }
      if (runRef.current.visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (!raf && runRef.current.visible && !document.hidden) {
        last = 0
        raf = requestAnimationFrame(frame)
      }
    }
    kickRef.current = start
    resetRef.current = () => {
      place()
      for (const part of parts) {
        part.lastP = -1
        part.pre.textContent = ''
      }
      motion.current.rest = baseDir
      motion.current.v = cfg.current.reduced ? 0 : cfg.current.baseSpeed * baseDir
      paint(performance.now())
      start()
    }

    // First paint, before any motion
    for (const part of parts) part.lastP = -1
    paint(performance.now())

    const io = new IntersectionObserver(([e]) => {
      runRef.current.visible = e.isIntersecting
      if (e.isIntersecting) start()
    })
    io.observe(root)
    const onVis = () => start()
    document.addEventListener('visibilitychange', onVis)

    // ---- Input: pointer drag with inertia, sideways wheel, keys ----
    let pointerId: number | null = null
    let lastX = 0
    let lastT = 0
    let vel = 0
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
      pointerId = e.pointerId
      lastX = e.clientX
      lastT = e.timeStamp
      vel = 0
      motion.current.dragging = true
      root.dataset.dragging = 'true'
      start()
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      const dx = e.clientX - lastX
      if (pointerId !== null && Math.abs(dx) > 2 && !root.hasPointerCapture(e.pointerId)) {
        root.setPointerCapture(e.pointerId)
      }
      const dtMs = Math.max(1, e.timeStamp - lastT)
      motion.current.offset += dx
      vel = vel * 0.6 + (dx / dtMs) * 1000 * 0.4
      lastX = e.clientX
      lastT = e.timeStamp
      start()
    }
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      pointerId = null
      motion.current.dragging = false
      delete root.dataset.dragging
      // Released after holding still: no throw.
      if (e.timeStamp - lastT > 80) vel = 0
      motion.current.v = Math.abs(vel) > 20 ? clamp(vel, -4000, 4000) : 0
      start()
    }
    const wheel = (e: WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX
      // Vertical scroll belongs to the page.
      if (!dx || (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY))) return
      e.preventDefault()
      const px = e.deltaMode === 1 ? dx * 16 : e.deltaMode === 2 ? dx * cw : dx
      motion.current.offset -= px
      start()
    }
    const key = (e: KeyboardEvent) => {
      if (e.target !== root) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        runRef.current.held = true
        // One card's width, thrown so it glides rather than jumps.
        const d = e.key === 'ArrowLeft' ? -1 : 1
        if (cfg.current.reduced) motion.current.offset += d * pitch
        else motion.current.v = d * pitch * 3
        start()
      }
    }
    const focusIn = () => {
      if (root.matches(':focus-visible')) runRef.current.held = true
    }
    const focusOut = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node | null)) {
        runRef.current.held = false
        start()
      }
    }
    if (interactive) {
      root.addEventListener('pointerdown', down)
      root.addEventListener('pointermove', move)
      root.addEventListener('pointerup', up)
      root.addEventListener('pointercancel', up)
      root.addEventListener('wheel', wheel, { passive: false })
      root.addEventListener('keydown', key)
      root.addEventListener('focusin', focusIn)
      root.addEventListener('focusout', focusOut)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      run.visible = false
      kickRef.current = () => {}
      resetRef.current = () => {}
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      root.removeEventListener('pointerdown', down)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerup', up)
      root.removeEventListener('pointercancel', up)
      root.removeEventListener('wheel', wheel)
      root.removeEventListener('keydown', key)
      root.removeEventListener('focusin', focusIn)
      root.removeEventListener('focusout', focusOut)
      m0.dragging = false
      delete root.dataset.dragging
    }
    // baseDir is read for reset only; the live direction is in `motion`.
  }, [layout, n, gap, baseDir, interactive])

  // Resume after pause, or when reduced motion is turned off
  useEffect(() => {
    if (!paused) kickRef.current()
  }, [paused, reduced])

  // ---- Particles (three.js) and scanner sparks (2D canvas) ----
  const [bigScreen, setBigScreen] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const on = () => setBigScreen(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const drawParticles = particles && !reduced && bigScreen
  const drawSparks = !reduced
  useEffect(() => {
    const root = rootRef.current
    const glCanvas = particleCanvasRef.current
    const sparkCanvas = sparkCanvasRef.current
    if (!root || !glCanvas || !sparkCanvas || !layout || !drawSparks) return
    let cancelled = false
    let raf = 0
    let cleanupGl: (() => void) | null = null
    const { cw } = layout
    const bandH = layout.h + 40
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // The scanner's particle stream, as in the original: points shed from
    // the beam and blown away from it, against the cards' travel. A steady
    // stream at rest, about three times as dense while a card is scanned.
    const ctx = sparkCanvas.getContext('2d')
    sparkCanvas.width = Math.round(cw * dpr)
    sparkCanvas.height = Math.round(bandH * dpr)
    type Spark = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; decay: number }
    // Fewer sparks on small screens; the stream reads the same at a glance.
    const scale = (bandH / 300) * (cw < 640 ? 0.35 : cw < 1024 ? 0.6 : 1)
    const baseMax = Math.round(800 * scale)
    const scanMax = Math.round(2500 * scale)
    let currentMax = baseMax
    const spawn = (): Spark => ({
      x: cw / 2 + (Math.random() - 0.5) * 3,
      y: Math.random() * bandH,
      vx: (Math.random() * 0.8 + 0.2) * -(Math.sign(motion.current.v) || motion.current.rest),
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 0.6 + 0.4,
      a: Math.random() * 0.4 + 0.6,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
    })
    const sparks: Spark[] = Array.from({ length: baseMax }, spawn)
    const STEPS = 8
    const buckets: Spark[][] = Array.from({ length: STEPS }, () => [])

    type GL = { render: (t: number) => void }
    let gl: GL | null = null

    // three.js waits until the stream is on screen and the browser is idle,
    // so it never competes with the page loading.
    let wantGl = drawParticles
    const loadGl = () => {
      if (!wantGl || cancelled) return
      wantGl = false
      const idle = (cb: () => void) =>
        'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 2500 }) : globalThis.setTimeout(cb, 600)
      idle(() => {
        if (!cancelled) startGl()
      })
    }
    // Hybrid build: the three.js particle field is not shipped (three is not a
    // dependency here), so this is a no-op and the stream runs without the dust.
    // Callers pass particles={false}, which keeps wantGl false anyway.
    const startGl = () => {
      gl = null
      cleanupGl = null
    }

    const frame = (t: number) => {
      raf = 0
      gl?.render(t)
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, cw, bandH)
        currentMax += ((scanningRef.current ? scanMax : baseMax) - currentMax) * 0.05
        while (sparks.length < currentMax) sparks.push(spawn())
        while (sparks.length > currentMax) sparks.pop()
        // One path per brightness step instead of one fill per spark.
        ctx.fillStyle = '#ffffff'
        for (const b of buckets) b.length = 0
        for (const p of sparks) {
          p.x += p.vx
          p.y += p.vy
          p.life -= p.decay
          if (p.life <= 0 || p.x < 0 || p.x > cw) Object.assign(p, spawn())
          const k = Math.min(STEPS - 1, Math.floor(p.a * p.life * STEPS))
          if (k > 0) buckets[k].push(p)
        }
        for (let k = 1; k < STEPS; k++) {
          const list = buckets[k]
          if (!list.length) continue
          ctx.globalAlpha = (k + 0.5) / STEPS
          ctx.beginPath()
          for (const p of list) {
            const d = p.r * 2
            ctx.rect(p.x - p.r, p.y - p.r, d, d)
          }
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
      if (onScreen && !document.hidden && !cancelled) raf = requestAnimationFrame(frame)
    }
    let onScreen = false
    const loop = () => {
      if (!raf && !cancelled && onScreen && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      if (onScreen) loadGl()
      loop()
    })
    io.observe(root)
    document.addEventListener('visibilitychange', loop)
    loop()

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', loop)
      cleanupGl?.()
      ctx?.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height)
    }
  }, [layout, drawParticles, drawSparks])

  const togglePause = useCallback(() => setPaused((p) => !p), [])
  const reverse = useCallback(() => {
    motion.current.rest = motion.current.rest === 1 ? -1 : 1
    kickRef.current()
  }, [])
  const reset = useCallback(() => {
    setPaused(false)
    resetRef.current()
  }, [])

  if (n === 0) return null

  const slots = layout?.slots ?? 0
  const w = layout?.w ?? 0
  const h = layout?.h ?? 0
  const bandH = h + 40
  const sizes = cardSizes(wantW)
  const hasCaptions = items.some((c) => c.title || c.meta)

  // Before the stream has measured itself (on the server, and until scripts
  // run) the cards around the scanner are drawn with CSS alone, exactly where
  // the stream will place them, so their photos load and paint straight away.
  const ssrCards = layout
    ? []
    : [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ k, item: items[mod(k, n)] }))
  const ssrW = `var(--scs-w)`
  const caption = (item: ScannerCardImage) =>
    (item.meta || item.title) && (
      <div data-caption="" className="pt-4 pr-2 whitespace-normal">
        {item.meta && <p className={`t-meta ${tone === 'light' ? 'text-ink-muted' : 'text-fog-muted'}`}>{item.meta}</p>}
        {item.title && <p className={`t-h3 mt-2 max-w-[24ch] ${tone === 'light' ? 'text-ink' : 'text-fog'}`}>{item.title}</p>}
      </div>
    )

  return (
    <div className={`scs relative ${className}`}>
      <div
        ref={rootRef}
        role="region"
        aria-roledescription="stream"
        aria-label={ariaLabel}
        tabIndex={interactive ? 0 : undefined}
        data-scanning="false"
        className={`scs-view relative overflow-hidden select-none ${interactive ? 'touch-pan-y cursor-grab data-[dragging=true]:cursor-grabbing' : ''}`}
        style={
          {
            // The stream runs full bleed, so vw stands in for its width here.
            '--scs-w-wide': `min(${wantW}px, ${WIDE_SHARE * 100}vw)`,
            '--scs-w-phone': `min(${wantW}px, ${PHONE_SHARE * 100}vw)`,
            height: layout
              ? bandH + (hasCaptions ? captionH || 104 : 0)
              : `calc(var(--scs-w) / ${ratio} + 40px + ${hasCaptions ? 104 : 0}px)`,
          } as React.CSSProperties
        }
      >
        {ssrCards.length > 0 && (
          <div aria-hidden="true" className="absolute inset-x-0 top-5">
            {ssrCards.map(({ k, item }) => (
              <div
                key={k}
                className="absolute top-0"
                style={{ width: ssrW, left: `calc(50% + ${gap / 2}px + ${k} * (${ssrW} + ${gap}px))` }}
              >
                <div className="relative overflow-hidden bg-ink shadow-[0_15px_40px_rgba(0,0,0,0.4)]" style={{ height: `calc(${ssrW} / ${ratio})` }}>
                  {/* The first card is scanned straight away: fetch its After photo now too. */}
                  {k === 0 && (
                    <Image src={item.after} alt="" fill sizes={sizes}
                    quality={60} loading="eager" draggable={false} className="object-cover pointer-events-none" />
                  )}
                  <Image
                    src={item.before}
                    alt=""
                    fill
                    sizes={sizes}
                    quality={60}
                    priority={k === 0 || k === -1}
                    // The cards beyond the first scan are fetched after the
                    // centre ones rather than alongside them: on a phone all
                    // eighteen photographs used to download at once and the
                    // card being read was the last to paint.
                    fetchPriority={Math.abs(k) > 1 ? 'low' : undefined}
                    draggable={false}
                    className="object-cover pointer-events-none grayscale-[0.85] contrast-[1.05]"
                  />
                  <span className="scs-chip">
                    <span data-on="">{labels.before}</span>
                    <span>{labels.after}</span>
                  </span>
                </div>
                {caption(item)}
              </div>
            ))}
          </div>
        )}
        {/* Ambient dust and scanner sparks, behind and in front of the cards */}
        <canvas
          ref={particleCanvasRef}
          aria-hidden="true"
          className="absolute left-0 top-0 w-full pointer-events-none"
          style={{ height: bandH, display: drawParticles ? undefined : 'none' }}
        />

        <div ref={trackRef} aria-hidden="true" className="absolute inset-x-0 top-5">
          {Array.from({ length: slots }, (_, j) => {
            const item = items[j % n]
            return (
              <div
                key={j}
                data-slot={j}
                data-state="before"
                className="absolute left-0 top-0 will-change-transform"
                style={{ width: w, transform: 'translate3d(-200%,0,0)' }}
              >
                <div className="relative overflow-hidden bg-ink shadow-[0_15px_40px_rgba(0,0,0,0.4)]" style={{ height: h }}>
                  <Image
                    src={item.after}
                    alt=""
                    fill
                    sizes={sizes}
                    quality={60}
                    fetchPriority="low"
                    draggable={false}
                    className="object-cover pointer-events-none"
                  />
                  <span className="scs-chip">
                    <span>{labels.before}</span>
                    <span data-on="">{labels.after}</span>
                  </span>
                  <div data-before="" className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 0%)' }}>
                    <Image
                      src={item.before}
                      alt=""
                      fill
                      sizes={sizes}
                      quality={60}
                      fetchPriority="low"
                      draggable={false}
                      className="object-cover pointer-events-none grayscale-[0.85] contrast-[1.05]"
                    />
                    <span className="scs-chip">
                      <span data-on="">{labels.before}</span>
                      <span>{labels.after}</span>
                    </span>
                  </div>
                  <div data-band="" className="scs-band absolute inset-0 opacity-0">
                    <pre />
                  </div>
                  <span data-edge="" className="absolute inset-y-0 left-0 w-[2px] -ml-px bg-signal opacity-0" />
                </div>
                {caption(item)}
              </div>
            )
          })}
        </div>

        {/* The scanner: a fixed hairline with survey marks top and bottom */}
        <div aria-hidden="true" className="scs-scanner absolute left-1/2 top-0 pointer-events-none" style={{ height: bandH }}>
          <span className="scs-line" />
        </div>
        <canvas
          ref={sparkCanvasRef}
          aria-hidden="true"
          className="absolute left-0 top-0 w-full pointer-events-none"
          style={{ height: bandH, display: drawSparks ? undefined : 'none' }}
        />
      </div>

      {(showControls || showSpeed) && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {showControls && (
            <>
              <button type="button" className="scs-btn" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Play' : 'Pause'}
              </button>
              <button type="button" className="scs-btn" onClick={reverse}>
                Reverse
              </button>
              <button type="button" className="scs-btn" onClick={reset}>
                Reset
              </button>
            </>
          )}
          {showSpeed && (
            <p className={`t-meta ml-auto ${tone === 'light' ? 'text-ink-muted' : 'text-fog-muted'}`} aria-hidden="true">
              <span ref={speedRef}>{Math.round(baseSpeed)}</span> px/s
            </p>
          )}
        </div>
      )}

      {/* What the stream shows, once each, for screen readers */}
      <ul className="sr-only">
        {items.map((c, i) => (
          <li key={i}>
            {c.title ? `${c.title}. ` : ''}
            {labels.before}: {c.beforeAlt || 'photo before the work'}. {labels.after}: {c.afterAlt || 'photo after the work'}.
          </li>
        ))}
      </ul>
    </div>
  )
}
