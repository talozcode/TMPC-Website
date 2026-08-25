'use client'

import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion'

/**
 * Kept as the name the pages already call, now backed by the shared Reveal so
 * there is a single reveal implementation and a single easing on the site.
 */
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  /** Accepted for call-site compatibility; the distance now comes from the CSS. */
  y?: number
  className?: string
}) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  )
}
