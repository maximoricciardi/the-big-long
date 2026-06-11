// lib/renta-fija/sov-metrics.ts
// LIVE ONLY: TIR calculada siempre desde precio live.
// Si no hay precio live → TIR live = null (se muestra "—")

import { BOND_SCHEDULES, calcSovTIR } from "@/lib/data/bonds-schedules";
import type { SoberanoBond } from "@/types";
import { buildFixedIncomeMetadata } from "./metadata";
import { parseARSPriceStrict, parseNum, parsePctStrict } from "./parse";
import { resolveQuote, validateLivePrice } from "./prices";
import { canCalculateWithSchedule } from "./calculation-safety";
import type { DataQualityFlag, PriceMap, SovComputed } from "./types";

export function computeSovMetrics(
  bond: SoberanoBond,
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): SovComputed {
  const pRef   = parseARSPriceStrict(bond.p) ?? 0;
  const tirRef  = parsePctStrict(bond.tir) ?? 0;
  const durRef  = parseNum(bond.dur);
  const cyRef   = parsePctStrict(bond.cy) ?? 0;
  const ley: "ARG" | "NY" = bond.ley === "NY" ? "NY" : "ARG";

  // ── Solo precio LIVE de DATA912 ─────────────────────────────────
  const quote   = resolveQuote(bond.t, maps);
  const hasRawLive = !!(quote?.price && quote.price > 0);
  const liveValidation = hasRawLive ? validateLivePrice(quote!.price, pRef) : { ok: false, reason: "no_price" };
  const hasLive = hasRawLive && liveValidation.ok;

  const flags: DataQualityFlag[] = [];

  // pLive: precio real de mercado o null
  const pLive = hasLive ? quote!.price! : null;
  const isLive = hasLive;

  if (!hasRawLive) flags.push("stale_ref");
  else if (!liveValidation.ok) flags.push("bad_live");
  else flags.push("live");

  // TIR live: solo se calcula con precio live real
  const flows = BOND_SCHEDULES[bond.t];
  let tirLive: number | null = null;
  const metadata = buildFixedIncomeMetadata({
    ticker: bond.t,
    category: "sovereign",
    confidence: "medium",
    maturity: bond.vto,
    maturitySource: "static",
    staticMetadata: {
      maturity: bond.vto,
      category: "sovereign",
      currency: "USD",
      law: ley,
      paymentFrequency: bond.pago,
      cashflows: flows,
      hasSchedule: Boolean(flows?.length),
    },
  });
  const safety = canCalculateWithSchedule(metadata, pLive, "medium");

  if (safety.ok && flows?.length && pLive && pLive > 0) {
    if (flows.some(f => new Date(f.date) > now)) {
      const tir = calcSovTIR(pLive, flows, now) * 100;
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
  } else if (!safety.ok) {
    flags.push("tir_unavailable");
  }

  return {
    ticker:  bond.t,
    vto:     bond.vto,
    ley,
    pRef,
    pLive,
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
