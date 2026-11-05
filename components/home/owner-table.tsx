'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, createDrawable, motionOk, outExpo } from '@/components/anim/anime'

const PARTIES = [
  { name: 'Architects and designers', work: 'Brief, design reviews and sign-offs' },
  { name: 'Engineers and consultants', work: 'Scope, technical queries and coordination' },
  { name: 'Contractors', work: 'Tender, price checks and progress on site' },
  { name: 'Suppliers and vendors', work: 'Sourcing, quotes and delivery' },
  { name: 'Authorities', work: 'Permits, submissions and inspections' },
  { name: 'Operators', work: 'Handover, systems and opening' },
]

/**
 * Who TMPC sits between. One line from you to TMPC; from TMPC, a line to
 * every party on the project. The lines draw in when the diagram arrives,
 * and pointing at a party draws a signal line out from TMPC to it, which
 * draws back in when you move on. Every party says what we handle with them.
 * Below 1024px it becomes a single column, same order: on a tablet the
 * parties read as a ledger, name left and what we handle right, because the
 * fan squeezed the TMPC card to one word a line at that width.
 */
export function OwnerTable() {
  const ref = useRef<HTMLDivElement>(null)
  const fanRef = useRef<HTMLDivElement>(null)
  const hiRefs = useRef<(SVGPathElement | null)[]>([])
  const [focus, setFocus] = useState<number | null>(null)
  // The fan of lines is drawn in real pixels once measured, so a line's
  // length is its true length and the signal line can be drawn along it.
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

  // Draw the lit line out from TMPC, and retract the one before it, quicker.
  useEffect(() => {
    if (!box) return
    const paths = hiRefs.current.filter(Boolean) as SVGPathElement[]
    const lines = createDrawable(paths)
    const ok = motionOk()
    lines.forEach((line, i) => {
      const on = focus === i
      animate(line, {
        draw: on ? '0 1' : '0 0',
        duration: ok ? (on ? 700 : 380) : 0,
        ease: outExpo,
      })
    })
  }, [focus, box])

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

  return (
    <div
      ref={ref}
      className="table-diagram grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.4fr)] items-stretch"
      data-focus={focus ?? undefined}
    >
      {/* You */}
      <div className="flex lg:items-center">
        <div className="relative w-full lg:pr-0">
          <div className="border border-rule bg-[#FBFCFA] px-5 py-5 max-lg:max-w-[26rem]">
            <p className="t-meta text-ink-muted">Owner</p>
            <p className="t-h3 mt-2">You</p>
            <p className="text-[0.92rem] text-ink-muted mt-1.5">Clear decisions. No unnecessary noise.</p>
          </div>
        </div>
      </div>

      {/* You to TMPC */}
      <div className="relative flex lg:items-center max-lg:h-12 max-lg:pl-8">
        <span className="tbl-link hidden lg:block absolute left-0 right-[55%] top-1/2 h-[2px] -translate-y-1/2 bg-ink" aria-hidden="true" />
        <span className="pm-link lg:hidden absolute top-0 bottom-0 left-8 w-[2px] bg-ink" aria-hidden="true" />
        <div className="hidden lg:block relative ml-[45%] w-full bg-ink text-fog px-5 py-5 z-[1]">
          <p className="t-meta text-fog-muted">Your side</p>
          <p className="t-h3 mt-2">TMPC</p>
          <p className="text-[0.92rem] text-fog-muted mt-1.5">We coordinate. We review. We negotiate. We manage.</p>
        </div>
      </div>
      <div className="lg:hidden bg-ink text-fog px-5 py-5 max-lg:max-w-[26rem]">
        <p className="t-meta text-fog-muted">Your side</p>
        <p className="t-h3 mt-2">TMPC</p>
        <p className="text-[0.92rem] text-fog-muted mt-1.5">We coordinate. We review. We negotiate. We manage.</p>
      </div>

      {/* TMPC to every party */}
      <div className="relative lg:pl-[18%] max-lg:pl-8 max-lg:pt-6" data-pm-spine>
        <div ref={fanRef} className="hidden lg:block absolute left-0 top-0 h-full w-[18%]" aria-hidden="true">
          {box ? (
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${box.w} ${box.h}`}>
              {PARTIES.map((p, i) => {
                const y = ((i + 0.5) / n) * box.h
                const d = `M0 ${box.h / 2} C ${box.w * 0.55} ${box.h / 2}, ${box.w * 0.45} ${y}, ${box.w} ${y}`
                return (
                  <g key={p.name}>
                    <path className="table-line" d={d} />
                    <path
                      ref={(node) => {
                        hiRefs.current[i] = node
                      }}
                      className="table-hi"
                      d={d}
                      strokeDasharray="0 2000"
                    />
                  </g>
                )
              })}
            </svg>
          ) : (
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {PARTIES.map((p, i) => (
                <path key={p.name} className="table-line" d={`M0 50 C 55 50, 45 ${((i + 0.5) / n) * 100}, 100 ${((i + 0.5) / n) * 100}`} />
              ))}
            </svg>
          )}
        </div>
        <span className="lg:hidden absolute top-0 bottom-6 left-8 w-px bg-rule" aria-hidden="true" />
        {/* Phones: the line fills orange down to the reading line, a square at its head. */}
        <span className="pm-spine md:hidden" aria-hidden="true" />
        <span className="pm-node md:hidden" aria-hidden="true"><i /></span>
        <ul className="grid h-full" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }}>
          {PARTIES.map((p, i) => (
            <li key={p.name} className="relative" data-pm-item>
              <span className="pm-tick lg:hidden absolute left-0 top-1/2 w-5 h-px bg-rule" aria-hidden="true" />
              <span className="pm-idx md:hidden t-meta" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div
                className="party h-full flex flex-col md:flex-row md:items-baseline md:justify-between gap-x-4 py-3.5 pl-7 lg:pl-4 pr-2 border-b border-rule-soft"
                data-on={focus === i}
                // Mouse only: a tap fires enter with no leave, which left the
                // other parties dimmed on phones and tablets.
                onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus(i)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setFocus(null)}
              >
                <span className="font-semibold [font-variation-settings:'wdth'_106]">{p.name}</span>
                <span className="text-[0.88rem] text-ink-muted md:text-right">{p.work}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
