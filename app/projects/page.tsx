import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Projects',
  description: `Selected project work by ${siteConfig.name} across commercial, industrial, wellness, warehousing, office, and real estate sectors in Thailand.`,
}

const projects = [
  {
    number: '01',
    title: 'The Yard Bangkok',
    subtitle: 'Mixed-Use Commercial Development',
    sector: 'Commercial',
    location: 'Sukhumvit Soi 36, Bangkok',
    scope: '3,800 sqm across 4 levels, 8 retail and F&B tenants',
    role: 'Development Management',
    brief:
      'Owner-driven mixed-use development with multiple tenant configurations, shared infrastructure, and phased delivery across two wings. TMPC coordinated the architect, MEP consultants, main contractor, and individual tenant fit-out teams throughout the full build programme.',
    deliverables: ['Architect and consultant coordination', 'Tenant fit-out management', 'Programme and milestone oversight', 'Operational readiness and handover'],
    image: '/images/scenario-commercial.jpg',
  },
  {
    number: '02',
    title: 'Mitsui Rayong Expansion',
    subtitle: 'Industrial Production Facility Expansion',
    sector: 'Industrial',
    location: 'Map Ta Phut Industrial Estate, Rayong',
    scope: '5,600 sqm factory floor extension, clean room addition, utility upgrades',
    role: 'Project Coordination + Execution Oversight',
    brief:
      'Complex industrial expansion requiring coordination between Japanese investor standards, Thai regulatory requirements, and local contractors. TMPC managed all party communication, RFI flows, authority submissions, and on-site execution oversight from planning through commissioning.',
    deliverables: ['Multi-party and authority coordination', 'RFI and instruction management', 'Site execution oversight', 'Commissioning and handover coordination'],
    image: '/images/scenario-industrial.jpg',
  },
  {
    number: '03',
    title: 'Aura Wellness Phuket',
    subtitle: 'Boutique Wellness and Spa Resort',
    sector: 'Wellness',
    location: 'Cherngtalay, Phuket',
    scope: '14 treatment rooms, 6 villas, spa facility, pool and landscape',
    role: 'Full Development Management',
    brief:
      'International wellness brand entering Thailand required a local development management partner operating to international project standards. TMPC managed all consultants, contractors, FF&E procurement, and operational setup from concept approval through soft opening.',
    deliverables: ['Design and consultant coordination', 'International brand compliance management', 'Contractor procurement and oversight', 'Operational setup and pre-opening coordination'],
    image: '/images/scenario-wellness.jpg',
  },
  {
    number: '04',
    title: 'Regional Distribution Hub',
    subtitle: 'Logistics and Warehousing Facility',
    sector: 'Warehousing',
    location: 'Bangpoo Industrial Estate, Samut Prakan',
    scope: '11,200 sqm high-bay warehouse, racking fit-out, dock levellers, office mezzanine',
    role: 'Project Consulting + Operational Setup',
    brief:
      'Logistics client expanding regional distribution capacity across Southeast Asia. TMPC provided project consulting through tender and procurement, fit-out oversight, and post-construction operational setup coordination to ensure day-one readiness.',
    deliverables: ['Feasibility and scope definition', 'Procurement and tender coordination', 'Fit-out execution oversight', 'Operational readiness planning and handover'],
    image: '/images/scenario-warehouse.jpg',
  },
  {
    number: '05',
    title: 'One Silom Office Fit-Out',
    subtitle: 'Corporate Office Fit-Out Programme',
    sector: 'Office',
    location: 'Silom, Bangkok',
    scope: '1,600 sqm full-floor office fit-out for an international legal practice',
    role: 'Project Consulting + Coordination',
    brief:
      'International law firm establishing Bangkok presence required a fit-out programme aligned to firm standards and a firm operational date. TMPC coordinated interior design, MEP works, IT and AV infrastructure, furniture procurement, and all landlord interfaces.',
    deliverables: ['Scope definition and project brief', 'Interior and MEP coordination', 'IT and AV integration management', 'Landlord and building management interface'],
    image: '/images/scenario-office.jpg',
  },
  {
    number: '06',
    title: 'Laguna Park Villa Renovation',
    subtitle: 'Luxury Villa Renovation Programme',
    sector: 'Real Estate',
    location: 'Bang Tao, Phuket',
    scope: '8 luxury villas, full renovation and landscaping upgrade, phased delivery',
    role: 'Development Management',
    brief:
      'Foreign investor portfolio requiring coordinated renovation across 8 units while managing ongoing rental occupancy and owner expectations from overseas. TMPC structured the phased programme, coordinated contractors and suppliers, and maintained owner reporting throughout.',
    deliverables: ['Phased programme management', 'Contractor and supplier coordination', 'Scope and cost tracking', 'Owner communication and reporting'],
    image: '/images/scenario-realestate.jpg',
  },
]

