import { NextRequest, NextResponse } from "next/server";
import { buildMeta, jsonError, jsonWithMeta } from "@/lib/api/reliability";
import { resolveEquityQuote } from "@/lib/equity/quotes";

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing ?symbol=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  try {
    const quote = await resolveEquityQuote(symbol, {
      finnhubKey: key,
      preferFinnhub: Boolean(key),
    });
    const data = {
      c: quote.price ?? 0,
      d: quote.change ?? 0,
      dp: quote.changePct ?? 0,
      h: quote.high ?? quote.price ?? 0,
      l: quote.low ?? quote.price ?? 0,
      o: quote.open ?? quote.price ?? 0,
      pc: quote.previousClose ?? quote.price ?? 0,
      resolvedSymbol: quote.resolvedSymbol,
      changeSource: quote.changeSource,
      variationStatus: quote.variationStatus,
      quote,
    };

    return jsonWithMeta(
      data,
      buildMeta({
        provider: quote.provider,
        source: quote.source,
        status: quote.price !== null && quote.price > 0 ? "ok" : "empty",
        startedAt,
        cacheSeconds: 120,
        staleAfterSeconds: 300,
      }),
      { cacheSeconds: 120, staleWhileRevalidateSeconds: 300 }
    );
  } catch (err) {
    return jsonError({
      provider: key ? "Finnhub / Yahoo Finance" : "Yahoo Finance",
      source: "server-side normalized equity quote provider chain",
      startedAt,
      error: err,
      status: 502,
    });
  }
}
