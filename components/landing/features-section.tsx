'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Zap, TrendingUp, Bookmark, Shuffle } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Smart Practice',
    description: 'AI analyzes your performance and creates personalized question sets targeting your weak areas.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Target,
    title: 'Topic Mastery',
    description: 'Deep dive into specific topics with structured learning paths and comprehensive coverage.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Zap,
    title: 'Quick Practice',
    description: 'Short, focused sessions perfect for daily practice and maintaining your streak.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your improvement with detailed analytics and performance insights.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks & Review',
    description: 'Save difficult questions for later review and build your personal question bank.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Shuffle,
    title: 'Random Practice',
    description: 'Test your overall readiness with mixed-topic random question sessions.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Smart Practice,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Multiple practice modes designed to match your learning style and exam preparation needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
