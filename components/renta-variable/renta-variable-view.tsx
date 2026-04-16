"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Activity, LineChart, Search } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { FB, FH } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EQUITIES, tvUrl } from "@/lib/data/equities";
import type { ThemeTokens } from "@/types";

interface RentaVariableViewProps {
  initialTicker?: string | null;
  onTickerConsumed?: () => void;
}

const SUBS = [
  { id:"cedears", label:"CEDEARs",              Icon:Globe },
  { id:"charts",  label:"Gráficos",             Icon:Activity },
  { id:"rv",      label:"Análisis de Acciones", Icon:LineChart },
];

const QUICK_TICKERS = ["AAPL","MSFT","NVDA","TSLA","GGAL","YPF","VIST","MELI","SPY","BTC"];

// ─────────────────────────────────────────────
export function RentaVariableView({ initialTicker, onTickerConsumed }: RentaVariableViewProps) {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  const [sub, setSub]             = useState(initialTicker ? "charts" : "cedears");
  const [chartTicker, setChartTicker] = useState(initialTicker || "AAPL");
  const [chartInput,  setChartInput]  = useState(initialTicker || "AAPL");

  useEffect(() => {
    if (initialTicker) {
      setChartTicker(initialTicker);
      setChartInput(initialTicker);
      setSub("charts");
      onTickerConsumed?.();
    }
  }, [initialTicker, onTickerConsumed]);

  const loadChart = (tk: string) => {
    const clean = tk.trim().toUpperCase();
    if (clean) { setChartTicker(clean); setChartInput(clean); }
  };

  const tvTheme = (t.bg === "#FFFFFF" || t.bg === "#F9FAFB") ? "light" : "dark";
  const chartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv_chart&symbol=${chartTicker}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=${tvTheme==="dark"?"1C2030":"f1f3f6"}&studies=MASimple%7C20%7C0&theme=${tvTheme}&style=1&timezone=America%2FArgentina%2FBuenos_Aires&withdateranges=1&showpopupbutton=0&locale=es&allow_symbol_change=1&width=100%25&height=100%25`;

  return (
    <div className="fade-up">
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:400,
            border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.goBg:"transparent",
            color:sub===s.id?t.go:t.mu, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .15s",
          }}>
            <s.Icon size={14} strokeWidth={sub===s.id?2.5:1.5} /> {s.label}
          </button>
        ))}
      </div>

      {/* ── CEDEARs ── */}
      {sub === "cedears" && <CEDEARsPanel />}

      {/* ── Charts ── */}
      {sub === "charts" && (
        <div className="fade-up">
          <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, maxWidth:300 }}>
              <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
              <input
                value={chartInput}
                onChange={e => setChartInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key==="Enter" && loadChart(chartInput)}
                placeholder="Ticker (ej: AAPL, MSFT, GGAL)"
                style={{ width:"100%", padding:"10px 10px 10px 32px", borderRadius:10, fontFamily:"monospace", fontSize:13, fontWeight:700, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}
              />
            </div>
            <button onClick={() => loadChart(chartInput)} style={{ padding:"10px 20px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:700, background:t.go, color:"#fff", border:"none", cursor:"pointer" }}>
              Buscar
            </button>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {QUICK_TICKERS.map(tk => (
                <button key={tk} onClick={() => loadChart(tk)} style={{
                  padding:"4px 10px", borderRadius:6, fontFamily:"monospace", fontSize:10, fontWeight:600,
                  border:`1px solid ${chartTicker===tk?t.go:t.brd}`,
                  background:chartTicker===tk?t.goBg:"transparent",
                  color:chartTicker===tk?t.go:t.mu, cursor:"pointer",
                }}>{tk}</button>
              ))}
            </div>
          </div>
          <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14, overflow:"hidden", height:520 }}>
            <iframe
              key={chartTicker+tvTheme}
              src={chartUrl}
              style={{ width:"100%", height:"100%", border:"none" }}
              title={`Gráfico ${chartTicker}`}
              allow="clipboard-write"
            />
          </div>
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:8, textAlign:"center" }}>
            Gráficos interactivos · Podés agregar indicadores, cambiar temporalidad y hacer zoom ·{" "}
            <a href="https://www.tradingview.com" target="_blank" rel="noreferrer" style={{ color:t.bl, marginLeft:4, textDecoration:"none" }}>Powered by TradingView</a>
          </p>
        </div>
      )}

      {/* ── Equity Screener ── */}
      {sub === "rv" && <EquityScreener />}

      <WhatsAppCTA />
    </div>
  );
}

// ─────────────────────────────────────────────
function CEDEARsPanel() {
  const t = useAppTheme();
  const isMobile = useIsMobile(640);
  const [prices, setPrices] = useState<Record<string, { price: number; changePct: number; volume: number }>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/cedears");
        const data = await r.json() as { map?: Record<string, { price: number; pct: number; vol: number }> };
        if (data.map) {
          const mapped: Record<string, { price: number; changePct: number; volume: number }> = {};
          Object.entries(data.map).forEach(([k, v]) => {
            mapped[k] = { price: v.price, changePct: v.pct, volume: v.vol };
          });
          setPrices(mapped);
          setLastUpdate(new Date());
        }
      } catch {}
      setLoading(false);
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const TOP_CEDEARS = [
    { t:"AAPL",  n:"Apple",           sector:"Tech" },
    { t:"MSFT",  n:"Microsoft",       sector:"Tech" },
    { t:"NVDA",  n:"NVIDIA",          sector:"Tech" },
    { t:"GOOGL", n:"Alphabet",        sector:"Tech" },
    { t:"AMZN",  n:"Amazon",          sector:"Tech" },
    { t:"TSLA",  n:"Tesla",           sector:"Auto" },
    { t:"META",  n:"Meta Platforms",  sector:"Tech" },
    { t:"JPM",   n:"JPMorgan Chase",  sector:"Fin." },
    { t:"MELI",  n:"MercadoLibre",    sector:"Tech" },
    { t:"GGAL",  n:"Grupo Galicia",   sector:"Fin." },
    { t:"YPF",   n:"YPF",             sector:"Ener." },
    { t:"VIST",  n:"Vista Energy",    sector:"Ener." },
    { t:"BBAR",  n:"BBVA Argentina",  sector:"Fin." },
    { t:"BMA",   n:"Banco Macro",     sector:"Fin." },
    { t:"PAMP",  n:"Pampa Energía",   sector:"Ener." },
    { t:"SPY",   n:"S&P 500 ETF",     sector:"ETF" },
    { t:"QQQ",   n:"Nasdaq 100 ETF",  sector:"ETF" },
    { t:"GLD",   n:"Gold ETF",        sector:"ETF" },
  ];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase" }}>
          CEDEARs · TOP HOLDINGS
        </div>
        {lastUpdate && (
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            Últ. actualización: {lastUpdate.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit" })}
          </span>
        )}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(160px,1fr))", gap:8 }}>
        {TOP_CEDEARS.map((c, i) => {
          const live = prices[c.t];
          const pct = live?.changePct;
          const col = pct != null ? (pct >= 0 ? t.gr : t.rd) : t.mu;
          return (
            <div key={i} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12, padding:"12px 14px", cursor:"pointer" }}
              onClick={() => {
                (window as typeof window & { __goChart?: (t: string) => void }).__goChart?.(c.t);
              }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:t.tx }}>{c.t}</span>
                <span style={{ fontFamily:FB, fontSize:8, color:t.fa, background:t.alt, padding:"1px 5px", borderRadius:4 }}>{c.sector}</span>
              </div>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</div>
              {loading ? (
                <div style={{ fontFamily:FB, fontSize:11, color:t.fa }}>cargando…</div>
              ) : live ? (
                <>
                  <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>${live.price.toFixed(2)}</div>
                  <div style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:col }}>{pct!=null?`${pct>=0?"+":""}${pct.toFixed(2)}%`:"—"}</div>
                </>
              ) : (
                <div style={{ fontFamily:FB, fontSize:11, color:t.fa }}>sin datos</div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:12 }}>
        Precios en ARS · DATA912 · Actualización cada 5 min
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
interface LivePrice  { price: number; change: number; changePct: number; high: number; low: number; open: number }
interface LiveHist   { s1: number; m1: number; ytd: number; distHi52: number }
interface EquityLive {
  t: string; e: string; p: number; mkt: string;
  tg: number | null; an: string | null; fpe: number | null;
  rw: number | null; val: string | null; cal: string | null; mom: string;
  sc: number | null; s1: number | null; m1: number | null; ytd: number | null;
  cur?: "ARS";
  _1d: number | null; _d52: number | null; _isAtHigh: boolean;
  _upsideVsTarget: number | null; _upsideVs52H: number | null; _up: number | null;
  up: string | null;
}

const calColor:  Record<string, string> = { EXCELENTE:"green", ALTA:"blue",  MEDIA:"gold", BAJA:"red" };
const valColor:  Record<string, string> = { BARATA:"green",    RAZONABLE:"blue", CARA:"red" };
const momColor:  Record<string, string> = { "MUY FUERTE":"green", FUERTE:"blue", NEUTRO:"gray", "DÉBIL":"red" };

function EquityScreener() {
  const t = useAppTheme();

  const [sortCol,  setSortCol]  = useState<string>("sc");
  const [sortDir,  setSortDir]  = useState<1 | -1>(-1);
  const [fMkt,     setFMkt]     = useState("Todos");
  const [fCal,     setFCal]     = useState("Todas");
  const [fVal,     setFVal]     = useState("Todas");
  const [fMom,     setFMom]     = useState("Todos");
  const [fAn,      setFAn]      = useState("Todos");
  const [search,   setSearch]   = useState("");
  const [viewMode, setViewMode] = useState<"perf"|"fund">("perf");

  const [livePrices,     setLivePrices]     = useState<Record<string, LivePrice>>({});
  const [liveHistory,    setLiveHistory]    = useState<Record<string, LiveHist>>({});
  const [liveStatus,     setLiveStatus]     = useState<"loading"|"ok"|"error">("loading");
  const [histStatus,     setHistStatus]     = useState<"loading"|"ok"|"error">("loading");
  const [quotesComplete, setQuotesComplete] = useState(false);
  const livePricesRef = useRef<Record<string, LivePrice>>({});

  // Load cached prices from localStorage (client-only)
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("tbl-live-prices") || "{}") as Record<string, LivePrice>;
      if (Object.keys(cached).length) setLivePrices(cached);
    } catch {}
  }, []);

  // Phase 1 — batch quotes
  useEffect(() => {
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const run = async () => {
      try {
        const r = await fetch(`/api/batch?symbols=${encodeURIComponent(tickers.join(","))}`);
        const data = await r.json() as { prices?: Record<string, LivePrice> };
        if (cancelled) return;
        const prices = data.prices ?? {};
        if (Object.keys(prices).length > 0) {
          livePricesRef.current = prices;
          setLivePrices(prev => {
            const next = { ...prev, ...prices };
            try { localStorage.setItem("tbl-live-prices", JSON.stringify(next)); } catch {}
            return next;
          });
          setLiveStatus("ok");
        } else {
          setLiveStatus("error");
        }
      } catch { if (!cancelled) setLiveStatus("error"); }
      if (!cancelled) setQuotesComplete(true);
    };
    run();
    const id = setInterval(() => { if (!cancelled) run(); }, 90000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Phase 2 — weekly candles (1S, 1M, YTD, 52H)
  useEffect(() => {
    if (!quotesComplete) return;
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const NOW     = Math.floor(Date.now() / 1000);
    const W52_AGO = NOW - 366 * 86400;
    const JAN1    = 1735689600;
    const M1_AGO  = NOW - 30  * 86400;
    const W1_AGO  = NOW - 7   * 86400;

    const findClose = (times: number[], closes: number[], targetTs: number): number => {
      for (let j = 1; j < times.length; j++) {
        if (times[j] > targetTs) return closes[j - 1];
      }
      return closes[closes.length - 1];
    };

    const BATCH = 10;
    const run = async () => {
      let firstHit = false;
      for (let i = 0; i < tickers.length; i += BATCH) {
        if (cancelled) return;
        const batch = tickers.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(async ticker => {
          try {
            const r = await fetch(`/api/candle?symbol=${ticker}&resolution=W&from=${W52_AGO}&to=${NOW}`);
            const d = await r.json() as { s?: string; c?: number[]; t?: number[] };
            if (d.s === "ok" && d.c && d.c.length > 1 && d.t) {
              const closes = d.c, times = d.t;
              const cur     = livePricesRef.current[ticker]?.price ?? closes[closes.length - 1];
              const hi52    = Math.max(...closes);
              const s1Base  = findClose(times, closes, W1_AGO);
              const m1Base  = findClose(times, closes, M1_AGO);
              const ytdBase = findClose(times, closes, JAN1);
              setLiveHistory(prev => ({
                ...prev,
                [ticker]: {
                  s1:       (cur - s1Base)  / s1Base  * 100,
                  m1:       (cur - m1Base)  / m1Base  * 100,
                  ytd:      (cur - ytdBase) / ytdBase * 100,
                  distHi52: (cur - hi52)    / hi52    * 100,
                }
              }));
              if (!firstHit) { firstHit = true; setHistStatus("ok"); }
            }
          } catch {}
        }));
        if (i + BATCH < tickers.length) await new Promise(r => setTimeout(r, 1200));
      }
      if (!cancelled && !firstHit) setHistStatus("error");
    };
    run();
    return () => { cancelled = true; };
  }, [quotesComplete]);

  const getUpCategory = (uPct: number | null): string | null => {
    if (uPct === null) return null;
    if (uPct > 40) return "MUY ALTO";
    if (uPct > 20) return "ALTO";
    if (uPct > 5)  return "MEDIO";
    return "BAJO";
  };

  const equitiesLive: EquityLive[] = EQUITIES.map(e => {
    const lp   = livePrices[e.t];
    const hist = liveHistory[e.t];
    const price = lp?.price ?? e.p;

    const upsideVsTarget = e.tg ? (e.tg / price - 1) * 100 : null;
    const dist52  = hist?.distHi52 ?? e.ma;
    const isAtHigh = dist52 !== null && dist52 > -8;
    const upsideVs52H = dist52 !== null
      ? (isAtHigh
        ? (e.sc ? -(e.sc > 70 ? 15 : e.sc > 50 ? 10 : 5) : dist52)
        : Math.abs(dist52))
      : null;
    const upside = upsideVsTarget ?? upsideVs52H;

    return {
      t: e.t, e: e.e, mkt: e.mkt, tg: e.tg, an: e.an, fpe: e.fpe,
      rw: e.rw, val: e.val, cal: e.cal, mom: e.mom, sc: e.sc, cur: e.cur,
      p:   price,
      s1:  hist?.s1   ?? e.s1,
      m1:  hist?.m1   ?? e.m1,
      ytd: hist?.ytd  ?? e.ytd,
      _1d:     lp?.changePct ?? null,
      _d52:    dist52,
      _isAtHigh: isAtHigh,
      _upsideVsTarget: upsideVsTarget,
      _upsideVs52H:    upsideVs52H,
      _up:  upside,
      up:   upside !== null ? getUpCategory(upside) : e.up,
    };
  });

  const sort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortCol(col); setSortDir(col === "sc" ? -1 : 1); }
  };

  const filtered = equitiesLive.filter(e => {
    if (fMkt !== "Todos" && e.mkt !== fMkt) return false;
    if (fAn  !== "Todos" && e.an  !== fAn)  return false;
    if (fCal !== "Todas" && e.cal !== fCal) return false;
    if (fVal !== "Todas" && e.val !== fVal) return false;
    if (fMom !== "Todos" && e.mom !== fMom) return false;
    if (search && !e.t.toLowerCase().includes(search.toLowerCase())
               && !e.e.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortCol];
    const bv = (b as unknown as Record<string, unknown>)[sortCol];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string") return (av as string).localeCompare(bv as string) * sortDir;
    return ((av as number) > (bv as number) ? 1 : -1) * sortDir;
  });

  const mktBadge: Record<string, { bg: string; tx: string; label: string }> = {
    ARG: { bg:"#FEF3C7", tx:"#92400E", label:"🇦🇷" },
    US:  { bg:"#DBEAFE", tx:"#1E40AF", label:"🇺🇸" },
    ETF: { bg:"#EDE9FE", tx:"#6D28D9", label:"📦" },
  };

  const perfColor = (v: number | null) => v === null ? t.fa : v >= 0 ? t.gr : t.rd;
  const perfFmt   = (v: number | null) => v === null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

  const Skel = () => (
    <div style={{ width:40, height:9, borderRadius:4, background:t.brd, opacity:0.6, animation:"blink 1.4s ease-in-out infinite" }} />
  );

  const PerfCell = ({ val, loading }: { val: number | null; loading: boolean }) => (
    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
      {loading ? <Skel /> :
        <span style={{ fontSize:12, fontWeight:600, color:perfColor(val) }}>{perfFmt(val)}</span>
      }
    </td>
  );

  const Th = ({ label, col, tip, right, center }: { label: string; col: string; tip?: string; right?: boolean; center?: boolean }) => {
    const active = sortCol === col;
    return (
      <th onClick={() => sort(col)} title={tip} style={{
        padding:"9px 10px", textAlign:center?"center":right?"right":"left",
        fontSize:9, fontWeight:700,
        color: active ? t.go : t.mu,
        letterSpacing:".07em", textTransform:"uppercase",
        borderBottom:`2px solid ${t.brd}`,
        background:t.alt, cursor:"pointer", whiteSpace:"nowrap",
        userSelect:"none", position:"sticky", top:0, zIndex:5,
        transition:"color .15s",
      }}>
        {label}{active ? (sortDir === 1 ? " ↑" : " ↓") : ""}
      </th>
    );
  };

  const Pill = ({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) => (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:20, fontFamily:FB, fontSize:11,
      fontWeight:active?700:400, cursor:"pointer", transition:"all .15s",
      border:`1.5px solid ${active?(color||t.go)+"88":t.brd}`,
      background:active?(color||t.go)+"18":"transparent",
      color:active?(color||t.go):t.mu,
    }}>{label}</button>
  );

  const clearAll = () => { setFMkt("Todos"); setFCal("Todas"); setFVal("Todas"); setFMom("Todos"); setFAn("Todos"); setSearch(""); };
  const hasFilters = fMkt!=="Todos"||fCal!=="Todas"||fVal!=="Todas"||fMom!=="Todos"||fAn!=="Todos"||!!search;

  return (
    <div className="fade-up">

      {/* ── STATUS BAR ── */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <StatusPill
          ok={liveStatus==="ok"} error={liveStatus==="error"} loading={liveStatus==="loading"}
          t={t}
          labelLoading="Cargando precios..."
          labelOk={`Precios en vivo · ${Object.keys(livePrices).length}/${EQUITIES.length} tickers`}
          labelError="Sin conexión · Precios estáticos"
        />
        <StatusPill
          ok={histStatus==="ok"} error={histStatus==="error"} loading={histStatus==="loading"||!quotesComplete}
          t={t} blue
          labelLoading={!quotesComplete ? "Historial: esperando precios..." : `Historial: cargando... ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          labelOk={`1S · 1M · YTD · 52H en vivo · ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          labelError="Historial: usando datos estáticos"
        />
        <div style={{ flex:1, fontFamily:FB, fontSize:10, color:t.fa, textAlign:"right" }}>
          Fundamentales (PE, Score): snapshot 19 MAR 2026 · Cotizaciones en tiempo real vía Finnhub
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu, fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker o empresa..."
              style={{ fontFamily:FB, fontSize:12, padding:"7px 10px 7px 30px", borderRadius:10, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, width:210, outline:"none" }}
            />
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            <Pill label="🇦🇷 ARG" active={fMkt==="ARG"} onClick={()=>setFMkt(fMkt==="ARG"?"Todos":"ARG")} color="#92400E"/>
            <Pill label="🇺🇸 US"  active={fMkt==="US"}  onClick={()=>setFMkt(fMkt==="US" ?"Todos":"US")}  color="#1E40AF"/>
            <Pill label="📦 ETF" active={fMkt==="ETF"} onClick={()=>setFMkt(fMkt==="ETF"?"Todos":"ETF")} color="#6D28D9"/>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
            {([{id:"perf",label:"Performance"},{id:"fund",label:"Fundamentals"}] as const).map(v=>(
              <button key={v.id} onClick={()=>setViewMode(v.id)} style={{
                padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, cursor:"pointer",
                border:`1.5px solid ${viewMode===v.id?t.go:t.brd}`,
                background:viewMode===v.id?t.go+"18":"transparent",
                color:viewMode===v.id?t.go:t.mu, fontWeight:viewMode===v.id?700:400,
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em" }}>CALIDAD:</span>
          {["EXCELENTE","ALTA","MEDIA","BAJA"].map(v=>(
            <Pill key={v} label={v} active={fCal===v} onClick={()=>setFCal(fCal===v?"Todas":v)}
              color={v==="EXCELENTE"?t.gr:v==="ALTA"?t.bl:v==="MEDIA"?t.go:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>VAL:</span>
          {["BARATA","RAZONABLE","CARA"].map(v=>(
            <Pill key={v} label={v} active={fVal===v} onClick={()=>setFVal(fVal===v?"Todas":v)}
              color={v==="BARATA"?t.gr:v==="RAZONABLE"?t.bl:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>ANALISTAS:</span>
          {["BUY","HOLD"].map(v=>(
            <Pill key={v} label={v} active={fAn===v} onClick={()=>setFAn(fAn===v?"Todos":v)}
              color={v==="BUY"?t.gr:t.go}/>
          ))}
          {hasFilters && (
            <button onClick={clearAll} style={{
              marginLeft:4, padding:"5px 12px", borderRadius:20,
              border:`1px solid ${t.brd}`, background:"transparent",
              fontFamily:FB, fontSize:11, color:t.rd, cursor:"pointer",
            }}>✕ Limpiar</button>
          )}
          <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:11, color:t.fa }}>
            {filtered.length} de {EQUITIES.length} instrumentos
          </span>
        </div>
      </div>

      {/* ── TABLA ── */}
      <Card t={t}>
        <div style={{ overflowX:"auto", maxHeight:"72vh", overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
            <thead>
              <tr>
                <Th label="#"        col="_rank"  tip="Ranking" />
                <Th label="Ticker"   col="t"      tip="Símbolo · Empresa · Mercado" />
                <Th label="Precio"   col="p"      tip="Precio en vivo" right />
                <Th label="Hoy"      col="_1d"    tip="Variación del día %" right />
                <Th label="Score"    col="sc"     tip="Score compuesto 0–100" right />

                {viewMode === "perf" ? (<>
                  <Th label="1 Sem"    col="s1"   tip="Retorno última semana" right />
                  <Th label="1 Mes"    col="m1"   tip="Retorno último mes" right />
                  <Th label="YTD"      col="ytd"  tip="Retorno año hasta hoy" right />
                  <Th label="vs 52H"   col="_d52" tip="% vs máximo 52 semanas" right />
                  <Th label="Target"   col="tg"   tip="Precio objetivo" right />
                  <Th label="Potencial" col="_up" tip="Upside al target" right />
                </>) : (<>
                  <Th label="Target"    col="tg"   tip="Precio objetivo consenso" right />
                  <Th label="Potencial" col="_up"  tip="Upside al target" right />
                  <Th label="Fwd P/E"   col="fpe"  tip="Precio / ganancias est. fwd" right />
                  <Th label="ROIC−WACC" col="rw"   tip="Creación de valor económico" right />
                  <Th label="Calidad"   col="cal"  tip="Calidad del negocio" center />
                  <Th label="Valuación" col="val"  tip="Múltiplos vs histórico" center />
                </>)}

                <Th label="Momentum"  col="mom"  tip="Impulso de precio" center />
                <Th label="Analistas" col="an"   tip="Consenso Wall St." center />
                <th style={{ padding:"6px 8px", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, width:36 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const mb      = mktBadge[e.mkt] ?? mktBadge.US;
                const lp      = livePrices[e.t];
                const hasHist = !!liveHistory[e.t];
                const histLoading = !hasHist && quotesComplete && histStatus !== "error";
                const ud      = e._up;
                const udStr   = ud !== null ? `${ud >= 0 ? "+" : ""}${ud.toFixed(1)}%` : null;
                const isAtHigh = e._isAtHigh;
                const udLabel = e._upsideVsTarget !== null ? "vs target" : (isAtHigh ? "correc. est." : "vs máx 52S");

                return (
                  <tr key={e.t}
                    style={{ borderBottom:`1px solid ${t.brd}44`, transition:"background .1s" }}
                    onMouseEnter={ev=>(ev.currentTarget as HTMLTableRowElement).style.background=t.alt}
                    onMouseLeave={ev=>(ev.currentTarget as HTMLTableRowElement).style.background="transparent"}>

                    {/* # */}
                    <td style={{ padding:"7px 8px", fontSize:10, color:t.fa, textAlign:"center", width:30 }}>
                      {e.sc ? i+1 : "—"}
                    </td>

                    {/* Ticker + empresa */}
                    <td style={{ padding:"7px 10px", minWidth:170 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:6, flexShrink:0, background:mb.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                          {mb.label}
                        </div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:t.tx }}>{e.t}</span>
                            {lp && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} title="Precio en vivo"/>}
                          </div>
                          <div style={{ fontSize:10, color:t.mu, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.e}</div>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:t.tx }}>
                        {e.cur==="ARS" ? `$${e.p.toLocaleString("es-AR")}` : `$${e.p.toFixed(2)}`}
                      </div>
                    </td>

                    {/* Hoy 1D% */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e._1d !== null
                        ? <span style={{ fontSize:12, fontWeight:600, color:perfColor(e._1d) }}>{perfFmt(e._1d)}</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Score */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e.sc !== null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
                          <div style={{ width:32, height:4, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                            <div style={{ width:`${e.sc}%`, height:"100%", borderRadius:3,
                              background:e.sc>=70?"#22c55e":e.sc>=40?t.go:"#ef4444" }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:800, color:e.sc>=70?t.gr:e.sc>=40?t.go:t.rd }}>
                            {e.sc.toFixed(1)}
                          </span>
                        </div>
                      ) : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {viewMode === "perf" ? (<>
                      <PerfCell val={e.s1}   loading={histLoading && e.s1===null} />
                      <PerfCell val={e.m1}   loading={histLoading && e.m1===null} />
                      <PerfCell val={e.ytd}  loading={histLoading && e.ytd===null} />
                      <PerfCell val={e._d52} loading={histLoading && e._d52===null} />
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <div>
                            <span style={{ fontSize:12, fontWeight:700, color:ud!==null&&ud>=0?t.gr:t.rd }}>{udStr}</span>
                            <div style={{ fontSize:8, color:t.fa, marginTop:1 }}>{udLabel}</div>
                          </div>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>) : (<>
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <div>
                            <span style={{ fontSize:12, fontWeight:700, color:ud!==null&&ud>=0?t.gr:t.rd }}>{udStr}</span>
                            <div style={{ fontSize:8, color:t.fa, marginTop:1 }}>{udLabel}</div>
                          </div>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.fpe ? <span style={{ color:e.fpe<20?t.gr:e.fpe<35?t.mu:t.rd }}>{e.fpe}</span>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.rw !== null
                          ? <span style={{ fontWeight:600, color:e.rw>=0?t.gr:t.rd }}>{e.rw>=0?"+":""}{e.rw}%</span>
                          : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.cal ? <Badge c={calColor[e.cal]??'gray'} sm t={t}>{e.cal}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.val ? <Badge c={valColor[e.val]??'gray'} sm t={t}>{e.val}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>)}

                    {/* Momentum */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.mom ? <Badge c={momColor[e.mom]??'gray'} sm t={t}>{e.mom}</Badge>
                             : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Analistas */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.an ? <Badge c={e.an==="BUY"?"green":"gold"} sm t={t}>{e.an}</Badge>
                            : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Chart button */}
                    <td style={{ padding:"7px 6px", textAlign:"center" }}>
                      <button
                        onClick={() => (window as typeof window & { __goChart?: (t: string) => void }).__goChart?.(e.t)}
                        title={`Ver gráfico de ${e.t} en TradingView`}
                        style={{ width:26, height:26, borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center",
                          background:t.alt, border:`1px solid ${t.brd}`, color:t.mu, transition:"all .15s", cursor:"pointer" }}
                        onMouseEnter={ev=>{(ev.currentTarget as HTMLButtonElement).style.background=t.goBg;(ev.currentTarget as HTMLButtonElement).style.borderColor=t.go;(ev.currentTarget as HTMLButtonElement).style.color=t.go;}}
                        onMouseLeave={ev=>{(ev.currentTarget as HTMLButtonElement).style.background=t.alt;(ev.currentTarget as HTMLButtonElement).style.borderColor=t.brd;(ev.currentTarget as HTMLButtonElement).style.color=t.mu;}}>
                        <LineChart size={13} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding:"8px 18px", borderTop:`1px solid ${t.brd}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>Precios y datos en vivo · Research Desk</span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            {filtered.length} resultados · Ordenado por {sortCol} {sortDir === 1 ? "↑" : "↓"}
          </span>
        </div>
      </Card>
    </div>
  );
}

