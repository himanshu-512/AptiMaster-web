import { Metadata } from 'next'
import { AppShell } from '@/components/app/app-shell'

export const metadata: Metadata = {
  title: {
    template: '%s | AptiRush',
    default: 'Dashboard | AptiRush',
  },
  description: 'Your personalized aptitude preparation dashboard.',
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
