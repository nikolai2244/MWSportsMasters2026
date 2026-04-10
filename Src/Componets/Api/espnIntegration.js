import axios from 'axios'

const MASTERS_TOURNAMENT_ID = '401811941'
const ESPN_BASE_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga'

// Country code → flag emoji mapping
const FLAG_MAP = {
  USA: '🇺🇸', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  NIR: '🇬🇧', IRL: '🇮🇪', ESP: '🇪🇸', SWE: '🇸🇪', NOR: '🇳🇴',
  AUS: '🇦🇺', JPN: '🇯🇵', KOR: '🇰🇷', ZAF: '🇿🇦', ARG: '🇦🇷',
  CAN: '🇨🇦', GER: '🇩🇪', FRA: '🇫🇷', ITA: '🇮🇹', CHN: '🇨🇳',
  MEX: '🇲🇽', BEL: '🇧🇪', NZL: '🇳🇿', COL: '🇨🇴', VEN: '🇻🇪',
  FIJ: '🇫🇯', THA: '🇹🇭', TWN: '🇹🇼', DNK: '🇩🇰', POR: '🇵🇹',
  SUI: '🇨🇭', NLD: '🇳🇱', LVA: '🇱🇻', CZE: '🇨🇿', POL: '🇵🇱',
}

const getFlag = (countryCode) => FLAG_MAP[countryCode?.toUpperCase()] || '🏌️'

// Parse round scores from linescores array
const parseRoundScores = (linescores = []) => ({
  r1: linescores[0] ? parseInt(linescores[0].value) : null,
  r2: linescores[1] ? parseInt(linescores[1].value) : null,
  r3: linescores[2] ? parseInt(linescores[2].value) : null,
  r4: linescores[3] ? parseInt(linescores[3].value) : null,
})

// Fetch real-time Masters leaderboard from ESPN
export const fetchMastersLeaderboard = async (retries = 3) => {
  try {
    const url = `${ESPN_BASE_URL}/leaderboard?tournamentId=${MASTERS_TOURNAMENT_ID}`
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const data = response.data
    const event = data?.events?.[0]
    const competition = event?.competitions?.[0]

    if (!competition) {
      return null // No competition data found
    }

    // Parse leaderboard
    const leaderboard = (competition.competitors || [])
      .sort((a, b) => {
        const posA = parseInt(a.status?.position?.id || '999')
        const posB = parseInt(b.status?.position?.id || '999')
        return posA - posB
      })
      .map((player, idx) => {
        const athlete = player.athlete || {}
        const status = player.status || {}
        const countryCode = athlete.flag?.abbreviation || athlete.country || 'USA'
        const toParStr = status.overall?.displayValue || '0'
        const toParNum = toParStr === 'E' ? 0 : parseInt(toParStr)
        const scores = parseRoundScores(player.linescores)

        return {
          id: athlete.id || idx,
          pos: parseInt(status.position?.id || idx + 1),
          posDisplay: status.position?.displayValue || String(idx + 1),
          name: athlete.displayName || 'Unknown',
          shortName: athlete.shortName || '',
          country: countryCode,
          flag: getFlag(countryCode),
          ...scores,
          total: status.overall?.totalScore || status.totalScore || null,
          toPar: toParNum,
          toParDisplay: toParStr,
          score: status.overall?.value || null,
          thru: status.thru?.displayValue || '-',
          strokes: status.displayValue || '-',
          status: status.type?.description || 'active',
          href: athlete.links?.[0]?.href || null,
        }
      })

    // Parse tournament info
    const tournamentInfo = {
      id: event.id,
      name: event.name || 'The Masters Tournament 2026',
      shortName: event.shortName || 'Masters',
      season: event.season,
      year: new Date().getFullYear(),
      venue: competition.venue?.fullName || 'Augusta National Golf Club',
      location: `${competition.venue?.city}, ${competition.venue?.state}` || 'Augusta, Georgia',
      dates: {
        start: event.startDate,
        end: event.endDate,
      },
      currentRound: competition.status?.period || 1,
      totalRounds: 4,
      status: competition.status?.type?.name === 'STATUS_IN_PROGRESS'
        ? 'live'
        : competition.status?.type?.completed
        ? 'complete'
        : 'upcoming',
      links: competition.links?.map(link => ({
        text: link.text,
        href: link.href,
      })) || [],
    }

    return {
      success: true,
      leaderboard,
      tournamentInfo,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    // ESPN API Error (silently handled)
    
    // Retry logic
    if (retries > 0) {
      // Retrying... (log removed for production)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return fetchMastersLeaderboard(retries - 1)
    }

    return {
      success: false,
      error: error.message,
      leaderboard: [],
      tournamentInfo: null,
    }
  }
}

// Fetch player details
export const fetchPlayerDetails = async (playerId) => {
  try {
    const url = `${ESPN_BASE_URL}/leaderboard?tournamentId=${MASTERS_TOURNAMENT_ID}`
    const response = await axios.get(url, { timeout: 10000 })
    
    const competition = response.data?.events?.[0]?.competitions?.[0]
    const player = competition?.competitors?.find(p => p.athlete?.id === playerId)

    if (!player) return null

    const athlete = player.athlete || {}
    const stats = player.statistics || []

    return {
      id: athlete.id,
      name: athlete.displayName,
      shortName: athlete.shortName,
      country: athlete.flag?.abbreviation || 'USA',
      flag: getFlag(athlete.flag?.abbreviation),
      headshot: athlete.headshot?.href || null,
      jersey: player.jersey,
      statistics: stats.map(stat => ({
        name: stat.name,
        displayName: stat.displayName,
        value: stat.value,
      })),
    }
  } catch (error) {
    // Fetch player details error (silently handled)
    return null
  }
}

// Cache management
let leaderboardCache = null
let cacheTimestamp = null
const CACHE_DURATION = 60000 // 1 minute

export const getCachedLeaderboard = async () => {
  const now = Date.now()
  
  if (leaderboardCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return { ...leaderboardCache, cached: true }
  }

  const result = await fetchMastersLeaderboard()
  
  if (result.success) {
    leaderboardCache = result
    cacheTimestamp = now
  }

  return { ...result, cached: false }
}

// Clear cache manually
export const clearLeaderboardCache = () => {
  leaderboardCache = null
  cacheTimestamp = null
}