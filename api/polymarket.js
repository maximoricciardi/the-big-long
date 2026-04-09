// /api/polymarket.js — Curated Sentiment Indicators v2
// Tracked events + scored macro/geopolitical + Argentina section
// Actualizado ABR 2026: slugs ARG corregidos, fútbol excluido, Fed/oil 2026

const EXCLUDE = [
  // Cripto/defi ruido
  "airdrop","nft","memecoin","meme coin","solana price","eth price","btc price above","dogecoin",
  "shiba","pepe coin","bonk","floki","token launch","token listing","dex volume","defi protocol",
  // Entretenimiento
  "celebrity","kardashian","swift","drake","kanye","beyonce","grammys","oscars","emmy","grammy",
  "tiktok","youtube","streamer","twitch","influencer","onlyfans",
  // Deportes — CRÍTICO: excluir fútbol (Argentina tag retorna ~150 partidos)
  "super bowl","nfl","nba","mlb","nhl","ufc","boxing","f1 race","world cup","champions league",
  "vs.","vs ","copa","liga","premier","bundesliga","serie a","ligue","mls","relegat",
  "ca river","ca boca","ca san lorenzo","ca racing","ca independiente","ca velez","ca huracan",
  "ca lanus","ca talleres","ca belgrano","atletico","estudiantes","gimnasia","banfield",
  "newell","rosario","tigre","platense","godoy cruz","unión","colon","defensa","tucuman",
  "riestra","central cordoba","instituto","aldosivi","ferro","quilmes","san martin",
  "match","game","score","win","lose","beat","tournament","championship","cup final",
  "will messi","will ronaldo","will neymar","fifa","conmebol","libertadores","sudamericana",
  // Misceláneo
  "alien","ufo","paranormal","flat earth","simulation","zodiac",
  "bachelor","married","divorce","baby","pregnant",
  "elon musk twitter","x rebrand","threads app",
  "lottery","powerball","mega millions",
];

const MACRO_KEYS = [
  "recession","gdp","inflation","cpi","pce","interest rate","rate cut","rate hike",
  "fed ","federal reserve","ecb","boj","central bank","monetary policy","fiscal","deficit",
  "debt ceiling","government shutdown","employment","unemployment","nonfarm","jobless",
  "wage","labor","tariff","trade war","trade deal",
];
const GEOPO_KEYS = [
  "war","invasion","sanction","nato","un security","missile","nuclear","ceasefire",
  "iran","israel","ukraine","russia","china","taiwan","north korea","middle east",
  "opec","oil embargo","election","president","prime minister","chancellor","parliament",
  "impeach","resign","coup","conflict","troops","attack",
];
const MARKET_KEYS = [
  "s&p","nasdaq","dow","stock market","index","oil price","gold price","brent","crude",
  "commodity","treasury","yield","bond","dollar index","euro","yen","yuan",
  "oil above","oil below","brent above","wti above",
];
const ARG_KEYS = [
  "argentin","milei","peso argentino","bcra","caputo","kirchn","peronism","cepo",
  "devalua","libertad avanza","vaca muerta","buenos aires economy","arg inflation",
  "arg monthly","indec","dolariz",
];

