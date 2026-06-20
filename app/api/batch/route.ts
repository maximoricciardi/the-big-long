import { NextRequest, NextResponse } from "next/server";
import { buildMeta, jsonWithMeta } from "@/lib/api/reliability";
import {
  EQUITY_QUOTE_CACHE_SECONDS,
  EQUITY_QUOTE_STALE_SECONDS,
  fetchBatchEquityQuotes,
} from "@/lib/equity/quotes";

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) {
    return NextResponse.json({ error: "Missing ?symbols=" }, { status: 400 });
  }

  const tickers = symbols.split(",").map((s) => s.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return NextResponse.json({ error: "No valid symbols" }, { status: 400 });
  }

  const finnhubKey = process.env.FINNHUB_KEY ?? null;
  const preferFinnhub = tickers.length <= 40;
  const batch = await fetchBatchEquityQuotes(tickers, {
    finnhubKey,
    preferFinnhub,
    batchSize: preferFinnhub ? 15 : 20,
  });

  const standardMissing = Object.keys(batch.unavailable).length;
  const status =
    standardMissing === 0 && batch.matched === batch.standardTotal
      ? "ok"
      : batch.matched > 0 || Object.keys(batch.special).length > 0
        ? "partial"
        : "empty";

  return jsonWithMeta(
    {
      prices: batch.prices,
      quotes: batch.quotes,
      unavailable: batch.unavailable,
      special: batch.special,
      matched: batch.matched,
      total: batch.total,
      standardTotal: batch.standardTotal,
      unresolved: Object.keys(batch.unavailable),
      specialSymbols: Object.keys(batch.special),
      providerStatuses: batch.providerStatuses,
      ts: Date.now(),
    },
    buildMeta({
      provider: finnhubKey
        ? "Railway Financial API with Finnhub/Yahoo fallback"
        : "Railway Financial API with Yahoo Finance fallback",
      source: "server-side normalized equity quote provider chain",
      status,
      startedAt,
      cacheSeconds: EQUITY_QUOTE_CACHE_SECONDS,
      staleAfterSeconds: EQUITY_QUOTE_STALE_SECONDS,
      errors: batch.errors.map(({ provider, message, status }) => ({ provider, message, status })),
    }),
    { cacheSeconds: EQUITY_QUOTE_CACHE_SECONDS, staleWhileRevalidateSeconds: EQUITY_QUOTE_STALE_SECONDS }
  );
}
