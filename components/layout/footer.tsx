import { footerNavLinks, siteConfig } from '@/lib/data'
import { BeamWordmarkFooter } from '@/components/ui/beam-wordmark-footer'

/**
 * The navy closing band of every page: v3's beam wordmark footer, recoloured
 * to the professional palette (components/ui/beam-wordmark-footer.tsx). The
 * giant TMPC wordmark stands in for the small logo the footer used to carry.
 * No buttons here: every page already closes on its own call to action.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <BeamWordmarkFooter
      className="on-dark mt-auto"
      brand={siteConfig.shortName}
      label={`© ${year} ${siteConfig.name}`}
      lead={
        <>
          <p className="t-h2 text-fog max-w-[20ch]">
            Your representative on the ground, <em>from first plan to opening day.</em>
          </p>
          <p className="mt-7 text-[0.95rem] text-fog-muted leading-relaxed max-w-[40ch]">
            Project consulting and development management for commercial, industrial, hospitality, and real estate
            projects across Thailand.
          </p>
        </>
      }
      columns={[
        { title: 'Navigation', links: footerNavLinks },
        {
          title: 'Contact',
          links: [
            { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { label: siteConfig.location },
          ],
        },
      ]}
    />
  )
}
