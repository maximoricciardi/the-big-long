export const LIVE_PRICES_CACHE_KEY = "tbl-live-prices:v2:equities";
export const LIVE_PRICES_LEGACY_CACHE_KEY = "tbl-live-prices";
export const LIVE_PRICES_TTL_MS = 2 * 60 * 1000;

export type LivePricesCacheState = "empty" | "cache" | "stale" | "legacy";

type CacheEnvelope<T> = {
  prices?: Record<string, T>;
  data?: Record<string, T>;
  cachedAt?: number;
  ttlMs?: number;
  source?: "live" | "cache" | "stale" | "ref";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readLivePricesCache<T>(): {
  prices: Record<string, T>;
  state: LivePricesCacheState;
  cachedAt: number | null;
} {
  try {
    const primary = readCacheKey<T>(LIVE_PRICES_CACHE_KEY, false);
    if (primary.state !== "empty" || Object.keys(primary.prices).length > 0) return primary;

    return readCacheKey<T>(LIVE_PRICES_LEGACY_CACHE_KEY, true);
  } catch {
    return { prices: {}, state: "empty", cachedAt: null };
  }
}

function readCacheKey<T>(key: string, legacyKey: boolean): {
  prices: Record<string, T>;
  state: LivePricesCacheState;
  cachedAt: number | null;
} {
  const raw = localStorage.getItem(key);
  if (!raw) return { prices: {}, state: "empty", cachedAt: null };

  const parsed = JSON.parse(raw) as CacheEnvelope<T> | Record<string, T>;
  if (!isRecord(parsed)) return { prices: {}, state: "empty", cachedAt: null };

  const envelope = parsed as CacheEnvelope<T>;
  const prices = envelope.prices ?? envelope.data;
  if (prices && isRecord(prices)) {
    const cachedAt = typeof envelope.cachedAt === "number" ? envelope.cachedAt : null;
    const ttlMs = typeof envelope.ttlMs === "number" ? envelope.ttlMs : LIVE_PRICES_TTL_MS;
    if (legacyKey || cachedAt === null) return { prices: prices as Record<string, T>, state: "legacy", cachedAt };
    const state = Date.now() - cachedAt <= ttlMs ? "cache" : "stale";
    return { prices: prices as Record<string, T>, state, cachedAt };
  }

  return { prices: parsed as Record<string, T>, state: "legacy", cachedAt: null };
}

export function writeLivePricesCache<T>(prices: Record<string, T>) {
  try {
    localStorage.setItem(
      LIVE_PRICES_CACHE_KEY,
      JSON.stringify({
        prices,
        cachedAt: Date.now(),
        ttlMs: LIVE_PRICES_TTL_MS,
        source: "live",
      })
    );
  } catch {
    // localStorage may be unavailable in private mode or restricted browsers.
  }
}
