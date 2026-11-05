import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { ContactWays } from '@/components/contact/contact-ways'
import { ContactStrip } from '@/components/contact/contact-strip'

/**
 * The Contact page's own opening band. The page exists to be chosen from, so
 * the band carries the choice: the headline on the left, the two ways in as a
 * ledger on the right, and the practical facts (Bangkok time, how TMPC
 * replies, the address) on one rule along the foot.
 */
export function ContactHero({ email }: { email: string }) {
  return (
    <section className="dark-band chero" data-tone="dark" data-first="">
      <div className="wrap pt-[calc(var(--hdr-h)+clamp(3.5rem,8vw,7rem))]">
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-meta text-fog-muted flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
                Get in Touch
              </p>
            </Reveal>
            <SplitHeading as="h1" on="load" delay={80} className="t-display text-fog mt-7">
              Discuss your <em>project</em>
            </SplitHeading>
            <Reveal delay={240}>
              <p className="t-lead mt-8 !max-w-[38ch]">
                Tell us what you are working on. TMPC will give you a clear picture of what delivery looks like in Thailand.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:pb-1">
            <Reveal delay={320}>
              <ContactWays />
            </Reveal>
          </div>
        </div>
        <Reveal delay={420}>
          <ContactStrip email={email} />
        </Reveal>
      </div>
    </section>
  )
}
