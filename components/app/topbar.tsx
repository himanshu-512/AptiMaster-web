'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Flame, Sparkles, ChevronDown, LogOut, UserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth'
import { userApi, type Profile } from '@/lib/api'

export function Topbar() {
  const auth = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    userApi.profile().then(setProfile).catch(() => setProfile(null))
  }, [])

  const name = profile?.name || auth.user?.name || 'AptiMaster User'
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AM'

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="w-10 lg:hidden" />
        <div className="hidden lg:block" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{(profile?.xp || 0).toLocaleString()} XP</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">{profile?.streak || 0}</span>
          </div>

          <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
            {profile?.level || 1}
          </div>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted transition-colors">
                <Avatar className="w-9 h-9 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar || ''} alt={name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">Level {profile?.level || 1} - {(profile?.xp || 0).toLocaleString()} XP</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="gap-2">
                  <UserRound className="h-4 w-4" />
                  Profile settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={auth.logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
