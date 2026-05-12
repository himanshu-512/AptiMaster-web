import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - AptiMaster',
  description: 'Sign in to your AptiMaster account to continue your aptitude preparation journey.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {children}
    </div>
  )
}
