// /api/polymarket.js — Vercel Serverless Function
// Fetches prediction markets: Argentina priority, then LatAm, then global politics/economics

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  try {
    // Fetch from multiple tags to ensure 30+ results
    const tags = ["argentina", "latin-america", "politics", "economics", "world-politics", "inflation", "elections"];
    const fetches = tags.map(tag =>
      fetch(`https://gamma-api.polymarket.com/events?tag=${tag}&limit=30&active=true&closed=false&order=volume&ascending=false`, {
        headers: { Accept: "application/json" }
      }).then(r => r.json()).catch(() => [])
    );

    const responses = await Promise.all(fetches);
    const allEvents = responses.flat();
    const seen = new Set();
    const argentina = [];
    const global = [];

    const argKeys = ["argentin","milei","peso argentino","buenos aires","bcra","caputo","kirchn","peronism","inflaci.n argentin","cepo","devalua","libertad avanza","vaca muerta","ypf"];

    for (const event of allEvents) {
      if (!event || !event.markets) continue;
      for (const m of event.markets) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);

        let outcomes, prices;
        try {
          outcomes = JSON.parse(m.outcomes || "[]");
          prices = JSON.parse(m.outcomePrices || "[]");
        } catch { continue; }
        if (!outcomes.length || !prices.length) continue;

        const q = (m.question || event.title || "").toLowerCase();
        const isArg = argKeys.some(k => q.includes(k));

        const entry = {
          id: m.id,
          question: m.question || event.title,
          yesPrice: parseFloat(prices[0]) || 0,
          noPrice: parseFloat(prices[1]) || 0,
          volume: parseFloat(m.volume) || 0,
          endDate: m.endDate || event.endDate,
          slug: event.slug,
          isArg,
        };

        if (isArg) argentina.push(entry);
        else global.push(entry);
      }
    }

    // Sort each group by volume, Argentina first
    argentina.sort((a, b) => b.volume - a.volume);
    global.sort((a, b) => b.volume - a.volume);

    // Take all Argentina + fill with global up to 40
    const combined = [...argentina, ...global.slice(0, Math.max(40 - argentina.length, 15))];
    return res.status(200).json({ markets: combined.slice(0, 40) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