// ── Status pill helper ──
function StatusPill({ ok, error, loading, t, blue, labelLoading, labelOk, labelError }: {
  ok: boolean; error: boolean; loading: boolean; t: ThemeTokens; blue?: boolean;
  labelLoading: string; labelOk: string; labelError: string;
}) {
  const dotBg = ok ? "#22c55e" : error ? "#ef4444" : "#94a3b8";
  const borderColor = ok ? (blue ? t.bl+"55" : t.gr+"55") : error ? t.rd+"44" : t.brd;
  const bg  = ok ? (blue ? t.blBg : t.grBg) : error ? t.rdBg : t.alt;
  const col = ok ? (blue ? t.bl : t.gr) : error ? t.rd : t.mu;
  const label = loading ? labelLoading : ok ? labelOk : labelError;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap", border:`1px solid ${borderColor}`, background:bg, color:col }}>
      <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0, background:dotBg,
        boxShadow:ok&&!blue?"0 0 6px #22c55e":"none", animation:loading?"blink 1s infinite":"none" }} />
      {label}
    </div>
  );
}

// ── WhatsApp CTA ──
function WhatsAppCTA() {
  const t = useAppTheme();
  return (
    <div style={{ background:t.goBg, border:`1px solid ${t.go}33`, borderRadius:14, padding:"20px 24px", marginTop:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
      <div>
        <div style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx, marginBottom:4 }}>¿Querés operar CEDEARs?</div>
        <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.5 }}>Consultá estrategias y armado de cartera con cobertura directa en dólares.</div>
      </div>
      <a href="https://wa.me/5491169558833?text=Hola%20Máximo%2C%20me%20interesa%20operar%20CEDEARs" target="_blank" rel="noreferrer"
        style={{ background:t.go, color:"#fff", borderRadius:10, padding:"10px 20px", fontFamily:FB, fontWeight:700, fontSize:12, textDecoration:"none", whiteSpace:"nowrap" }}>
        WhatsApp →
      </a>
    </div>
  );
}

// Export tvUrl for external use
export { tvUrl };
