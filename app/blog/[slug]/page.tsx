import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/motion'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'

async function getPost(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  return data as BlogPost | null
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
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
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
      <section className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="wrap relative z-10 py-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="eye">Insights</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6 max-w-[24ch]">{post.title}</h1>
          </Reveal>
          {post.published_at && (
            <Reveal delay={170}>
              <p className="t-lead !text-white/50 mt-6">{formatDate(post.published_at)}</p>
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-canvas-subtle sec-tight">
        <div className="wrap max-w-[52rem]">
          {post.cover_image_url && (
            <Reveal variant="image">
              <div className="panel relative aspect-[16/9] mb-10">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
          <Reveal className="space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="t-body text-ink-secondary leading-relaxed whitespace-pre-line">
                  {p}
                </p>
              ))
            ) : (
              <p className="t-body text-ink-muted">This post has no content yet.</p>
            )}
          </Reveal>

          <Reveal delay={80} className="mt-14 pt-8 border-t border-line">
            <Link href="/blog" className="lnk">
              &#8592; All insights
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
