'use client'

import Link from 'next/link'
import { CheckCircle2, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/lib/api'

export function ProfileCompletionBanner({ profile }: { profile: Profile | null }) {
  if (!profile || profile.profileComplete) return null

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Complete your profile</h2>
            <p className="text-sm text-muted-foreground">
              Add your goal, daily target, and preferred topics so your practice recommendations stay relevant.
            </p>
          </div>
        </div>
        <Button asChild className="rounded-xl sm:shrink-0">
          <Link href="/profile">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finish setup
          </Link>
        </Button>
      </div>
    </div>
  )
}
