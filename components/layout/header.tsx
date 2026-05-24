'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navLinks, siteConfig } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link
            href="/"
            aria-label={`${siteConfig.name} - Home`}
            className="flex items-center"
          >
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              width={130}
              height={48}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors duration-150',
                  pathname === link.href
                    ? 'text-accent font-medium'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center text-sm font-semibold bg-accent text-white px-4 py-2 hover:bg-accent-dark transition-colors duration-200"
            >
              Discuss Your Project
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
            >
              <span className={cn('block h-px bg-ink transition-transform duration-200', menuOpen ? 'translate-y-[6px] rotate-45' : '')} />
              <span className={cn('block h-px bg-ink transition-opacity duration-200', menuOpen ? 'opacity-0' : '')} />
              <span className={cn('block h-px bg-ink transition-transform duration-200', menuOpen ? '-translate-y-[6px] -rotate-45' : '')} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-line bg-canvas px-6 pb-5 pt-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'py-2 text-sm',
                  pathname === link.href ? 'text-accent font-medium' : 'text-ink-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-line-subtle">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block text-center text-sm font-semibold bg-accent text-white px-4 py-2.5 hover:bg-accent-dark transition-colors duration-200"
            >
              Discuss Your Project
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
