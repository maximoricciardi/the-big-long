import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const symbol     = searchParams.get("symbol");
  const resolution = searchParams.get("resolution") ?? "D";
  const from       = searchParams.get("from");
  const to         = searchParams.get("to");

  if (!symbol || !from || !to) {
    return NextResponse.json({ error: "Missing ?symbol=, ?from=, ?to=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  if (!key) {
    return NextResponse.json({ error: "FINNHUB_KEY not configured" }, { status: 500 });
  }

  try {
    const url =
      `https://finnhub.io/api/v1/stock/candle?token=${key}` +
      `&symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;
    const r = await fetch(url);
    const data = await r.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
