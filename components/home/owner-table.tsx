'use client'

import { useEffect, useRef, useState } from 'react'

const PARTIES = [
  { name: 'Architects and designers', work: 'Brief, design reviews and sign-offs' },
  { name: 'Engineers and consultants', work: 'Scope, technical queries and coordination' },
  { name: 'Contractors', work: 'Tender, price checks and progress on site' },
  { name: 'Suppliers and vendors', work: 'Sourcing, quotes and delivery' },
  { name: 'Authorities', work: 'Permits, submissions and inspections' },
  { name: 'Operators', work: 'Handover, systems and opening' },
]

/**
 * Who TMPC sits between (from feat/v3, replacing the static "One Coordination
 * Layer" box). One line from you to TMPC; from TMPC, a line to every party on
 * the project. The lines draw in when the diagram arrives, and pointing at a
 * party draws a teal line out from TMPC to it, which retracts when you move
 * on. Below 1024px it is a single ruled column, same order.
 *
 * v3 drew the lit line with anime.js; here it is a CSS transition on
 * stroke-dashoffset over a normalised pathLength, so no extra dependency.
 * Reduced motion: the line simply appears (the global transition cap).
 */
export function OwnerTable() {
  const ref = useRef<HTMLDivElement>(null)
  const fanRef = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState<number | null>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = fanRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (width > 0 && height > 0) setBox({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n = PARTIES.length
  const w = box?.w ?? 100
  const h = box?.h ?? 100

  return (
    <div
      ref={ref}
      className="table-diagram grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.4fr)] items-stretch"
      data-focus={focus ?? undefined}
    >
      {/* You */}
      <div className="flex lg:items-center">
        <div className="w-full border border-line bg-canvas px-5 py-5 max-lg:max-w-[26rem]">
          <p className="t-meta text-ink-muted">Owner</p>
          <p className="t-h3 text-ink mt-2">You</p>
          <p className="text-[0.92rem] text-ink-muted mt-1.5">Clear decisions. No unnecessary noise.</p>
        </div>
      </div>

      {/* You to TMPC */}
      <div className="relative flex lg:items-center max-lg:h-12 max-lg:pl-8">
        <span className="tbl-link hidden lg:block absolute left-0 right-[55%] top-1/2 h-px -translate-y-1/2 bg-ink" aria-hidden="true" />
        <span className="lg:hidden absolute top-0 bottom-0 left-8 w-px bg-ink" aria-hidden="true" />
        <div className="hidden lg:block relative ml-[45%] w-full bg-canvas-dark text-fog px-5 py-5 z-[1]">
          <p className="t-meta text-fog-muted">Your side</p>
          <p className="t-h3 mt-2">TMPC</p>
          <p className="text-[0.92rem] text-fog-muted mt-1.5">We coordinate. We review. We negotiate. We manage.</p>
        </div>
      </div>
      <div className="lg:hidden bg-canvas-dark text-fog px-5 py-5 max-lg:max-w-[26rem]">
        <p className="t-meta text-fog-muted">Your side</p>
        <p className="t-h3 mt-2">TMPC</p>
        <p className="text-[0.92rem] text-fog-muted mt-1.5">We coordinate. We review. We negotiate. We manage.</p>
      </div>

      {/* TMPC to every party */}
      <div className="relative lg:pl-[18%] max-lg:pl-8 max-lg:pt-6">
        <div ref={fanRef} className="hidden lg:block absolute left-0 top-0 h-full w-[18%]" aria-hidden="true">
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio={box ? undefined : 'none'}
          >
            {PARTIES.map((p, i) => {
              const y = ((i + 0.5) / n) * h
              const d = `M0 ${h / 2} C ${w * 0.55} ${h / 2}, ${w * 0.45} ${y}, ${w} ${y}`
              return (
                <g key={p.name}>
                  <path className="table-line" d={d} />
                  <path className="table-hi" d={d} pathLength={1} data-on={focus === i} />
                </g>
              )
            })}
          </svg>
        </div>
        <span className="lg:hidden absolute top-0 bottom-6 left-8 w-px bg-line" aria-hidden="true" />
        <ul className="grid h-full" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }}>
          {PARTIES.map((p, i) => (
            <li key={p.name} className="relative">
              <span className="lg:hidden absolute left-0 top-1/2 w-5 h-px bg-line" aria-hidden="true" />
              <div
                className="party h-full flex flex-col md:flex-row md:items-baseline md:justify-between gap-x-4 py-3.5 pl-7 lg:pl-4 pr-2 border-b border-line"
                data-on={focus === i}
                // Mouse only: a tap fires enter with no leave, which left the
                // other parties dimmed on phones and tablets.
                onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus(i)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setFocus(null)}
              >
                <span className="party-name font-semibold text-ink">{p.name}</span>
                <span className="text-[0.88rem] text-ink-muted md:text-right">{p.work}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
