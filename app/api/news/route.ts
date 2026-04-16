import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "mercado+argentino+finanzas";
  const url = `https://news.google.com/rss/search?q=${q}&hl=es-419&gl=AR&ceid=AR:es&num=20`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!r.ok) {
      return NextResponse.json({ error: `Google News returned ${r.status}` }, { status: r.status });
    }

    const xml = await r.text();
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
