import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 font-[family-name:var(--font-sora)] text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          This page is not available. Go back to AptiMaster and continue your preparation.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Link>
        </Button>
      </div>
    </main>
  )
}
