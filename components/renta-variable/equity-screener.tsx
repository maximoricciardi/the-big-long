"use client";

/**
 * components/renta-variable/equity-screener.tsx
 * Screener de acciones con precios live Finnhub, rendimientos y análisis fundamental
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, TrendingUp, BarChart3 } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import { EQUITIES, tvUrl } from "@/lib/data/equities";
import type { BatchPrice } from "@/types";

interface LiveEntry { price: number; change: number; changePct: number; high: number; low: number; }
interface HistEntry { s1: number; m1: number; ytd: number; distHi52: number; }

function getUpCategory(pct: number): string {
  if (pct > 30) return "MUY ALTO";
  if (pct > 15) return "ALTO";
  if (pct > 5)  return "MEDIO";
  return "BAJO";
}

export function EquityScreener() {
  const t = useAppTheme();
  const [livePrices,   setLivePrices]   = useState<Record<string, LiveEntry>>({});
  const [liveHistory,  setLiveHistory]  = useState<Record<string, HistEntry>>({});
  const [liveStatus,   setLiveStatus]   = useState("loading");
  const [histStatus,   setHistStatus]   = useState("loading");
  const [quotesComplete, setQC]         = useState(false);
  const livePricesRef = useRef<Record<string, LiveEntry>>({});

  const [search,   setSearch]   = useState("");
  const [mktFilter, setMkt]     = useState("Todos");
  const [anFilter,  setAn]      = useState("Todos");
  const [sortCol,  setSortCol]  = useState("sc");
  const [sortDir,  setSortDir]  = useState<1|-1>(-1);
  const [viewMode, setView]     = useState<"perf"|"fund">("perf");

  // ── Phase 1: Batch quote fetch ────────────────────────────────
  useEffect(() => {
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const run = async () => {
      try {
        const r = await fetch(`/api/batch?symbols=${encodeURIComponent(tickers.join(","))}`);
        const data: { prices?: Record<string, BatchPrice>; _meta?: { status?: string } } = await r.json();
        const prices = data.prices ?? {};
        if (r.ok && Object.keys(prices).length > 0 && data._meta?.status !== "error") {
          const mapped: Record<string, LiveEntry> = {};
          Object.entries(prices).forEach(([k, v]) => {
            mapped[k] = { price: v.price, change: v.change, changePct: v.changePct, high: v.high, low: v.low };
          });
          livePricesRef.current = mapped;
          setLivePrices(mapped);
          setLiveStatus(data._meta?.status === "partial" ? "degraded" : "ok");
        } else {
          setLiveStatus("error");
        }
      } catch { setLiveStatus("error"); }
      setQC(true);
    };
    run();
    const id = setInterval(run, 90000);
    return () => clearInterval(id);
  }, []);

  // ── Phase 2: Weekly candles for S1/M1/YTD/52H ───────────────
  useEffect(() => {
    if (!quotesComplete) return;
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const NOW   = Math.floor(Date.now() / 1000);
    const W52   = NOW - 366 * 86400;
    const yearStart = Math.floor(Date.UTC(new Date().getUTCFullYear(), 0, 1) / 1000);
    const M1    = NOW - 30 * 86400;
    const W1    = NOW - 7 * 86400;

    const findClose = (times: number[], closes: number[], ts: number) => {
      for (let j = 1; j < times.length; j++) if (times[j] > ts) return closes[j - 1];
      return closes[closes.length - 1];
    };

    const run = async () => {
      const BATCH = 10;
      for (let i = 0; i < tickers.length; i += BATCH) {
        if (cancelled) return;
        const batch = tickers.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(async ticker => {
          try {
            const r = await fetch(`/api/candle?symbol=${ticker}&resolution=W&from=${W52}&to=${NOW}`);
            const d = await r.json() as { s: string; c?: number[]; t?: number[] };
            if (d.s === "ok" && d.c?.length && d.t?.length) {
              const cur    = livePricesRef.current[ticker]?.price ?? d.c[d.c.length - 1];
              const hi52   = Math.max(...d.c);
              const s1Base = findClose(d.t, d.c, W1);
              const m1Base = findClose(d.t, d.c, M1);
              const ytdBase= findClose(d.t, d.c, yearStart);
              if (!cancelled) setLiveHistory(prev => ({
                ...prev,
                [ticker]: {
                  s1:       (cur - s1Base)  / s1Base  * 100,
                  m1:       (cur - m1Base)  / m1Base  * 100,
                  ytd:      (cur - ytdBase) / ytdBase * 100,
                  distHi52: (cur - hi52)    / hi52    * 100,
                }
              }));
              if (!cancelled) setHistStatus("ok");
            }
          } catch {}
        }));
        if (i + BATCH < tickers.length) await new Promise(r => setTimeout(r, 1200));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [quotesComplete]);

  // ── Enrich equities ───────────────────────────────────────────
  const equitiesLive = useMemo(() => EQUITIES.map(e => {
    const lp   = livePrices[e.t];
    const hist = liveHistory[e.t];
    const price = lp?.price ?? e.p;

    const upsideVsTarget = e.tg ? (e.tg / price - 1) * 100 : null;
    const dist52         = hist?.distHi52 ?? e.ma;
    const isAtHigh       = dist52 !== null && dist52 > -8;
    const upsideVs52H    = dist52 !== null
      ? (isAtHigh ? (e.sc ? -(e.sc > 70 ? 15 : e.sc > 50 ? 10 : 5) : dist52) : Math.abs(dist52))
      : null;
    const upside = upsideVsTarget ?? upsideVs52H;
    const udLabel = upsideVsTarget !== null ? "vs target" : (isAtHigh ? "correc. est." : "vs máx 52S");

    return {
      ...e,
      p:       price,
      _1d:     lp?.changePct ?? null,
      s1:      hist?.s1   ?? e.s1,
      m1:      hist?.m1   ?? e.m1,
      ytd:     hist?.ytd  ?? e.ytd,
      _d52:    dist52,
      _isAtHigh: isAtHigh,
      _up:     upside,
      _udLabel: udLabel,
      up:      upside !== null ? getUpCategory(upside) : e.up,
    };
  }), [livePrices, liveHistory]);

  const filtered = useMemo(() => {
    type EquityScreenerRow = (typeof equitiesLive)[number];
    type SortValue = string | number | null;

    const sortValue = (row: EquityScreenerRow, column: string): SortValue => {
      switch (column) {
        case "t": return row.t;
        case "e": return row.e;
        case "an": return row.an;
        case "cal": return row.cal;
        case "val": return row.val;
        case "p": return row.p;
        case "_1d": return row._1d;
        case "s1": return row.s1;
        case "m1": return row.m1;
        case "ytd": return row.ytd;
        case "_d52": return row._d52;
        case "_up": return row._up;
        case "fpe": return row.fpe;
        case "rw": return row.rw;
        case "sc": return row.sc;
        case "tg": return row.tg;
        default: return null;
      }
    };

    return equitiesLive.filter(e => {
      if (e.mkt === "ARG" && e.tg === null) return false; // skip placeholders
      if (mktFilter !== "Todos" && e.mkt !== mktFilter) return false;
      if (anFilter !== "Todos" && e.an !== anFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return e.t.toLowerCase().includes(q) || e.e.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const av = sortValue(a, sortCol);
      const bv = sortValue(b, sortCol);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "string" || typeof bv === "string") {
        return String(av).localeCompare(String(bv)) * sortDir;
      }
      return (av > bv ? 1 : -1) * sortDir;
    });
  }, [equitiesLive, mktFilter, anFilter, search, sortCol, sortDir]);

  const sort = (col: string) => {
    if (sortCol === col) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortCol(col); setSortDir(-1); }
  };

  const pctColor = (v: number | null, inverse = false) => {
    if (v === null) return t.mu;
    const pos = inverse ? v < 0 : v > 0;
    return pos ? t.gr : t.rd;
  };

  const fmtPct = (v: number | null) => v === null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

  const ColHeader = ({ col, label, right }: { col: string; label: string; right?: boolean }) => (
    <th onClick={() => sort(col)} style={{ padding: "8px 10px", textAlign: right ? "right" : "left", fontSize: 9, fontWeight: 700, color: sortCol === col ? t.go : t.mu, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `2px solid ${t.brd}`, background: t.alt, position: "sticky", top: 0, zIndex: 5, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}{sortCol === col ? (sortDir === 1 ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Header status */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: liveStatus === "ok" ? t.grBg : t.alt, border: `1px solid ${liveStatus === "ok" ? t.gr + "44" : t.brd}` }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: liveStatus === "ok" ? "#22c55e" : "#94a3b8", boxShadow: liveStatus === "ok" ? "0 0 6px #22c55e" : "none" }} />
          <span style={{ fontFamily: FB, fontSize: 10, color: liveStatus === "ok" ? t.gr : t.mu }}>
            {liveStatus === "ok" ? `${Object.keys(livePrices).length} precios live` : liveStatus === "degraded" ? `${Object.keys(livePrices).length} precios · fuente parcial` : liveStatus === "error" ? "Sin datos live" : "Cargando precios..."}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: histStatus === "ok" ? t.blBg : t.alt, border: `1px solid ${histStatus === "ok" ? t.bl + "44" : t.brd}` }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: histStatus === "ok" ? t.bl : "#94a3b8" }} />
          <span style={{ fontFamily: FB, fontSize: 10, color: histStatus === "ok" ? t.bl : t.mu }}>
            {histStatus === "ok" ? "Hist. cargada" : "Cargando historial..."}
          </span>
        </div>
        <span style={{ marginLeft: "auto", fontFamily: FB, fontSize: 9, color: t.fa }}>
          Fundamentales: snapshot 19 MAR 2026 · Cotizaciones en tiempo real vía Finnhub
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.mu }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticker o empresa..."
            style={{ fontFamily: FB, fontSize: 12, padding: "7px 10px 7px 28px", borderRadius: 10, width: 200, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
        </div>

        {/* Filters */}
        {["Todos","US","ARG","ETF"].map(m => (
          <button key={m} onClick={() => setMkt(m)} style={{ padding: "6px 14px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${mktFilter === m ? t.bl : t.brd}`, background: mktFilter === m ? t.blBg : "transparent", color: mktFilter === m ? t.bl : t.mu }}>{m}</button>
        ))}

        <div style={{ width: 1, height: 20, background: t.brd }} />

        {["Todos","BUY","HOLD"].map(a => (
          <button key={a} onClick={() => setAn(a)} style={{ padding: "6px 14px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${anFilter === a ? t.go : t.brd}`, background: anFilter === a ? t.goBg : "transparent", color: anFilter === a ? t.go : t.mu }}>{a}</button>
        ))}

        {/* View mode */}
        <div style={{ marginLeft: "auto", display: "flex", background: t.alt, borderRadius: 10, padding: 3, border: `1px solid ${t.brd}`, gap: 2 }}>
          <button onClick={() => setView("perf")} style={{ padding: "5px 12px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "none", background: viewMode === "perf" ? t.bl : "transparent", color: viewMode === "perf" ? "#fff" : t.mu, display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={12} /> Rendimiento
          </button>
          <button onClick={() => setView("fund")} style={{ padding: "5px 12px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "none", background: viewMode === "fund" ? t.go : "transparent", color: viewMode === "fund" ? "#fff" : t.mu, display: "flex", alignItems: "center", gap: 4 }}>
            <BarChart3 size={12} /> Fundamentales
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: t.srf, borderRadius: 14, border: `1px solid ${t.brd}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: "72vh", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 12 }}>
            <thead>
              <tr>
                <ColHeader col="t"   label="Ticker" />
                <ColHeader col="e"   label="Empresa" />
                <ColHeader col="p"   label="Precio" right />
                <ColHeader col="_1d" label="1D%" right />

                {viewMode === "perf" && <>
                  <ColHeader col="s1"   label="1 Sem" right />
                  <ColHeader col="m1"   label="1 Mes" right />
                  <ColHeader col="ytd"  label="YTD" right />
                  <ColHeader col="_d52" label="vs 52H" right />
                  <ColHeader col="_up"  label="Potencial" right />
                </>}

                {viewMode === "fund" && <>
                  <ColHeader col="fpe"  label="FwdPE" right />
                  <ColHeader col="rw"   label="ROIC-WACC" right />
                  <ColHeader col="sc"   label="Score" right />
                  <ColHeader col="tg"   label="Target" right />
                  <ColHeader col="_up"  label="Potencial" right />
                  <ColHeader col="an"   label="Rating" />
                  <ColHeader col="cal"  label="Calidad" />
                  <ColHeader col="val"  label="Val." />
                </>}

                <th style={{ padding: "8px 8px", background: t.alt, position: "sticky", top: 0, zIndex: 5, borderBottom: `2px solid ${t.brd}` }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const ud     = e._up;
                const udStr  = ud !== null ? `${ud >= 0 ? "+" : ""}${ud.toFixed(1)}%` : null;

                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.brd}22`, transition: "background .1s" }}
                    onMouseEnter={ev => (ev.currentTarget.style.background = t.alt)}
                    onMouseLeave={ev => (ev.currentTarget.style.background = "transparent")}>

                    <td style={{ padding: "7px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 800, color: e.mkt === "ARG" ? t.go : t.bl }}>{e.t}</span>
                        {livePrices[e.t] && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />}
                      </div>
                      <div style={{ fontFamily: FB, fontSize: 8, color: t.fa }}>{e.mkt}</div>
                    </td>

                    <td style={{ padding: "7px 10px", color: t.tx, fontWeight: 500, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.e}</td>

                    <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: FH, fontSize: 14, fontWeight: 700, color: livePrices[e.t] ? t.tx : t.mu }}>
                      ${e.p.toFixed(2)}
                    </td>

                    <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: 700, color: pctColor(e._1d) }}>
                      {fmtPct(e._1d)}
                    </td>

                    {viewMode === "perf" && <>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: pctColor(e.s1) }}>{fmtPct(e.s1)}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: pctColor(e.m1) }}>{fmtPct(e.m1)}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: pctColor(e.ytd) }}>{fmtPct(e.ytd)}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: pctColor(e._d52) }}>{fmtPct(e._d52)}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right" }}>
                        {udStr ? (
                          <div>
                            <div style={{ fontWeight: 700, color: ud! >= 0 ? t.gr : t.rd }}>{udStr}</div>
                            <div style={{ fontSize: 8, color: t.fa, marginTop: 1 }}>{e._udLabel}</div>
                          </div>
                        ) : <span style={{ color: t.fa }}>—</span>}
                      </td>
                    </>}

                    {viewMode === "fund" && <>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: t.mu }}>{e.fpe ? e.fpe.toFixed(1) + "x" : "—"}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: e.rw ? (e.rw > 0 ? t.gr : t.rd) : t.fa }}>{e.rw ? `${e.rw > 0 ? "+" : ""}${e.rw.toFixed(1)}%` : "—"}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right" }}>
                        {e.sc !== null && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ flex: 1, height: 5, background: t.alt, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${e.sc}%`, height: "100%", background: e.sc >= 70 ? t.gr : e.sc >= 50 ? t.go : t.rd }} />
                            </div>
                            <span style={{ fontFamily: FH, fontSize: 12, fontWeight: 700, color: e.sc >= 70 ? t.gr : e.sc >= 50 ? t.go : t.rd }}>{e.sc}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "7px 10px", textAlign: "right", color: t.mu }}>{e.tg ? `$${e.tg.toFixed(0)}` : "—"}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right" }}>
                        {udStr ? (
                          <div>
                            <div style={{ fontWeight: 700, color: ud! >= 0 ? t.gr : t.rd }}>{udStr}</div>
                            <div style={{ fontSize: 8, color: t.fa }}>{e._udLabel}</div>
                          </div>
                        ) : <span style={{ color: t.fa }}>—</span>}
                      </td>
                      <td style={{ padding: "7px 10px" }}>
                        {e.an && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: e.an === "BUY" ? t.grBg : t.alt, color: e.an === "BUY" ? t.gr : t.mu, border: `1px solid ${e.an === "BUY" ? t.gr + "44" : t.brd}` }}>{e.an}</span>}
                      </td>
                      <td style={{ padding: "7px 10px" }}>
                        {e.cal && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: t.alt, color: ({ EXCELENTE: t.gr, ALTA: t.bl, MEDIA: t.go, BAJA: t.rd } as Record<string, string>)[e.cal] ?? t.mu }}>{e.cal}</span>}
                      </td>
                      <td style={{ padding: "7px 10px" }}>
                        {e.val && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: t.alt, color: ({ BARATA: t.gr, RAZONABLE: t.bl, CARA: t.rd } as Record<string, string>)[e.val] ?? t.mu }}>{e.val}</span>}
                      </td>
                    </>}

                    <td style={{ padding: "7px 8px", textAlign: "right" }}>
                      <a href={tvUrl(e.t)} target="_blank" rel="noreferrer" style={{ width: 26, height: 26, borderRadius: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.alt, border: `1px solid ${t.brd}`, color: t.mu, textDecoration: "none" }}>
                        <BarChart3 size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${t.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
          <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>
            {filtered.length} instrumentos · {Object.keys(livePrices).length} con precio live
          </span>
          <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>
            Cotizaciones: Finnhub · Refresh 90s · Click en columnas para ordenar
          </span>
        </div>
      </div>
    </div>
  );
}
