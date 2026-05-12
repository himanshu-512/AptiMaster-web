'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Target, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react'

export function AIRecommendationSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered</span>
            </div>

            <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Smart Recommendations,{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Faster Progress
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              Our AI analyzes your performance patterns, identifies knowledge gaps, and creates personalized practice plans that adapt as you improve.
            </p>

            <div className="space-y-4">
              {[
                { icon: Target, title: 'Weak Area Detection', desc: 'AI identifies topics where you need more practice' },
                { icon: TrendingUp, title: 'Adaptive Difficulty', desc: 'Questions get harder as you improve' },
                { icon: Lightbulb, title: 'Study Suggestions', desc: 'Daily recommendations based on your goals' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - AI Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-strong rounded-2xl p-6 glow-primary-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Study Plan</h3>
                  <p className="text-xs text-muted-foreground">Personalized for you</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weak: Number Series</span>
                    <span className="text-xs text-destructive font-semibold">42% accuracy</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {"You're struggling with pattern recognition. Practice recommended."}
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Start Practice <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Improve: Data Interpretation</span>
                    <span className="text-xs text-warning font-semibold">68% accuracy</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Good progress! A few more sessions will help you master this.
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Continue Learning <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Strong: Verbal Ability</span>
                    <span className="text-xs text-success font-semibold">89% accuracy</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Excellent! Maintain your edge with occasional practice.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{"Today's Focus"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete 20 Number Series questions to improve your weak area. Estimated time: 25 minutes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
