import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const ENDPOINTS: Record<string, string> = {
  cedears: "https://data912.com/live/arg_cedears",
  bonds:   "https://data912.com/live/arg_bonds",
  notes:   "https://data912.com/live/arg_notes",
  corp:    "https://data912.com/live/arg_corp",
};

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "cedears";
  const url  = ENDPOINTS[type];

  if (!url) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  try {
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) {
      return NextResponse.json({ error: `DATA912 responded ${r.status}` }, { status: 502 });
    }

    const raw = await r.json() as Array<{ symbol: string; c: number; pct_change?: number; v?: number }>;
    if (!Array.isArray(raw)) {
      return NextResponse.json({ error: "Unexpected format" }, { status: 502 });
    }

    const map: Record<string, { price: number; pct: number; vol: number }> = {};
    raw.forEach((d) => {
      if (!d.symbol || d.c == null) return;
      const val = { price: d.c, pct: d.pct_change ?? 0, vol: d.v ?? 0 };
      const sym = d.symbol;
      map[sym] = val;
      map[sym.toUpperCase()] = val;
      if (sym.endsWith("D") && sym.length > 2) {
        map[sym.slice(0, -1)] = val;
        map[sym.slice(0, -1).toUpperCase()] = val;
      }
    });

    return NextResponse.json(
      { map, raw, count: raw.length, ts: Date.now() },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
