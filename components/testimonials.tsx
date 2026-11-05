import { Reveal } from '@/components/motion'
import type { Testimonial } from '@/lib/types'

/**
 * Renders nothing until there is real content: the testimonials table and its
 * /admin/testimonials editor already existed, but no public page read from it,
 * so a service that is inherently hard to verify from overseas had zero
 * third-party proof anywhere on the site. This is the missing display half.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section className="bg-canvas sec">
      <div className="wrap">
        <Reveal className="mb-[clamp(2.5rem,4vw,3.5rem)] text-center">
          <p className="eye justify-center">Client Feedback</p>
          <h2 className="t-h1 text-ink mt-6">What Clients Say</h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 80} className="flex">
              <figure className="card flex-1 p-8 lg:p-9 flex flex-col">
                <blockquote className="t-body text-ink-secondary leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 pt-6 border-t border-line">
                  <p className="font-display font-semibold text-ink">{t.client_name}</p>
                  {(t.client_title || t.client_company) && (
                    <p className="text-[0.85rem] text-ink-muted mt-1">
                      {[t.client_title, t.client_company].filter(Boolean).join(', ')}
                    </p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
