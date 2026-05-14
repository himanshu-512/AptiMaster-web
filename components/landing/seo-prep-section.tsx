'use client'

import { motion } from 'framer-motion'
import { BookOpenCheck, BriefcaseBusiness, Calculator, MessageSquareText, Puzzle, TimerReset } from 'lucide-react'

const prepAreas = [
  {
    icon: Calculator,
    title: 'Quantitative Aptitude Practice',
    description: 'Practice arithmetic, percentages, profit and loss, averages, time and work, speed distance, number systems, and data interpretation questions.',
  },
  {
    icon: Puzzle,
    title: 'Logical Reasoning Tests',
    description: 'Build accuracy in series, coding decoding, blood relations, directions, seating arrangements, syllogisms, and analytical reasoning.',
  },
  {
    icon: MessageSquareText,
    title: 'Verbal Ability Preparation',
    description: 'Improve grammar, vocabulary, sentence correction, reading comprehension, para jumbles, and communication-focused aptitude skills.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Placement Preparation',
    description: 'Prepare for campus placement aptitude rounds, company screening tests, fresher interviews, and competitive exam practice.',
  },
  {
    icon: TimerReset,
    title: 'Mock Test Experience',
    description: 'Attempt timed practice sessions, review answers from the first question, and track accuracy across each attempt.',
  },
  {
    icon: BookOpenCheck,
    title: 'Mistake Review',
    description: 'Revisit wrong questions, bookmark difficult problems, and turn repeated mistakes into focused revision sessions.',
  },
]

const trustItems = [
  'Built for daily aptitude practice',
  'Smart topic suggestions from performance data',
  'Mobile app download for Android learners',
]

export function SeoPrepSection() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Aptitude preparation platform</p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl font-bold text-balance sm:text-4xl">
            Practice aptitude questions for placements, mock tests, and competitive exams
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            AptiMaster helps students prepare for quantitative aptitude, logical reasoning, verbal ability, and placement test rounds with structured practice and progress analytics.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prepAreas.map((area, index) => (
            <motion.article
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <area.icon className="h-5 w-5" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold">{area.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{area.description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item} className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
