// constants/leaderboard.js
// ESPN Free API — no API key required
// Masters 2026 Tournament ID: 401811941

const ESPN_MASTERS_URL =
  "https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?tournamentId=401811941";

// Country code → flag emoji map
const FLAG_MAP = {
  USA: "🇺🇸", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  NIR: "🇬🇧", IRL: "🇮🇪", ESP: "🇪🇸", SWE: "🇸🇪", NOR: "🇳🇴",
  AUS: "🇦🇺", JPN: "🇯🇵", KOR: "🇰🇷", ZAF: "🇿🇦", ARG: "🇦🇷",
  CAN: "🇨🇦", GER: "🇩🇪", FRA: "🇫🇷", ITA: "🇮🇹", CHN: "🇨🇳",
  MEX: "🇲🇽", BEL: "🇧🇪", NZL: "🇳🇿", COL: "🇨🇴", VEN: "🇻🇪",
  FIJ: "🇫🇯", THA: "🇹🇭", TWN: "🇹🇼", DNK: "🇩🇰",
};

function getFlag(countryCode) {
  return FLAG_MAP[countryCode] || "🏌️";
}

function parseRoundScore(linescores, roundNum) {
  if (!linescores) return null;
  const round = linescores.find(r => r.period === roundNum || r.periodText === `Round ${roundNum}`);
  return round ? parseInt(round.value) : null;
}

export async function fetchMastersLeaderboard() {
  try {
    const res = await fetch(ESPN_MASTERS_URL);
    if (!res.ok) return null; // API error handled gracefully
    const data = await res.json();

    const competition = data?.events?.[0]?.competitions?.[0];
    if (!competition) return null; // No competition data found

    const competitors = competition.competitors || [];

    const leaderboard = competitors
      .sort((a, b) => parseInt(a.status?.position?.id || 999) - parseInt(b.status?.position?.id || 999))
      .map((player) => {
        const linescores = player.linescores || [];
        const r1 = linescores[0] ? parseInt(linescores[0].value) : null;
        const r2 = linescores[1] ? parseInt(linescores[1].value) : null;
        const r3 = linescores[2] ? parseInt(linescores[2].value) : null;
        const r4 = linescores[3] ? parseInt(linescores[3].value) : null;

        const countryCode = player.athlete?.flag?.abbreviation || player.athlete?.country || "";
        const toPar = player.status?.overall?.displayValue || player.score?.displayValue || "E";
        const toParNum = toPar === "E" ? 0 : parseInt(toPar);

        return {
          pos: parseInt(player.status?.position?.id) || player.sortOrder,
          posDisplay: player.status?.position?.displayValue || String(player.sortOrder),
          name: player.athlete?.displayName || "Unknown",
          country: countryCode,
          flag: getFlag(countryCode),
          r1,
          r2,
          r3,
          r4,
          total: player.status?.overall?.totalScore || null,
          toPar: toParNum,
          toParDisplay: toPar,
          thru: player.status?.thru?.displayValue || player.status?.displayValue || "-",
          status: player.status?.type?.description || "",
        };
      });

    // Build TOURNAMENT_INFO from the event
    const event = data?.events?.[0];
    const tournamentInfo = {
      name: event?.shortName || event?.name || "Masters Tournament 2026",
      venue: competition?.venue?.fullName || "Augusta National Golf Club",
      currentRound: competition?.status?.period || 1,
      status: competition?.status?.type?.name === "STATUS_IN_PROGRESS"
        ? "live"
        : competition?.status?.type?.completed
        ? "complete"
        : "upcoming",
    };

    return { leaderboard, tournamentInfo };

  } catch (err) {
    // Error fetching ESPN leaderboard (silently handled)
    return null; // caller should fall back to DEMO data
  }
}

// ---------- FALLBACK DEMO DATA (used if API fails) ----------
export const DEMO_LEADERBOARD = [
  { pos: 1, name: "Scottie Scheffler", country: "USA", flag: "🇺🇸", r1: 65, r2: 68, r3: null, r4: null, total: 133, toPar: -9, toParDisplay: "-9", thru: "F" },
  { pos: 2, name: "Rory McIlroy",      country: "NIR", flag: "🇬🇧", r1: 66, r2: 69, r3: null, r4: null, total: 135, toPar: -7, toParDisplay: "-7", thru: "F" },
  { pos: 3, name: "Jon Rahm",          country: "ESP", flag: "🇪🇸", r1: 68, r2: 68, r3: null, r4: null, total: 136, toPar: -6, toParDisplay: "-6", thru: "F" },
  // ... rest of demo rows
];

export const DEMO_PLAYER_NAMES = DEMO_LEADERBOARD.map(p => p.name);

export const TOURNAMENT_INFO = {
  name: "Masters Tournament 2026",
  venue: "Augusta National Golf Club",
  currentRound: 2,
  status: "live",
};
