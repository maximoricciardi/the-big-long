"use client";

/**
 * components/renta-fija/ons-panel.tsx
 * Panel de Obligaciones Negociables: cotizaciones, curva de rendimientos y señales de venta
 */

import { useState, useEffect, useRef } from "react";
import { BarChart3, LineChart, AlertTriangle } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";

// ── ONs Data ─────────────────────────────────────────────────────────
export interface OnData {
  t:    string;
  em:   string;   // emisor
  p:    number;   // precio base
  tir:  number;   // TIR %
  cup:  number;   // cupón %
  dur:  number;   // duration años
  vto:  string;   // vencimiento
  cal:  string;   // calificación
  tipo: string;   // tipo amortización
  freq: string;   // frecuencia de pago
}

export const ONS_ARG_DATA: OnData[] = [
  {t:"YMCXO",em:"YPF S.A.",          p:99.2, tir:8.2, cup:9.0, dur:1.8,vto:"15/04/2027",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"IRCFO",em:"IRSA",              p:98.5, tir:7.8, cup:8.5, dur:2.1,vto:"20/07/2027",cal:"A+", tipo:"Bullet",freq:"Semestral"},
  {t:"TXCFO",em:"Telecom Arg.",      p:97.8, tir:9.1, cup:8.0, dur:2.8,vto:"01/03/2028",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"PMCGO",em:"Pampa Energía",     p:96.2, tir:9.8, cup:9.5, dur:3.2,vto:"01/09/2028",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"MGCHO",em:"MGC Prod. Y Com.",  p:95.1, tir:10.2,cup:9.75,dur:3.8,vto:"20/02/2029",cal:"A+", tipo:"Bullet",freq:"Semestral"},
  {t:"VLCFO",em:"Vista Oil & Gas",   p:98.4, tir:8.9, cup:9.5, dur:2.5,vto:"15/12/2027",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"BRCAO",em:"Banco Galicia",     p:96.8, tir:9.5, cup:8.75,dur:3.1,vto:"01/05/2028",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"CECAO",em:"Cresud",            p:94.2, tir:11.8,cup:10.5,dur:4.2,vto:"01/06/2029",cal:"A",  tipo:"Bullet",freq:"Semestral"},
  {t:"IRSCO",em:"IRSA Prop. Com.",   p:93.5, tir:12.4,cup:11.0,dur:4.8,vto:"20/04/2030",cal:"A",  tipo:"Amort.", freq:"Semestral"},
  {t:"MRCGO",em:"Mercado Libre",     p:99.5, tir:7.2, cup:7.5, dur:2.2,vto:"10/08/2027",cal:"BBB",tipo:"Bullet",freq:"Semestral"},
  {t:"AECAO",em:"Aeropuertos Arg.",  p:97.5, tir:8.5, cup:8.75,dur:2.9,vto:"01/11/2027",cal:"AA-",tipo:"Bullet",freq:"Semestral"},
  {t:"TGNCJO",em:"TGN",              p:95.8, tir:10.5,cup:9.75,dur:3.5,vto:"15/09/2028",cal:"A+", tipo:"Bullet",freq:"Semestral"},
];

