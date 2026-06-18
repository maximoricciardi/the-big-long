"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveMarket } from "@/types";
import { FINNHUB_PROXY, LIVE_MARKET_CACHE_TTL_MS, LIVE_MARKET_KEY } from "@/lib/constants";
import { readTimestampedCache, writeTimestampedCache } from "@/lib/live-data-cache";

function quoteUrl(symbol: string) {
  return `${FINNHUB_PROXY}${encodeURIComponent(symbol)}`;
}

type LiveMarketQuote = { price: number; changePct: number };
type LiveMarketPayload = Omit<LiveMarket, "_meta">;
type QuoteResponse = { c?: number; dp?: number; _meta?: { status?: string; fetchedAt?: string } };

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeQuote(value: unknown): LiveMarketQuote | null {
  if (typeof value !== "object" || value === null) return null;
  const quote = value as Partial<LiveMarketQuote>;
  return isFiniteNumber(quote.price) && quote.price > 0 && isFiniteNumber(quote.changePct)
    ? { price: quote.price, changePct: quote.changePct }
    : null;
}

function normalizeLiveMarket(value: unknown): LiveMarketPayload | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Partial<LiveMarket>;
  const next: LiveMarketPayload = {};

  const spy = normalizeQuote(raw.spy);
  const gold = normalizeQuote(raw.gold);
  const brent = normalizeQuote(raw.brent);
  if (spy) next.spy = spy;
  if (gold) next.gold = gold;
  if (brent) next.brent = brent;

  if (
    raw.topArgStock &&
    typeof raw.topArgStock.ticker === "string" &&
    isFiniteNumber(raw.topArgStock.price) &&
    raw.topArgStock.price > 0 &&
    isFiniteNumber(raw.topArgStock.changePct)
  ) {
    next.topArgStock = {
      ticker: raw.topArgStock.ticker,
      price: raw.topArgStock.price,
      changePct: raw.topArgStock.changePct,
    };
  }

  return Object.keys(next).length > 0 ? next : null;
}

function withoutMeta(market: LiveMarket): LiveMarketPayload {
  const payload: LiveMarketPayload = {};
  if (market.spy) payload.spy = market.spy;
  if (market.gold) payload.gold = market.gold;
  if (market.brent) payload.brent = market.brent;
  if (market.mervalARS) payload.mervalARS = market.mervalARS;
  if (market.topArgStock) payload.topArgStock = market.topArgStock;
  return payload;
}

function loadFromStorage(): LiveMarket {
  const cached = readTimestampedCache(LIVE_MARKET_KEY, LIVE_MARKET_CACHE_TTL_MS, normalizeLiveMarket);
  if (cached.state === "fresh" && cached.data) {
    return {
      ...cached.data,
      _meta: {
        status: "cache",
        fetchedAt: cached.savedAt ?? undefined,
        ageMs: cached.ageMs,
        ttlMs: LIVE_MARKET_CACHE_TTL_MS,
      },
    };
  }

  return {
    _meta: {
      status: cached.state === "stale" ? "stale" : "empty",
      fetchedAt: cached.savedAt ?? undefined,
      ageMs: cached.ageMs,
      ttlMs: LIVE_MARKET_CACHE_TTL_MS,
    },
  };
}

async function fetchQuote(symbol: string): Promise<LiveMarketQuote> {
  const response = await fetch(quoteUrl(symbol), { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json() as QuoteResponse;
  if (!isFiniteNumber(data.c) || data.c <= 0) throw new Error(`No price for ${symbol}`);
  if (!isFiniteNumber(data.dp)) throw new Error(`No change percent for ${symbol}`);
  return { price: data.c, changePct: data.dp };
}

function hasFreshMeta(market: LiveMarket) {
  const fetchedAt = market._meta?.fetchedAt;
  return typeof fetchedAt === "number" && Date.now() - fetchedAt <= LIVE_MARKET_CACHE_TTL_MS;
}

export function useLiveMarket(): LiveMarket {
  const [market, setMarket] = useState<LiveMarket>(loadFromStorage);

  const fetchMarket = useCallback(async () => {
    const updates: LiveMarketPayload = {};
    const errors: string[] = [];

    const [spy, gold, brent] = await Promise.allSettled([
      fetchQuote("SPY"),
      fetchQuote("GLD"),
      fetchQuote("BNO"),
    ]);
    if (spy.status === "fulfilled") updates.spy = spy.value;
    else errors.push("SPY");
    if (gold.status === "fulfilled") updates.gold = gold.value;
    else errors.push("GLD");
    if (brent.status === "fulfilled") updates.brent = brent.value;
    else errors.push("BNO");

    try {
      const ARG_STARS = ["GGAL","YPFD","PAM","BMA","BBAR"];
      const hits = await Promise.allSettled(
        ARG_STARS.map(async (sym) => {
          const quote = await fetchQuote(sym);
          return { t: sym, ...quote };
        })
      );
      const best = hits
        .filter((h): h is PromiseFulfilledResult<{ t: string; price: number; changePct: number }> =>
          h.status === "fulfilled" && h.value.price > 0
        )
        .map(h => h.value)
        .sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0))[0];
      if (best) updates.topArgStock = { ticker: best.t, price: best.price, changePct: best.changePct };
      else errors.push("ARG_STARS");
    } catch {
      errors.push("ARG_STARS");
    }

    setMarket(prev => {
      const now = Date.now();
      const hasUpdates = Object.keys(updates).length > 0;
      const previousFresh = hasFreshMeta(prev) ? withoutMeta(prev) : {};
      const nextPayload = hasUpdates ? updates : previousFresh;
      const hasData = Object.keys(nextPayload).length > 0;

      if (hasUpdates) {
        writeTimestampedCache(LIVE_MARKET_KEY, nextPayload, { errors });
      }

      if (!hasData) {
        return {
          _meta: {
            status: "error",
            fetchedAt: now,
            ageMs: 0,
            ttlMs: LIVE_MARKET_CACHE_TTL_MS,
            errors,
          },
        };
      }

      return {
        ...nextPayload,
        _meta: {
          status: hasUpdates ? (errors.length ? "partial" : "live") : "cache",
          fetchedAt: hasUpdates ? now : prev._meta?.fetchedAt,
          ageMs: hasUpdates ? 0 : prev._meta?.ageMs ?? null,
          ttlMs: LIVE_MARKET_CACHE_TTL_MS,
          ...(errors.length ? { errors } : {}),
        },
      };
    });
  }, []);

  useEffect(() => {
    fetchMarket();
    const id = setInterval(fetchMarket, 60_000);
    return () => clearInterval(id);
  }, [fetchMarket]);

  return market;
}
