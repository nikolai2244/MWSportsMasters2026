import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Trophy, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LeaderboardTable from '../components/LeaderboardTable'
import LatestWins from '../components/LatestWins'
import KPICards from '../components/KPICards'
import { useState, useEffect } from 'react'
import { getCachedLeaderboard } from '@/api/espnIntegration'

export default function Home() {
  const [leaderboard, setLeaderboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const result = await getCachedLeaderboard()
      if (result.success) {
        setLeaderboard(result)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="max-w-6xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <p className="font-mono text-xs text-gold tracking-[0.3em] mb-4 uppercase">
              ⛳ Augusta National • Masters 2026
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gold-shimmer block mb-2">Elite Golf Betting</span>
              <span className="text-foreground">Analysis & Picks</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Powered by 3+ years of AI simulation, expert analysis, and real-time ESPN leaderboard data.
              Join 500+ VIP members winning with data-driven picks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-background font-semibold text-base px-8">
                  <Zap className="h-5 w-5 mr-2" />
                  Get VIP Access
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 font-semibold text-base px-8">
                  <Trophy className="h-5 w-5 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-border/30"
          >
            {[
              { label: 'Win Rate', value: '83%', icon: TrendingUp },
              { label: 'Golf Accuracy', value: '91%', icon: Target },
              { label: 'Total Picks', value: '2,800+', icon: Trophy },
              { label: 'VIP Members', value: '500+', icon: Zap },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="font-display text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Live Leaderboard Section */}
      <section className="py-16 px-4 bg-surface2/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              <span className="gold-shimmer">LIVE</span> Leaderboard
            </h2>
            <p className="text-muted-foreground">Real-time scoring from ESPN • Updated every 60 seconds</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="w-8 h-8 rounded-full border-4 border-border/30 border-t-gold" />
              </div>
            </div>
          ) : leaderboard ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <LeaderboardTable
                leaderboard={leaderboard.leaderboard}
                tournamentInfo={leaderboard.tournamentInfo}
                compact={true}
              />
              <div className="text-center mt-8">
                <Link to="/leaderboard">
                  <Button variant="outline" className="border-border/50">
                    View Full Leaderboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Latest Wins */}
      <LatestWins />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="text-gold">MayorWard</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: '🤖',
                title: 'Elite AI Analysis',
                desc: '3+ years of computational modeling combined with real-world PGA data',
              },
              {
                icon: '📊',
                title: 'Real-Time Data',
                desc: 'Live ESPN leaderboard integration with instant updates during tournaments',
              },
              {
                icon: '🏆',
                title: 'Proven Results',
                desc: '91% accuracy on golf picks, 83% across all sports in 2025',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-xl border border-border/50 bg-card p-8 hover:shadow-lg hover:shadow-gold/10 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready for Elite <span className="text-gold">Analysis</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join our VIP community and get exclusive picks for Masters 2026
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gold text-background hover:bg-gold/90 font-semibold">
                  Get VIP Access Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-gold/50">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
