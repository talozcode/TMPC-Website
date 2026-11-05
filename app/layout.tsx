import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SiteShell } from '@/components/layout/site-shell'
import { siteConfig } from '@/lib/data'
import './globals.css'

// Self-hosted variable fonts (latin subset, from Fontsource, OFL), so nothing
// is fetched from Google at build or dev time. Archivo carries both a weight
// and a width axis: the display type is the same family set wide.
const archivo = localFont({
  src: './fonts/archivo-latin-wdth-normal.woff2',
  variable: '--font-archivo',
  display: 'swap',
  weight: '100 900',
  // The display face is set wide, so the stock fallback (Arial sized for
  // normal width) made headlines rewrap when Archivo arrived. Width-matched
  // fallbacks live in globals.css ("Archivo Fallback" faces).
  adjustFontFallback: false,
})

// Reading face: IBM Plex Sans, a grotesque drawn for engineering documents,
// paired with the wide Archivo display. Latin subset from Fontsource, OFL.
const plexSans = localFont({
  src: './fonts/ibm-plex-sans-latin-wght-normal.woff2',
  variable: '--font-plex',
  display: 'swap',
  weight: '100 700',
})

const geistMono = localFont({
  src: './fonts/geist-mono-latin-wght-normal.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
  weight: '100 900',
  preload: false,
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
    // Default share image; pages with their own photo override it.
    images: ['/images/hero-home.jpg'],
  },
  twitter: { card: 'summary_large_image' },
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
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
