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

/** The engagement from first conversation to opening day. */
export const PROCESS: ProcessStep[] = [
  {
    title: 'Brief and feasibility',
    when: 'Before you commit',
    description:
      'We define scope, budget and structure with you, and test the plan against how projects actually run in Thailand.',
    services: 'Project Consulting',
  },
  {
    title: 'Team and procurement',
    when: 'Before design and tender',
    description:
      'We help select consultants and contractors, check every quote against scope and market, and negotiate on your behalf.',
    services: 'Development Management',
  },
  {
    title: 'Design and approvals',
    when: 'During design',
    description:
      'We run the coordination between designers, engineers and authorities, so decisions, permits and documents keep moving.',
    services: 'Project Coordination',
  },
  {
    title: 'Construction',
    when: 'On site',
    description:
      'We are on site through execution: progress tracked against plan, issues resolved before they grow, and a clear report to you.',
    services: 'Execution Oversight',
  },
  {
    title: 'Handover and opening',
    when: 'Before opening day',
    description:
      'We coordinate vendors, systems and handover so the building is ready to operate, not only finished.',
    services: 'Operational Setup',
  },
]
