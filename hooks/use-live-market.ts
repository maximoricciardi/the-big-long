"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveMarket } from "@/types";
import { FINNHUB_PROXY, LIVE_MARKET_KEY } from "@/lib/constants";

function loadFromStorage(): LiveMarket {
  try {
    return JSON.parse(localStorage.getItem(LIVE_MARKET_KEY) || "null") || {};
  } catch {
    return {};
  }
}

export function useLiveMarket(): LiveMarket {
  const [market, setMarket] = useState<LiveMarket>(loadFromStorage);

  const fetchMarket = useCallback(async () => {
    const updates: Partial<LiveMarket> = {};

    try {
      const r = await fetch(`${FINNHUB_PROXY}=SPY`);
      const d = await r.json() as { c: number; dp: number };
      if (d.c > 0) updates.spy = { price: d.c, changePct: d.dp };
    } catch { /* silent */ }

    try {
      const rg = await fetch(`${FINNHUB_PROXY}=GLD`);
      const dg = await rg.json() as { c: number; dp: number };
      if (dg.c > 0) updates.gold = { price: dg.c, changePct: dg.dp };
    } catch { /* silent */ }

    try {
      const rb = await fetch(`${FINNHUB_PROXY}=BNO`);
      const db = await rb.json() as { c: number; dp: number };
      if (db.c > 0) updates.brent = { price: db.c, changePct: db.dp };
    } catch { /* silent */ }

    try {
      const ARG_STARS = ["GGAL","YPFD","PAM","BMA","BBAR"];
      const hits = await Promise.allSettled(
        ARG_STARS.map(async (sym) => {
          const r = await fetch(`${FINNHUB_PROXY}=${sym}`);
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
        try { localStorage.setItem(LIVE_MARKET_KEY, JSON.stringify(next)); } catch { /* silent */ }
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
