'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navSections = [
  {
    items: [
      { href: '/admin/projects', label: 'Projects' },
      { href: '/admin/categories', label: 'Categories' },
    ],
  },
  {
    items: [
      { href: '/admin/inquiries', label: 'Inquiries' },
    ],
  },
  {
    items: [
      { href: '/admin/blog', label: 'Blog / Insights' },
      { href: '/admin/testimonials', label: 'Testimonials' },
    ],
  },
  {
    items: [
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/team', label: 'Team' },
    ],
  },
  {
    items: [
      { href: '/admin/media', label: 'Media Library' },
      { href: '/admin/seo', label: 'SEO' },
      { href: '/admin/settings', label: 'Settings' },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-canvas-dark flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-[0.5rem] font-bold text-accent uppercase tracking-[0.3em] mb-1">TMPC</p>
        <p className="text-sm font-bold text-white tracking-tight">Admin</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-1 pt-1 border-t border-white/[0.06]' : ''}>
            {section.items.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-5 py-2.5 text-sm transition-colors duration-150 ${
                    active
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          View Site
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={handleLogout}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
