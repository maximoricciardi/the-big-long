"use client";

import { useState, useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import { BOND_SCHEDULES, calcSovTIR } from "@/lib/data/bonds-schedules";
import { useRentaFijaMarketContext } from "@/components/renta-fija/renta-fija-market-context";
import { DataQualityBadge } from "@/components/renta-fija/data-quality-badge";
import { parseNumStrict } from "@/lib/renta-fija";

export function SoberanosCalc() {
  const t = useAppTheme();
  const { sovRows } = useRentaFijaMarketContext();

  const [selTicker, setSelTicker] = useState("GD30D");
  const [monto,     setMonto]     = useState("10000");
  const [comision,  setComision]  = useState("0.5");
  const [fechaComp, setFechaComp] = useState("");
  const [showPaid,  setShowPaid]  = useState(false);

  // ── Todos los hooks ANTES de cualquier early return ──────────
  const instruments = useMemo(
    () => sovRows.filter(s => s.pLive != null && BOND_SCHEDULES[s.ticker]),
    [sovRows]
  );
  const selRow   = instruments.find(s => s.ticker === selTicker) ?? instruments[0];
  const sel      = selRow;
  const ticker = sel?.ticker ?? "";
  const precioUso = sel?.pLive ?? 0;
  const montoNum   = parseNumStrict(monto) ?? 0;
  const comPct     = parseNumStrict(comision) ?? 0;
  const precioComp = precioUso * (1 + comPct / 100);
  const vnComprado = montoNum > 0 && precioComp > 0 ? montoNum / (precioComp / 100) : 0;

  const allFlows = useMemo(
    () => (sel ? BOND_SCHEDULES[sel.ticker] ?? [] : []),
    [sel]
  );

  const today    = useMemo(() => new Date(), []);
  const compDate = useMemo(
    () => (fechaComp ? new Date(fechaComp) : null),
    [fechaComp]
  );

  const scheduledFlows = useMemo(() => {
    if (!vnComprado || !allFlows.length) return [];
    let outstanding = vnComprado;
    return [...allFlows]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(f => {
        const amortUSD = Math.min(outstanding, vnComprado * f.amort / 100);
        const cpnUSD = outstanding * f.cpn / 100;
        const totalUSD = cpnUSD + amortUSD;
        outstanding = Math.max(0, outstanding - amortUSD);
        return {
          ...f,
          cpnUSD,
          amortUSD,
          totalUSD,
        };
      });
  }, [allFlows, vnComprado]);

  const paidFlows = useMemo(() => {
    if (!scheduledFlows.length) return [];
    return scheduledFlows.filter(f => {
      const d = new Date(f.date);
      return d <= today && (!compDate || d >= compDate);
    });
  }, [scheduledFlows, today, compDate]);

  const flows = useMemo(() => {
    if (!scheduledFlows.length) return [];
    return scheduledFlows.filter(f => new Date(f.date) > today);
  }, [scheduledFlows, today]);

  // ── Early return DESPUÉS de todos los hooks ───────────────────
  if (!sel) {
    return (
      <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, padding: "18px 0" }}>
        No hay bonos soberanos con precio de mercado confiable disponible para calcular.
      </div>
    );
  }

  const totalPendiente = flows.reduce((s, f) => s + f.totalUSD, 0);
  const totalPagado    = paidFlows.reduce((s, f) => s + f.totalUSD, 0);
  const capitalInv     = vnComprado * precioComp / 100;
  const ganancia       = totalPendiente - capitalInv + totalPagado;
  const retPct         = capitalInv > 0 ? (ganancia / capitalInv) * 100 : 0;
  const tirRaw         = flows.length && precioComp > 0
    ? calcSovTIR(precioComp, allFlows, today) * 100
    : null;
  const tirCalc        = tirRaw != null && Number.isFinite(tirRaw) ? tirRaw : null;

  const totalTodo    = totalPagado + totalPendiente;
  const paidWidth    = totalTodo > 0 ? (totalPagado / totalTodo) * 100 : 0;
  const pendingWidth = totalTodo > 0 ? (totalPendiente / totalTodo) * 100 : 0;

  const fmtUSD = (n: number) => `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (s: string) => new Date(s).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Bono</label>
          <select value={ticker} onChange={e => setSelTicker(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: "monospace", fontSize: 13, fontWeight: 700, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}>
            {instruments.map(s => (
              <option key={s.ticker} value={s.ticker}>{s.ticker.replace(/D$/, "")} — {s.vto ?? ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Inversión (USD)</label>
          <input type="text"
            value={(parseNumStrict(monto) ?? 0).toLocaleString("es-AR")}
            onChange={e => setMonto(e.target.value.replace(/\./g, "").replace(/[^0-9]/g, ""))}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Comisión (%)</label>
          <input type="text" value={comision} onChange={e => setComision(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Fecha compra (opcional)</label>
          <input type="date" value={fechaComp} onChange={e => setFechaComp(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 13, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
        </div>
      </div>

      <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, marginBottom: 14 }}>
        <strong style={{ color: t.tx }}>{sel.ticker}</strong> · Precio: <strong style={{ color: sel.isLive ? t.gr : t.mu }}>${precioUso.toFixed(2)}</strong>
        <DataQualityBadge flags={sel.flags} isLive={sel.isLive} />
        {sel.tirLive != null && (
          <span style={{ marginLeft: 8 }}>· TIR mercado: <strong style={{ color: t.go }}>{sel.tirLive.toFixed(2)}%</strong> (base {sel.tirRef.toFixed(2)}%)</span>
        )}
        {" "}· Precio+com: ${precioComp.toFixed(2)} · VN: {vnComprado.toFixed(2)}
      </div>

      {vnComprado > 0 && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
            {[
              { l: "Capital invertido", v: fmtUSD(capitalInv),       c: t.tx },
              { l: "TIR calculada",     v: tirCalc != null ? `${tirCalc.toFixed(2)}%` : "—", c: tirCalc != null ? t.go : t.fa },
              { l: "Flujos pendientes", v: fmtUSD(totalPendiente),   c: t.bl },
              { l: "Ya cobrado",        v: fmtUSD(totalPagado),      c: paidFlows.length ? t.gr : t.fa },
              { l: "Ganancia estimada", v: fmtUSD(ganancia),         c: ganancia >= 0 ? t.gr : t.rd },
              { l: "Retorno total %",   v: `${retPct >= 0 ? "+" : ""}${retPct.toFixed(1)}%`, c: retPct >= 0 ? t.gr : t.rd },
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
              <span>Recupero sobre capital</span>
              <span>{capitalInv > 0 ? ((totalPagado + totalPendiente) / capitalInv * 100).toFixed(1) : 0}%</span>
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

          {/* Paid flows */}
          {paidFlows.length > 0 && (
            <div style={{ background: t.grBg, border: `1px solid ${t.gr}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.gr }}>
                  ✓ Ya cobrado: {fmtUSD(totalPagado)} en {paidFlows.length} pago{paidFlows.length > 1 ? "s" : ""}
                </div>
                <button onClick={() => setShowPaid(p => !p)}
                  style={{ fontFamily: FB, fontSize: 10, color: t.gr, background: "transparent", border: `1px solid ${t.gr}44`, borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
                  {showPaid ? "▲ Ocultar" : "▼ Ver detalle"}
                </button>
              </div>
              {showPaid && (
                <div style={{ marginTop: 10, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
                    <thead><tr>
                      {["Fecha","Cupón","Amort.","Total"].map(h => (
                        <th key={h} style={{ textAlign: "right", padding: "4px 8px", fontSize: 9, color: t.mu, borderBottom: `1px solid ${t.brd}` }}>{h}</th>
                      ))}
                    </tr></thead>
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

          {/* Pending flows */}
          <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 12 }}>
              <thead><tr>
                {["Fecha","Cupón USD","Amort. USD","Total USD","Cap. recuperado"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 700, color: t.mu, letterSpacing: ".06em", borderBottom: `2px solid ${t.brd}`, background: t.alt, position: "sticky", top: 0, zIndex: 2 }}>{h}</th>
                ))}
              </tr></thead>
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
            Flujos sobre VN comprado · TIR por bisección · No constituye asesoramiento.
          </p>
        </>
      )}
    </div>
  );
}
