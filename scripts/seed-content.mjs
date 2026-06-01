// One-time seed: move the previously hardcoded Services (app/services/page.tsx)
// and Team / Leadership (app/about/page.tsx) into the Supabase `services` and
// `team_members` tables so they appear in the admin and drive the public site.
//
// Idempotent: skips rows that already exist (services by title, team by name).
// Run with: node scripts/seed-content.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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

const services = [
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
      'Communication between five parties across two languages produces confusion and delay. TMPC manages all coordination: meetings, instructions, approvals, and documentation, so the project moves without constant client intervention.',
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
]

const team = [
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
]

async function main() {
  let s = 0
  for (let i = 0; i < services.length; i++) {
    const svc = services[i]
    const existing = await rest(`services?select=id&title=eq.${encodeURIComponent(svc.title)}`)
    if (existing.length) {
      console.log(`• skip service (exists): ${svc.title}`)
      continue
    }
    await rest('services', {
      method: 'POST',
      body: JSON.stringify({ ...svc, display_order: i + 1, active: true }),
    })
    s++
    console.log(`✓ service: ${svc.title}`)
  }

  let t = 0
  for (let i = 0; i < team.length; i++) {
    const member = team[i]
    const existing = await rest(`team_members?select=id&name=eq.${encodeURIComponent(member.name)}`)
    if (existing.length) {
      console.log(`• skip team (exists): ${member.name}`)
      continue
    }
    await rest('team_members', {
      method: 'POST',
      body: JSON.stringify({ ...member, display_order: i + 1, active: true }),
    })
    t++
    console.log(`✓ team: ${member.name}`)
  }

  console.log(`\nDone. ${s} services, ${t} team members created.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
