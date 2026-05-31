"use client";

/**
 * components/renta-fija/sov-yield-curve.tsx
 * Curva de rendimientos soberanos USD — SVG puro, sin recharts
 */

import { useState, useRef, useEffect } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";
import type { SoberanoBond } from "@/types";

interface CurvePoint {
  ticker: string;
  dur:    number;
  tir:    number;
  price:  number;
  ley:    "ARG" | "NY";
  isLive: boolean;
}

interface SovYieldCurveProps {
  soberanos:  SoberanoBond[];
  bondPrices: Record<string, { price: number; pct?: number }>;
}

export function SovYieldCurve({ soberanos, bondPrices }: SovYieldCurveProps) {
  const t = useAppTheme();
  const [hover, setHover]   = useState<CurvePoint | null>(null);
  const [hx, setHx]         = useState(0);
  const [hy, setHy]         = useState(0);
  const [fsArg, setFsArg]   = useState(false);
  const [fsNY,  setFsNY]    = useState(false);
  const refArg = useRef<HTMLDivElement>(null);
  const refNY  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => { setFsArg(false); setFsNY(false); };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // Build points from soberanos + live prices
  const points: CurvePoint[] = soberanos
    .filter(s => s.p > 0)
    .map(s => {
      const liveData = bondPrices[s.t];
      const price    = liveData?.price ?? s.p;
      const dur      = s.dur ?? 0;
      const tir      = s.tir ?? 0;
      return { ticker: s.t, dur, tir, price, ley: s.ley, isLive: !!liveData };
    })
    .filter(p => p.dur > 0 && p.tir > 0)
    .sort((a, b) => a.dur - b.dur);

  const argPts = points.filter(p => p.ley === "ARG");
  const nyPts  = points.filter(p => p.ley === "NY");

  const renderCurve = (
    pts: CurvePoint[],
    color: string,
    label: string,
    fsState: boolean,
    setFs: (v: boolean) => void,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!pts.length) return null;

    const W = 520, H = 260;
    const PAD = { l: 48, r: 16, t: 24, b: 44 };
    const cW = W - PAD.l - PAD.r;
    const cH = H - PAD.t - PAD.b;

    const maxDur = Math.max(...pts.map(p => p.dur), 1);
    const minTir = Math.min(...pts.map(p => p.tir));
    const maxTir = Math.max(...pts.map(p => p.tir));
    const range  = Math.max(maxTir - minTir, 0.5);
    const pad    = range * 0.15;

    const xS = (d: number) => (d / maxDur) * cW;
    const yS = (v: number) => cH - ((v - minTir + pad) / (range + 2 * pad)) * cH;

    const coords = pts.map(p => [xS(p.dur), yS(p.tir)] as [number, number]);
    let path = `M${coords[0][0]},${coords[0][1]}`;
    for (let i = 1; i < coords.length; i++) {
      const [px, py] = coords[i - 1];
      const [cx, cy] = coords[i];
      const cpx = (px + cx) / 2;
      path += ` C${cpx},${py} ${cpx},${cy} ${cx},${cy}`;
    }

    const yTicks = 5;
    const gridLines = Array.from({ length: yTicks }, (_, i) => {
      const v = minTir - pad + i * (range + 2 * pad) / (yTicks - 1);
      return { v: v.toFixed(1), y: cH - (i / (yTicks - 1)) * cH };
    });

    const xTicks = [0.5, 1, 2, 3, 4, 5, 7].filter(d => d <= maxDur + 0.3);
    const fillId = `fill-${label.replace(/\s/g, "")}`;

    return (
      <div
        ref={ref}
        style={{
          background: fsState ? t.bg : t.srf,
          border: `1px solid ${t.brd}`,
          borderRadius: 14,
          padding: "18px 20px",
          position: fsState ? "fixed" : "relative",
          inset: fsState ? 0 : "auto",
          zIndex: fsState ? 9999 : "auto",
          overflow: fsState ? "auto" : "visible",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {label} · TIR vs Duration · {pts.length} bonos
          </div>
          <button
            onClick={() => {
              if (!fsState) { ref.current?.requestFullscreen(); setFs(true); }
              else { document.exitFullscreen(); setFs(false); }
            }}
            style={{ padding: "3px 10px", borderRadius: 6, fontFamily: FB, fontSize: 9, fontWeight: 600, border: `1px solid ${t.brd}`, background: t.alt, color: t.mu, cursor: "pointer" }}
          >
            {fsState ? "⊠ Cerrar" : "⛶ Pantalla completa"}
          </button>
        </div>

        <svg
          width={W} height={H}
          style={{ overflow: "visible", fontFamily: FB, maxWidth: "100%" }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <g transform={`translate(${PAD.l},${PAD.t})`}>
            {gridLines.map(({ v, y }, i) => (
              <g key={i}>
                <line x1={0} y1={y} x2={cW} y2={y} stroke={t.brd} strokeWidth={1} strokeDasharray="3,4" opacity={.5} />
                <text x={-6} y={y + 4} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text>
              </g>
            ))}
            {xTicks.map((d, i) => (
              <g key={i}>
                <line x1={xS(d)} y1={cH} x2={xS(d)} y2={cH + 4} stroke={t.mu} strokeWidth={1} />
                <text x={xS(d)} y={cH + 16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}a</text>
              </g>
            ))}
            <text x={cW / 2} y={cH + 36} textAnchor="middle" fontSize={9} fill={t.mu}>Duration (años)</text>
            <text transform={`rotate(-90) translate(${-cH / 2},${-38})`} textAnchor="middle" fontSize={9} fill={t.mu}>TIR (%)</text>

            {/* Area */}
            <path d={`${path} L${coords[coords.length - 1][0]},${cH} L${coords[0][0]},${cH} Z`} fill={`url(#${fillId})`} />
            {/* Curve */}
            <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />

            {/* Points */}
            {pts.map((p, i) => {
              const [x, y] = coords[i];
              return (
                <g key={i}
                  onMouseEnter={e => { setHover(p); setHx(e.clientX); setHy(e.clientY); }}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx={x} cy={y} r={p.isLive ? 5 : 4}
                    fill={p.isLive ? color : t.bg}
                    stroke={color} strokeWidth={p.isLive ? 0 : 1.5}
                  />
                  {p.isLive && <circle cx={x} cy={y} r={2.5} fill="#fff" opacity={.8} />}
                  <text x={x} y={y - 9} textAnchor="middle" fontSize={8} fontWeight={700} fill={color}>
                    {p.ticker.replace(/D$/, "")}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Compact chip grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {pts.map((p, i) => (
            <div key={i} style={{ background: t.alt, border: `1px solid ${color}22`, borderRadius: 7, padding: "4px 9px", minWidth: 80 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color }}>{p.ticker.replace(/D$/, "")}</span>
                {p.isLive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />}
              </div>
              <div style={{ fontFamily: FH, fontSize: 12, fontWeight: 700, color: p.tir >= 12 ? t.gr : p.tir >= 8 ? t.go : t.mu }}>
                {p.tir.toFixed(2)}%
              </div>
              <div style={{ fontFamily: FB, fontSize: 8, color: t.fa }}>{p.dur.toFixed(1)}a</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hover tooltip — portal-style fixed */}
      {hover && (
        <div style={{
          position: "fixed", left: hx + 12, top: hy - 40, zIndex: 10000,
          background: t.srf, border: `1px solid ${t.brd}`, borderRadius: 10,
          padding: "10px 14px", fontFamily: FB, fontSize: 11, color: t.tx,
          boxShadow: "0 8px 24px rgba(0,0,0,.15)", pointerEvents: "none",
          minWidth: 160,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{hover.ticker}</div>
          <div style={{ color: t.mu }}>TIR: <b style={{ color: t.go }}>{hover.tir.toFixed(2)}%</b></div>
          <div style={{ color: t.mu }}>Duration: {hover.dur.toFixed(2)} años</div>
          <div style={{ color: t.mu }}>Precio: <b>${hover.price.toFixed(2)}</b></div>
          <div style={{ color: hover.isLive ? t.gr : t.fa, fontSize: 9, marginTop: 4 }}>
            {hover.isLive ? "● Precio en vivo" : "Precio teórico"}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 16 }}>
        {renderCurve(argPts, t.go, "LEY ARGENTINA", fsArg, setFsArg, refArg)}
        {renderCurve(nyPts,  t.bl, "LEY NUEVA YORK", fsNY,  setFsNY,  refNY)}
      </div>

      <p style={{ fontFamily: FB, fontSize: 9, color: t.fa, marginTop: 10, lineHeight: 1.7 }}>
        TIR calculada por bisección numérica sobre precio de mercado.
        Puntos con relleno = precio live DATA912 · Hover sobre cada punto para detalles.
        No constituye asesoramiento de inversión.
      </p>
    </div>
  );
}
