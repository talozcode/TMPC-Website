'use client'

import * as React from 'react'
import Link from 'next/link'

/**
 * Beam Wordmark Footer: the dark closing band of every page, crossed by a slow
 * diagonal shaft of teal light, with the brand set as a giant,
 * bottom-cropped wordmark that the light runs through.
 *
 * Top: a first column for the closing line and actions (`lead`), then link
 * columns with mono labels over hairlines. Bottom: the wordmark, fitted to the
 * full width, one span per letter. Every letter paints the same beam and
 * pointer glow as the backdrop, aligned to the section's own coordinates, so
 * the light reads as one shaft passing behind the columns and through the
 * letters.
 *
 * Interaction: the beam drifts on its own (only while the footer is on screen)
 * and leans toward a mouse; the mouse carries a soft glow that lights the
 * letters it passes; letters lift on hover and hop when clicked; labels,
 * hairlines and letters rise in the first time the footer is seen. Reduced
 * motion holds everything still and shows it at once. Touch gets the drift
 * only, so a finger scrolling past never drags the light around.
 *
 * Adapted from Kedhar's 21st.dev component to the TMPC tokens. No dependencies
 * beyond React and Next; styles are scoped under .bwf in one inline sheet.
 *
 * Professional pass (05/11/2026): recoloured to the navy and teal palette
 * (navy ground, paper ink, light teal beam), the film grain and the
 * vertical bands dropped, and every corner square. The wordmark is set in the
 * heading face, so it follows the ?type=serif review switch.
 */

// #region beam
// Pure: colour, fitting and beam maths.

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v)

/** "#57BACE" / "#5bc" to "87, 186, 206". Anything unparseable falls back. */
export const hexToRgb = (hex: string, fallback: string = '87, 186, 206'): string => {
  const m = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec((hex || '').trim())
  if (!m) return fallback
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const n = parseInt(h, 16)
  return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255)
}

/**
 * Font size (px) that makes a word measured at 100px span `target` px. A short
 * word would grow into a tower, so it is capped at `cap` px. Bad input is 0.
 */
export const fitSize = (measuredAt100: number, target: number, cap: number): number => {
  if (!(measuredAt100 > 0) || !(target > 0)) return 0
  const size = (100 * target) / measuredAt100
  return cap > 0 ? Math.min(size, cap) : size
}

/** Where the beam sits (% across the section) for a pointer at `u` (0 to 1 across). */
export const beamTarget = (u: number, lo: number = 30, hi: number = 82): number =>
  lo + (hi - lo) * clamp(Number.isFinite(u) ? u : 0.5, 0, 1)

/** The beam's idle sway: two slow, unrelated sines so it never visibly loops. */
export const drift = (t: number, centre: number = 58, amp: number = 9): number =>
  centre + amp * (0.7 * Math.sin(t * 0.21) + 0.3 * Math.sin(t * 0.077 + 1.3))

/** Frame-rate independent ease toward a target: `k` is the fraction closed per 1/60s. */
export const approach = (from: number, to: number, k: number, dt: number): number =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60)

/**
 * Where the baseline sits in a `line-height: 1` box, as a fraction of the font
 * size, from the font's ascent and descent at 100px. Missing metrics fall back
 * to a typical 0.8.
 */
export const baselineAt = (ascent: number, descent: number): number => {
  if (!(ascent > 0) || !(descent >= 0)) return 0.8
  return clamp(((100 - ascent - descent) / 2 + ascent) / 100, 0.5, 1.2)
}

/** Visible wordmark height: down to the baseline, plus `cut` em below it. */
export const wordHeight = (fontSize: number, baseline: number, cut: number): number =>
  Math.max(0, fontSize * (baseline + clamp(Number.isFinite(cut) ? cut : 0, -0.4, 0.4)))

// #endregion

export type FooterLink = { label: string; href?: string }
export type FooterColumn = { title: string; links: FooterLink[] }

