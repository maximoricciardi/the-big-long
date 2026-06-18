"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveMarket } from "@/types";
import { FINNHUB_PROXY, LIVE_MARKET_KEY } from "@/lib/constants";

const LIVE_MARKET_TTL_MS = 2 * 60 * 1000;

type LiveMarketCache = {
  data?: LiveMarket;
  market?: LiveMarket;
  cachedAt?: number;
  ttlMs?: number;
  source?: "live" | "cache" | "stale" | "ref";
};

function quoteUrl(symbol: string) {
  return `${FINNHUB_PROXY}${encodeURIComponent(symbol)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function loadFromStorage(): LiveMarket {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIVE_MARKET_KEY) || "null") as LiveMarketCache | LiveMarket | null;
    if (!parsed || !isRecord(parsed)) return {};

    const envelope = parsed as LiveMarketCache;
    const market = envelope.data ?? envelope.market;
    if (market && isRecord(market)) return market as LiveMarket;

    return parsed as LiveMarket;
  } catch {
    return {};
  }
}

function writeToStorage(market: LiveMarket) {
  try {
    localStorage.setItem(
      LIVE_MARKET_KEY,
      JSON.stringify({
        data: market,
        cachedAt: Date.now(),
        ttlMs: LIVE_MARKET_TTL_MS,
        source: "live",
      })
    );
  } catch {
    /* silent */
  }
}

export function useLiveMarket(): LiveMarket {
  const [market, setMarket] = useState<LiveMarket>(loadFromStorage);

  const fetchMarket = useCallback(async () => {
    const updates: Partial<LiveMarket> = {};

    try {
      const r = await fetch(quoteUrl("SPY"), { cache: "no-store" });
      const d = await r.json() as { c: number; dp: number };
      if (d.c > 0) updates.spy = { price: d.c, changePct: d.dp };
    } catch { /* silent */ }

    try {
      const rg = await fetch(quoteUrl("GLD"), { cache: "no-store" });
      const dg = await rg.json() as { c: number; dp: number };
      if (dg.c > 0) updates.gold = { price: dg.c, changePct: dg.dp };
    } catch { /* silent */ }

    try {
      const rb = await fetch(quoteUrl("BNO"), { cache: "no-store" });
      const db = await rb.json() as { c: number; dp: number };
      if (db.c > 0) updates.brent = { price: db.c, changePct: db.dp };
    } catch { /* silent */ }

    try {
      const ARG_STARS = ["GGAL","YPFD","PAM","BMA","BBAR"];
      const hits = await Promise.allSettled(
        ARG_STARS.map(async (sym) => {
          const r = await fetch(quoteUrl(sym), { cache: "no-store" });
          const d = await r.json() as { c: number; dp: number };
          return { t: sym, c: d.c, dp: d.dp };
        })
      );
      const best = hits
        .filter((h): h is PromiseFulfilledResult<{ t: string; c: number; dp: number }> =>
          h.status === "fulfilled" && h.value.c > 0
        )
        .map(h => h.value)
        .sort((a, b) => (b.dp ?? 0) - (a.dp ?? 0))[0];
      if (best) updates.topArgStock = { ticker: best.t, price: best.c, changePct: best.dp };
    } catch { /* silent */ }

    if (Object.keys(updates).length > 0) {
      setMarket(prev => {
        const next = { ...prev, ...updates };
        writeToStorage(next);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    fetchMarket();
    const id = setInterval(fetchMarket, 60_000);
    return () => clearInterval(id);
  }, [fetchMarket]);

  return market;
}
