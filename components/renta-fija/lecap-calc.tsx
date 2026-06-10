"use client";

import { useState, useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import { useRentaFijaMarketContext } from "@/components/renta-fija/renta-fija-market-context";
import { DataQualityBadge } from "@/components/renta-fija/data-quality-badge";
import { parseNumStrict, type LecapComputed } from "@/lib/renta-fija";

type LiveLecapComputed = LecapComputed & {
  pLive: number;
  tnaLive: number;
  temLive: number;
  rendimiento: number;
};

function hasLiveLecapMetrics(row: LecapComputed): row is LiveLecapComputed {
  return (
    row.pLive != null &&
    row.temLive != null &&
    row.tnaLive != null &&
    row.rendimiento != null &&
    !row.flags.includes("tna_outlier")
  );
}

export function LecapCalc() {
  const t = useAppTheme();
  const { lecapRows } = useRentaFijaMarketContext();
  const [selTicker, setSelTicker] = useState("");
  const [monto, setMonto] = useState("100000");
  const [comision, setComision] = useState("0.5");

  const instruments = useMemo(
    () =>
      lecapRows.filter(hasLiveLecapMetrics),
    [lecapRows]
  );

  const sel = instruments.find(i => i.ticker === selTicker) ?? instruments[0];
  const ticker = sel?.ticker ?? "";

  const montoNum = parseNumStrict(monto) ?? 0;
  const comPct = parseNumStrict(comision) ?? 0;

  const precioC = sel ? sel.pLive * (1 + comPct / 100) : 0;
  const laminas = sel && montoNum > 0 ? Math.floor(montoNum / precioC) : 0;
  const capital = laminas * precioC;
  const cobrado = laminas * (sel?.vnVto ?? 0);
  const ganancia = cobrado - capital;
  const retPct = capital > 0 ? (ganancia / capital) * 100 : 0;
  const fmtARS = (n: number) => `$${n.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
  const fmtPct = (n: number, d = 2) => `${n >= 0 ? "+" : ""}${n.toFixed(d)}%`;

  const retAnual =
    sel && sel.diasRest > 0 && capital > 0
      ? (Math.pow(cobrado / capital, 365 / sel.diasRest) - 1) * 100
      : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Instrumento ({instruments.length} activos)
          </label>
          <select
            value={ticker}
            onChange={e => setSelTicker(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: "monospace", fontSize: 12, fontWeight: 700, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          >
            {instruments.map(i => (
              <option key={i.ticker} value={i.ticker}>
                {i.ticker} — {i.mes} · TEM {i.temLive!.toFixed(2)}% · TNA {i.tnaLive!.toFixed(2)}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Monto a invertir (ARS)
          </label>
          <input
            type="text"
            value={(parseNumStrict(monto) ?? 0).toLocaleString("es-AR")}
            onChange={e => setMonto(e.target.value.replace(/\./g, "").replace(/[^0-9]/g, ""))}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          />
        </div>

        <div>
          <label style={{ fontFamily: FB, fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
            Comisión (%)
          </label>
          <input
            type="text" value={comision} onChange={e => setComision(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, fontFamily: FB, fontSize: 14, fontWeight: 600, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }}
          />
        </div>
      </div>

      {sel && (
        <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, marginBottom: 14, padding: "10px 14px", background: t.alt, borderRadius: 10, border: `1px solid ${t.brd}` }}>
          <strong style={{ color: t.tx }}>{sel.ticker}</strong>
          {" "}· {sel.isBoncap ? "BONCAP" : "LECAP"}
          {" "}· Vto: <strong>{sel.vto}</strong>
          {" "}· {sel.diasRest}d restantes
          {" "}· Precio: <strong style={{ color: sel.isLive ? t.gr : t.mu }}>{fmtARS(sel.pLive)}</strong>
          <DataQualityBadge flags={sel.flags} isLive={sel.isLive} />
          {" "}· VN al vto: <strong>{fmtARS(sel.vnVto)}</strong>
        </div>
      )}

      {sel && montoNum > 0 && laminas > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8, marginBottom: 20 }}>
            {[
              { l: "TEM base", v: `${sel.temRef.toFixed(2)}%`, c: t.mu },
              { l: "TEM mercado", v: fmtPct(sel.temLive!), c: t.go },
              { l: "TNA base", v: `${sel.tnaRef.toFixed(2)}%`, c: t.mu },
              { l: "TNA mercado", v: fmtPct(sel.tnaLive!), c: t.bl },
              { l: "Rendto. total", v: fmtPct(sel.rendimiento!), c: t.go },
              { l: "Ret. anualizado", v: fmtPct(retAnual), c: t.go },
              { l: "Láminas (VN)", v: `${laminas}`, c: t.tx },
              { l: "Capital", v: fmtARS(capital), c: t.tx },
              { l: "Cobrado al vto.", v: fmtARS(cobrado), c: t.bl },
              { l: "Ganancia", v: fmtARS(ganancia), c: ganancia >= 0 ? t.gr : t.rd },
              { l: "Retorno neto %", v: fmtPct(retPct), c: retPct >= 0 ? t.gr : t.rd },
            ].map((k, i) => (
              <div key={i} style={{ background: t.alt, borderRadius: 12, padding: "12px 14px", border: `1px solid ${t.brd}` }}>
                <div style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.l}</div>
                <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: t.srf, border: `1px solid ${t.brd}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.fa, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
              Resumen de la inversión
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4 }}>INVERTÍS</div>
                <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: t.tx }}>{fmtARS(capital)}</div>
              </div>
              <div style={{ fontFamily: FH, fontSize: 28, color: t.mu }}>→</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4 }}>COBRADO AL VTO. ({sel.diasRest}d)</div>
                <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: t.bl }}>{fmtARS(cobrado)}</div>
              </div>
              <div style={{ fontFamily: FH, fontSize: 28, color: t.mu }}>=</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginBottom: 4 }}>GANANCIA</div>
                <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 800, color: ganancia >= 0 ? t.gr : t.rd }}>
                  {fmtARS(ganancia)} ({fmtPct(retPct, 1)})
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontFamily: FB, fontSize: 10, color: t.fa, marginTop: 12, lineHeight: 1.6 }}>
            Cálculo con precio de mercado validado · Días al vencimiento por calendario.
            Instrumentos con TNA fuera de rango se excluyen del selector.
          </p>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.fa, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
          RANKING POR TEM — TODOS LOS INSTRUMENTOS ACTIVOS
        </div>
        <div style={{ background: t.srf, border: `1px solid ${t.brd}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
              <thead><tr>
                {["Ticker", "Tipo", "Vto.", "Días", "Precio", "TEM mercado", "TNA mercado", "Rdto."].map((h, i) => (
                  <th key={i} style={{ padding: "8px 10px", textAlign: i > 3 ? "right" : "left", fontSize: 9, fontWeight: 700, color: t.mu, letterSpacing: ".06em", borderBottom: `2px solid ${t.brd}`, background: t.alt, position: "sticky", top: 0, zIndex: 2 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...instruments].sort((a, b) => (b.temLive ?? 0) - (a.temLive ?? 0)).map((ins, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.brd}22`, cursor: "pointer" }}
                    onClick={() => setSelTicker(ins.ticker)}
                    onMouseEnter={e => (e.currentTarget.style.background = t.alt)}
                    onMouseLeave={e => (e.currentTarget.style.background = ins.ticker === ticker ? t.blBg + "44" : "transparent")}>
                    <td style={{ padding: "6px 10px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: ins.ticker === ticker ? t.bl : t.tx }}>{ins.ticker}</span>
                      <DataQualityBadge flags={ins.flags} isLive={ins.isLive} />
                    </td>
                    <td style={{ padding: "6px 10px" }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: ins.isBoncap ? t.puBg : t.goBg, color: ins.isBoncap ? t.pu : t.go }}>{ins.isBoncap ? "BONCAP" : "LECAP"}</span>
                    </td>
                    <td style={{ padding: "6px 10px", color: t.mu, fontSize: 10 }}>{ins.vto}</td>
                    <td style={{ padding: "6px 10px", color: t.fa, textAlign: "right" }}>{ins.diasRest}d</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", color: ins.isLive ? t.gr : t.mu }}>{fmtARS(ins.pLive)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: t.go }}>{fmtPct(ins.temLive!)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: t.bl }}>{fmtPct(ins.tnaLive!)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", color: t.mu }}>{fmtPct(ins.rendimiento!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
