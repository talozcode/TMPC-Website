import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { SiteShell } from '@/components/layout/site-shell'
import { siteConfig } from '@/lib/data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

// tmpc.co.th does not currently resolve; every canonical/OG url on the site
// derives from this, so it must point at wherever the site actually lives.
// Update this the day tmpc.co.th (or another custom domain) goes live.
const SITE_URL = 'https://tmpc-website.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.shortName} - Project Consulting and Development Management in Thailand`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

/* Set before first paint. Every scroll-reveal rule is scoped to .js, so without
   JavaScript the hidden state is never applied and the page renders in full
   rather than blank. Inline and synchronous on purpose: deferring it to an
   effect would flash the content in, then hide it again. */
const JS_FLAG = 'document.documentElement.classList.add("js")'

// Organization/ProfessionalService structured data, site-wide. Gives search
// engines a name, description, and service area to build a knowledge panel
// from; there was none before this.
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  description: siteConfig.description,
  url: SITE_URL,
  email: siteConfig.email,
  areaServed: 'TH',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangkok',
    addressCountry: 'TH',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: the inline script below adds a class to <html>
    // before React hydrates, which React would otherwise flag as a mismatch.
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