export default function ProjectsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-canvas-dark py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Projects
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-white leading-[1.08] tracking-tight mb-8 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Selected Work
            </h1>
            <p
              className="text-lg text-white/55 leading-relaxed max-w-2xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              TMPC has supported commercial, industrial, wellness, logistics, office, and residential projects across Bangkok and Thailand. The following represent the scope and type of work we manage.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS: editorial alternating layout */}
      <section className="bg-canvas">
        {projects.map((project, i) => (
          <FadeIn key={project.number} delay={80}>
            <div className={`grid lg:grid-cols-2 border-b border-line ${i === 0 ? '' : ''}`}>

              {/* Image panel */}
              <div
                className={`relative overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}
                style={{ minHeight: '480px' }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#0A1628]/30" />
                {/* Project number: large faded */}
                <div className="absolute top-6 left-7">
                  <span className="font-display font-bold text-[5rem] text-white/10 leading-none select-none">
                    {project.number}
                  </span>
                </div>
                {/* Sector badge */}
                <div className="absolute bottom-7 left-7">
                  <span className="text-[0.58rem] font-bold text-accent uppercase tracking-[0.25em] border border-accent/40 bg-[#0A1628]/70 px-3 py-1.5">
                    {project.sector}
                  </span>
                </div>
              </div>

              {/* Details panel */}
              <div
                className={`flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 bg-canvas ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[0.58rem] font-bold text-accent uppercase tracking-[0.2em]">
                    {project.number}
                  </span>
                  <div className="flex-1 h-px bg-line" />
                  <span className="text-[0.58rem] text-ink-muted uppercase tracking-[0.15em]">
                    {project.location}
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight leading-snug mb-2">
                  {project.title}
                </h2>
                <p className="text-sm text-ink-muted mb-1">{project.subtitle}</p>
                <p className="text-[0.65rem] text-ink-muted uppercase tracking-[0.15em] mb-7">{project.scope}</p>

                <p className="text-sm text-ink-secondary leading-relaxed mb-8">{project.brief}</p>

                <div className="mb-8">
                  <p className="text-[0.58rem] font-bold text-accent uppercase tracking-[0.2em] mb-3">
                    Key Deliverables
                  </p>
                  <ul className="space-y-2">
                    {project.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-ink-muted">
                        <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-line">
                  <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold text-ink uppercase tracking-[0.15em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    TMPC Role: {project.role}
                  </span>
                </div>
              </div>

            </div>
          </FadeIn>
        ))}
      </section>

      {/* SECTOR STRIP */}
      <section className="bg-canvas-subtle border-b border-line py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-0 divide-x divide-line">
            {['Commercial', 'Industrial', 'Wellness', 'Warehousing', 'Office', 'Real Estate', 'Hospitality'].map((s, i) => (
              <span
                key={s}
                className={`text-[0.62rem] font-semibold text-ink-muted uppercase tracking-[0.2em] px-5 ${i === 0 ? 'pl-0' : ''}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas-dark py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Start a Conversation
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Discuss Your Project
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            Every project is different. Get in touch to arrange an initial consultation with TMPC.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold bg-accent text-white px-8 py-4 hover:bg-accent-dark transition-colors duration-200"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/services"
              className="text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors duration-150"
            >
              Our Services <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
