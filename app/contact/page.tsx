import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { siteConfig } from '@/lib/data'
import { getSeoRow } from '@/lib/seo'
import { getSettings } from '@/lib/content'
import { ContactForm } from '@/components/contact-form'
import { ArrowSwap } from '@/components/ui/arrow-link'
import { SplitHeading } from '@/components/anim/split-heading'
import { ContactHero } from '@/components/contact/contact-hero'
import { OfficeMap } from '@/components/contact/office-map'
import { ContactSteps } from '@/components/contact/contact-steps'

// Cached and refreshed at most once a minute; admin edits call revalidatePath so they show sooner.
export const revalidate = 60

const FALLBACK_TITLE = 'Contact TMPC | Discuss Your Thailand Project'
const FALLBACK_DESCRIPTION = `Get in touch with ${siteConfig.name} to discuss your project in Thailand. Project consulting, coordination, and development management inquiries welcome.`

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoRow('contact')
  const title = seo?.title || FALLBACK_TITLE
  const description = seo?.description || FALLBACK_DESCRIPTION
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/contact' },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: '/contact',
      images: ['/images/hero-home.jpg'],
    },
  }
}

// Guards against ever shipping a placeholder again: the WhatsApp button used
// to be hardcoded to the seed value '66XXXXXXXXX', a dead link live on the
// contact page. Only a value that looks like a real phone number renders it.
function isRealPhoneNumber(value: string | null | undefined): value is string {
  return !!value && /^\d{8,15}$/.test(value)
}

export default async function ContactPage() {
  const settings = await getSettings(['whatsapp', 'email', 'location'])
  const email = settings.email || siteConfig.email
  const location = settings.location || siteConfig.location
  const whatsapp = [settings.whatsapp, siteConfig.whatsapp].find(isRealPhoneNumber) ?? null

  return (
    <>
      <ContactHero email={email} />

      <section id="brief" className="sec bg-paper scroll-mt-[var(--hdr-h)]">
        <div className="wrap">
          <ContactForm aside={<ContactSteps />} />
        </div>
      </section>

      <section className="sec bg-concrete" aria-labelledby="bangkok-h">
        <div className="wrap">
          <SplitHeading as="h2" id="bangkok-h" className="t-h1 max-w-[17ch]">
            On the ground in <em>Bangkok</em>, available across Thailand.
          </SplitHeading>
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-12 mt-[clamp(2.5rem,5vw,4.5rem)] items-start">
            <Reveal variant="image" className="lg:col-span-8">
              <OfficeMap
                location={location}
                coordinates={/bangkok/i.test(location) ? undefined : ''}
                note="Working across Thailand"
                mapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              />
            </Reveal>
            <Reveal delay={160} className="lg:col-span-4">
              <dl className="bkk-list">
                <div className="bkk-row">
                  <dt className="t-meta text-ink-muted">Office</dt>
                  <dd className="t-h3 mt-2">{location}</dd>
                </div>
                <div className="bkk-row">
                  <dt className="t-meta text-ink-muted">Calls</dt>
                  <dd className="text-ink-soft">We are in Bangkok (GMT+7) and take early or late calls to suit you.</dd>
                </div>
                <div className="bkk-row">
                  <dt className="t-meta text-ink-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${email}`} className="lnk">
                      {email} <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
                    </a>
                  </dd>
                </div>
                {whatsapp && (
                  <div className="bkk-row">
                    <dt className="t-meta text-ink-muted">WhatsApp</dt>
                    <dd>
                      <a href={`https://wa.me/${whatsapp}`} className="lnk" rel="noopener noreferrer" target="_blank">
                        Chat on WhatsApp <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
