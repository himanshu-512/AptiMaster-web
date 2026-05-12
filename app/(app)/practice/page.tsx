'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Target, Brain, Bookmark, XCircle, Shuffle, ChevronRight, PlayCircle, Settings2, Minus, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { questionApi, userApi } from '@/lib/api'

const practiceTypes = [
  { id: 'topic', label: 'Topic Practice', desc: 'Focus on specific topics', icon: Target, color: 'from-primary to-primary/80' },
  { id: 'smart', label: 'Smart Practice', desc: 'AI-optimized questions', icon: Brain, color: 'from-accent to-accent/80' },
  { id: 'wrong', label: 'Wrong Questions', desc: 'Review your mistakes', icon: XCircle, color: 'from-destructive to-destructive/80' },
  { id: 'bookmarks', label: 'Bookmarked', desc: 'Your saved questions', icon: Bookmark, color: 'from-warning to-warning/80' },
  { id: 'random', label: 'Random Practice', desc: 'Mixed topic challenge', icon: Shuffle, color: 'from-success to-success/80' },
]

const topics = [
  { id: 'Quantitative', name: 'Quantitative Aptitude', progress: 0, questions: 0 },
  { id: 'Logical Reasoning', name: 'Logical Reasoning', progress: 0, questions: 0 },
  { id: 'Verbal Ability', name: 'Verbal Ability', progress: 0, questions: 0 },
  { id: 'Data Interpretation', name: 'Data Interpretation', progress: 0, questions: 0 },
]

const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed']

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>}>
      <PracticeContent />
    </Suspense>
  )
}

function PracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'topic')
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'Quantitative')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Mixed')
  const [questionCount, setQuestionCount] = useState(20)
  const [timedMode, setTimedMode] = useState(true)
  const [topicCards, setTopicCards] = useState(topics)
  const [modeCounts, setModeCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function hydrateStats() {
      try {
        const profile = await userApi.profile()
        const cards = await Promise.all(topics.map(async (topic) => {
          try {
            const stats = await questionApi.topicStats(topic.id, profile.id)
            const total = stats.reduce((sum, item) => sum + (item.totalQuestions || 0), 0)
            const progress = stats.length
              ? Math.round(stats.reduce((sum, item) => sum + (item.progress || 0), 0) / stats.length)
              : 0
            return { ...topic, progress, questions: total }
          } catch {
            return topic
          }
        }))
        setTopicCards(cards)
        setModeCounts({
          topic: cards.reduce((sum, item) => sum + item.questions, 0),
          smart: profile.totalQuestions || 0,
          wrong: profile.totalQuestions - profile.totalCorrect,
          bookmarks: 0,
          random: cards.reduce((sum, item) => sum + item.questions, 0),
        })
      } catch {
        setTopicCards(topics)
      }
    }
    hydrateStats()
  }, [])

  const handleStartPractice = () => {
    const params = new URLSearchParams({
      type: selectedType,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      count: questionCount.toString(),
      timed: timedMode.toString(),
    })
    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl lg:text-3xl font-bold">Practice</h1>
        <p className="text-muted-foreground mt-1">Choose your practice mode and start learning</p>
      </motion.div>

      <div>
        <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-4">Practice Modes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {practiceTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                selectedType === type.id ? 'bg-primary/10 border-primary/50 ring-2 ring-primary/20' : 'bg-card border-border/50 hover:border-primary/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{type.label}</h3>
              <p className="text-sm text-muted-foreground mb-3">{type.desc}</p>
              <div className="text-xs text-muted-foreground">{modeCounts[type.id] ?? 0} available</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-4">Select Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicCards.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedTopic(topic.id)}
              disabled={selectedType !== 'topic'}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                selectedTopic === topic.id && selectedType === 'topic'
                  ? 'bg-primary/10 border-primary/50 ring-2 ring-primary/20'
                  : 'bg-card border-border/50 hover:border-primary/30'
              } ${selectedType !== 'topic' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{topic.name}</h3>
                <span className="text-sm text-muted-foreground">{topic.questions} Qs</span>
              </div>
              <Progress value={topic.progress} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{topic.progress}% mastery</p>
            </motion.button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-sora)] text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Practice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedDifficulty === diff ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Number of Questions</Label>
              <span className="text-sm font-semibold text-primary">{questionCount}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setQuestionCount(Math.max(5, questionCount - 5))}>
                <Minus className="w-4 h-4" />
              </Button>
              <Slider value={[questionCount]} onValueChange={([value]) => setQuestionCount(value)} min={5} max={50} step={5} className="flex-1" />
              <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setQuestionCount(Math.min(50, questionCount + 5))}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Timed Mode</Label>
              <p className="text-xs text-muted-foreground">1 minute per question</p>
            </div>
            <Switch checked={timedMode} onCheckedChange={setTimedMode} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleStartPractice} size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90">
          <PlayCircle className="w-5 h-5 mr-2" />
          Start Practice
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
