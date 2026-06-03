import { MAX_PRICE_DEVIATION_PCT } from "./constants";
import type { PriceMap, PriceQuote } from "./types";

export function resolveQuote(
  ticker: string,
  maps: { bonds: PriceMap; notes: PriceMap }
): PriceQuote | undefined {
  const isS = ticker.startsWith("S");
  const map = isS ? maps.notes : maps.bonds;
  return map[ticker] ?? map[ticker.toUpperCase()];
}

export function validateLivePrice(
  live: number,
  theoretical: number,
  maxDeviationPct = MAX_PRICE_DEVIATION_PCT
): { ok: boolean; reason?: string } {
  if (!live || live <= 0) return { ok: false, reason: "no_price" };
  if (!theoretical || theoretical <= 0) return { ok: true };
  const dev = (Math.abs(live - theoretical) / theoretical) * 100;
  if (dev > maxDeviationPct) return { ok: false, reason: "deviation" };
  return { ok: true };
}

export function theoreticalLecapPrice(
  pBase: number,
  temBase: number,
  daysSinceRef: number
): number {
  if (!pBase || !temBase) return pBase;
  return pBase * Math.pow(1 + temBase, daysSinceRef / 30);
}
