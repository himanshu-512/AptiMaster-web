'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Target,
  Brain,
  Bookmark,
  XCircle,
  Shuffle,
  Flame,
  Trophy,
  TrendingUp,
  ChevronRight,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { analyticsApi, getApiMessage, leaderboardApi, userApi, type AnalyticsResponse, type AiSuggestion, type Profile } from '@/lib/api'
import { toast } from 'sonner'
import { DashboardSkeleton } from '@/components/app/dashboard-skeleton'
import { ProfileCompletionBanner } from '@/components/app/profile-completion-banner'

const practiceShortcuts = [
  { label: 'Topic Practice', desc: 'Practice by topic', icon: Target, href: '/practice?type=topic', color: 'from-primary to-primary/80' },
  { label: 'Smart Practice', desc: 'AI-optimized', icon: Brain, href: '/quiz?type=smart&count=10&timed=true', color: 'from-accent to-accent/80' },
  { label: 'Wrong Questions', desc: 'Review mistakes', icon: XCircle, href: '/quiz?type=wrong&count=10&timed=true', color: 'from-destructive to-destructive/80' },
  { label: 'Bookmarked', desc: 'Saved questions', icon: Bookmark, href: '/quiz?type=bookmarks&count=10&timed=true', color: 'from-warning to-warning/80' },
  { label: 'Random Practice', desc: 'Mixed topics', icon: Shuffle, href: '/quiz?type=random&count=10&timed=true', color: 'from-success to-success/80' },
]

function emptyAnalytics(): AnalyticsResponse {
  return {
    totalQuestions: 0,
    accuracy: 0,
    trend: [0, 0, 0, 0, 0, 0, 0],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    quant: 0,
    reasoning: 0,
    verbal: 0,
    weakTopic: 'N/A',
    avgTime: 0,
  }
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsResponse>(emptyAnalytics())
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const [profileData, analyticsData, suggestionData] = await Promise.all([
          userApi.profile(),
          analyticsApi.weekly(),
          analyticsApi.suggestion().catch(() => null),
        ])
        setProfile(profileData)
        setAnalytics(analyticsData)
        setSuggestion(suggestionData)
        if (profileData?.id) {
          leaderboardApi.rank(profileData.id).then(setRank).catch(() => setRank(null))
        }
      } catch (err) {
        toast.error(getApiMessage(err, 'Dashboard data is not available right now.'))
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const dailyGoal = profile?.dailyGoal || 10
  const xpToNextLevel = ((profile?.level || 1) * 500)
  const xpProgress = Math.min(100, (((profile?.xp || 0) % 500) / 500) * 100)
  const weeklyData = useMemo(() => {
    const labels = analytics.labels?.length ? analytics.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((day, index) => ({
      day,
      accuracy: Math.round(analytics.trend?.[index] || 0),
      questions: 0,
    }))
  }, [analytics])

  if (loading) {
    return <DashboardSkeleton />
  }

  const stats = [
    { label: 'Total Questions', value: String(profile?.totalQuestions || analytics.totalQuestions || 0), icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Accuracy', value: `${Math.round(profile?.accuracy || analytics.accuracy || 0)}%`, icon: Target, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Global Rank', value: rank ? `#${rank}` : 'N/A', icon: Trophy, color: 'text-warning', bgColor: 'bg-warning/10' },
    { label: 'Global Score', value: String(profile?.globalScore || 0), icon: TrendingUp, color: 'text-accent', bgColor: 'bg-accent/10' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <ProfileCompletionBanner profile={profile} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-sora)] text-2xl lg:text-3xl font-bold">
            Welcome back, {profile?.name || 'AptiMaster User'}!
          </h1>
          <p className="text-muted-foreground mt-1">Continue your preparation with live backend progress.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-white">
            {profile?.level || 1}
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Level {profile?.level || 1}</span>
              <span className="text-xs text-muted-foreground">{profile?.xp || 0}/{xpToNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-warning/10 to-card border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-sora)] text-4xl font-bold text-warning">{profile?.streak || 0}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Built from submitted attempts</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-warning/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Daily Goal</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-sora)] text-4xl font-bold">{dailyGoal}</span>
                  <span className="text-muted-foreground">questions</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>
            <Progress value={Math.min(100, (analytics.totalQuestions / Math.max(dailyGoal, 1)) * 100)} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">Update this target from profile.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4 lg:p-6">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-[family-name:var(--font-sora)] text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold">Quick Practice</h2>
          <Link href="/practice" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {practiceShortcuts.map((item) => (
            <Link key={item.label} href={item.href} className="group p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} domain={[0, 100]} />
                    <Area type="monotone" dataKey="accuracy" stroke="oklch(0.65 0.22 265)" strokeWidth={2} fill="url(#colorAccuracy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="font-[family-name:var(--font-sora)] text-lg">AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recommended Area</span>
                  <span className="text-xs text-destructive font-semibold">{Math.round(suggestion?.accuracy || 0)}%</span>
                </div>
                <p className="font-semibold text-sm mb-2">{suggestion?.suggestedTopic || analytics.weakTopic || 'Quantitative'}</p>
                <p className="text-xs text-muted-foreground">{suggestion?.reason || 'Use smart practice to focus on your weakest topic.'}</p>
              </div>
              <Button asChild className="w-full rounded-xl">
                <Link href="/quiz?type=smart&count=10&timed=true">
                  <Brain className="w-4 h-4 mr-2" />
                  Start Smart Practice
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Profile Goal</CardTitle>
            <Link href="/profile" className="text-sm text-primary hover:underline flex items-center gap-1">
              Edit <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile?.examGoal || 'Preparation goal not set'}</p>
                <p className="text-xs text-muted-foreground">{profile?.target || 'Set your exam/company target in profile'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {dailyGoal} Q/day
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
