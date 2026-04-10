import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Medal, Zap } from 'lucide-react'

export default function LeaderboardTable({ leaderboard = [], tournamentInfo = {}, compact = false }) {
  const [sortBy, setSortBy] = useState('pos')
  const [expandedPlayer, setExpandedPlayer] = useState(null)

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-20 border border-border/30 rounded-lg bg-surface2/30">
        <p className="text-muted-foreground mb-4">No leaderboard data available</p>
      </div>
    )
  }

  const displayData = compact ? leaderboard.slice(0, 10) : leaderboard

  const getMedalIcon = (pos) => {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return null
  }

  const getRowColor = (pos) => {
    if (pos === 1) return 'bg-gold/5 border-l-4 border-l-gold'
    if (pos === 2) return 'bg-foreground/5 border-l-4 border-l-foreground/30'
    if (pos === 3) return 'bg-active/5 border-l-4 border-l-active'
    return 'hover:bg-surface-offset/50'
  }

  const getToParColor = (toPar) => {
    if (toPar < -3) return 'text-win font-bold'
    if (toPar < 0) return 'text-win'
    if (toPar === 0) return 'text-muted-foreground'
    return 'text-loss'
  }

  const getToParDisplay = (toPar) => {
    if (toPar === 0) return 'E'
    if (toPar > 0) return `+${toPar}`
    return String(toPar)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
        <p className="text-sm text-muted-foreground">
          Showing {displayData.length} of {leaderboard.length} players
        </p>
        <div className="text-xs text-muted-foreground">
          {tournamentInfo.status === 'live' && (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-loss animate-pulse" />
              Live Updates
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 border-b border-border/50 sticky top-0">
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground font-semibold w-12">
                POS
              </th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground font-semibold">
                PLAYER
              </th>
              <th className="text-center px-3 py-3 font-mono text-xs text-muted-foreground font-semibold">
                R1
              </th>
              <th className="text-center px-3 py-3 font-mono text-xs text-muted-foreground font-semibold">
                R2
              </th>
              {!compact && (
                <>
                  <th className="text-center px-3 py-3 font-mono text-xs text-muted-foreground font-semibold">
                    R3
                  </th>
                  <th className="text-center px-3 py-3 font-mono text-xs text-muted-foreground font-semibold">
                    R4
                  </th>
                </>
              )}
              <th className="text-center px-4 py-3 font-mono text-xs text-muted-foreground font-semibold">
                TOTAL
              </th>
              <th className="text-center px-4 py-3 font-mono text-xs text-muted-foreground font-semibold">
                TO PAR
              </th>
              <th className="text-center px-4 py-3 font-mono text-xs text-muted-foreground font-semibold">
                THRU
              </th>
            </tr>
          </thead>
          <tbody>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayData.map((player, idx) => {
                const medal = getMedalIcon(player.pos)
                const isExpanded = expandedPlayer === player.id

                return (
                  <motion.tr
                    key={player.id || idx}
                    variants={rowVariants}
                    className={`border-b border-border/30 transition-all cursor-pointer ${getRowColor(player.pos)}`}
                    onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                  >
                    {/* Position */}
                    <td className="px-4 py-3 font-mono text-xs font-bold sticky left-0 z-10 bg-inherit">
                      <span className="flex items-center gap-2">
                        {medal && <span className="text-lg">{medal}</span>}
                        <span className={player.pos <= 3 ? 'text-gold' : 'text-muted-foreground'}>
                          {player.pos}
                        </span>
                      </span>
                    </td>

                    {/* Player Name */}
                    <td className="px-4 py-3 sticky left-12 z-10 bg-inherit">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{player.flag}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.country}</p>
                        </div>
                      </div>
                    </td>

                    {/* Scores */}
                    <td className="text-center px-3 py-3 font-mono text-xs">
                      {player.r1 ? (
                        <span className="bg-surface2/50 px-2 py-1 rounded">
                          {player.r1}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-center px-3 py-3 font-mono text-xs">
                      {player.r2 ? (
                        <span className="bg-surface2/50 px-2 py-1 rounded">
                          {player.r2}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {!compact && (
                      <>
                        <td className="text-center px-3 py-3 font-mono text-xs">
                          {player.r3 ? (
                            <span className="bg-surface2/50 px-2 py-1 rounded">
                              {player.r3}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="text-center px-3 py-3 font-mono text-xs">
                          {player.r4 ? (
                            <span className="bg-surface2/50 px-2 py-1 rounded">
                              {player.r4}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </>
                    )}

                    {/* Total */}
                    <td className="text-center px-4 py-3 font-mono text-sm font-bold">
                      {player.total || '—'}
                    </td>

                    {/* To Par */}
                    <td className={`text-center px-4 py-3 font-mono text-sm font-bold ${getToParColor(player.toPar)}`}>
                      {getToParDisplay(player.toPar)}
                    </td>

                    {/* Thru */}
                    <td className="text-center px-4 py-3 font-mono text-xs text-muted-foreground">
                      {player.thru}
                    </td>

                    {/* Expand Icon */}
                    <td className="px-2 py-3">
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-muted-foreground text-center pt-4">
        <p>
          {tournamentInfo.name} • Round {tournamentInfo.currentRound}/{tournamentInfo.totalRounds}
        </p>
      </div>
    </div>
  )
}
