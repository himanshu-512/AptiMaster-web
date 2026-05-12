'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Flame, Star, TrendingUp } from 'lucide-react'

const leaderboardData = [
  { rank: 1, name: 'Priya S.', xp: 12450, streak: 45, level: 28, avatar: 'PS' },
  { rank: 2, name: 'Rahul K.', xp: 11890, streak: 38, level: 26, avatar: 'RK' },
  { rank: 3, name: 'Anjali M.', xp: 11245, streak: 32, level: 25, avatar: 'AM' },
  { rank: 4, name: 'Vikram P.', xp: 10780, streak: 29, level: 24, avatar: 'VP' },
  { rank: 5, name: 'Sneha R.', xp: 10340, streak: 25, level: 23, avatar: 'SR' },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-warning" />
    case 2:
      return <Medal className="w-5 h-5 text-muted-foreground" />
    case 3:
      return <Medal className="w-5 h-5 text-[#CD7F32]" />
    default:
      return null
  }
}

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-warning/20 to-warning/5 border-warning/30'
    case 2:
      return 'bg-gradient-to-r from-muted-foreground/10 to-transparent border-muted-foreground/20'
    case 3:
      return 'bg-gradient-to-r from-[#CD7F32]/10 to-transparent border-[#CD7F32]/20'
    default:
      return 'bg-card border-border/50'
  }
}

export function LeaderboardSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Leaderboard preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Global Leaderboard</h3>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {['Daily', 'Weekly', 'All Time'].map((period, i) => (
                    <button
                      key={period}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        i === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {[2, 1, 3].map((rank) => {
                  const user = leaderboardData.find(u => u.rank === rank)!
                  const heights = { 1: 'h-24', 2: 'h-20', 3: 'h-16' }
                  const sizes = { 1: 'w-16 h-16', 2: 'w-14 h-14', 3: 'w-14 h-14' }
                  
                  return (
                    <motion.div
                      key={rank}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: rank * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`${sizes[rank as keyof typeof sizes]} rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold mb-2 border-2 ${rank === 1 ? 'border-warning' : 'border-border'}`}>
                        {user.avatar}
                      </div>
                      <span className="text-xs font-medium mb-1">{user.name}</span>
                      <span className="text-xs text-muted-foreground mb-2">{user.xp.toLocaleString()} XP</span>
                      <div className={`w-16 ${heights[rank as keyof typeof heights]} rounded-t-lg flex items-center justify-center ${rank === 1 ? 'bg-gradient-to-t from-warning/30 to-warning/10' : 'bg-muted/50'}`}>
                        <span className="text-lg font-bold">{rank}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Rankings list */}
              <div className="space-y-2">
                {leaderboardData.slice(3).map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-xl border ${getRankBg(user.rank)}`}
                  >
                    <span className="w-6 text-center font-bold text-muted-foreground">{user.rank}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-warning" />
                          {user.streak}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{user.xp.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Compete &{' '}
              <span className="bg-gradient-to-r from-warning to-primary bg-clip-text text-transparent">
                Climb the Ranks
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              Challenge yourself against thousands of aspirants. Daily, weekly, and global leaderboards keep you motivated and competitive.
            </p>

            <div className="space-y-4">
              {[
                { icon: Trophy, title: 'Global Rankings', desc: 'Compete with aspirants across India' },
                { icon: Flame, title: 'Streak Rewards', desc: 'Maintain daily streaks for bonus XP' },
                { icon: Star, title: 'Level Up System', desc: 'Earn XP and unlock achievements' },
                { icon: TrendingUp, title: 'Progress Visibility', desc: 'Track your rank improvement over time' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/30"
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
        </div>
      </div>
    </section>
  )
}
