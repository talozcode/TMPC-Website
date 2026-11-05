import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/motion'
import { getPosts } from '@/lib/content'
import { PageHero } from '@/components/sections/page-hero'
import { CtaBand } from '@/components/sections/cta-band'
import { Arrow, ButtonLink } from '@/components/ui/arrow-link'

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
  const posts = await getPosts()

  return (
    <>
      <PageHero
        label="Insights"
        title={
          <>
            Notes on delivering <em>in Thailand</em>
          </>
        }
        lead="What we have learned coordinating contractors, consultants, and approvals for international owners building in Thailand."
      />

      <section className="sec bg-paper">
        <div className="wrap">
          {posts.length === 0 ? (
            <Reveal className="grid lg:grid-cols-12 gap-x-10 gap-y-8">
              <p className="t-meta text-ink-muted lg:col-span-3 lg:pt-3">No notes yet</p>
              <div className="lg:col-span-8">
                <p className="t-h2 max-w-[24ch]">The first notes are on their way.</p>
                <p className="t-body mt-5">
                  No posts published yet. Check back soon, or get in touch if you have a question about a project in Thailand.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink href="/contact">Discuss Your Project</ButtonLink>
                  <ButtonLink href="/projects" variant="ghost">See our projects</ButtonLink>
                </div>
              </div>
            </Reveal>
          ) : (
            <ol className="border-b border-rule">
              {posts.map((post, i) => (
                <li key={post.id}>
                  <Reveal delay={Math.min(i, 3) * 70}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="svc-row group !grid-cols-1 md:!grid-cols-[10rem_minmax(0,1fr)_14rem_2.5rem] md:items-start"
                    >
                      <span className="t-meta text-ink-muted md:pt-2">{formatDate(post.published_at)}</span>
                      <span>
                        <span className="t-h2 block">{post.title}</span>
                        {post.excerpt && <span className="t-body block mt-3 !max-w-[58ch]">{post.excerpt}</span>}
                      </span>
                      {post.cover_image_url ? (
                        <span className="frame aspect-[4/3] hidden md:block">
                          <Image src={post.cover_image_url} alt="" fill sizes="14rem" className="object-cover photo" />
                        </span>
                      ) : (
                        <span className="hidden md:block" />
                      )}
                      <Arrow className="svc-arrow w-5 h-5 md:mt-2 text-ink" />
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
