"use client";

/**
 * components/renta-variable/cedears-panel.tsx
 * Panel CEDEARs: Grid / Mapa de calor / Tabla — precios en ARS via proxy
 */

import { useState, useEffect } from "react";
import { Search, LineChart } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";

interface Cedear {
  t: string;  // ticker
  n: string;  // nombre
  s: string;  // sector
}

export const CEDEARS_LIST: Cedear[] = [
  // ── TECH ──
  {t:"AAPL",n:"Apple Inc.",s:"Tech"},{t:"MSFT",n:"Microsoft",s:"Tech"},
  {t:"GOOGL",n:"Alphabet",s:"Tech"},{t:"AMZN",n:"Amazon",s:"Tech"},
  {t:"META",n:"Meta Platforms",s:"Tech"},{t:"NVDA",n:"NVIDIA",s:"Tech"},
  {t:"TSLA",n:"Tesla",s:"Autos"},{t:"NFLX",n:"Netflix",s:"Media"},
  {t:"AMD",n:"AMD",s:"Semis"},{t:"INTC",n:"Intel",s:"Semis"},
  {t:"AVGO",n:"Broadcom",s:"Semis"},{t:"ORCL",n:"Oracle",s:"Tech"},
  {t:"ADBE",n:"Adobe",s:"Tech"},{t:"CRM",n:"Salesforce",s:"Tech"},
  {t:"QCOM",n:"Qualcomm",s:"Semis"},{t:"CRWD",n:"CrowdStrike",s:"Tech"},
  {t:"PANW",n:"Palo Alto Networks",s:"Tech"},{t:"NET",n:"Cloudflare",s:"Tech"},
  {t:"SNOW",n:"Snowflake",s:"Tech"},{t:"NOW",n:"ServiceNow",s:"Tech"},
  {t:"DDOG",n:"Datadog",s:"Tech"},{t:"SHOP",n:"Shopify",s:"Tech"},
  {t:"ARM",n:"ARM Holdings",s:"Semis"},{t:"ASML",n:"ASML Holding",s:"Semis"},
  // ── FINANCIERO ──
  {t:"JPM",n:"JPMorgan Chase",s:"Financiero"},{t:"BAC",n:"Bank of America",s:"Financiero"},
  {t:"GS",n:"Goldman Sachs",s:"Financiero"},{t:"V",n:"Visa",s:"Financiero"},
  {t:"MA",n:"Mastercard",s:"Financiero"},{t:"BX",n:"Blackstone",s:"Financiero"},
  {t:"KKR",n:"KKR & Co.",s:"Financiero"},{t:"SCHW",n:"Charles Schwab",s:"Financiero"},
  {t:"SPGI",n:"S&P Global",s:"Financiero"},{t:"C",n:"Citigroup",s:"Financiero"},
  {t:"MS",n:"Morgan Stanley",s:"Financiero"},
  // ── ENERGÍA ──
  {t:"XOM",n:"ExxonMobil",s:"Energía"},{t:"CVX",n:"Chevron",s:"Energía"},
  {t:"COP",n:"ConocoPhillips",s:"Energía"},{t:"EOG",n:"EOG Resources",s:"Energía"},
  {t:"OXY",n:"Occidental",s:"Energía"},{t:"SLB",n:"Schlumberger",s:"Energía"},
  {t:"HAL",n:"Halliburton",s:"Energía"},{t:"DVN",n:"Devon Energy",s:"Energía"},
  {t:"PBR",n:"Petrobras",s:"Energía"},{t:"EC",n:"Ecopetrol",s:"Energía"},
  // ── CONSUMO ──
  {t:"KO",n:"Coca-Cola",s:"Consumo"},{t:"PEP",n:"PepsiCo",s:"Consumo"},
  {t:"MCD",n:"McDonald's",s:"Consumo"},{t:"WMT",n:"Walmart",s:"Consumo"},
  {t:"NKE",n:"Nike",s:"Consumo"},{t:"SBUX",n:"Starbucks",s:"Consumo"},
  {t:"COST",n:"Costco",s:"Consumo"},{t:"TGT",n:"Target",s:"Consumo"},
  {t:"CMG",n:"Chipotle",s:"Consumo"},{t:"LOW",n:"Lowe's",s:"Consumo"},
  // ── SALUD ──
  {t:"JNJ",n:"Johnson & Johnson",s:"Salud"},{t:"PFE",n:"Pfizer",s:"Salud"},
  {t:"ABBV",n:"AbbVie",s:"Salud"},{t:"UNH",n:"UnitedHealth",s:"Salud"},
  {t:"LLY",n:"Eli Lilly",s:"Salud"},{t:"ABT",n:"Abbott Labs",s:"Salud"},
  {t:"MRK",n:"Merck",s:"Salud"},{t:"BMY",n:"Bristol-Myers",s:"Salud"},
  // ── DEFENSA ──
  {t:"LMT",n:"Lockheed Martin",s:"Defensa"},{t:"NOC",n:"Northrop Grumman",s:"Defensa"},
  {t:"GD",n:"General Dynamics",s:"Defensa"},{t:"RTX",n:"RTX Corp.",s:"Defensa"},
  // ── INDUSTRIAL ──
  {t:"HON",n:"Honeywell",s:"Industrial"},{t:"BA",n:"Boeing",s:"Industrial"},
  {t:"DE",n:"John Deere",s:"Industrial"},{t:"CAT",n:"Caterpillar",s:"Industrial"},
  // ── UTILITIES ──
  {t:"NEE",n:"NextEra Energy",s:"Utilities"},{t:"SO",n:"Southern Co.",s:"Utilities"},
  // ── TELECOM ──
  {t:"T",n:"AT&T",s:"Telecom"},{t:"VZ",n:"Verizon",s:"Telecom"},
  {t:"CMCSA",n:"Comcast",s:"Telecom"},
  // ── LATAM ──
  {t:"MELI",n:"MercadoLibre",s:"Tech"},{t:"BABA",n:"Alibaba",s:"Tech"},
  {t:"NIO",n:"NIO Inc.",s:"Autos"},{t:"VALE",n:"Vale S.A.",s:"Materiales"},
  {t:"BRFS",n:"BRF S.A.",s:"Consumo"},{t:"TX",n:"Ternium",s:"Industrial"},
  {t:"GLOB",n:"Globant",s:"Tech"},
  // ── CRIPTO/ALTERNATIVO ──
  {t:"COIN",n:"Coinbase",s:"Cripto"},{t:"MSTR",n:"MicroStrategy",s:"Cripto"},
  {t:"PLTR",n:"Palantir",s:"Tech"},{t:"HOOD",n:"Robinhood",s:"Financiero"},
  // ── ETFs ──
  {t:"SPY",n:"S&P 500 ETF",s:"ETF"},{t:"QQQ",n:"Nasdaq 100 ETF",s:"ETF"},
  {t:"DIA",n:"Dow Jones ETF",s:"ETF"},{t:"XLE",n:"Energy SPDR",s:"ETF"},
  {t:"GLD",n:"Gold ETF",s:"ETF"},{t:"EWZ",n:"Brasil ETF",s:"ETF"},
  {t:"IVV",n:"iShares S&P 500",s:"ETF"},{t:"TLT",n:"20Y Treasury ETF",s:"ETF"},
  {t:"ILF",n:"LatAm 40 ETF",s:"ETF"},{t:"XLI",n:"Industrial SPDR",s:"ETF"},
  {t:"ARKK",n:"ARK Innovation",s:"ETF"},
];

