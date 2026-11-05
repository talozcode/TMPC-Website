'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { ProjectImageStage } from '@/components/project-image-stage'
import type { PhaseGroup } from '@/lib/project-phases'

export interface GalleryProject {
  id: string
  number: string
  title: string
  subtitle: string
  category: string
  location: string
  scope: string
  role: string
  brief: string
  deliverables: string[]
  slug: string
  phases: PhaseGroup[]
}

interface Props {
  projects: GalleryProject[]
  categories: string[]
}

export function ProjectsGallery({ projects, categories }: Props) {
  const allCategories = ['All', ...categories]
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filtered =
    activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Filter bar: plain text filters on a ruled strip under the header. */}
      <div className="sticky top-[4.4rem] z-20 bg-canvas border-b border-line">
        <div className="wrap py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`t-micro py-2 border-b transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'text-ink border-accent'
                    : 'text-ink-muted border-transparent hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-canvas sec">
        <div className="wrap">
          {filtered.length === 0 ? (
            <div className="py-28 text-center">
              <p className="t-micro text-ink-muted">No projects to show in this category yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[clamp(3rem,6vw,5rem)]">
              {filtered.map((project, i) => {
                const facts = [
                  { label: 'Location', value: project.location },
                  { label: 'Scope', value: project.scope },
                  { label: 'Role', value: project.role },
                ].filter((f) => f.value)
                // Projects without a real photograph (stock stand-ins are
                // filtered out) are laid out as text, full width.
                const pictured = project.phases.length > 0
                return (
                  <Reveal key={`${activeCategory}-${project.id}`} delay={Math.min(i, 3) * 70}>
                    <article className="border-t border-line pt-8 lg:pt-10">
                      <div className={`grid grid-cols-[minmax(0,1fr)] gap-8 lg:gap-14 ${pictured ? 'lg:grid-cols-2' : ''}`}>

                        {/* Image column */}
                        <div className={`flex flex-col min-w-0 ${i % 2 === 1 ? 'lg:order-2' : ''} ${pictured ? '' : 'hidden'}`}>
                          {pictured && (
                            <ProjectImageStage title={project.title} phases={project.phases} />
                          )}

                          {pictured && project.deliverables.length > 0 && (
                            <div className="pt-6 mt-6 border-t border-line">
                              <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-3.5">
                                TMPC Scope
                              </p>
                              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                                {project.deliverables.map((d) => (
                                  <li key={d} className="flex items-start gap-2.5 text-[0.9rem] text-ink-muted leading-snug">
                                    <span className="w-1 h-1 bg-ink-muted mt-2 flex-shrink-0" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Text column */}
                        <div
                          className={`flex flex-col ${pictured ? 'justify-center' : 'max-w-3xl'} ${
                            i % 2 === 1 ? 'lg:order-1' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3.5 mb-6">
                            <span className="t-micro text-ink-muted tabular-nums">{project.number}</span>
                            <span className="t-micro text-ink-muted">{project.category}</span>
                          </div>

                          <h2 className="t-h2 !text-[1.6rem] lg:!text-[2rem] text-ink mb-2.5">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="hover:text-accent transition-colors duration-200"
                            >
                              {project.title}
                            </Link>
                          </h2>
                          {project.subtitle && (
                            <p className="text-[0.95rem] text-ink-muted mb-6">{project.subtitle}</p>
                          )}

                          {project.brief && (
                            <p className="t-body text-ink-secondary mb-8">{project.brief}</p>
                          )}

                          {!pictured && project.deliverables.length > 0 && (
                            <div className="border-t border-line pt-6 mb-8">
                              <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-3.5">
                                TMPC Scope
                              </p>
                              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                                {project.deliverables.map((d) => (
                                  <li key={d} className="flex items-start gap-2.5 text-[0.9rem] text-ink-muted leading-snug">
                                    <span className="w-1 h-1 bg-ink-muted mt-2 flex-shrink-0" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {facts.length > 0 && (
                            <div className="border-t border-line pt-6">
                              <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                Fact Sheet
                              </p>
                              <dl className="space-y-3">
                                {facts.map((f) => (
                                  <div key={f.label} className="flex gap-4">
                                    <dt className="w-20 flex-shrink-0 text-[0.62rem] font-bold text-ink-muted uppercase tracking-[0.12em] pt-1">
                                      {f.label}
                                    </dt>
                                    <dd className="flex-1 text-[0.95rem] text-ink-secondary leading-snug">
                                      {f.value}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          )}

                          <div className="mt-7">
                            <Link href={`/projects/${project.slug}`} className="lnk">
                              View project <span aria-hidden="true">&#8594;</span>
                            </Link>
                          </div>
                        </div>

                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Start a Conversation</p>
            <h2 className="t-h1 text-white mt-6">Discuss Your Project</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              Tell us what you are planning. We will give you an honest picture of what it takes to
              deliver it in Thailand.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/contact" className="btn">Schedule a Consultation</Link>
              <Link href="/services" className="btn-2">
                Our Services <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
