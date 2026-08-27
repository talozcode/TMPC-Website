/**
 * The three lifecycle stages a project photograph can belong to, and the helpers
 * that turn a flat project_images list into something the UI can render.
 *
 * Deliberately plain TypeScript: no 'use client', no server-only imports, no
 * dependency on lib/types.ts. Server components, client components and the admin
 * all import from here.
 */

export const PHASES = ['rendering', 'in_progress', 'completed'] as const
export type ProjectPhase = (typeof PHASES)[number]

/** Short, for the chip that sits on the image. */
export const PHASE_LABELS: Record<ProjectPhase, string> = {
  rendering: 'Rendering',
  in_progress: 'In Progress',
  completed: 'Completed',
}

/** Long, for lightbox captions and the admin section headers. */
export const PHASE_LABELS_LONG: Record<ProjectPhase, string> = {
  rendering: 'Architect Rendering',
  in_progress: 'In Progress',
  completed: 'Completed',
}

/** A real JPEG. Do not point this at one of the 29-byte stubs in public/images. */
export const FALLBACK_PROJECT_IMAGE = '/images/scenario-commercial.jpg'

export function isPhase(value: unknown): value is ProjectPhase {
  return typeof value === 'string' && (PHASES as readonly string[]).includes(value)
}

/** Anything unrecognised reads as completed, matching the column default. */
export function coercePhase(value: unknown): ProjectPhase {
  return isPhase(value) ? value : 'completed'
}

/** One phase that actually has images. Plain data, so it crosses the RSC boundary. */
export interface PhaseGroup {
  phase: ProjectPhase
  label: string
  labelLong: string
  images: string[]
}

interface PhaseInput {
  url: string
  display_order: number
  phase?: string | null
}

/**
 * Groups a flat image list into the fixed phase order, dropping any phase with
 * no images.
 *
 * The returned array IS the show-the-control rule: `length > 1` means the project
 * has a story to tell, `length === 1` means render exactly as the site did before
 * phases existed. Expressing it here means no caller can forget it.
 *
 * Never returns an empty array. With no images at all it returns a single
 * completed group holding the fallback, so `groups[0].images[0]` is always safe.
 */
export function toPhaseGroups(images: PhaseInput[] | null | undefined): PhaseGroup[] {
  const buckets: Record<ProjectPhase, PhaseInput[]> = {
    rendering: [],
    in_progress: [],
    completed: [],
  }
  for (const image of images ?? []) buckets[coercePhase(image.phase)].push(image)

  const groups = PHASES.map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    labelLong: PHASE_LABELS_LONG[phase],
    images: buckets[phase]
      .slice()
      // Array.prototype.sort is stable, so duplicate display_order values (which
      // two admin tabs can produce) keep their relative order rather than jumping.
      .sort((a, b) => a.display_order - b.display_order)
      .map((image) => image.url),
  })).filter((group) => group.images.length > 0)

  return groups.length
    ? groups
    : [
        {
          phase: 'completed' as const,
          label: PHASE_LABELS.completed,
          labelLong: PHASE_LABELS_LONG.completed,
          images: [FALLBACK_PROJECT_IMAGE],
        },
      ]
}

/**
 * One representative image for a project: the first image of the most advanced
 * phase it has. A portfolio should lead with the project as it stands today
 * rather than with a rendering of what it might have been, and using one rule
 * everywhere means the hero, the list and the detail page never disagree.
 *
 * Returns null when a project genuinely has no images, so callers can drop it
 * rather than showing a placeholder.
 */
export function pickLeadImage(images: PhaseInput[] | null | undefined): string | null {
  const groups = toPhaseGroups(images)
  const url = groups[groups.length - 1].images[0]
  return url === FALLBACK_PROJECT_IMAGE ? null : url
}

/** Flattens groups into one running order, which is what the reel traverses. */
export interface FlatFrame {
  src: string
  /** Index into the PhaseGroup array, not into PHASES. */
  groupIndex: number
  /** Index within that group's own images. */
  imageIndex: number
}

export function flattenPhases(groups: PhaseGroup[]): FlatFrame[] {
  return groups.flatMap((group, groupIndex) =>
    group.images.map((src, imageIndex) => ({ src, groupIndex, imageIndex }))
  )
}
