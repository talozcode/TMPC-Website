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

/**
 * A project photograph is real only if it was uploaded to Supabase Storage.
 * Some seeded rows still point at the stock stand-ins in public/images
 * (scenario-*.jpg); the public site never shows those (05/11/2026, no stock
 * photography). The rows are left untouched; they are filtered at render.
 */
export function isRealProjectImage(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//.test(url)
}

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
 * Returns an empty array when a project has no real photographs (stock
 * stand-ins are dropped), and callers then lay the project out without an image.
 */
export function toPhaseGroups(images: PhaseInput[] | null | undefined): PhaseGroup[] {
  const buckets: Record<ProjectPhase, PhaseInput[]> = {
    rendering: [],
    in_progress: [],
    completed: [],
  }
  for (const image of images ?? []) {
    if (isRealProjectImage(image.url)) buckets[coercePhase(image.phase)].push(image)
  }

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

  return groups
}

/**
 * The phase a viewer should land on by default: the most advanced one that
 * actually has images. Used by the phase tabs (which phase opens first) and by
 * pickLeadImage (which photograph represents the project), so both agree.
 */
export function initialPhase(groups: PhaseGroup[]): ProjectPhase {
  return groups[groups.length - 1]?.phase ?? 'completed'
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
  return groups[groups.length - 1]?.images[0] ?? null
}
