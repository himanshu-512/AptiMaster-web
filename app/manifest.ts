import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AptiRush - Aptitude Practice App',
    short_name: 'AptiRush',
    description: 'AI-powered aptitude practice, mock tests, analytics, contests, and leaderboard preparation.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#4f46e5',
    orientation: 'portrait-primary',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
