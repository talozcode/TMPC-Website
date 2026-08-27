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
      {/* Filter bar: translucent chrome of its own, sitting under the header. */}
      <div className="sticky top-[4.4rem] z-20 bg-canvas/72 backdrop-blur-xl backdrop-saturate-150 border-b border-line-subtle">
        <div className="wrap py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`press rounded-full text-[0.66rem] font-bold uppercase tracking-[0.16em] px-4 py-2.5 border transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-accent text-white border-accent shadow-[0_4px_14px_rgba(13,113,134,0.28)]'
                    : 'text-ink-muted border-line hover:border-accent/50 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-canvas-subtle sec">
        <div className="wrap">
          {filtered.length === 0 ? (
            <div className="py-28 text-center">
              <p className="t-micro text-ink-muted">No projects to show in this category yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:gap-8">
              {filtered.map((project, i) => {
                const facts = [
                  { label: 'Location', value: project.location },
                  { label: 'Scope', value: project.scope },
                  { label: 'Role', value: project.role },
                ].filter((f) => f.value)
                return (
                  <Reveal key={`${activeCategory}-${project.id}`} delay={Math.min(i, 3) * 70}>
                    <article className="panel bg-canvas">
                      <div className="grid lg:grid-cols-2">

                        {/* Image column */}
                        <div className={`flex flex-col ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                          <ProjectImageStage
                            title={project.title}
                            phases={project.phases}
                            category={project.category}
                            number={project.number}
                          />

                          {project.deliverables.length > 0 && (
                            <div className="px-7 py-6 lg:px-9 border-t border-line-subtle bg-canvas">
                              <p className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em] mb-3.5">
                                TMPC Scope
                              </p>
                              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                                {project.deliverables.map((d) => (
                                  <li key={d} className="flex items-start gap-2.5 text-[0.9rem] text-ink-muted leading-snug">
                                    <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Text column */}
                        <div
                          className={`flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14 ${
                            i % 2 === 1 ? 'lg:order-1' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3.5 mb-6">
                            <span className="text-[0.6rem] font-bold text-accent uppercase tracking-[0.2em]">
                              {project.number}
                            </span>
                            <div className="flex-1 h-px bg-line" />
                            <span className="text-[0.6rem] text-ink-muted uppercase tracking-[0.14em]">
                              {project.category}
                            </span>
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

                          {facts.length > 0 && (
                            <div className="border-t border-line-subtle pt-6 mt-auto">
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
