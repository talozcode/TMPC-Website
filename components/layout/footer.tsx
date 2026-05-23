import Link from 'next/link'
import Image from 'next/image'
import { footerNavLinks, siteConfig } from '@/lib/data'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-canvas-dark mt-auto">
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
                className="h-10 w-auto brightness-0 invert opacity-75"
              />
            </Link>
            <p className="text-sm text-canvas/45 leading-relaxed max-w-xs">
              Project consulting and development management in Thailand, supporting international clients across multiple sectors.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-xs font-semibold text-canvas/30 uppercase tracking-[0.2em] mb-4">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2.5">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-canvas/50 hover:text-canvas transition-colors duration-150"
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
            <p className="text-xs font-semibold text-canvas/30 uppercase tracking-[0.2em] mb-4">
              Contact
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-canvas/50 hover:text-canvas transition-colors duration-150"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-sm text-canvas/45">
                {siteConfig.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-canvas/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-canvas/25">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-canvas/25">
            {siteConfig.location}
          </p>
        </div>
      </div>
    </footer>
  )
}
