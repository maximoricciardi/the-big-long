// /api/cedears.js — DATA912 CEDEAR proxy
// Resuelve CORS: el browser llama /api/cedears, Vercel llama a DATA912
// Normaliza símbolos: indexa con y sin sufijo D para lookup fácil
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  try {
    const r = await fetch("https://data912.com/live/arg_cedears", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) return res.status(502).json({ error: `DATA912 responded ${r.status}` });

    const raw = await r.json();
    if (!Array.isArray(raw)) return res.status(502).json({ error: "Unexpected DATA912 format" });

    // Build normalized map: store under every possible key variant
    const map = {};
    raw.forEach(d => {
      if (!d.symbol || d.c == null) return;
      const val = { price: d.c, pct: d.pct_change ?? 0, vol: d.v ?? 0 };
      const sym = d.symbol;                           // e.g. "AAPLD"
      map[sym] = val;                                 // AAPLD
      if (sym.endsWith("D")) {
        map[sym.slice(0, -1)] = val;                  // AAPL
        map[sym.slice(0, -1).toUpperCase()] = val;
      }
      map[sym.toUpperCase()] = val;
    });

    return res.status(200).json({ map, count: raw.length, ts: Date.now() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
