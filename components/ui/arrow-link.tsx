import Link from 'next/link'
import type { ReactNode } from 'react'
import { Magnetic } from '@/components/ui/magnetic'
import { RollLabel } from '@/components/ui/roll-label'

/**
 * Buttons and links with v3's hover motion, in the professional styling
 * (feat/professional, 05/11/2026). Square, thin rules, no shadow.
 */

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
 * The site's button with motion. `primary` is the solid navy `.btn` (paper on
 * a navy band); `ghost` is the outlined `.btn-2`. On hover a fill wipes in
 * from the left, the label rolls through to its twin and the arrow is handed
 * on; on desktop the primary leans a few pixels toward the pointer.
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
  const cls = `${variant === 'ghost' ? 'btn-2' : 'btn'} btn-x ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim()
  const inner = (
    <>
      {typeof children === 'string' ? <RollLabel text={children} /> : <span>{children}</span>}
      {arrow && <ArrowSwap className="btn-arrow" />}
    </>
  )
  const el = href.startsWith('/') ? (
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
    <Link href={href} className={`lnk lnk-x ${className}`}>
      {children}
      <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
    </Link>
  )
}