export type BeamWordmarkFooterProps = Omit<React.ComponentProps<'footer'>, 'children' | 'style'> & {
  brand?: string
  /** What the giant wordmark spells. Defaults to `brand`. */
  wordmark?: string
  /** The first column's label. */
  label?: string
  /** The first column's content: closing line, actions, small print. */
  lead?: React.ReactNode
  columns?: FooterColumn[]
  onLinkClick?: (label: string, href?: string) => void
  /** Where the bottom edge cuts the wordmark, in em below its baseline. Negative cuts into the letters. */
  cut?: number
  background?: string
  ink?: string
  muted?: string
  /** Hairlines, the beam and the wordmark's lit edge. */
  accent?: string
  /** The wordmark's resting fill, top and foot. */
  wordTop?: string
  wordFoot?: string
  fontSans?: string
  fontDisplay?: string
  fontMono?: string
  wordWeight?: number
  /** `false` holds the beam still (the pointer glow still follows). */
  animate?: boolean
}

// One scoped stylesheet. Every rule targets a .bwf-* class and nothing else:
// the sheet is unlayered, so it would out-rank the site's Tailwind utilities
// (the buttons and type in `lead`) on any element it touched.
const CSS =
  '.bwf{position:relative;isolation:isolate;overflow:hidden;container-type:inline-size;background:var(--bwf-bg);color:var(--bwf-ink);font-family:var(--bwf-sans);-webkit-font-smoothing:antialiased;touch-action:pan-y}' +
  // The top rule: a hairline of accent, brighter where the beam crosses it.
  '.bwf-rule{position:absolute;left:0;right:0;top:0;height:1px;z-index:3;background:linear-gradient(90deg,rgba(var(--bwf-acc),.08),rgba(var(--bwf-acc),.5) var(--bwf-b),rgba(var(--bwf-acc),.08))}' +
  // Backdrop: a faint wash, the beam, a soft second beam and the pointer
  // glow. One frame (the section box) for all.
  '.bwf-sky{position:absolute;inset:0;z-index:0;pointer-events:none}' +
  '.bwf-wash{position:absolute;inset:0;background:radial-gradient(120% 90% at 8% 0%,rgba(var(--bwf-acc),.07),transparent 55%),radial-gradient(90% 70% at 92% 8%,rgba(var(--bwf-ink-rgb),.035),transparent 60%)}' +
  '.bwf-beam{position:absolute;inset:0;filter:blur(calc(1px + 1.6cqw));background:linear-gradient(var(--bwf-ang),transparent calc(var(--bwf-b) - 11%),rgba(var(--bwf-acc),.06) calc(var(--bwf-b) - 5%),rgba(var(--bwf-acc),.2) var(--bwf-b),rgba(var(--bwf-acc),.05) calc(var(--bwf-b) + 4%),transparent calc(var(--bwf-b) + 9%)),linear-gradient(var(--bwf-ang),transparent calc(var(--bwf-b) - 34%),rgba(var(--bwf-acc),.06) calc(var(--bwf-b) - 27%),transparent calc(var(--bwf-b) - 20%))}' +
  '.bwf-glow{position:absolute;inset:0;opacity:var(--bwf-g);background:radial-gradient(circle 26cqw at var(--bwf-px) var(--bwf-py),rgba(var(--bwf-acc),.1),transparent 70%)}' +
  // Layout: the site's own column and gutter.
  '.bwf-inner{position:relative;z-index:2;box-sizing:border-box;max-width:var(--wrap,85rem);margin:0 auto;padding:clamp(4rem,8vw,6.5rem) var(--gutter,clamp(1rem,4vw,3rem)) 0;display:grid;grid-template-columns:minmax(0,1.62fr) minmax(0,.7fr) minmax(0,.86fr);column-gap:clamp(24px,4cqw,64px);row-gap:44px}' +
  '.bwf-label{font-family:var(--bwf-mono);font-size:.72rem;line-height:1;letter-spacing:.16em;font-weight:600;text-transform:uppercase;color:var(--bwf-muted);padding-bottom:13px;position:relative;display:block}' +
  '.bwf-label::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,rgba(var(--bwf-acc),.6),rgba(var(--bwf-ink-rgb),.1) 70%);transform-origin:0 50%;transform:scaleX(var(--bwf-line,1));transition:transform 1.1s cubic-bezier(.2,.7,.1,1) var(--bwf-d,0ms)}' +
  '.bwf[data-in="false"] .bwf-label::after{--bwf-line:0}' +
  '.bwf-col{min-width:0}' +
  '.bwf-col:nth-child(1){max-width:34rem}' +
  '.bwf-lead{margin-top:28px}' +
  '.bwf-fade{transition:opacity .9s ease var(--bwf-d,0ms),translate .9s cubic-bezier(.2,.7,.1,1) var(--bwf-d,0ms)}' +
  '.bwf[data-in="false"] .bwf-fade{opacity:0;translate:0 14px}' +
  // Link columns: a short teal tick draws in and the label steps over it.
  '.bwf-links{margin-top:13px;display:flex;flex-direction:column}' +
  '.bwf-link{position:relative;display:inline-flex;align-items:center;gap:8px;min-height:2.25rem;font-size:.95rem;line-height:1.4;color:rgba(var(--bwf-ink-rgb),.8);transition:color .25s;overflow-wrap:anywhere}' +
  '.bwf-link-t{display:inline-block;transition:translate .35s cubic-bezier(.2,.8,.2,1)}' +
  '.bwf-link::before{content:"";position:absolute;left:0;top:50%;width:6px;height:1px;background:rgb(var(--bwf-acc));transform:scaleX(0);transform-origin:0 50%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}' +
  '.bwf-link svg{display:block;width:11px;height:11px;flex:none;opacity:0;translate:-6px 0;color:rgb(var(--bwf-acc));transition:opacity .25s,translate .35s cubic-bezier(.2,.8,.2,1)}' +
  '.bwf-link:hover,.bwf-link:focus-visible{color:var(--bwf-ink)}' +
  '.bwf-link:hover::before,.bwf-link:focus-visible::before{transform:scaleX(1)}' +
  '.bwf-link:hover .bwf-link-t,.bwf-link:focus-visible .bwf-link-t{translate:12px 0}' +
  '.bwf-link:hover svg,.bwf-link:focus-visible svg{opacity:1;translate:10px 0}' +
  '.bwf-text{display:flex;align-items:center;min-height:2.25rem;font-size:.95rem;line-height:1.4;color:rgba(var(--bwf-ink-rgb),.8)}' +
  // The wordmark. Each letter paints the section-sized background, shifted
  // back by its own offset, so beam and glow line up with the backdrop.
  '.bwf-word{position:relative;z-index:1;overflow:hidden;margin-top:clamp(40px,7cqw,112px)}' +
  '.bwf-word-box{padding:0 var(--gutter,clamp(1rem,4vw,3rem));max-width:var(--wrap,85rem);margin:0 auto;box-sizing:border-box}' +
  '.bwf-word-in{display:inline-flex;white-space:nowrap;font-family:var(--bwf-display);font-weight:var(--bwf-ww);line-height:1;letter-spacing:-.03em;user-select:none;-webkit-user-select:none}' +
  '.bwf-lw{display:inline-block;translate:0 0;transition:translate 1.25s cubic-bezier(.16,.84,.2,1) var(--bwf-d,0ms)}' +
  '.bwf[data-in="false"] .bwf-lw{translate:0 85%}' +
  '.bwf-l{display:inline-block;cursor:default;color:transparent;-webkit-background-clip:text;background-clip:text;background-repeat:no-repeat;background-size:var(--bwf-rw) var(--bwf-rh);background-position:calc(var(--bwf-x) * -1) calc(var(--bwf-y) * -1);' +
  'background-image:radial-gradient(circle 22cqw at var(--bwf-px) var(--bwf-py),rgba(var(--bwf-lit),calc(var(--bwf-g) * .7)),transparent 70%),' +
  'linear-gradient(var(--bwf-ang),transparent calc(var(--bwf-b) - 9%),rgba(var(--bwf-lit),.38) calc(var(--bwf-b) - 1.5%),rgba(var(--bwf-lit),.55) var(--bwf-b),rgba(var(--bwf-lit),.14) calc(var(--bwf-b) + 3.5%),transparent calc(var(--bwf-b) + 8%)),' +
  'linear-gradient(180deg,var(--bwf-wt) var(--bwf-top),var(--bwf-wf) var(--bwf-bot));' +
  'transition:transform .5s cubic-bezier(.2,.9,.25,1.2),filter .4s;transform-origin:50% 100%}' +
  '@media (hover:hover){.bwf-l:hover{transform:translateY(-.03em);filter:brightness(1.3)}}' +
  '.bwf-l.is-hop{animation:bwf-hop .75s cubic-bezier(.2,.8,.2,1)}' +
  '@keyframes bwf-hop{0%{transform:translateY(0) scale(1,1)}18%{transform:translateY(.02em) scale(1.04,.93)}45%{transform:translateY(-.1em) scale(.98,1.03)}70%{transform:translateY(.01em) scale(1.01,.98)}100%{transform:translateY(0) scale(1,1)}}' +
  // The foot sinks into the dark.
  '.bwf-foot{position:absolute;left:0;right:0;bottom:0;height:32%;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(var(--bwf-bg-rgb),.6) 55%,var(--bwf-bg))}' +
  '@container (max-width: 900px){.bwf-inner{grid-template-columns:minmax(0,1fr) minmax(0,1fr);row-gap:48px}.bwf-col:nth-child(1){grid-column:1 / -1;max-width:none}}' +
  '@media (prefers-reduced-motion: reduce){.bwf .bwf-lw,.bwf .bwf-fade,.bwf .bwf-label::after,.bwf .bwf-l,.bwf .bwf-link-t,.bwf .bwf-link svg{transition:none!important;animation:none!important}.bwf[data-in="false"] .bwf-lw,.bwf[data-in="false"] .bwf-fade{translate:none;opacity:1}.bwf[data-in="false"] .bwf-label::after{--bwf-line:1}}'

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2.5 9.5l7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
  </svg>
)

