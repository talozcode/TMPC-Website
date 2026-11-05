import Link from 'next/link'
import type { ReactNode } from 'react'
import { Magnetic } from '@/components/ui/magnetic'
import { RollLabel } from '@/components/ui/roll-label'

/** The arrow glyph used in buttons and links. Decorative. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1.5 8h12M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

/**
 * Two arrows in one slot. On hover or focus of the link around it, the first
 * leaves forward and the second arrives from behind, so the arrow is handed
 * on rather than nudged. Size it with a width and height class.
 */
export function ArrowSwap({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <span className={`arrow-swap ${className}`} aria-hidden="true">
      <Arrow />
      <Arrow />
    </span>
  )
}

/**
 * The site's button. `primary` is the signal-orange action; `ghost` is the
 * outlined companion. Square corners, a fill that wipes in from the left on
 * hover, the label rolls through to its twin, the arrow is handed on, and on
 * desktop the primary leans a few pixels toward the pointer.
 * Renders a Next Link for internal paths and a plain anchor otherwise.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size,
  className = '',
  arrow = true,
  magnetic,
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'sm'
  className?: string
  arrow?: boolean
  magnetic?: boolean
}) {
  const cls = `btn ${variant === 'ghost' ? 'btn-ghost' : ''} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim()
  const inner = (
    <>
      {typeof children === 'string' ? <RollLabel text={children} /> : <span>{children}</span>}
      {arrow && <ArrowSwap className="btn-arrow" />}
    </>
  )
  const internal = href.startsWith('/')
  const el = internal ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  )
  return (magnetic ?? variant === 'primary') && size !== 'sm' ? <Magnetic>{el}</Magnetic> : el
}

/** A text link with a rule that redraws on hover and an arrow that is handed on. */
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`lnk ${className}`}>
      {children}
      <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
    </Link>
  )
}
