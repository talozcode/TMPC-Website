'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks, siteConfig } from '@/lib/data'
import { ButtonLink } from '@/components/ui/arrow-link'
import { getLenis } from '@/components/anim/smooth-scroll'

/**
 * Below 900px: a full-screen ink panel that wipes down from the header, with
 * the links rising in after it. Escape and the toggle close it, focus moves in
 * on open and back to the toggle on close, and the page behind cannot scroll.
 */
const noopSubscribe = () => () => {}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)
  // The portal target only exists in the browser: false on the server, true after hydration.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // A route change closes the menu (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const root = document.documentElement
    if (open) {
      root.style.overflow = 'hidden'
      getLenis()?.stop()
      const first = panelRef.current?.querySelector<HTMLElement>('a')
      window.setTimeout(() => first?.focus(), 60)
    } else {
      root.style.overflow = ''
      getLenis()?.start()
    }
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [btnRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[]
        const i = items.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          items[items.length - 1].focus()
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault()
          items[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="burger shrink-0 min-[900px]:hidden"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
        style={open ? { color: 'var(--color-fog)' } : undefined}
      >
        <span />
      </button>
      {mounted &&
        createPortal(
          <div
            id="site-menu"
            ref={panelRef}
            className="menu min-[900px]:hidden"
            data-open={open}
            aria-hidden={!open}
            inert={!open}
          >
            <nav aria-label="Menu" className="flex-1">
              <ul>
                {navLinks.map((l, i) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="menu-link"
                      style={{ '--i': i } as React.CSSProperties}
                      aria-current={pathname === l.href ? 'page' : undefined}
                    >
                      <span className="t-meta text-fog-muted w-8">{String(i + 1).padStart(2, '0')}</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="grid gap-3 pt-8">
              <ButtonLink href="/contact" className="w-full">Discuss Your Project</ButtonLink>
              <a href={`mailto:${siteConfig.email}`} className="t-meta text-fog-muted text-center py-2">
                {siteConfig.email}
              </a>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
