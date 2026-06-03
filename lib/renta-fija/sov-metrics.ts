import { BOND_SCHEDULES, calcSovTIR } from "@/lib/data/bonds-schedules";
import type { SoberanoBond } from "@/types";
import { parseARSPrice, parseNum, parsePct } from "./parse";
import { resolveQuote, validateLivePrice } from "./prices";
import type { DataQualityFlag, PriceMap, SovComputed } from "./types";

export function computeSovMetrics(
  bond: SoberanoBond,
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): SovComputed {
  const pRef = parseARSPrice(bond.p);
  const tirRef = parsePct(bond.tir);
  const durRef = parseNum(bond.dur);
  const cyRef = parsePct(bond.cy);
  const ley: "ARG" | "NY" = bond.ley === "NY" ? "NY" : "ARG";

  const quote = resolveQuote(bond.t, maps);
  const hasLive = !!(quote?.price && quote.price > 0);
  const validation = hasLive
    ? validateLivePrice(quote!.price, pRef)
    : { ok: false as const };
  const pLive = hasLive && validation.ok ? quote!.price : pRef;
  const isLive = hasLive && validation.ok;

  const flags: DataQualityFlag[] = [];
  if (!hasLive) flags.push("stale_ref");
  if (hasLive && !validation.ok) flags.push("bad_live");

  const flows = BOND_SCHEDULES[bond.t];
  let tirLive: number | null = null;

  if (flows?.length && pLive > 0) {
    const futureFlows = flows.filter(f => new Date(f.date) > now);
    if (futureFlows.length) {
      const tir = calcSovTIR(pLive, futureFlows) * 100;
      if (tir > 0 && Number.isFinite(tir)) {
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
    ticker: bond.t,
    vto: bond.vto,
    ley,
    pRef,
    pLive,
    isLive,
    priceOk: isLive || pRef > 0,
    tirRef,
    durRef,
    cyRef,
    tirLive,
    par: bond.par,
    var1d: bond.var1d,
    var1w: bond.var1w,
    neg: bond.neg,
    flags,
  };
}

/** TIR to plot on curve: live if available, else ref */
export function sovTirForCurve(row: SovComputed): number {
  if (row.tirLive != null && row.tirLive > 0) return row.tirLive;
  if (row.tirRef > 0) return row.tirRef;
  return 0;
}

export function buildSovRows(
  soberanos: SoberanoBond[],
  maps: { bonds: PriceMap; notes: PriceMap },
  now = new Date()
): SovComputed[] {
  return soberanos.map(b => computeSovMetrics(b, maps, now));
}

export function indexSovByTicker(rows: SovComputed[]): Record<string, SovComputed> {
  const out: Record<string, SovComputed> = {};
  for (const r of rows) out[r.ticker] = r;
  return out;
}
