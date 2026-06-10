import { NextRequest, NextResponse } from "next/server";

function mapInterval(resolution: string): string {
  const r = resolution.toUpperCase();
  if (r === "W" || r === "1W") return "1wk";
  if (r === "M" || r === "1M") return "1mo";
  if (r === "60" || r === "1H") return "1h";
  return "1d";
}

async function fetchYahooCandles(symbol: string, resolution: string, from: string, to: string) {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("period1", from);
  url.searchParams.set("period2", to);
  url.searchParams.set("interval", mapInterval(resolution));
  url.searchParams.set("includePrePost", "false");
  url.searchParams.set("events", "div,splits");

  const r = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Yahoo Finance returned ${r.status}`);

  const json = await r.json() as {
    chart?: {
      result?: Array<{
        timestamp?: number[];
        indicators?: {
          quote?: Array<{
            open?: Array<number | null>;
            high?: Array<number | null>;
            low?: Array<number | null>;
            close?: Array<number | null>;
            volume?: Array<number | null>;
          }>;
        };
      }>;
    };
  };

  const result = json.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0];
  const t = result?.timestamp ?? [];
  const c = (quote?.close ?? []).filter((v): v is number => typeof v === "number");
  const o = (quote?.open ?? []).filter((v): v is number => typeof v === "number");
  const h = (quote?.high ?? []).filter((v): v is number => typeof v === "number");
  const l = (quote?.low ?? []).filter((v): v is number => typeof v === "number");
  const v = (quote?.volume ?? []).filter((v): v is number => typeof v === "number");

  if (!t.length || !c.length) {
    return { s: "no_data" };
  }

  return {
    s: "ok",
    t,
    c,
    o,
    h,
    l,
    v,
  };
}

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
  try {
    if (key) {
      const url =
        `https://finnhub.io/api/v1/stock/candle?token=${key}` +
        `&symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}`;
      const r = await fetch(url);
      const data = await r.json();
      return NextResponse.json(data, {
        headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
      });
    }

    const data = await fetchYahooCandles(symbol, resolution, from, to);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
