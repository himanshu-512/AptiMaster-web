import type { Metadata } from 'next'
import { DownloadClient } from '@/components/download-client'

export const metadata: Metadata = {
  title: 'Download AptiRush Android App',
  description: 'Download the AptiRush Android APK for aptitude practice, smart quizzes, analytics, contests, and placement preparation.',
  alternates: {
    canonical: '/download',
  },
}

export default function DownloadPage() {
  return <DownloadClient />
}
