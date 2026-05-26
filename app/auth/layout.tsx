import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - AptiRush',
  description: 'Sign in to your AptiRush account to continue your aptitude preparation journey.',
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
