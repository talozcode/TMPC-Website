// One-time seed: move the previously hardcoded projects (from
// components/projects-gallery.tsx) into the Supabase `projects` +
// `project_images` tables so they appear in the admin and drive the public site.
//
// Idempotent: skips any project whose title already exists.
// Run with: node scripts/seed-projects.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// --- read env from .env.local ---
const env = Object.fromEntries(
  readFileSync(path.join(root, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) throw new Error('Missing Supabase env in .env.local')

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

async function rest(p, init = {}) {
  const res = await fetch(`${URL}/rest/v1/${p}`, { ...init, headers: { ...headers, ...init.headers } })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${p}: ${text}`)
  return text ? JSON.parse(text) : null
}

const img = (name) => `/images/scenario-${name}.jpg`

const projects = [
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
    images: [img('commercial'), img('office'), img('wellness')],
  },
  {
    title: 'Mitsui Rayong Expansion',
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
    images: [img('industrial'), img('warehouse'), img('commercial')],
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
    images: [img('wellness'), img('realestate'), img('commercial')],
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
    images: [img('warehouse'), img('industrial'), img('office')],
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
    images: [img('office'), img('commercial'), img('realestate')],
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
    images: [img('realestate'), img('wellness'), img('office')],
  },
  {
    title: 'Khon Kaen Community Hub',
    subtitle: 'Community Sports and Recreation Facility',
    category: 'Community',
    location: 'Mueang District, Khon Kaen',
    scope: '6,200 sqm multi-sport facility, outdoor courts, community hall, parking',
    role: 'Development Management + Execution Oversight',
    brief:
      'Municipal-backed community facility requiring coordination between government stakeholders, local contractors, and community representatives. TMPC managed planning approvals, contractor procurement, and full execution oversight across a phased build programme.',
    deliverables: [
      'Government stakeholder liaison',
      'Contractor procurement and oversight',
      'Community representative coordination',
      'Phased execution and handover',
    ],
    images: [img('commercial'), img('warehouse'), img('industrial')],
  },
]

async function main() {
  const categories = await rest('categories?select=id,name')
  const catId = Object.fromEntries(categories.map((c) => [c.name, c.id]))

  let created = 0
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    const existing = await rest(`projects?select=id&title=eq.${encodeURIComponent(p.title)}`)
    if (existing.length) {
      console.log(`• skip (exists): ${p.title}`)
      continue
    }

    const [row] = await rest('projects', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        title: p.title,
        slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        subtitle: p.subtitle,
        category_id: catId[p.category] ?? null,
        location: p.location,
        scope: p.scope,
        role: p.role,
        brief: p.brief,
        deliverables: p.deliverables,
        display_order: i + 1,
        published: true,
      }),
    })

    await rest('project_images', {
      method: 'POST',
      body: JSON.stringify(
        p.images.map((url, j) => ({
          project_id: row.id,
          url,
          // static assets bundled in /public, not in Supabase storage
          storage_path: url.replace(/^\//, ''),
          display_order: j,
          is_primary: j === 0,
        }))
      ),
    })

    created++
    console.log(`✓ created: ${p.title} (${p.images.length} images)`)
  }

  console.log(`\nDone. ${created} created, ${projects.length - created} skipped.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
