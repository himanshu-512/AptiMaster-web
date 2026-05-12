'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, Target, Clock, Flame } from 'lucide-react'

const weeklyData = [
  { day: 'Mon', accuracy: 72, questions: 45 },
  { day: 'Tue', accuracy: 78, questions: 52 },
  { day: 'Wed', accuracy: 75, questions: 38 },
  { day: 'Thu', accuracy: 82, questions: 60 },
  { day: 'Fri', accuracy: 85, questions: 55 },
  { day: 'Sat', accuracy: 88, questions: 70 },
  { day: 'Sun', accuracy: 91, questions: 65 },
]

const topicData = [
  { topic: 'Quantitative', mastery: 85 },
  { topic: 'Logical', mastery: 72 },
  { topic: 'Verbal', mastery: 90 },
  { topic: 'Data Int.', mastery: 68 },
]

export function AnalyticsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Analytics That{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Drive Growth
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              Track every aspect of your preparation journey. Understand your strengths, identify weak areas, and watch your improvement over time with detailed insights.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, label: 'Weekly Trends', value: '+15%', color: 'text-success' },
                { icon: Target, label: 'Accuracy', value: '87%', color: 'text-primary' },
                { icon: Clock, label: 'Avg. Time', value: '45s', color: 'text-accent' },
                { icon: Flame, label: 'Best Streak', value: '28 days', color: 'text-warning' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-card border border-border/50"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className="text-2xl font-bold font-[family-name:var(--font-sora)]">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right content - Charts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Weekly progress chart */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Weekly Progress</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.22 265)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }}
                      domain={[60, 100]}
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="oklch(0.65 0.22 265)"
                      strokeWidth={2}
                      fill="url(#accuracyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic mastery */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Topic Mastery</h3>
              <div className="space-y-4">
                {topicData.map((topic, index) => (
                  <div key={topic.topic}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{topic.topic}</span>
                      <span className="font-medium">{topic.mastery}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: index % 2 === 0 
                            ? 'linear-gradient(90deg, oklch(0.65 0.22 265), oklch(0.7 0.15 200))'
                            : 'linear-gradient(90deg, oklch(0.7 0.15 200), oklch(0.696 0.17 162.48))'
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${topic.mastery}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
