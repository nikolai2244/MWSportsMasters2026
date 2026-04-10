import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Target, Zap, Trophy, BarChart3 } from "lucide-react"
import { calculateBetStats, formatCurrency } from "@/lib/utils"

export default function KPICards({ bets = [] }) {
  const stats = calculateBetStats(bets)

  const cards = [
    {
      label: "Total Bets",
      value: stats.total,
      icon: Target,
      color: "text-foreground",
      bg: "bg-surface2/50",
      trend: null,
    },
    {
      label: "Active",
      value: stats.active,
      icon: Zap,
      color: "text-active",
      bg: "bg-active/5",
      trend: null,
    },
    {
      label: "Wins",
      value: stats.wins,
      icon: Trophy,
      color: "text-win",
      bg: "bg-win/5",
      trend: `${stats.winRate}%`,
    },
    {
      label: "Losses",
      value: stats.losses,
      icon: TrendingDown,
      color: "text-loss",
      bg: "bg-loss/5",
      trend: null,
    },
    {
      label: "Total Stake",
      value: formatCurrency(stats.totalStaked),
      icon: BarChart3,
      color: "text-muted-foreground",
      bg: "bg-surface2/50",
      trend: null,
    },
    {
      label: "P&L",
      value: formatCurrency(stats.totalWinnings - stats.totalStaked),
      icon: stats.totalWinnings - stats.totalStaked >= 0 ? TrendingUp : TrendingDown,
      color: stats.totalWinnings - stats.totalStaked >= 0 ? "text-win" : "text-loss",
      bg: stats.totalWinnings - stats.totalStaked >= 0 ? "bg-win/5" : "bg-loss/5",
      trend: `${stats.roi}%`,
      glow: stats.totalWinnings - stats.totalStaked >= 0 ? "glow-win" : "glow-loss",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`rounded-lg border border-border/50 ${card.bg} p-4 ${card.glow || ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
                {card.label}
              </span>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="flex items-baseline justify-between">
              <p className={`font-mono text-lg md:text-xl font-bold ${card.color}`}>
                {typeof card.value === 'number' && card.value > 100 ? card.value.toLocaleString() : card.value}
              </p>
              {card.trend && (
                <span className="text-[10px] font-mono text-muted-foreground ml-2">
                  {card.trend}
                </span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}