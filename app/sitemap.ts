import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'

const SITE_URL = 'https://tmpc-website.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug ?? p.id}`,
    lastModified: p.updated_at ?? undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Only once there is at least one published post.
  const blogRoutes: MetadataRoute.Sitemap =
    posts.length > 0
      ? [
          { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
          ...posts.map((p) => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            lastModified: p.updated_at ?? undefined,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          })),
        ]
      : []

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
