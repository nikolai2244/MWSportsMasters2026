import { useState, useEffect, useCallback } from 'react'
import { getCachedLeaderboard, clearLeaderboardCache } from '@/api/espnIntegration'

export const useLeaderboard = (autoRefresh = true, refreshInterval = 60000) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getCachedLeaderboard()

      if (result.success) {
        setData(result)
        setError(null)
        setIsLive(result.tournamentInfo?.status === 'live')
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
  }, [])

  useEffect(() => {
    fetchData()

    if (!autoRefresh) return

    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchData])

  const refresh = useCallback(() => {
    clearLeaderboardCache()
    return fetchData()
  }, [fetchData])

  return {
    leaderboard: data?.leaderboard || [],
    tournamentInfo: data?.tournamentInfo || null,
    loading,
    error,
    isLive,
    lastUpdate,
    refresh,
  }
}
