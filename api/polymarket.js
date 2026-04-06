// /api/polymarket.js — Curated Sentiment Indicators
// Intelligent filtering: only macro, geopolitics, markets
// + Tracked elections (Brazil, US Midterms)

const EXCLUDE = [
  "airdrop","nft","memecoin","meme coin","solana price","eth price","btc price","dogecoin",
  "shiba","pepe coin","bonk","floki","token launch","token listing","dex","defi protocol",
  "celebrity","kardashian","swift","drake","kanye","beyonce","grammys","oscars","emmy",
  "super bowl","nfl","nba","mlb","nhl","ufc","boxing","f1 race","world cup","champions league",
  "tiktok ban","youtube","streamer","twitch","influencer","onlyfans",
  "alien","ufo","paranormal","flat earth","simulation",
  "bachelor","married","divorce","baby","pregnant",
  "elon musk twitter","x rebrand","threads app",
];

const MACRO_KEYS = ["recession","gdp","inflation","cpi","pce","interest rate","rate cut","rate hike",
  "fed ","ecb","boj","central bank","monetary policy","fiscal","deficit","debt ceiling","government shutdown",
  "employment","unemployment","nonfarm","jobless","wage","labor"];
const GEOPO_KEYS = ["war","invasion","sanction","nato","un security","missile","nuclear","ceasefire",
  "iran","israel","ukraine","russia","china","taiwan","north korea","middle east","opec","oil embargo",
  "election","president","prime minister","chancellor","parliament","impeach","resign","coup"];
const MARKET_KEYS = ["s&p","nasdaq","dow","stock","index","oil price","gold price","brent","crude",
  "commodity","treasury","yield","bond","dollar","euro","yen","yuan","tariff","trade war"];
const ARG_KEYS_S = ["argentin","milei","peso","bcra","caputo","kirchn","peronism","cepo","devalua",
  "libertad avanza","vaca muerta","ypf","buenos aires"];

function scoreEvent(q, vol) {
  const low = q.toLowerCase();
  let relevance = 0, impact = 0;

  // Macro
  if (MACRO_KEYS.some(k => low.includes(k))) { relevance += 4; impact += 4; }
  // Geopolitics
  if (GEOPO_KEYS.some(k => low.includes(k))) { relevance += 3; impact += 4; }
  // Markets
  if (MARKET_KEYS.some(k => low.includes(k))) { relevance += 3; impact += 3; }
  // Argentina bonus
  if (ARG_KEYS_S.some(k => low.includes(k))) { relevance += 5; impact += 5; }
  // Election bonus
  if (low.includes("election") || low.includes("president")) { relevance += 2; impact += 3; }

  // Volume score (0-5)
  const volScore = vol >= 1e6 ? 5 : vol >= 500000 ? 4 : vol >= 100000 ? 3 : vol >= 10000 ? 2 : vol >= 1000 ? 1 : 0;

  return Math.min(relevance, 5) + Math.min(impact, 5) + volScore;
}

function categorize(q) {
  const low = q.toLowerCase();
  if (MACRO_KEYS.some(k => low.includes(k))) return "macro";
  if (GEOPO_KEYS.some(k => low.includes(k))) return "geopolitics";
  if (MARKET_KEYS.some(k => low.includes(k))) return "markets";
  if (low.includes("election") || low.includes("president")) return "geopolitics";
  return "macro"; // default
}

function normalizeTitle(q) {
  return q
    .replace(/^Will /i, "")
    .replace(/\?$/, "")
    .replace(/ by (\w+ \d+,? \d{4})/i, " (antes de $1)")
    .replace(/ before (\w+ \d+,? \d{4})/i, " (antes de $1)")
    .replace(/ in 2026/i, " en 2026")
    .replace(/ in 2027/i, " en 2027");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  try {
    // 1. Fetch from strategic tags
    const tags = ["argentina","politics","economics","world-politics","elections","inflation","geopolitics","midterms"];
    const fetches = tags.map(tag =>
      fetch(`https://gamma-api.polymarket.com/events?tag=${tag}&limit=40&active=true&closed=false&order=volume&ascending=false`,
        { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => [])
    );

    // 2. Fetch tracked elections
    const trackedSlugs = [
      "brazil-presidential-election",
      "which-party-will-win-the-house-in-2026",
      "which-party-will-win-the-senate-in-2026",
      "balance-of-power-2026-midterms",
    ];
    const trackedFetches = trackedSlugs.map(slug =>
      fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`,
        { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => [])
    );

    const [tagResults, trackedResults] = await Promise.all([
      Promise.all(fetches),
      Promise.all(trackedFetches),
    ]);

    // 3. Process tracked elections
    const tracked = [];
    for (const events of trackedResults) {
      if (!Array.isArray(events) || !events.length) continue;
      const ev = events[0];
      if (!ev.markets) continue;
      for (const m of ev.markets) {
        let outcomes, prices;
        try { outcomes = JSON.parse(m.outcomes||"[]"); prices = JSON.parse(m.outcomePrices||"[]"); } catch { continue; }
        if (!outcomes.length || !prices.length) continue;
        tracked.push({
          id: m.id,
          title: m.question || ev.title,
          outcomes: outcomes.map((o,i) => ({ label:o, prob:parseFloat(prices[i])||0 })),
          volume: parseFloat(m.volume) || 0,
          slug: ev.slug,
          group: ev.title,
        });
      }
    }

    // 4. Process general events with scoring
    const seen = new Set(tracked.map(t => t.id));
    const curated = [];

    for (const events of tagResults) {
      if (!Array.isArray(events)) continue;
      for (const ev of events) {
        if (!ev.markets) continue;
        for (const m of ev.markets) {
          if (seen.has(m.id)) continue;
          seen.add(m.id);

          let outcomes, prices;
          try { outcomes = JSON.parse(m.outcomes||"[]"); prices = JSON.parse(m.outcomePrices||"[]"); } catch { continue; }
          if (!outcomes.length || !prices.length) continue;

          const q = (m.question || ev.title || "");
          const low = q.toLowerCase();

          // Exclude
          if (EXCLUDE.some(k => low.includes(k))) continue;

          const vol = parseFloat(m.volume) || 0;
          const score = scoreEvent(q, vol);
          if (score < 8) continue;

          const isArg = ARG_KEYS_S.some(k => low.includes(k));

          curated.push({
            id: m.id,
            title: normalizeTitle(q),
            probability: parseFloat(prices[0]) || 0,
            volume: vol,
            category: categorize(q),
            score,
            isArg,
          });
        }
      }
    }

    curated.sort((a, b) => b.score - a.score || b.volume - a.volume);

    return res.status(200).json({
      tracked: tracked.slice(0, 20),
      indicators: curated.slice(0, 15),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
