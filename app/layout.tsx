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

export const metadata: Metadata = {
  metadataBase: new URL('https://tmpc.co.th'),
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
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
