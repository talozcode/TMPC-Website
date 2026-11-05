import type { MetadataRoute } from 'next'

const SITE_URL = 'https://tmpc-website.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/hero', '/theme-lab'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
