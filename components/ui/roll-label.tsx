import type { CSSProperties } from 'react'

/**
 * A label that rolls on hover or keyboard focus of its link or button: each
 * letter slides up and out while its twin rises in, a few milliseconds behind
 * the letter before it (see .roll in globals.css). Pure CSS, so it costs no
 * JavaScript and does nothing at all with reduced motion.
 *
 * The two rolling copies are hidden from assistive tech; the plain label
 * beside them is what a screen reader reads.
 */
export function RollLabel({ text }: { text: string }) {
  const chars = Array.from(text)
  const row = (twin: boolean) => (
    <span className={twin ? 'roll-row roll-twin' : 'roll-row'} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} className="roll-ch" style={{ '--i': i } as CSSProperties}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
  return (
    <span className="roll">
      {row(false)}
      {row(true)}
      <span className="sr-only">{text}</span>
    </span>
  )
}
