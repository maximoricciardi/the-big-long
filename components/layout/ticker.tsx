"use client";

import { useAppTheme } from "@/lib/theme-context";
import { FB } from "@/lib/constants";
import type { DolarData, RiesgoPaisData, LiveMarket } from "@/types";

interface TickerItem {
  label:   string;
  val:     string;
  pctStr?: string;
  pos?:    boolean;
  neg?:    boolean;
}

function mkItem(label: string, val: string, pct?: number | null): TickerItem {
  const sign   = pct != null && pct > 0 ? "▲" : pct != null && pct < 0 ? "▼" : "";
  const pctStr = pct != null ? ` ${sign}${Math.abs(pct).toFixed(2)}%` : undefined;
  return { label, val, pctStr, pos: (pct ?? 0) > 0, neg: (pct ?? 0) < 0 };
}

interface TickerProps {
  dolar:       DolarData | null;
  riesgoPais:  RiesgoPaisData | null;
  liveMarket:  LiveMarket;
}

export function Ticker({ dolar, riesgoPais, liveMarket }: TickerProps) {
  const t = useAppTheme();

  const fmt2 = (v?: number | null) => v ? `$${Math.round(v).toLocaleString("es-AR")}` : "—";

  const items: TickerItem[] = [
    dolar?.oficial?.venta         ? mkItem("USD Oficial", fmt2(dolar.oficial.venta))       : null,
    dolar?.bolsa?.venta           ? mkItem("USD MEP",     fmt2(dolar.bolsa.venta))          : null,
    dolar?.contadoconliqui?.venta ? mkItem("CCL",         fmt2(dolar.contadoconliqui.venta)) : null,
    riesgoPais                    ? mkItem("Riesgo País",  `${riesgoPais.valor} pb`)         : null,
    liveMarket.mervalARS          ? mkItem("Merval", `${liveMarket.mervalARS.value.toLocaleString("es-AR", { maximumFractionDigits:0 })}`, liveMarket.mervalARS.changePct) : null,
    liveMarket.spy                ? mkItem("SPY",   `$${liveMarket.spy.price.toFixed(2)}`,  liveMarket.spy.changePct)  : null,
    liveMarket.gold               ? mkItem("Oro",   `$${liveMarket.gold.price.toFixed(0)}`, liveMarket.gold.changePct) : null,
    liveMarket.brent              ? mkItem("Brent", `$${liveMarket.brent.price.toFixed(2)}`,liveMarket.brent.changePct): null,
  ].filter((x): x is TickerItem => x !== null);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items];

  return (
    <div style={{
      background: t.tick, padding: "6px 0", overflow: "hidden",
      borderBottom: "1px solid rgba(255,255,255,.04)",
    }}>
      <div className="marquee-track">
        {repeated.map((item, k) => (
          <span key={k} style={{ display:"inline-flex", alignItems:"center", gap:6, paddingRight:28, whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:FB, fontSize:10, fontWeight:500, color:"rgba(255,255,255,.38)", letterSpacing:".06em", textTransform:"uppercase" }}>
              {item.label}
            </span>
            <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color: item.pos ? "#4ade80" : item.neg ? "#f87171" : "#e2e8f0" }}>
              {item.val}
            </span>
            {item.pctStr && (
              <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color: item.pos ? "#4ade80" : item.neg ? "#f87171" : "#94a3b8" }}>
                {item.pctStr}
              </span>
            )}
            <span style={{ color:"rgba(255,255,255,.15)", fontSize:10 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
