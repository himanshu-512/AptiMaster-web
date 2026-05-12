import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { AnalyticsSection } from '@/components/landing/analytics-section'
import { LeaderboardSection } from '@/components/landing/leaderboard-section'
import { ContestSection } from '@/components/landing/contest-section'
import { AIRecommendationSection } from '@/components/landing/ai-recommendation-section'
import { MobileAppSection } from '@/components/landing/mobile-app-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
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
