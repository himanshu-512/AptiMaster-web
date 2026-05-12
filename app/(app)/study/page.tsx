'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, ChevronRight, PlayCircle, CheckCircle2, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getApiMessage, questionApi, userApi } from '@/lib/api'
import { toast } from 'sonner'

const baseTopics = [
  { id: 'Quantitative', name: 'Quantitative Aptitude', icon: 'Q' },
  { id: 'Logical Reasoning', name: 'Logical Reasoning', icon: 'L' },
  { id: 'Verbal Ability', name: 'Verbal Ability', icon: 'V' },
  { id: 'Data Interpretation', name: 'Data Interpretation', icon: 'D' },
]

type TopicCard = {
  id: string
  name: string
  icon: string
  progress: number
  totalSubtopics: number
  completedSubtopics: number
  subtopics: Array<{ name: string; progress: number; questions: number; status: string; accuracy: number }>
}

export default function StudyPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [topics, setTopics] = useState<TopicCard[]>(baseTopics.map((topic) => ({
    ...topic,
    progress: 0,
    totalSubtopics: 0,
    completedSubtopics: 0,
    subtopics: [],
  })))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStudyData() {
      try {
        setLoading(true)
        const profile = await userApi.profile()
        const data = await Promise.all(baseTopics.map(async (topic) => {
          const [subtopics, stats] = await Promise.all([
            questionApi.subtopics(topic.id).catch(() => []),
            questionApi.topicStats(topic.id, profile.id).catch(() => []),
          ])
          const mapped = (subtopics.length ? subtopics : stats.map((item) => item.subtopic)).map((name) => {
            const stat = stats.find((item) => item.subtopic === name)
            return {
              name,
              progress: Math.round(stat?.progress || 0),
              accuracy: Math.round(stat?.accuracy || 0),
              questions: stat?.totalQuestions || 0,
              status: (stat?.progress || 0) >= 100 ? 'completed' : (stat?.solvedQuestions || 0) > 0 ? 'in-progress' : 'ready',
            }
          })
          const progress = mapped.length ? Math.round(mapped.reduce((sum, item) => sum + item.progress, 0) / mapped.length) : 0
          return {
            ...topic,
            progress,
            totalSubtopics: mapped.length,
            completedSubtopics: mapped.filter((item) => item.status === 'completed').length,
            subtopics: mapped,
          }
        }))
        setTopics(data)
      } catch (err) {
        toast.error(getApiMessage(err, 'Study data is not available right now.'))
      } finally {
        setLoading(false)
      }
    }
    loadStudyData()
  }, [])

  const activeTopic = useMemo(() => topics.find((t) => t.id === selectedTopic), [topics, selectedTopic])

  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-[family-name:var(--font-sora)] text-2xl lg:text-3xl font-bold">Study</h1>
        <p className="text-muted-foreground mt-1">Master each topic with structured learning paths</p>
      </motion.div>

      {selectedTopic && activeTopic ? (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="mb-4 gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Topics
          </Button>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-bold">{activeTopic.icon}</div>
                <div className="flex-1">
                  <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold">{activeTopic.name}</h2>
                  <p className="text-sm text-muted-foreground">{activeTopic.completedSubtopics} of {activeTopic.totalSubtopics} subtopics completed</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{activeTopic.progress}%</span>
                  <p className="text-xs text-muted-foreground">mastery</p>
                </div>
              </div>
              <Progress value={activeTopic.progress} className="h-3" />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {activeTopic.subtopics.length ? activeTopic.subtopics.map((subtopic, index) => (
              <motion.div key={subtopic.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="transition-all hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {subtopic.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-success" /> : <PlayCircle className="w-5 h-5 text-primary" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{subtopic.name}</h3>
                          <span className="text-sm text-muted-foreground ml-2 shrink-0">{subtopic.questions} Qs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={subtopic.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-primary w-10 text-right">{subtopic.progress}%</span>
                        </div>
                      </div>
                      <Button asChild size="sm" variant={subtopic.status === 'completed' ? 'outline' : 'default'} className="rounded-xl shrink-0">
                        <Link href={`/quiz?type=topic&topic=${encodeURIComponent(activeTopic.id)}&count=10&timed=true`}>
                          {subtopic.status === 'completed' ? 'Review' : 'Practice'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No subtopics found for this topic.</CardContent></Card>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <motion.button key={topic.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setSelectedTopic(topic.id)} className="text-left">
              <Card className="h-full hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-bold">{topic.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-1">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground">{topic.completedSubtopics} of {topic.totalSubtopics} subtopics</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /><span className="text-muted-foreground">{topic.completedSubtopics} done</span></div>
                    <div className="flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-primary" /><span className="text-muted-foreground">{Math.max(0, topic.totalSubtopics - topic.completedSubtopics)} remaining</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
