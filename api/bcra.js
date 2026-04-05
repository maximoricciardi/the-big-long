// /api/bcra.js — Vercel Serverless Function
// Proxy for BCRA Estadísticas Monetarias API v4
// Usage: /api/bcra?list=1 → All principales variables with latest values
//        /api/bcra?id=1 → Reservas last 30 days
//        /api/bcra?id=1&desde=2026-01-01&hasta=2026-04-05

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const { id, desde, hasta, list } = req.query;
  const BASE = "https://api.bcra.gob.ar/estadisticas/v4.0";

  try {
    let url;
    if (list) {
      url = `${BASE}/monetarias?limit=200`;
    } else if (id) {
      url = `${BASE}/monetarias/${id}`;
      const params = [];
      if (desde) params.push(`desde=${desde}`);
      if (hasta) params.push(`hasta=${hasta}`);
      if (!desde && !hasta) {
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
      headers: { "Accept": "application/json", "Accept-Language": "es-AR" },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `BCRA API returned ${r.status}` });
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
