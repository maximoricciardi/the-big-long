import { NextResponse } from "next/server";

const EXCLUDE = [
  "airdrop","nft","memecoin","meme coin","solana price","eth price","btc price above","dogecoin",
  "shiba","pepe coin","bonk","floki","token launch","token listing","dex volume","defi protocol",
  "celebrity","kardashian","swift","drake","kanye","beyonce","grammys","oscars","emmy","grammy",
  "tiktok","youtube","streamer","twitch","influencer","onlyfans",
  "super bowl","nfl","nba","mlb","nhl","ufc","boxing","f1 race","world cup","champions league",
  "vs.","vs ","copa","liga","premier","bundesliga","serie a","ligue","mls","relegat",
  "ca river","ca boca","ca san lorenzo","ca racing","ca independiente","ca velez","ca huracan",
  "ca lanus","ca talleres","ca belgrano","atletico","estudiantes","gimnasia","banfield",
  "newell","rosario","tigre","platense","godoy cruz","unión","colon","defensa","tucuman",
  "riestra","central cordoba","instituto","aldosivi","ferro","quilmes","san martin",
  "match","game","score","win","lose","beat","tournament","championship","cup final",
  "will messi","will ronaldo","will neymar","fifa","conmebol","libertadores","sudamericana",
  "alien","ufo","paranormal","flat earth","simulation","zodiac",
  "bachelor","married","divorce","baby","pregnant",
  "elon musk twitter","x rebrand","threads app",
  "lottery","powerball","mega millions",
];

const MACRO_KEYS = ["recession","gdp","inflation","cpi","pce","interest rate","rate cut","rate hike","fed ","federal reserve","ecb","boj","central bank","monetary policy","fiscal","deficit","debt ceiling","government shutdown","employment","unemployment","nonfarm","jobless","wage","labor","tariff","trade war","trade deal"];
const GEOPO_KEYS = ["war","invasion","sanction","nato","un security","missile","nuclear","ceasefire","iran","israel","ukraine","russia","china","taiwan","north korea","middle east","opec","oil embargo","election","president","prime minister","chancellor","parliament","impeach","resign","coup","conflict","troops","attack"];
const MARKET_KEYS = ["s&p","nasdaq","dow","stock market","index","oil price","gold price","brent","crude","commodity","treasury","yield","bond","dollar index","euro","yen","yuan","oil above","oil below","brent above","wti above"];
const ARG_KEYS = ["argentin","milei","peso argentino","bcra","caputo","kirchn","peronism","cepo","devalua","libertad avanza","vaca muerta","buenos aires economy","arg inflation","arg monthly","indec","dolariz"];

const BLOCKED_TITLES = [
  "argentina monthly inflation - march",
  "argentina monthly inflation march",
  "argentina inflation march 2026",
];

function scoreEvent(q: string, vol: number): number {
  const low = q.toLowerCase();
  let rel = 0, imp = 0;
  if (MACRO_KEYS.some(k => low.includes(k)))  { rel += 4; imp += 4; }
  if (GEOPO_KEYS.some(k => low.includes(k)))  { rel += 3; imp += 4; }
  if (MARKET_KEYS.some(k => low.includes(k))) { rel += 3; imp += 3; }
  if (ARG_KEYS.some(k => low.includes(k)))    { rel += 5; imp += 5; }
  if (low.includes("election") || low.includes("president")) { rel += 2; imp += 3; }
  const volScore = vol >= 1e6 ? 5 : vol >= 500000 ? 4 : vol >= 100000 ? 3 : vol >= 10000 ? 2 : vol >= 1000 ? 1 : 0;
  return Math.min(rel, 5) + Math.min(imp, 5) + volScore;
}

function categorize(q: string): string {
  const low = q.toLowerCase();
  if (ARG_KEYS.some(k => low.includes(k)))    return "macro";
  if (MACRO_KEYS.some(k => low.includes(k)))  return "macro";
  if (MARKET_KEYS.some(k => low.includes(k))) return "markets";
  if (GEOPO_KEYS.some(k => low.includes(k)))  return "geopolitics";
  if (low.includes("election") || low.includes("president")) return "geopolitics";
  return "macro";
}

function normalizeTitle(q: string): string {
  return q.replace(/^Will /i, "").replace(/\?$/, "");
}

type PolyEvent = {
  id?: string; title?: string; slug?: string; closed?: boolean; resolved?: boolean;
  markets?: Array<{ id: string; question?: string; outcomes?: string; outcomePrices?: string; volume?: string }>;
};

