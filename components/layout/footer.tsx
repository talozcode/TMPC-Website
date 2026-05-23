import Link from 'next/link'
import Image from 'next/image'
import { footerNavLinks, siteConfig } from '@/lib/data'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-canvas-subtle border-t border-line mt-auto">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" aria-label={`${siteConfig.name} - Home`} className="inline-block mb-5">
              <Image
                src="/logo.svg"
                alt={siteConfig.name}
                width={140}
                height={52}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              Project consulting and development management in Thailand, supporting international clients across multiple sectors.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-xs font-medium text-ink-muted uppercase tracking-widest mb-4">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-ink transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-xs font-medium text-ink-muted uppercase tracking-widest mb-4">
              Contact
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-ink-muted hover:text-ink transition-colors duration-150"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-sm text-ink-muted">
                {siteConfig.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-ink-muted">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">
            {siteConfig.location}
          </p>
        </div>
      </div>
    </footer>
  )
}
