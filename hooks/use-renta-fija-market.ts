"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BONOS_CER, DOLARLINKED, DUALES, LECAP, SOBERANOS, TAMAR } from "@/lib/data/renta-fija";
import { BOND_SCHEDULES } from "@/lib/data/bonds-schedules";
import {
  REFRESH_MS,
  buildLecapRows,
  buildSovRows,
  discoverFixedIncomeUniverse,
  indexLecapByTicker,
  indexSovByTicker,
  type PriceMap,
  type RentaFijaMarketSnapshot,
  type RentaFijaMarketStatus,
  type InstrumentMetadata,
} from "@/lib/renta-fija";

type ProviderEnvelope = { map?: PriceMap; _meta?: { status?: string } };

function mapFromApi(json: ProviderEnvelope): PriceMap {
  return json.map ?? {};
}

function isUsableProviderResponse(responseOk: boolean, json: ProviderEnvelope): boolean {
  const status = json._meta?.status;
  return responseOk && (status == null || status === "ok" || status === "partial") && Object.keys(json.map ?? {}).length > 0;
}

function staticMetadata(): Record<string, InstrumentMetadata> {
  const out: Record<string, InstrumentMetadata> = {};
  const add = (ticker: string, maturity?: string, hasSchedule = false) => {
    if (!ticker) return;
    out[ticker] = { maturity, hasSchedule };
  };

  for (const group of LECAP) {
    for (const row of group.rows) add(row.t, group.vto, true);
  }
  for (const row of DUALES) add(row.t, row.vto, false);
  for (const row of DOLARLINKED) add(row.t, row.vto, false);
  for (const row of TAMAR) add(row.t, row.vto, false);
  for (const row of BONOS_CER) add(row.t, row.vto, false);
  for (const row of SOBERANOS) add(row.t, row.vto, Boolean(BOND_SCHEDULES[row.t]?.length));

  return out;
}

export function useRentaFijaMarket(): RentaFijaMarketSnapshot {
  const [bondPrices, setBondPrices] = useState<PriceMap>({});
  const [lecapLive, setLecapLive] = useState<PriceMap>({});
  const [status, setStatus] = useState<RentaFijaMarketStatus>({
    loading: true,
    bondsOk: false,
    notesOk: false,
    matchedSov: 0,
    matchedLecap: 0,
    lastUpdate: null,
  });

  const load = useCallback(async () => {
    let bondsOk = false;
    let notesOk = false;
    const bonds: PriceMap = {};
    const notes: PriceMap = {};

    try {
      const rb = await fetch("/api/equities?type=bonds");
      const bondsJson = await rb.json();
      Object.assign(bonds, mapFromApi(bondsJson));
      (bondsJson.raw || []).forEach((b: { symbol?: string; c?: number; pct_change?: number }) => {
        if (!b.symbol || b.c == null) return;
        bonds[b.symbol] = { price: b.c, pct: b.pct_change };
      });
      bondsOk = isUsableProviderResponse(rb.ok, bondsJson);
    } catch {
      bondsOk = false;
    }

    try {
      const rn = await fetch("/api/equities?type=notes");
      const notesJson = await rn.json();
      Object.assign(notes, mapFromApi(notesJson));
      notesOk = isUsableProviderResponse(rn.ok, notesJson);
    } catch {
      notesOk = false;
    }

    setBondPrices(bonds);
    setLecapLive(notes);

    const maps = { bonds, notes };
    const lecapRows = buildLecapRows(LECAP, maps);
    const sovRows = buildSovRows(SOBERANOS, maps);

    const matchedSov = SOBERANOS.filter(s => bonds[s.t]?.price).length;
    const lecapTickers = LECAP.flatMap(g => g.rows.map(r => r.t));
    const matchedLecap = lecapTickers.filter(t => {
      const isS = t.startsWith("S");
      const m = isS ? notes : bonds;
      return !!(m[t]?.price);
    }).length;

    setStatus({
      loading: false,
      bondsOk,
      notesOk,
      matchedSov,
      matchedLecap,
      lastUpdate: new Date(),
    });
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const maps = useMemo(() => ({ bonds: bondPrices, notes: lecapLive }), [bondPrices, lecapLive]);
  const metadata = useMemo(() => staticMetadata(), []);

  const lecapRows = useMemo(() => buildLecapRows(LECAP, maps), [maps]);
  const sovRows = useMemo(() => buildSovRows(SOBERANOS, maps), [maps]);
  const discovered = useMemo(() => discoverFixedIncomeUniverse(maps, metadata), [maps, metadata]);
  const lecapByTicker = useMemo(() => indexLecapByTicker(lecapRows), [lecapRows]);
  const sovByTicker = useMemo(() => indexSovByTicker(sovRows), [sovRows]);

  return {
    bondPrices,
    lecapLive,
    discovered,
    lecapRows,
    sovRows,
    lecapByTicker,
    sovByTicker,
    status,
    reload: load,
  };
}
