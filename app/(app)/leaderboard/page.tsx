"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, ChevronUp, Flame, Target, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getApiMessage, leaderboardApi, type LeaderboardEntry } from "@/lib/api"
import { toast } from "sonner"

type Period = "daily" | "weekly" | "global"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Period>("weekly")
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [searchRows, setSearchRows] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await leaderboardApi.list(activeTab, 0, 20)
        setRows(data || [])
      } catch (err) {
        toast.error(getApiMessage(err, "Leaderboard is not available right now."))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeTab])

  useEffect(() => {
    const query = searchQuery.trim()
    if (!query) {
      setSearchRows([])
      return
    }
    const timer = window.setTimeout(async () => {
      try {
        const data = await leaderboardApi.search(query)
        setSearchRows(data || [])
      } catch {
        setSearchRows([])
      }
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const visibleRows = searchQuery.trim() ? searchRows : rows
  const topThree = useMemo(() => visibleRows.slice(0, 3), [visibleRows])
  const rest = useMemo(() => visibleRows.slice(3), [visibleRows])

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other learners</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 bg-card border-border pl-9" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Period)}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="min-h-[50vh] grid place-items-center">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : visibleRows.length ? (
            <>
              <div className="mb-8 flex items-end justify-center gap-4">
                {topThree.map((user, index) => {
                  const isFirst = user.rank === 1
                  const height = user.rank === 1 ? "h-48" : user.rank === 2 ? "h-40" : "h-32"
                  const border = user.rank === 1 ? "border-yellow-500" : user.rank === 2 ? "border-slate-400" : "border-amber-600"
                  return (
                    <motion.div key={user.userId || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`flex flex-col items-center ${isFirst ? "order-2" : user.rank === 2 ? "order-1" : "order-3"}`}>
                      <div className="relative mb-3">
                        <Avatar className={`${isFirst ? "h-20 w-20" : "h-16 w-16"} border-2 ${border}`}>
                          <AvatarImage src={user.avatar || ""} />
                          <AvatarFallback className="bg-primary/20 text-primary">{(user.name || "AM").split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -top-2 -right-2 rounded-full p-1 ${isFirst ? "bg-yellow-500" : user.rank === 2 ? "bg-slate-400" : "bg-amber-600"}`}>
                          {isFirst ? <Crown className="h-4 w-4 text-white" /> : <Medal className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                      <p className={`${isFirst ? "text-lg" : "text-sm"} font-semibold text-foreground`}>{user.name || "AptiMaster User"}</p>
                      <p className="font-bold text-primary">{(user.points || 0).toLocaleString()}</p>
                      <Card className={`${height} mt-3 w-28 bg-gradient-to-t from-primary/10 to-primary/5 border`}>
                        <CardContent className="flex h-full flex-col items-center justify-center p-3">
                          <span className="text-3xl font-bold text-primary">#{user.rank}</span>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Flame className="h-3 w-3 text-orange-500" />
                            score
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rest.map((user, index) => (
                      <motion.div key={user.userId || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted font-semibold text-muted-foreground">{user.rank}</div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || ""} />
                            <AvatarFallback className="bg-primary/20 text-primary text-sm">{(user.name || "AM").split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name || "AptiMaster User"}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Target className="h-3 w-3 text-green-500" />Points</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">{(user.points || 0).toLocaleString()}</span>
                          <div className="flex items-center gap-1 text-green-500">
                            <ChevronUp className="h-4 w-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-10 text-center">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-3" />
                <h2 className="font-semibold text-lg">No leaderboard data</h2>
                <p className="text-muted-foreground">Complete practice sessions to start ranking.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
