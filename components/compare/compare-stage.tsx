'use client'

import Image from 'next/image'
import type { CSSProperties, ReactNode, Ref } from 'react'
import type { CompareImage } from '@/lib/compare-slots'
import type { CompareAxis } from './use-compare'

export type CompareShape = 'x' | 'y' | 'diagonal' | 'lens' | 'fade'

// No z-index: each chip stacks inside its own layer, so the top layer (and its
// clip) paints over the base image's chip instead of the chip floating above it.
const CHIP = 't-meta absolute bg-ink-deep/80 text-fog px-2.5 py-1.5'

/**
 * Two photographs stacked in one frame. `top` names the image that is clipped
 * by `shape` (see .cmp in globals.css); the other is the full-bleed base. The
 * before image always carries the desaturated treatment, so the two states
 * read apart at a glance whichever one is on top.
 *
 * `initial` is server-rendered as --pos, so without JavaScript the stage shows
 * that split rather than an empty box.
 */
export function CompareStage({
  before,
  after,
  top = 'before',
  shape,
  initial = 50,
  sizes,
  preload = false,
  labels,
  stageRef,
  className = '',
  style,
  children,
  ...rest
}: {
  before: CompareImage
  after: CompareImage
  top?: 'before' | 'after'
  shape: CompareShape
  initial?: number
  sizes: string
  preload?: boolean
  /** Chips on the images. Omit for variants that label themselves (the toggle). */
  labels?: { before: string; after: string }
  stageRef?: Ref<HTMLDivElement>
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const base = top === 'before' ? after : before
  const over = top === 'before' ? before : after
  const isBefore = (img: CompareImage) => img === before
  const img = (i: CompareImage, eager: boolean) => (
    <Image
      src={i.src}
      alt={i.alt}
      fill
      draggable={false}
      sizes={sizes}
      preload={eager}
      className={`object-cover pointer-events-none ${isBefore(i) ? 'grayscale-[0.85] contrast-[1.05]' : ''}`}
    />
  )

  // Chip placement follows the seam: each label sits on its own image's side,
  // so the top one is clipped away with its image and the base one is covered
  // by the top image as the seam passes over it. At either end only one shows.
  const overPos = 'top-4 left-4'
  const basePos = shape === 'y' ? 'bottom-4 left-4' : shape === 'x' ? 'top-4 right-4' : 'top-4 left-4'

  return (
    <div
      ref={stageRef}
      data-shape={shape}
      className={`cmp ${className}`}
      style={{ '--pos': initial, ...style } as CSSProperties}
      {...rest}
    >
      <div className="cmp-layer">
        {img(base, preload)}
        {labels && <span className={`${CHIP} ${basePos}`}>{isBefore(base) ? labels.before : labels.after}</span>}
      </div>
      <div className="cmp-layer cmp-top">
        {img(over, preload)}
        {labels && <span className={`${CHIP} ${overPos}`}>{isBefore(over) ? labels.before : labels.after}</span>}
      </div>
      {children}
    </div>
  )
}

/**
 * The seam: a 2px signal line across the stage and, when interactive, the
 * signal-orange square handle that is the ARIA slider. The overlay spans the
 * stage and is translated by --pos, so moving it never touches layout.
 */
export function CompareSeam({
  axis,
  handleRef,
  label = 'Reveal before or after',
  initial = 50,
  valueText,
  interactive = true,
  touchHandle = false,
  className = '',
  onKeyDown,
}: {
  axis: CompareAxis
  handleRef?: Ref<HTMLDivElement>
  label?: string
  initial?: number
  valueText?: string
  interactive?: boolean
  /** The handle alone takes touch drags (touch-action: none), the stage keeps scrolling. */
  touchHandle?: boolean
  className?: string
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}) {
  const x = axis === 'x'
  return (
    <div className={`cmp-seam ${className}`} aria-hidden={interactive ? undefined : true}>
      <span className={`cmp-edge absolute bg-signal ${x ? 'inset-y-0 left-0 w-[2px] -translate-x-1/2' : 'inset-x-0 top-0 h-[2px] -translate-y-1/2'}`} />
      {interactive && (
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation={x ? 'horizontal' : 'vertical'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(initial)}
          aria-valuetext={valueText ?? `${Math.round(initial)}% before`}
          onKeyDown={onKeyDown}
          className={`group absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 pointer-events-auto focus:outline-none ${
            x ? 'left-0 top-1/2 cursor-ew-resize' : 'top-0 left-1/2 cursor-ns-resize'
          } ${touchHandle ? 'touch-none' : ''}`}
        >
          <span className="cmp-knob w-full h-full bg-signal text-ink-deep grid place-items-center group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-fog">
            <HandleGlyph className={x ? '' : 'rotate-90'} />
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * The handle's two chevrons. While a drag is held (data-dragging on the stage)
 * they part a little and the square presses in, so the grip reads as taken;
 * on release they close back. Pure state feedback, no hover (see .cmp-knob).
 */
export function HandleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 overflow-visible ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path className="cmp-chev-l" strokeLinecap="square" strokeWidth={1.75} d="M9 6.5 3.5 12 9 17.5" />
      <path className="cmp-chev-r" strokeLinecap="square" strokeWidth={1.75} d="M15 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  )
}

/**
 * The touch and keyboard fallback for variants that otherwise live on hover:
 * a square two-state switch that sits on the image and doubles as its labels.
 */
export function CompareToggle({
  showing,
  onShow,
  labels,
  className = 'bottom-4 left-4',
}: {
  showing: 'before' | 'after'
  onShow: (side: 'before' | 'after') => void
  labels: { before: string; after: string }
  className?: string
}) {
  return (
    <div role="group" aria-label="Show before or after" className={`absolute z-[3] flex bg-ink-deep/80 ${className}`}>
      {(['before', 'after'] as const).map((side) => (
        <button
          key={side}
          type="button"
          aria-pressed={showing === side}
          onClick={() => onShow(side)}
          className={`t-meta min-h-10 px-3 transition-colors duration-300 cursor-pointer focus-visible:outline-fog focus-visible:-outline-offset-2 ${
            showing === side ? 'bg-signal text-ink-deep' : 'text-fog hover:bg-ink'
          }`}
        >
          {labels[side]}
        </button>
      ))}
    </div>
  )
}
