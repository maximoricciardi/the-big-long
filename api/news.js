export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const q = req.query.q || "mercado+argentino+finanzas";
  // Sin cache — siempre fresco desde Google News
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  const url = `https://news.google.com/rss/search?q=${q}&hl=es-419&gl=AR&ceid=AR:es&num=20`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    });
    if (!r.ok) {
      res.status(r.status).json({ error: `Google News returned ${r.status}` });
      return;
    }
    const xml = await r.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
