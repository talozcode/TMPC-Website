'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MobileNav } from './mobile-nav'
import { navLinks, siteConfig } from '@/lib/data'

/**
 * Floating translucent chrome with the page passing underneath, rather than an
 * opaque strip that permanently consumes a band of the viewport. The separation
 * from the content appears only once content is actually behind it, as a scroll
 * edge effect instead of a 1px rule sitting there against nothing.
 */
export function Header() {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ticking = false
    const update = () => {
      ticking = false
      el.dataset.scrolled = String(window.scrollY > 8)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="hdr on-dark" ref={ref}>
      <div className="wrap flex items-center gap-6 h-[4.4rem]">
        <Link href="/" aria-label={`${siteConfig.name} - Home`} className="flex items-center mr-auto press">
          <Image
            src="/logo.svg"
            alt={siteConfig.name}
            width={130}
            height={48}
            className="h-9 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden min-[900px]:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              data-active={pathname === link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="btn btn-sm hidden min-[900px]:inline-flex">
          Discuss Your Project
        </Link>

        <MobileNav />
      </div>
    </header>
  )
}
