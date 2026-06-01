"use client";

/**
 * components/renta-fija/lecap-calc.tsx
 * Calculadora de LECAP / BONCAP
 * Muestra: rendimiento total, TEM, TNA, capital final dado un monto de inversión
 */

import { useState, useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import { LECAP } from "@/lib/data/renta-fija";

interface LecapCalcProps {
  lecapLive:  Record<string, { price: number; pct?: number }>;
  bondPrices: Record<string, { price: number; pct?: number }>;
}

const BASE_DATE = new Date("2026-03-19");

export function LecapCalc({ lecapLive, bondPrices }: LecapCalcProps) {
  const t = useAppTheme();
  const [selTicker, setSelTicker] = useState("");
  const [monto,     setMonto]     = useState("100000");
  const [comision,  setComision]  = useState("0.5");

  const daysSince = Math.floor((Date.now() - BASE_DATE.getTime()) / 86400000);

  // Build flat list of all active LECAPs with live metrics
  const instruments = useMemo(() => {
    return LECAP
      .filter(g => {
        // Auto-expire: skip if vencido
        const [d,m,y] = g.vto.split("/").map(Number);
        return new Date(y, m-1, d) >= new Date();
      })
      .flatMap(g => g.rows.map(row => {
        const pBase  = parseFloat(row.pre.replace("$","").replace(/\./g,"").replace(",","."));
        const rBase  = parseFloat(row.r.replace("%","").replace(",",".")) / 100;
        const temBase= parseFloat(row.tem.replace("%","").replace(",",".")) / 100;
        const tnaBase= parseFloat(row.tna.replace("%","").replace(",",".")) / 100;
        if (!pBase) return null;

        const vnVto    = pBase * (1 + rBase);
        const diasRest = Math.max(1, g.dias - daysSince);
        const vto      = g.vto;
        const mes      = g.mes ?? g.vto;

        // Live price
        const isS    = row.t.startsWith("S");
        const liveD  = isS ? lecapLive[row.t] : bondPrices[row.t];
        const pLive  = liveD?.price > 0 ? liveD.price : pBase * Math.pow(1 + temBase, daysSince/30);
        const isLive = !!(liveD?.price > 0);

        // Validate: skip impossible values
        if (pLive <= 0 || diasRest <= 0) return null;

        const rendimiento = (vnVto / pLive - 1) * 100;
        const temLive     = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;
        const tnaLive     = rendimiento * (365 / diasRest);

        // Sanity check: TNA > 200% is almost certainly a data error
        if (tnaLive > 200 || tnaLive < 0) return null;

        return {
          ticker: row.t,
          mes,
          vto,
          diasRest,
          pBase,
          pLive,
          vnVto,
          rendimiento,
          tem: temLive,
          tna: tnaLive,
          isLive,
          isBoncap: !row.t.startsWith("S"),
        };
      }))
      .filter(Boolean) as Array<NonNullable<ReturnType<typeof Array.prototype.map>[0]>>;
  }, [lecapLive, bondPrices, daysSince]);

  const sel = instruments.find(i => i.ticker === selTicker) ?? instruments[0];
  const ticker = sel?.ticker ?? "";

  const montoNum = parseFloat(monto.replace(/\./g,"")) || 0;
  const comPct   = parseFloat(comision.replace(",",".")) || 0;

  // Láminas: cada lámina es un nominal de $1 → invertimos $pLive para recibir $vnVto
  // En realidad: compramos VN al precio (por c/u de VN), ej precio $104 = $104 por $100 VN
  // Láminas (de $100 VN) = floor(monto / (precio * (1+com/100)))
  const precioC = sel ? sel.pLive * (1 + comPct/100) : 0;
  const laminas = sel && montoNum > 0 ? Math.floor(montoNum / precioC) : 0;
  const capital = laminas * precioC;

  // Al vencimiento recibo vnVto por cada lámina de $100 VN
  const cobrado    = laminas * sel?.vnVto ?? 0;
  const ganancia   = cobrado - capital;
  const retPct     = capital > 0 ? ganancia/capital*100 : 0;
  const fmtARS     = (n:number) => `$${n.toLocaleString("es-AR",{maximumFractionDigits:0})}`;
  const fmtPct     = (n:number, d=2) => `${n>=0?"+":""}${n.toFixed(d)}%`;

  // Annualized return
  const retAnual = sel && sel.diasRest > 0
    ? (Math.pow(cobrado/capital, 365/sel.diasRest) - 1) * 100
    : 0;

  return (
    <div>
      {/* Instrument selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
            Instrumento ({instruments.length} activos)
          </label>
          <select
            value={ticker}
            onChange={e => setSelTicker(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:"monospace", fontSize:12, fontWeight:700, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}
          >
            {instruments.map(i => (
              <option key={i.ticker} value={i.ticker}>
                {i.ticker} — {i.mes} · TEM {i.tem.toFixed(2)}% · TNA {i.tna.toFixed(2)}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
            Monto a invertir (ARS)
          </label>
          <input
            type="text"
            value={Number(monto.replace(/\./g,"")).toLocaleString("es-AR")}
            onChange={e => setMonto(e.target.value.replace(/\./g,"").replace(/[^0-9]/g,""))}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}
          />
        </div>

        <div>
          <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
            Comisión (%)
          </label>
          <input
            type="text" value={comision} onChange={e => setComision(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}
          />
        </div>
      </div>

      {/* Instrument info */}
      {sel && (
        <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:14, padding:"10px 14px", background:t.alt, borderRadius:10, border:`1px solid ${t.brd}` }}>
          <strong style={{ color:t.tx }}>{sel.ticker}</strong>
          {" "}· {sel.isBoncap ? "BONCAP" : "LECAP"}
          {" "}· Vto: <strong>{sel.vto}</strong>
          {" "}· {sel.diasRest}d restantes
          {" "}· Precio: <strong style={{ color:sel.isLive?t.gr:t.mu }}>{fmtARS(sel.pLive)}</strong>
          {sel.isLive && <span style={{ marginLeft:6, fontSize:9, background:"#22c55e", color:"#fff", padding:"1px 5px", borderRadius:3 }}>LIVE</span>}
          {" "}· VN al vto: <strong>{fmtARS(sel.vnVto)}</strong>
        </div>
      )}

      {/* KPIs */}
      {sel && montoNum > 0 && laminas > 0 && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:20 }}>
            {[
              { l:"TEM live",       v:fmtPct(sel.tem),    c:t.go },
              { l:"TNA live",       v:fmtPct(sel.tna),    c:t.bl },
              { l:"Rendto. total",  v:fmtPct(sel.rendimiento), c:t.go },
              { l:"Ret. anualizado",v:fmtPct(retAnual),   c:t.go },
              { l:"Láminas (VN)",   v:`${laminas}`,        c:t.tx },
              { l:"Capital",        v:fmtARS(capital),     c:t.tx },
              { l:"Cobrado al vto.", v:fmtARS(cobrado),   c:t.bl },
              { l:"Ganancia",       v:fmtARS(ganancia),   c:ganancia>=0?t.gr:t.rd },
              { l:"Retorno neto %", v:fmtPct(retPct),     c:retPct>=0?t.gr:t.rd },
            ].map((k, i) => (
              <div key={i} style={{ background:t.alt, borderRadius:12, padding:"12px 14px", border:`1px solid ${t.brd}` }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:4, textTransform:"uppercase", letterSpacing:".06em" }}>{k.l}</div>
                <div style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:k.c }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Visual summary */}
          <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14, padding:"20px 24px" }}>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
              Resumen de la inversión
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:4 }}>INVERTÍS</div>
                <div style={{ fontFamily:FH, fontSize:28, fontWeight:800, color:t.tx }}>{fmtARS(capital)}</div>
              </div>
              <div style={{ fontFamily:FH, fontSize:28, color:t.mu }}>→</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:4 }}>COBRADO AL VTO. ({sel.diasRest}d)</div>
                <div style={{ fontFamily:FH, fontSize:28, fontWeight:800, color:t.bl }}>{fmtARS(cobrado)}</div>
              </div>
              <div style={{ fontFamily:FH, fontSize:28, color:t.mu }}>=</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:4 }}>GANANCIA</div>
                <div style={{ fontFamily:FH, fontSize:28, fontWeight:800, color:ganancia>=0?t.gr:t.rd }}>
                  {fmtARS(ganancia)} ({fmtPct(retPct,1)})
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, lineHeight:1.6 }}>
            Cálculo con precio {sel.isLive?"live":"estimado"} · TEM y TNA calculadas sobre precio actual y días restantes ·
            Valores con TNA {">"} 200% o {"<"} 0% son excluidos por ser probablemente errores de datos.
            No constituye asesoramiento de inversión.
          </p>
        </>
      )}

      {/* Best options table */}
      <div style={{ marginTop:24 }}>
        <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>
          RANKING POR TEM — TODOS LOS INSTRUMENTOS ACTIVOS
        </div>
        <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
              <thead><tr>
                {["Ticker","Tipo","Vto.","Días","Precio","TEM","TNA","Rdto."].map((h,i)=>(
                  <th key={i} style={{ padding:"8px 10px", textAlign:i>3?"right":"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:2 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...instruments].sort((a,b)=>b.tem-a.tem).map((ins, i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${t.brd}22`, cursor:"pointer" }}
                    onClick={()=>setSelTicker(ins.ticker)}
                    onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                    onMouseLeave={e=>(e.currentTarget.style.background=ins.ticker===ticker?t.blBg+"44":"transparent")}>
                    <td style={{ padding:"6px 10px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:ins.ticker===ticker?t.bl:t.tx }}>{ins.ticker}</span>
                        {ins.isLive && <span style={{ width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e" }}/>}
                      </div>
                    </td>
                    <td style={{ padding:"6px 10px" }}>
                      <span style={{ fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:4, background:ins.isBoncap?t.puBg:t.goBg, color:ins.isBoncap?t.pu:t.go }}>{ins.isBoncap?"BONCAP":"LECAP"}</span>
                    </td>
                    <td style={{ padding:"6px 10px", color:t.mu, fontSize:10 }}>{ins.vto}</td>
                    <td style={{ padding:"6px 10px", color:t.fa, textAlign:"right" }}>{ins.diasRest}d</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:ins.isLive?t.gr:t.mu }}>{fmtARS(ins.pLive)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700, color:t.go }}>{fmtPct(ins.tem)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700, color:t.bl }}>{fmtPct(ins.tna)}</td>
                    <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{fmtPct(ins.rendimiento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:8 }}>Hacé click en una fila para seleccionarla en la calculadora.</p>
      </div>
    </div>
  );
}
