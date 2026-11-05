import type { Service } from '@/lib/types'
import type { ProcessStep } from '@/components/sections/process-timeline'

/** Stable in-page anchor for a service, from its title. */
export function serviceSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\bsupport\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** The two services TMPC leads with, in the order they are shown. */
const CORE = ['development management', 'execution oversight']

export function isCore(s: Pick<Service, 'title'>) {
  return CORE.some((c) => s.title.toLowerCase().includes(c))
}

/** Core first (in CORE order), then the rest in their admin order. */
export function orderServices(services: Service[]) {
  const core = CORE.map((c) => services.find((s) => s.title.toLowerCase().includes(c))).filter(
    (s): s is Service => Boolean(s)
  )
  return { core, rest: services.filter((s) => !isCore(s)) }
}

const IMAGES: Record<string, { src: string; alt: string }> = {
  'development-management': { src: '/images/scenario-realestate.jpg', alt: 'Completed residential towers against the sky' },
  'execution-oversight': { src: '/images/scenario-warehouse.jpg', alt: 'Tower cranes over a building site at dusk' },
  'project-consulting': { src: '/images/hero-services.jpg', alt: 'A finished office corridor with glass partitions' },
  'project-coordination': { src: '/images/scenario-commercial.jpg', alt: 'A completed office lounge with city views' },
  'operational-setup': { src: '/images/scenario-wellness.jpg', alt: 'A resort pool among palms and limestone hills in Thailand' },
}

export function serviceImage(title: string) {
  return IMAGES[serviceSlug(title)] ?? IMAGES['project-coordination']
}

/** The engagement from first conversation to opening day. */
export const PROCESS: ProcessStep[] = [
  {
    title: 'Brief and feasibility',
    when: 'Before you commit',
    description:
      'We define scope, budget and structure with you, and test the plan against how projects actually run in Thailand.',
    services: 'Project Consulting',
    image: { src: '/images/process/process-brief.jpg', alt: 'A white massing model of a building among balsa trees' },
  },
  {
    title: 'Team and procurement',
    when: 'Before design and tender',
    description:
      'We help select consultants and contractors, check every quote against scope and market, and negotiate on your behalf.',
    services: 'Development Management',
    image: { src: '/images/process/process-team.jpg', alt: 'Stone, terrazzo and fabric samples laid out on a table' },
  },
  {
    title: 'Design and approvals',
    when: 'During design',
    description:
      'We run the coordination between designers, engineers and authorities, so decisions, permits and documents keep moving.',
    services: 'Project Coordination',
    image: { src: '/images/process/process-design.jpg', alt: 'Hands drafting a drawing with a scale ruler' },
  },
  {
    title: 'Construction',
    when: 'On site',
    description:
      'We are on site through execution: progress tracked against plan, issues resolved before they grow, and a clear report to you.',
    services: 'Execution Oversight',
    image: { src: '/images/process/process-construction.jpg', alt: 'A site team tying a rebar column on a concrete deck, seen from above' },
  },
  {
    title: 'Handover and opening',
    when: 'Before opening day',
    description:
      'We coordinate vendors, systems and handover so the building is ready to operate, not only finished.',
    services: 'Operational Setup',
    image: { src: '/images/process/process-handover.jpg', alt: 'A finished hotel lobby in warm light, ready to open' },
  },
]