function scoreEvent(q, vol) {
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

function categorize(q) {
  const low = q.toLowerCase();
  if (ARG_KEYS.some(k => low.includes(k)))    return "macro";
  if (MACRO_KEYS.some(k => low.includes(k)))  return "macro";
  if (MARKET_KEYS.some(k => low.includes(k))) return "markets";
  if (GEOPO_KEYS.some(k => low.includes(k)))  return "geopolitics";
  if (low.includes("election") || low.includes("president")) return "geopolitics";
  return "macro";
}

function normalizeTitle(q) {
  return q.replace(/^Will /i, "").replace(/\?$/, "");
}

// Helper: fetch a single event by slug
async function fetchSlug(slug) {
  try {
    const r = await fetch(
      `https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

// Helper: fetch events by tag
async function fetchTag(tag, limit = 40) {
  try {
    const r = await fetch(
      `https://gamma-api.polymarket.com/events?tag_slug=${tag}&limit=${limit}&active=true&closed=false&order=volume&ascending=false`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  try {
    // ══════════════════════════════════════════════════════
    // 1. TRACKED ELECTIONS / EVENTOS CLAVE — slugs directos
    //    Verificados como activos al 08 ABR 2026
    // ══════════════════════════════════════════════════════
    const trackedSlugs = [
      // USA 2026 midterms
      "which-party-will-win-the-house-in-2026",
      "which-party-will-win-the-senate-in-2026",
      // LATAM
      "brazil-presidential-election-2026",
      "brazil-presidential-election",
      // Fed
      "how-many-fed-rate-cuts-in-2026",
    ];

    // ══════════════════════════════════════════════════════
    // 2. ARGENTINA — slugs específicos verificados
    //    Nota: Polymarket bloqueado en ARG por fallo judicial
    //    (jueza Parada, mar 2026) — API desde Vercel OK
    // ══════════════════════════════════════════════════════
    const argSlugs = [
      "milei-out-as-president-of-argentina-before-2027",
      "will-argentina-dollarize-by-june-30-2026",
      "argentina-monthly-inflation-march",       // resuelve 14 ABR con dato INDEC
      "argentina-monthly-inflation-april",       // próximo
      "argentina-annual-inflation-2026",
      "will-argentina-lift-the-cepo-in-2026",
      "argentina-monthly-inflation-2026",        // fallback genérico
    ];

    // ══════════════════════════════════════════════════════
    // 3. TAGS para indicadores generales (sin argentina —
    //    el tag argentina retorna mayormente partidos de fútbol)
    // ══════════════════════════════════════════════════════
    const generalTags = [
      "politics", "economics", "world-politics",
      "elections", "inflation", "geopolitics",
      "fed", "oil", "tariffs", "recession",
    ];

    // Fire everything in parallel
    const [
      trackedResults,
      argResults,
      tagResults,
    ] = await Promise.all([
      Promise.all(trackedSlugs.map(s => fetchSlug(s))),
      Promise.all(argSlugs.map(s => fetchSlug(s))),
      Promise.all(generalTags.map(t => fetchTag(t, 30))),
    ]);

    // ── Procesar tracked (elecciones y Fed) ──────────────
    const tracked = [];
    const seenIds = new Set();

    const processTracked = (eventsArr) => {
      for (const events of eventsArr) {
        if (!Array.isArray(events) || !events.length) continue;
        const ev = events[0];
        if (!ev || !ev.markets) continue;
        for (const m of ev.markets) {
          if (seenIds.has(m.id)) continue;
          seenIds.add(m.id);
          let outcomes, prices;
          try {
            outcomes = JSON.parse(m.outcomes || "[]");
            prices   = JSON.parse(m.outcomePrices || "[]");
          } catch { continue; }
          if (!outcomes.length || !prices.length) continue;
          const vol = parseFloat(m.volume) || 0;
          tracked.push({
            id: m.id,
            title: m.question || ev.title,
            outcomes: outcomes.map((o, i) => ({ label: o, prob: parseFloat(prices[i]) || 0 })),
            volume: vol,
            slug: ev.slug,
            group: ev.title,
          });
        }
      }
    };

    processTracked(trackedResults);

    // ── Procesar Argentina ───────────────────────────────
    const argTracked = [];

    for (const events of argResults) {
      if (!Array.isArray(events) || !events.length) continue;
      const ev = events[0];
      if (!ev || !ev.markets) continue;
      // Saltar si ya está resuelto
      if (ev.closed || ev.resolved) continue;
      for (const m of ev.markets) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
        let outcomes, prices;
        try {
          outcomes = JSON.parse(m.outcomes || "[]");
          prices   = JSON.parse(m.outcomePrices || "[]");
        } catch { continue; }
        if (!outcomes.length || !prices.length) continue;
        const vol = parseFloat(m.volume) || 0;
        argTracked.push({
          id: m.id,
          title: m.question || ev.title,
          outcomes: outcomes.map((o, i) => ({ label: o, prob: parseFloat(prices[i]) || 0 })),
          volume: vol,
          slug: ev.slug,
          group: ev.title,
        });
      }
    }

    // ── Procesar indicadores generales (tags) ────────────
    const allTagEvents = tagResults.flat();
    const curated = [];

    for (const ev of allTagEvents) {
      if (!ev || !ev.markets || ev.closed || ev.resolved) continue;
      for (const m of ev.markets) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
        let outcomes, prices;
        try {
          outcomes = JSON.parse(m.outcomes || "[]");
          prices   = JSON.parse(m.outcomePrices || "[]");
        } catch { continue; }
        if (!outcomes.length || !prices.length) continue;

        const q = m.question || ev.title || "";
        const low = q.toLowerCase();

        // Filtro agresivo: excluir deportes y ruido
        if (EXCLUDE.some(k => low.includes(k.toLowerCase()))) continue;

        // Excluir eventos de fútbol por patrones adicionales
        if (/\bvs\.?\s+[A-Z]/.test(q)) continue;          // "Club A vs Club B"
        if (/\b(win|beat|score|qualify|advance)\b.*match/i.test(q)) continue;

        const vol = parseFloat(m.volume) || 0;
        const score = scoreEvent(q, vol);
        if (score < 7) continue;

        const isArg = ARG_KEYS.some(k => low.includes(k));
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

    curated.sort((a, b) => b.score - a.score || b.volume - a.volume);

    return res.status(200).json({
      tracked:     tracked.slice(0, 20),
      argTracked:  argTracked.slice(0, 8),   // ← nuevo: sección Argentina
      indicators:  curated.slice(0, 25),
      status: "live",
      timestamp: new Date().toISOString(),
      // Meta para el disclaimer en el cliente
      argNote: "Polymarket bloqueado en ARG por fallo judicial (mar 2026). Probabilidades implícitas de mercado global.",
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      status: "offline",
      tracked: [], argTracked: [], indicators: [],
    });
  }
}
