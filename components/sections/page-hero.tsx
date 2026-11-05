import Image from 'next/image'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { Parallax } from '@/components/anim/parallax'

/**
 * The opening band of every inner page: ink, a wide title that rises line by
 * line, a short lead, and either a photograph in a wide frame that bleeds off
 * the band's lower edge, or nothing. The label above the title is a plain
 * mono crumb (page name), the only small label the page carries up top.
 */
export function PageHero({
  label,
  title,
  lead,
  image,
  imageAlt = '',
  children,
}: {
  label: string
  title: ReactNode
  lead?: ReactNode
  image?: string
  imageAlt?: string
  children?: ReactNode
}) {
  return (
    <>
      <section className="dark-band relative" data-tone="dark" data-first="">
        <div className={`wrap pt-[calc(var(--hdr-h)+clamp(3.5rem,8vw,7rem))] ${image ? 'pb-[clamp(9rem,16vw,15rem)]' : 'pb-[clamp(4rem,8vw,7rem)]'}`}>
          <div className="grid lg:grid-cols-12 gap-y-8 gap-x-10 items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <p className="t-meta text-fog-muted flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
                  {label}
                </p>
              </Reveal>
              <SplitHeading as="h1" on="load" delay={80} className="t-display text-fog mt-7">
                {title}
              </SplitHeading>
            </div>
            {(lead || children) && (
              <div className="lg:col-span-4 lg:pb-2">
                {lead && (
                  <Reveal delay={260}>
                    <p className="t-lead">{lead}</p>
                  </Reveal>
                )}
                {children && (
                  <Reveal delay={340}>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-8 cta-row">{children}</div>
                  </Reveal>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {image && (
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-ink-deep" data-tone="dark" aria-hidden="true" />
          <div className="wrap relative -mt-[clamp(6rem,12vw,11rem)]" data-first="">
            <Reveal variant="image">
              <div className="frame aspect-[16/9] md:aspect-[21/9]">
                <Parallax amount={6}>
                  <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1400px) 100vw, 1360px" className="object-cover photo" />
                </Parallax>
                <div className="photo-tint" />
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </>
  )
}
