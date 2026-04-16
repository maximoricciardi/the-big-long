import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const r = await fetch("https://data912.com/live/arg_cedears", {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(12000),
    });

    if (!r.ok) {
      return NextResponse.json({ error: `DATA912 ${r.status}` }, { status: 502 });
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

    return NextResponse.json(
      { map, count: raw.length, sample: raw.slice(0, 3).map((d) => d.symbol), ts: Date.now() },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
