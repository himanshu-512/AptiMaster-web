import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/dashboard', '/practice', '/study', '/analytics', '/leaderboard', '/contests', '/profile', '/quiz'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
