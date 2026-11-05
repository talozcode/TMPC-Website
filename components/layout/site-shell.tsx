'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import { SmoothScroll } from '@/components/anim/smooth-scroll'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
      {/* Lenis inertial scroll, desktop fine pointers only, off for reduced motion. */}
      <SmoothScroll />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
