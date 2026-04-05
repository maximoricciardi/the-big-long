// /api/bcra.js — Vercel Serverless Function
// Proxy for BCRA Estadísticas Monetarias API v4
// Usage: /api/bcra?id=1 → Reservas Internacionales (last value)
//        /api/bcra?id=1&desde=2026-01-01&hasta=2026-04-05 → Historical range
//        /api/bcra?list=1 → List all variables
//
// Key variable IDs:
//   1  = Reservas Internacionales (USD millones)
//   4  = Tipo de Cambio Minorista ($ por USD)
//   5  = Tipo de Cambio Mayorista ($ por USD)
//   6  = Tasa BADLAR (% TNA)
//   7  = Tasa de Política Monetaria (% TNA)
//  15  = Base Monetaria ($ millones)
//  27  = TAMAR (% TNA)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600"); // 5 min edge cache

  const { id, desde, hasta, list } = req.query;
  const BASE = "https://api.bcra.gob.ar/estadisticas/v4.0";

  try {
    let url;
    if (list) {
      url = `${BASE}/monetarias?limit=50&categoria=Principales%20Variables`;
    } else if (id) {
      url = `${BASE}/monetarias/${id}`;
      const params = [];
      if (desde) params.push(`desde=${desde}`);
      if (hasta) params.push(`hasta=${hasta}`);
      if (!desde && !hasta) {
        // Default: last 30 days
        const h = new Date().toISOString().split("T")[0];
        const d = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
        params.push(`desde=${d}`, `hasta=${h}`);
      }
      params.push("limit=100");
      if (params.length) url += `?${params.join("&")}`;
    } else {
      return res.status(400).json({ error: "Missing ?id= or ?list=1" });
    }

    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "es-AR",
      },
    });

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
