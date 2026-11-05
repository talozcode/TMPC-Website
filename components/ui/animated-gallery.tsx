'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'

export interface GalleryStage {
  label: string
  images: readonly CompareImage[]
  /** Pulls a stage back toward monochrome; the earlier the stage, the further. */
  treatment?: string
}

/**
 * The three stages of a project as three columns of photographs, left to
 * right: Rendering, In Progress, Completed. Ported from 21st.dev's Animated
 * Gallery (ContainerScroll / GalleryContainer / GalleryCol) to the site's own
 * GSAP + ScrollTrigger, so it reads the same scroll as every other effect and
 * adds no animation library.
 *
 * Scroll drives everything, scrubbed, nothing runs on a clock and nothing
 * reacts to the pointer. While the section is pinned the grid starts laid
 * back like a drawing on a table and stands up over the first half; then it
 * settles from a slight enlargement while the columns drift past each other,
 * the middle one against the outer two. The key under the columns reads like
 * dimension lines on a drawing: each line fills between its end ticks with an
 * orange pin at its head, one stage after the other, Rendering to Completed,
 * and each index darkens as its line arrives. The key sits flat on the page
 * throughout.
 *
 * Without JavaScript, or with reduced motion, it is a plain three-column grid
 * with the stage names underneath (see .pg in globals.css).
 */
export function AnimatedGallery({ stages, label }: { stages: readonly GalleryStage[]; label: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const grid = el.querySelector<HTMLElement>('[data-grid]')
      const cols = Array.from(el.querySelectorAll<HTMLElement>('[data-col]'))
      const runs = Array.from(el.querySelectorAll<HTMLElement>('[data-run]'))
      const idxs = Array.from(el.querySelectorAll<HTMLElement>('[data-idx]'))
      if (!grid) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // One timeline, one unit long, mapped onto the pinned run of the section.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        tl.fromTo(grid, { rotationX: 75 }, { rotationX: 0, duration: 0.5 }, 0)
          .fromTo(grid, { scale: 1.2 }, { scale: 1, duration: 0.4 }, 0.5)
        // The key fills as a sequence, each line easing into its end tick
        // before the next one starts.
        runs.forEach((run, i) => {
          const at = 0.16 + i * 0.2
          tl.fromTo(run, { x: -8, xPercent: -100 }, { x: 0, xPercent: 0, duration: 0.2, ease: 'power1.inOut' }, at)
          if (idxs[i]) tl.fromTo(idxs[i], { color: '#56646C' }, { color: '#162D3A', duration: 0.03 }, at + 0.17)
        })
        cols.forEach((col, i) => {
          const mid = i === 1
          tl.fromTo(col, { yPercent: mid ? 15 : -10 }, { yPercent: mid ? 5 : 2, duration: 0.5 }, 0.5)
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div ref={root} className="pg" role="group" aria-label={label}>
      <div className="pg-stage">
        <div data-grid className="pg-grid">
          {stages.map((stage, i) => (
            <ul key={stage.label} data-col className={`pg-col ${i === 1 ? 'pg-col-mid' : ''}`} aria-label={stage.label}>
              {stage.images.map((img) => (
                <li key={img.src} className="pg-tile">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    draggable={false}
                    sizes="(max-width: 767px) 34vw, 33vw"
                    className={`object-cover ${stage.treatment ?? ''}`}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="pg-legend" aria-hidden="true">
          {stages.map((stage, i) => (
            <div key={stage.label}>
              <span className="pg-dim">
                <span className="pg-dim-track">
                  <span data-run className="pg-dim-run" />
                </span>
              </span>
              <span className="pg-key">
                <span data-idx className="pg-idx">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pg-name">{stage.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
