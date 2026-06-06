// lib/renta-fija/sov-metrics.ts
// LIVE ONLY: TIR calculada siempre desde precio live.
// Si no hay precio live → TIR live = null (se muestra "—")

import { BOND_SCHEDULES, calcSovTIR } from "@/lib/data/bonds-schedules";
import type { SoberanoBond } from "@/types";
import { parseARSPrice, parseNum, parsePct } from "./parse";
import { resolveQuote } from "./prices";
import type { DataQualityFlag, PriceMap, SovComputed } from "./types";

export function computeSovMetrics(
  bond: SoberanoBond,
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): SovComputed {
  const pRef   = parseARSPrice(bond.p);
  const tirRef  = parsePct(bond.tir);
  const durRef  = parseNum(bond.dur);
  const cyRef   = parsePct(bond.cy);
  const ley: "ARG" | "NY" = bond.ley === "NY" ? "NY" : "ARG";

  // ── Solo precio LIVE de DATA912 ─────────────────────────────────
  const quote   = resolveQuote(bond.t, maps);
  const hasLive = !!(quote?.price && quote.price > 0);

  const flags: DataQualityFlag[] = [];

  // pLive: precio real de mercado o null
  const pLive = hasLive ? quote!.price! : null;
  const isLive = hasLive;

  if (!hasLive) flags.push("stale_ref");
  else flags.push("live");

  // TIR live: solo se calcula con precio live real
  const flows = BOND_SCHEDULES[bond.t];
  let tirLive: number | null = null;

  if (flows?.length && pLive && pLive > 0) {
    const futureFlows = flows.filter(f => new Date(f.date) > now);
    if (futureFlows.length) {
      const tir = calcSovTIR(pLive, futureFlows) * 100;
      if (tir > 0 && tir < 100 && Number.isFinite(tir)) {
        tirLive = tir;
      } else {
        flags.push("tir_unavailable");
      }
    } else {
      flags.push("tir_unavailable");
    }
  } else if (!flows?.length) {
    flags.push("tir_unavailable");
  }

  return {
    ticker:  bond.t,
    vto:     bond.vto,
    ley,
    pRef,
    pLive:   pLive ?? pRef,    // UI usa pRef solo para mostrar "referencia", no para calcular
    isLive,
    priceOk: isLive,
    tirRef,
    durRef,
    cyRef,
    tirLive,
    par:     bond.par,
    var1d:   bond.var1d,
    var1w:   bond.var1w,
    neg:     bond.neg,
    flags,
  };
}

/** TIR para curva: solo live. Si no hay live, 0 (excluido de la curva) */
export function sovTirForCurve(row: SovComputed): number {
  if (row.tirLive != null && row.tirLive > 0) return row.tirLive;
  return 0; // excluido — no usamos ref como fallback en la curva
}

export function buildSovRows(
  soberanos: SoberanoBond[],
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): SovComputed[] {
  return soberanos.map(b => computeSovMetrics(b, maps, now));
}

export function indexSovByTicker(
  rows: SovComputed[]
): Record<string, SovComputed> {
  const out: Record<string, SovComputed> = {};
  for (const r of rows) out[r.ticker] = r;
  return out;
}
