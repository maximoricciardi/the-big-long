export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const q = req.query.q || "mercado+argentino+finanzas";
  const url = `https://news.google.com/rss/search?q=${q}&hl=es-419&gl=AR&ceid=AR:es`;
  try {
    const r = await fetch(url);
    const xml = await r.text();
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=120");
    res.status(200).send(xml);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
