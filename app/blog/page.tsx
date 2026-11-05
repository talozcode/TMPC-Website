import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal, HeroParallax } from '@/components/motion'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Insights: Project Delivery in Thailand',
  description:
    'Notes from TMPC on managing construction, fit-out, and development projects in Thailand: contractors, approvals, and coordination for international owners.',
  alternates: { canonical: '/blog' },
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogIndexPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const posts = (rows as BlogPost[]) ?? []

  return (
    <>
      <section id="blog-hero" className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
        <div className="wrap relative z-10 py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <p className="eye">Insights</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6">Notes on delivering in Thailand</h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="t-lead !text-white/60 mt-7 max-w-[60ch]">
              What we have learned coordinating contractors, consultants, and approvals for
              international owners building in Thailand.
            </p>
          </Reveal>
        </div>
      </section>
      <HeroParallax targetId="blog-hero" amount={8} />

      <section className="bg-canvas sec">
        <div className="wrap">
          {posts.length === 0 ? (
            <Reveal>
              <p className="t-body text-ink-muted max-w-[50ch]">
                No posts published yet. Check back soon, or{' '}
                <Link href="/contact" className="lnk">
                  get in touch
                </Link>{' '}
                if you have a question about a project in Thailand.
              </p>
            </Reveal>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 80} className="flex">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="card card-hover press-sm group flex flex-col flex-1 overflow-hidden"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-7 lg:p-8 flex flex-col flex-1">
                      {post.published_at && (
                        <p className="text-[0.68rem] font-bold text-accent uppercase tracking-[0.18em] mb-3">
                          {formatDate(post.published_at)}
                        </p>
                      )}
                      <h2 className="t-h4 text-ink mb-3">{post.title}</h2>
                      {post.excerpt && (
                        <p className="text-[0.92rem] text-ink-muted leading-relaxed flex-1">{post.excerpt}</p>
                      )}
                      <span className="lnk mt-6 inline-flex w-fit">
                        Read more <span aria-hidden="true">&#8594;</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
