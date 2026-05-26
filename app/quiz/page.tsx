'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Flag, Grid3X3, X, CheckCircle2, XCircle, AlertCircle, Sparkles, Lightbulb, ListChecks, Target, Copy, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { aiApi, attemptApi, getApiMessage, questionApi, type AiExplanation, type Question, type ResultResponse } from '@/lib/api'
import { toast } from 'sonner'

type QuestionStatus = 'unanswered' | 'answered' | 'review'
const SAVED_AI_SOLUTIONS_KEY = 'aptirush_saved_ai_solutions'

interface QuestionState {
  selected: number | null
  status: QuestionStatus
  bookmarked: boolean
  timeSpent: number
}

function parseAiExplanation(text: string) {
  const cleaned = text.replace(/\r/g, '').trim()
  const lines = cleaned.split('\n').map((line) => line.trim()).filter(Boolean)
  const sections: Array<{ title: string; body: string[] }> = []
  let current: { title: string; body: string[] } | null = null

  for (const line of lines) {
    const match = line.match(/^(?:#{1,3}\s*)?(?:\d+[.)]\s*)?([^:]{3,60}):\s*(.*)$/)
    const looksLikeHeading = match && /answer|solution|selected|wrong|right|trick|step|explanation/i.test(match[1])

    if (looksLikeHeading) {
      if (current) sections.push(current)
      current = { title: match[1].replace(/\*/g, '').trim(), body: match[2] ? [match[2].trim()] : [] }
    } else if (current) {
      current.body.push(line)
    } else {
      current = { title: 'AI Summary', body: [line] }
    }
  }

  if (current) sections.push(current)
  return sections.length ? sections : [{ title: 'AI Summary', body: [cleaned] }]
}

function AiExplanationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
          <div className="mb-3 h-7 w-40 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>
        {[0, 1].map((item) => (
          <div key={item} className="rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function AiExplanationCard({
  explanation,
  isSaved,
  onCopy,
  onSave,
}: {
  explanation: AiExplanation
  isSaved: boolean
  onCopy: (explanation: AiExplanation) => void
  onSave: (explanation: AiExplanation) => void
}) {
  const sections = parseAiExplanation(explanation.explanation)
  const summary = sections[0]
  const rest = sections.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="space-y-4">
        {summary && (
          <div className="rounded-xl border border-success/20 bg-success/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success text-success-foreground">
                <Target className="h-4 w-4" />
              </span>
              {summary.title}
            </div>
            <div className="space-y-2 text-[15px] leading-relaxed text-foreground">
              {summary.body.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {rest.map((section, sectionIndex) => {
          const isTrick = /trick|tip/i.test(section.title)
          const Icon = isTrick ? Lightbulb : ListChecks

          return (
            <div key={`${section.title}-${sectionIndex}`} className="rounded-xl border border-border/60 bg-background/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isTrick ? 'bg-warning/15 text-warning' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <h5 className="font-[family-name:var(--font-sora)] text-sm font-semibold">{section.title}</h5>
              </div>
              <div className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                {section.body.map((line, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    <p className="min-w-0 break-words">{line.replace(/^[-*]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => onCopy(explanation)} className="rounded-xl">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button type="button" variant={isSaved ? 'secondary' : 'outline'} size="sm" onClick={() => onSave(explanation)} className="rounded-xl">
          {isSaved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </motion.div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background grid place-items-center"><div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>}>
      <QuizContent />
    </Suspense>
  )
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([])
  const [showNavigator, setShowNavigator] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<ResultResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [aiExplanations, setAiExplanations] = useState<Record<string, AiExplanation>>({})
  const [aiLoadingQuestionId, setAiLoadingQuestionId] = useState<string | null>(null)
  const [savedAiSolutions, setSavedAiSolutions] = useState<Record<string, AiExplanation>>({})

  const isTimed = searchParams.get('timed') !== 'false'
  const count = Math.max(1, Math.min(50, Number(searchParams.get('count') || 10)))
  const currentQuestion = questions[currentIndex]
  const currentState = questionStates[currentIndex]

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        const type = searchParams.get('type') || 'topic'
        const topic = searchParams.get('topic') || 'Quantitative'
        const difficulty = searchParams.get('difficulty') || 'Mixed'
        let data: Question[]
        if (type === 'smart') data = await questionApi.smart(count)
        else if (type === 'wrong') data = await questionApi.wrong(count)
        else if (type === 'bookmarks' || type === 'bookmarked') data = await questionApi.bookmarked(count)
        else if (type === 'random') data = await questionApi.random(count)
        else data = await questionApi.byTopic(topic, difficulty, count)

        setQuestions(data || [])
        setQuestionStates((data || []).map(() => ({ selected: null, status: 'unanswered', bookmarked: false, timeSpent: 0 })))
        setTimeLeft((data?.length || count) * 60)
      } catch (err) {
        toast.error(getApiMessage(err, 'Questions are not available right now.'))
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [searchParams, count])

  useEffect(() => {
    async function loadBookmark() {
      if (!currentQuestion?.id || isSubmitted) return
      try {
        const response = await questionApi.bookmarkStatus(currentQuestion.id)
        setQuestionStates((prev) => prev.map((item, index) => index === currentIndex ? { ...item, bookmarked: Boolean(response.bookmarked) } : item))
      } catch {
        // Bookmark status is non-blocking.
      }
    }
    loadBookmark()
  }, [currentQuestion?.id, currentIndex, isSubmitted])

  useEffect(() => {
    if (!isTimed || isSubmitted || timeLeft <= 0 || loading) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowSubmitDialog(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isTimed, isSubmitted, timeLeft, loading])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_AI_SOLUTIONS_KEY)
      if (raw) setSavedAiSolutions(JSON.parse(raw))
    } catch {
      setSavedAiSolutions({})
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    setQuestionStates((prev) => {
      const next = [...prev]
      next[currentIndex] = { ...next[currentIndex], selected: optionIndex, status: 'answered' }
      return next
    })
  }

  const handleToggleBookmark = async () => {
    if (!currentQuestion?.id) return
    try {
      const response = await questionApi.toggleBookmark(currentQuestion.id)
      setQuestionStates((prev) => prev.map((item, index) => index === currentIndex ? { ...item, bookmarked: Boolean(response.bookmarked) } : item))
    } catch (err) {
      toast.error(getApiMessage(err, 'Bookmark update failed.'))
    }
  }

  const handleMarkForReview = () => {
    setQuestionStates((prev) => {
      const next = [...prev]
      const current = next[currentIndex]
      next[currentIndex] = {
        ...current,
        status: current.status === 'review' ? (current.selected !== null ? 'answered' : 'unanswered') : 'review',
      }
      return next
    })
  }

  const handleSubmit = async () => {
    if (submitting) return
    try {
      setSubmitting(true)
      const response = await attemptApi.submit(questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: questionStates[index]?.selected ?? -1,
      })))
      setResult(response)
      setIsSubmitted(true)
      setShowSubmitDialog(false)
      toast.success('Practice submitted')
    } catch (err) {
      toast.error(getApiMessage(err, 'Failed to submit practice.'))
    } finally {
      setSubmitting(false)
    }
  }

  const startReview = () => {
    setCurrentIndex(0)
    setShowReview(true)
  }

  const handleAiExplanation = async () => {
    if (!currentQuestion?.id || aiLoadingQuestionId) return

    const cached = aiExplanations[currentQuestion.id]
    if (cached) return

    try {
      setAiLoadingQuestionId(currentQuestion.id)
      const response = await aiApi.explainQuestion(currentQuestion.id, currentState.selected)
      setAiExplanations((prev) => ({ ...prev, [currentQuestion.id]: response }))
    } catch (err) {
      if (currentQuestion.explanation) {
        const fallback = buildFallbackExplanation(currentQuestion, currentState.selected)
        setAiExplanations((prev) => ({ ...prev, [currentQuestion.id]: fallback }))
        toast.warning('AI is unavailable, showing the official explanation.')
      } else {
        toast.error(getApiMessage(err, 'AI solution is not available right now.'))
      }
    } finally {
      setAiLoadingQuestionId(null)
    }
  }

  const buildFallbackExplanation = (question: Question, selectedAnswer: number | null): AiExplanation => {
    const correct = formatOption(question, question.correctAnswer)
    const selected = selectedAnswer === null || selectedAnswer < 0 ? 'Not attempted' : formatOption(question, selectedAnswer)
    const answerStatus = selectedAnswer === question.correctAnswer
      ? 'Your selected answer is correct.'
      : `Your selected answer was ${selected}, but the correct answer is ${correct}.`

    return {
      questionId: question.id,
      model: 'official-explanation',
      explanation: [
        `Short Answer: ${correct}`,
        `Step-by-step Solution: ${question.explanation}`,
        `Why Your Answer: ${answerStatus}`,
        'Quick Trick: Re-check the key condition in the question and compare it directly with the options.',
      ].join('\n'),
    }
  }

  const formatOption = (question: Question, index: number) => {
    if (index < 0 || index >= question.options.length) return 'Unknown'
    return `${String.fromCharCode(65 + index)}. ${question.options[index]}`
  }

  const handleCopyAiExplanation = async (explanation: AiExplanation) => {
    try {
      await navigator.clipboard.writeText(explanation.explanation)
      toast.success('AI solution copied')
    } catch {
      toast.error('Copy failed. Please try again.')
    }
  }

  const handleSaveAiExplanation = (explanation: AiExplanation) => {
    setSavedAiSolutions((prev) => {
      const next = { ...prev, [explanation.questionId]: explanation }
      localStorage.setItem(SAVED_AI_SOLUTIONS_KEY, JSON.stringify(next))
      return next
    })
    toast.success('AI solution saved on this device')
  }

  const answeredCount = questionStates.filter((s) => s.selected !== null).length
  const correctCount = questionStates.filter((s, i) => s.selected === questions[i]?.correctAnswer).length
  const accuracy = result ? Math.round(result.accuracy) : answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold mb-2">No questions available</h1>
          <p className="text-muted-foreground mb-6">Try another topic or practice mode.</p>
          <Button onClick={() => router.push('/practice')} className="rounded-xl">Back to Practice</Button>
        </div>
      </div>
    )
  }

  if (isSubmitted && !showReview) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold mb-2">Practice Complete!</h1>
            <p className="text-muted-foreground">{"Here's how you performed"}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Questions', value: result?.totalQuestions ?? questions.length, color: 'text-foreground' },
              { label: 'Attempted', value: answeredCount, color: 'text-primary' },
              { label: 'Correct', value: result?.correctAnswers ?? correctCount, color: 'text-success' },
              { label: 'Accuracy', value: `${accuracy}%`, color: 'text-warning' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-card border border-border/50 text-center">
                <p className={`font-[family-name:var(--font-sora)] text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 mb-8">
            <h3 className="font-semibold mb-4">Performance by Topic</h3>
            <div className="space-y-3">
              {Array.from(new Set(questions.map((question) => question.topic || 'Mixed'))).slice(0, 5).map((topic) => {
                const topicQuestions = questions.filter((question) => (question.topic || 'Mixed') === topic)
                const topicCorrect = topicQuestions.filter((question) => {
                  const index = questions.findIndex((item) => item.id === question.id)
                  return questionStates[index]?.selected === question.correctAnswer
                }).length
                const topicAccuracy = topicQuestions.length ? Math.round((topicCorrect / topicQuestions.length) * 100) : 0
                return (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{topic}</span>
                      <span className="font-medium">{topicAccuracy}%</span>
                    </div>
                    <Progress value={topicAccuracy} className="h-2" />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={startReview} variant="outline" className="flex-1 h-12 rounded-2xl">Review Answers</Button>
            <Button onClick={() => router.push('/practice')} className="flex-1 h-12 rounded-2xl">Practice Again</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (showReview) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/practice')} className="gap-2"><X className="w-4 h-4" /> Exit Review</Button>
            <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <div className={`p-6 rounded-2xl mb-6 ${
              currentState.selected === currentQuestion.correctAnswer ? 'bg-success/10 border border-success/30' : currentState.selected !== null ? 'bg-destructive/10 border border-destructive/30' : 'bg-muted'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {currentState.selected === currentQuestion.correctAnswer ? <CheckCircle2 className="w-5 h-5 text-success" /> : currentState.selected !== null ? <XCircle className="w-5 h-5 text-destructive" /> : <AlertCircle className="w-5 h-5 text-muted-foreground" />}
                <span className="text-sm font-medium">{currentState.selected === currentQuestion.correctAnswer ? 'Correct!' : currentState.selected !== null ? 'Incorrect' : 'Not Attempted'}</span>
              </div>
              <p className="text-lg">{currentQuestion.questionText}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer
                const isSelected = currentState.selected === index
                return (
                  <div key={index} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-success/10 border-success' : isSelected ? 'bg-destructive/10 border-destructive' : 'bg-card border-border/50'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${isCorrect ? 'bg-success text-white' : isSelected ? 'bg-destructive text-white' : 'bg-muted'}`}>{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-success ml-auto" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive ml-auto" />}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-semibold mb-2">Explanation</h4>
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation || 'No explanation available.'}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                  <h4 className="font-semibold">Solution by AI</h4>
                  <p className="text-xs text-muted-foreground">Clear reasoning, answer check, and a quick solving idea.</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAiExplanation}
                  disabled={aiLoadingQuestionId === currentQuestion.id}
                  className="rounded-xl"
                >
                  {aiLoadingQuestionId === currentQuestion.id ? 'Generating...' : aiExplanations[currentQuestion.id] ? 'Generated' : 'Show AI Solution'}
                </Button>
              </div>
              {aiLoadingQuestionId === currentQuestion.id && !aiExplanations[currentQuestion.id] && (
                <AiExplanationSkeleton />
              )}
              {aiExplanations[currentQuestion.id] && (
                <AiExplanationCard
                  explanation={aiExplanations[currentQuestion.id]}
                  isSaved={Boolean(savedAiSolutions[currentQuestion.id])}
                  onCopy={handleCopyAiExplanation}
                  onSave={handleSaveAiExplanation}
                />
              )}
            </div>
          </motion.div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0} className="rounded-xl"><ChevronLeft className="w-4 h-4 mr-2" /> Previous</Button>
            <Button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={currentIndex === questions.length - 1} className="rounded-xl">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/practice')} className="gap-2"><X className="w-4 h-4" /> Exit</Button>
            {isTimed && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowNavigator(true)} className="gap-2"><Grid3X3 className="w-4 h-4" /><span className="hidden sm:inline">Navigator</span></Button>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{currentQuestion.topic || currentQuestion.subtopic || 'Practice'}</span>
                  <span className="px-2 py-1 rounded-lg bg-muted text-xs font-medium">{currentQuestion.difficulty || 'Mixed'}</span>
                </div>
                <p className="text-lg lg:text-xl leading-relaxed">{currentQuestion.questionText}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleToggleBookmark} className={currentState.bookmarked ? 'text-warning' : ''}>
                {currentState.bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </Button>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleSelectOption(index)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${currentState.selected === index ? 'bg-primary/10 border-primary' : 'bg-card border-border/50 hover:border-primary/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${currentState.selected === index ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{String.fromCharCode(65 + index)}</span>
                    <span className="flex-1">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handleMarkForReview} className={`gap-2 rounded-xl ${currentState.status === 'review' ? 'border-warning text-warning' : ''}`}>
                <Flag className="w-4 h-4" />{currentState.status === 'review' ? 'Marked for Review' : 'Mark for Review'}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0} className="rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
                {currentIndex === questions.length - 1 ? (
                  <Button onClick={() => setShowSubmitDialog(true)} className="rounded-xl">Submit</Button>
                ) : (
                  <Button onClick={() => setCurrentIndex((i) => i + 1)} className="rounded-xl">Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showNavigator && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNavigator(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Question Navigator</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowNavigator(false)}><X className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questionStates.map((state, index) => (
                  <button key={index} onClick={() => { setCurrentIndex(index); setShowNavigator(false) }} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${index === currentIndex ? 'bg-primary text-primary-foreground' : state.status === 'answered' ? 'bg-success/20 text-success' : state.status === 'review' ? 'bg-warning/20 text-warning' : 'bg-muted hover:bg-muted/80'}`}>
                    {index + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Practice?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {questions.length} questions.
              {answeredCount < questions.length && <span className="block mt-2 text-warning">{questions.length - answeredCount} questions are unanswered.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Continue Practice</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="rounded-xl" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
