'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Clock, Flame, ArrowUp, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { analyticsApi, getApiMessage, userApi, type AnalyticsResponse, type AiSuggestion, type Profile } from '@/lib/api'
import { toast } from 'sonner'

const emptyAnalytics: AnalyticsResponse = {
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly')
  const [weekly, setWeekly] = useState<AnalyticsResponse>(emptyAnalytics)
  const [monthly, setMonthly] = useState<AnalyticsResponse>(emptyAnalytics)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        const [weeklyData, monthlyData, profileData, suggestionData] = await Promise.all([
          analyticsApi.weekly(),
          analyticsApi.monthly(),
          userApi.profile(),
          analyticsApi.suggestion().catch(() => null),
        ])
        setWeekly(weeklyData)
        setMonthly(monthlyData)
        setProfile(profileData)
        setSuggestion(suggestionData)
      } catch (err) {
        toast.error(getApiMessage(err, 'Analytics are not available right now.'))
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  const active = timeRange === 'weekly' ? weekly : monthly
  const chartData = useMemo(() => {
    const labels = active.labels?.length ? active.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((label, index) => ({
      label,
      accuracy: Math.round(active.trend?.[index] || 0),
      questions: Math.round((active.trend?.[index] || 0) > 0 ? Math.max(1, active.totalQuestions / labels.length) : 0),
    }))
  }, [active])

  const statsOverview = [
    { label: 'Total Questions', value: String(profile?.totalQuestions || active.totalQuestions || 0), icon: Target, color: 'text-primary', bgColor: 'bg-primary/10', trend: 'From submitted quizzes' },
    { label: 'Overall Accuracy', value: `${Math.round(profile?.accuracy || active.accuracy || 0)}%`, icon: Target, color: 'text-success', bgColor: 'bg-success/10', trend: 'Backend calculated' },
    { label: 'Avg. Time/Question', value: `${active.avgTime || 0}s`, icon: Clock, color: 'text-accent', bgColor: 'bg-accent/10', trend: 'Attempt average' },
    { label: 'Current Streak', value: `${profile?.streak || 0} days`, icon: Flame, color: 'text-warning', bgColor: 'bg-warning/10', trend: `Level ${profile?.level || 1}` },
  ]

  const topicMastery = [
    { topic: 'Quantitative', mastery: Math.round(active.quant || 0), questions: active.totalQuestions, change: 0 },
    { topic: 'Logical Reasoning', mastery: Math.round(active.reasoning || 0), questions: active.totalQuestions, change: 0 },
    { topic: 'Verbal Ability', mastery: Math.round(active.verbal || 0), questions: active.totalQuestions, change: 0 },
  ]

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl lg:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your progress and identify areas for improvement</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsOverview.map((stat) => (
          <Card key={stat.label} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4 lg:p-6">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-[family-name:var(--font-sora)] text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-primary mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Accuracy Trend</CardTitle>
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'weekly' | 'monthly')}>
                <TabsList className="h-9">
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} domain={[0, 100]} />
                  <Area type="monotone" dataKey="accuracy" stroke="oklch(0.65 0.22 265)" strokeWidth={2} fill="url(#accuracyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Questions Practiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <Bar dataKey="questions" fill="oklch(0.7 0.15 200)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topicMastery.map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{topic.topic}</span>
                    <span className="text-xs text-muted-foreground">{topic.questions} total attempts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-success">
                      <ArrowUp className="w-3 h-3" />
                      {topic.change}%
                    </span>
                    <span className="font-semibold text-primary">{topic.mastery}%</span>
                  </div>
                </div>
                <Progress value={topic.mastery} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="font-[family-name:var(--font-sora)] text-lg">AI Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border bg-destructive/10 border-destructive/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{suggestion?.suggestedTopic || active.weakTopic || 'Quantitative'}</span>
                <span className="text-xs font-semibold text-destructive">{Math.round(suggestion?.accuracy || 0)}% accuracy</span>
              </div>
              <p className="text-xs text-muted-foreground">{suggestion?.reason || 'Practice this topic today to improve your overall score.'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-sora)] text-lg">Activity Signal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Backend currently exposes score, streak, and trend data.</p>
            <div className="grid grid-cols-7 gap-2">
              {chartData.map((day, index) => (
                <div key={index} className={`aspect-square rounded-md ${day.accuracy > 70 ? 'bg-primary' : day.accuracy > 0 ? 'bg-primary/40' : 'bg-muted'}`} title={`${day.label}: ${day.accuracy}% accuracy`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
