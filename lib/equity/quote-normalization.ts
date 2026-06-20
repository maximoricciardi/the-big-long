import {
  EQUITY_QUOTE_STALE_SECONDS,
  type EquityQuoteChangeSource,
  type EquityQuoteFreshnessStatus,
  type EquityQuoteVariationStatus,
} from "@/lib/equity/quote-types";

export function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function finitePositive(value: unknown): number | null {
  const number = finiteNumber(value);
  return number !== null && number > 0 ? number : null;
}

export function lastFinite(values: Array<number | null | undefined> | undefined): number | null {
  if (!values) return null;
  for (let i = values.length - 1; i >= 0; i -= 1) {
    const value = finiteNumber(values[i]);
    if (value !== null) return value;
  }
  return null;
}

export function sourceTimeFromUnix(unixSeconds?: number): { sourceUpdatedAt: string | null; ageSeconds: number | null; stale: boolean } {
  if (!unixSeconds || unixSeconds <= 0) {
    return { sourceUpdatedAt: null, ageSeconds: null, stale: false };
  }
  const updatedAt = new Date(unixSeconds * 1000);
  const ageSeconds = Math.max(0, Math.floor((Date.now() - updatedAt.getTime()) / 1000));
  return {
    sourceUpdatedAt: updatedAt.toISOString(),
    ageSeconds,
    stale: ageSeconds > EQUITY_QUOTE_STALE_SECONDS,
  };
}

export function freshnessFor(provider: string, ageSeconds: number | null, stale: boolean): EquityQuoteFreshnessStatus {
  if (stale) return "stale";
  if (ageSeconds === null) return provider === "Yahoo Finance" ? "delayed" : "recent";
  if (provider === "Finnhub" && ageSeconds <= 15 * 60) return "live";
  if (ageSeconds <= EQUITY_QUOTE_STALE_SECONDS) return provider === "Yahoo Finance" ? "delayed" : "recent";
  return "stale";
}

export function normalizeDailyVariation({
  price,
  previousClose,
  change,
  changePct,
}: {
  price: unknown;
  previousClose: unknown;
  change?: unknown;
  changePct?: unknown;
}): {
  change: number | null;
  changePct: number | null;
  changeSource: EquityQuoteChangeSource;
  variationStatus: EquityQuoteVariationStatus;
} {
  const currentPrice = finitePositive(price);
  const priorClose = finitePositive(previousClose);

  if (currentPrice !== null && priorClose !== null) {
    const computedChange = currentPrice - priorClose;
    return {
      change: computedChange,
      changePct: (computedChange / priorClose) * 100,
      changeSource: "computed_from_previous_close",
      variationStatus: "available",
    };
  }

  const providerChange = finiteNumber(change);
  const providerChangePct = finiteNumber(changePct);
  if (providerChange !== null && providerChangePct !== null) {
    return {
      change: providerChange,
      changePct: providerChangePct,
      changeSource: "provider",
      variationStatus: "available",
    };
  }

  return {
    change: null,
    changePct: null,
    changeSource: "unavailable",
    variationStatus: "unavailable",
  };
}
