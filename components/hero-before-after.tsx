'use client'

import { CompareDrag } from '@/components/compare/compare-drag'
import { COMPARE } from '@/lib/compare-slots'

export const FALLBACK_BEFORE_IMAGE = COMPARE.home.before.src
export const FALLBACK_AFTER_IMAGE = COMPARE.home.after.src

/**
 * The homepage's drag-to-reveal before/after, and the live preview in
 * /admin/hero. A thin wrapper over the shared compare engine
 * (components/compare/): same props and look it has always had, with the
 * drag, keyboard, ARIA and one-time hint living in useCompare.
 */
export function HeroBeforeAfter({
  beforeUrl = FALLBACK_BEFORE_IMAGE,
  afterUrl = FALLBACK_AFTER_IMAGE,
  projectName,
  projectDetails,
}: {
  beforeUrl?: string | null
  afterUrl?: string | null
  projectName?: string | null
  projectDetails?: string | null
}) {
  return (
    <figure className="m-0">
      <CompareDrag
        before={{ src: beforeUrl || FALLBACK_BEFORE_IMAGE, alt: projectName ? `${projectName}, before` : 'Before' }}
        after={{ src: afterUrl || FALLBACK_AFTER_IMAGE, alt: projectName ? `${projectName}, after` : 'After' }}
        labels={COMPARE.home.labels}
      />
      {(projectName || projectDetails) && (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-4">
          {projectName && <span className="t-h3">{projectName}</span>}
          {projectDetails && <span className="t-meta text-ink-muted">{projectDetails}</span>}
        </figcaption>
      )}
    </figure>
  )
}
