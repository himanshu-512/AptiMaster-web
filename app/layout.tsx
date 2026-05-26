import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { OfflineStatus } from '@/components/app/offline-status'
import { PwaRegistrar } from '@/components/pwa-registrar'
import { AuthProvider } from '@/lib/auth'
import { SITE_URL } from '@/lib/api'
import './globals.css'

const siteUrl = new URL(SITE_URL)

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'AptiRush',
  title: {
    default: 'AptiRush - AI Aptitude Practice, Mock Tests and Analytics',
    template: '%s | AptiRush',
  },
  description: 'Prepare for aptitude exams with AI-powered practice questions, smart quizzes, analytics, contests, leaderboards, and a downloadable Android app.',
  keywords: [
    'aptitude practice',
    'aptitude test preparation',
    'mock test app',
    'competitive exam preparation',
    'placement aptitude practice',
    'reasoning questions',
    'quantitative aptitude',
    'verbal ability',
    'AI learning app',
    'AptiRush',
  ],
  authors: [{ name: 'AptiRush' }],
  creator: 'AptiRush',
  publisher: 'AptiRush',
  category: 'education',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    locale: 'en_IN',
    title: 'AptiRush - AI Aptitude Practice and Mock Tests',
    description: 'Practice quantitative aptitude, reasoning, verbal ability, contests, and personalized analytics in one preparation platform.',
    siteName: 'AptiRush',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 512,
        height: 512,
        alt: 'AptiRush aptitude preparation platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AptiRush - AI Aptitude Practice and Mock Tests',
    description: 'Practice smarter with AI-powered quizzes, progress analytics, contests, and a mobile app.',
    images: ['/placeholder-logo.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'AptiRush',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="font-vars" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <OfflineStatus />
            <PwaRegistrar />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
