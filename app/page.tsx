import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { getSeoRow } from '@/lib/seo'
import { HeroBeforeAfter } from '@/components/hero-before-after'
import { Testimonials } from '@/components/testimonials'
import { ProcessTimeline } from '@/components/sections/process-timeline'
import { SplitHeading } from '@/components/anim/split-heading'
import { WordScrub } from '@/components/anim/word-scrub'
import { Parallax } from '@/components/anim/parallax'
import { HomeHero } from '@/components/home/home-hero'
import { FxStrip } from '@/components/home/fx-strip'
import { OwnerTable } from '@/components/home/owner-table'
import { CoreServices } from '@/components/home/core-services'
import { CtaBand } from '@/components/sections/cta-band'
import { ButtonLink, TextLink } from '@/components/ui/arrow-link'
import { ProjectPhoto } from '@/components/project-photo'
import { getPublishedProjects, getShareImage, projectPhoto } from '@/lib/projects'
import { PROCESS } from '@/lib/service-meta'
import type { HeroBeforeAfter as HeroBeforeAfterRow, Testimonial } from '@/lib/types'

const FALLBACK_TITLE = `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('home')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || siteConfig.description
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/',
      images: await getShareImage(),
    },
  }
}

const services = [
  { number: '01', title: 'Project Consulting', description: 'Not sure where to start? We structure the scope, budget, and coordination plan before anything is committed.' },
  { number: '02', title: 'Development Management', description: 'One party accountable for every consultant, contractor, and milestone. From concept through completion.' },
  { number: '03', title: 'Project Coordination', description: 'Multiple parties, fragmented communication. We run the coordination and documentation so nothing gets dropped.' },
  { number: '04', title: 'Execution Oversight', description: 'Cannot be on site every day? We are. Progress tracked, issues resolved, and the owner informed throughout.' },
  { number: '05', title: 'Operational Setup', description: 'Construction finished but operations not ready. We coordinate the handover so opening day is not improvised.' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: hero }, { data: testimonialRows }, projects] = await Promise.all([
    supabase.from('hero_before_after').select('*').limit(1).maybeSingle<HeroBeforeAfterRow>(),
    supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true }),
    getPublishedProjects(),
  ])
  // The one photograph in this section is a real TMPC project, captioned.
  const costPhoto = projectPhoto(projects, 'aura-wellness-phuket')
  const testimonials = (testimonialRows as Testimonial[]) ?? []

  return (
    // .home-motion scopes the v3 reveal timing (a longer, softer rise) to this
    // page; every other page keeps the professional 10px / 0.5s reveal.
    <div className="home-motion">
      {/* ── HERO: full-bleed Bangkok skyline, v3 motion ── */}
      <HomeHero />

      {/* ── EXCHANGE RATES: a slow belt of ECB reference rates in baht ── */}
      <FxStrip />

      {/* ── BEFORE / AFTER: the one drag interaction, directly under the hero ── */}
      <section className="bg-canvas sec-tight">
        <div className="wrap">
          <div className="grid lg:grid-cols-[1fr_minmax(0,30rem)] gap-12 lg:gap-16 items-center">
            <div>
              <p className="eye">Before / After</p>
              <SplitHeading className="t-h1 text-ink mt-6 max-w-[14ch]">
                From site <em>to opening.</em>
              </SplitHeading>
              <Reveal delay={120}>
                <p className="t-lead mt-7">
                  Drag the handle to compare. TMPC stays with a project from the empty site to the day it opens.
                </p>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <HeroBeforeAfter
                beforeUrl={hero?.before_url}
                afterUrl={hero?.after_url}
                projectName={hero?.project_name}
                projectDetails={hero?.project_details}
                priority={false}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WE REPRESENT YOU: v3's owner table, replacing the static coordination box ── */}
      <section className="bg-canvas sec">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-8">
            <div className="lg:col-span-7">
              <p className="eye">We Represent You</p>
              <SplitHeading className="t-h1 text-ink mt-6 max-w-[16ch]">
                Many teams on your project. <em>One conversation for you.</em>
              </SplitHeading>
            </div>
            <div className="lg:col-span-5 lg:pt-14">
              <WordScrub
                className="t-lead"
                text="Architects, engineers, contractors and suppliers all report through TMPC. Multiple teams, two languages, *one point of contact.*"
              />
            </div>
          </div>
          <div className="mt-[clamp(3rem,6vw,5rem)]">
            <OwnerTable />
          </div>
        </div>
      </section>

      {/* ── COST PROTECTION (content unchanged; the real Aura photo drifts a few percent) ── */}
      <section className="bg-canvas sec">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <p className="eye">Cost Protection</p>
              <SplitHeading className="t-h1 text-ink mt-6">We save you money.</SplitHeading>
              <Reveal delay={100}>
                <p className="t-lead mt-7">
                  Projects in Thailand involve many people, many steps, and countless decisions.
                  Without one team managing the full process, mistakes happen, costs increase, and
                  timelines slip.
                </p>
                <p className="t-body text-ink-muted mt-5 max-w-[56ch]">
                  TMPC represents you: we check quotes, negotiate with contractors and suppliers, and
                  use our local network to find the right people at the right price. We manage the
                  process and protect your budget.
                </p>
                <div className="mt-9">
                  <ButtonLink href="/about" variant="ghost">How we work</ButtonLink>
                </div>
              </Reveal>
            </div>

            {costPhoto && (
              <Reveal delay={120} className="cost-photo">
                <Parallax amount={4} className="cost-photo-drift">
                  <ProjectPhoto photo={costPhoto} />
                </Parallax>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES: ruled rows with v3 hover motion ── */}
      <section className="bg-canvas-subtle sec">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(2.5rem,4vw,3.5rem)]">
            <div>
              <p className="eye">Services</p>
              <SplitHeading className="t-h1 text-ink mt-6">What We Do</SplitHeading>
            </div>
            <Reveal>
              <TextLink href="/services">All services</TextLink>
            </Reveal>
          </div>
          <CoreServices services={services} />
        </div>
      </section>

      {/* ── PROCESS: v3's scroll-scrubbed index, text only ── */}
      <section className="dark-band on-dark sec">
        <div className="wrap">
          <ProcessTimeline
            scrub
            steps={PROCESS}
            heading={
              <>
                <div>
                  <p className="eye">How It Works</p>
                  <SplitHeading className="t-h1 text-white mt-6 max-w-[16ch]">
                    One team, from first conversation <em>to opening day.</em>
                  </SplitHeading>
                </div>
                <Reveal delay={120}>
                  <p className="t-lead">
                    Bring us in at any stage. The earlier we start, the more of the cost and risk we can take out.
                  </p>
                </Reveal>
              </>
            }
          />
        </div>
      </section>

      {/* ── TESTIMONIALS (unchanged) ── */}
      <Testimonials testimonials={testimonials} />

      {/* ── CTA: v3's closing band, navy, no photograph ── */}
      <CtaBand />
    </div>
  )
}
