import Image from 'next/image'
import { ButtonLink } from '@/components/ui/arrow-link'
import { SplitHeading } from '@/components/anim/split-heading'
import { Reveal } from '@/components/motion'
import { HeroMotion, Reticle } from './hero-motion'

// Light masks cut from hero-home-skyline.jpg itself (carried over from
// feat/v3): white everywhere except where a light is lit, so multiplying one
// over the photo switches those lights off. They only fit that exact photo.
// When it is replaced, empty this list and the hero simply opens on the new one.
const LIGHTS = [
  { src: '/images/hero-home-lights-city.png', part: 'city' },
  { src: '/images/hero-home-lights-tower.png', part: 'tower' },
]

// The client-advocacy line from the 22/09/2026 review, kept as the hero's foot.
const PROMISES = [
  { value: 'We Represent You', label: 'Not the contractor. Your interests, first.' },
  { value: 'One Point of Contact', label: 'One team, start to finish.' },
  { value: 'Concept to Completion', label: 'Full lifecycle coverage, on the ground.' },
]

/**
 * Bangkok at blue hour, full bleed under the navy header. An atmospheric
 * skyline, not presented as a TMPC project, so it carries no project caption.
 * It opens like a shutter from a single level line and the city's lights come
 * on, then the tower's floors and crane lamps. As the hero scrolls away the
 * photograph settles and dims while the copy lifts (HeroMotion). On desktop a
 * surveyor's reticle follows the pointer with a coordinate readout.
 *
 * Only the base photograph is `priority`; the two light layers load eagerly
 * without a preload so they do not compete with it for the first paint.
 */
export function HomeHero() {
  return (
    <section className="hero dark-band on-dark" data-first="" aria-labelledby="hero-title" id="hero">
      <div className="hero-media" data-hero-media>
        <div className="hero-layers" data-hero-layers>
          <Image
            src="/images/hero-home-skyline.jpg"
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
              loading="eager"
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

      <div className="wrap relative z-[2] w-full pt-[clamp(3rem,8vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]" data-hero-copy>
        <SplitHeading
          as="h1"
          id="hero-title"
          on="load"
          delay={600}
          className="t-display hero-title text-fog max-w-[20ch]"
        >
          Planning a project in Thailand? <em>You need someone on the ground.</em>
        </SplitHeading>

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 items-end mt-[clamp(2rem,4vw,3rem)] pt-7 border-t border-fog/15">
          <Reveal delay={900} className="md:col-span-7 lg:col-span-6">
            <p className="t-lead !text-fog/80">
              For international clients and investors, Thailand projects bring real complexity: unfamiliar contractors,
              approval processes, language barriers, and a delivery environment where local presence makes the
              difference. TMPC provides that presence.
            </p>
          </Reveal>
          <Reveal delay={1000} className="md:col-span-5 lg:col-span-6 md:justify-self-end">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 cta-row">
              <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
              <ButtonLink href="/services" variant="ghost">Our Services</ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={1100}>
          <ul className="hero-promises grid grid-cols-1 sm:grid-cols-3 mt-10">
            {PROMISES.map((p) => (
              <li key={p.value}>
                <p className="font-display font-semibold text-[1rem] text-fog leading-tight">{p.value}</p>
                <p className="text-[0.84rem] text-fog-muted leading-snug mt-1.5">{p.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <HeroMotion />
    </section>
  )
}
