import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, TrendingUp, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LeaderboardTable from '../components/LeaderboardTable'
import { getCachedLeaderboard } from '@/api/espnIntegration'

export default function Leaderboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const result = await getCachedLeaderboard()
      
      if (result.success) {
        setData(result)
        setError(null)
        setLastUpdate(new Date())
      } else {
        setError(result.error || 'Failed to load leaderboard')
        setData(null)
      }
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()

    // Auto-refresh every 60 seconds
    const interval = autoRefresh ? setInterval(loadLeaderboard, 60000) : null
    return () => interval && clearInterval(interval)
  }, [autoRefresh])

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(data.leaderboard, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `masters-leaderboard-${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareLeaderboard = async () => {
    if (!navigator.share) {
      // Leaderboard URL copied to clipboard (alert removed for production)
      navigator.clipboard.writeText(window.location.href)
      return
    }

    await navigator.share({
      title: 'Masters 2026 Leaderboard',
      text: 'Check out the live Masters 2026 leaderboard from MayorWard Sports!',
      url: window.location.href,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <motion.section
        className="relative py-12 px-4 bg-gradient-to-b from-primary/10 to-transparent border-b border-border/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                {data?.tournamentInfo?.name || 'Tournament Leaderboard'}
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <p className="text-sm">
                  📍 {data?.tournamentInfo?.venue || 'Augusta National Golf Club'}
                </p>
                {data?.tournamentInfo?.status === 'live' && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-loss/15 text-loss rounded-full text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-loss animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={loadLeaderboard}
                disabled={loading}
                className="border-border/50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Updating' : 'Refresh'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={exportAsJSON}
                className="border-border/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={shareLeaderboard}
                className="border-border/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/30">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Players</p>
                <p className="font-display text-2xl font-bold">
                  {data.leaderboard.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Round</p>
                <p className="font-display text-2xl font-bold">
                  {data.tournamentInfo.currentRound}/{data.tournamentInfo.totalRounds}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Leader</p>
                <p className="font-display text-lg font-bold truncate">
                  {data.leaderboard[0]?.name || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Updated</p>
                <p className="text-xs font-mono">
                  {lastUpdate?.toLocaleTimeString() || '—'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-loss/10 border border-loss/30 rounded-lg"
            >
              <p className="text-sm text-loss font-semibold">{error}</p>
            </motion.div>
          )}

          {loading && !data ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-border/30 border-t-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            </div>
          ) : data ? (
            <LeaderboardTable
              leaderboard={data.leaderboard}
              tournamentInfo={data.tournamentInfo}
              compact={false}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No leaderboard data available</p>
              <Button onClick={loadLeaderboard}>Try Again</Button>
            </div>
          )}

          {/* Auto-refresh toggle */}
          <div className="mt-8 flex items-center justify-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                Auto-refresh every 60 seconds
              </span>
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}
