import { NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonError, jsonWithMeta } from "@/lib/api/reliability";

export async function GET() {
  const startedAt = Date.now();
  const source = "https://data912.com/live/arg_cedears";
  try {
    const raw = await fetchJsonWithRetry<Array<{ symbol: string; c: number; pct_change?: number; v?: number }>>(source, {
      provider: "DATA912",
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      timeoutMs: 12_000,
      retries: 1,
    });
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

    return jsonWithMeta(
      { map, count: raw.length, sample: raw.slice(0, 3).map((d) => d.symbol), ts: Date.now() },
      buildMeta({
        provider: "DATA912",
        source,
        status: raw.length > 0 && Object.keys(map).length > 0 ? "ok" : "empty",
        startedAt,
        cacheSeconds: 60,
        staleAfterSeconds: 120,
      }),
      { cacheSeconds: 60, staleWhileRevalidateSeconds: 120 }
    );
  } catch (err) {
    return jsonError({ provider: "DATA912", source, startedAt, error: err });
  }
}
