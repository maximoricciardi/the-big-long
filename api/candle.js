// Vercel Serverless Function — Finnhub Candle Proxy
// Caches at Vercel Edge for 5 minutes (historical data changes slowly)
//
// Usage: GET /api/candle?symbol=SPY&resolution=W&from=1234567890&to=1234567890
// Env var required: FINNHUB_KEY (set in Vercel dashboard)

export default async function handler(req, res) {
  const { symbol, resolution, from, to } = req.query;
  if (!symbol || !from || !to) {
    return res.status(400).json({ error: "Missing required parameters: symbol, from, to" });
  }

  const key = process.env.FINNHUB_KEY;
  if (!key) {
    return res.status(500).json({ error: "FINNHUB_KEY not configured" });
  }

  try {
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution || "W"}&from=${from}&to=${to}&token=${key}`;
    const r = await fetch(url);
    const data = await r.json();

    // Cache at Vercel Edge CDN for 5 minutes (candles are less time-sensitive)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=120");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch candles from Finnhub" });
  }
}