async function fetchSlug(slug: string): Promise<PolyEvent[]> {
  try {
    const r = await fetch(
      `https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function fetchTag(tag: string, limit = 40): Promise<PolyEvent[]> {
  try {
    const r = await fetch(
      `https://gamma-api.polymarket.com/events?tag_slug=${tag}&limit=${limit}&active=true&closed=false&order=volume&ascending=false`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export const runtime = "edge";

export async function GET() {
  try {
    const trackedSlugs = [
      "which-party-will-win-the-house-in-2026",
      "which-party-will-win-the-senate-in-2026",
      "brazil-presidential-election-2026",
      "brazil-presidential-election",
      "how-many-fed-rate-cuts-in-2026",
    ];

    const argSlugs = [
      "milei-out-as-president-of-argentina-before-2027",
      "will-argentina-dollarize-by-june-30-2026",
      "argentina-monthly-inflation-april",
      "argentina-annual-inflation-2026",
      "will-argentina-lift-the-cepo-in-2026",
      "argentina-monthly-inflation-2026",
    ];

    const generalTags = [
      "politics", "economics", "world-politics",
      "elections", "inflation", "geopolitics",
      "fed", "oil", "tariffs", "recession",
    ];

    const [trackedResults, argResults, tagResults] = await Promise.all([
      Promise.all(trackedSlugs.map(fetchSlug)),
      Promise.all(argSlugs.map(fetchSlug)),
      Promise.all(generalTags.map(t => fetchTag(t, 30))),
    ]);

    const tracked: unknown[] = [];
    const seenIds = new Set<string>();

    const processTracked = (eventsArr: PolyEvent[][]) => {
      for (const events of eventsArr) {
        if (!Array.isArray(events) || !events.length) continue;
        const ev = events[0];
        if (!ev?.markets) continue;
        for (const m of ev.markets) {
          if (seenIds.has(m.id)) continue;
          seenIds.add(m.id);
          let outcomes: string[], prices: string[];
          try {
            outcomes = JSON.parse(m.outcomes || "[]");
            prices   = JSON.parse(m.outcomePrices || "[]");
          } catch { continue; }
          if (!outcomes.length || !prices.length) continue;
          const vol = parseFloat(m.volume ?? "0") || 0;
          tracked.push({
            id: m.id, title: m.question || ev.title,
            outcomes: outcomes.map((o, i) => ({ label: o, prob: parseFloat(prices[i]) || 0 })),
            volume: vol, slug: ev.slug, group: ev.title,
          });
        }
      }
    };

    processTracked(trackedResults);

    const argTracked: unknown[] = [];
    for (const events of argResults) {
      if (!Array.isArray(events) || !events.length) continue;
      const ev = events[0];
      if (!ev?.markets || ev.closed || ev.resolved) continue;
      const evTitle = (ev.title || "").toLowerCase();
      if (BLOCKED_TITLES.some(b => evTitle.includes(b))) continue;
      for (const m of ev.markets) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
        let outcomes: string[], prices: string[];
        try {
          outcomes = JSON.parse(m.outcomes || "[]");
          prices   = JSON.parse(m.outcomePrices || "[]");
        } catch { continue; }
        if (!outcomes.length || !prices.length) continue;
        const vol = parseFloat(m.volume ?? "0") || 0;
        argTracked.push({
          id: m.id, title: m.question || ev.title,
          outcomes: outcomes.map((o, i) => ({ label: o, prob: parseFloat(prices[i]) || 0 })),
          volume: vol, slug: ev.slug, group: ev.title,
        });
      }
    }

    const allTagEvents = tagResults.flat();
    const curated: unknown[] = [];

    for (const ev of allTagEvents) {
      if (!ev?.markets || ev.closed || ev.resolved) continue;
      for (const m of ev.markets) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
        let outcomes: string[], prices: string[];
        try {
          outcomes = JSON.parse(m.outcomes || "[]");
          prices   = JSON.parse(m.outcomePrices || "[]");
        } catch { continue; }
        if (!outcomes.length || !prices.length) continue;

        const q = m.question || ev.title || "";
        const low = q.toLowerCase();
        if (EXCLUDE.some(k => low.includes(k.toLowerCase()))) continue;
        if (/\bvs\.?\s+[A-Z]/.test(q)) continue;
        if (/\b(win|beat|score|qualify|advance)\b.*match/i.test(q)) continue;

        const vol = parseFloat(m.volume ?? "0") || 0;
        const score = scoreEvent(q, vol);
        if (score < 7) continue;

        const isArg = ARG_KEYS.some(k => low.includes(k));
        curated.push({
          id: m.id, title: normalizeTitle(q),
          probability: parseFloat(prices[0]) || 0,
          volume: vol, category: categorize(q), score, isArg,
        });
      }
    }

    (curated as Array<{ score: number; volume: number }>).sort(
      (a, b) => b.score - a.score || b.volume - a.volume
    );

    return NextResponse.json(
      {
        tracked:    tracked.slice(0, 20),
        argTracked: argTracked.slice(0, 8),
        indicators: curated.slice(0, 25),
        status: "live",
        timestamp: new Date().toISOString(),
        argNote: "Polymarket bloqueado en ARG por fallo judicial (mar 2026). Probabilidades implícitas de mercado global.",
      },
      { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: msg, status: "offline", tracked: [], argTracked: [], indicators: [] },
      { status: 500 }
    );
  }
}
