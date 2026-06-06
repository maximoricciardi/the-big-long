"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP, DUALES, TAMAR, DOLARLINKED, BONOS_CER } from "@/lib/data/renta-fija";
import { FB, FH } from "@/lib/constants";
import { SovYieldCurve } from "@/components/renta-fija/sov-yield-curve";
import { ONsPanel } from "@/components/renta-fija/ons-panel";
import { LecapCalc } from "@/components/renta-fija/lecap-calc";
import { SoberanosCalc } from "@/components/renta-fija/soberanos-calc";
import { RentaFijaMarketProvider, useRentaFijaMarketContext } from "@/components/renta-fija/renta-fija-market-context";
import { DataQualityBadge } from "@/components/renta-fija/data-quality-badge";
import { REFERENCE_AS_OF, REFRESH_MS, daysToMaturity, isVtoActive, type LecapComputed } from "@/lib/renta-fija";

const LECAP_ACTIVE = LECAP.filter(g => !g.vto || isVtoActive(g.vto));

const TABS_RF = [
  { id:"lecap",   label:"LECAPs / BONCAPs" },
  { id:"curva",   label:"Curva ARS" },
  { id:"sob",     label:"Soberanos USD" },
  { id:"sovcurva",label:"Curva USD" },
  { id:"ons",      label:"ONs Corporativos" },
  { id:"calclecap",label:"Calc. LECAP" },
  { id:"calcsob",  label:"Calc. Soberanos" },
  { id:"duales",   label:"Duales" },
  { id:"tamar",   label:"TAMAR" },
  { id:"cer",     label:"CER" },
  { id:"dl",      label:"Dólar Linked" },
];

