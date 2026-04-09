// /api/batch.js — Batch Finnhub quote proxy
// Recibe ?symbols=AAPL,MSFT,NVDA,... — resuelve todos en paralelo server-side
// Evita: (1) CORS, (2) 131 round-trips individuales desde el browser, (3) rate limit 820ms
// Vercel server-side: Promise.allSettled en batches de 20, sin delay de browser

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=90, stale-while-revalidate=180");

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: "Missing ?symbols=" });

  const key = process.env.FINNHUB_KEY;
  if (!key) return res.status(500).json({ error: "FINNHUB_KEY not set" });

  const tickers = symbols.split(",").map(s => s.trim()).filter(Boolean);
  if (tickers.length === 0) return res.status(400).json({ error: "No valid symbols" });

  // Fetch in parallel batches of 25 — Vercel server handles rate limits better than browser
  const BATCH = 25;
  const results = {};
  const errors  = [];

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      batch.map(async t => {
        const url = `https://finnhub.io/api/v1/quote?token=${key}&symbol=${t}`;
        const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { t, d };
      })
    );
    settled.forEach(res => {
      if (res.status === "fulfilled") {
        const { t, d } = res.value;
        if (d && d.c && d.c > 0) {
          results[t] = { price: d.c, change: d.d ?? 0, changePct: d.dp ?? 0, high: d.h, low: d.l, open: d.o };
        }
      } else {
        errors.push(res.reason?.message);
      }
    });
    // Small delay between batches to stay under 60 calls/min
    if (i + BATCH < tickers.length) {
      await new Promise(r => setTimeout(r, 600));
    }
  }

  return res.status(200).json({
    prices: results,
    matched: Object.keys(results).length,
    total: tickers.length,
    ts: Date.now(),
  });
}
