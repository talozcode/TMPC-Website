/**
 * Every before/after placement on the site, in one place. Each section reads
 * its photographs, alt text, labels and copy from here, so swapping a photo or
 * rewriting a line is a one-file edit.
 *
 * Plain data only (strings and numbers), so any of it can be passed straight
 * from a server component into a client compare variant.
 *
 * The photographs in public/images/compare/ are stand-ins copied from the
 * stock library. Replace a file in place (same name, same aspect ratio as the
 * other half of its pair) and nothing else needs to change.
 *
 * A heading is split into `lead` and `em`: the page renders it as
 * `{lead} <em>{em}</em>`, the light cut used in every v3 headline.
 */

export interface CompareImage {
  src: string
  alt: string
}

export interface CompareHeading {
  lead: string
  em: string
}

const DIR = '/images/compare'

export const COMPARE = {
  /** Home, "From site to opening". Fallback when /admin/hero has no images. 3:2. */
  home: {
    before: { src: `${DIR}/home-before.jpg`, alt: 'A bare concrete hall with arched windows, before fit-out' },
    after: { src: `${DIR}/home-after.jpg`, alt: 'A finished lounge with glass walls looking onto trees' },
    labels: { before: 'Before', after: 'After' },
    heading: { lead: 'From site', em: 'to opening.' },
    hint: 'Drag to compare',
  },

  /** Services, Development Management article. Floors rising (TransformFloors), 16:9. */
  'services-dm': {
    before: { src: `${DIR}/services-dm-before.jpg`, alt: 'A tower wrapped in scaffolding during construction' },
    after: { src: `${DIR}/services-dm-after.jpg`, alt: 'Two completed residential towers, seen from below' },
    labels: { before: 'Before TMPC', after: 'After TMPC' },
  },

  /** Services, Execution Oversight article. Floors rising (TransformFloors), 16:9. */
  'services-eo': {
    before: { src: `${DIR}/services-eo-before.jpg`, alt: 'Tower cranes over a building frame under construction' },
    after: { src: `${DIR}/services-eo-after.jpg`, alt: 'A completed glass office tower, seen from below' },
    labels: { before: 'On site', after: 'Handed over' },
  },

  /** About, pinned scroll-scrubbed wipe between the dark band and "Our approach". 16:9. */
  'about-scrub': {
    before: { src: `${DIR}/about-scrub-before.jpg`, alt: 'An empty concrete floor plate with scaffolding, on day one' },
    after: { src: `${DIR}/about-scrub-after.jpg`, alt: 'A fitted-out office lounge, in operation' },
    labels: { before: 'Day 1', after: 'Opening day' },
    heading: { lead: 'From empty shell', em: 'to operating site.' },
    /** Illustrative only: the readout counts from Day 1 up to this, then shows "Opening day". */
    days: 240,
    captions: {
      early: 'Scope, budget and the team are fixed before anything is built.',
      late: 'Every trade is coordinated to one programme, through to opening day.',
    },
  },

  /** About, "Our approach". Survey grid developing (TransformGrid), 4:5. */
  'about-lens': {
    before: { src: `${DIR}/about-lens-before.jpg`, alt: 'An aerial view of a cleared site with a crane, before the build' },
    after: { src: `${DIR}/about-lens-after.jpg`, alt: 'An aerial view of a finished resort pool among trees' },
    labels: { before: 'Before', after: 'After' },
  },

  /** Projects page, "Transformations" strip between the hero and the gallery. Each card 4:5, wiped by the scroll (CompareCard). */
  projects: {
    heading: { lead: 'Before TMPC,', em: 'and after.' },
    cards: [
      {
        id: 'projects-commercial',
        sector: 'Commercial',
        location: 'Silom, Bangkok',
        title: 'Office fit-out, delivered floor by floor',
        before: { src: `${DIR}/projects-commercial-before.jpg`, alt: 'An interior stripped back to metal studs during fit-out' },
        after: { src: `${DIR}/projects-commercial-after.jpg`, alt: 'The finished lobby with seating and a feature installation' },
      },
      {
        id: 'projects-hospitality',
        sector: 'Hospitality',
        location: 'Cherngtalay, Phuket',
        title: 'A wellness resort, opened on programme',
        before: { src: `${DIR}/projects-hospitality-before.jpg`, alt: 'An aerial view of the resort buildings under construction' },
        after: { src: `${DIR}/projects-hospitality-after.jpg`, alt: 'An aerial view of the finished beachfront resort' },
      },
      {
        id: 'projects-residential',
        sector: 'Residential',
        location: 'Bang Tao, Phuket',
        title: 'A renovation kept to scope and budget',
        before: { src: `${DIR}/projects-residential-before.jpg`, alt: 'A concrete house frame with bamboo scaffolding' },
        after: { src: `${DIR}/projects-residential-after.jpg`, alt: 'The finished modern house with timber screens' },
      },
    ],
  },

  /**
   * Project detail page, "Rendering to completion": the three-column phase
   * gallery (components/ui/animated-gallery.tsx), one column per stage, left to
   * right. Shared by every project for now. Any number of photos per stage; the
   * second in each column sits in the middle of the screen, so lead with it.
   */
  'project-phases': {
    heading: { lead: 'Rendering', em: 'to completion.' },
    rendering: [
      { src: '/images/process/process-brief.jpg', alt: 'A white architectural model of the scheme, with model trees' },
      { src: `${DIR}/project-phase-rendering.jpg`, alt: 'An architect rendering of a mixed-use tower at dusk' },
      { src: '/images/process/process-design.jpg', alt: 'Drawings being marked up with a scale rule on a desk' },
    ],
    in_progress: [
      { src: `${DIR}/projects-hospitality-before.jpg`, alt: 'An aerial view of building frames going up on site' },
      { src: `${DIR}/project-phase-in-progress.jpg`, alt: 'A high-rise frame under construction, with tower cranes' },
      { src: `${DIR}/services-dm-before.jpg`, alt: 'A long building wrapped in scaffolding' },
    ],
    completed: [
      { src: `${DIR}/services-eo-after.jpg`, alt: 'A completed glass office tower, seen from below' },
      { src: `${DIR}/project-phase-completed.jpg`, alt: 'The completed residential tower' },
      { src: `${DIR}/projects-residential-after.jpg`, alt: 'A finished modern house with timber screens' },
    ],
  },

  /** Closing CTA band on every page. Louvres turning behind the text (TransformLouvres). 16:9, shown at low opacity. */
  cta: {
    before: { src: `${DIR}/cta-before.jpg`, alt: '' },
    after: { src: `${DIR}/cta-after.jpg`, alt: '' },
  },
} as const
