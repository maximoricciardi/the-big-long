// /api/polymarket.js — Curated Sentiment Indicators
// Tracked events + scored macro/geopolitical + specific markets

const EXCLUDE = [
  "airdrop","nft","memecoin","meme coin","solana price","eth price","btc price above","dogecoin",
  "shiba","pepe coin","bonk","floki","token launch","token listing","dex volume","defi protocol",
  "celebrity","kardashian","swift","drake","kanye","beyonce","grammys","oscars","emmy","grammy",
  "super bowl","nfl","nba","mlb","nhl","ufc","boxing","f1 race","world cup","champions league",
  "tiktok","youtube","streamer","twitch","influencer","onlyfans",
  "alien","ufo","paranormal","flat earth","simulation","zodiac",
  "bachelor","married","divorce","baby","pregnant",
  "elon musk twitter","x rebrand","threads app",
  "super ahorro","lottery","powerball","mega millions",
];

const MACRO_KEYS = ["recession","gdp","inflation","cpi","pce","interest rate","rate cut","rate hike",
  "fed ","ecb","boj","central bank","monetary policy","fiscal","deficit","debt ceiling","government shutdown",
  "employment","unemployment","nonfarm","jobless","wage","labor"];
const GEOPO_KEYS = ["war","invasion","sanction","nato","un security","missile","nuclear","ceasefire",
  "iran","israel","ukraine","russia","china","taiwan","north korea","middle east","opec","oil embargo",
  "election","president","prime minister","chancellor","parliament","impeach","resign","coup"];
const MARKET_KEYS = ["s&p","nasdaq","dow","stock market","index","oil price","gold price","brent","crude",
  "commodity","treasury","yield","bond","dollar","euro","yen","yuan","tariff","trade war","oil above","oil below"];
const ARG_KEYS = ["argentin","milei","peso","bcra","caputo","kirchn","peronism","cepo","devalua",
  "libertad avanza","vaca muerta","ypf","buenos aires"];

function scoreEvent(q, vol) {
  const low = q.toLowerCase();
  let rel = 0, imp = 0;
  if (MACRO_KEYS.some(k => low.includes(k))) { rel += 4; imp += 4; }
  if (GEOPO_KEYS.some(k => low.includes(k))) { rel += 3; imp += 4; }
  if (MARKET_KEYS.some(k => low.includes(k))) { rel += 3; imp += 3; }
  if (ARG_KEYS.some(k => low.includes(k))) { rel += 5; imp += 5; }
  if (low.includes("election") || low.includes("president")) { rel += 2; imp += 3; }
  const volScore = vol >= 1e6 ? 5 : vol >= 500000 ? 4 : vol >= 100000 ? 3 : vol >= 10000 ? 2 : vol >= 1000 ? 1 : 0;
  return Math.min(rel, 5) + Math.min(imp, 5) + volScore;
}

function categorize(q) {
  const low = q.toLowerCase();
  if (MACRO_KEYS.some(k => low.includes(k))) return "macro";
  if (MARKET_KEYS.some(k => low.includes(k))) return "markets";
  if (GEOPO_KEYS.some(k => low.includes(k))) return "geopolitics";
  if (low.includes("election") || low.includes("president")) return "geopolitics";
  return "macro";
}

function normalizeTitle(q) {
  return q.replace(/^Will /i, "").replace(/\?$/, "");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  try {
    // 1. Fetch from strategic tags
    const tags = ["argentina","politics","economics","world-politics","elections","inflation","geopolitics","midterms","fed","oil"];
    const fetches = tags.map(tag =>
      fetch(`https://gamma-api.polymarket.com/events?tag=${tag}&limit=40&active=true&closed=false&order=volume&ascending=false`,
        { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => [])
    );

    // 2. Fetch specific tracked events by slug
    const trackedSlugs = [
      "brazil-presidential-election",
      "which-party-will-win-the-house-in-2026",
      "which-party-will-win-the-senate-in-2026",
      "balance-of-power-2026-midterms",
      "how-many-fed-rate-cuts-in-2026",
      "argentina-monthly-inflation-april",
      "argentina-monthly-inflation-may",
      "argentina-inflation",
    ];
    
    // Also search for Argentina + oil specific
    const searchQueries = [
      "https://gamma-api.polymarket.com/events?tag=argentina&limit=50&active=true&closed=false&order=volume&ascending=false",
      "https://gamma-api.polymarket.com/events?tag=oil&limit=20&active=true&closed=false&order=volume&ascending=false",
      "https://gamma-api.polymarket.com/events?tag=fed&limit=20&active=true&closed=false&order=volume&ascending=false",
    ];

    const trackedFetches = trackedSlugs.map(slug =>
      fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`,
        { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => [])
    );
    
    const searchFetches = searchQueries.map(url =>
      fetch(url, { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => [])
    );

    const [tagResults, trackedResults, searchResults] = await Promise.all([
      Promise.all(fetches),
      Promise.all(trackedFetches),
      Promise.all(searchFetches),
    ]);

    // 3. Process tracked elections / specific events
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

    // 4. Process general + search events with scoring
    const allEvents = [...tagResults.flat(), ...searchResults.flat()];
    const seen = new Set(tracked.map(t => t.id));
    const curated = [];

    for (const ev of allEvents) {
      if (!ev || !ev.markets) continue;
      for (const m of ev.markets) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);
        let outcomes, prices;
        try { outcomes = JSON.parse(m.outcomes||"[]"); prices = JSON.parse(m.outcomePrices||"[]"); } catch { continue; }
        if (!outcomes.length || !prices.length) continue;
        const q = (m.question || ev.title || "");
        const low = q.toLowerCase();
        if (EXCLUDE.some(k => low.includes(k))) continue;
        const vol = parseFloat(m.volume) || 0;
        const score = scoreEvent(q, vol);
        if (score < 7) continue;
        const isArg = ARG_KEYS.some(k => low.includes(k));
        curated.push({
          id: m.id, title: normalizeTitle(q),
          probability: parseFloat(prices[0]) || 0,
          volume: vol, category: categorize(q),
          score, isArg,
        });
      }
    }

    curated.sort((a, b) => b.score - a.score || b.volume - a.volume);

    return res.status(200).json({
      tracked: tracked.slice(0, 25),
      indicators: curated.slice(0, 20),
      status: "live",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, status: "offline" });
  }
}
