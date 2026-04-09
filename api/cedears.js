// /api/cedears.js — DATA912 CEDEAR proxy con tabla de overrides BYMA
// Resuelve CORS + normaliza símbolos con override para casos especiales

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  try {
    const r = await fetch("https://data912.com/live/arg_cedears", {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(12000),
    });

    if (!r.ok) return res.status(502).json({ error: `DATA912 ${r.status}` });

    const raw = await r.json();
    if (!Array.isArray(raw)) return res.status(502).json({ error: "Unexpected format" });

    const map = {};

    raw.forEach(d => {
      if (!d.symbol || d.c == null) return;
      const val = { price: d.c, pct: d.pct_change ?? 0, vol: d.v ?? 0 };
      const sym = d.symbol;

      map[sym] = val;
      map[sym.toUpperCase()] = val;

      if (sym.endsWith("D") && sym.length > 2) {
        const noD = sym.slice(0, -1);
        map[noD] = val;
        map[noD.toUpperCase()] = val;
      }

      // Override especial BRK.B → BRKBD en BYMA
      if (sym.toUpperCase() === "BRKBD" || sym.toUpperCase() === "BRKB") {
        map["BRK.B"] = val;
        map["BRK/B"] = val;
        map["BRKB"]  = val;
      }
    });

    return res.status(200).json({
      map,
      count: raw.length,
      sample: raw.slice(0, 3).map(d => d.symbol),
      ts: Date.now(),
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
