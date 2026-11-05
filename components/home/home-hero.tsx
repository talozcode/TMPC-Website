import Image from 'next/image'
import { ButtonLink } from '@/components/ui/arrow-link'
import { SplitHeading } from '@/components/anim/split-heading'
import { Reveal } from '@/components/motion'
import { HeroMotion, Reticle } from './hero-motion'

// Light masks cut from hero-home.jpg itself: white everywhere except where a
// light is lit, so multiplying one over the photo switches those lights off.
// They only fit that exact photo. When it is replaced, empty this list (and
// delete the two files) and the hero simply opens on the new photo.
const LIGHTS = [
  { src: '/images/hero-home-lights-city.png', part: 'city' },
  { src: '/images/hero-home-lights-tower.png', part: 'tower' },
]

/**
 * Bangkok at blue hour, opened like a shutter from a single level line, with
 * the firm's position set across the bottom. As it opens the city's lights
 * come on, then the tower's floors and crane lamps. Over it, on desktop, a
 * surveyor's reticle follows the pointer and reads out where you are standing.
 */
export function HomeHero() {
  return (
    <section className="hero dark-band" data-tone="dark" data-first="" aria-labelledby="hero-title" id="hero">
      <div className="hero-media" data-hero-media>
        <div className="hero-layers" data-hero-layers>
          <Image
            src="/images/hero-home.jpg"
            alt="Bangkok at dusk, the river winding through the city, with tower cranes on a high-rise under construction"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[64%_18%]"
          />
          {LIGHTS.map((l) => (
            <Image
              key={l.part}
              src={l.src}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="hero-lights object-cover object-[64%_18%]"
              data-part={l.part}
            />
          ))}
        </div>
        <div className="hero-veil" data-hero-veil aria-hidden="true" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <Reticle />

      <div className="wrap relative z-[2] pb-[clamp(2.5rem,6vw,4.5rem)] pt-[calc(var(--hdr-h)+2.5rem)] md:pt-[calc(var(--hdr-h)+4rem)]" data-hero-copy>
        <Reveal delay={500}>
          <p className="t-meta text-fog-muted flex items-center gap-3 mb-6">
            <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
            Project Consulting &amp; Development Management
          </p>
        </Reveal>
        <SplitHeading
          as="h1"
          id="hero-title"
          on="load"
          delay={600}
          className="hero-title ff-display-118 text-fog font-[560] tracking-[-0.035em] leading-[0.98] [font-variation-settings:'wdth'_118] text-[clamp(2.45rem,0.85rem+4.6vw,5.15rem)] max-w-[22ch]"
        >
          Planning a project in Thailand? <em className="not-italic font-[300]">You need someone on the ground.</em>
        </SplitHeading>

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 items-end mt-[clamp(2rem,4vw,3.25rem)] pt-7 border-t border-fog/15">
          <Reveal delay={900} className="md:col-span-6 lg:col-span-5">
            <p className="t-lead !text-fog/80">
              For international clients and investors, Thailand projects bring real complexity: unfamiliar contractors, approval processes, language barriers, and a delivery environment where local presence makes the difference. TMPC provides that presence.
            </p>
          </Reveal>
          <Reveal delay={1000} className="md:col-span-6 lg:col-span-7 md:justify-self-end">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 cta-row">
              <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
              <ButtonLink href="/contact?mode=call" variant="ghost">Book a call</ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
      <HeroMotion />
    </section>
  )
}
