import { footerNavLinks, siteConfig } from '@/lib/data'
import { ButtonLink } from '@/components/ui/arrow-link'
import { BeamWordmarkFooter } from '@/components/ui/beam-wordmark-footer'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <BeamWordmarkFooter
      className="dark-band mt-auto"
      data-tone="dark"
      brand={siteConfig.shortName}
      label={`© ${year} ${siteConfig.name}`}
      lead={
        <>
          <p className="t-h2 text-fog max-w-[18ch]">
            Your representative on the ground, <em>from first plan to opening day.</em>
          </p>
          <div className="foot-cta flex flex-wrap gap-3 mt-9">
            <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
            <ButtonLink href="/contact?mode=call" variant="ghost">Book a call</ButtonLink>
          </div>
          <p className="mt-9 text-[0.85rem] text-fog-muted">
            Owner&apos;s representation in Thailand. Not a construction contractor.
          </p>
        </>
      }
      columns={[
        { title: 'Navigation', links: footerNavLinks },
        {
          title: 'Office',
          links: [
            { label: siteConfig.location },
            { label: 'Working across Thailand' },
            { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
          ],
        },
      ]}
    />
  )
}
