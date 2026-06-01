import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
      {/* 1. Hero */}
      <section className="bg-canvas border-b border-line py-10 lg:py-14 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
                About TMPC
              </p>
              <h1
                className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight mb-4 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Managing projects in Thailand for international owners.
              </h1>
              <p
                className="text-lg text-ink-secondary leading-relaxed max-w-xl animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                We partner with owners, investors, and operators who need one accountable management presence on the ground in Thailand.
              </p>
            </div>

            <div
              className="hidden lg:block relative mt-4 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative h-[440px] overflow-hidden">
                <Image
                  src="/images/hero-about.jpg"
                  alt="Project planning and coordination"
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/25 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="bg-canvas border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                The Company
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight">
                Who We Are
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-base text-ink leading-relaxed">
                TMPC was established to give international project owners a reliable management presence in Thailand. Getting the right contractors, managing consultants, navigating approvals, and keeping a project on track requires local knowledge, constant attention, and clear accountability. Most owners operating from abroad do not have all of that.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                We carry the full coordination load on your behalf: contractor selection, consultant management, authority submissions, milestone tracking, budget oversight, and on-site supervision. Everything is handled by TMPC and reported clearly to you.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                TMPC is a project management partner, not a construction contractor. We do not build. We plan, coordinate, and oversee so that the right parties deliver to plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="bg-canvas-subtle border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
            <div className="pt-1">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
                Methodology
              </p>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight">
                Our Approach
              </h2>
            </div>
            <div>
              <p className="text-base text-ink leading-relaxed mb-5">
                Every project is different. The parties, timelines, and challenges vary. What does not vary is the need for a structured coordination layer with a single point of accountability.
              </p>
              <p className="text-base text-ink-muted leading-relaxed">
                TMPC builds the coordination structures, manages the communication flows, and maintains oversight so that projects move with clarity regardless of how many parties are involved or how far the owner is from the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership */}
      <section className="bg-canvas-subtle border-b border-line py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6 lg:mb-8">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-4">
              Team
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight">
              Leadership
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-2xl">
              TMPC combines project development, operational coordination, and technology-driven management support through a multidisciplinary leadership structure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {leadership.map((person) => (
              <div key={person.name} className="bg-canvas border border-line p-8 lg:p-10 hover:border-accent/40 hover:shadow-sm transition-all duration-200">
                <div className="w-8 h-0.5 bg-accent mb-6" />
                <p className="font-display font-bold text-2xl text-ink mb-1 tracking-tight">
                  {person.name}
                </p>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-5">
                  {person.title}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {person.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-canvas-dark py-10 lg:py-14">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6">
            Work With Us
          </p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-6">
            Tell us what you are planning.
          </h2>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            We will give you a straight assessment of what it takes to deliver it in Thailand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </>
  )
}
