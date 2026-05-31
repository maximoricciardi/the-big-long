"use client";

/**
 * components/renta-fija/soberanos-calc.tsx
 * Calculadora de soberanos USD con flujos pagados/pendientes
 */

import { useState, useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import { BOND_SCHEDULES, calcSovTIR } from "@/lib/data/bonds-schedules";
import type { SoberanoBond } from "@/types";

interface Props {
  soberanos:  SoberanoBond[];
  bondPrices: Record<string, { price: number; pct?: number }>;
}

export function SoberanosCalc({ soberanos, bondPrices }: Props) {
  const t = useAppTheme();

  const [selTicker, setSelTicker] = useState("GD30D");
  const [monto,     setMonto]     = useState("10000");
  const [comision,  setComision]  = useState("0.5");
  const [fechaComp, setFechaComp] = useState("");
  const [showPaid,  setShowPaid]  = useState(false);

  const sel = soberanos.find(s => s.t === selTicker) ?? soberanos[0];
  if (!sel) return null;

  const liveData   = bondPrices[sel.t];
  const precioUso  = liveData?.price ?? sel.p;
  const montoNum   = parseFloat(monto.replace(/\./g, "").replace(",", ".")) || 0;
  const comPct     = parseFloat(comision.replace(",", ".")) || 0;
  const precioComp = precioUso * (1 + comPct / 100);

  // Nominal comprado en USD por $100 VN
  const vnComprado = montoNum > 0 ? montoNum / (precioComp / 100) : 0;

  const allFlows = BOND_SCHEDULES[sel.t] ?? [];
  const today    = new Date();
  const compDate = fechaComp ? new Date(fechaComp) : null;

  // Paid flows: from purchaseDate (or start) until today
  const paidFlows = useMemo(() => {
    if (!vnComprado) return [];
    return allFlows
      .filter(f => {
        const d = new Date(f.date);
        return d <= today && (!compDate || d >= compDate);
      })
      .map(f => ({
        ...f,
        cpnUSD:   f.cpn   * vnComprado / 100,
        amortUSD: f.amort * vnComprado / 100,
        totalUSD: (f.cpn + f.amort) * vnComprado / 100,
      }));
  }, [allFlows, vnComprado, today, compDate]);

  // Pending flows: from today onwards
  const flows = useMemo(() => {
    if (!vnComprado) return [];
    return allFlows
      .filter(f => new Date(f.date) > today)
      .map(f => ({
        ...f,
        cpnUSD:   f.cpn   * vnComprado / 100,
        amortUSD: f.amort * vnComprado / 100,
        totalUSD: (f.cpn + f.amort) * vnComprado / 100,
      }));
  }, [allFlows, vnComprado, today]);

  const totalPendiente  = flows.reduce((s, f) => s + f.totalUSD, 0);
  const totalPagado     = paidFlows.reduce((s, f) => s + f.totalUSD, 0);
  const capitalInv      = vnComprado * precioComp / 100;
  const ganancia        = totalPendiente - capitalInv + totalPagado;
  const retPct          = capitalInv > 0 ? (ganancia / capitalInv) * 100 : 0;

  const tirCalc = flows.length
    ? calcSovTIR(precioComp, allFlows.filter(f => new Date(f.date) > today)) * 100
    : 0;

  // Recovery bar
  const totalTodo    = totalPagado + totalPendiente;
  const paidWidth    = totalTodo > 0 ? (totalPagado / totalTodo) * 100 : 0;
  const pendingWidth = totalTodo > 0 ? (totalPendiente / totalTodo) * 100 : 0;

  const fmtUSD = (n: number) => `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="fade-up">
      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
        {/* Bond selector */}
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Bono
          </label>
          <select
            value={selTicker}
            onChange={e => setSelTicker(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: "monospace", fontSize: 13, fontWeight: 700, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          >
            {soberanos.filter(s => BOND_SCHEDULES[s.t]).map(s => (
              <option key={s.t} value={s.t}>{s.t.replace(/D$/, "")} — {s.vto ?? ""}</option>
            ))}
          </select>
        </div>

        {/* Monto */}
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Inversión (USD)
          </label>
          <input
            type="text"
            value={Number(monto.replace(/\./g, "")).toLocaleString("es-AR")}
            onChange={e => setMonto(e.target.value.replace(/\./g, "").replace(/[^0-9]/g, ""))}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          />
        </div>

        {/* Comisión */}
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Comisión (%)
          </label>
          <input
            type="text"
            value={comision}
            onChange={e => setComision(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          />
        </div>

        {/* Fecha compra */}
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Fecha compra (opcional)
          </label>
          <input
            type="date"
            value={fechaComp}
            onChange={e => setFechaComp(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 13, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          />
        </div>
      </div>

      {/* Bond info */}
      <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, marginBottom: 14 }}>
        <strong style={{ color: t.tx }}>{sel.t}</strong> · Precio: <strong style={{ color: liveData ? t.gr : t.mu }}>${precioUso.toFixed(2)}</strong>
        {liveData && <span style={{ marginLeft: 6, fontSize: 9, background: "#22c55e", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>LIVE</span>}
        {" "}· Precio + com: ${precioComp.toFixed(2)} · VN comprado: {vnComprado.toFixed(2)}
      </div>

      {/* KPIs */}
      {vnComprado > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
            {[
              { l: "Capital invertido",  v: fmtUSD(capitalInv),       c: t.tx },
              { l: "TIR calculada",      v: `${tirCalc.toFixed(2)}%`, c: t.go },
              { l: "Flujos pendientes",  v: fmtUSD(totalPendiente),   c: t.bl },
              { l: "Ya cobrado",         v: fmtUSD(totalPagado),      c: paidFlows.length ? t.gr : t.fa },
              { l: "Ganancia estimada",  v: fmtUSD(ganancia),         c: ganancia >= 0 ? t.gr : t.rd },
              { l: "Retorno total %",    v: `${retPct >= 0 ? "+" : ""}${retPct.toFixed(1)}%`, c: retPct >= 0 ? t.gr : t.rd },
            ].map((k, i) => (
              <div key={i} style={{ background: t.alt, borderRadius: 12, padding: "12px 14px", border: `1px solid ${t.brd}` }}>
                <div style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.l}</div>
                <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Recovery bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4 }}>
              <span>Recupero total sobre capital invertido</span>
              <span>{((totalPagado + totalPendiente) / capitalInv * 100).toFixed(1)}% sobre cap.</span>
            </div>
            <div style={{ height: 14, background: t.alt, borderRadius: 7, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${paidWidth}%`, background: `linear-gradient(90deg,${t.gr}88,${t.gr})`, transition: "width .6s" }} />
              <div style={{ width: `${pendingWidth}%`, background: `linear-gradient(90deg,${t.bl}88,${t.bl})`, transition: "width .6s" }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
              <span style={{ fontFamily: FB, fontSize: 9, color: t.gr }}>■ Cobrado: {fmtUSD(totalPagado)}</span>
              <span style={{ fontFamily: FB, fontSize: 9, color: t.bl }}>■ Pendiente: {fmtUSD(totalPendiente)}</span>
            </div>
          </div>

          {/* Paid flows banner */}
          {paidFlows.length > 0 && (
            <div style={{ background: t.grBg, border: `1px solid ${t.gr}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.gr }}>
                  ✓ Ya cobrado: {fmtUSD(totalPagado)} en {paidFlows.length} pago{paidFlows.length > 1 ? "s" : ""}
                </div>
                <button onClick={() => setShowPaid(p => !p)} style={{ fontFamily: FB, fontSize: 10, color: t.gr, background: "transparent", border: `1px solid ${t.gr}44`, borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
                  {showPaid ? "▲ Ocultar" : "▼ Ver detalle"}
                </button>
              </div>
              {showPaid && (
                <div style={{ marginTop: 10, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
                    <thead>
                      <tr>
                        {["Fecha", "Cupón", "Amort.", "Total"].map(h => (
                          <th key={h} style={{ textAlign: "right", padding: "4px 8px", fontSize: 9, color: t.mu, borderBottom: `1px solid ${t.brd}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paidFlows.map((f, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? t.alt + "44" : "transparent" }}>
                          <td style={{ padding: "3px 8px", color: t.mu, textAlign: "right" }}>{fmtDate(f.date)}</td>
                          <td style={{ padding: "3px 8px", color: t.gr, textAlign: "right", fontWeight: 600 }}>{fmtUSD(f.cpnUSD)}</td>
                          <td style={{ padding: "3px 8px", color: f.amortUSD > 0 ? t.go : t.fa, textAlign: "right", fontWeight: f.amortUSD > 0 ? 700 : 400 }}>{f.amortUSD > 0 ? fmtUSD(f.amortUSD) : "—"}</td>
                          <td style={{ padding: "3px 8px", color: t.tx, textAlign: "right", fontWeight: 700 }}>{fmtUSD(f.totalUSD)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pending flows table */}
          <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Fecha", "Cupón USD", "Amort. USD", "Total USD", "Cap. recuperado"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 700, color: t.mu, letterSpacing: ".06em", borderBottom: `2px solid ${t.brd}`, background: t.alt, position: "sticky", top: 0, zIndex: 2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flows.map((f, i) => {
                  const cumul = flows.slice(0, i + 1).reduce((s, x) => s + x.totalUSD, 0) + totalPagado;
                  const recovPct = capitalInv > 0 ? cumul / capitalInv * 100 : 0;
                  const isAmort  = f.amortUSD > 0;
                  return (
                    <tr key={i} style={{ background: isAmort ? t.goBg : (i % 2 === 0 ? t.alt + "44" : "transparent"), borderBottom: `1px solid ${t.brd}22` }}>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: t.mu }}>{fmtDate(f.date)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: t.gr, fontWeight: 600 }}>{fmtUSD(f.cpnUSD)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: isAmort ? t.go : t.fa, fontWeight: isAmort ? 700 : 400 }}>{isAmort ? fmtUSD(f.amortUSD) : "—"}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: t.tx, fontWeight: 700 }}>{fmtUSD(f.totalUSD)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: recovPct >= 100 ? t.gr : t.mu }}>{recovPct.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p style={{ fontFamily: FB, fontSize: 10, color: t.fa, marginTop: 12, lineHeight: 1.6 }}>
            Flujos calculados sobre VN comprado · TIR por bisección numérica ·
            TIR Bloomberg puede diferir por convención de mercado.
            No constituye asesoramiento de inversión.
          </p>
        </>
      )}
    </div>
  );
}
