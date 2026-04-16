import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing ?symbol=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  if (!key) {
    return NextResponse.json({ error: "FINNHUB_KEY not configured" }, { status: 500 });
  }

  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?token=${key}&symbol=${symbol}`
    );
    const data = await r.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
