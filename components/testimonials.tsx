import { Reveal } from '@/components/motion'
import type { Testimonial } from '@/lib/types'

/**
 * Renders nothing until there is real content (the testimonials table is
 * empty today). One quote is set large across the page; several sit in two
 * columns.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  const single = testimonials.length === 1

  return (
    <section className="sec-sm bg-paper" aria-label="Client feedback">
      <div className={`wrap ${single ? '' : 'grid gap-x-10 gap-y-14 md:grid-cols-2'}`}>
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={(i % 2) * 100}>
            <figure className={`rule-t pt-8 ${single ? 'max-w-[56rem]' : ''}`}>
              <blockquote
                className={`text-ink tracking-[-0.018em] [font-variation-settings:'wdth'_108] font-[420] ${
                  single ? 'text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] leading-[1.22]' : 'text-[1.35rem] leading-[1.32]'
                }`}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-baseline gap-3 flex-wrap">
                <span className="font-semibold">{t.client_name}</span>
                {(t.client_title || t.client_company) && (
                  <span className="t-meta text-ink-muted">{[t.client_title, t.client_company].filter(Boolean).join(', ')}</span>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
