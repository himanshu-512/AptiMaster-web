"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Camera, Trophy, Target, Flame, BookOpen, TrendingUp, Settings, LogOut, Shield, Zap, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi, getApiMessage, type Profile } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

const topicOptions = ["Quantitative", "Logical Reasoning", "Verbal Ability", "Data Interpretation"]

export default function ProfilePage() {
  const auth = useAuth()
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    examGoal: "",
    target: "",
    dailyGoal: "10",
    preferredTopics: [] as string[],
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userApi.profile()
        setProfile(data)
        setForm({
          name: data.name || "",
          age: data.age ? String(data.age) : "",
          email: data.email || "",
          examGoal: data.examGoal || "",
          target: data.target || "",
          dailyGoal: String(data.dailyGoal || 10),
          preferredTopics: data.preferredTopics || [],
        })
      } catch (err) {
        toast.error(getApiMessage(err, "Profile is not available right now."))
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const initials = (profile?.name || form.name || "AM").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
  const levelProgress = Math.min(100, (((profile?.xp || 0) % 500) / 500) * 100)

  const toggleTopic = (topic: string) => {
    setForm((current) => ({
      ...current,
      preferredTopics: current.preferredTopics.includes(topic)
        ? current.preferredTopics.filter((item) => item !== topic)
        : [...current.preferredTopics, topic],
    }))
  }

  const saveProfile = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter your full name.")
      return
    }

    try {
      setSaving(true)
      const updated = await userApi.updateProfile({
        name: form.name.trim(),
        age: form.age ? Number(form.age) : undefined,
        email: form.email,
        examGoal: form.examGoal,
        target: form.target,
        dailyGoal: form.dailyGoal ? Number(form.dailyGoal) : 10,
        preferredTopics: form.preferredTopics,
      })
      setProfile(updated)
      localStorage.setItem("aptimaster_profile_complete", String(Boolean(updated.profileComplete)))
      await auth.refresh()
      toast.success("Profile updated")
    } catch (err) {
      toast.error(getApiMessage(err, "Failed to update profile."))
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const response = await userApi.uploadAvatar(formData)
      setProfile((current) => current ? { ...current, avatar: response.avatar } : current)
      toast.success("Avatar uploaded")
    } catch (err) {
      toast.error(getApiMessage(err, "Avatar upload failed."))
    }
  }

  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-cyan-500/5 to-purple-500/10" />
          <CardContent className="relative p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/30">
                    <AvatarImage src={profile?.avatar || ""} />
                    <AvatarFallback className="bg-primary/20 text-2xl text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <button onClick={() => fileInput.current?.click()} className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110">
                    <Camera className="h-4 w-4" />
                  </button>
                  <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && uploadAvatar(event.target.files[0])} />
                  <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-cyan-500 text-xs font-bold text-white">
                    {profile?.level || 1}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground">{profile?.name || "AptiMaster User"}</h1>
                  <p className="text-muted-foreground">{profile?.examGoal || "Set your preparation goal"}{profile?.target ? ` - ${profile.target}` : ""}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
                    <Badge className="bg-primary/20 text-primary">{profile?.profileComplete ? "Profile Complete" : "Setup Pending"}</Badge>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      <Flame className="mr-1 h-3 w-3" />
                      {profile?.streak || 0} day streak
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-border" onClick={() => setActiveTab("settings")}>
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="border-border text-destructive" onClick={auth.logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {profile?.level || 1}</span>
                <span className="text-foreground">{(profile?.xp || 0).toLocaleString()} XP</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
              <p className="mt-1 text-xs text-muted-foreground">{Math.round(500 - ((profile?.xp || 0) % 500))} XP to next level</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Questions", value: (profile?.totalQuestions || 0).toLocaleString(), icon: BookOpen, color: "text-primary" },
          { label: "Accuracy", value: `${Math.round(profile?.accuracy || 0)}%`, icon: Target, color: "text-green-500" },
          { label: "Global Score", value: String(profile?.globalScore || 0), icon: Trophy, color: "text-yellow-500" },
          { label: "Daily Goal", value: `${profile?.dailyGoal || 10}`, icon: TrendingUp, color: "text-cyan-400" },
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-lg">Learning Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Correct Answers", value: profile?.totalCorrect || 0 },
                  { label: "Questions Attempted", value: profile?.totalQuestions || 0 },
                  { label: "Global Score", value: profile?.globalScore || 0 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-lg">Preferred Topics</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile?.preferredTopics?.length ? profile.preferredTopics : topicOptions).map((topic) => (
                    <Badge key={topic} variant="outline" className="border-primary/30 text-primary">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "First Practice", description: "Submit your first quiz", icon: Zap, earned: (profile?.totalQuestions || 0) > 0, color: "text-yellow-500" },
              { name: "Streak Builder", description: "Maintain a practice streak", icon: Flame, earned: (profile?.streak || 0) > 0, color: "text-orange-500" },
              { name: "Level Up", description: "Earn XP from attempts", icon: Crown, earned: (profile?.level || 1) > 1, color: "text-primary" },
            ].map((achievement) => (
              <Card key={achievement.name} className={`border-border bg-card transition-all ${achievement.earned ? "" : "opacity-50"}`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg p-3 bg-muted"><achievement.icon className={`h-6 w-6 ${achievement.color}`} /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{achievement.name}</p>
                      {achievement.earned && <Badge className="bg-green-500/20 text-green-400 text-xs">Earned</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Shield className="h-5 w-5" />Account Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Age</Label><Input value={form.age} type="number" onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Daily Goal</Label><Input value={form.dailyGoal} type="number" onChange={(e) => setForm({ ...form, dailyGoal: e.target.value })} /></div>
              <div className="space-y-2"><Label>Preparation Goal</Label><Input value={form.examGoal} onChange={(e) => setForm({ ...form, examGoal: e.target.value })} /></div>
              <div className="space-y-2"><Label>Target Company / Exam</Label><Input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} /></div>
              <div className="md:col-span-2 space-y-2">
                <Label>Preferred Topics</Label>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((topic) => (
                    <button key={topic} onClick={() => toggleTopic(topic)} className={`rounded-xl border px-3 py-2 text-sm ${form.preferredTopics.includes(topic) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"}`}>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={saveProfile} disabled={saving} className="rounded-xl">{saving ? "Saving..." : "Save Changes"}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
