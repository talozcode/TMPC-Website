import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { getSeoRow } from '@/lib/seo'
import { getTeam } from '@/lib/content'
import { PageHero } from '@/components/sections/page-hero'
import { CtaBand } from '@/components/sections/cta-band'
import { SplitHeading } from '@/components/anim/split-heading'
import { WordScrub } from '@/components/anim/word-scrub'
import { TransformGrid } from '@/components/transform/transform-grid'
import { COMPARE } from '@/lib/compare-slots'
import { ScopeBand } from '@/components/about/scope-band'

const FALLBACK_TITLE = 'About TMPC | Project Consultants & Development Managers in Thailand'
const FALLBACK_DESCRIPTION = `${siteConfig.name} is a Thailand-based project consulting and development management company supporting clients across commercial, industrial, hospitality, wellness, and real estate projects.`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('about')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || FALLBACK_DESCRIPTION
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/about' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/about',
      images: ['/images/scenario-realestate.jpg'],
    },
  }
}

const DO = [
  { title: 'Plan', body: 'Scope, budget, and the coordination structure, confirmed before anything is committed.' },
  { title: 'Coordinate', body: 'Contractor selection, consultant management, and authority submissions, run by one team.' },
  { title: 'Oversee', body: 'Milestone tracking, budget oversight, and on-site supervision, reported clearly to you.' },
]

// Each line is what TMPC does not do, then why. On a phone the first part is
// set large and struck through as it is read.
const DONT = [
  { no: 'Build.', why: 'We are not a construction contractor.' },
  { no: 'Take a side against you.', why: 'We represent the owner, and only the owner.' },
  { no: 'Leave you guessing.', why: 'You get one point of contact and plain reporting.' },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <>
      <PageHero
        label="About TMPC"
        title={
          <>
            Managing projects in Thailand for <em>international owners.</em>
          </>
        }
        lead="We partner with owners, investors, and operators who need one accountable management presence on the ground in Thailand."
        image="/images/scenario-realestate.jpg"
        imageAlt="Completed residential towers against the sky"
      />

      {/* Who we are */}
      <section className="sec bg-paper">
        <div className="wrap grid lg:grid-cols-12 gap-x-10 gap-y-10">
          <div className="lg:col-span-3">
            <h2 className="t-meta text-ink-muted lg:pt-3">Who we are</h2>
          </div>
          <div className="lg:col-span-9">
            <WordScrub
              className="t-h2 !font-[400] [font-variation-settings:'wdth'_104] max-w-[30ch]"
              text="TMPC was established to give international project owners a reliable management presence in Thailand. Local knowledge, constant attention, and *clear accountability.*"
            />
            <div className="grid md:grid-cols-2 gap-8 mt-[clamp(2.5rem,5vw,4rem)]">
              <Reveal>
                <p className="t-body">
                  Getting the right contractors, managing consultants, navigating approvals, and keeping a project on track requires local knowledge, constant attention, and clear accountability. Most owners operating from abroad do not have all of that.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="t-body">
                  We carry the full coordination load on your behalf: contractor selection, consultant management, authority submissions, milestone tracking, budget oversight, and on-site supervision. Everything is handled by TMPC and reported clearly to you.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* What we do, and what we do not */}
      <section className="dark-band sec" data-tone="dark">
        <ScopeBand className="wrap">
          <SplitHeading className="t-display text-fog max-w-[14ch] ab-title">
            We do not <span className="ab-strike" data-strike="">build.</span>{' '}
            <em>
              <span className="ab-verb">We plan,</span> <span className="ab-verb">coordinate,</span>{' '}
              <span className="ab-verb">and oversee.</span>
            </em>
          </SplitHeading>
          <Reveal delay={120}>
            <p className="t-lead mt-8">
              TMPC is a project management partner, not a construction contractor. We make sure the right parties deliver to plan.
            </p>
          </Reveal>
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14 mt-[clamp(3.5rem,7vw,6rem)]">
            <ol data-spine="" className="ab-do lg:col-span-7 grid sm:grid-cols-3 gap-x-8 gap-y-10">
              {DO.map((v, i) => (
                <li key={v.title} data-stage="" className="ab-stage rule-t pt-6">
                  <span className="ab-node" aria-hidden="true" />
                  <Reveal delay={i * 100}>
                    <p className="ab-num t-meta text-fog-muted">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="ab-stage-title t-h3 text-fog mt-4 [overflow-wrap:anywhere]">{v.title}</h3>
                    <p className="t-body mt-4">{v.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={200}>
                <div className="ab-dont border border-fog/15 p-7">
                  <h3 className="t-meta text-fog-muted">What we do not do</h3>
                  <ul className="mt-5 grid gap-4">
                    {DONT.map((d) => (
                      <li key={d.no} className="flex gap-3 text-fog/90">
                        <span className="ab-dash mt-[0.62em] w-2.5 h-[2px] bg-signal shrink-0" aria-hidden="true" />
                        <span>
                          <span className="ab-no">
                            <span className="ab-strike" data-strike="">{d.no}</span>
                          </span>{' '}
                          <span className="ab-why">{d.why}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </ScopeBand>
      </section>

      {/* Approach */}
      <section className="sec bg-concrete">
        <div className="wrap grid lg:grid-cols-12 gap-x-10 gap-y-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <TransformGrid
              before={COMPARE['about-lens'].before}
              after={COMPARE['about-lens'].after}
              labels={COMPARE['about-lens'].labels}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/5] max-h-[40rem]"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
            <SplitHeading className="t-h1">Our approach</SplitHeading>
            <Reveal delay={100}>
              <p className="t-lead mt-7">
                Every project is different. The parties, timelines, and challenges vary. What does not vary is the need for a structured coordination layer with a single point of accountability.
              </p>
              <p className="t-body mt-5">
                TMPC builds the coordination structures, manages the communication flows, and maintains oversight so that projects move with clarity regardless of how many parties are involved or how far the owner is from the ground.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {team.length > 0 && (
        <section className="sec bg-paper">
          <div className="wrap">
            <SplitHeading className="t-h1">Leadership</SplitHeading>
            <Reveal delay={100}>
              <p className="t-lead mt-7 mb-[clamp(2.5rem,5vw,4rem)]">
                TMPC combines project development, operational coordination, and technology-driven management support through a multidisciplinary leadership structure.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
              {team.map((person, i) => (
                <Reveal key={person.id} delay={(i % 2) * 100}>
                  {/* On a phone the monogram sits beside the name only, and
                      the description takes the full width below both. */}
                  <article className="rule-t pt-8 grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_1fr] gap-x-5 sm:gap-x-6">
                    <span
                      aria-hidden="true"
                      className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] sm:row-span-2 bg-ink text-fog grid place-items-center text-[1.15rem] sm:text-[1.4rem] font-[560] [font-variation-settings:'wdth'_118] tracking-[-0.02em]"
                    >
                      {initials(person.name)}
                    </span>
                    <div className="self-center sm:self-start">
                      <h3 className="t-h2">{person.name}</h3>
                      {person.role_title && <p className="t-meta text-ink-muted mt-2">{person.role_title}</p>}
                    </div>
                    {person.description && <p className="t-body mt-5 col-span-2 sm:col-span-1 sm:col-start-2">{person.description}</p>}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={
          <>
            Tell us what you are <em>planning.</em>
          </>
        }
        lead="We will give you a straight assessment of what it takes to deliver it in Thailand."
      />
    </>
  )
}
