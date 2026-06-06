"use client";

import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP } from "@/lib/data/renta-fija";
import { FB, FH } from "@/lib/constants";
import { useState } from "react";
import { useLiveNews } from "@/hooks/use-live-news";
import type { DolarData, RiesgoPaisData, LiveMarket, LiveNewsArticle } from "@/types";
import { EarningsCalendar } from "@/components/mercados/earnings-calendar";

interface MercadosViewProps {
  dolar:      DolarData | null;
  riesgoPais: RiesgoPaisData | null;
  fxError:    boolean;
  liveMarket: LiveMarket;
}

interface FxCardProps {
  label:   string;
  value:   string | null;
  compra?: string | null;
  sub?:    string;
  color:   "blue"|"gold"|"green"|"red"|"purple"|"gray";
  badge?:  string | null;
  loading?: boolean;
  fxError?: boolean;
}

interface LivePanelProps {
  label:      string;
  value:      string | null;
  sub?:       string;
  changePct?: number | null;
  color:      "blue"|"gold"|"green"|"red"|"purple"|"gray";
  badge?:     string;
  dot?:       boolean;
}

function NewsItem({ article }: { article: LiveNewsArticle }) {
  const t = useAppTheme();
  const accent = article.sourceTier === "preferred" ? t.go : t.bl;

  return (
    <a
      href={article.articleUrl}
      target="_blank"
      rel="noreferrer"
      className="premium-hover"
      style={{
        display:"block",
        padding:"16px 0",
        borderBottom:`1px solid ${t.brd}`,
        color:"inherit",
        textDecoration:"none",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:8, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
          {article.sourceFaviconUrl ? (
            <img
              src={article.sourceFaviconUrl}
              alt={article.sourceName}
              width={18}
              height={18}
              style={{ borderRadius:99, background:"#fff", border:`1px solid ${t.brd}`, flexShrink:0 }}
            />
          ) : (
            <div style={{ width:18, height:18, borderRadius:99, background:t.alt, border:`1px solid ${t.brd}`, flexShrink:0 }} />
          )}
          <span style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:accent, letterSpacing:".08em", textTransform:"uppercase" }}>
            {article.sourceName}
          </span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            {article.publishedLabel}
          </span>
        </div>
        <span style={{ fontFamily:FB, fontSize:9, color:t.mu, background:t.alt, border:`1px solid ${t.brd}`, borderRadius:999, padding:"3px 8px", textTransform:"uppercase", letterSpacing:".08em" }}>
          {article.locale === "global" ? "Global" : "LatAm"}
        </span>
      </div>
      <h3 style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx, lineHeight:1.35, marginBottom:8 }}>
        {article.title}
      </h3>
      <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        <span>Abrir nota original</span>
        {article.sourceDomain && <span style={{ color:t.fa }}>{article.sourceDomain}</span>}
      </div>
    </a>
  );
}

