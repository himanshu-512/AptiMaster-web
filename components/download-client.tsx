'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, ExternalLink, ShieldCheck, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_DOWNLOAD_URL } from '@/lib/api'

export function DownloadClient() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStarted(true)
      window.location.href = APP_DOWNLOAD_URL
    }, 900)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-3xl border border-border/60 bg-card p-6 shadow-xl sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">AptiMaster Android</p>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold">Download starting...</h1>
            </div>
          </div>

          <div className="rounded-2xl bg-muted/60 p-5">
            <div className="mb-4 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div>
                <h2 className="font-semibold">Your APK is hosted on Google Drive</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  If Google Drive shows a large-file confirmation screen, tap the download button shown there. The app file is around 128 MB.
                </p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div className={`h-full rounded-full bg-primary transition-all duration-1000 ${started ? 'w-full' : 'w-1/3'}`} />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild className="h-12 rounded-2xl">
              <a href={APP_DOWNLOAD_URL}>
                <Download className="mr-2 h-5 w-5" />
                Download manually
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl">
              <Link href="/">
                <ExternalLink className="mr-2 h-5 w-5" />
                Back to website
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
