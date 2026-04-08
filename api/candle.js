// /api/candle.js — Finnhub candle proxy
// Key from Vercel env variable FINNHUB_KEY
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const { symbol, resolution, from, to } = req.query;
  if (!symbol) return res.status(400).json({ error: "Missing ?symbol=" });
  const key = process.env.FINNHUB_KEY;
  if (!key) return res.status(500).json({ error: "FINNHUB_KEY not configured" });
  try {
    const r = await fetch(`https://finnhub.io/api/v1/stock/candle?token=${key}&symbol=${symbol}&resolution=${resolution||"D"}&from=${from||""}&to=${to||""}`);
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
