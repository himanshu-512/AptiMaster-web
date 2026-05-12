import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'AptiMaster - Master Your Aptitude',
  description: 'AI-powered aptitude preparation platform. Practice smarter, compete harder, and achieve your exam goals with personalized learning paths and real-time analytics.',
  keywords: ['aptitude', 'exam preparation', 'competitive exams', 'practice tests', 'AI learning', 'analytics'],
  authors: [{ name: 'AptiMaster' }],
  creator: 'AptiMaster',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'AptiMaster - Master Your Aptitude',
    description: 'AI-powered aptitude preparation platform for competitive exam success.',
    siteName: 'AptiMaster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AptiMaster - Master Your Aptitude',
    description: 'AI-powered aptitude preparation platform for competitive exam success.',
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