export const ONS_NY_DATA: OnData[] = [
  {t:"YMCXD",em:"YPF S.A.",          p:98.8, tir:8.5, cup:9.0, dur:2.1,vto:"15/04/2027",cal:"B+", tipo:"Bullet",freq:"Semestral"},
  {t:"PMCGD",em:"Pampa Energía",     p:95.5, tir:10.5,cup:9.5, dur:3.5,vto:"01/09/2028",cal:"B+", tipo:"Bullet",freq:"Semestral"},
  {t:"TCCFD",em:"TeleComunicaciones",p:97.2, tir:9.2, cup:8.875,dur:2.8,vto:"01/03/2028",cal:"B+",tipo:"Bullet",freq:"Semestral"},
  {t:"VLCFD",em:"Vista Oil & Gas",   p:97.8, tir:9.1, cup:9.5, dur:2.6,vto:"15/12/2027",cal:"BB-",tipo:"Bullet",freq:"Semestral"},
  {t:"GPGFD",em:"Genneia",           p:96.5, tir:10.0,cup:8.75,dur:3.2,vto:"20/01/2028",cal:"B+", tipo:"Bullet",freq:"Semestral"},
  {t:"MSCD",em:"MSC Mediterranean",  p:94.8, tir:11.2,cup:10.0,dur:4.0,vto:"15/08/2029",cal:"BB-",tipo:"Bullet",freq:"Semestral"},
  {t:"ABCFD",em:"ABC Capital",       p:93.2, tir:12.8,cup:11.5,dur:4.8,vto:"01/04/2030",cal:"B",  tipo:"Amort.", freq:"Semestral"},
  {t:"INCAD",em:"IMPSA",             p:92.0, tir:13.5,cup:12.0,dur:5.2,vto:"15/06/2031",cal:"B-", tipo:"Amort.", freq:"Semestral"},
];

