'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { FadeIn } from '@/components/fade-in'

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
      {/* Category filter bar */}
      <div className="bg-canvas border-b border-line sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {allCategories.map((cat) => (
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
        {filtered.length === 0 ? (
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
            <p className="text-sm text-ink-muted uppercase tracking-[0.15em]">
              No projects to show in this category yet.
            </p>
          </div>
        ) : (
          filtered.map((project, i) => {
          const imgIdx = activeImages[project.id] ?? 0
          return (
            <FadeIn key={`${activeCategory}-${project.id}`} delay={i * 60}>
              <div className="grid lg:grid-cols-2 border-b border-line">

                {/* Image panel */}
                <div className={`flex flex-col ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {/* Main image */}
                  <div className="relative overflow-hidden flex-1 group" style={{ minHeight: '380px' }}>
                    <button
                      type="button"
                      onClick={() => openLightbox(project, imgIdx)}
                      aria-label={`View ${project.title} photos fullscreen`}
                      className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Image
                        src={project.images[imgIdx]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-[#0A1628]/30 transition-colors duration-300 group-hover:bg-[#0A1628]/15" />
                    </button>
                    {/* Expand affordance */}
                    <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-[#0A1628]/70 backdrop-blur-sm border border-white/15 text-white/90 text-[0.58rem] font-semibold uppercase tracking-[0.18em] px-3 py-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 transition-all duration-300 pointer-events-none">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      View
                    </div>
                    <div className="absolute top-6 left-7 z-10 pointer-events-none">
                      <span className="font-display font-bold text-[5rem] text-white/10 leading-none select-none">
                        {project.number}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-6 z-10 pointer-events-none">
                      <span className="text-[0.58rem] font-bold text-accent uppercase tracking-[0.25em] border border-accent/40 bg-[#0A1628]/70 px-3 py-1.5">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  {project.images.length > 1 && (
                    <div className="flex gap-1.5 p-2.5 bg-canvas-dark flex-shrink-0 overflow-x-auto">
                      {project.images.map((img, j) => {
                        const isActive = imgIdx === j
                        return (
                          <button
                            key={j}
                            onClick={() => selectImage(project.id, j)}
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
                  )}
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

                  {project.deliverables.length > 0 && (
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
                  )}

                  {project.role && (
                    <div className="pt-5 border-t border-line">
                      <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold text-ink uppercase tracking-[0.15em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        TMPC Role: {project.role}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </FadeIn>
          )
        })
        )}
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
          container: { backgroundColor: 'rgba(8,18,33,0.94)' },
          root: { '--yarl__color_button': 'rgba(255,255,255,0.7)', '--yarl__color_button_active': '#22C5E0' },
        }}
      />
    </>
  )
}
