// /api/polymarket.js — Vercel Serverless Function
// Proxy for Polymarket Gamma API — Argentina political/economic markets
// Usage: /api/polymarket → Top Argentina markets sorted by volume

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200"); // 10 min cache

  try {
    // Fetch Argentina-related events
    const url = "https://gamma-api.polymarket.com/events?tag=argentina&limit=20&active=true&closed=false&order=volume&ascending=false";
    const r = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `Polymarket API returned ${r.status}` });
    }

    const events = await r.json();

    // Extract relevant data: title, probability, volume, end date
    const markets = [];
    for (const event of events) {
      if (!event.markets) continue;
      for (const m of event.markets) {
        const outcomes = JSON.parse(m.outcomes || "[]");
        const prices = JSON.parse(m.outcomePrices || "[]");
        if (!outcomes.length || !prices.length) continue;
        markets.push({
          id: m.id,
          question: m.question || event.title,
          category: event.tag || "Argentina",
          yesPrice: parseFloat(prices[0]) || 0,
          noPrice: parseFloat(prices[1]) || 0,
          volume: parseFloat(m.volume) || 0,
          liquidity: parseFloat(m.liquidity) || 0,
          endDate: m.endDate || event.endDate,
          slug: m.slug || event.slug,
        });
      }
    }

    // Sort by volume desc, take top 15
    markets.sort((a, b) => b.volume - a.volume);
    return res.status(200).json({ markets: markets.slice(0, 15) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
