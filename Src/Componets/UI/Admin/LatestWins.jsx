import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, TrendingUp, Award } from "lucide-react"
// import { base44 } from "@/api/base44Client"
import { formatCurrency } from "@/lib/utils"

const DEMO_WINS = [
  {
    id: 1,
    event_name: "Players Championship",
    pick: "Scottie Scheffler Top 5",
    odds: "+180",
    payout: "$560",
    date: "Mar 2025",
  },
  {
    id: 2,
    event_name: "Arnold Palmer Invitational",
    pick: "Rory McIlroy Outright",
    odds: "+1200",
    payout: "$2,400",
    date: "Mar 2025",
  },
  {
    id: 3,
    event_name: "WGC Match Play",
    pick: "Collin Morikawa R1 Winner",
    odds: "+250",
    payout: "$350",
    date: "Mar 2025",
  },
]

export default function LatestWins() {
  const [wins, setWins] = useState(DEMO_WINS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWins = async () => {
      try {
        // const data = await base44.entities.LatestWin.list("-created_date", 6)
        if (data && data.length > 0) setWins(data)
      } catch (err) {
        // Failed to fetch wins (silently handled)
      } finally {
        setLoading(false)
      }
    }
    fetchWins()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-surface2/50 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-surface2/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Trophy className="h-7 w-7 text-gold" />
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="gold-shimmer">WINNERS</span> Board
          </h2>
        </motion.div>

        {/* Win Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {wins.map((win, idx) => (
            <motion.div
              key={win.id || idx}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative rounded-xl border border-win/20 bg-gradient-to-br from-card to-surface2/50 p-6 overflow-hidden group hover:shadow-xl hover:shadow-win/20 transition-all"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-win/5 rounded-full blur-3xl group-hover:bg-win/10 transition-all" />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-mono text-muted-foreground bg-surface2 px-2.5 py-1 rounded">
                    {win.date}
                  </span>
                  <motion.div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-win/15 text-win"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Award className="h-3 w-3" />
                    <span className="text-[10px] font-mono font-bold">WIN</span>
                  </motion.div>
                </div>

                {/* Event & Pick */}
                <h3 className="font-display text-base font-bold mb-2 text-foreground line-clamp-2">
                  {win.event_name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {win.pick}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Odds</p>
                    <p className="font-mono text-base font-bold text-gold">{win.odds}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Payout</p>
                    <p className="font-mono text-base font-bold text-win">{win.payout}</p>
                  </div>
                </div>
              </div>

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10"
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Join 500+ VIP members tracking winning picks
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-background font-semibold rounded-lg transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            Get VIP Access
          </a>
        </motion.div>
      </div>
    </section>
  )
}