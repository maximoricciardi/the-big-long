import { NextRequest, NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonError, jsonWithMeta } from "@/lib/api/reliability";

const ENDPOINTS: Record<string, string> = {
  cedears: "https://data912.com/live/arg_cedears",
  bonds:   "https://data912.com/live/arg_bonds",
  notes:   "https://data912.com/live/arg_notes",
  corp:    "https://data912.com/live/arg_corp",
};

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const type = req.nextUrl.searchParams.get("type") ?? "cedears";
  const url  = ENDPOINTS[type];

  if (!url) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  try {
    const raw = await fetchJsonWithRetry<Array<{ symbol: string; c: number; pct_change?: number; v?: number }>>(url, {
      provider: "DATA912",
      headers: { Accept: "application/json" },
      timeoutMs: 10_000,
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
        map[sym.slice(0, -1)] = val;
        map[sym.slice(0, -1).toUpperCase()] = val;
      }
    });

    return jsonWithMeta(
      { map, raw, count: raw.length, ts: Date.now() },
      buildMeta({
        provider: "DATA912",
        source: url,
        status: raw.length > 0 && Object.keys(map).length > 0 ? "ok" : "empty",
        startedAt,
        cacheSeconds: 60,
        staleAfterSeconds: 120,
      }),
      { cacheSeconds: 60, staleWhileRevalidateSeconds: 120 }
    );
  } catch (err) {
    return jsonError({ provider: "DATA912", source: url, startedAt, error: err });
  }
}