// ── CurvaChart ────────────────────────────────────────────────────────
function CurvaChart({
  data, color, label, corpPrices
}: {
  data: OnData[]; color: string; label: string;
  corpPrices: Record<string, { price: number; pct: number }>;
}) {
  const t   = useAppTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  const TIR_MAX = 20;
  const pts = data.filter(o => o.tir > 0 && o.tir <= TIR_MAX && o.dur > 0).sort((a, b) => a.dur - b.dur);
  const excl = data.filter(o => o.tir > TIR_MAX).length;

  if (!pts.length) return null;

  const W = 500, H = 260;
  const PAD = { l: 48, r: 16, t: 24, b: 44 };
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
    const [px, py] = coords[i - 1], [cx, cy] = coords[i];
    const cpx = (px + cx) / 2;
    path += ` C${cpx},${py} ${cpx},${cy} ${cx},${cy}`;
  }

  const fillId = `fill-on-${label.replace(/\s/g, "")}`;
  const yTicks = 5;
  const gridLines = Array.from({ length: yTicks }, (_, i) => {
    const v = minTir - yPad + i * (range + 2 * yPad) / (yTicks - 1);
    return { v: v.toFixed(1), y: cH - (i / (yTicks - 1)) * cH };
  });

  return (
    <div ref={ref} style={{
      background: t.srf, border: `1px solid ${t.brd}`, borderRadius: 14, padding: "16px 18px",
      position: fs ? "fixed" : "relative", inset: fs ? 0 : "auto", zIndex: fs ? 9999 : "auto", overflow: fs ? "auto" : "visible",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color, letterSpacing: ".1em", textTransform: "uppercase" }}>
          {label} · TIR vs Duration · {pts.length} ONs{excl > 0 ? ` (${excl} excl. >20%)` : ""}
        </div>
        <button onClick={() => { if (!fs) { ref.current?.requestFullscreen(); setFs(true); } else { document.exitFullscreen(); setFs(false); } }}
          style={{ padding: "3px 10px", borderRadius: 6, fontFamily: FB, fontSize: 9, border: `1px solid ${t.brd}`, background: t.alt, color: t.mu, cursor: "pointer" }}>
          {fs ? "⊠ Cerrar" : "⛶ Pantalla completa"}
        </button>
      </div>
      <svg width={W} height={H} style={{ overflow: "visible", fontFamily: FB, maxWidth: "100%" }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <g transform={`translate(${PAD.l},${PAD.t})`}>
          {gridLines.map(({ v, y }, i) => (
            <g key={i}>
              <line x1={0} y1={y} x2={cW} y2={y} stroke={t.brd} strokeWidth={1} strokeDasharray="3,4" opacity={.5} />
              <text x={-6} y={y + 4} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text>
            </g>
          ))}
          {[0.5,1,2,3,4,5].filter(d => d <= maxDur + 0.3).map((d, i) => (
            <g key={i}>
              <line x1={xS(d)} y1={cH} x2={xS(d)} y2={cH + 4} stroke={t.mu} strokeWidth={1} />
              <text x={xS(d)} y={cH + 16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}a</text>
            </g>
          ))}
          <text x={cW/2} y={cH+36} textAnchor="middle" fontSize={9} fill={t.mu}>Duration (años)</text>
          <path d={`${path} L${coords[coords.length-1][0]},${cH} L${coords[0][0]},${cH} Z`} fill={`url(#${fillId})`} />
          <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {pts.map((p, i) => {
            const live = corpPrices[p.t];
            return (
              <g key={i}>
                <circle cx={coords[i][0]} cy={coords[i][1]} r={live ? 5 : 4}
                  fill={live ? color : t.bg} stroke={color} strokeWidth={live ? 0 : 1.5} />
                {live && <circle cx={coords[i][0]} cy={coords[i][1]} r={2.5} fill="#fff" opacity={.8} />}
                <title>{p.t} · TIR: {p.tir.toFixed(2)}% · Dur: {p.dur.toFixed(1)}a · {p.em}</title>
                {i % 2 === 0 && (
                  <text x={coords[i][0]} y={coords[i][1] - 9} textAnchor="middle" fontSize={8} fontWeight={700} fill={color}>{p.t}</text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
        {pts.map((p, i) => (
          <div key={i} style={{ background: t.alt, border: `1px solid ${color}22`, borderRadius: 7, padding: "4px 9px", minWidth: 80 }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color, marginBottom: 2 }}>{p.t}</div>
            <div style={{ fontFamily: FH, fontSize: 12, fontWeight: 700, color: p.tir >= 10 ? t.gr : p.tir >= 7 ? t.go : t.mu }}>{p.tir.toFixed(2)}%</div>
            <div style={{ fontFamily: FB, fontSize: 8, color: t.fa }}>{p.dur.toFixed(1)}a · {p.vto}</div>
          </div>
        ))}
      </div>
      {excl > 0 && (
        <p style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginTop: 8 }}>
          * Se excluyen {excl} instrumento{excl > 1 ? "s" : ""} con TIR &gt; 20% para no distorsionar la escala.
        </p>
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
    if (sortCol === col) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortCol(col); setSortDir(1); }
  };

  const renderTable = (label: string, data: OnData[], color: string) => {
    const filtered = data
      .filter(o => !search.trim() || o.t.toLowerCase().includes(search.toLowerCase()) || o.em.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const av = (a as unknown as Record<string, number>)[sortCol];
        const bv = (b as unknown as Record<string, number>)[sortCol];
        if (av == null) return 1; if (bv == null) return -1;
        return (av > bv ? 1 : -1) * sortDir;
      });

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
          {label} — {filtered.length} instrumentos
        </div>
        <div style={{ background: t.srf, borderRadius: 12, border: `1px solid ${t.brd}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
              <thead>
                <tr>
                  {(["t","em","p","tir","cup","dur","vto","cal","tipo"] as const).map(col => (
                    <th key={col} onClick={() => sort(col)} style={{ padding: "8px 10px", textAlign: col === "p" || col === "tir" || col === "cup" || col === "dur" ? "right" : "left", fontSize: 9, fontWeight: 700, color: sortCol === col ? t.go : t.mu, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `2px solid ${t.brd}`, background: t.alt, position: "sticky", top: 0, zIndex: 5, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {{ t: "Ticker", em: "Emisor", p: "Precio", tir: "TIR", cup: "Cupón", dur: "Dur.", vto: "Vto.", cal: "Cal.", tipo: "Tipo" }[col]}
                      {sortCol === col ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => {
                  const live = corpPrices[o.t];
                  const px   = live?.price ?? o.p;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.brd}22` }}>
                      <td style={{ padding: "6px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 4, background: color + "15", color, border: `1px solid ${color}33` }}>{o.t}</span>
                          {live && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />}
                        </div>
                      </td>
                      <td style={{ padding: "6px 10px", fontSize: 10, color: t.tx, fontWeight: 500, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.em}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: live ? t.tx : t.mu }}>${px.toFixed(2)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right" }}>
                        <span style={{ fontWeight: 700, color: o.tir >= 9 ? t.gr : o.tir >= 6 ? t.go : t.mu }}>{o.tir.toFixed(2)}%</span>
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: t.mu }}>{o.cup.toFixed(1)}%</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: t.mu }}>{o.dur.toFixed(1)}a</td>
                      <td style={{ padding: "6px 10px", fontSize: 10, color: t.mu }}>{o.vto}</td>
                      <td style={{ padding: "6px 10px" }}>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: o.cal.startsWith("AA") ? t.grBg : o.cal.startsWith("A") ? t.blBg : t.goBg, color: o.cal.startsWith("AA") ? t.gr : o.cal.startsWith("A") ? t.bl : t.go }}>
                          {o.cal}
                        </span>
                      </td>
                      <td style={{ padding: "6px 10px", fontSize: 9, color: t.fa }}>{o.tipo}</td>
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

  // Sell signals: ONs with TIR < threshold
  const allONs = [...ONS_ARG_DATA.map(o => ({ ...o, ley: "ARG" as const })), ...ONS_NY_DATA.map(o => ({ ...o, ley: "NY" as const }))];
  const sellCandidates = allONs
    .map(o => {
      const live = corpPrices[o.t];
      if (!live || !o.p) return o;
      const tirLive = o.tir * (o.p / live.price);
      return { ...o, tir: parseFloat(tirLive.toFixed(2)), _live: true, _price: live.price, _pct: live.pct };
    })
    .filter(o => o.tir > 0 && o.tir < TIR_THRESHOLD)
    .sort((a, b) => a.tir - b.tir);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0A1E3D, #14355A, #1A4270)", borderRadius: 16, padding: "22px 28px", marginBottom: 20, border: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 4 }}>MERCADO SECUNDARIO</div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>
              Obligaciones <span style={{ color: "#4A90D9" }}>Negociables</span>
            </h2>
            <p style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6 }}>{ONS_ARG_DATA.length + ONS_NY_DATA.length} instrumentos · Mercado secundario</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", borderRadius: 10, padding: "8px 16px", border: "1px solid rgba(255,255,255,.08)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: status === "ok" ? "#22c55e" : "#f59e0b", boxShadow: status === "ok" ? "0 0 8px #22c55e" : "none" }} />
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)" }}>
              {status === "ok" ? `${Object.keys(corpPrices).length} precios live` : status === "error" ? "Sin datos live" : "Cargando..."}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { id: "cotiz", label: "Cotizaciones",          Icon: BarChart3 },
          { id: "curva", label: "Curva de Rendimientos", Icon: LineChart },
          { id: "sell",  label: "Señales de Venta",      Icon: AlertTriangle },
        ].map(s => (
          <button key={s.id} onClick={() => setSub(s.id)} style={{ padding: "7px 16px", borderRadius: 8, fontFamily: FB, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${sub === s.id ? t.go : t.brd}`, background: sub === s.id ? t.go + "15" : "transparent", color: sub === s.id ? t.go : t.mu, display: "flex", alignItems: "center", gap: 5 }}>
            <s.Icon size={13} /> {s.label}
          </button>
        ))}
      </div>

      {/* Cotizaciones */}
      {sub === "cotiz" && (
        <>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticker o emisor..."
              style={{ fontFamily: FB, fontSize: 12, padding: "8px 12px 8px 32px", borderRadius: 10, width: 220, border: `1.5px solid ${t.brd}`, background: t.srf, color: t.tx, outline: "none" }} />
          </div>
          {renderTable("LEY ARGENTINA", ONS_ARG_DATA, t.go)}
          {renderTable("LEY NUEVA YORK", ONS_NY_DATA, t.bl)}
        </>
      )}

      {/* Curva */}
      {sub === "curva" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", gap: 16 }}>
            <CurvaChart data={ONS_ARG_DATA} color={t.go} label="LEY ARGENTINA" corpPrices={corpPrices} />
            <CurvaChart data={ONS_NY_DATA}  color={t.bl} label="LEY NUEVA YORK" corpPrices={corpPrices} />
          </div>
          <p style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginTop: 10, lineHeight: 1.7 }}>
            TIR calculada sobre precio de mercado · Puntos con relleno = precio live ·
            Se excluyen instrumentos con TIR &gt; 20% para no distorsionar la escala.
          </p>
        </div>
      )}

      {/* Sell signals */}
      {sub === "sell" && (
        <div>
          <div style={{ background: t.rdBg, border: `1px solid ${t.rd}44`, borderRadius: 10, padding: "14px 18px", fontFamily: FB, fontSize: 12, color: t.rd, marginBottom: 16, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Señales de venta:</strong> ONs con TIR menor a {TIR_THRESHOLD}% ajustada con precio live.
              Considerá rotar hacia instrumentos de mayor rendimiento.
              {Object.keys(corpPrices).length > 0 && <span style={{ marginLeft: 6, fontSize: 10, opacity: .7 }}>(ajustado con precios en vivo)</span>}
            </div>
          </div>
          {sellCandidates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", fontFamily: FB, fontSize: 14, color: t.mu }}>
              ✅ Ninguna ON cotiza debajo del {TIR_THRESHOLD}% de TIR actualmente.
            </div>
          ) : (
            <div style={{ background: t.srf, borderRadius: 12, border: `1px solid ${t.brd}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FB, fontSize: 11 }}>
                  <thead>
                    <tr>
                      {["Ticker", "Emisor", "TIR", "Cupón", "Precio", "Duration", "Vto.", "Ley", ""].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.mu, letterSpacing: ".06em", borderBottom: `2px solid ${t.brd}`, background: t.alt }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sellCandidates.map((o, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${t.brd}22` }}>
                        <td style={{ padding: "6px 10px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 4, background: t.rd + "15", color: t.rd }}>{o.t}</span>
                        </td>
                        <td style={{ padding: "6px 10px", fontSize: 10, color: t.tx }}>{o.em}</td>
                        <td style={{ padding: "6px 10px", fontWeight: 700, color: t.rd }}>
                          {o.tir.toFixed(2)}%
                          {"_live" in o && o._live && <span style={{ marginLeft: 4, fontSize: 7, background: "#22c55e", color: "#fff", padding: "1px 4px", borderRadius: 3 }}>LIVE</span>}
                        </td>
                        <td style={{ padding: "6px 10px", color: t.mu }}>{o.cup.toFixed(1)}%</td>
                        <td style={{ padding: "6px 10px", fontWeight: 600, color: t.tx }}>${("_price" in o ? o._price : o.p).toFixed(2)}</td>
                        <td style={{ padding: "6px 10px", color: t.mu }}>{o.dur.toFixed(1)}a</td>
                        <td style={{ padding: "6px 10px", fontSize: 10, color: t.mu }}>{o.vto}</td>
                        <td style={{ padding: "6px 10px" }}>
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: o.ley === "NY" ? t.blBg : t.goBg, color: o.ley === "NY" ? t.bl : t.go }}>{o.ley}</span>
                        </td>
                        <td style={{ padding: "6px 10px" }}>
                          <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.rd, background: t.rdBg, padding: "3px 8px", borderRadius: 6 }}>VENDER</span>
                        </td>
                      </tr>
                    ))}
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
