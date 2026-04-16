"use client";

import { DollarSign, ClipboardList, BarChart3, Search, ChevronRight } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { useClock } from "@/hooks/use-clock";
import { Skeleton } from "@/components/ui/skeleton";
import { SUMMARIES } from "@/lib/data/summaries";
import { NOTICIAS } from "@/lib/data/noticias";
import { LECAP } from "@/lib/data/renta-fija";
import { BREAKING_NEWS } from "@/lib/data/breaking-news";
import { FH, FB, FD } from "@/lib/constants";
import type { DolarData, RiesgoPaisData, LiveMarket } from "@/types";

interface InicioViewProps {
  dolar:      DolarData | null;
  riesgoPais: RiesgoPaisData | null;
  liveMarket: LiveMarket;
  setTab:     (tab: string) => void;
  goResearch: (sub: string) => void;
}

export function InicioView({ dolar, riesgoPais, liveMarket, setTab, goResearch }: InicioViewProps) {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  const clock    = useClock();

  const mep = dolar?.bolsa;
  const rp  = riesgoPais?.valor;
  const latest = SUMMARIES[0];

  const topStk = liveMarket.topArgStock;

  const bestLec = LECAP.filter(l => l.dias <= 180)
    .sort((a, b) => parseFloat(b.rows[0].tna) - parseFloat(a.rows[0].tna))[0];

  const cached = (() => {
    try { return JSON.parse(localStorage.getItem("tbl-live-prices") ?? "{}") as Record<string, { changePct: number; price: number }>; }
    catch { return {}; }
  })();
  const withData = Object.entries(cached)
    .filter(([, v]) => v && typeof v.changePct === "number" && v.price > 0)
    .map(([ticker, v]) => ({ ticker, price: v.price, pct: v.changePct }));
  const sorted = [...withData].sort((a, b) => b.pct - a.pct);
  const topMovers = withData.length >= 6 ? [...sorted.slice(0,3), ...sorted.slice(-3).reverse()] : [];

  return (
    <div className="fade-up" style={{ maxWidth:900, margin:"0 auto" }}>

      {/* ── BREAKING NEWS ── */}
      {BREAKING_NEWS && (
        <div style={{
          background: BREAKING_NEWS.color==="red" ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
            : BREAKING_NEWS.color==="green" ? "linear-gradient(135deg,#14532d,#166534)"
            : "linear-gradient(135deg,#78350f,#92400e)",
          borderRadius:12, padding:"14px 20px", marginBottom:12,
          display:"flex", alignItems:"center", gap:12, cursor:"pointer",
          animation:"pulse 2s ease-in-out infinite",
        }} onClick={() => BREAKING_NEWS?.link ? setTab(BREAKING_NEWS.link.tab) : undefined}>
          <span style={{ fontSize:20, flexShrink:0 }}>{BREAKING_NEWS.icon ?? "🔴"}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".12em", color:"rgba(255,255,255,.5)", textTransform:"uppercase", marginBottom:2 }}>ALERTA · ALTO IMPACTO</div>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.35 }}>{BREAKING_NEWS.text}</div>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,.5)" />
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{
        borderRadius:16, padding: isMobile ? "28px 20px 24px" : "36px 40px 32px",
        background:"linear-gradient(145deg, #0d1117 0%, #1a2744 55%, #0d2137 100%)",
        marginBottom:16, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(176,120,42,.1) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:FD, fontSize:isMobile?32:44, fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:"-.02em", margin:0 }}>
              The Big <span style={{color:"#C4956A"}}>Long</span>
            </h1>
            <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,.4)", marginTop:6, margin:"6px 0 0" }}>
              {clock.date} · Buenos Aires
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => goResearch("resumen")} style={{ background:"rgba(196,149,106,.9)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontFamily:FB, fontWeight:700, fontSize:12, cursor:"pointer" }}>Resumen del día</button>
            <button onClick={() => setTab("mercados")} style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.7)", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, padding:"10px 20px", fontFamily:FB, fontWeight:600, fontSize:12, cursor:"pointer" }}>Cotizaciones</button>
          </div>
        </div>
      </div>

      {/* ── 4 KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          { label:"Dólar MEP",   value:mep ? `$${Math.round(mep.venta).toLocaleString("es-AR")}` : "—",  sub:"tiempo real",     accent:t.bl },
          { label:"Riesgo País", value:rp  ? `${rp.toLocaleString("es-AR")} pb` : "—",                  sub:"EMBI+ JP Morgan", accent:rp?(rp<600?t.gr:t.rd):t.mu, color:rp?(rp<600?t.gr:t.rd):undefined },
          { label: topStk ? topStk.ticker : "Mejor ARG",
            value: topStk ? `$${topStk.price.toFixed(2)}` : "—",
            sub: topStk?.changePct != null ? `${topStk.changePct >= 0 ? "+" : ""}${topStk.changePct.toFixed(2)}% hoy · USD` : "ADR NYSE",
            accent: topStk?.changePct != null && topStk.changePct >= 0 ? t.gr : t.rd },
          { label:"Mejor LECAP", value:bestLec ? bestLec.rows[0].tna : "—", sub:bestLec ? `${bestLec.rows[0].t} · ${bestLec.dias}d` : "", accent:t.go },
        ].map((k, i) => (
          <div key={i} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`3px solid ${k.accent}`, borderRadius:14, padding:isMobile?"14px 12px":"18px 18px" }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>{k.label}</div>
            {k.value === "—"
              ? <Skeleton w={isMobile?80:110} h={isMobile?20:26} style={{marginBottom:4}} />
              : <div style={{ fontFamily:FH, fontSize:isMobile?20:26, fontWeight:700, color: k.color ?? t.tx, lineHeight:1 }}>{k.value}</div>
            }
            {k.sub && <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* ── RESUMEN DEL DÍA ── */}
      {latest && (
        <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderLeft:`4px solid ${t.go}`, borderRadius:16, padding:isMobile?"16px 14px":"22px 26px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:t.go, background:t.goBg, padding:"3px 10px", borderRadius:20 }}>
              ● {latest.date}
            </span>
            <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{latest.label ?? "CIERRE DE MERCADO"}</span>
          </div>

          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
            {latest.kpis?.slice(0,6).map((k, i) => {
              const bcMap: Record<string, string> = {green:t.gr,red:t.rd,blue:t.bl,gold:t.go,gray:t.mu};
              const col  = bcMap[k.bc] ?? t.mu;
              const tabMap: Record<string, string> = {"SPOT ARS/USD":"mercados","RIESGO PAÍS":"mercados","MERVAL USD":"mercados","TASAS TEM":"rentafija","LECAP CORTA":"rentafija","LECAP MAYO":"rentafija"};
              const dest = tabMap[k.k] ?? "mercados";
              return (
                <button key={i} onClick={() => setTab(dest)} style={{ background:t.alt, borderRadius:8, padding:"6px 10px", fontFamily:FB, fontSize:10, display:"flex", flexDirection:"column", gap:2, border:"none", cursor:"pointer", textAlign:"left" }}>
                  <span style={{ fontSize:8, color:t.fa, letterSpacing:".06em", textTransform:"uppercase" }}>{k.k}</span>
                  <span style={{ fontWeight:700, color:t.tx }}>{k.v}</span>
                  {k.b && <span style={{ fontSize:8, fontWeight:600, color:col, background:`${col}15`, padding:"0 5px", borderRadius:4, width:"fit-content" }}>{k.b}</span>}
                </button>
              );
            })}
          </div>

          {latest.cards?.slice(0,2).map((c, i) => (
            <div key={i} style={{ padding:"10px 0", borderTop:`1px solid ${t.brd}33`, cursor:"pointer" }} onClick={() => setTab("mercados")}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:12 }}>{c.icon}</span>
                <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:c.ac, letterSpacing:".08em", textTransform:"uppercase" }}>{c.cat}</span>
              </div>
              <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, marginBottom:4 }}>{c.title}</div>
              {c.note && <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }} dangerouslySetInnerHTML={{__html:c.note.length>180?c.note.slice(0,180)+"...":c.note}} />}
            </div>
          ))}
        </div>
      )}

      {/* ── TOP MOVERS ── */}
      {topMovers.length >= 6 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>ACCIONES DESTACADAS · EN VIVO</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(6,1fr)", gap:8 }}>
            {topMovers.map((m, i) => {
              const col = m.pct >= 0 ? t.gr : t.rd;
              return (
                <button key={i} onClick={() => (window as typeof window & { __goChart?: (t: string) => void }).__goChart?.(m.ticker)} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderLeft:`3px solid ${col}`, borderRadius:12, padding:"12px 14px", textAlign:"left", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:col }}>{m.ticker}</span>
                    <span style={{ fontFamily:FB, fontSize:7, fontWeight:700, color:"#fff", background:col, padding:"1px 5px", borderRadius:5 }}>{i < 3 ? "▲" : "▼"}</span>
                  </div>
                  <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>${m.price.toFixed(2)}</div>
                  <div style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:col }}>{m.pct >= 0 ? "+" : ""}{m.pct.toFixed(2)}%</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── INFORMES ESTRELLA ── */}
      {(() => {
        const stars = NOTICIAS.filter(n => n.estrella);
        if (!stars.length) return null;
        const acMap: Record<string, string> = { blue:t.bl, green:t.gr, gold:t.go, red:t.rd };
        return (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10, marginBottom:16 }}>
            {stars.map((n) => {
              const ac = acMap[n.catColor] ?? t.go;
              return (
                <button key={n.id} onClick={() => goResearch("informes")} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`3px solid ${ac}`, borderRadius:14, padding:"18px 20px", textAlign:"left", cursor:"pointer", transition:"all .18s", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:20 }}>{n.emoji}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:ac, background:`${ac}18`, padding:"2px 8px", borderRadius:10 }}>{n.cat}</span>
                    <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:8, fontWeight:700, color:"#fff", background:t.rd, padding:"2px 7px", borderRadius:8 }}>🔴 INFORME HOY</span>
                  </div>
                  <div style={{ fontFamily:FH, fontSize:isMobile?15:17, fontWeight:700, color:t.tx, lineHeight:1.3 }}>{n.titulo}</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }}>{n.subtitulo}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                    <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:ac }}>Leer informe completo</span>
                    <ChevronRight size={14} color={ac} />
                  </div>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ── QUICK NAV ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:8, marginBottom:16 }}>
        {[
          {label:"Mercados",       tab:"mercados",       Icon:DollarSign,  color:t.bl, desc:"FX · Riesgo País · Noticias"},
          {label:"Renta Fija",     tab:"rentafija",      Icon:ClipboardList,color:t.go, desc:"LECAPs · Soberanos · ONs"},
          {label:"Renta Variable", tab:"rentavariable",  Icon:BarChart3,   color:t.gr, desc:"CEDEARs · Screener"},
          {label:"Research",       tab:"research",       Icon:Search,      color:t.pu, desc:"Resúmenes · Balances · Recos"},
        ].map((n, i) => (
          <button key={i} onClick={() => setTab(n.tab)} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12, padding:"14px 14px", textAlign:"left", cursor:"pointer", transition:"all .15s", display:"flex", flexDirection:"column", gap:6 }}>
            <n.Icon size={18} color={n.color} strokeWidth={1.8} />
            <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx }}>{n.label}</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{n.desc}</div>
          </button>
        ))}
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center" }}>
        Contenido informativo · No constituye asesoramiento de inversión · The Big Long
      </p>
    </div>
  );
}
