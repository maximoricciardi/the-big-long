import { fetchJsonWithRetry, normalizeError } from "@/lib/api/reliability";
import { finiteNumber, finitePositive, normalizeDailyVariation } from "@/lib/equity/quote-normalization";
import type { NormalizedEquityQuote } from "@/lib/equity/quote-types";
import { normalizeEquitySymbol } from "@/lib/equity/symbols";

type RailwayQuoteRow = {
  symbol?: string;
  ticker?: string;
  price?: number;
  c?: number;
  change?: number;
  d?: number;
  changePct?: number;
  changePercent?: number;
  dp?: number;
  pct?: number;
  previousClose?: number;
  pc?: number;
  high?: number;
  h?: number;
  low?: number;
  l?: number;
  open?: number;
  o?: number;
  volume?: number;
  v?: number;
  currency?: string;
  sourceUpdatedAt?: string | null;
  fetchedAt?: string;
  stale?: boolean;
  provider?: string;
  source?: string;
};

type RailwayQuotesPayload = {
  data?: {
    quotes?: Record<string, RailwayQuoteRow> | RailwayQuoteRow[];
    prices?: Record<string, RailwayQuoteRow> | RailwayQuoteRow[];
    map?: Record<string, RailwayQuoteRow>;
    source?: string;
    fetchedAt?: string;
  };
  quotes?: Record<string, RailwayQuoteRow> | RailwayQuoteRow[];
  prices?: Record<string, RailwayQuoteRow> | RailwayQuoteRow[];
  map?: Record<string, RailwayQuoteRow>;
  meta?: {
    generatedAt?: string;
    cached?: boolean;
    stale?: boolean;
    sources?: string[];
  };
};

export interface RailwayProviderConfig {
  baseUrl?: string | null;
  token?: string | null;
  timeoutMs?: number;
}

export function railwayConfigFromEnv(): RailwayProviderConfig {
  return {
    baseUrl: process.env.FINANCIAL_API_URL ?? null,
    token: process.env.FINANCIAL_API_TOKEN ?? null,
    timeoutMs: 4_000,
  };
}

function cleanBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function quotesUrl(baseUrl: string, symbols: string[]): string {
  const url = new URL(`${cleanBase(baseUrl)}/v1/market-data/equities/quotes`);
  url.searchParams.set("symbols", symbols.join(","));
  return url.toString();
}

function rowSymbol(row: RailwayQuoteRow, fallback: string): string {
  return normalizeEquitySymbol(row.symbol ?? row.ticker ?? fallback);
}

function extractRows(payload: RailwayQuotesPayload): Array<[string, RailwayQuoteRow]> {
  const candidates = [
    payload.data?.quotes,
    payload.data?.prices,
    payload.data?.map,
    payload.quotes,
    payload.prices,
    payload.map,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (Array.isArray(candidate)) {
      return candidate.reduce<Array<[string, RailwayQuoteRow]>>((rows, row) => {
        const symbol = rowSymbol(row, "");
        if (symbol) rows.push([symbol, row]);
        return rows;
      }, []);
    }
    return Object.entries(candidate);
  }

  return [];
}

function normalizeRailwayQuote(requestedSymbol: string, row: RailwayQuoteRow, fallbackSource: string): NormalizedEquityQuote | null {
  const ticker = normalizeEquitySymbol(requestedSymbol);
  const price = finitePositive(row.price ?? row.c);
  if (price === null) return null;

  const previousClose = finitePositive(row.previousClose ?? row.pc);
  const variation = normalizeDailyVariation({
    price,
    previousClose,
    change: row.change ?? row.d,
    changePct: row.changePct ?? row.changePercent ?? row.dp ?? row.pct,
  });
  const sourceUpdatedAt = typeof row.sourceUpdatedAt === "string" ? row.sourceUpdatedAt : null;

  return {
    requestedSymbol: ticker,
    ticker,
    resolvedSymbol: rowSymbol(row, ticker),
    price,
    change: variation.change,
    changePct: variation.changePct,
    changeSource: variation.changeSource,
    variationStatus: variation.variationStatus,
    high: finiteNumber(row.high ?? row.h),
    low: finiteNumber(row.low ?? row.l),
    open: finiteNumber(row.open ?? row.o),
    previousClose,
    volume: finiteNumber(row.volume ?? row.v),
    currency: row.currency ?? "USD",
    provider: row.provider ?? "Railway Financial API",
    source: row.source ?? fallbackSource,
    fetchedAt: row.fetchedAt ?? new Date().toISOString(),
    sourceUpdatedAt,
    ageSeconds: null,
    stale: Boolean(row.stale),
    availabilityStatus: "available",
    freshnessStatus: row.stale ? "stale" : "recent",
    confidence: row.stale ? "medium" : "high",
    fallbackUsed: false,
    unavailableReason: null,
  };
}

export async function fetchRailwayEquityQuotes(
  symbols: string[],
  config: RailwayProviderConfig = railwayConfigFromEnv()
): Promise<{
  quotes: Record<string, NormalizedEquityQuote>;
  status: { provider: string; status: string; message?: string };
  errors: Array<{ provider: string; message: string; status?: number }>;
}> {
  const uniqueSymbols = [...new Set(symbols.map(normalizeEquitySymbol).filter(Boolean))];
  if (!config.baseUrl || !config.token) {
    return {
      quotes: {},
      status: { provider: "Railway Financial API", status: "unavailable", message: "FINANCIAL_API_URL or FINANCIAL_API_TOKEN is not configured." },
      errors: [],
    };
  }

  const source = quotesUrl(config.baseUrl, uniqueSymbols);
  try {
    const payload = await fetchJsonWithRetry<RailwayQuotesPayload>(source, {
      provider: "Railway Financial API",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      timeoutMs: config.timeoutMs ?? 4_000,
      retries: 0,
    });
    const byRequested: Record<string, NormalizedEquityQuote> = {};
    const rows = extractRows(payload);
    const rowMap = new Map(rows.map(([symbol, row]) => [normalizeEquitySymbol(symbol), row]));

    uniqueSymbols.forEach((symbol) => {
      const row = rowMap.get(symbol);
      if (!row) return;
      const quote = normalizeRailwayQuote(symbol, row, source);
      if (quote) byRequested[symbol] = quote;
    });

    const status = Object.keys(byRequested).length === uniqueSymbols.length
      ? "ok"
      : Object.keys(byRequested).length > 0
        ? "partial"
        : "empty";

    return {
      quotes: byRequested,
      status: {
        provider: "Railway Financial API",
        status,
        message: status === "empty" ? "Railway endpoint did not return usable equity quotes." : undefined,
      },
      errors: [],
    };
  } catch (err) {
    const normalized = normalizeError(err, "Railway Financial API");
    return {
      quotes: {},
      status: { provider: "Railway Financial API", status: "error", message: normalized.message },
      errors: [{ provider: normalized.provider, message: normalized.message, status: normalized.status }],
    };
  }
}
