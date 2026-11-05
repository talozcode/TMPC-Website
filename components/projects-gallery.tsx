'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { ProjectImageStage } from '@/components/project-image-stage'
import { TextLink } from '@/components/ui/arrow-link'
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
    <section className="bg-paper pb-[var(--sec)]">
      {/* z-30: above the photo controls (z-20) of the projects scrolling under it. */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md border-b border-rule-soft">
          <div className="wrap py-3 flex items-center gap-5">
            <span className="t-meta text-ink-muted hidden sm:inline" id="filter-label">Filter</span>
            <div className="filter-scroll flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1" role="group" aria-labelledby="filter-label">
              {allCategories.map((cat) => {
                const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    className="opt press shrink-0"
                  >
                    {cat}
                    <span className="t-meta opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="wrap pt-[clamp(3rem,6vw,5rem)]">
        {filtered.length === 0 ? (
          <p className="t-body py-28 text-center mx-auto">No projects to show in this category yet.</p>
        ) : (
          <div className="grid gap-[clamp(4.5rem,9vw,8rem)]">
            {filtered.map((project, i) => {
              const facts = [
                { label: 'Location', value: project.location },
                { label: 'Scope', value: project.scope },
                { label: 'Role', value: project.role },
              ].filter((f) => f.value)
              return (
                <Reveal key={`${activeCategory}-${project.id}`} delay={Math.min(i, 2) * 80} as="article">
                  <div className="grid lg:grid-cols-12 gap-x-10 gap-y-8 items-start">
                    <div className="lg:col-span-7">
                      <ProjectImageStage
                        title={project.title}
                        phases={project.phases}
                        category={project.category}
                        number={project.number}
                        priority={i === 0}
                      />
                    </div>

                    {/* Tablet portrait: the photo runs full width and the
                        text sits under it in two columns (story left, facts
                        right) instead of one long column. */}
                    <div className="lg:col-span-5 md:max-lg:grid md:max-lg:grid-cols-12 md:max-lg:gap-x-10">
                      <div className="md:max-lg:col-span-7">
                        <p className="t-meta text-ink-muted flex gap-3">
                          <span>{project.number}</span>
                          <span aria-hidden="true" className="opacity-50">/</span>
                          <span>{project.category}</span>
                        </p>
                        <h2 className="t-h1 !text-[clamp(1.9rem,1.3rem+2vw,3rem)] mt-4">
                          <Link href={`/projects/${project.slug}`} className="hover:opacity-75 transition-opacity">
                            {project.title}
                          </Link>
                        </h2>
                        {project.subtitle && <p className="text-ink-muted mt-2">{project.subtitle}</p>}
                        {project.brief && <p className="t-body mt-6">{project.brief}</p>}
                      </div>

                      <div className="md:max-lg:col-span-5">
                        {facts.length > 0 && (
                          <dl className="mt-8 md:max-lg:mt-1">
                            {facts.map((f) => (
                              <div key={f.label} className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] md:max-lg:grid-cols-1 gap-x-4 gap-y-1 py-3 border-t border-rule-soft">
                                <dt className="t-meta text-ink-muted pt-1">{f.label}</dt>
                                <dd className="text-[0.96rem] text-ink-soft">{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        <div className="mt-8">
                          <TextLink href={`/projects/${project.slug}`}>View project</TextLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
