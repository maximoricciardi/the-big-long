"use client";

import { useState, useCallback, useEffect } from "react";
import { Home, DollarSign, ClipboardList, BarChart3, Package, Search, Lock, Sun, Moon, Phone, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { useClock } from "@/hooks/use-clock";
import { useFX } from "@/hooks/use-fx";
import { useLiveMarket } from "@/hooks/use-live-market";
import { useExtra } from "@/hooks/use-extra";
import { InicioView }          from "@/components/inicio/inicio-view";
import { MercadosView }        from "@/components/mercados/mercados-view";
import { RentaFijaView }       from "@/components/renta-fija/renta-fija-view";
import { RentaVariableView }   from "@/components/renta-variable/renta-variable-view";
import { ProductosView }       from "@/components/productos/productos-view";
import { ResearchView }        from "@/components/research/research-view";
import { AIChatWidget }        from "@/components/chat/ai-chat-widget";
import { AdminPanel }          from "@/components/admin/admin-panel";
import { ErrorBoundary }       from "@/components/ui/error-boundary";
import { KpiChip }             from "@/components/ui/kpi-chip";
import { Card }                from "@/components/ui/card";
import { SectionLabel }        from "@/components/ui/section-label";
import { CONTACT, WA_LINK, FH, FB, FD } from "@/lib/constants";
import { NOTICIAS } from "@/lib/data/noticias";
import type { ExtraItem } from "@/types";

const TABS = [
  { id:"inicio",        label:"Inicio",        Icon:Home,          desc:"Dashboard y resumen del día" },
  { id:"mercados",      label:"Mercados",       Icon:DollarSign,    desc:"Cotizaciones, FX y noticias live" },
  { id:"rentafija",     label:"Renta Fija",     Icon:ClipboardList, desc:"LECAPs, soberanos, ONs y plazos fijos" },
  { id:"rentavariable", label:"Renta Variable", Icon:BarChart3,     desc:"CEDEARs y screener de equities" },
  { id:"productos",     label:"Productos",      Icon:Package,       desc:"FCIs y ETPs Balanz" },
  { id:"research",      label:"Research",       Icon:Search,        desc:"Resúmenes, balances y recomendaciones" },
] as const;

type TabId = typeof TABS[number]["id"];

const LOGO_COLORS = [
  null,
  { main:"#2D4A3E", accent:"#8B7355" },
  { main:"#4A3728", accent:"#C4956A" },
  { main:"#3B3B5C", accent:"#9B8EC4" },
  { main:"#1A3C40", accent:"#5B9A8B" },
  { main:"#4A2C2A", accent:"#C17C74" },
];

export default function AppPage() {
  const t          = useAppTheme();
  const { resolvedTheme, setTheme } = useTheme();
  const isMobile   = useIsMobile(640);
  const clock      = useClock();
  const { dolar, riesgoPais, fxError } = useFX();
  const liveMarket = useLiveMarket();
  const { extra, publish: publishItem, remove: removeItem } = useExtra();

  const [mounted,          setMounted]          = useState(false);
  const [tab,              setTab]              = useState<TabId>("inicio");
  const [researchSub,      setResearchSub]      = useState("resumen");
  const [chartTickerGlobal, setChartTickerGlobal] = useState<string | null>(null);
  const [admin,            setAdmin]            = useState(false);
  const [adminPrompt,      setAdminPrompt]      = useState(false);
  const [adminPin,         setAdminPin]         = useState("");
  const [logoIdx,          setLogoIdx]          = useState(0);
  const [logoSpin,         setLogoSpin]         = useState(false);
  const [logoClickCount,   setLogoClickCount]   = useState(0);
  const [logoClickTimer,   setLogoClickTimer]   = useState<ReturnType<typeof setTimeout> | null>(null);

  // Defer dynamic ticker and theme-sensitive UI until client is hydrated
  useEffect(() => { setMounted(true); }, []);

  // Expose goChart globally for nested components
  const goChart = useCallback((ticker: string) => {
    setChartTickerGlobal(ticker);
    setTab("rentavariable");
  }, []);

  useEffect(() => {
    (window as typeof window & { __goChart?: (t: string) => void }).__goChart = goChart;
    return () => { delete (window as typeof window & { __goChart?: (t: string) => void }).__goChart; };
  }, [goChart]);

  const handleLogoClick = () => {
    const count = logoClickCount + 1;
    setLogoClickCount(count);
    setLogoSpin(true);
    setTimeout(() => setLogoSpin(false), 500);
    const newIdx = (logoIdx + 1) % LOGO_COLORS.length;
    setLogoIdx(newIdx);
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (count >= 5) {
      setAdminPrompt(true);
      setLogoClickCount(0);
      setLogoClickTimer(null);
    } else {
      const timer = setTimeout(() => setLogoClickCount(0), 2000);
      setLogoClickTimer(timer);
    }
  };

  const goResearch = (sub: string) => { setResearchSub(sub); setTab("research"); };
  const handleSetTab = (tab: string) => { setTab(tab as TabId); };

  const publishExtra = useCallback((item: ExtraItem) => {
    publishItem(item);
  }, [publishItem]);

  const removeExtra = useCallback((id: string) => {
    removeItem(id);
  }, [removeItem]);

  const logoC = LOGO_COLORS[logoIdx];
  const isDark = resolvedTheme === "dark";

  // Ticker data
  const mkItem = (label: string, val: string, pct?: number | null) => {
    const sign = pct != null ? (pct > 0 ? "▲" : pct < 0 ? "▼" : "") : "";
    const pctStr = pct != null ? ` ${sign}${Math.abs(pct).toFixed(2)}%` : "";
    return { label, val, pctStr, pos: (pct ?? 0) > 0, neg: (pct ?? 0) < 0 };
  };

  const tickerData = [
    dolar?.oficial?.venta         ? mkItem("USD Oficial", `$${Math.round(dolar.oficial.venta).toLocaleString("es-AR")}`) : null,
    dolar?.bolsa?.venta           ? mkItem("USD MEP",     `$${Math.round(dolar.bolsa.venta).toLocaleString("es-AR")}`) : null,
    dolar?.contadoconliqui?.venta ? mkItem("CCL",         `$${Math.round(dolar.contadoconliqui.venta).toLocaleString("es-AR")}`) : null,
    riesgoPais                    ? mkItem("Riesgo País", `${riesgoPais.valor} pb`) : null,
    liveMarket.mervalARS          ? mkItem("Merval",      `${liveMarket.mervalARS.value.toLocaleString("es-AR",{maximumFractionDigits:0})}`, liveMarket.mervalARS.changePct) : null,
    liveMarket.spy                ? mkItem("SPY",         `$${liveMarket.spy.price.toFixed(2)}`, liveMarket.spy.changePct) : null,
    liveMarket.gold               ? mkItem("Oro",         `$${liveMarket.gold.price.toFixed(0)}`, liveMarket.gold.changePct) : null,
    liveMarket.brent              ? mkItem("Brent",       `$${liveMarket.brent.price.toFixed(2)}`, liveMarket.brent.changePct) : null,
    NOTICIAS[0]                   ? { label:"📰", val:NOTICIAS[0].titulo.slice(0, 55) + (NOTICIAS[0].titulo.length > 55 ? "…" : ""), pctStr:"", pos:false, neg:false } : null,
  ].filter(Boolean) as { label: string; val: string; pctStr: string; pos: boolean; neg: boolean }[];

  return (
    <div style={{ fontFamily:FB, background:t.bg, minHeight:"100vh", color:t.tx, transition:"background .3s, color .3s", paddingBottom:isMobile?72:0 }}>

      {/* ── HEADER ── */}
      <header style={{ background:t.hdr, borderBottom:`1px solid ${t.brd}`, position:"sticky", top:0, zIndex:100, boxShadow:t.sh }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 ${isMobile?12:20}px`, display:"flex", alignItems:"center", justifyContent:"space-between", height:isMobile?50:56, gap:isMobile?8:16 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", flexShrink:0, cursor:"pointer", userSelect:"none" }} onClick={handleLogoClick}>
            <div style={{ fontFamily:FD, fontSize:isMobile?18:23, fontWeight:700, color:logoC?logoC.main:t.tx, letterSpacing:"-.02em", lineHeight:1, transition:"color .4s ease", animation:logoSpin?"logoSpin .5s cubic-bezier(.4,0,.2,1)":"none" }}>
              The Big <span style={{ color:logoC?logoC.accent:t.go, transition:"color .4s ease" }}>Long</span>
            </div>
          </div>

          {/* Nav — desktop only */}
          {!isMobile && (
            <nav style={{ display:"flex", gap:2, flexWrap:"nowrap" }}>
              {TABS.map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                  padding:"6px 12px", borderRadius:8, border:"none", fontFamily:FB,
                  fontSize:11, fontWeight:tab===tb.id?700:400,
                  background:tab===tb.id?t.go+"18":"transparent",
                  color:tab===tb.id?t.go:t.mu,
                  cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  <tb.Icon size={13} strokeWidth={tab===tb.id?2.5:1.8} /> {tb.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right controls */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {!isMobile && (
              <div style={{ textAlign:"right", lineHeight:1.3 }}>
                <div style={{ fontFamily:FB, fontSize:13, fontWeight:700, color:t.tx, letterSpacing:".01em", fontVariantNumeric:"tabular-nums" }}>{clock.time}</div>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, letterSpacing:".04em", textTransform:"uppercase" }}>{clock.date}</div>
              </div>
            )}
            <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{ background:t.alt, border:`1px solid ${t.brd}`, borderRadius:8, padding:isMobile?"6px 10px":"6px 12px", fontFamily:FB, fontSize:12, color:t.mu, cursor:"pointer", display:"flex", alignItems:"center" }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      {mounted && tickerData.length > 0 && (
        <div style={{ background:t.tick, padding:"6px 0", overflow:"hidden", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
          <div style={{ display:"flex", animation:"marquee 50s linear infinite", width:"max-content" }}>
            {[...tickerData, ...tickerData, ...tickerData].map((item, k) => (
              <span key={k} style={{ display:"inline-flex", alignItems:"center", gap:6, paddingRight:28, whiteSpace:"nowrap" }}>
                <span style={{ fontFamily:FB, fontSize:10, fontWeight:500, color:"rgba(255,255,255,.38)", letterSpacing:".06em", textTransform:"uppercase" }}>{item.label}</span>
                <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:item.pos?"#4ade80":item.neg?"#f87171":"#e2e8f0" }}>{item.val}</span>
                {item.pctStr && <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:item.pos?"#4ade80":item.neg?"#f87171":"#94a3b8" }}>{item.pctStr}</span>}
                <span style={{ color:"rgba(255,255,255,.15)", fontSize:10 }}>·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── ADMIN PIN PROMPT ── */}
      {adminPrompt && !admin && (
        <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.6)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={() => { setAdminPrompt(false); setAdminPin(""); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:t.srf, borderRadius:20, padding:"32px 36px", width:320, boxShadow:"0 24px 64px rgba(0,0,0,.3)", border:`1px solid ${t.brd}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <Lock size={20} color={t.go} />
              <span style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:t.tx }}>Admin</span>
            </div>
            <input type="password" placeholder="PIN de acceso" value={adminPin}
              onChange={e => setAdminPin(e.target.value)}
              onKeyDown={e => { if(e.key==="Enter"){ if(adminPin==="1243"){setAdmin(true);setAdminPrompt(false);setAdminPin("");}else{setAdminPin("");}}}}
              autoFocus
              style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:FB, fontSize:14, border:`1.5px solid ${t.brd}`, background:t.alt, color:t.tx, outline:"none", letterSpacing:".15em", textAlign:"center" }}
            />
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={() => { setAdminPrompt(false); setAdminPin(""); }} style={{ flex:1, padding:"10px", borderRadius:10, border:`1px solid ${t.brd}`, background:"transparent", fontFamily:FB, fontSize:12, color:t.mu, cursor:"pointer" }}>Cancelar</button>
              <button onClick={() => { if(adminPin==="1243"){setAdmin(true);setAdminPrompt(false);setAdminPin("");}else{setAdminPin("");}}} style={{ flex:1, padding:"10px", borderRadius:10, border:"none", background:t.go, fontFamily:FB, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>Ingresar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ── */}
      {admin && <AdminPanel onClose={() => setAdmin(false)} onPublish={publishExtra} />}

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"16px 12px 40px":"28px 20px 60px" }}>

        {/* Extra published content */}
        {extra.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <SectionLabel t={t}>ÚLTIMO · ACTUALIZACIÓN EN VIVO</SectionLabel>
            {extra.map(item => (
              <Card key={item.id} t={t} style={{ marginBottom:12, borderLeft:`4px solid ${t.go}` }}>
                <div style={{ padding:"16px 20px", position:"relative" }}>
                  {admin && <button onClick={() => removeExtra(item.id)} style={{ position:"absolute", top:12, right:12, background:t.rdBg, border:"none", borderRadius:6, padding:"3px 8px", color:t.rd, cursor:"pointer", fontSize:11, fontFamily:FB }}>Eliminar</button>}
                  <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginBottom:6 }}>{item.date} · {item.type?.toUpperCase()}</div>
                  <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:10 }}>{item.title}</h3>
                  {item.kpis && item.kpis.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                      {item.kpis.map((k, i) => <KpiChip key={i} item={k} t={t} />)}
                    </div>
                  )}
                  <div style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.75 }} dangerouslySetInnerHTML={{ __html:item.content }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab content */}
        <ErrorBoundary t={t} key={tab}>
          {tab === "inicio"        && <InicioView dolar={dolar} riesgoPais={riesgoPais} liveMarket={liveMarket} setTab={handleSetTab} goResearch={goResearch} />}
          {tab === "mercados"      && <MercadosView dolar={dolar} riesgoPais={riesgoPais} fxError={fxError} liveMarket={liveMarket} />}
          {tab === "rentafija"     && <RentaFijaView />}
          {tab === "rentavariable" && <RentaVariableView initialTicker={chartTickerGlobal} onTickerConsumed={() => setChartTickerGlobal(null)} />}
          {tab === "productos"     && <ProductosView />}
          {tab === "research"      && <ResearchView initialSub={researchSub} onSubChange={setResearchSub} />}
        </ErrorBoundary>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:t.ft, padding:"36px 20px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", flexDirection:isMobile?"column":"row", gap:isMobile?24:40, marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontFamily:FD, fontSize:isMobile?28:36, fontWeight:700, color:t.ftT, letterSpacing:"-.02em", lineHeight:1 }}>The</span>
              <span style={{ fontFamily:FD, fontSize:isMobile?28:36, fontWeight:700, color:t.go, letterSpacing:"-.02em", lineHeight:1 }}>Big Long</span>
            </div>
            <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontFamily:FB, fontSize:15, fontWeight:600, color:t.ftT }}>{CONTACT.name}</div>
                <div style={{ fontFamily:FB, fontSize:11, fontWeight:300, color:"rgba(255,255,255,.35)" }}>{CONTACT.title}</div>
              </div>
              <div style={{ display:"flex", gap:16 }}>
                <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")} target="_blank" rel="noreferrer" style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Phone size={14} /> {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Mail size={14} /> {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
          <div style={{ height:1, background:"rgba(255,255,255,.06)", marginBottom:16 }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <p style={{ fontFamily:FB, fontSize:10, fontWeight:300, color:"rgba(255,255,255,.18)", lineHeight:1.7, maxWidth:560 }}>
              Información exclusivamente informativa. No constituye asesoramiento de inversión ni oferta pública. Invertir implica riesgos.
            </p>
            <span style={{ fontFamily:FB, fontSize:10, fontWeight:400, color:"rgba(255,255,255,.15)", whiteSpace:"nowrap" }}>Fundada en marzo 2026</span>
          </div>
        </div>
      </footer>

      {/* ── AI CHAT ── */}
      <AIChatWidget />

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:t.hdr, borderTop:`1px solid ${t.brd}`, display:"flex", justifyContent:"space-around", alignItems:"center", padding:"6px 0 env(safe-area-inset-bottom, 8px)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)" }}>
          {TABS.map(tb => {
            const active = tab === tb.id;
            return (
              <button key={tb.id} onClick={() => setTab(tb.id)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"4px 8px", color:active?t.go:t.mu, transition:"color .15s", minWidth:0 }}>
                <tb.Icon size={18} strokeWidth={active?2.5:1.5} />
                <span style={{ fontFamily:FB, fontSize:9, fontWeight:active?700:400 }}>{tb.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
