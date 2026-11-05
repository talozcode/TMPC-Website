'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import type { LocationMap as LocationMapType } from '@/components/ui/expand-map'

type Props = ComponentProps<typeof LocationMapType>

/**
 * The office plate, loaded only as it nears the screen. Until then (and while
 * the framer-motion chunk arrives) the closed plate is plain server-rendered
 * markup with the same classes and height, so nothing shifts when the live
 * one takes over and phones never pay for the map on first load.
 */
function StaticPlate({ location, note, className = '' }: Props) {
  return (
    <div className={`map-plate ${className}`}>
      <div className="map-card">
        <div className="map-fade" aria-hidden="true" />
        <div className="map-content">
          <div className="flex items-start justify-between gap-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="map-icon" aria-hidden="true">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
            <p className="map-clock t-meta">
              <span className="text-ink-muted">Bangkok</span>
              <span className="map-clock-time">--:--</span>
              <span className="text-ink-muted">GMT+7</span>
            </p>
          </div>
          <div>
            <p className="map-title">{location}</p>
            <div className="map-sub-slot">{note && <p className="map-sub">{note}</p>}</div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="map-rule" style={{ transform: 'scaleX(0.22)' }} aria-hidden="true" />
              <span className="map-hint t-meta" aria-hidden="true">
                <span className="map-hint-mark" />
                View map
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OfficeMap(props: Props) {
  const [armed, setArmed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [Live] = useState(() =>
    dynamic(() => import('@/components/ui/expand-map').then((m) => m.LocationMap), {
      ssr: false,
      loading: () => <StaticPlate {...props} />,
    })
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setArmed(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <div ref={ref}>{armed ? <Live {...props} /> : <StaticPlate {...props} />}</div>
}
