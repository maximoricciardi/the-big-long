"use client";

/**
 * components/renta-fija/ons-panel.tsx
 * Obligaciones Negociables — ~40 instrumentos reales, Ley ARG + Ley NY
 */

import { useState, useEffect, useRef } from "react";
import { BarChart3, LineChart, AlertTriangle, Search } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";

export interface OnData {
  t:    string;
  em:   string;
  p:    number;
  tir:  number;
  cup:  number;
  dur:  number;
  vto:  string;
  cal:  string;
  tipo: string;
  freq: string;
}

// ── LEY ARGENTINA ────────────────────────────────────────────────────
export const ONS_ARG_DATA: OnData[] = [
  // ENERGÍA
  { t:"YMCHO",  em:"YPF S.A.",             p:99.25, tir:8.75,  cup:9.0,   dur:1.8,  vto:"15/04/2027", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"YMCIO",  em:"YPF S.A.",             p:97.50, tir:9.50,  cup:9.0,   dur:2.8,  vto:"01/09/2028", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"VLCHO",  em:"Vista Energy",          p:98.75, tir:9.10,  cup:9.5,   dur:2.5,  vto:"15/12/2027", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"VLCIO",  em:"Vista Energy",          p:96.50, tir:10.40, cup:9.5,   dur:3.5,  vto:"15/06/2029", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"PMCGO",  em:"Pampa Energía",         p:96.20, tir:9.80,  cup:9.5,   dur:3.2,  vto:"01/09/2028", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"TECPO",  em:"Tecpetrol S.A.",        p:97.80, tir:9.20,  cup:8.875, dur:2.8,  vto:"01/03/2028", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"PECMO",  em:"Petrolera El Coihue",   p:95.50, tir:10.80, cup:10.0,  dur:3.8,  vto:"20/01/2029", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"MSCHO",  em:"MSU Energy",            p:96.80, tir:10.20, cup:9.75,  dur:3.2,  vto:"01/05/2028", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"MSCIO",  em:"MSU Energy",            p:94.50, tir:11.50, cup:10.5,  dur:4.2,  vto:"01/06/2029", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  // TELECOM / MEDIOS
  { t:"TXCFO",  em:"Telecom Argentina",     p:97.80, tir:9.10,  cup:8.0,   dur:2.8,  vto:"01/03/2028", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"CACOO",  em:"Cablevision S.A.",      p:96.50, tir:9.80,  cup:9.0,   dur:3.2,  vto:"01/09/2028", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  // FINANZAS / BANCOS
  { t:"BRCAO",  em:"Banco Galicia",         p:96.80, tir:9.50,  cup:8.75,  dur:3.1,  vto:"01/05/2028", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"IRCFO",  em:"IRSA Inversiones",      p:98.50, tir:7.80,  cup:8.5,   dur:2.1,  vto:"20/07/2027", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"IRSCO",  em:"IRSA Prop. Comerciales",p:93.50, tir:12.40, cup:11.0,  dur:4.8,  vto:"20/04/2030", cal:"A",   tipo:"Amort.",   freq:"Semestral" },
  { t:"CECAO",  em:"Cresud S.A.",           p:94.20, tir:11.80, cup:10.5,  dur:4.2,  vto:"01/06/2029", cal:"A",   tipo:"Bullet",  freq:"Semestral" },
  { t:"MRCGO",  em:"Mercado Libre",         p:99.50, tir:7.20,  cup:7.5,   dur:2.2,  vto:"10/08/2027", cal:"BBB", tipo:"Bullet",  freq:"Semestral" },
  // INDUSTRIAL / AGROINDUSTRIA
  { t:"ARCHO",  em:"Arcor S.A.",            p:97.20, tir:9.40,  cup:9.0,   dur:2.9,  vto:"01/11/2027", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"JDAHO",  em:"John Deere Argentina",  p:98.50, tir:8.20,  cup:8.5,   dur:2.4,  vto:"15/05/2027", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"SCNAO",  em:"Scania Argentina",      p:97.80, tir:8.90,  cup:8.75,  dur:2.6,  vto:"20/12/2027", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"CNHAO",  em:"CNH Industrial Arg.",   p:96.50, tir:9.60,  cup:9.0,   dur:3.0,  vto:"01/06/2028", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  // INFRAESTRUCTURA / UTILITIES
  { t:"TGNCJO", em:"TGN S.A.",              p:95.80, tir:10.50, cup:9.75,  dur:3.5,  vto:"15/09/2028", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"AECAO",  em:"Aeropuertos Arg. 2000", p:97.50, tir:8.50,  cup:8.75,  dur:2.9,  vto:"01/11/2027", cal:"AA-", tipo:"Bullet",  freq:"Semestral" },
  { t:"GENNO",  em:"Genneia S.A.",          p:96.00, tir:10.00, cup:8.75,  dur:3.1,  vto:"20/01/2028", cal:"A+",  tipo:"Bullet",  freq:"Semestral" },
];

// ── LEY NUEVA YORK ───────────────────────────────────────────────────
export const ONS_NY_DATA: OnData[] = [
  // ENERGÍA
  { t:"YMCHD",  em:"YPF S.A.",             p:98.80, tir:8.50,  cup:9.0,   dur:2.1,  vto:"15/04/2027", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"YMCID",  em:"YPF S.A.",             p:96.80, tir:9.80,  cup:9.0,   dur:3.1,  vto:"01/09/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"VLCHD",  em:"Vista Energy",          p:97.80, tir:9.10,  cup:9.5,   dur:2.6,  vto:"15/12/2027", cal:"BB-", tipo:"Bullet",  freq:"Semestral" },
  { t:"PMCGD",  em:"Pampa Energía",         p:95.50, tir:10.50, cup:9.5,   dur:3.5,  vto:"01/09/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"TECPD",  em:"Tecpetrol S.A.",        p:97.00, tir:9.50,  cup:8.875, dur:2.9,  vto:"01/03/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"MSCHD",  em:"MSU Energy",            p:96.20, tir:10.20, cup:9.75,  dur:3.3,  vto:"01/05/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  { t:"GPGFD",  em:"Genneia S.A.",          p:96.50, tir:10.00, cup:8.75,  dur:3.2,  vto:"20/01/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  // TELECOM
  { t:"TCCFD",  em:"Telecom Argentina",     p:97.20, tir:9.20,  cup:8.875, dur:2.8,  vto:"01/03/2028", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  // FINANZAS
  { t:"IRFCD",  em:"IRSA Prop. Comerciales",p:92.00, tir:13.50, cup:12.0,  dur:5.2,  vto:"15/06/2031", cal:"B-",  tipo:"Amort.",   freq:"Semestral" },
  { t:"CECD",   em:"Cresud S.A.",           p:93.00, tir:12.50, cup:11.0,  dur:4.5,  vto:"01/06/2029", cal:"B",   tipo:"Bullet",  freq:"Semestral" },
  // INDUSTRIAL
  { t:"ARCHD",  em:"Arcor S.A.",            p:96.80, tir:9.60,  cup:9.0,   dur:3.0,  vto:"01/11/2027", cal:"B+",  tipo:"Bullet",  freq:"Semestral" },
  // INFRAESTRUCTURA
  { t:"MSCD",   em:"MSC Mediterranean Arg.",p:94.80, tir:11.20, cup:10.0,  dur:4.0,  vto:"15/08/2029", cal:"BB-", tipo:"Bullet",  freq:"Semestral" },
  { t:"ABCFD",  em:"ABC Capital",           p:93.20, tir:12.80, cup:11.5,  dur:4.8,  vto:"01/04/2030", cal:"B",   tipo:"Amort.",   freq:"Semestral" },
];

// ── CurvaChart ────────────────────────────────────────────────────────
function CurvaChart({
  data, color, label, corpPrices,
}: {
  data: OnData[]; color: string; label: string;
  corpPrices: Record<string, { price: number; pct: number }>;
}) {
  const t   = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setFs(false); };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const TIR_MAX = 20;
  const pts = data.filter(o => o.tir > 0 && o.tir <= TIR_MAX && o.dur > 0).sort((a, b) => a.dur - b.dur);
  const excl = data.filter(o => o.tir > TIR_MAX).length;
  if (!pts.length) return null;

  const W = 500, H = 260;
  const PAD = { l:48, r:16, t:24, b:44 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const maxDur = Math.max(...pts.map(p => p.dur), 1);
  const minTir = Math.min(...pts.map(p => p.tir));
  const maxTir = Math.max(...pts.map(p => p.tir));
  const range  = Math.max(maxTir - minTir, 0.5);
  const yPad   = range * 0.15;
  const xS = (d: number) => (d / maxDur) * cW;
  const yS = (v: number) => cH - ((v - minTir + yPad) / (range + 2 * yPad)) * cH;
  const coords = pts.map(p => [xS(p.dur), yS(p.tir)] as [number, number]);
  let path = `M${coords[0][0]},${coords[0][1]}`;
  for (let i = 1; i < coords.length; i++) {
    const [px,py]=coords[i-1],[cx,cy]=coords[i];
    path += ` C${(px+cx)/2},${py} ${(px+cx)/2},${cy} ${cx},${cy}`;
  }
  const fillId = `fill-on-${label.replace(/\s/g,"")}`;
  const grid = Array.from({length:5},(_,i) => {
    const v = minTir - yPad + i*(range+2*yPad)/4;
    return { v:v.toFixed(1), y:cH-(i/4)*cH };
  });

  return (
    <div ref={ref} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14, padding:"16px 18px", position:fs?"fixed":"relative", inset:fs?0:"auto", zIndex:fs?9999:"auto", overflow:fs?"auto":"visible" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color, letterSpacing:".1em", textTransform:"uppercase" }}>
          {label} · TIR vs Duration · {pts.length} ONs{excl>0?` (${excl} excl. >20%)`:""}
        </div>
        <button onClick={()=>{ if(!fs){ref.current?.requestFullscreen();setFs(true);}else{document.exitFullscreen();setFs(false);} }}
          style={{ padding:"3px 10px", borderRadius:6, fontFamily:FB, fontSize:9, border:`1px solid ${t.brd}`, background:t.alt, color:t.mu, cursor:"pointer" }}>
          {fs?"⊠ Cerrar":"⛶ Pantalla completa"}
        </button>
      </div>
      <svg width={W} height={H} style={{ overflow:"visible", fontFamily:FB, maxWidth:"100%" }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/>
          </linearGradient>
        </defs>
        <g transform={`translate(${PAD.l},${PAD.t})`}>
          {grid.map(({v,y},i) => (
            <g key={i}>
              <line x1={0} y1={y} x2={cW} y2={y} stroke={t.brd} strokeWidth={1} strokeDasharray="3,4" opacity={.5}/>
              <text x={-6} y={y+4} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text>
            </g>
          ))}
          {[0.5,1,2,3,4,5].filter(d=>d<=maxDur+0.3).map((d,i)=>(
            <g key={i}>
              <line x1={xS(d)} y1={cH} x2={xS(d)} y2={cH+4} stroke={t.mu} strokeWidth={1}/>
              <text x={xS(d)} y={cH+16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}a</text>
            </g>
          ))}
          <text x={cW/2} y={cH+36} textAnchor="middle" fontSize={9} fill={t.mu}>Duration (años)</text>
          <path d={`${path} L${coords[coords.length-1][0]},${cH} L${coords[0][0]},${cH} Z`} fill={`url(#${fillId})`}/>
          <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round"/>
          {pts.map((p, i) => {
            const live = corpPrices[p.t];
            return (
              <g key={i}>
                <circle cx={coords[i][0]} cy={coords[i][1]} r={live?5:4} fill={live?color:t.bg} stroke={color} strokeWidth={live?0:1.5}/>
                {live && <circle cx={coords[i][0]} cy={coords[i][1]} r={2.5} fill="#fff" opacity={.8}/>}
                <title>{p.t} · {p.em} · TIR: {p.tir.toFixed(2)}% · Dur: {p.dur.toFixed(1)}a</title>
                {i%2===0 && <text x={coords[i][0]} y={coords[i][1]-9} textAnchor="middle" fontSize={8} fontWeight={700} fill={color}>{p.t}</text>}
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10 }}>
        {pts.map((p,i) => {
          const live = corpPrices[p.t];
          return (
            <div key={i} style={{ background:t.alt, border:`1px solid ${color}22`, borderRadius:7, padding:"4px 9px", minWidth:80 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:2 }}>
                <span style={{ fontFamily:"monospace", fontSize:9, fontWeight:700, color }}>{p.t}</span>
                {live && <span style={{ width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block" }}/>}
              </div>
              <div style={{ fontFamily:FH, fontSize:12, fontWeight:700, color:p.tir>=10?t.gr:p.tir>=7?t.go:t.mu }}>{p.tir.toFixed(2)}%</div>
              <div style={{ fontFamily:FB, fontSize:8, color:t.fa }}>{p.dur.toFixed(1)}a · {p.vto}</div>
            </div>
          );
        })}
      </div>
      {excl>0 && <p style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:8 }}>* {excl} instrumento{excl>1?"s":""} con TIR &gt; 20% excluido{excl>1?"s":""} de la curva.</p>}
    </div>
  );
}

// ── ONs Calculator ────────────────────────────────────────────────────
function ONsCalc({ allONs, corpPrices }: { allONs: OnData[]; corpPrices: Record<string, { price: number; pct: number }> }) {
  const t = useAppTheme();
  const [ticker,   setTicker]   = useState(allONs[0]?.t ?? "");
  const [monto,    setMonto]    = useState("10000");
  const [comision, setComision] = useState("0.5");

  const sel = allONs.find(o => o.t === ticker) ?? allONs[0];
  if (!sel) return null;

  const live     = corpPrices[sel.t];
  const precio   = live?.price ?? sel.p;
  const montoNum = parseFloat(monto.replace(/\./g,"")) || 0;
  const comPct   = parseFloat(comision.replace(",",".")) || 0;
  const precioC  = precio * (1 + comPct/100);

  // Láminas: cada lámina = $100 VN, comprada al precio (por $100 VN)
  const laminas  = montoNum > 0 ? Math.floor(montoNum / precioC) : 0;
  const capital  = laminas * precioC;
  const freqMult = sel.freq.toLowerCase().includes("trim") ? 4 : 2;
  const cpnPago  = sel.cup / freqMult;
  const nPagos   = Math.max(1, Math.round(sel.dur * freqMult));

  // Flujos estimados (cupones + bullet al final)
  const flujos = Array.from({length:nPagos}, (_,i) => {
    const isLast = i === nPagos - 1;
    return {
      n:      i+1,
      meses:  Math.round((i+1)*12/freqMult),
      cupon:  cpnPago * laminas,
      amort:  isLast ? 100 * laminas : 0,
      total:  cpnPago * laminas + (isLast ? 100 * laminas : 0),
    };
  });

  const totalCupones = cpnPago * nPagos * laminas;
  const totalRecibido = totalCupones + 100 * laminas;
  const ganancia = totalRecibido - capital;
  const retPct  = capital > 0 ? ganancia/capital*100 : 0;
  const fmtUSD  = (n:number) => `$${n.toLocaleString("es-AR",{maximumFractionDigits:0})}`;

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Instrumento</label>
          <select value={ticker} onChange={e=>setTicker(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:"monospace", fontSize:12, fontWeight:700, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}>
            <optgroup label="Ley Argentina">
              {ONS_ARG_DATA.map(o=><option key={o.t} value={o.t}>{o.t} — {o.em} ({o.tir.toFixed(1)}% TIR)</option>)}
            </optgroup>
            <optgroup label="Ley Nueva York">
              {ONS_NY_DATA.map(o=><option key={o.t} value={o.t}>{o.t} — {o.em} ({o.tir.toFixed(1)}% TIR)</option>)}
            </optgroup>
          </select>
        </div>
        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Monto (USD)</label>
          <input type="text" value={Number(monto.replace(/\./g,"")).toLocaleString("es-AR")}
            onChange={e=>setMonto(e.target.value.replace(/\./g,"").replace(/[^0-9]/g,""))}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
        </div>
        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Comisión (%)</label>
          <input type="text" value={comision} onChange={e=>setComision(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
        </div>
      </div>

      <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:14 }}>
        <strong style={{ color:t.tx }}>{sel.t}</strong> · {sel.em} · Vto: {sel.vto} · {sel.freq} · Cal: {sel.cal}
        · Precio: <strong style={{ color:live?t.gr:t.mu }}>${precio.toFixed(2)}</strong>
        {live && <span style={{ marginLeft:6, fontSize:9, background:"#22c55e", color:"#fff", padding:"1px 5px", borderRadius:3 }}>LIVE</span>}
        · TIR: <strong style={{ color:t.go }}>{sel.tir.toFixed(2)}%</strong>
        · Cupón: {sel.cup.toFixed(2)}% anual
      </div>

      {laminas > 0 && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:16 }}>
            {[
              { l:"Láminas",        v:`${laminas}`,           c:t.tx },
              { l:"Capital",        v:fmtUSD(capital),        c:t.tx },
              { l:"TIR",            v:`${sel.tir.toFixed(2)}%`, c:t.go },
              { l:"Cupón anual",    v:`${sel.cup.toFixed(2)}%`, c:t.bl },
              { l:"Total cupones",  v:fmtUSD(totalCupones),   c:t.bl },
              { l:"Total a cobrar", v:fmtUSD(totalRecibido),  c:t.bl },
              { l:"Ganancia",       v:fmtUSD(ganancia),       c:ganancia>=0?t.gr:t.rd },
              { l:"Retorno %",      v:`${retPct>=0?"+":""}${retPct.toFixed(1)}%`, c:retPct>=0?t.gr:t.rd },
            ].map((k,i) => (
              <div key={i} style={{ background:t.alt, borderRadius:12, padding:"12px 14px", border:`1px solid ${t.brd}` }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:4, textTransform:"uppercase", letterSpacing:".06em" }}>{k.l}</div>
                <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:k.c }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Flow table */}
          <div style={{ overflowX:"auto", maxHeight:"40vh", overflowY:"auto", borderRadius:12, border:`1px solid ${t.brd}` }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
              <thead><tr>
                {["Pago #","Meses","Cupón USD","Amort. USD","Total USD"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px", textAlign:"right", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:2 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {flujos.map((f,i) => (
                  <tr key={i} style={{ background:f.amort>0?t.goBg:(i%2===0?t.alt+"44":"transparent"), borderBottom:`1px solid ${t.brd}22` }}>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>#{f.n}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{f.meses}m</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:t.gr, fontWeight:600 }}>{fmtUSD(f.cupon)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:f.amort>0?t.go:t.fa, fontWeight:f.amort>0?700:400 }}>{f.amort>0?fmtUSD(f.amort):"—"}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:t.tx, fontWeight:700 }}>{fmtUSD(f.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:10, lineHeight:1.6 }}>
            Flujos estimados (cupones + amortización bullet) · TIR de referencia · No constituye asesoramiento.
          </p>
        </>
      )}
    </div>
  );
}

// ── Main ONsPanel ──────────────────────────────────────────────────────
export function ONsPanel() {
  const t = useAppTheme();
  const [corpPrices, setCorpPrices] = useState<Record<string, { price: number; pct: number }>>({});
  const [status,     setStatus]     = useState("loading");
  const [search,     setSearch]     = useState("");
  const [sortCol,    setSortCol]    = useState("dur");
  const [sortDir,    setSortDir]    = useState<1|-1>(1);
  const [sub,        setSub]        = useState("cotiz");

  const TIR_THRESHOLD = 5.3;
  const allONs = [...ONS_ARG_DATA, ...ONS_NY_DATA];

  useEffect(() => {
    const load = async () => {
      try {
        const r    = await fetch("/api/equities?type=corp");
        const json = await r.json();
        setCorpPrices(json.map || {});
        setStatus(Object.keys(json.map || {}).length > 0 ? "ok" : "empty");
      } catch { setStatus("error"); }
    };
    load();
    const id = setInterval(load, 300000);
    return () => clearInterval(id);
  }, []);

  const sort = (col: string) => {
    if (sortCol===col) setSortDir(d => d===1?-1:1);
    else { setSortCol(col); setSortDir(1); }
  };

  const renderTable = (label: string, data: OnData[], color: string) => {
    const filtered = data
      .filter(o => !search.trim() || o.t.toLowerCase().includes(search.toLowerCase()) || o.em.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const av = (a as unknown as Record<string, number>)[sortCol];
        const bv = (b as unknown as Record<string, number>)[sortCol];
        if (av==null) return 1; if (bv==null) return -1;
        return (av>bv?1:-1)*sortDir;
      });
    return (
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
          {label} — {filtered.length} instrumentos
        </div>
        <div style={{ background:t.srf, borderRadius:12, border:`1px solid ${t.brd}`, overflow:"hidden" }}>
          <div style={{ overflowX:"auto", maxHeight:"55vh", overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
              <thead><tr>
                {(["t","em","p","tir","cup","dur","vto","cal","tipo"] as const).map(col=>(
                  <th key={col} onClick={()=>sort(col)} style={{ padding:"8px 10px", textAlign:["p","tir","cup","dur"].includes(col)?"right":"left", fontSize:9, fontWeight:700, color:sortCol===col?t.go:t.mu, letterSpacing:".06em", textTransform:"uppercase", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, cursor:"pointer", whiteSpace:"nowrap" }}>
                    {({t:"Ticker",em:"Emisor",p:"Precio",tir:"TIR",cup:"Cupón",dur:"Dur.",vto:"Vto.",cal:"Cal.",tipo:"Tipo"})[col]}
                    {sortCol===col?(sortDir===1?" ↑":" ↓"):""}
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((o, i) => {
                  const live = corpPrices[o.t];
                  const px   = live?.price ?? o.p;
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${t.brd}22` }}
                      onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <td style={{ padding:"6px 10px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:4, background:color+"15", color, border:`1px solid ${color}33` }}>{o.t}</span>
                          {live && <span style={{ width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e" }}/>}
                        </div>
                      </td>
                      <td style={{ padding:"6px 10px", fontSize:10, color:t.tx, fontWeight:500, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.em}</td>
                      <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700, color:live?t.tx:t.mu }}>${px.toFixed(2)}</td>
                      <td style={{ padding:"6px 10px", textAlign:"right" }}>
                        <span style={{ fontWeight:700, color:o.tir>=9?t.gr:o.tir>=6?t.go:t.mu }}>{o.tir.toFixed(2)}%</span>
                      </td>
                      <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.cup.toFixed(1)}%</td>
                      <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.dur.toFixed(1)}a</td>
                      <td style={{ padding:"6px 10px", fontSize:10, color:t.mu }}>{o.vto}</td>
                      <td style={{ padding:"6px 10px" }}>
                        <span style={{ fontSize:9, fontWeight:600, padding:"1px 5px", borderRadius:4, background:o.cal.startsWith("AA")?t.grBg:o.cal.startsWith("A")?t.blBg:t.goBg, color:o.cal.startsWith("AA")?t.gr:o.cal.startsWith("A")?t.bl:t.go }}>{o.cal}</span>
                      </td>
                      <td style={{ padding:"6px 10px", fontSize:9, color:t.fa }}>{o.tipo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Sell signals with live TIR recalc
  const sellCandidates = allONs
    .map(o => {
      const live = corpPrices[o.t];
      if (!live || !o.p) return o;
      const tirLive = o.tir * (o.p / live.price);
      return { ...o, tir:parseFloat(tirLive.toFixed(2)), _live:true, _price:live.price, _pct:live.pct };
    })
    .filter(o => o.tir > 0 && o.tir < TIR_THRESHOLD)
    .sort((a,b) => a.tir-b.tir);

  return (
    <div>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0A1E3D,#14355A,#1A4270)", borderRadius:16, padding:"22px 28px", marginBottom:20, border:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:"rgba(255,255,255,.4)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:4 }}>MERCADO SECUNDARIO</div>
            <h2 style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:"#fff", margin:0 }}>
              Obligaciones <span style={{ color:"#4A90D9" }}>Negociables</span>
            </h2>
            <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.5)", marginTop:6 }}>{ONS_ARG_DATA.length+ONS_NY_DATA.length} instrumentos · {ONS_ARG_DATA.length} Ley ARG · {ONS_NY_DATA.length} Ley NY</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.06)", borderRadius:10, padding:"8px 16px", border:"1px solid rgba(255,255,255,.08)" }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:status==="ok"?"#22c55e":"#f59e0b",boxShadow:status==="ok"?"0 0 8px #22c55e":"none" }}/>
            <span style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:"rgba(255,255,255,.8)" }}>
              {status==="ok"?`${Object.keys(corpPrices).length} precios live`:status==="error"?"Sin datos live":"Cargando..."}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[
          { id:"cotiz", label:"Cotizaciones",          Icon:BarChart3 },
          { id:"curva", label:"Curva de Rendimientos", Icon:LineChart },
          { id:"calc",  label:"Calculadora",           Icon:BarChart3 },
          { id:"sell",  label:"Señales de Venta",      Icon:AlertTriangle },
        ].map(s=>(
          <button key={s.id} onClick={()=>setSub(s.id)} style={{ padding:"7px 16px", borderRadius:8, fontFamily:FB, fontSize:11, fontWeight:600, cursor:"pointer", border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.go+"15":"transparent", color:sub===s.id?t.go:t.mu, display:"flex", alignItems:"center", gap:5 }}>
            <s.Icon size={13}/> {s.label}
          </button>
        ))}
      </div>

      {/* Cotizaciones */}
      {sub==="cotiz" && (
        <>
          <div style={{ position:"relative", marginBottom:14 }}>
            <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker o emisor..."
              style={{ fontFamily:FB, fontSize:12, padding:"8px 12px 8px 32px", borderRadius:10, width:240, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}/>
          </div>
          {renderTable("LEY ARGENTINA", ONS_ARG_DATA, t.go)}
          {renderTable("LEY NUEVA YORK", ONS_NY_DATA, t.bl)}
        </>
      )}

      {/* Curva */}
      {sub==="curva" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(500px,1fr))", gap:16 }}>
            <CurvaChart data={ONS_ARG_DATA} color={t.go} label="LEY ARGENTINA" corpPrices={corpPrices}/>
            <CurvaChart data={ONS_NY_DATA}  color={t.bl} label="LEY NUEVA YORK" corpPrices={corpPrices}/>
          </div>
          <p style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:10, lineHeight:1.7 }}>
            TIR calculada sobre precio de mercado · Puntos con relleno = precio live · Instrumentos con TIR &gt; 20% excluidos.
          </p>
        </div>
      )}

      {/* Calculadora */}
      {sub==="calc" && <ONsCalc allONs={allONs} corpPrices={corpPrices}/>}

      {/* Señales venta */}
      {sub==="sell" && (
        <div>
          <div style={{ background:t.rdBg, border:`1px solid ${t.rd}44`, borderRadius:10, padding:"14px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:16, lineHeight:1.6, display:"flex", alignItems:"flex-start", gap:10 }}>
            <AlertTriangle size={16} style={{ flexShrink:0, marginTop:2 }}/>
            <div><strong>Señales de venta:</strong> ONs con TIR ajustada (con precio live) menor a {TIR_THRESHOLD}%. Considerá rotar a mayor rendimiento.</div>
          </div>
          {sellCandidates.length===0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", fontFamily:FB, fontSize:14, color:t.mu }}>
              ✅ Ninguna ON cotiza debajo del {TIR_THRESHOLD}% actualmente.
            </div>
          ) : (
            <div style={{ background:t.srf, borderRadius:12, border:`1px solid ${t.brd}`, overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
                  <thead><tr>
                    {["Ticker","Emisor","TIR","Cupón","Precio","Duration","Vto.","Ley",""].map(h=>(
                      <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sellCandidates.map((o,i) => {
                      const isNY = ONS_NY_DATA.some(x=>x.t===o.t);
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid ${t.brd}22` }}>
                          <td style={{ padding:"6px 10px" }}>
                            <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:4, background:t.rd+"15", color:t.rd }}>{o.t}</span>
                          </td>
                          <td style={{ padding:"6px 10px", fontSize:10, color:t.tx }}>{o.em}</td>
                          <td style={{ padding:"6px 10px", fontWeight:700, color:t.rd }}>
                            {o.tir.toFixed(2)}%
                            {"_live" in o && o._live && <span style={{ marginLeft:4, fontSize:7, background:"#22c55e", color:"#fff", padding:"1px 4px", borderRadius:3 }}>LIVE</span>}
                          </td>
                          <td style={{ padding:"6px 10px", color:t.mu }}>{o.cup.toFixed(1)}%</td>
                          <td style={{ padding:"6px 10px", fontWeight:600, color:t.tx }}>${("_price" in o?o._price:o.p).toFixed(2)}</td>
                          <td style={{ padding:"6px 10px", color:t.mu }}>{o.dur.toFixed(1)}a</td>
                          <td style={{ padding:"6px 10px", fontSize:10, color:t.mu }}>{o.vto}</td>
                          <td style={{ padding:"6px 10px" }}>
                            <span style={{ fontSize:9, fontWeight:600, padding:"1px 5px", borderRadius:4, background:isNY?t.blBg:t.goBg, color:isNY?t.bl:t.go }}>{isNY?"NY":"ARG"}</span>
                          </td>
                          <td style={{ padding:"6px 10px" }}>
                            <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.rd, background:t.rdBg, padding:"3px 8px", borderRadius:6 }}>VENDER</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
