import { NextRequest, NextResponse } from "next/server";
import { buildMeta, jsonWithMeta } from "@/lib/api/reliability";
import {
  EQUITY_FUNDAMENTALS_CACHE_SECONDS,
  getEquityFundamentals,
} from "@/lib/equity/fundamentals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const rawSymbols = req.nextUrl.searchParams.get("symbols") ?? req.nextUrl.searchParams.get("symbol");
  if (!rawSymbols) {
    return NextResponse.json({ error: "Missing ?symbols= or ?symbol=" }, { status: 400 });
  }

  const symbols = rawSymbols.split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json({ error: "No valid symbols" }, { status: 400 });
  }

  const result = await getEquityFundamentals(symbols);
  const records = Object.values(result.data);
  const providerErrors = records.filter((record) => record.availabilityStatus === "provider_error").length;
  const available = records.filter((record) => record.availabilityStatus === "available").length;
  const privateMarket = records.filter((record) => record.availabilityStatus === "private_market_not_listed").length;
  const status = providerErrors > 0
    ? "partial"
    : available + privateMarket === records.length
      ? "ok"
      : records.length > 0
        ? "partial"
        : "empty";

  return jsonWithMeta(
    {
      data: result.data,
      count: records.length,
      providerStatuses: result.providerStatuses,
      unavailable: records
        .filter((record) => record.availabilityStatus !== "available")
        .map((record) => ({
          ticker: record.ticker,
          status: record.availabilityStatus,
          reason: record.unavailableReason,
        })),
    },
    buildMeta({
      provider: "Equity Fundamentals Provider Layer",
      source: "FMP when configured; curated/identity fallback otherwise",
      status,
      startedAt,
      cacheSeconds: EQUITY_FUNDAMENTALS_CACHE_SECONDS,
      staleAfterSeconds: EQUITY_FUNDAMENTALS_CACHE_SECONDS * 2,
      errors: result.errors.map(({ provider, message, status }) => ({ provider, message, status })),
    }),
    {
      cacheSeconds: EQUITY_FUNDAMENTALS_CACHE_SECONDS,
      staleWhileRevalidateSeconds: EQUITY_FUNDAMENTALS_CACHE_SECONDS * 2,
    }
  );
}
