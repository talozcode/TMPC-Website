/**
 * Local preview content, used only when Supabase is not configured (no
 * .env.local, as on a fresh checkout). It mirrors what scripts/seed-content.mjs
 * and scripts/seed-projects.mjs put into the database, so a local copy of the
 * site renders its real structure instead of empty sections and a seven second
 * wait on every page while the client retries a missing host.
 *
 * Production always reads Supabase. Nothing here is ever shown when the env
 * vars are set.
 */
import type { Category, Project, ProjectImage, Service, TeamMember } from '@/lib/types'

const NOW = '2026-01-01T00:00:00.000Z'

export const fallbackServices: Service[] = [
  {
    number: '01',
    title: 'Project Consulting',
    description:
      'Most projects fail before construction starts. The first weeks set the scope, budget, and coordination structure. Get those wrong and the project never recovers. We get them right before any commitment is made.',
    scope_items: [
      'Project planning support',
      'Feasibility discussions',
      'Scope definition',
      'Coordination strategy',
      'Budget alignment',
      'Project structure planning',
      'Consultant identification support',
    ],
  },
  {
    number: '02',
    title: 'Development Management',
    description:
      'Most projects have an owner, an architect, and a contractor with no one managing the relationship between all three. TMPC fills that gap. We oversee the full development process, keep every party accountable, and report clearly to you.',
    scope_items: [
      'Development coordination',
      'Stakeholder management',
      'Planning oversight',
      'Consultant coordination',
      'Timeline supervision',
      'Reporting support',
      'Budget monitoring',
    ],
  },
  {
    number: '03',
    title: 'Project Coordination',
    description:
      'Communication between multiple parties across two languages produces confusion and delay. TMPC manages all coordination: meetings, instructions, approvals, and documentation, so the project moves without constant client intervention.',
    scope_items: [
      'Communication management',
      'Coordination meetings',
      'Workflow organization',
      'Vendor coordination',
      'Supplier sourcing support',
      'Information flow management',
      'Project updates and reporting',
    ],
  },
  {
    number: '04',
    title: 'Execution Oversight',
    description:
      'Decisions made on site without oversight become expensive surprises later. TMPC maintains a consistent presence during execution, monitors progress against plan, resolves issues before they escalate, and keeps the owner informed throughout.',
    scope_items: [
      'Site coordination',
      'Timeline tracking',
      'Progress reporting',
      'Issue coordination',
      'Execution monitoring',
      'Contractor communication support',
      'Operational alignment',
    ],
  },
  {
    number: '05',
    title: 'Operational Setup Support',
    description:
      'Most projects finish construction without being ready to operate. We coordinate the final phase: vendor selection, system commissioning, staff preparation, and handover so the transition from project to operation is managed, not improvised.',
    scope_items: [
      'Operational planning support',
      'Vendor setup coordination',
      'Workflow planning',
      'Facility preparation',
      'Operational coordination',
      'Technology and system coordination support',
    ],
  },
].map((s, i) => ({ ...s, id: `svc-${i}`, display_order: i + 1, active: true, created_at: NOW }))

export const fallbackTeam: TeamMember[] = [
  {
    name: 'Tom',
    role_title: 'Managing Partner',
    description:
      'Focused on project planning, coordination, execution oversight, and business development across commercial, industrial, hospitality, and real estate projects.',
  },
  {
    name: 'Tal',
    role_title: 'Operations & Technology Partner',
    description:
      'Focused on operations, technology implementation, workflow systems, and coordination infrastructure for projects across Thailand.',
  },
].map((m, i) => ({ ...m, id: `team-${i}`, display_order: i + 1, active: true, created_at: NOW }))

const CATEGORY_NAMES = ['Commercial', 'Industrial', 'Hospitality', 'Residential', 'Community']

export const fallbackCategories: Category[] = CATEGORY_NAMES.map((name, i) => ({
  id: `cat-${i}`,
  name,
  slug: name.toLowerCase(),
  display_order: i + 1,
  created_at: NOW,
}))

const img = (name: string) => `/images/scenario-${name}.jpg`
const proj = (name: string) => `/images/projects/${name}.jpg`

