import type { LecapMes } from "@/types";
import {
  MAX_TNA_DIVERGENCE_PP,
  REFERENCE_AS_OF_DATE,
  TNA_LIVE_MAX,
  TNA_LIVE_MIN,
} from "./constants";
import { daysSinceReference, daysToMaturity, isVtoActive } from "./dates";
import { parseARSPrice, parsePct } from "./parse";
import { resolveQuote, theoreticalLecapPrice, validateLivePrice } from "./prices";
import type { DataQualityFlag, LecapComputed, PriceMap } from "./types";

export function computeLecapMetrics(
  row: { t: string; pre: string; r: string; tem: string; tna: string },
  group: { mes?: string; vto: string; dias: number },
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): LecapComputed | null {
  const pBase = parseARSPrice(row.pre);
  const rBase = parsePct(row.r) / 100;
  const temBase = parsePct(row.tem) / 100;
  const tnaRef = parsePct(row.tna);
  const temRef = parsePct(row.tem);

  if (!pBase || !group.vto) return null;
  if (!isVtoActive(group.vto, now)) return null;

  const diasRest = daysToMaturity(group.vto, now);
  if (diasRest <= 0) return null;

  const vnVto = pBase * (1 + rBase);
  const daysSince = daysSinceReference(now, REFERENCE_AS_OF_DATE);
  const quote = resolveQuote(row.t, maps);
  const pTheoretical = theoreticalLecapPrice(pBase, temBase, daysSince);
  const hasLive = !!(quote?.price && quote.price > 0);
  const validation = hasLive
    ? validateLivePrice(quote!.price, pTheoretical)
    : { ok: false as const, reason: "no_live" };
  const pLive = hasLive && validation.ok ? quote!.price : pTheoretical;
  const isLive = hasLive && validation.ok;

  const flags: DataQualityFlag[] = [];
  if (!hasLive) flags.push("stale_ref");
  if (hasLive && !validation.ok) flags.push("bad_live");

  let rendimiento: number | null = null;
  let temLive: number | null = null;
  let tnaLive: number | null = null;

  if (pLive > 0 && diasRest > 0) {
    rendimiento = (vnVto / pLive - 1) * 100;
    temLive = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;
    tnaLive = rendimiento * (365 / diasRest);

    if (tnaLive > TNA_LIVE_MAX || tnaLive < TNA_LIVE_MIN) {
      flags.push("tna_outlier");
      tnaLive = null;
      temLive = null;
    } else if (Math.abs(tnaLive - tnaRef) > MAX_TNA_DIVERGENCE_PP && isLive) {
      flags.push("tna_divergence");
    }
  }

  return {
    ticker: row.t,
    mes: group.mes ?? group.vto,
    vto: group.vto,
    pRef: pBase,
    pLive,
    vnVto,
    isLive,
    priceOk: isLive,
    diasRest,
    tnaRef,
    temRef,
    tnaLive,
    temLive,
    rendimiento,
    isBoncap: !row.t.startsWith("S"),
    flags,
  };
}

export function buildLecapRows(
  lecap: LecapMes[],
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): LecapComputed[] {
  const rows: LecapComputed[] = [];
  for (const g of lecap) {
    if (!g.vto || !isVtoActive(g.vto, now)) continue;
    for (const row of g.rows) {
      const computed = computeLecapMetrics(row, g, maps, now);
      if (computed) rows.push(computed);
    }
  }
  return rows;
}

export function indexLecapByTicker(rows: LecapComputed[]): Record<string, LecapComputed> {
  const out: Record<string, LecapComputed> = {};
  for (const r of rows) out[r.ticker] = r;
  return out;
}
