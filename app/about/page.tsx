import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import type { TeamMember } from '@/lib/types'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Thailand-based project consulting and development management company supporting clients across commercial, industrial, hospitality, wellness, and real estate projects.`,
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: teamRows } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  const leadership = ((teamRows as TeamMember[]) ?? []).map((m) => ({
    name: m.name,
    title: m.role_title ?? '',
    description: m.description ?? '',
  }))

  return (
    <>
      {/* 1. Hero, passing under the floating chrome */}
      <section id="about-hero" className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-about.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 scale-110"
            style={{ translate: '0 var(--par, 0%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas-dark via-canvas-dark/85 to-canvas-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-transparent to-canvas-dark/60" />
        </div>
        <div className="wrap relative z-10 py-[clamp(4.5rem,9vw,8rem)]">
          <Reveal>
            <p className="eye">About TMPC</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6 max-w-[18ch]">
              Managing projects in Thailand for international owners.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7">
              We partner with owners, investors, and operators who need one accountable management
              presence on the ground in Thailand.
            </p>
          </Reveal>
        </div>
      </section>
      <HeroParallax targetId="about-hero" amount={8} />

      {/* 2. Who We Are */}
      <section className="bg-canvas sec">
        <div className="wrap grid lg:grid-cols-[minmax(0,17rem)_1fr] gap-10 lg:gap-20">
          <Reveal>
            <p className="eye">The Company</p>
            <h2 className="t-h2 text-ink mt-6">Who We Are</h2>
          </Reveal>
          <Reveal delay={100} className="space-y-6">
            <p className="t-lead !text-ink">
              TMPC was established to give international project owners a reliable management
              presence in Thailand. Getting the right contractors, managing consultants, navigating
              approvals, and keeping a project on track requires local knowledge, constant
              attention, and clear accountability. Most owners operating from abroad do not have all
              of that.
            </p>
            <p className="t-body text-ink-muted max-w-[62ch]">
              We carry the full coordination load on your behalf: contractor selection, consultant
              management, authority submissions, milestone tracking, budget oversight, and on-site
              supervision. Everything is handled by TMPC and reported clearly to you.
            </p>
            <p className="t-body text-ink-muted max-w-[62ch]">
              TMPC is a project management partner, not a construction contractor. We do not build.
              We plan, coordinate, and oversee so that the right parties deliver to plan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="bg-canvas-subtle sec">
        <div className="wrap grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal>
            <p className="eye">Methodology</p>
            <h2 className="t-h1 text-ink mt-6">Our Approach</h2>
            <p className="t-lead mt-7">
              Every project is different. The parties, timelines, and challenges vary. What does not
              vary is the need for a structured coordination layer with a single point of
              accountability.
            </p>
            <p className="t-body text-ink-muted mt-5 max-w-[56ch]">
              TMPC builds the coordination structures, manages the communication flows, and
              maintains oversight so that projects move with clarity regardless of how many parties
              are involved or how far the owner is from the ground.
            </p>
          </Reveal>
          <Reveal variant="image" delay={120}>
            <div className="panel relative aspect-[4/3]">
              <Image
                src="/images/scenario-commercial.jpg"
                alt="A completed commercial interior in Thailand"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark/40 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Leadership */}
      {leadership.length > 0 && (
        <section className="bg-canvas sec">
          <div className="wrap">
            <Reveal className="mb-[clamp(2.5rem,4vw,3.5rem)]">
              <p className="eye">Team</p>
              <h2 className="t-h1 text-ink mt-6">Leadership</h2>
              <p className="t-lead mt-6">
                TMPC combines project development, operational coordination, and technology-driven
                management support through a multidisciplinary leadership structure.
              </p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 max-w-4xl">
              {leadership.map((person, i) => (
                <Reveal key={person.name} delay={(i % 2) * 90} className="flex">
                  <div className="card card-hover flex-1 p-9 lg:p-10">
                    <div className="w-9 h-0.5 rounded-full bg-accent mb-7" />
                    <p className="t-h3 text-ink !text-[1.5rem] mb-2">{person.name}</p>
                    <p className="text-[0.68rem] font-bold text-accent uppercase tracking-[0.18em] mb-6">
                      {person.title}
                    </p>
                    <p className="text-[0.95rem] text-ink-muted leading-relaxed">
                      {person.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CTA */}
      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Work With Us</p>
            <h2 className="t-h1 text-white mt-6">Tell us what you are planning.</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              We will give you a straight assessment of what it takes to deliver it in Thailand.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/contact" className="btn">Discuss Your Project</Link>
              <Link href="/services" className="btn-2">
                What we handle <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
