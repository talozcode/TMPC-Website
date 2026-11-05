import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/motion'
import { SplitHeading } from '@/components/anim/split-heading'
import { CtaBand } from '@/components/sections/cta-band'
import { getPost, getPosts } from '@/lib/content'
import { Arrow } from '@/components/ui/arrow-link'

// Cached and refreshed at most once a minute; admin edits call revalidatePath so they show sooner.
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const description = post.excerpt ?? undefined
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      images: [post.cover_image_url || '/images/hero-home.jpg'],
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // Authored as plain text in the admin (no markdown/HTML processing), so a
  // blank line between paragraphs is the only structure to honor here.
  const paragraphs = (post.content ?? '').split(/\n\s*\n/).filter(Boolean)

  return (
    <>
      <section className="dark-band" data-tone="dark">
        <div className="wrap pt-[calc(var(--hdr-h)+clamp(3rem,7vw,6rem))] pb-[clamp(3.5rem,7vw,6rem)]">
          <div className="max-w-[56rem]">
            <Reveal>
              <Link href="/blog" className="group t-meta text-fog-muted hover:text-fog inline-flex items-center gap-3 transition-colors">
                <Arrow className="w-4 h-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
                All insights
              </Link>
            </Reveal>
            {post.published_at && (
              <Reveal delay={60}>
                <p className="t-meta text-fog-muted mt-10 flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
                  {formatDate(post.published_at)}
                </p>
              </Reveal>
            )}
            <SplitHeading as="h1" on="load" delay={100} className="t-h1 text-fog mt-7">
              {post.title}
            </SplitHeading>
            {post.excerpt && (
              <Reveal delay={260}>
                <p className="t-lead mt-7">{post.excerpt}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <article className="sec bg-paper">
        <div className="wrap">
          <div className="max-w-[56rem]">
            {post.cover_image_url && (
              <Reveal variant="image">
                <div className="frame aspect-[16/9] mb-14">
                  <Image src={post.cover_image_url} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 56rem" className="object-cover" />
                </div>
              </Reveal>
            )}
            <Reveal className="space-y-6 max-w-[64ch]">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`whitespace-pre-line ${
                      i === 0 ? "text-[1.3rem] leading-[1.55] text-ink [font-variation-settings:'wdth'_104]" : 't-body !text-[1.06rem] !leading-[1.75]'
                    }`}
                  >
                    {p}
                  </p>
                ))
              ) : (
                <p className="t-body">This post has no content yet.</p>
              )}
            </Reveal>

            <div className="mt-16 pt-8 border-t border-rule">
              <Link href="/blog" className="group t-meta text-ink-muted hover:text-ink inline-flex items-center gap-3 transition-colors">
                <Arrow className="w-4 h-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1" />
                All insights
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CtaBand
        title={
          <>
            Have a project in <em>Thailand?</em>
          </>
        }
        lead="Talk to TMPC before work begins."
      />
    </>
  )
}