/** Baseline of the wordmark's actual font, read off a canvas. */
const measureBaseline = (family: string, weight: number, text: string): number => {
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return 0.8
    ctx.font = weight + ' 100px ' + family
    const m = ctx.measureText(text)
    return baselineAt(m.fontBoundingBoxAscent, m.fontBoundingBoxDescent)
  } catch {
    return 0.8
  }
}

const isMouse = (e: React.PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

export function BeamWordmarkFooter({
  brand = 'TMPC',
  wordmark,
  label,
  lead,
  columns = [],
  onLinkClick,
  cut = -0.08,
  background = '#0B2137',
  ink = '#FBF9F4',
  muted = '#A9B5C1',
  accent = '#57BACE',
  wordTop = '#1C4166',
  wordFoot = '#0B2137',
  fontSans = 'var(--font-sans)',
  fontDisplay = 'var(--font-display)',
  fontMono = 'var(--font-sans)',
  wordWeight = 600,
  animate = true,
  className = '',
  ...rest
}: BeamWordmarkFooterProps) {
  const word = (wordmark ?? brand).trim() || brand
  const letters = React.useMemo(() => Array.from(word), [word])

  const rootRef = React.useRef<HTMLElement>(null)
  const wordRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState(0)
  const [base, setBase] = React.useState(0.8)
  const [seen, setSeen] = React.useState(false)

  // Pointer state lives in a ref and reaches the page as CSS variables, so the
  // beam never re-renders React.
  const ptr = React.useRef({ u: 0.5, x: 0, y: 0, inside: false })

  // Fit the wordmark to the column width, then tell every letter where it sits
  // inside the section so its slice of the beam lines up with the backdrop.
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const box = wordRef.current
    const inner = innerRef.current
    if (!root || !box || !inner) return
    let frame = 0
    const place = () => {
      const r = root.getBoundingClientRect()
      root.style.setProperty('--bwf-rw', r.width + 'px')
      root.style.setProperty('--bwf-rh', r.height + 'px')
      const spans = inner.querySelectorAll<HTMLElement>('.bwf-l')
      let top = 0
      spans.forEach((s, i) => {
        // offsetLeft/Top chains ignore the reveal translate, so the beam is
        // already aligned while the letters are still rising.
        let x = 0
        let y = 0
        let el: HTMLElement | null = s
        while (el && el !== root) {
          x += el.offsetLeft
          y += el.offsetTop
          el = el.offsetParent as HTMLElement | null
        }
        s.style.setProperty('--bwf-x', x + 'px')
        s.style.setProperty('--bwf-y', y + 'px')
        if (i === 0) top = y
      })
      root.style.setProperty('--bwf-top', top + 'px')
      root.style.setProperty('--bwf-bot', top + (parseFloat(inner.style.fontSize) || 0) * 0.92 + 'px')
    }
    const fit = () => {
      const wb = inner.parentElement ?? box
      const cs = getComputedStyle(wb)
      const target = wb.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0)
      inner.style.fontSize = '100px'
      const measured = inner.offsetWidth
      setBase(measureBaseline(getComputedStyle(inner).fontFamily, wordWeight, word))
      const next = fitSize(measured, target, target * 0.42)
      inner.style.fontSize = next + 'px'
      setSize(next)
      place()
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    fit()
    const ro = new ResizeObserver(schedule)
    ro.observe(root)
    let alive = true
    document.fonts?.ready.then(() => alive && schedule())
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
  }, [word, fontDisplay, wordWeight])

  // Reveal once, the first time the footer is on screen; the beam runs only
  // while it is.
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.05 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let lb = NaN
    let lx = NaN
    let ly = NaN
    let lg = NaN
    const set = (b: number, px: number, py: number, g: number) => {
      // Skip frames where nothing moved enough to see: every write repaints
      // the beam and the letters.
      if (Math.abs(b - lb) < 0.01 && Math.abs(px - lx) < 0.2 && Math.abs(py - ly) < 0.2 && Math.abs(g - lg) < 0.002) return
      lb = b
      lx = px
      ly = py
      lg = g
      root.style.setProperty('--bwf-b', b.toFixed(2) + '%')
      root.style.setProperty('--bwf-px', px.toFixed(1) + 'px')
      root.style.setProperty('--bwf-py', py.toFixed(1) + 'px')
      root.style.setProperty('--bwf-g', g.toFixed(3))
    }
    const still = reduced || !animate
    if (still || !visible) {
      // Hold the beam; the glow still answers the mouse, because it only
      // moves when you do.
      const p = ptr.current
      set(58, p.x, p.y, p.inside ? 1 : 0)
      if (!still) return
      const onMove = () => set(58, ptr.current.x, ptr.current.y, ptr.current.inside ? 1 : 0)
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerleave', onMove)
      return () => {
        root.removeEventListener('pointermove', onMove)
        root.removeEventListener('pointerleave', onMove)
      }
    }
    let raf = 0
    let last = performance.now()
    let t = last / 1000
    let b = 58
    let px = ptr.current.x
    let py = ptr.current.y
    let g = 0
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      t += dt
      const p = ptr.current
      const idle = drift(t)
      const target = p.inside ? beamTarget(p.u) * 0.75 + idle * 0.25 : idle
      b = approach(b, target, 0.035, dt)
      px = approach(px, p.x, 0.16, dt)
      py = approach(py, p.y, 0.16, dt)
      g = approach(g, p.inside ? 1 : 0, 0.06, dt)
      set(b, px, py, g)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, animate, visible])

  const onPointer = (e: React.PointerEvent<HTMLElement>) => {
    if (!isMouse(e)) return
    const r = e.currentTarget.getBoundingClientRect()
    const p = ptr.current
    p.x = e.clientX - r.left
    p.y = e.clientY - r.top
    p.u = r.width ? p.x / r.width : 0.5
    p.inside = e.type !== 'pointerleave'
  }

  const hop = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (reduced) return
    const el = e.currentTarget
    el.classList.remove('is-hop')
    void el.offsetWidth
    el.classList.add('is-hop')
  }

  const vars = {
    '--bwf-bg': background,
    '--bwf-bg-rgb': hexToRgb(background, '11, 33, 55'),
    '--bwf-ink': ink,
    '--bwf-ink-rgb': hexToRgb(ink, '251, 249, 244'),
    '--bwf-muted': muted,
    '--bwf-acc': hexToRgb(accent),
    '--bwf-lit': hexToRgb(accent),
    '--bwf-wt': wordTop,
    '--bwf-wf': wordFoot,
    '--bwf-sans': fontSans,
    '--bwf-display': fontDisplay,
    '--bwf-mono': fontMono,
    '--bwf-ww': String(wordWeight),
    '--bwf-ang': '118deg',
    '--bwf-b': '58%',
    '--bwf-px': '50%',
    '--bwf-py': '50%',
    '--bwf-g': '0',
    '--bwf-top': '0px',
    '--bwf-bot': '100%',
  } as React.CSSProperties

  // Stagger order: the label, the lead, then each column's label and links.
  // Worked out from positions rather than a running counter, which the React
  // compiler rejects as a reassignment after render.
  const delay = (i: number) => ({ '--bwf-d': (i + 1) * 70 + 'ms' }) as React.CSSProperties
  const colStart = columns.map((_, ci) =>
    columns.slice(0, ci).reduce((n, c) => n + 1 + c.links.length, 2)
  )

  return (
    <footer
      {...rest}
      ref={rootRef}
      className={('bwf ' + className).trim()}
      style={vars}
      data-in={seen || reduced ? 'true' : 'false'}
      onPointerMove={onPointer}
      onPointerEnter={onPointer}
      onPointerLeave={onPointer}
    >
      <style>{CSS}</style>
      <div className="bwf-rule" aria-hidden="true" />
      <div className="bwf-sky" aria-hidden="true">
        <div className="bwf-wash" />
        <div className="bwf-beam" />
        <div className="bwf-glow" />
      </div>

      <div className="bwf-inner">
        <div className="bwf-col">
          {label && (
            <p className="bwf-label" style={delay(0)}>
              {label}
            </p>
          )}
          {lead && (
            <div className="bwf-lead bwf-fade" style={delay(1)}>
              {lead}
            </div>
          )}
        </div>

        {columns.map((col, ci) => (
          <nav key={col.title + ci} className="bwf-col" aria-label={col.title}>
            <p className="bwf-label" style={delay(colStart[ci])}>
              {col.title}
            </p>
            <ul className="bwf-links">
              {col.links.map((l, li) => {
                const inner = (
                  <>
                    <span className="bwf-link-t">{l.label}</span>
                    <Arrow />
                  </>
                )
                return (
                  <li key={l.label + li} className="bwf-fade" style={delay(colStart[ci] + 1 + li)}>
                    {!l.href ? (
                      <span className="bwf-text">{l.label}</span>
                    ) : l.href.startsWith('/') ? (
                      <Link className="bwf-link" href={l.href} onClick={() => onLinkClick?.(l.label, l.href)}>
                        {inner}
                      </Link>
                    ) : (
                      <a
                        className="bwf-link"
                        href={l.href}
                        onClick={() => onLinkClick?.(l.label, l.href)}
                        {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div
        ref={wordRef}
        className="bwf-word"
        aria-hidden="true"
        style={{ height: size ? wordHeight(size, base, cut) : 'calc(' + (0.83 + cut) * 26 + 'cqw)' }}
      >
        <div className="bwf-word-box">
          <div ref={innerRef} className="bwf-word-in">
            {letters.map((ch, i) => (
              <span key={i} className="bwf-lw" style={{ '--bwf-d': 260 + i * 75 + 'ms' } as React.CSSProperties}>
                <span className="bwf-l" onClick={hop} onAnimationEnd={(e) => e.currentTarget.classList.remove('is-hop')}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="bwf-foot" />
      </div>
    </footer>
  )
}

export default BeamWordmarkFooter
