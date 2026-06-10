"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, DollarSign, ClipboardList, BarChart3, Search, ChevronRight, ShieldCheck } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { useClock } from "@/hooks/use-clock";
import { Skeleton } from "@/components/ui/skeleton";
import { LECAP } from "@/lib/data/renta-fija";
import { useLiveNews } from "@/hooks/use-live-news";
import { useCuratedReports } from "@/hooks/use-curated-reports";
import { FH, FB, FD } from "@/lib/constants";
import type { DolarData, RiesgoPaisData, LiveMarket } from "@/types";
import { WhatsAppCTA } from "@/components/inicio/whatsapp-cta";

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
  const { breakingNews } = useLiveNews();
  const { reports, status: reportsStatus } = useCuratedReports({ featured: true, limit: 2 });
  const [mounted, setMounted] = useState(false);
  const [topMovers, setTopMovers] = useState<Array<{ ticker: string; price: number; pct: number }>>([]);

  const mep = dolar?.bolsa;
  const rp  = riesgoPais?.valor;

  const topStk = liveMarket.topArgStock;

  // Best LECAP: static sort by TNA, only active (non-expired) instruments
  const bestLec = LECAP
    .filter(l => {
      if (!l.vto) return false;
      const [d,m,y] = l.vto.split('/').map(Number);
      return new Date(y, m-1, d) >= new Date();
    })
    .sort((a, b) => {
      const aTNA = parseFloat(a.rows[0].tna.replace('%','').replace(',','.'));
      const bTNA = parseFloat(b.rows[0].tna.replace('%','').replace(',','.'));
      return bTNA - aTNA;
    })[0];

  useEffect(() => {
    setMounted(true);
    try {
      const cached = JSON.parse(localStorage.getItem("tbl-live-prices") ?? "{}") as Record<string, { changePct: number; price: number }>;
      const withData = Object.entries(cached)
        .filter(([, v]) => v && typeof v.changePct === "number" && v.price > 0)
        .map(([ticker, v]) => ({ ticker, price: v.price, pct: v.changePct }));
      const sorted = [...withData].sort((a, b) => b.pct - a.pct);
      setTopMovers(withData.length >= 6 ? [...sorted.slice(0,3), ...sorted.slice(-3).reverse()] : []);
    } catch {
      setTopMovers([]);
    }
  }, []);

  return (
    <div className="fade-up" style={{ maxWidth:1120, margin:"0 auto" }}>

      {/* ── BREAKING NEWS ── */}
      {breakingNews && (
        <button
          type="button"
          aria-label={breakingNews.link ? `Abrir noticia destacada: ${breakingNews.text}` : breakingNews.text}
          style={{
          background: breakingNews.color==="red" ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
            : breakingNews.color==="green" ? "linear-gradient(135deg,#14532d,#166534)"
            : "linear-gradient(135deg,#78350f,#92400e)",
          borderRadius:8, padding:"12px 16px", marginBottom:16,
          display:"flex", alignItems:"center", gap:12, cursor:"pointer",
          border:"1px solid rgba(255,255,255,.08)",
          width:"100%", textAlign:"left",
        }} onClick={() => breakingNews?.link ? setTab(breakingNews.link.tab) : undefined}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,.65)", flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".12em", color:"rgba(255,255,255,.5)", textTransform:"uppercase", marginBottom:2 }}>ALERTA · ALTO IMPACTO</div>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.35 }}>{breakingNews.text}</div>
            {(breakingNews.fuente || breakingNews.publishedLabel) && (
              <div style={{ fontFamily:FB, fontSize:10, color:"rgba(255,255,255,.62)", marginTop:6 }}>
                {[breakingNews.fuente, breakingNews.publishedLabel].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,.5)" />
        </button>
      )}

      {/* ── HERO ── */}
      <div style={{
        borderRadius:8, padding: isMobile ? "22px 18px 20px" : "30px 32px 28px",
        background:`linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.015)), ${t.srf}`,
        border:`1px solid ${t.brd}`,
        boxShadow:t.sh,
        marginBottom:14, position:"relative", overflow:"hidden",
      }}>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1.25fr .75fr", gap:isMobile?20:28, alignItems:"end" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:t.go, background:t.goBg, border:`1px solid ${t.go}2f`, borderRadius:6, padding:"5px 9px", marginBottom:14 }}>
              <ShieldCheck size={14} strokeWidth={1.8} />
              <span style={{ fontFamily:FB, fontSize:9, fontWeight:750, letterSpacing:".12em", textTransform:"uppercase" }}>Investment advisory platform</span>
            </div>
            <h1 style={{ fontFamily:FD, fontSize:isMobile?34:54, fontWeight:800, color:t.tx, lineHeight:.96, letterSpacing:"0", margin:0 }}>
              The Big <span style={{color:t.go}}>Long</span>
            </h1>
            <p style={{ fontFamily:FB, fontSize:isMobile?12:13, color:t.mu, marginTop:10, margin:"10px 0 0", maxWidth:560, lineHeight:1.65 }}>
              Long-term wealth creation, portfolio construction and capital preservation. {clock.date} · Buenos Aires.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:8, justifySelf:isMobile?"stretch":"end", minWidth:isMobile?0:280 }}>
            <button onClick={() => goResearch("resumen")} style={{ background:t.go, color:"#090D14", border:`1px solid ${t.go}`, borderRadius:6, padding:"11px 16px", fontFamily:FB, fontWeight:750, fontSize:12, cursor:"pointer", textAlign:"center" }}>Ver resumen del día</button>
            <button onClick={() => setTab("mercados")} style={{ background:t.alt, color:t.tx, border:`1px solid ${t.brd}`, borderRadius:6, padding:"11px 16px", fontFamily:FB, fontWeight:650, fontSize:12, cursor:"pointer", textAlign:"center" }}>Monitorear mercados</button>
          </div>
        </div>
      </div>

      {/* ── 4 KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {[
          { label:"Dólar MEP",   value:mep ? `$${Math.round(mep.venta).toLocaleString("es-AR")}` : "—",  sub:"tiempo real",     accent:t.bl },
          { label:"Riesgo País", value:rp  ? `${rp.toLocaleString("es-AR")} pb` : "—",                  sub:"EMBI+ JP Morgan", accent:rp?(rp<600?t.gr:t.rd):t.mu, color:rp?(rp<600?t.gr:t.rd):undefined },
          { label: topStk ? topStk.ticker : "Mejor ARG",
            value: topStk ? `$${topStk.price.toFixed(2)}` : "—",
            sub: topStk?.changePct != null ? `${topStk.changePct >= 0 ? "+" : ""}${topStk.changePct.toFixed(2)}% hoy · USD` : "ADR NYSE",
            accent: topStk?.changePct != null && topStk.changePct >= 0 ? t.gr : t.rd },
          { label:"Mejor LECAP", value:bestLec ? bestLec.rows[0].tna : "—", sub:bestLec ? `${bestLec.rows[0].t} · ${bestLec.vto}` : "", accent:t.go },
        ].map((k, i) => (
          <div key={i} className="premium-hover" style={{ background:`linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01)), ${t.srf}`, border:`1px solid ${t.brd}`, borderTop:`2px solid ${k.accent}`, borderRadius:8, padding:isMobile?"14px 12px":"18px 18px" }}>
            <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".12em", textTransform:"uppercase", marginBottom:8 }}>{k.label}</div>
            {k.value === "—"
              ? <Skeleton w={isMobile?80:110} h={isMobile?20:26} style={{marginBottom:4}} />
              : <div style={{ fontFamily:FH, fontSize:isMobile?22:30, fontWeight:750, color: k.color ?? t.tx, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{k.value}</div>
            }
            {k.sub && <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* ── INTELIGENCIA DIARIA ── */}
      <div style={{ marginBottom:18 }}>
        <WhatsAppCTA />
      </div>

      {/* ── TOP MOVERS ── */}
      {mounted && topMovers.length >= 6 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".12em", textTransform:"uppercase", marginBottom:8 }}>ACCIONES DESTACADAS · EN VIVO</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(6,1fr)", gap:8 }}>
            {topMovers.map((m, i) => {
              const col = m.pct >= 0 ? t.gr : t.rd;
              return (
                <button key={i} onClick={() => (window as typeof window & { __goChart?: (t: string) => void }).__goChart?.(m.ticker)} className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderLeft:`2px solid ${col}`, borderRadius:8, padding:"12px 14px", textAlign:"left", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:col }}>{m.ticker}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:col }}>{i < 3 ? "▲" : "▼"}</span>
                  </div>
                  <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx, fontVariantNumeric:"tabular-nums" }}>${m.price.toFixed(2)}</div>
                  <div style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:col }}>{m.pct >= 0 ? "+" : ""}{m.pct.toFixed(2)}%</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REPORTES CURADOS ── */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:8 }}>
          <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".12em", textTransform:"uppercase" }}>
            REPORTES CURADOS · 48H
          </div>
          <button onClick={() => goResearch("reports")} style={{ background:"transparent", border:"none", color:t.go, fontFamily:FB, fontSize:10, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            Ver biblioteca <ChevronRight size={13} />
          </button>
        </div>

        {reportsStatus === "loading" && (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
            <Skeleton w="100%" h={146} />
            <Skeleton w="100%" h={146} />
          </div>
        )}

        {reportsStatus !== "loading" && reports.length === 0 && (
          <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:8, padding:"18px 20px", fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
            La curación de reportes está temporalmente sin piezas disponibles. Volvé a revisar en la próxima actualización editorial.
          </div>
        )}

        {reports.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
            {reports.slice(0,2).map((report) => (
              <a key={report.id} href={report.reportUrl} target="_blank" rel="noreferrer" className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`2px solid ${t.go}`, borderRadius:8, padding:"18px 20px", textAlign:"left", transition:"all .18s", display:"flex", flexDirection:"column", gap:10, textDecoration:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:t.go, background:t.goBg, padding:"2px 8px", borderRadius:10 }}>{report.source}</span>
                  <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{report.publishedLabel}</span>
                </div>
                <div style={{ fontFamily:FH, fontSize:isMobile?15:17, fontWeight:700, color:t.tx, lineHeight:1.3 }}>{report.title}</div>
                <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }}>{report.summary}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginTop:"auto" }}>
                  <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>{report.reportType.toUpperCase()} · {report.cadence}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:5, fontFamily:FB, fontSize:10, fontWeight:700, color:t.go }}>
                    Abrir fuente <ArrowUpRight size={13} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── QUICK NAV ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:8, marginBottom:16 }}>
        {[
          {label:"Mercados",       tab:"mercados",       Icon:DollarSign,  color:t.bl, desc:"FX · Riesgo País · Noticias"},
          {label:"Renta Fija",     tab:"rentafija",      Icon:ClipboardList,color:t.go, desc:"LECAPs · Soberanos · ONs"},
          {label:"Renta Variable", tab:"rentavariable",  Icon:BarChart3,   color:t.gr, desc:"CEDEARs · Screener"},
          {label:"Research",       tab:"research",       Icon:Search,      color:t.pu, desc:"Resúmenes · Balances · Recos"},
        ].map((n, i) => (
          <button key={i} onClick={() => setTab(n.tab)} className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:8, padding:"14px 14px", textAlign:"left", cursor:"pointer", transition:"all .15s", display:"flex", flexDirection:"column", gap:6 }}>
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
