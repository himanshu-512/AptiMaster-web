"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap, Star, Crown, Timer, Award, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { contestApi, getApiMessage, type ContestSummary } from "@/lib/api"
import { toast } from "sonner"

type ContestType = "live" | "upcoming" | "past"

const formatDate = (value?: string) => {
  if (!value) return "TBA"
  return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

const getCountdown = (value?: string) => {
  if (!value) return "Starts soon"
  const diff = new Date(value).getTime() - Date.now()
  if (diff <= 0) return "Live now"
  const minutes = Math.floor(diff / 60000)
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (days > 0) return `Starts in ${days}d ${hours}h`
  if (hours > 0) return `Starts in ${hours}h ${mins}m`
  return `Starts in ${Math.max(mins, 1)}m`
}

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState<ContestType>("live")
  const [contests, setContests] = useState<Record<ContestType, ContestSummary[]>>({ live: [], upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)

  const loadContests = async () => {
    try {
      setLoading(true)
      const [live, upcoming, past] = await Promise.all([
        contestApi.list("live"),
        contestApi.list("upcoming"),
        contestApi.list("past"),
      ])
      setContests({ live: live || [], upcoming: upcoming || [], past: past || [] })
    } catch (err) {
      toast.error(getApiMessage(err, "Contests are not available right now."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContests()
  }, [])

  const register = async (contest: ContestSummary) => {
    try {
      const response = await contestApi.register(contest.id)
      setContests((current) => ({
        ...current,
        upcoming: current.upcoming.map((item) =>
          item.id === contest.id
            ? { ...item, registered: true, registeredUsers: response.registeredUsers }
            : item,
        ),
      }))
      toast.success("Contest registered")
    } catch (err) {
      toast.error(getApiMessage(err, "Contest registration failed."))
    }
  }

  const all = [...contests.live, ...contests.upcoming, ...contests.past]
  const stats = {
    totalParticipated: contests.past.filter((item) => item.registered).length,
    wins: 0,
    topTenFinishes: 0,
    averageRank: "N/A",
    contestRating: all.filter((item) => item.registered).length * 100,
  }

  const renderContestCard = (contest: ContestSummary, type: ContestType, index: number) => {
    const isLive = type === "live"
    const isUpcoming = type === "upcoming"
    const participants = contest.registeredUsers || 0
    const totalQuestions = contest.totalQuestions || 0
    return (
      <motion.div key={contest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
        <Card className="relative overflow-hidden border-border bg-card transition-all hover:border-primary/50">
          <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-primary/10 to-transparent" />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {isLive && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>}
                  <Badge variant="outline" className={isLive ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-primary/30 bg-primary/10 text-primary"}>
                    {contest.status || type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{contest.title || "AptiMaster Contest"}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{contest.description || "Timed aptitude challenge"}</p>
              </div>
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">{totalQuestions} Qs</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-foreground">{formatDate(contest.startTime)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{isUpcoming ? getCountdown(contest.startTime) : isLive ? "Contest is live" : "Contest ended"}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-orange-500"><Timer className="h-4 w-4" /><span className="font-mono font-semibold">{contest.durationMinutes || 0}m</span></div>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-foreground"><Users className="h-4 w-4" /><span className="font-semibold">{participants}</span></div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-foreground"><Clock className="h-4 w-4" /><span className="font-semibold">{totalQuestions}</span></div>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Interest</span>
                <span className="text-foreground">{participants} learners</span>
              </div>
              <Progress value={Math.min(100, participants)} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">{contest.registered ? "You are registered" : "Backend contest"}</span>
              </div>
              {isUpcoming && !contest.registered ? (
                <Button onClick={() => register(contest)} className="gap-2 bg-primary hover:bg-primary/90">Register<ArrowRight className="h-4 w-4" /></Button>
              ) : (
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10" disabled>
                  <Zap className="h-4 w-4" />
                  {contest.registered ? "Registered" : "View"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contests</h1>
          <p className="text-muted-foreground">Compete with learners and track upcoming starts</p>
        </div>
        <Card className="border-border bg-card px-4 py-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Contest Rating</p>
              <p className="font-bold text-foreground">{stats.contestRating}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Contests Joined", value: stats.totalParticipated, icon: Target, color: "text-primary" },
          { label: "Wins", value: stats.wins, icon: Crown, color: "text-yellow-500" },
          { label: "Top 10 Finishes", value: stats.topTenFinishes, icon: Award, color: "text-cyan-400" },
          { label: "Average Rank", value: stats.averageRank, icon: Star, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContestType)}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="live" className="gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>Live</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Results</TabsTrigger>
        </TabsList>

        {(["live", "upcoming", "past"] as ContestType[]).map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            {loading ? (
              <div className="min-h-[40vh] grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>
            ) : contests[type].length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {contests[type].map((contest, index) => renderContestCard(contest, type, index))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h2 className="font-semibold text-lg">No {type} contests</h2>
                  <p className="text-muted-foreground">Check back later or practice meanwhile.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