interface LiveEntry { price: number; pct: number; vol?: number; }
type CedearsResponse = {
  map?: Record<string, LiveEntry>;
  _meta?: { status?: "ok" | "partial" | "empty" | "error" };
};

const SEC_COLOR: Record<string, string> = {
  Tech:"#3b82f6",Semis:"#8b5cf6",Energía:"#f59e0b",Financiero:"#22c55e",
  Salud:"#ef4444",Consumo:"#f97316",Industrial:"#6366f1",ETF:"#0ea5e9",
  Autos:"#a78bfa",Media:"#ec4899",Defensa:"#dc2626",Materiales:"#84cc16",
  Utilities:"#14b8a6",Telecom:"#64748b",Cripto:"#f59e0b",
};

function heatColor(pct: number | null): string {
  if (pct === null) return "#e2e8f022";
  if (pct >= 3)    return "#14532d";
  if (pct >= 2)    return "#166534";
  if (pct >= 1)    return "#15803d";
  if (pct >= 0.5)  return "#22c55e33";
  if (pct >= 0)    return "#22c55e18";
  if (pct >= -0.5) return "#fca5a533";
  if (pct >= -1)   return "#ef4444";
  if (pct >= -2)   return "#dc2626";
  return "#991b1b";
}

function heatText(pct: number | null): string {
  if (pct === null) return "#94a3b8";
  if (pct >= 0.5)   return "#fff";
  if (pct >= 0)     return "#22c55e";
  if (pct <= -0.5)  return "#fff";
  return "#ef4444";
}

