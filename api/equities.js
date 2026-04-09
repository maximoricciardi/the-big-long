// /api/equities.js — DATA912 equities proxy (acciones ARG + bonos soberanos)
// Unifica en un solo endpoint los endpoints de DATA912 que el browser no puede llamar directamente
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  const { type = "cedears" } = req.query;

  const endpoints = {
    cedears:  "https://data912.com/live/arg_cedears",
    bonds:    "https://data912.com/live/arg_bonds",
    notes:    "https://data912.com/live/arg_notes",
    corp:     "https://data912.com/live/arg_corp",
  };

  const url = endpoints[type];
  if (!url) return res.status(400).json({ error: `Unknown type: ${type}` });

  try {
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) return res.status(502).json({ error: `DATA912 responded ${r.status}` });

    const raw = await r.json();
    if (!Array.isArray(raw)) return res.status(502).json({ error: "Unexpected format" });

    // Normalize into a flat map keyed by every symbol variant
    const map = {};
    raw.forEach(d => {
      if (!d.symbol || d.c == null) return;
      const val = { price: d.c, pct: d.pct_change ?? 0, vol: d.v ?? 0 };
      const sym = d.symbol;
      map[sym] = val;
      map[sym.toUpperCase()] = val;
      // Strip trailing D for CEDEARs/bonds (AAPLD → AAPL)
      if (sym.endsWith("D") && sym.length > 2) {
        map[sym.slice(0, -1)] = val;
        map[sym.slice(0, -1).toUpperCase()] = val;
      }
    });

    return res.status(200).json({ map, raw, count: raw.length, ts: Date.now() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
