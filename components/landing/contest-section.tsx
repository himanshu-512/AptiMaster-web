'use client'

import { motion } from 'framer-motion'
import { Timer, Users, Trophy, Clock, ChevronRight, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contests = [
  {
    id: 1,
    title: 'Weekly Aptitude Challenge',
    status: 'live',
    participants: 1234,
    duration: '60 min',
    questions: 30,
    endsIn: '45:23',
  },
  {
    id: 2,
    title: 'Quantitative Marathon',
    status: 'upcoming',
    participants: 856,
    duration: '90 min',
    questions: 50,
    startsIn: '2h 30m',
  },
  {
    id: 3,
    title: 'Logical Reasoning Sprint',
    status: 'upcoming',
    participants: 623,
    duration: '45 min',
    questions: 25,
    startsIn: '5h 15m',
  },
]

const getStatusBadge = (status: string) => {
  if (status === 'live') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30">
        <Radio className="w-3 h-3 text-destructive animate-pulse" />
        <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Live</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
      <Clock className="w-3 h-3 text-primary" />
      <span className="text-xs font-semibold text-primary uppercase tracking-wide">Upcoming</span>
    </div>
  )
}

export function ContestSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Live{' '}
            <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
              Contests
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Test your skills in timed competitions. Compete live with thousands of aspirants and win exclusive rewards.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                contest.status === 'live'
                  ? 'bg-gradient-to-br from-destructive/5 to-card border-destructive/30 hover:border-destructive/50'
                  : 'bg-card border-border/50 hover:border-primary/30'
              }`}
            >
              {/* Live glow effect */}
              {contest.status === 'live' && (
                <div className="absolute inset-0 rounded-2xl bg-destructive/5 animate-pulse" />
              )}
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  {getStatusBadge(contest.status)}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{contest.participants.toLocaleString()}</span>
                  </div>
                </div>

                <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-4">{contest.title}</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Timer className="w-4 h-4" />
                      <span className="text-xs">Duration</span>
                    </div>
                    <span className="font-semibold">{contest.duration}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-xs">Questions</span>
                    </div>
                    <span className="font-semibold">{contest.questions}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {contest.status === 'live' ? 'Ends in' : 'Starts in'}
                    </span>
                    <div className="font-[family-name:var(--font-sora)] text-xl font-bold text-primary">
                      {contest.status === 'live' ? contest.endsIn : contest.startsIn}
                    </div>
                  </div>
                  <Button
                    variant={contest.status === 'live' ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-xl ${
                      contest.status === 'live' ? 'bg-destructive hover:bg-destructive/90' : ''
                    }`}
                  >
                    {contest.status === 'live' ? 'Join Now' : 'Register'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