export function MercadosView({ dolar, riesgoPais, fxError, liveMarket }: MercadosViewProps) {
  const t        = useAppTheme();
  const [subTab, setSubTab] = useState("mercados");
  const { articles, status: newsStatus, lastUpdate: newsLastUpdate } = useLiveNews();
  const cMap = {
    blue:  {bg:t.blBg, ac:t.bl},
    gold:  {bg:t.goBg, ac:t.go},
    green: {bg:t.grBg, ac:t.gr},
    red:   {bg:t.rdBg, ac:t.rd},
    purple:{bg:t.puBg, ac:t.pu},
    gray:  {bg:t.alt,  ac:t.mu},
  };

  const gold     = liveMarket.gold;
  const brent    = liveMarket.brent;
  const mervalARS= liveMarket.mervalARS;

  const bestLECAP = (() => {
    const today = Date.now();
    const maxDays = 180;
    const candidates = LECAP.flatMap(g => {
      const [d,m,y] = g.vto.split("/").map(Number);
      const dias = Math.floor((new Date(y,m-1,d).getTime() - today) / 86400000);
      if (dias > maxDays || dias <= 0) return [];
      return g.rows.map(r => ({
        ticker: r.t, mes: g.vto,
        tna: parseFloat(r.tna.replace(",",".")), tnaStr: r.tna, tem: r.r, dias,
      }));
    });
    if (!candidates.length) return null;
    return candidates.reduce((best,cur) => cur.tna > best.tna ? cur : best, candidates[0]);
  })();

  const fmt = (v?: number | null) => v ? `$${Math.round(v).toLocaleString("es-AR")}` : "—";
  const pct = (num?: number | null, den?: number | null): string | null => {
    if (!num || !den) return null;
    return (((num / den) - 1) * 100).toFixed(1);
  };

  const of  = dolar?.oficial?.venta;
  const bl  = dolar?.blue?.venta;
  const mep = dolar?.bolsa?.venta;
  const ccl = dolar?.contadoconliqui?.venta;
  const may = dolar?.mayorista?.venta;

  const loading = !dolar && !fxError;

  const FxCard = ({ label, value, compra, sub, color, badge, loading: ld, fxError: fe }: FxCardProps) => {
    const col = cMap[color];
    return (
      <div className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`2px solid ${col.ac}`, borderRadius:8, padding:"17px 18px", display:"flex", flexDirection:"column", gap:4 }}>
        <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:FH, fontSize:28, fontWeight:750, color:col.ac, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
            {ld ? <span style={{ fontSize:20, color:t.fa }}>cargando…</span>
              : fe ? <span style={{ fontSize:16, color:t.rd }}>sin datos</span>
              : value}
          </span>
          {!ld && !fe && badge != null && (
            <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:parseFloat(badge)>0?t.rd:t.gr, background:parseFloat(badge)>0?t.rdBg:t.grBg, padding:"2px 8px", borderRadius:6 }}>
              {parseFloat(badge)>0?"+":""}{badge}%
            </span>
          )}
        </div>
        {compra && !fe && <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Compra: {compra}</div>}
        <div style={{ fontFamily:FB, fontSize:11, color:t.fa, marginTop:2 }}>{sub}</div>
      </div>
    );
  };

  const LivePanel = ({ label, value, sub, changePct, color, badge, dot }: LivePanelProps) => {
    const col = cMap[color];
    return (
      <div className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`2px solid ${col.ac}`, borderRadius:8, padding:"17px 18px", position:"relative" }}>
        {badge && <div style={{ position:"absolute", top:10, right:12, fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em", color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:6, textTransform:"uppercase" }}>{badge}</div>}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</span>
          {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e", display:"inline-block" }} />}
        </div>
        <div style={{ fontFamily:FH, fontSize:26, fontWeight:750, color:col.ac, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
          {value || <span style={{ fontSize:16, color:t.fa }}>—</span>}
        </div>
        {changePct != null && (
          <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:changePct>=0?t.gr:t.rd, marginTop:4 }}>
            {changePct>=0?"+":""}{changePct.toFixed(2)}% hoy
          </div>
        )}
        <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>{sub}</div>
      </div>
    );
  };

  return (
    <div className="fade-up">
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        <button onClick={()=>setSubTab("mercados")} style={{ padding:"8px 14px", borderRadius:6, fontFamily:FB, fontSize:12, fontWeight:subTab==="mercados"?700:450, cursor:"pointer", border:`1px solid ${subTab==="mercados"?t.go+"66":t.brd}`, background:subTab==="mercados"?t.goBg:t.srf, color:subTab==="mercados"?t.go:t.mu }}>Mercados</button>
        <button onClick={()=>setSubTab("earnings")} style={{ padding:"8px 14px", borderRadius:6, fontFamily:FB, fontSize:12, fontWeight:subTab==="earnings"?700:450, cursor:"pointer", border:`1px solid ${subTab==="earnings"?t.go+"66":t.brd}`, background:subTab==="earnings"?t.goBg:t.srf, color:subTab==="earnings"?t.go:t.mu }}>Balances</button>
      </div>

      {subTab === "earnings" && <EarningsCalendar />}
      {subTab === "mercados" && <div>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>MERCADO DE CAMBIOS — TIEMPO REAL</SectionLabel>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {fxError ? (
            <span style={{ fontFamily:FB, fontSize:11, color:t.rd, background:t.rdBg, padding:"3px 10px", borderRadius:6 }}>Sin conexión · recargá la página</span>
          ) : (
            <span style={{ fontFamily:FB, fontSize:11, color:dolar?t.gr:t.fa, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:dolar?t.gr:t.fa, boxShadow:dolar?`0 0 5px ${t.gr}`:"none" }} />
              {dolar?"Datos en vivo":"Conectando..."}
            </span>
          )}
        </div>
      </div>

      {/* Live indicators */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:24 }}>
        <LivePanel label="Riesgo País" value={riesgoPais?`${riesgoPais.valor} pb`:null} sub="EMBI · JP Morgan" color="red" dot={!!riesgoPais} />
        <LivePanel label="Merval (BYMA)" value={mervalARS?`$${mervalARS.value.toLocaleString("es-AR",{maximumFractionDigits:0})}`:null} sub="Índice en pesos · live" changePct={mervalARS?.changePct} color="green" dot={!!mervalARS} />
        <LivePanel label="Oro (GLD)" value={gold?`USD ${gold.price.toFixed(2)}`:null} sub="Proxy ETF GLD · Tiempo real" changePct={gold?.changePct} color="gold" dot={!!gold} />
        <LivePanel label="Petróleo (BNO)" value={brent?`USD ${brent.price.toFixed(2)}`:null} sub="Proxy ETF BNO · Tiempo real" changePct={brent?.changePct} color="gold" dot={!!brent} />
        {bestLECAP && (
          <div className="premium-hover" style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`2px solid ${t.bl}`, borderRadius:8, padding:"18px 20px", position:"relative" }}>
            <div style={{ position:"absolute", top:10, right:12, fontFamily:FB, fontSize:8, fontWeight:700, color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:6, textTransform:"uppercase", letterSpacing:".06em" }}>MAYOR TNA</div>
            <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>LECAP / BONCAP</div>
            <div style={{ fontFamily:FH, fontSize:26, fontWeight:750, color:t.bl, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{bestLECAP.tnaStr}</div>
            <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:t.mu, marginTop:4 }}>TNA · {bestLECAP.ticker} · {bestLECAP.dias}d</div>
          </div>
        )}
      </div>

      {/* FX Grid */}
      <SectionLabel t={t}>TIPOS DE CAMBIO · DOLARAPI.COM</SectionLabel>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:24 }}>
        <FxCard label="USD Oficial" value={fmt(of)} compra={dolar?fmt(dolar.oficial.compra):null} sub="Banco Nación · Pizarra" color="blue" badge={null} loading={loading} fxError={fxError} />
        <FxCard label="USD Blue" value={fmt(bl)} sub="Mercado informal" color="gold" badge={pct(bl,of)} loading={loading} fxError={fxError} />
        <FxCard label="USD MEP / Bolsa" value={fmt(mep)} sub="CCL s/ bonos" color="green" badge={pct(mep,of)} loading={loading} fxError={fxError} />
        <FxCard label="Dólar CCL" value={fmt(ccl)} sub="Contado con liquidación" color="purple" badge={pct(ccl,of)} loading={loading} fxError={fxError} />
        <FxCard label="Mayorista (BCRA)" value={fmt(may)} sub="Rueda interbancaria" color="gray" loading={loading} fxError={fxError} />
      </div>

      {/* Brechas */}
      {!loading && !fxError && of && (
        <Card t={t} style={{ marginBottom:24 }}>
          <div style={{ padding:"16px 20px" }}>
            <SectionLabel t={t}>BRECHAS CAMBIARIAS</SectionLabel>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
              {[
                { label:"Blue vs Oficial", v:pct(bl,of) },
                { label:"MEP vs Oficial",  v:pct(mep,of) },
                { label:"CCL vs Oficial",  v:pct(ccl,of) },
                { label:"CCL vs MEP",      v:pct(ccl,mep) },
              ].filter(b=>b.v!=null).map((b,i) => {
                const bv = parseFloat(b.v!);
                const color = bv > 5 ? t.rd : bv < 2 ? t.gr : t.go;
                return (
                  <div key={i} style={{ background:t.alt, borderRadius:6, padding:"10px 16px", fontFamily:FB, border:`1px solid ${t.brd}` }}>
                    <div style={{ fontSize:9, color:t.fa, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{b.label}</div>
                    <div style={{ fontSize:20, fontWeight:750, color, fontVariantNumeric:"tabular-nums" }}>{bv>0?"+":""}{b.v}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Noticias recientes */}
      <SectionLabel t={t}>NOTICIAS Y ANÁLISIS RECIENTES</SectionLabel>
      <Card t={t}>
        <div style={{ padding:"0 20px" }}>
          <div style={{ padding:"16px 0 4px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
            <div style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
              Curado para priorizar medios financieros de referencia y evitar duplicados.
            </div>
            <div style={{ fontFamily:FB, fontSize:10, color:newsStatus==="error" ? t.rd : t.mu }}>
              {newsStatus==="loading" && "Actualizando feed..."}
              {newsStatus==="error" && "No se pudo actualizar el feed en vivo"}
              {newsStatus==="ok" && newsLastUpdate && `Actualizado ${newsLastUpdate.toLocaleTimeString("es-AR",{ hour:"2-digit", minute:"2-digit" })}`}
            </div>
          </div>

          {newsStatus === "loading" && articles.length === 0 && (
            <div style={{ padding:"0 0 18px", fontFamily:FB, fontSize:12, color:t.mu }}>
              Cargando noticias de mercado...
            </div>
          )}

          {newsStatus === "error" && articles.length === 0 && (
            <div style={{ padding:"0 0 18px", fontFamily:FB, fontSize:12, color:t.rd }}>
              El feed en vivo no respondió. La integración quedó preparada para reintentar automáticamente.
            </div>
          )}

          {articles.slice(0, 10).map((article) => <NewsItem key={article.id} article={article} />)}

          {newsStatus === "ok" && articles.length === 0 && (
            <div style={{ padding:"0 0 18px", fontFamily:FB, fontSize:12, color:t.mu }}>
              No encontramos noticias recientes con el filtro de calidad actual.
            </div>
          )}
        </div>
      </Card>
      </div>}
    </div>
  );
}
