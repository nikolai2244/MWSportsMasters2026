// ESPN Free API — Masters 2026
const ESPN_MASTERS_URL =
  "https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?tournamentId=401811941"

const FLAG_MAP = {
  USA: "🇺🇸",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  NIR: "🇬🇧",
  IRL: "🇮🇪",
  ESP: "🇪🇸",
  SWE: "🇸🇪",
  NOR: "🇳🇴",
  AUS: "🇦🇺",
  JPN: "🇯🇵",
  KOR: "🇰🇷",
  ZAF: "🇿🇦",
  ARG: "🇦🇷",
  CAN: "🇨🇦",
  GER: "🇩🇪",
  FRA: "🇫🇷",
  ITA: "🇮🇹",
  CHN: "🇨🇳",
  MEX: "🇲🇽",
  BEL: "🇧🇪",
  NZL: "🇳🇿",
  COL: "🇨🇴",
  VEN: "🇻🇪",
  FIJ: "🇫🇯",
  THA: "🇹🇭",
  TWN: "🇹🇼",
  DNK: "🇩🇰",
  POR: "🇵🇹",
  SUI: "🇨🇭",
  NLD: "🇳🇱",
  SEL: "🇱🇻",
}

export const DEMO_LEADERBOARD = [
  { pos: 1, name: "Scottie Scheffler", country: "USA", flag: "🇺🇸", r1: 65, r2: 68, r3: null, r4: null, total: 133, toPar: -9, toParDisplay: "-9", thru: "F", status: "finished" },
  { pos: 2, name: "Rory McIlroy", country: "NIR", flag: "🇬🇧", r1: 66, r2: 69, r3: null, r4: null, total: 135, toPar: -7, toParDisplay: "-7", thru: "F", status: "finished" },
  { pos: 3, name: "Jon Rahm", country: "ESP", flag: "🇪🇸", r1: 68, r2: 68, r3: null, r4: null, total: 136, toPar: -6, toParDisplay: "-6", thru: "F", status: "finished" },
  { pos: 4, name: "Collin Morikawa", country: "USA", flag: "🇺🇸", r1: 67, r2: 70, r3: null, r4: null, total: 137, toPar: -5, toParDisplay: "-5", thru: "F", status: "finished" },
  { pos: 5, name: "Ludvig Aberg", country: "SWE", flag: "🇸🇪", r1: 69, r2: 69, r3: null, r4: null, total: 138, toPar: -4, toParDisplay: "-4", thru: "F", status: "finished" },
]

export const DEMO_PLAYER_NAMES = DEMO_LEADERBOARD.map(p => p.name)

export const TOURNAMENT_INFO = {
  name: "The Masters Tournament 2026",
  venue: "Augusta National Golf Club",
  currentRound: 2,
  status: "live",
  year: 2026,
}

export async function fetchMastersLeaderboard() {
  try {
    const res = await fetch(ESPN_MASTERS_URL)
    if (!res.ok) return null // API error handled gracefully
    const data = await res.json()

    const competition = data?.events?.[0]?.competitions?.[0]
    if (!competition) return null // No competition data found

    const competitors = competition.competitors || []

    const leaderboard = competitors
      .sort((a, b) => parseInt(a.status?.position?.id || 999) - parseInt(b.status?.position?.id || 999))
      .map((player) => {
        const linescores = player.linescores || []
        const countryCode = player.athlete?.flag?.abbreviation || player.athlete?.country || ""
        const toPar = player.status?.overall?.displayValue || player.score?.displayValue || "E"
        const toParNum = toPar === "E" ? 0 : parseInt(toPar)

        return {
          pos: parseInt(player.status?.position?.id) || player.sortOrder,
          posDisplay: player.status?.position?.displayValue || String(player.sortOrder),
          name: player.athlete?.displayName || "Unknown",
          country: countryCode,
          flag: FLAG_MAP[countryCode] || "🏌️",
          r1: linescores[0] ? parseInt(linescores[0].value) : null,
          r2: linescores[1] ? parseInt(linescores[1].value) : null,
          r3: linescores[2] ? parseInt(linescores[2].value) : null,
          r4: linescores[3] ? parseInt(linescores[3].value) : null,
          total: player.status?.overall?.totalScore || null,
          toPar: toParNum,
          toParDisplay: toPar,
          thru: player.status?.thru?.displayValue || player.status?.displayValue || "-",
          status: player.status?.type?.description || "",
        }
      })

    const event = data?.events?.[0]
    const tournamentInfo = {
      name: event?.shortName || event?.name || "The Masters Tournament 2026",
      venue: competition?.venue?.fullName || "Augusta National Golf Club",
      currentRound: competition?.status?.period || 1,
      status: competition?.status?.type?.name === "STATUS_IN_PROGRESS"
        ? "live"
        : competition?.status?.type?.completed
        ? "complete"
        : "upcoming",
      year: 2026,
    }

    return { leaderboard, tournamentInfo }
  } catch (err) {
    // Error fetching ESPN leaderboard (silently handled)
    return { leaderboard: DEMO_LEADERBOARD, tournamentInfo: TOURNAMENT_INFO }
  }
}