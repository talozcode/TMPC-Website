import Link from 'next/link'
import Image from 'next/image'
import { footerNavLinks, siteConfig } from '@/lib/data'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark bg-canvas-dark mt-auto">
      <div className="wrap py-[var(--sec-tight)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">

          <div>
            <Link href="/" aria-label={`${siteConfig.name} - Home`} className="inline-block mb-6 press">
              <Image
                src="/logo.svg"
                alt={siteConfig.name}
                width={140}
                height={52}
                className="h-9 w-auto brightness-0 invert opacity-85"
              />
            </Link>
            <p className="text-[0.95rem] text-white/45 leading-relaxed max-w-[36ch]">
              Project consulting and development management for commercial, industrial,
              hospitality, and real estate projects across Thailand.
            </p>
          </div>

          <div>
            <p className="eye mb-6">Navigation</p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3.5">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-white/50 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <p className="eye mb-6">Contact</p>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[0.95rem] text-white/50 hover:text-white transition-colors duration-150"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-[0.95rem] text-white/45">{siteConfig.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[0.8rem] text-white/30">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-white/25">{siteConfig.location}</p>
        </div>
      </div>
    </footer>
  )
}
