'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FadeIn } from '@/components/fade-in'

const CATEGORIES = ['All', 'Residential', 'Hospitality', 'Commercial', 'Industrial', 'Community'] as const
type Category = (typeof CATEGORIES)[number]

const projects = [
  {
    number: '01',
    title: 'The Yard Bangkok',
    subtitle: 'Mixed-Use Commercial Development',
    category: 'Commercial' as Category,
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
    images: [
      '/images/scenario-commercial.jpg',
      '/images/scenario-office.jpg',
      '/images/scenario-wellness.jpg',
    ],
  },
  {
    number: '02',
    title: 'Mitsui Rayong Expansion',
    subtitle: 'Industrial Production Facility Expansion',
    category: 'Industrial' as Category,
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
    images: [
      '/images/scenario-industrial.jpg',
      '/images/scenario-warehouse.jpg',
      '/images/scenario-commercial.jpg',
    ],
  },
  {
    number: '03',
    title: 'Aura Wellness Phuket',
    subtitle: 'Boutique Wellness and Spa Resort',
    category: 'Hospitality' as Category,
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
    images: [
      '/images/scenario-wellness.jpg',
      '/images/scenario-realestate.jpg',
      '/images/scenario-commercial.jpg',
    ],
  },
  {
    number: '04',
    title: 'Regional Distribution Hub',
    subtitle: 'Logistics and Warehousing Facility',
    category: 'Industrial' as Category,
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
    images: [
      '/images/scenario-warehouse.jpg',
      '/images/scenario-industrial.jpg',
      '/images/scenario-office.jpg',
    ],
  },
  {
    number: '05',
    title: 'One Silom Office Fit-Out',
    subtitle: 'Corporate Office Fit-Out Programme',
    category: 'Commercial' as Category,
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
    images: [
      '/images/scenario-office.jpg',
      '/images/scenario-commercial.jpg',
      '/images/scenario-realestate.jpg',
    ],
  },
  {
    number: '06',
    title: 'Laguna Park Villa Renovation',
    subtitle: 'Luxury Villa Renovation Programme',
    category: 'Residential' as Category,
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
    images: [
      '/images/scenario-realestate.jpg',
      '/images/scenario-wellness.jpg',
      '/images/scenario-office.jpg',
    ],
  },
  {
    number: '07',
    title: 'Khon Kaen Community Hub',
    subtitle: 'Community Sports and Recreation Facility',
    category: 'Community' as Category,
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
    images: [
      '/images/scenario-commercial.jpg',
      '/images/scenario-warehouse.jpg',
      '/images/scenario-industrial.jpg',
    ],
  },
]

export function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})

  const filtered =
    activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)

  function selectImage(number: string, index: number) {
    setActiveImages((prev) => ({ ...prev, [number]: index }))
  }

  return (
    <>
      {/* Category filter bar */}
      <div className="bg-canvas border-b border-line sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[0.62rem] font-semibold uppercase tracking-[0.2em] px-4 py-2 border transition-colors duration-150 ${
                  activeCategory === cat
                    ? 'bg-accent text-white border-accent'
                    : 'text-ink-muted border-line hover:border-accent/50 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects list */}
      <section className="bg-canvas">
        {filtered.map((project, i) => {
          const imgIdx = activeImages[project.number] ?? 0
          return (
            <FadeIn key={`${activeCategory}-${project.number}`} delay={i * 60}>
              <div className="grid lg:grid-cols-2 border-b border-line">

                {/* Image panel */}
                <div className={`flex flex-col ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {/* Main image */}
                  <div className="relative overflow-hidden flex-1" style={{ minHeight: '380px' }}>
                    <Image
                      src={project.images[imgIdx]}
                      alt={project.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[#0A1628]/30" />
                    <div className="absolute top-6 left-7">
                      <span className="font-display font-bold text-[5rem] text-white/10 leading-none select-none">
                        {project.number}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-6">
                      <span className="text-[0.58rem] font-bold text-accent uppercase tracking-[0.25em] border border-accent/40 bg-[#0A1628]/70 px-3 py-1.5">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div className="flex gap-1.5 p-2.5 bg-canvas-dark flex-shrink-0 overflow-x-auto">
                    {project.images.map((img, j) => {
                      const isActive = imgIdx === j
                      return (
                        <button
                          key={j}
                          onClick={() => selectImage(project.number, j)}
                          aria-label={`View photo ${j + 1} of ${project.title}`}
                          className={`relative flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-all duration-200 ${
                            isActive
                              ? 'border-accent'
                              : 'border-white/10 hover:border-white/40 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Details panel */}
                <div
                  className={`flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-14 bg-canvas ${
                    i % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-5">
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
                  <p className="text-[0.65rem] text-ink-muted uppercase tracking-[0.15em] mb-6">
                    {project.scope}
                  </p>

                  <p className="text-sm text-ink-secondary leading-relaxed mb-7">{project.brief}</p>

                  <div className="mb-7">
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

                  <div className="pt-5 border-t border-line">
                    <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold text-ink uppercase tracking-[0.15em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      TMPC Role: {project.role}
                    </span>
                  </div>
                </div>

              </div>
            </FadeIn>
          )
        })}
      </section>

      {/* CTA */}
      <section className="bg-canvas-dark py-10 lg:py-14">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Start a Conversation
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-[2.5rem] text-white tracking-tight leading-tight mb-5">
            Discuss Your Project
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            Tell us what you are planning. We will give you an honest picture of what it takes to
            deliver it in Thailand.
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
