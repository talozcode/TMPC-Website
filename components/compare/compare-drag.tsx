'use client'

import type { CompareImage } from '@/lib/compare-slots'
import { CompareSeam, CompareStage } from './compare-stage'
import { useCompare, type CompareAxis } from './use-compare'

/**
 * Variant 1 and 2: drag the handle to reveal. Horizontal puts before on the
 * left; vertical puts before on top. A horizontal stage keeps touch-pan-y so
 * the page still scrolls through it. A vertical one would fight that scroll,
 * so on touch only the handle drags and a tap on the image moves the seam.
 */
export function CompareDrag({
  before,
  after,
  labels = { before: 'Before', after: 'After' },
  axis = 'x',
  aspect = 'aspect-[4/3] md:aspect-[16/9]',
  sizes = '(max-width: 1400px) 100vw, 1360px',
  preload = false,
  hint = true,
  label = 'Reveal before or after',
}: {
  before: CompareImage
  after: CompareImage
  labels?: { before: string; after: string }
  axis?: CompareAxis
  aspect?: string
  sizes?: string
  preload?: boolean
  hint?: boolean
  label?: string
}) {
  const vertical = axis === 'y'
  const c = useCompare({ axis, hint, touchHandleOnly: vertical })

  return (
    <CompareStage
      stageRef={c.stageRef}
      before={before}
      after={after}
      shape={axis}
      labels={labels}
      sizes={sizes}
      preload={preload}
      className={`${aspect} touch-pan-y ${vertical ? 'md:cursor-ns-resize' : 'cursor-ew-resize'} data-[dragging=true]:cursor-grabbing`}
      {...c.stageProps}
    >
      <CompareSeam axis={axis} handleRef={c.handleRef} label={label} touchHandle={vertical} {...c.handleProps} />
    </CompareStage>
  )
}
