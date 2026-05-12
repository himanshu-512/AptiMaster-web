'use client'

import { Sidebar } from '@/components/app/sidebar'
import { Topbar } from '@/components/app/topbar'
import { useRequireAuth } from '@/lib/auth'

export function AppShell({ children }: { children: React.ReactNode }) {
  const auth = useRequireAuth()

  if (auth.loading || !auth.token) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
