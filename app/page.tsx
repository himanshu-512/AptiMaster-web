'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { AnalyticsSection } from '@/components/landing/analytics-section'
import { LeaderboardSection } from '@/components/landing/leaderboard-section'
import { ContestSection } from '@/components/landing/contest-section'
import { AIRecommendationSection } from '@/components/landing/ai-recommendation-section'
import { MobileAppSection } from '@/components/landing/mobile-app-section'
import { Footer } from '@/components/landing/footer'
import { useAuth } from '@/lib/auth'

export default function LandingPage() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.loading && auth.token) {
      router.replace('/dashboard')
    }
  }, [auth.loading, auth.token, router])

  if (auth.loading || auth.token) {
    return (
      <main className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="analytics">
        <AnalyticsSection />
      </section>
      <LeaderboardSection />
      <section id="contests">
        <ContestSection />
      </section>
      <AIRecommendationSection />
      <MobileAppSection />
      <Footer />
    </main>
  )
}
