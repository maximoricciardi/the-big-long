"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP, DUALES, TAMAR, DOLARLINKED, BONOS_CER, SOBERANOS } from "@/lib/data/renta-fija";
import { FB, FH } from "@/lib/constants";

type BondPriceMap = Record<string, { price: number; pct?: number }>;

const TABS_RF = [
  { id:"lecap",    label:"LECAPs / BONCAPs" },
  { id:"duales",   label:"Duales" },
  { id:"tamar",    label:"TAMAR" },
  { id:"cer",      label:"CER" },
  { id:"dl",       label:"Dólar Linked" },
  { id:"sob",      label:"Soberanos USD" },
];

const BASE_DATE     = new Date("2026-03-19");
const BASE_TC_A3500 = 1399.60;
const REFRESH_MS    = 5 * 60 * 1000;

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  const t = useAppTheme();
  return (
    <th style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".08em", textTransform:"uppercase", borderBottom:`2px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap", position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
}

function Td({ children, right, bold, color }: { children: React.ReactNode; right?: boolean; bold?: boolean; color?: string }) {
  const t = useAppTheme();
  return (
    <td style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:12, fontWeight:bold?700:400, color:color||t.tx, whiteSpace:"nowrap" }}>
      {children}
    </td>
  );
}

function LiveStatusChip({ lastUpdate, status, uvaIndex, tamarRate }: { lastUpdate: Date|null; status: string; uvaIndex: number|null; tamarRate: number|null }) {
  const t = useAppTheme();
  const [secsAgo, setSecsAgo] = useState(0);
  useEffect(() => {
    if (!lastUpdate) return;
    const id = setInterval(() => setSecsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [lastUpdate]);
  const nextIn = Math.max(0, Math.round(REFRESH_MS/1000 - secsAgo));
  const lastStr = lastUpdate ? lastUpdate.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }) : null;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap", border:`1px solid ${status==="ok"?t.gr+"55":t.brd}`, background:status==="ok"?t.grBg:t.alt, color:status==="ok"?t.gr:t.mu }}>
      <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", background:status==="ok"?"#22c55e":"#94a3b8", boxShadow:status==="ok"?"0 0 6px #22c55e":"none" }} />
      {status==="loading" ? "Cargando datos ARS..." : (lastStr ? `Últ: ${lastStr} · Refresh en ${nextIn}s` : "Precios teóricos activos")}
      {uvaIndex && <span style={{opacity:.7}}>· UVA {uvaIndex.toFixed(2)}</span>}
      {tamarRate && <span style={{opacity:.7}}>· TAMAR {tamarRate.toFixed(2)}%</span>}
    </div>
  );
}

export function RentaFijaView() {
  const t = useAppTheme();
  const [sub, setSub] = useState("lecap");
  const [bondPrices, setBondPrices]   = useState<BondPriceMap>({});
  const [lecapLive,  setLecapLive]    = useState<BondPriceMap>({});
  const [uvaIndex,   setUvaIndex]     = useState<number|null>(null);
  const [tamarRate,  setTamarRate]    = useState<number|null>(null);
  const [arsStatus,  setArsStatus]    = useState("loading");
  const [lastUpdate, setLastUpdate]   = useState<Date|null>(null);

  const daysSinceBase = Math.floor((Date.now() - BASE_DATE.getTime()) / 86400000);

  const load = useCallback(async () => {
    try {
      const rb = await fetch("/api/equities?type=bonds");
      const bondsJson = await rb.json();
      const prices: BondPriceMap = bondsJson.map || {};
      (bondsJson.raw || []).forEach((b: { symbol?: string; c?: number; pct_change?: number }) => {
        if (!b.symbol || b.c == null) return;
        prices[b.symbol] = { price: b.c, pct: b.pct_change };
      });
      setBondPrices(prices);
      const matched = SOBERANOS.filter(s => prices[s.t]).length;
      setArsStatus(matched > 0 ? "ok" : "error");
    } catch { setArsStatus("error"); }

    try {
      const rn = await fetch("/api/equities?type=notes");
      const notesJson = await rn.json();
      setLecapLive(notesJson.map || {});
    } catch {}

    let hits = 0;
    try {
      const r = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva");
      const data = await r.json();
      if (Array.isArray(data) && data.length > 0) { setUvaIndex(parseFloat(data[data.length-1].valor)); hits++; }
    } catch {}
    try {
      const r = await fetch("/api/bcra?list=1");
      const data = await r.json();
      const tamar = (data.results||[]).find((v: {descripcion?:string;ultValorInformado?:number}) =>
        (v.descripcion||"").toLowerCase().includes("tamar") && (v.descripcion||"").toLowerCase().includes("privad")
      );
      if (tamar?.ultValorInformado) { setTamarRate(parseFloat(tamar.ultValorInformado)); hits++; }
    } catch {}
    if (hits > 0) setArsStatus("ok");
    setLastUpdate(new Date());
  }, []);

  useEffect(() => { load(); const id = setInterval(load, REFRESH_MS); return () => clearInterval(id); }, [load]);

  const calcLECAPMetrics = (row: { t: string; pre: string; r: string; tem: string }, g: { dias: number; vto: string }) => {
    const pBase  = parseFloat(row.pre.replace("$","").replace(/\./g,"").replace(",","."));
    const rBase  = parseFloat(row.r.replace("%","").replace(",",".")) / 100;
    const temBase= parseFloat(row.tem.replace("%","").replace(",",".")) / 100;
    if (!pBase || !rBase || !temBase) return null;
    const vnVto   = pBase * (1 + rBase);
    const diasRest= Math.max(1, g.dias - daysSinceBase);
    const isS = row.t.startsWith("S");
    const liveData = isS ? lecapLive[row.t] : bondPrices[row.t];
    const pLive = liveData?.price > 0 ? liveData.price : pBase * Math.pow(1 + temBase, daysSinceBase/30);
    const isLive = !!(liveData?.price > 0);
    if (diasRest <= 0) return { pLive, rendimiento:0, tem:0, tna:0, diasRest:0, isLive };
    const rendimiento = (vnVto / pLive - 1) * 100;
    const temLive = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;
    const tnaLive = rendimiento * (365 / diasRest);
    return { pLive, rendimiento, tem: temLive, tna: tnaLive, diasRest, isLive };
  };

  const trStyle = { borderBottom:`1px solid ${t.brd}`, transition:"background .12s" } as React.CSSProperties;

  const tableCtr = {
    background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14,
    overflow:"hidden", overflowX:"auto" as const, marginBottom:24,
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>INSTRUMENTOS DE RENTA FIJA · ARGENTINA</SectionLabel>
        <LiveStatusChip lastUpdate={lastUpdate} status={arsStatus} uvaIndex={uvaIndex} tamarRate={tamarRate} />
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {TABS_RF.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)} style={{
            padding:"7px 16px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:400,
            border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.goBg:"transparent",
            color:sub===s.id?t.go:t.mu, cursor:"pointer", transition:"all .15s",
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── LECAP / BONCAP ── */}
      {sub === "lecap" && (
        <div>
          {LECAP.map((g, gi) => {
            const diasRest = Math.max(0, g.dias - daysSinceBase);
            return (
              <div key={gi} style={{ ...tableCtr }}>
                <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.brd}`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx }}>{g.mes || g.vto}</span>
                  <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>Vto: {g.vto} · {diasRest}d restantes</span>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>
                      <Th>Ticker</Th>
                      <Th right>Precio Ref</Th>
                      <Th right>Precio Live</Th>
                      <Th right>TEM live</Th>
                      <Th right>TNA live</Th>
                      <Th right>Rdto total</Th>
                      <Th right>Días rest.</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((row, ri) => {
                      const m = calcLECAPMetrics(row, g);
                      return (
                        <tr key={ri} style={trStyle}
                          onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                          <Td><span style={{ fontFamily:"monospace", fontWeight:700 }}>{row.t}</span></Td>
                          <Td right>{row.pre}</Td>
                          <Td right bold color={m?.isLive ? t.gr : t.tx}>${m?.pLive.toFixed(2) ?? "—"}</Td>
                          <Td right bold color={t.go}>{m ? `${m.tem.toFixed(2)}%` : "—"}</Td>
                          <Td right bold color={t.bl}>{m ? `${m.tna.toFixed(2)}%` : "—"}</Td>
                          <Td right>{m ? `${m.rendimiento.toFixed(2)}%` : "—"}</Td>
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
              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:20 }}>
                <div>
                  <div style={{ fontFamily:FB, fontSize:10, color:t.mu, textTransform:"uppercase", letterSpacing:".08em" }}>Índice UVA actual</div>
                  <div style={{ fontFamily:FH, fontSize:32, fontWeight:800, color:t.pu }}>{uvaIndex.toFixed(2)}</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.fa }}>BCRA · Unidad de Valor Adquisitivo</div>
                </div>
              </div>
            </Card>
          )}
          <div style={tableCtr}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><Th>Ticker</Th><Th>Descripción</Th><Th>Vto</Th><Th right>Precio Live</Th><Th right>Tipo</Th><Th right>Ley</Th></tr></thead>
              <tbody>
                {BONOS_CER.map((d,i) => {
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
              <strong style={{ color:t.tx }}>Dólar Linked:</strong> Rendimiento indexado a variación del tipo de cambio oficial (BCRA). El precio se ajusta diariamente por el TC A3500.
              <span style={{ marginLeft:8, fontFamily:FB, fontSize:11, color:t.fa }}>TC base referencia: ${BASE_TC_A3500.toFixed(2)}</span>
            </div>
          </Card>
          <div style={tableCtr}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><Th>Ticker</Th><Th>Vto</Th><Th right>Precio Ref</Th><Th right>Precio Live</Th><Th right>TNA</Th><Th right>Rend.</Th></tr></thead>
              <tbody>
                {DOLARLINKED.map((d,i) => {
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

      {/* ── SOBERANOS USD ── */}
      {sub === "sob" && (
        <div style={tableCtr}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr><Th>Ticker</Th><Th>Vto</Th><Th right>Precio Ref</Th><Th right>Precio Live</Th><Th right>TIR</Th><Th right>CY</Th><Th right>Var 1D</Th><Th right>Paridad</Th><Th>Ley</Th></tr></thead>
            <tbody>
              {SOBERANOS.map((d,i) => {
                const live = bondPrices[d.t];
                const pctChange = live?.pct;
                return (
                  <tr key={i} style={trStyle}
                    onMouseEnter={e=>(e.currentTarget.style.background=t.alt)}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <Td bold><span style={{ fontFamily:"monospace" }}>{d.t}</span></Td>
                    <Td>{d.vto}</Td>
                    <Td right>{d.p}</Td>
                    <Td right bold color={live?.price ? t.gr : t.tx}>{live?.price ? `$${live.price.toFixed(2)}` : "—"}</Td>
                    <Td right color={t.go}>{d.tir}</Td>
                    <Td right>{d.cy}</Td>
                    <Td right color={pctChange!=null?(pctChange>=0?t.gr:t.rd):(d.var1d?.startsWith("-")?t.rd:d.var1d==="—"?t.mu:t.gr)}>
                      {pctChange!=null ? `${pctChange>=0?"+":""}${pctChange.toFixed(2)}%` : d.var1d}
                    </Td>
                    <Td right>{d.par}</Td>
                    <Td><span style={{ fontFamily:FB, fontSize:9, background:d.ley==="NY"?t.blBg:t.alt, color:d.ley==="NY"?t.bl:t.mu, padding:"2px 6px", borderRadius:5 }}>{d.ley}</span></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:8 }}>
        Precios live de DATA912 · Actualización cada 5 min · Solo informativo
      </p>
    </div>
  );
}
