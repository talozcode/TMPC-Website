'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MobileNav } from './mobile-nav'
import { ButtonLink } from '@/components/ui/arrow-link'
import { navLinks, siteConfig } from '@/lib/data'

/**
 * Fixed chrome that takes its tone from whatever it is sitting over: clear,
 * with light type, over a dark band (every page opens on one), and frosted
 * paper once the page beneath is light. It tucks away while reading down and
 * returns on any scroll up; focus inside it always keeps it visible (CSS).
 */
export function Header() {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      const probe = el.offsetHeight / 2
      const under = document
        .elementsFromPoint(window.innerWidth / 2, probe)
        .find((n) => !el.contains(n))
      const dark = under?.closest('[data-tone="dark"]')
      el.dataset.tone = dark ? 'dark' : 'light'
      el.dataset.scrolled = String(y > 24)
      if (Math.abs(y - lastY) > 6) {
        el.dataset.hidden = String(y > lastY && y > 320)
        lastY = y
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (ref.current) ref.current.dataset.hidden = 'false'
  }, [pathname])

  // The nav underline enters from the side the pointer came in by and leaves
  // by the side it went out (see .nav-link in globals.css).
  const aim = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.dataset.o = e.clientX < r.left + r.width / 2 ? 'left' : 'right'
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="hdr" ref={ref} data-tone="dark">
      <div className="wrap flex items-center gap-3 min-[900px]:gap-10 h-[var(--hdr-h)]">
        <Link href="/" aria-label={`${siteConfig.name}, home`} className="mr-auto flex items-center press">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={96} height={30} className="hdr-logo" />
        </Link>

        <nav aria-label="Main" className="hidden min-[900px]:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={isActive(link.href) ? 'page' : undefined}
              onPointerEnter={aim}
              onPointerLeave={aim}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href="/contact" size="sm" className="hidden min-[900px]:inline-flex">
          Discuss Your Project
        </ButtonLink>

        {/* Below 900px the nav folds into the menu, but the one action stays
            in reach on every page: phones and tablets otherwise open on a
            screen with no way to start a conversation. Hidden on the contact
            page itself, where the form is already the first thing. */}
        {pathname !== '/contact' && (
          <ButtonLink href="/contact" size="sm" arrow={false} className="hdr-cta min-[900px]:hidden">
            Discuss Your Project
          </ButtonLink>
        )}

        <MobileNav />
      </div>
    </header>
  )
}
