import type { MetadataRoute } from 'next'

const SITE_URL = process.env.BETTER_AUTH_URL ?? 'https://troca-copa-26.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Authenticated/app areas have no SEO value and shouldn't be crawled.
      disallow: ['/dashboard', '/album', '/repetidas', '/perfil', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