const projectSeed = [
  {
    title: 'The Yard Bangkok',
    subtitle: 'Mixed-Use Commercial Development',
    category: 'Commercial',
    location: 'Sukhumvit Soi 36, Bangkok',
    scope: '3,800 sqm across 4 levels, 8 retail and F&B tenants',
    role: 'Development Management',
    brief:
      'Owner-driven mixed-use development with multiple tenant configurations, shared infrastructure, and phased delivery across two wings. TMPC coordinated the architect, MEP consultants, main contractor, and individual tenant fit-out teams throughout the full build programme.',
    deliverables: [
      'Architect and consultant coordination',
      'Tenant fit-out management',
      'Programme and milestone oversight',
      'Operational readiness and handover',
    ],
    images: [proj('mixed-use-bangkok'), img('commercial')],
  },
  {
    title: 'Rayong Facility Expansion',
    subtitle: 'Industrial Production Facility Expansion',
    category: 'Industrial',
    location: 'Map Ta Phut Industrial Estate, Rayong',
    scope: '5,600 sqm factory floor extension, clean room addition, utility upgrades',
    role: 'Project Coordination + Execution Oversight',
    brief:
      'Complex industrial expansion requiring coordination between Japanese investor standards, Thai regulatory requirements, and local contractors. TMPC managed all party communication, RFI flows, authority submissions, and on-site execution oversight from planning through commissioning.',
    deliverables: [
      'Multi-party and authority coordination',
      'RFI and instruction management',
      'Site execution oversight',
      'Commissioning and handover coordination',
    ],
    images: [proj('factory'), img('warehouse')],
  },
  {
    title: 'Aura Wellness Phuket',
    subtitle: 'Boutique Wellness and Spa Resort',
    category: 'Hospitality',
    location: 'Cherngtalay, Phuket',
    scope: '14 treatment rooms, 6 villas, spa facility, pool and landscape',
    role: 'Full Development Management',
    brief:
      'International wellness brand entering Thailand required a local development management partner operating to international project standards. TMPC managed all consultants, contractors, FF&E procurement, and operational setup from concept approval through soft opening.',
    deliverables: [
      'Design and consultant coordination',
      'International brand compliance management',
      'Contractor procurement and oversight',
      'Operational setup and pre-opening coordination',
    ],
    images: [img('wellness'), proj('spa')],
  },
  {
    title: 'Regional Distribution Hub',
    subtitle: 'Logistics and Warehousing Facility',
    category: 'Industrial',
    location: 'Bangpoo Industrial Estate, Samut Prakan',
    scope: '11,200 sqm high-bay warehouse, racking fit-out, dock levellers, office mezzanine',
    role: 'Project Consulting + Operational Setup',
    brief:
      'Logistics client expanding regional distribution capacity across Southeast Asia. TMPC provided project consulting through tender and procurement, fit-out oversight, and post-construction operational setup coordination to ensure day-one readiness.',
    deliverables: [
      'Feasibility and scope definition',
      'Procurement and tender coordination',
      'Fit-out execution oversight',
      'Operational readiness planning and handover',
    ],
    images: [proj('warehouse')],
  },
  {
    title: 'One Silom Office Fit-Out',
    subtitle: 'Corporate Office Fit-Out Programme',
    category: 'Commercial',
    location: 'Silom, Bangkok',
    scope: '1,600 sqm full-floor office fit-out for an international legal practice',
    role: 'Project Consulting + Coordination',
    brief:
      'International law firm establishing Bangkok presence required a fit-out programme aligned to firm standards and a firm operational date. TMPC coordinated interior design, MEP works, IT and AV infrastructure, furniture procurement, and all landlord interfaces.',
    deliverables: [
      'Scope definition and project brief',
      'Interior and MEP coordination',
      'IT and AV integration management',
      'Landlord and building management interface',
    ],
    images: [proj('office-fitout'), img('office')],
  },
  {
    title: 'Laguna Park Villa Renovation',
    subtitle: 'Luxury Villa Renovation Programme',
    category: 'Residential',
    location: 'Bang Tao, Phuket',
    scope: '8 luxury villas, full renovation and landscaping upgrade, phased delivery',
    role: 'Development Management',
    brief:
      'Foreign investor portfolio requiring coordinated renovation across 8 units while managing ongoing rental occupancy and owner expectations from overseas. TMPC structured the phased programme, coordinated contractors and suppliers, and maintained owner reporting throughout.',
    deliverables: [
      'Phased programme management',
      'Contractor and supplier coordination',
      'Scope and cost tracking',
      'Owner communication and reporting',
    ],
    images: [proj('villa'), proj('villa-works')],
  },
]

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const fallbackProjects: Project[] = projectSeed.map((p, i) => {
  const id = `proj-${i}`
  const category = fallbackCategories.find((c) => c.name === p.category) ?? null
  const project_images: ProjectImage[] = p.images.map((url, j) => ({
    id: `${id}-img-${j}`,
    project_id: id,
    storage_path: url.replace(/^\//, ''),
    url,
    display_order: j,
    is_primary: j === 0,
    phase: 'completed',
    created_at: NOW,
  }))
  return {
    id,
    title: p.title,
    subtitle: p.subtitle,
    category_id: category?.id ?? null,
    location: p.location,
    scope: p.scope,
    role: p.role,
    brief: p.brief,
    deliverables: p.deliverables,
    display_order: i + 1,
    published: true,
    created_at: NOW,
    updated_at: NOW,
    slug: slugify(p.title),
    category,
    project_images,
  }
})
