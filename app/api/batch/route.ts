import { NextRequest, NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonWithMeta, normalizeError } from "@/lib/api/reliability";

function yahooCandidates(symbol: string): string[] {
  const base = symbol.trim().toUpperCase();
  const out = new Set<string>([base]);
  if (base === "YPFD") {
    out.add("YPF");
    out.add("YPF.BA");
  }
  if (base.endsWith("D") && base.length > 2) {
    const noD = base.slice(0, -1);
    out.add(noD);
    out.add(`${noD}.BA`);
  }
  if (!base.includes(".")) out.add(`${base}.BA`);
  return [...out];
}

async function fetchYahooQuote(symbol: string) {
  let lastError: string | null = null;

  for (const candidate of yahooCandidates(symbol)) {
    try {
      const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(candidate)}`);
      url.searchParams.set("range", "5d");
      url.searchParams.set("interval", "1d");
      url.searchParams.set("includePrePost", "false");
      url.searchParams.set("events", "div,splits");

      const json = await fetchJsonWithRetry<{
        chart?: {
          result?: Array<{
            meta?: {
              regularMarketPrice?: number;
              regularMarketChange?: number;
              regularMarketChangePercent?: number;
              regularMarketDayHigh?: number;
              regularMarketDayLow?: number;
              regularMarketOpen?: number;
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

      const meta = json.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? 0;
      if (price > 0) {
        return {
          price,
          change: meta?.regularMarketChange ?? 0,
          changePct: meta?.regularMarketChangePercent ?? 0,
          high: meta?.regularMarketDayHigh ?? price,
          low: meta?.regularMarketDayLow ?? price,
          open: meta?.regularMarketOpen ?? price,
        };
      }

      lastError = `No market price for ${candidate}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  throw new Error(lastError ?? "Unable to resolve quote");
}

async function fetchFinnhubQuote(symbol: string, key: string) {
  const d = await fetchJsonWithRetry<{ c?: number; d?: number; dp?: number; h?: number; l?: number; o?: number }>(
    `https://finnhub.io/api/v1/quote?token=${key}&symbol=${encodeURIComponent(symbol)}`,
    { provider: "Finnhub", timeoutMs: 8_000, retries: 1 }
  );
  return { price: d.c ?? 0, change: d.d ?? 0, changePct: d.dp ?? 0, high: d.h ?? 0, low: d.l ?? 0, open: d.o ?? 0 };
}

async function fetchQuote(symbol: string, key: string | null) {
  if (key) return fetchFinnhubQuote(symbol, key);
  return fetchYahooQuote(symbol);
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) {
    return NextResponse.json({ error: "Missing ?symbols=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY ?? null;
  const tickers = symbols.split(",").map((s) => s.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return NextResponse.json({ error: "No valid symbols" }, { status: 400 });
  }

  const BATCH = 25;
  const results: Record<string, unknown> = {};
  const errors: Array<{ provider: string; message: string; status?: number; symbol?: string }> = [];

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const settled = await Promise.allSettled(batch.map(async (t) => {
      const d = await fetchQuote(t, key);
      return { t, d };
    }));

    settled.forEach((res) => {
      if (res.status !== "fulfilled") {
        errors.push(normalizeError(res.reason, key ? "Finnhub" : "Yahoo Finance"));
        return;
      }
      const { t, d } = res.value as { t: string; d: Record<string, number> };
      if ((d?.price ?? 0) > 0) {
        results[t] = d;
      } else {
        errors.push({ provider: key ? "Finnhub" : "Yahoo Finance", message: "No valid price", symbol: t });
      }
    });

    // Small delay between batches to stay under 60 calls/min
    if (i + BATCH < tickers.length) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  const matched = Object.keys(results).length;
  return jsonWithMeta(
    { prices: results, matched, total: tickers.length, ts: Date.now() },
    buildMeta({
      provider: key ? "Finnhub" : "Yahoo Finance",
      source: key ? "https://finnhub.io/api/v1/quote" : "Yahoo chart candidates",
      status: matched === tickers.length ? "ok" : matched > 0 ? "partial" : "empty",
      startedAt,
      cacheSeconds: 90,
      staleAfterSeconds: 180,
      errors,
    }),
    { cacheSeconds: 90, staleWhileRevalidateSeconds: 180 }
  );
}
