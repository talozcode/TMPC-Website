'use client'

import { useBangkokTime } from '@/components/contact/bangkok-time'
import { CopyEmail } from '@/components/contact/copy-email'

/**
 * The foot of the opening band: Bangkok's clock, how TMPC replies, and the
 * address itself with a Copy beside it. Three cells on one rule.
 */
export function ContactStrip({ email }: { email: string }) {
  const time = useBangkokTime()
  return (
    <div className="cstrip">
      <p className="cstrip-cell">
        <span className="t-meta text-fog-muted">Bangkok</span>
        <span className="cstrip-time" aria-label={time ? `Bangkok time ${time}` : undefined}>
          {time ?? '--:--'}
        </span>
        <span className="t-meta text-fog-muted">GMT+7</span>
      </p>
      <p className="cstrip-cell">
        <span className="t-meta text-fog-muted">Reply</span>
        <span className="text-fog">We reply by email.</span>
      </p>
      <div className="cstrip-cell cstrip-mail">
        <a href={`mailto:${email}`} className="cstrip-link">
          {email}
        </a>
        <CopyEmail email={email} />
      </div>
    </div>
  )
}
