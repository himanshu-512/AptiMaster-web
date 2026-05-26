'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Smartphone, Download, Star, ChevronRight, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileAppSection() {
  return (
    <section id="download" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border/50 overflow-hidden p-8 md:p-12 lg:p-16">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/20 rounded-full blur-[80px]" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Practice{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  On the Go
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
                Download the AptiRush app for the best mobile experience. Practice anywhere, anytime with offline support and push notifications for contests.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8 rating on Play Store</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90"
                >
                  <Link href="/download">
                    <Download className="mr-2 w-5 h-5" />
                    Download for Android
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold rounded-2xl"
                >
                  <QrCode className="mr-2 w-5 h-5" />
                  Scan QR Code
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border/30">
                {[
                  { value: '100K+', label: 'Downloads' },
                  { value: '4.8', label: 'Rating' },
                  { value: 'Free', label: 'Forever' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl font-bold font-[family-name:var(--font-sora)]">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Phone frame */}
                <div className="relative w-64 h-[520px] rounded-[3rem] bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/10 p-2 shadow-2xl">
                  <div className="w-full h-full rounded-[2.5rem] bg-background overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-muted-foreground/20 rounded-full" />
                    
                    {/* Screen content */}
                    <div className="pt-12 px-4 pb-4 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Good morning</p>
                          <h4 className="font-semibold text-sm">Rahul Kumar</h4>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                          RK
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { label: 'XP', value: '2,450' },
                          { label: 'Streak', value: '12' },
                          { label: 'Level', value: '15' },
                        ].map((stat) => (
                          <div key={stat.label} className="p-2 rounded-xl bg-muted/50 text-center">
                            <div className="text-sm font-bold">{stat.value}</div>
                            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Quick actions */}
                      <div className="space-y-2 mb-4">
                        {[
                          { label: 'Continue Practice', color: 'bg-primary' },
                          { label: 'Smart Practice', color: 'bg-accent' },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className={`w-full p-3 rounded-xl ${action.color} text-white text-sm font-medium flex items-center justify-between`}
                          >
                            {action.label}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="mt-auto p-3 rounded-xl bg-muted/50">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Daily Goal</span>
                          <span className="font-medium">15/20 questions</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Offline Ready</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
