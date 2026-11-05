'use client'

import type { CompareImage } from '@/lib/compare-slots'
import { CompareDrag } from './compare-drag'

/**
 * Variant 2: drag the handle up or down, before on top, after below. On touch
 * only the handle itself drags (touch-action: none on it alone), so a swipe
 * over the photograph still scrolls the page; a tap on it moves the seam.
 */
export function CompareVertical({
  before,
  after,
  labels,
  sizes = '(max-width: 1024px) 100vw, 66vw',
  preload = false,
}: {
  before: CompareImage
  after: CompareImage
  labels: { before: string; after: string }
  sizes?: string
  preload?: boolean
}) {
  return (
    <CompareDrag
      axis="y"
      before={before}
      after={after}
      labels={labels}
      aspect="aspect-[4/3] sm:aspect-[16/9]"
      sizes={sizes}
      preload={preload}
      label="Reveal before or after, top is before"
    />
  )
}
