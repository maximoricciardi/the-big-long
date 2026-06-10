import { NextRequest, NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonError, jsonWithMeta } from "@/lib/api/reliability";

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

  const json = await fetchJsonWithRetry<{
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
  }>(url.toString(), {
    provider: "Yahoo Finance",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    timeoutMs: 8_000,
    retries: 1,
  });

  const result = json.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0];
  const timestamps = result?.timestamp ?? [];
  const open = quote?.open ?? [];
  const high = quote?.high ?? [];
  const low = quote?.low ?? [];
  const close = quote?.close ?? [];
  const volume = quote?.volume ?? [];
  const rows = timestamps
    .map((time, index) => ({
      t: time,
      o: open[index],
      h: high[index],
      l: low[index],
      c: close[index],
      v: volume[index],
    }))
    .filter((row): row is { t: number; o: number; h: number; l: number; c: number; v: number | null } =>
      typeof row.t === "number" &&
      typeof row.o === "number" &&
      typeof row.h === "number" &&
      typeof row.l === "number" &&
      typeof row.c === "number"
    );

  if (!rows.length) {
    return { s: "no_data" };
  }

  return {
    s: "ok",
    t: rows.map(row => row.t),
    c: rows.map(row => row.c),
    o: rows.map(row => row.o),
    h: rows.map(row => row.h),
    l: rows.map(row => row.l),
    v: rows.map(row => typeof row.v === "number" ? row.v : 0),
  };
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
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
      const source = "https://finnhub.io/api/v1/stock/candle";
      const url =
        `${source}?token=${key}` +
        `&symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}`;
      const data = await fetchJsonWithRetry<Record<string, unknown>>(url, {
        provider: "Finnhub",
        timeoutMs: 8_000,
        retries: 1,
      });
      const candleStatus = data.s === "ok" ? "ok" : "empty";
      return jsonWithMeta(
        data,
        buildMeta({
          provider: "Finnhub",
          source,
          status: candleStatus,
          startedAt,
          cacheSeconds: 300,
          staleAfterSeconds: 600,
        }),
        { cacheSeconds: 300, staleWhileRevalidateSeconds: 600 }
      );
    }

    const data = await fetchYahooCandles(symbol, resolution, from, to);
    return jsonWithMeta(
      data,
      buildMeta({
        provider: "Yahoo Finance",
        source: "Yahoo chart",
        status: data.s === "ok" ? "ok" : "empty",
        startedAt,
        cacheSeconds: 300,
        staleAfterSeconds: 600,
      }),
      { cacheSeconds: 300, staleWhileRevalidateSeconds: 600 }
    );
  } catch (err) {
    return jsonError({
      provider: key ? "Finnhub" : "Yahoo Finance",
      source: key ? "https://finnhub.io/api/v1/stock/candle" : "Yahoo chart",
      startedAt,
      error: err,
    });
  }
}