function secEmoji(s: string): string {
  return ({"Tech":"💻","Semis":"🔬","Energía":"⚡","Financiero":"🏦","Salud":"⚕️",
    "Defensa":"🛡️","ETF":"📊","Consumo":"🛒","Industrial":"⚙️","Cripto":"₿",
    "Utilities":"🔌","Telecom":"📡","Media":"🎬","Autos":"🚗","Materiales":"⛏️"})[s] ?? "📈";
}

export function CEDEARsPanel() {
  const t = useAppTheme();
  const [prices,  setPrices]  = useState<Record<string, LiveEntry>>({});
  const [status,  setStatus]  = useState("loading");
  const [lastUpd, setLastUpd] = useState<Date | null>(null);
  const [search,  setSearch]  = useState("");
  const [sector,  setSector]  = useState("Todos");
  const [view,    setView]    = useState<"grid"|"heat"|"table">("grid");
  const [sortBy,  setSortBy]  = useState<"pct"|"price"|"t">("pct");

  useEffect(() => {
    const load = async () => {
      try {
        const r    = await fetch("/api/cedears");
        const json = await r.json() as CedearsResponse;
        setPrices(json.map || {});
        setLastUpd(new Date());
        const count = Object.keys(json.map || {}).length;
        setStatus(r.ok && count > 0 && json._meta?.status !== "error" ? "ok" : count > 0 ? "degraded" : "empty");
      } catch { setStatus("error"); }
    };
    load();
    const id = setInterval(load, 120000);
    return () => clearInterval(id);
  }, []);

  const sectors = ["Todos", ...Array.from(new Set(CEDEARS_LIST.map(c => c.s))).sort()];

  const enriched = CEDEARS_LIST.map(c => {
    const live = prices[c.t] || prices[c.t + "D"] || prices[c.t.toUpperCase()] || null;
    return { ...c, price: live?.price ?? null, pct: live?.pct ?? null, hasLive: !!live };
  });

  const filtered = enriched
    .filter(c => {
      if (sector !== "Todos" && c.s !== sector) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return c.t.toLowerCase().includes(q) || c.n.toLowerCase().includes(q) || c.s.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "pct") {
        if (a.pct === null && b.pct === null) return a.t.localeCompare(b.t);
        if (a.pct === null) return 1; if (b.pct === null) return -1;
        return b.pct - a.pct;
      }
      if (sortBy === "price") {
        if (!a.price && !b.price) return 0;
        if (!a.price) return 1; if (!b.price) return -1;
        return b.price - a.price;
      }
      return a.t.localeCompare(b.t);
    });

  const liveCount   = enriched.filter(c => c.hasLive).length;
  const withPct     = filtered.filter(c => c.pct !== null) as Array<typeof filtered[0] & { pct: number }>;
  const topGainers  = [...withPct].sort((a, b) => b.pct - a.pct).slice(0, 3);
  const topLosers   = [...withPct].sort((a, b) => a.pct - b.pct).slice(0, 3);
  const maxAbsPct   = Math.max(...withPct.map(c => Math.abs(c.pct)), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0a1628,#0d2137,#0a1628)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, border: "1px solid rgba(255,255,255,.06)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,.12),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 6 }}>BYMA · CERTIFICADOS DE DEPÓSITO ARGENTINO</div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, fontWeight: 800, color: "#fff", margin: 0 }}>
              CEDEARs <span style={{ color: "#0ea5e9" }}>Market</span>
            </h2>
            <p style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,.4)", margin: "8px 0 0" }}>{CEDEARS_LIST.length} activos · Precios en ARS · Ajustados por CCL</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", borderRadius: 10, padding: "8px 16px", border: "1px solid rgba(255,255,255,.08)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: status === "ok" ? "#22c55e" : "#f59e0b", boxShadow: status === "ok" ? "0 0 8px #22c55e" : "none" }} />
              <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)" }}>
                {status === "ok" ? `${liveCount} precios en vivo` : status === "degraded" ? `${liveCount} precios · fuente degradada` : status === "error" ? "API offline" : "Conectando..."}
              </span>
            </div>
            {lastUpd && <span style={{ fontFamily: FB, fontSize: 9, color: "rgba(255,255,255,.3)" }}>Act. {lastUpd.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
        </div>
        {/* Movers */}
        {(topGainers.length > 0 || topLosers.length > 0) && (
          <div style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: FB, fontSize: 9, color: "rgba(255,255,255,.3)", marginRight: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>HOY</span>
            {topGainers.map((c, i) => (
              <div key={i} style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.25)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#4ade80" }}>{c.t}</span>
                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: "#22c55e" }}>+{c.pct!.toFixed(2)}%</span>
              </div>
            ))}
            <span style={{ color: "rgba(255,255,255,.15)", fontSize: 12 }}>|</span>
            {topLosers.map((c, i) => (
              <div key={i} style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#f87171" }}>{c.t}</span>
                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: "#ef4444" }}>{c.pct!.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: t.mu }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticker, empresa..."
            style={{ fontFamily: FB, fontSize: 12, padding: "9px 12px 9px 32px", borderRadius: 12, width: 220, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
        </div>

        <div style={{ display: "flex", background: t.alt, borderRadius: 10, padding: 3, border: `1px solid ${t.brd}`, gap: 2 }}>
          {([["grid","▦ Grid"],["heat","⬛ Mapa"],["table","≡ Tabla"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{ padding: "5px 13px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "none", background: view === id ? t.bl : "transparent", color: view === id ? "#fff" : t.mu }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", background: t.alt, borderRadius: 10, padding: 3, border: `1px solid ${t.brd}`, gap: 2 }}>
          {([["pct","% Var."],["price","Precio"],["t","A–Z"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setSortBy(id)} style={{ padding: "5px 13px", borderRadius: 8, fontFamily: FB, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "none", background: sortBy === id ? t.go : "transparent", color: sortBy === id ? "#fff" : t.mu }}>{label}</button>
          ))}
        </div>

        <span style={{ marginLeft: "auto", fontFamily: FB, fontSize: 10, color: t.fa }}>{filtered.filter(c => c.hasLive).length} live / {filtered.length}</span>
      </div>

      {/* Sector pills */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20, flexWrap: "wrap" }}>
        {sectors.map(s => {
          const sc = SEC_COLOR[s] ?? t.mu;
          const isActive = sector === s;
          const count = s === "Todos" ? CEDEARS_LIST.length : CEDEARS_LIST.filter(c => c.s === s).length;
          return (
            <button key={s} onClick={() => setSector(s)} style={{ padding: "6px 14px", borderRadius: 20, fontFamily: FB, fontSize: 10, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${isActive ? sc : t.brd}`, background: isActive ? sc : "transparent", color: isActive ? "#fff" : (s === "Todos" ? t.mu : sc), transition: "all .18s", display: "flex", alignItems: "center", gap: 5 }}>
              {s !== "Todos" && <span style={{ fontSize: 11 }}>{secEmoji(s)}</span>}
              {s} <span style={{ opacity: .65, fontSize: 8 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
          {filtered.map((c, i) => {
            const sc = SEC_COLOR[c.s] ?? t.mu;
            const isUp = c.pct !== null && c.pct >= 0;
            const pctColor = c.pct === null ? t.mu : c.pct >= 0 ? t.gr : t.rd;
            return (
              <div key={i} style={{ background: t.srf, border: `1px solid ${t.brd}`, borderTop: `3px solid ${sc}`, borderRadius: 14, padding: "16px 16px 13px", cursor: "pointer", transition: "all .18s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${sc}22`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", right: -6, bottom: -14, fontSize: 56, opacity: .04, pointerEvents: "none", userSelect: "none" }}>{secEmoji(c.s)}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: sc, background: sc + "15", padding: "3px 8px", borderRadius: 6, border: `1px solid ${sc}30` }}>{c.t}</div>
                  <span style={{ fontFamily: FB, fontSize: 8, fontWeight: 700, color: sc, background: sc + "18", padding: "2px 7px", borderRadius: 10 }}>{c.s}</span>
                </div>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.tx, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</div>
                {c.hasLive ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 700, color: t.tx, lineHeight: 1 }}>${c.price!.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</div>
                      <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: pctColor }}>{isUp ? "+" : ""}{c.pct!.toFixed(2)}%</div>
                    </div>
                    <div style={{ height: 4, background: t.alt, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${50 + c.pct! / maxAbsPct * 50}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${isUp?t.gr:t.rd}66,${isUp?t.gr:t.rd})`, transition: "width .6s" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 5px #22c55e" }} />
                      <span style={{ fontFamily: FB, fontSize: 8, color: t.fa }}>EN VIVO</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: FB, fontSize: 10, color: t.fa, padding: "8px 0", borderTop: `1px solid ${t.brd}44`, fontStyle: "italic" }}>Sin precio disponible</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* HEAT MAP */}
      {view === "heat" && (
        <div>
          <div style={{ fontFamily: FB, fontSize: 10, color: t.mu, marginBottom: 14 }}>Verde oscuro = mayor suba · Rojo oscuro = mayor baja · Gris = sin precio</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(82px, 1fr))", gap: 4 }}>
            {filtered.map((c, i) => (
              <button key={i} style={{ background: heatColor(c.pct), borderRadius: 8, padding: "10px 8px 8px", border: "1px solid rgba(0,0,0,.08)", cursor: "pointer", textAlign: "center", transition: "transform .12s" }}
                title={`${c.n} · ${c.pct !== null ? (c.pct >= 0 ? "+" : "") + c.pct.toFixed(2) + "%" : "sin dato"}`}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 800, color: heatText(c.pct), marginBottom: 2 }}>{c.t}</div>
                {c.pct !== null
                  ? <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: heatText(c.pct) }}>{c.pct >= 0 ? "+" : ""}{c.pct.toFixed(1)}%</div>
                  : <div style={{ fontFamily: FB, fontSize: 8, color: "rgba(128,128,128,.5)" }}>—</div>}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
            <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>Escala:</span>
            {[["#14532d",">3%"],["#22c55e33","0-3%"],["#fca5a533","-3-0%"],["#991b1b","<-3%"]].map(([bg, label], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: "1px solid rgba(0,0,0,.1)" }} />
                <span style={{ fontFamily: FB, fontSize: 8, color: t.mu }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <div style={{ background: t.srf, borderRadius: 12, border: `1px solid ${t.brd}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", maxHeight: "65vh", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
              <thead>
                <tr>
                  {["Ticker","Empresa","Sector","Precio ARS","Var. %",""].map((h, i) => (
                    <th key={i} style={{ padding: "10px 12px", textAlign: i > 2 ? "right" : "left", fontSize: 9, fontWeight: 700, color: t.mu, letterSpacing: ".06em", borderBottom: `2px solid ${t.brd}`, whiteSpace: "nowrap", position: "sticky", top: 0, zIndex: 2, background: t.alt }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const sc = SEC_COLOR[c.s] ?? t.mu;
                  const isUp = c.pct !== null && c.pct >= 0;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.brd}22` }}>
                      <td style={{ padding: "8px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, background: sc + "15", color: sc, padding: "2px 7px", borderRadius: 5, border: `1px solid ${sc}30` }}>{c.t}</span>
                          {c.hasLive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", color: t.tx, fontWeight: 500, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: sc + "18", color: sc }}>{c.s}</span>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: c.hasLive ? t.tx : t.fa }}>
                        {c.price ? `$${c.price.toLocaleString("es-AR", { maximumFractionDigits: 0 })}` : "—"}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>
                        {c.pct !== null
                          ? <span style={{ fontWeight: 700, fontSize: 12, color: isUp ? t.gr : t.rd }}>{isUp ? "+" : ""}{c.pct.toFixed(2)}%</span>
                          : <span style={{ color: t.fa }}>—</span>}
                      </td>
                      <td style={{ padding: "8px 8px", textAlign: "right" }}>
                        <button style={{ width: 28, height: 28, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.alt, border: `1px solid ${t.brd}`, color: t.mu, cursor: "pointer" }}>
                          <LineChart size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${t.brd}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
            <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>Fuente: DATA912 · BYMA · Refresh 2 min</span>
            <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>{filtered.filter(c => c.hasLive).length} live / {filtered.length} total</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, padding: "12px 16px", background: t.alt, borderRadius: 10, border: `1px solid ${t.brd}` }}>
        <p style={{ fontFamily: FB, fontSize: 9, color: t.fa, margin: 0, lineHeight: 1.7 }}>
          Precios en ARS · Fuente: DATA912 / BYMA · Cada CEDEAR representa una fracción de la acción subyacente según ratio de conversión Banco Comafi ·
          Los rendimientos pasados no garantizan resultados futuros
        </p>
      </div>
    </div>
  );
}