const BASE_TC_A3500 = 1399.60;

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  const t = useAppTheme();
  return (
    <th style={{ padding:"10px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:750, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", borderBottom:`1px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap", position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
}

function Td({ children, right, bold, color }: { children: React.ReactNode; right?: boolean; bold?: boolean; color?: string }) {
  const t = useAppTheme();
  return (
    <td style={{ padding:"9px 12px", textAlign:right?"right":"left", fontSize:12, fontWeight:bold?700:430, color:color||t.tx, whiteSpace:"nowrap", fontVariantNumeric:right?"tabular-nums":undefined }}>
      {children}
    </td>
  );
}

function LiveStatusChip({ uvaIndex, tamarRate }: { uvaIndex: number|null; tamarRate: number|null }) {
  const t = useAppTheme();
  const { status } = useRentaFijaMarketContext();
  const [secsAgo, setSecsAgo] = useState(0);
  useEffect(() => {
    if (!status.lastUpdate) return;
    const id = setInterval(() => setSecsAgo(Math.floor((Date.now() - status.lastUpdate!.getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [status.lastUpdate]);
  const nextIn = Math.max(0, Math.round(REFRESH_MS / 1000 - secsAgo));
  const lastStr = status.lastUpdate
    ? status.lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;
  const ok = status.bondsOk || status.notesOk;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 12px", borderRadius:6, fontFamily:FB, fontSize:11, whiteSpace:"nowrap", border:`1px solid ${ok?t.gr+"55":t.brd}`, background:ok?t.grBg:t.alt, color:ok?t.gr:t.mu }}>
      <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", background:ok?"#22c55e":"#94a3b8", boxShadow:ok?"0 0 6px #22c55e":"none" }} />
      {status.loading ? "Cargando DATA912..." : (lastStr ? `Últ: ${lastStr} · Refresh ${nextIn}s · LECAP ${status.matchedLecap} · SOV ${status.matchedSov}` : "Precios teóricos")}
      {uvaIndex != null && <span style={{opacity:.7}}>· UVA {uvaIndex.toFixed(2)}</span>}
      {tamarRate != null && <span style={{opacity:.7}}>· TAMAR {tamarRate.toFixed(2)}%</span>}
    </div>
  );
}

function LecapCurva() {
  const t = useAppTheme();
  const { lecapRows } = useRentaFijaMarketContext();

  const points = lecapRows
    .filter((r: LecapComputed) => r.temLive != null && r.temLive > 0 && r.temLive < 10 && !r.flags.includes("tna_outlier"))
    .map(r => ({
      ticker: r.ticker,
      dias: r.diasRest,
      tem: r.temLive!,
      tna: r.tnaLive!,
      isLive: r.isLive,
      isBoncap: r.isBoncap,
    }))
    .sort((a, b) => a.dias - b.dias);

  if (points.length < 3) return <p style={{ fontFamily:FB, fontSize:12, color:t.mu }}>Sin suficientes datos para la curva.</p>;

  const W = 580, H = 280;
  const PAD = { l:52, r:20, t:28, b:52 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;

  const maxDias = Math.max(...points.map(p => p.dias), 1);
  const minTEM  = Math.min(...points.map(p => p.tem));
  const maxTEM  = Math.max(...points.map(p => p.tem));
  const range   = Math.max(maxTEM - minTEM, 0.3);
  const yPad    = range * 0.2;

  const xS = (d: number) => (d / maxDias) * cW;
  const yS = (v: number) => cH - ((v - minTEM + yPad) / (range + 2 * yPad)) * cH;

  const coords = points.map(p => [xS(p.dias), yS(p.tem)] as [number, number]);
  let path = `M${coords[0][0]},${coords[0][1]}`;
  for (let i = 1; i < coords.length; i++) {
    const [px,py] = coords[i-1], [cx,cy] = coords[i];
    const cpx = (px+cx)/2;
    path += ` C${cpx},${py} ${cpx},${cy} ${cx},${cy}`;
  }

  const yTicks = 5;
  const grid = Array.from({length:yTicks},(_,i) => {
    const v = minTEM - yPad + i*(range+2*yPad)/(yTicks-1);
    return { v: v.toFixed(2), y: cH - (i/(yTicks-1))*cH };
  });

  // X axis: days labels
  const xLabels = [30,60,90,120,180,270,365,468].filter(d => d <= maxDias + 20);

  return (
    <div style={{ background:`linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01)), ${t.srf}`, border:`1px solid ${t.brd}`, borderRadius:8, padding:"18px 20px", marginBottom:20, boxShadow:t.sh }}>
      <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.go, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>
        CURVA DE RENDIMIENTOS ARS · TEM % vs Días al Vencimiento
        <span style={{ marginLeft:8, fontFamily:FB, fontSize:9, color:t.fa, fontWeight:400 }}>
          {points.filter(p=>p.isLive).length} con precio live · se excluyen vencidos automáticamente
        </span>
      </div>
      <svg width={W} height={H} style={{ overflow:"visible", fontFamily:FB, maxWidth:"100%" }}>
        <defs>
          <linearGradient id="lecapFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.go} stopOpacity="0.16"/>
            <stop offset="100%" stopColor={t.go} stopOpacity="0.01"/>
          </linearGradient>
        </defs>
        <g transform={`translate(${PAD.l},${PAD.t})`}>
          {grid.map(({v,y},i) => (
            <g key={i}>
              <line x1={0} y1={y} x2={cW} y2={y} stroke={t.brd} strokeWidth={1} strokeDasharray="3,4" opacity={.5}/>
              <text x={-6} y={y+4} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text>
            </g>
          ))}
          {xLabels.map((d,i) => (
            <g key={i}>
              <line x1={xS(d)} y1={cH} x2={xS(d)} y2={cH+4} stroke={t.mu} strokeWidth={1}/>
              <text x={xS(d)} y={cH+16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}d</text>
            </g>
          ))}
          <text x={cW/2} y={cH+36} textAnchor="middle" fontSize={9} fill={t.mu}>Días al vencimiento</text>
          <text transform={`rotate(-90) translate(${-cH/2},${-40})`} textAnchor="middle" fontSize={9} fill={t.mu}>TEM (%)</text>

          <path d={`${path} L${coords[coords.length-1][0]},${cH} L${coords[0][0]},${cH} Z`} fill="url(#lecapFill)"/>
          <path d={path} stroke={t.go} strokeWidth={2.5} fill="none" strokeLinecap="round"/>

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={coords[i][0]} cy={coords[i][1]} r={p.isLive ? 5 : 4}
                fill={p.isLive ? t.go : t.bg} stroke={p.isBoncap ? t.pu : t.go} strokeWidth={p.isLive ? 0 : 1.5}/>
              {p.isLive && <circle cx={coords[i][0]} cy={coords[i][1]} r={2.5} fill="#fff" opacity={.8}/>}
              <title>{p.ticker} · TEM: {p.tem.toFixed(2)}% · TNA: {p.tna.toFixed(2)}% · {p.dias}d</title>
              {i % 2 === 0 && (
                <text x={coords[i][0]} y={coords[i][1]-9} textAnchor="middle" fontSize={7} fontWeight={700} fill={p.isBoncap ? t.pu : t.go}>{p.ticker}</text>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginTop:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:t.go, display:"inline-block" }}/>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu }}>LECAP (S-prefix)</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:t.pu, display:"inline-block" }}/>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu }}>BONCAP (T-prefix)</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:t.go, border:"1.5px solid rgba(0,0,0,.2)", display:"inline-block" }}/>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu }}>Precio live</span>
        </div>
      </div>
      <p style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:8 }}>
        Curva TEM calculada con precios live DATA912 donde disponible.
        Instrumentos vencidos excluidos automáticamente.
      </p>
    </div>
  );
}

function RentaFijaViewInner() {
  const t = useAppTheme();
  const [sub, setSub] = useState("lecap");
  const { lecapByTicker, sovRows, bondPrices } = useRentaFijaMarketContext();
  const [uvaIndex, setUvaIndex] = useState<number|null>(null);
  const [tamarRate, setTamarRate] = useState<number|null>(null);

  const loadAux = useCallback(async () => {
    try {
      const r = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva");
      const data = await r.json();
      if (Array.isArray(data) && data.length > 0) setUvaIndex(parseFloat(data[data.length - 1].valor));
    } catch {}
    try {
      const r = await fetch("/api/bcra?list=1");
      const data = await r.json();
      const tamar = (data.results || []).find((v: { descripcion?: string; ultValorInformado?: number }) =>
        (v.descripcion || "").toLowerCase().includes("tamar") &&
        (v.descripcion || "").toLowerCase().includes("privad")
      );
      if (tamar?.ultValorInformado) setTamarRate(parseFloat(tamar.ultValorInformado));
    } catch {}
  }, []);

  useEffect(() => {
    loadAux();
    const id = setInterval(loadAux, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadAux]);

  const trStyle = { borderBottom:`1px solid ${t.brd}`, transition:"background .12s" } as React.CSSProperties;
  const tableCtr = {
    background:`linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01)), ${t.srf}`,
    border:`1px solid ${t.brd}`, borderRadius:8, boxShadow:t.sh,
    overflow:"hidden", overflowX:"auto" as const, marginBottom:24,
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>INSTRUMENTOS DE RENTA FIJA · ARGENTINA</SectionLabel>
        <LiveStatusChip uvaIndex={uvaIndex} tamarRate={tamarRate} />
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {TABS_RF.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)} style={{
            padding:"7px 13px", borderRadius:6, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:450,
            border:`1px solid ${sub===s.id?t.go+"66":t.brd}`, background:sub===s.id?t.goBg:t.srf,
            color:sub===s.id?t.go:t.mu, cursor:"pointer", transition:"all .15s",
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── LECAP / BONCAP — auto-expire ── */}
      {sub === "lecap" && (
        <div>
          {LECAP_ACTIVE.length === 0 && (
            <p style={{ fontFamily:FB, fontSize:13, color:t.mu, textAlign:"center", padding:"32px 0" }}>
              No hay LECAPs/BONCAPs activos.
            </p>
          )}
          {LECAP_ACTIVE.map((g, gi) => {
            const diasRest = g.vto ? daysToMaturity(g.vto) : 0;
            return (
              <div key={gi} style={{ ...tableCtr }}>
                <div style={{ padding:"13px 16px", borderBottom:`1px solid ${t.brd}`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", background:t.srf }}>
                  <span style={{ fontFamily:FH, fontSize:15, fontWeight:750, color:t.tx }}>{g.mes || g.vto}</span>
                  <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>Vto: {g.vto} · {diasRest}d restantes</span>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>
                    <Th>Ticker</Th><Th right>Precio Ref</Th><Th right>Precio Live</Th>
                    <Th right>TEM ref</Th><Th right>TEM live</Th><Th right>TNA ref</Th><Th right>TNA live</Th>
                    <Th right>Rdto</Th><Th right>Días</Th>
                  </tr></thead>
                  <tbody>
                    {g.rows.map((row, ri) => {
                      const m = lecapByTicker[row.t];
                      return (
                        <tr key={ri} style={trStyle}
                          onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                          <Td>
                            <span style={{ fontFamily:"monospace", fontWeight:700 }}>{row.t}</span>
                            {m && <DataQualityBadge flags={m.flags} isLive={m.isLive} />}
                          </Td>
                          <Td right>{row.pre}</Td>
                          <Td right bold color={m?.isLive ? t.gr : t.tx}>${m?.pLive?.toFixed(2) ?? "—"}</Td>
                          <Td right color={t.mu}>{m ? `${m.temRef.toFixed(2)}%` : "—"}</Td>
                          <Td right bold color={m?.temLive != null ? t.go : t.fa}>{m?.temLive != null ? `${m.temLive.toFixed(2)}%` : "—"}</Td>
                          <Td right color={t.mu}>{m ? `${m.tnaRef.toFixed(2)}%` : "—"}</Td>
                          <Td right bold color={m?.tnaLive != null ? t.bl : t.fa}>{m?.tnaLive != null ? `${m.tnaLive.toFixed(2)}%` : "—"}</Td>
                          <Td right>{m?.rendimiento != null ? `${m.rendimiento.toFixed(2)}%` : "—"}</Td>
                          <Td right>{m ? `${m.diasRest}d` : "—"}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CURVA ARS ── */}
      {sub === "curva" && <LecapCurva />}

      {/* ── SOBERANOS USD ── */}
      {sub === "sob" && (
        <div style={tableCtr}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Ticker</Th><Th>Vto</Th><Th right>Precio Ref</Th><Th right>Precio Live</Th>
              <Th right>TIR ref</Th><Th right>TIR live</Th><Th right>CY ref</Th><Th right>Var 1D</Th><Th right>Paridad</Th><Th>Ley</Th>
            </tr></thead>
            <tbody>
              {sovRows.map((s, i) => {
                const live = bondPrices[s.ticker];
                const pctChange = live?.pct;
                return (
                  <tr key={i} style={trStyle}
                    onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <Td bold>
                      <span style={{ fontFamily:"monospace" }}>{s.ticker}</span>
                      <DataQualityBadge flags={s.flags} isLive={s.isLive} />
                    </Td>
                    <Td>{s.vto}</Td>
                    <Td right>${s.pRef.toFixed(2)}</Td>
                    <Td right bold color={s.isLive ? t.gr : t.tx}>${s.pLive.toFixed(2)}</Td>
                    <Td right color={t.mu}>{s.tirRef > 0 ? `${s.tirRef.toFixed(2)}%` : "—"}</Td>
                    <Td right bold color={s.tirLive != null ? t.go : t.fa}>{s.tirLive != null ? `${s.tirLive.toFixed(2)}%` : "—"}</Td>
                    <Td right>{s.cyRef > 0 ? `${s.cyRef.toFixed(2)}%` : "—"}</Td>
                    <Td right color={pctChange!=null?(pctChange>=0?t.gr:t.rd):(s.var1d?.startsWith("-")?t.rd:s.var1d==="—"?t.mu:t.gr)}>
                      {pctChange!=null ? `${pctChange>=0?"+":""}${pctChange.toFixed(2)}%` : s.var1d}
                    </Td>
                    <Td right>{s.par}</Td>
                    <Td><span style={{ fontFamily:FB, fontSize:9, background:s.ley==="NY"?t.blBg:t.alt, color:s.ley==="NY"?t.bl:t.mu, padding:"2px 6px", borderRadius:5 }}>{s.ley}</span></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CURVA USD SOBERANOS ── */}
      {sub === "sovcurva" && <SovYieldCurve />}

      {/* ── ONs CORPORATIVOS ── */}
      {sub === "ons" && <ONsPanel />}

      {/* ── CALC LECAP ── */}
      {sub === "calclecap" && <LecapCalc />}

      {sub === "calcsob" && <SoberanosCalc />}

      {/* ── DUALES ── */}
      {sub === "duales" && (
        <div style={tableCtr}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr><Th>Ticker</Th><Th>Vto</Th><Th right>TEM Fija</Th><Th right>TNA Fija</Th><Th right>TEM Var</Th><Th right>TNA Var</Th><Th right>FX BE</Th></tr></thead>
            <tbody>
              {DUALES.map((d,i) => {
                const live = bondPrices[d.t];
                return (
                  <tr key={i} style={trStyle}
                    onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <Td bold><span style={{ fontFamily:"monospace" }}>{d.t}</span> {live?.price && <span style={{ fontFamily:FB, fontSize:9, color:t.gr }}>● live</span>}</Td>
                    <Td>{d.vto}</Td>
                    <Td right color={t.mu}>{d.temFija}</Td>
                    <Td right color={t.mu}>{d.tnaFija}</Td>
                    <Td right bold color={t.go}>{d.temVar}</Td>
                    <Td right bold color={t.go}>{d.tnaVar}</Td>
                    <Td right>{d.fxbe}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAMAR ── */}
      {sub === "tamar" && (
        <div>
          {tamarRate && (
            <Card t={t} style={{ marginBottom:16 }}>
              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:20 }}>
                <div>
                  <div style={{ fontFamily:FB, fontSize:10, color:t.mu, textTransform:"uppercase", letterSpacing:".08em" }}>Tasa TAMAR (privados)</div>
                  <div style={{ fontFamily:FH, fontSize:32, fontWeight:800, color:t.go }}>{tamarRate.toFixed(2)}%</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.fa }}>BCRA · Promedio mensual de bancos privados</div>
                </div>
              </div>
            </Card>
          )}
          <div style={tableCtr}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><Th>Ticker</Th><Th>Vto</Th><Th right>Rend.</Th><Th right>TNA</Th><Th right>TEM</Th><Th right>FX BE</Th></tr></thead>
              <tbody>
                {TAMAR.map((d,i) => (
                  <tr key={i} style={trStyle}
                    onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <Td bold><span style={{ fontFamily:"monospace" }}>{d.t}</span></Td>
                    <Td>{d.vto}</Td>
                    <Td right>{d.rend}</Td>
                    <Td right bold color={t.go}>{d.tna}</Td>
                    <Td right color={t.mu}>{d.tem}</Td>
                    <Td right>{d.fxbe}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CER ── */}
      {sub === "cer" && (
        <div>
          {uvaIndex && (
            <Card t={t} style={{ marginBottom:16 }}>
              <div style={{ padding:"16px 20px" }}>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, textTransform:"uppercase", letterSpacing:".08em" }}>Índice UVA actual</div>
                <div style={{ fontFamily:FH, fontSize:32, fontWeight:800, color:t.pu }}>{uvaIndex.toFixed(2)}</div>
                <div style={{ fontFamily:FB, fontSize:11, color:t.fa }}>BCRA · Unidad de Valor Adquisitivo</div>
              </div>
            </Card>
          )}
          <div style={tableCtr}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><Th>Ticker</Th><Th>Descripción</Th><Th>Vto</Th><Th right>Precio Live</Th><Th right>Tipo</Th><Th right>Ley</Th></tr></thead>
              <tbody>
                {BONOS_CER.filter(d => isVtoActive(d.vto)).map((d,i) => {
                  const live = bondPrices[d.t];
                  return (
                    <tr key={i} style={trStyle}
                      onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <Td bold><span style={{ fontFamily:"monospace" }}>{d.t}</span></Td>
                      <Td>{d.desc}</Td>
                      <Td>{d.vto}</Td>
                      <Td right color={live?.price ? t.gr : t.tx}>{live?.price ? `$${live.price.toFixed(2)}` : "—"}</Td>
                      <Td right><span style={{ fontFamily:FB, fontSize:9, background:t.puBg, color:t.pu, padding:"2px 6px", borderRadius:5 }}>{d.tipo}</span></Td>
                      <Td right>{d.ley}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DÓLAR LINKED ── */}
      {sub === "dl" && (
        <div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ padding:"14px 18px", fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
              <strong style={{ color:t.tx }}>Dólar Linked:</strong> Rendimiento indexado a variación del TC oficial (BCRA A3500).
              <span style={{ marginLeft:8, fontFamily:FB, fontSize:11, color:t.fa }}>TC base referencia: ${BASE_TC_A3500.toFixed(2)}</span>
            </div>
          </Card>
          <div style={tableCtr}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><Th>Ticker</Th><Th>Vto</Th><Th right>Precio Ref</Th><Th right>Precio Live</Th><Th right>TNA</Th><Th right>Rend.</Th></tr></thead>
              <tbody>
                {DOLARLINKED.filter(d => isVtoActive(d.vto)).map((d,i) => {
                  const live = bondPrices[d.t];
                  return (
                    <tr key={i} style={trStyle}
                      onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <Td bold><span style={{ fontFamily:"monospace" }}>{d.t}</span></Td>
                      <Td>{d.vto}</Td>
                      <Td right>{d.pre}</Td>
                      <Td right color={live?.price ? t.gr : t.tx}>{live?.price ? `$${live.price.toFixed(2)}` : "—"}</Td>
                      <Td right bold color={t.bl}>{d.tna}</Td>
                      <Td right>{d.rend}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:8, lineHeight:1.7 }}>
        Ref: {REFERENCE_AS_OF} · Live: DATA912 · TIR soberanos = bisección sobre flujos · Refresh cada 5 min · Solo informativo
      </p>
    </div>
  );
}

export function RentaFijaView() {
  return (
    <RentaFijaMarketProvider>
      <RentaFijaViewInner />
    </RentaFijaMarketProvider>
  );
}
