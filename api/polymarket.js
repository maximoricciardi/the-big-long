// /api/polymarket.js — Vercel Serverless Function
// Proxy for Polymarket Gamma API — Argentina markets
// Fetches politics, economics, and general Argentina-related prediction markets

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  try {
    // Fetch Argentina events + broader search
    const urls = [
      "https://gamma-api.polymarket.com/events?tag=argentina&limit=50&active=true&closed=false&order=volume&ascending=false",
      "https://gamma-api.polymarket.com/events?tag=latin-america&limit=20&active=true&closed=false&order=volume&ascending=false",
    ];

    const responses = await Promise.all(
      urls.map(u => fetch(u, { headers: { Accept: "application/json" } }).then(r => r.json()).catch(() => []))
    );

    const allEvents = responses.flat();
    const seen = new Set();
    const markets = [];

    for (const event of allEvents) {
      if (!event.markets) continue;
      for (const m of event.markets) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);

        const outcomes = JSON.parse(m.outcomes || "[]");
        const prices = JSON.parse(m.outcomePrices || "[]");
        if (!outcomes.length || !prices.length) continue;

        const q = (m.question || event.title || "").toLowerCase();
        // Filter: only Argentina-relevant
        const argKeywords = ["argentin","milei","peso","buenos aires","bcra","caputo","kirchn","peronism","inflaci","imf","cepo","devalua","libertad avanza"];
        const isArg = argKeywords.some(k => q.includes(k));
        if (!isArg) continue;

        markets.push({
          id: m.id,
          question: m.question || event.title,
          yesPrice: parseFloat(prices[0]) || 0,
          noPrice: parseFloat(prices[1]) || 0,
          volume: parseFloat(m.volume) || 0,
          endDate: m.endDate || event.endDate,
          slug: event.slug,
        });
      }
    }

    markets.sort((a, b) => b.volume - a.volume);
    return res.status(200).json({ markets: markets.slice(0, 30) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
