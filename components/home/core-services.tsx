'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/anim/gsap'
import { TextLink } from '@/components/ui/arrow-link'

export interface CoreService {
  slug: string
  number: string
  title: string
  description: string
  scope: string[]
  image: string
  imageAlt: string
}

/**
 * The two services TMPC leads with. On desktop the photograph holds still on
 * the left while the chapters pass on the right; as the second chapter takes
 * over, its photograph wipes up over the first. Phones get each photograph
 * above its own chapter instead.
 */
export function CoreServices({ services }: { services: CoreService[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const frames = el.querySelectorAll<HTMLElement>('[data-frame]')
      const chapters = el.querySelectorAll<HTMLElement>('[data-chapter]')
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const triggers: ScrollTrigger[] = []
        chapters.forEach((ch, i) => {
          if (i === 0) return
          const frame = frames[i]
          gsap.set(frame, { clipPath: 'inset(100% 0 0 0)' })
          triggers.push(
            ScrollTrigger.create({
              trigger: ch,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.5,
              animation: gsap.fromTo(
                frame,
                { clipPath: 'inset(100% 0 0 0)' },
                { clipPath: 'inset(0% 0 0 0)', ease: 'none' }
              ),
            })
          )
        })
        return () => triggers.forEach((t) => t.kill())
      })
      // Reduced motion: the photograph still changes with the chapter, it
      // just switches instead of wiping.
      mm.add('(prefers-reduced-motion: reduce) and (min-width: 1024px)', () => {
        const triggers = Array.from(chapters).slice(1).map((ch, j) =>
          ScrollTrigger.create({
            trigger: ch,
            start: 'top 50%',
            onEnter: () => {
              frames[j + 1].style.clipPath = 'none'
            },
            onLeaveBack: () => {
              frames[j + 1].style.clipPath = 'inset(100% 0 0 0)'
            },
          })
        )
        return () => triggers.forEach((t) => t.kill())
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="grid lg:grid-cols-12 gap-x-10">
      <div className="hidden lg:block lg:col-span-6">
        <div className="sticky top-[calc(var(--hdr-h)+2rem)] h-[calc(100svh-var(--hdr-h)-4rem)] max-h-[48rem]">
          <div className="relative h-full overflow-hidden bg-ink">
            {services.map((s, i) => (
              <div
                key={s.slug}
                data-frame
                className="absolute inset-0"
                style={i > 0 ? { clipPath: 'inset(100% 0 0 0)' } : undefined}
              >
                <Image src={s.image} alt={s.imageAlt} fill sizes="50vw" className="object-cover photo" />
                <div className="photo-tint" />
                <span className="t-meta absolute left-5 bottom-5 bg-ink-deep/80 text-fog px-2.5 py-1.5">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        {services.map((s, i) => (
          <article
            key={s.slug}
            data-chapter
            className={`lg:min-h-[calc(100svh-var(--hdr-h))] flex flex-col justify-center ${i > 0 ? 'max-lg:mt-20' : ''}`}
          >
            <div className="lg:hidden relative aspect-[4/3] overflow-hidden bg-ink mb-8" data-pm-reveal data-pm-live>
              <Image src={s.image} alt={s.imageAlt} fill sizes="100vw" className="object-cover photo" />
              <div className="photo-tint" />
              <span className="pm-edge md:hidden" aria-hidden="true"><i /></span>
            </div>
            <p className="cs-num t-meta text-ink-muted">{s.number}</p>
            <h3 className="t-h1 mt-4">{s.title}</h3>
            <p className="t-body mt-6">{s.description}</p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6" data-pm-lit>
              {s.scope.map((item) => (
                <li key={item} className="flex gap-3 py-2.5 border-b border-rule-soft text-[0.95rem]">
                  <span className="mt-[0.6em] w-1.5 h-1.5 bg-signal shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <TextLink href={`/services#${s.slug}`}>{s.title} in detail</TextLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
