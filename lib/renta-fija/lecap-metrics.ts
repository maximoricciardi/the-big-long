// lib/renta-fija/lecap-metrics.ts
// LIVE ONLY: si no hay precio live no se muestra TNA/TEM.
// No usamos precio teórico como fallback — datos reales o nada.

import type { LecapMes } from "@/types";
import {
  TNA_LIVE_MAX,
  TNA_LIVE_MIN,
} from "./constants";
import { daysToMaturity, isVtoActive } from "./dates";
import { parseARSPriceStrict, parsePctStrict } from "./parse";
import { resolveQuote } from "./prices";
import type { DataQualityFlag, LecapComputed, PriceMap } from "./types";

export function computeLecapMetrics(
  row: { t: string; pre: string; r: string; tem: string; tna: string },
  group: { mes?: string; vto: string; dias: number },
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): LecapComputed | null {
  const pBase = parseARSPriceStrict(row.pre);
  const rPct   = parsePctStrict(row.r);
  const tnaRef = parsePctStrict(row.tna);
  const temRef = parsePctStrict(row.tem);
  const rBase  = rPct != null ? rPct / 100 : null;

  if (pBase == null || rBase == null || tnaRef == null || temRef == null || !group.vto) return null;
  if (!isVtoActive(group.vto, now)) return null;

  const diasRest = daysToMaturity(group.vto, now);
  if (diasRest <= 0) return null;

  const vnVto = pBase * (1 + rBase);

  // ── Solo usamos precio LIVE de DATA912 ─────────────────────────
  const quote   = resolveQuote(row.t, maps);
  const hasLive = !!(quote?.price && quote.price > 0);

  const flags: DataQualityFlag[] = [];

  // Sin precio live → devolvemos entrada con flags pero sin métricas
  if (!hasLive) {
    flags.push("stale_ref");
    return {
      ticker:      row.t,
      mes:         group.mes ?? group.vto,
      vto:         group.vto,
      pRef:        pBase,
      pLive:       null,   // explícitamente null
      vnVto,
      isLive:      false,
      priceOk:     false,
      diasRest,
      tnaRef,
      temRef,
      tnaLive:     null,
      temLive:     null,
      rendimiento: null,
      isBoncap:    !row.t.startsWith("S"),
      flags,
    };
  }

  // Con precio live → calcular métricas en tiempo real
  const pLive = quote!.price!;
  flags.push("live");

  let rendimiento: number | null = null;
  let temLive:     number | null = null;
  let tnaLive:     number | null = null;

  if (pLive > 0 && diasRest > 0) {
    rendimiento = (vnVto / pLive - 1) * 100;
    temLive     = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;
    tnaLive     = rendimiento * (365 / diasRest);

    // Sanity check
    if (
      tnaLive  < TNA_LIVE_MIN ||
      tnaLive  > TNA_LIVE_MAX ||
      temLive  < 0
    ) {
      flags.push("tna_outlier");
      tnaLive  = null;
      temLive  = null;
      rendimiento = null;
    }
  }

  return {
    ticker:  row.t,
    mes:     group.mes ?? group.vto,
    vto:     group.vto,
    pRef:    pBase,
    pLive,
    vnVto,
    isLive:  true,
    priceOk: true,
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

export function indexLecapByTicker(
  rows: LecapComputed[]
): Record<string, LecapComputed> {
  const out: Record<string, LecapComputed> = {};
  for (const r of rows) out[r.ticker] = r;
  return out;
}
