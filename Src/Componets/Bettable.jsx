import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'
import { formatCurrency, formatOdds } from '@/lib/utils'

export default function BetTable({ bets = [], columns = [], emptyMessage = 'No bets entered yet.' }) {
  if (bets.length === 0) {
    return (
      <div className="text-center py-16 border border-border/30 rounded-lg bg-surface2/20">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-muted-foreground mb-2 font-semibold">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground/60">
          Head to the Admin Panel to create your first pick
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 border-b border-border/50 sticky top-0">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {bets.map((bet, idx) => (
                <motion.tr
                  key={bet.id || idx}
                  variants={rowVariants}
                  className="border-b border-border/30 hover:bg-surface-offset/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.key === 'status' ? (
                        <StatusBadge status={bet.status} />
                      ) : col.key === 'odds' ? (
                        <span className="font-mono text-sm font-bold text-gold">
                          {formatOdds(bet.odds)}
                        </span>
                      ) : col.key === 'stake' ? (
                        <span className="font-mono text-sm">{formatCurrency(bet.stake)}</span>
                      ) : col.render ? (
                        col.render(bet)
                      ) : (
                        <span className="text-sm">{bet[col.key] ?? '—'}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {bets.length > 0 && (
        <div className="grid grid-cols-4 gap-3 text-xs mt-4">
          <div className="bg-surface2/50 rounded-lg p-3 text-center">
            <p className="text-muted-foreground mb-1">Total</p>
            <p className="font-bold">{bets.length}</p>
          </div>
          <div className="bg-win/5 rounded-lg p-3 text-center border border-win/20">
            <p className="text-muted-foreground mb-1">Wins</p>
            <p className="font-bold text-win">{bets.filter(b => b.status === 'Win').length}</p>
          </div>
          <div className="bg-loss/5 rounded-lg p-3 text-center border border-loss/20">
            <p className="text-muted-foreground mb-1">Losses</p>
            <p className="font-bold text-loss">{bets.filter(b => b.status === 'Loss').length}</p>
          </div>
          <div className="bg-active/5 rounded-lg p-3 text-center border border-active/20">
            <p className="text-muted-foreground mb-1">Active</p>
            <p className="font-bold text-active">{bets.filter(b => b.status === 'Active').length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
