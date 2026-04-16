"use client";

import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP } from "@/lib/data/renta-fija";
import { NOTICIAS } from "@/lib/data/noticias";
import { FB, FH } from "@/lib/constants";
import type { DolarData, RiesgoPaisData, LiveMarket } from "@/types";

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

function NewsItem({ n }: { n: typeof NOTICIAS[0] }) {
  const t = useAppTheme();
  const acMap: Record<string, string> = { blue:t.bl, green:t.gr, gold:t.go, red:t.rd, purple:t.pu };
  const ac = acMap[n.catColor] ?? t.mu;
  return (
    <div style={{ padding:"14px 0", borderBottom:`1px solid ${t.brd}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:ac, background:`${ac}15`, padding:"2px 8px", borderRadius:10, letterSpacing:".08em", textTransform:"uppercase" }}>{n.cat}</span>
        <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>{n.fecha}</span>
      </div>
      <h3 style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx, lineHeight:1.35, marginBottom:8 }}>{n.titulo}</h3>
      <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7 }}
        dangerouslySetInnerHTML={{ __html: n.cuerpo.slice(0, 300) + (n.cuerpo.length > 300 ? "…" : "") }}
      />
    </div>
  );
}

export function MercadosView({ dolar, riesgoPais, fxError, liveMarket }: MercadosViewProps) {
  const t        = useAppTheme();
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
      <div style={{ background:col.bg, border:`1px solid ${col.ac}22`, borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`, display:"flex", flexDirection:"column", gap:4 }}>
        <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:col.ac, lineHeight:1 }}>
            {ld ? <span style={{ fontSize:20, color:t.fa }}>cargando…</span>
              : fe ? <span style={{ fontSize:16, color:t.rd }}>sin datos</span>
              : value}
          </span>
          {!ld && !fe && badge != null && (
            <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:parseFloat(badge)>0?t.rd:t.gr, background:parseFloat(badge)>0?t.rdBg:t.grBg, padding:"2px 8px", borderRadius:20 }}>
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
      <div style={{ background:col.bg, border:`1px solid ${col.ac}22`, borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`, position:"relative" }}>
        {badge && <div style={{ position:"absolute", top:10, right:12, fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em", color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:10, textTransform:"uppercase" }}>{badge}</div>}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</span>
          {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e", display:"inline-block" }} />}
        </div>
        <div style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:col.ac, lineHeight:1 }}>
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
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>MERCADO DE CAMBIOS — TIEMPO REAL</SectionLabel>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {fxError ? (
            <span style={{ fontFamily:FB, fontSize:11, color:t.rd, background:t.rdBg, padding:"3px 10px", borderRadius:8 }}>⚠️ Sin conexión — recargá la página</span>
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
          <div style={{ background:t.blBg, border:`1px solid ${t.bl}22`, borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${t.bl}`, position:"relative" }}>
            <div style={{ position:"absolute", top:10, right:12, fontFamily:FB, fontSize:8, fontWeight:700, color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:10, textTransform:"uppercase", letterSpacing:".06em" }}>MAYOR TNA</div>
            <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>LECAP / BONCAP</div>
            <div style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:t.bl, lineHeight:1 }}>{bestLECAP.tnaStr}</div>
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
                  <div key={i} style={{ background:t.alt, borderRadius:8, padding:"10px 16px", fontFamily:FB }}>
                    <div style={{ fontSize:9, color:t.fa, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{b.label}</div>
                    <div style={{ fontSize:20, fontWeight:700, color }}>{bv>0?"+":""}{b.v}%</div>
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
          {NOTICIAS.slice(0, 8).map((n, i) => <NewsItem key={i} n={n} />)}
        </div>
      </Card>
    </div>
  );
}
