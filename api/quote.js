// Vercel Serverless Function — Finnhub Quote Proxy
// Caches at Vercel Edge for 2 minutes → all users share the same cached response
// Eliminates Finnhub rate limiting regardless of concurrent users
//
// Usage: GET /api/quote?symbol=SPY
// Env var required: FINNHUB_KEY (set in Vercel dashboard)

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol parameter" });
  }

  const key = process.env.FINNHUB_KEY;
  if (!key) {
    return res.status(500).json({ error: "FINNHUB_KEY not configured" });
  }

  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`
    );
    const data = await r.json();

    // Cache at Vercel Edge CDN for 2 minutes, serve stale for 1 min while revalidating
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch from Finnhub" });
  }
}
