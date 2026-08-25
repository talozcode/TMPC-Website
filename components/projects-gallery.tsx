'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { Reveal } from '@/components/motion'

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
  images: string[]
}

interface Props {
  projects: GalleryProject[]
  categories: string[]
}

export function ProjectsGallery({ projects, categories }: Props) {
  const allCategories = ['All', ...categories]
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})
  const [lightbox, setLightbox] = useState<{ slides: { src: string; title: string }[]; index: number } | null>(null)

  const filtered =
    activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)

  function selectImage(id: string, index: number) {
    setActiveImages((prev) => ({ ...prev, [id]: index }))
  }

  function openLightbox(project: GalleryProject, index: number) {
    setLightbox({ slides: project.images.map((src) => ({ src, title: project.title })), index })
  }

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
                const imgIdx = activeImages[project.id] ?? 0
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
                          <div className="relative overflow-hidden flex-1 group min-h-[320px]">
                            <button
                              type="button"
                              onClick={() => openLightbox(project, imgIdx)}
                              aria-label={`View ${project.title} photos fullscreen`}
                              className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                            >
                              <Image
                                src={project.images[imgIdx]}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                            </button>
                            {/* Expand affordance */}
                            <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-full bg-canvas-dark/70 backdrop-blur-sm border border-white/15 text-white/90 text-[0.58rem] font-bold uppercase tracking-[0.16em] px-3.5 py-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 transition-all duration-300 pointer-events-none">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              View
                            </div>
                            <div className="absolute top-6 left-7 z-10 pointer-events-none">
                              <span className="font-display font-bold text-[5rem] text-white/10 leading-none tracking-[-0.05em] select-none">
                                {project.number}
                              </span>
                            </div>
                            <div className="absolute bottom-5 left-6 z-10 pointer-events-none">
                              <span className="rounded-full text-[0.58rem] font-bold text-accent-light uppercase tracking-[0.22em] border border-accent-light/40 bg-canvas-dark/70 backdrop-blur-sm px-3.5 py-2">
                                {project.category}
                              </span>
                            </div>
                          </div>

                          {/* Thumbnail strip */}
                          {project.images.length > 1 && (
                            <div className="flex gap-2 p-3 bg-canvas-dark flex-shrink-0 overflow-x-auto">
                              {project.images.map((img, j) => {
                                const isActive = imgIdx === j
                                return (
                                  <button
                                    key={j}
                                    onClick={() => selectImage(project.id, j)}
                                    aria-label={`View photo ${j + 1} of ${project.title}`}
                                    aria-current={isActive}
                                    className={`press relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-[10px] border-2 transition-all duration-200 ${
                                      isActive
                                        ? 'border-accent-light'
                                        : 'border-white/10 hover:border-white/40 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                                  </button>
                                )
                              })}
                            </div>
                          )}

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
                            {project.title}
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

      {/* Fullscreen image lightbox with manual zoom */}
      <Lightbox
        open={!!lightbox}
        close={() => setLightbox(null)}
        index={lightbox?.index ?? 0}
        slides={lightbox?.slides ?? []}
        plugins={[Zoom, Captions]}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3, doubleTapDelay: 250, doubleClickMaxStops: 2 }}
        captions={{ descriptionTextAlign: 'center' }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 300, swipe: 400 }}
        carousel={{ finite: false, padding: '5%' }}
        styles={{
          container: { backgroundColor: 'rgba(11,33,55,0.95)' },
          root: { '--yarl__color_button': 'rgba(255,255,255,0.7)', '--yarl__color_button_active': '#57BACE' },
        }}
      />
    </>
  )
}
