import Link from 'next/link'
import { Reveal } from '@/components/motion'
import { ArrowSwap } from '@/components/ui/arrow-link'
import { serviceSlug } from '@/lib/service-meta'

export interface CoreService {
  number: string
  title: string
  description: string
}

/**
 * The five services as ruled rows you can hit anywhere, after v3's service
 * rows. v3's CoreServices paired the lead services with a sticky stock
 * photograph; the professional pass shows no stock, so the motion lives in
 * the rows instead. Pointing at a row draws a teal rule across its top from
 * the left, steps the title in, lifts the number to teal and hands the arrow
 * on, while the other rows step back. CSS only (globals.css, Homepage motion).
 */
export function CoreServices({ services }: { services: CoreService[] }) {
  return (
    <ul className="svc-list">
      {services.map((s, i) => (
        <Reveal key={s.title} as="li" delay={i * 70}>
          <Link href={`/services#${serviceSlug(s.title)}`} className="svc-row">
            <span className="svc-num t-meta">{s.number}</span>
            <span className="svc-title t-h2 text-ink">{s.title}</span>
            <span className="svc-desc text-[0.98rem] text-ink-muted max-w-[52ch]">{s.description}</span>
            <ArrowSwap className="svc-arrow w-5 h-5 max-md:hidden justify-self-end" />
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}
