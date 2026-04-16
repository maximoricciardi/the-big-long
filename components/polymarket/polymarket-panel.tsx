"use client";

import { useState } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { Card } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolymarket } from "@/hooks/use-polymarket";
import type { PolyMarket, PolyIndicator } from "@/hooks/use-polymarket";
import { FB, FH } from "@/lib/constants";

interface PolymarketPanelProps {
  standalone?: boolean;
}

const CAT_TABS = [
  { id:"todos",       label:"Todos" },
  { id:"macro",       label:"Macro" },
  { id:"geopolitics", label:"Geopolítica" },
  { id:"markets",     label:"Mercados" },
];

function TrackedMarketCard({ m }: { m: PolyMarket }) {
  const t = useAppTheme();
  const isMulti = m.outcomes && m.outcomes.length > 2;
  const yesOutcome = m.outcomes?.find(o => o.label === "Yes" || o.label === "Sí");
  const prob = yesOutcome?.prob ?? (m.outcomes?.[0]?.prob ?? 0.5);
  const pct = Math.round(prob * 100);
  const col = pct >= 65 ? t.gr : pct <= 35 ? t.rd : t.bl;

  return (
    <Card t={t}>
      <div style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>
            Vol: {m.volume>=1e6?`$${(m.volume/1e6).toFixed(1)}M`:m.volume>=1000?`$${(m.volume/1000).toFixed(0)}K`:`$${Math.round(m.volume)}`}
          </span>
        </div>
        <h3 style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:t.tx, lineHeight:1.4, marginBottom:12 }}>{m.title}</h3>
        {!isMulti ? (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>Probabilidad</span>
              <span style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:col }}>{pct}%</span>
            </div>
            <div style={{ height:8, background:t.alt, borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${col}88,${col})`, borderRadius:4, transition:"width .6s" }} />
            </div>
          </div>
        ) : (
          <div>
            {m.outcomes.filter(o=>o.prob>=0.03).sort((a,b)=>b.prob-a.prob).map((o,i) => {
              const op = Math.round(o.prob*100);
              const colors = [t.bl, t.go, t.gr, t.pu, t.rd];
              const oc = colors[i % colors.length];
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontFamily:FB, fontSize:10, color:t.mu, minWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.label}</span>
                  <div style={{ flex:1, height:12, background:t.alt, borderRadius:4, overflow:"hidden" }}>
                    <div style={{ width:`${op}%`, height:"100%", background:oc, borderRadius:4, transition:"width .6s" }} />
                  </div>
                  <span style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:oc, minWidth:35, textAlign:"right" }}>{op}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

export function PolymarketPanel({ standalone = false }: PolymarketPanelProps) {
  const t = useAppTheme();
  const [activeTab, setActiveTab] = useState("todos");
  const { data, isLoading, error } = usePolymarket();

  const tracked: PolyMarket[]    = data?.tracked ?? [];
  const argTracked: PolyMarket[] = data?.argTracked ?? [];
  const indicators: PolyIndicator[] = data?.indicators ?? [];
  const argNote: string | undefined = data?.argNote;

  const filtered = activeTab === "todos"
    ? indicators
    : indicators.filter(m => m.category === activeTab);

  return (
    <div className={standalone ? "fade-up" : ""}>
      {standalone && <SectionLabel t={t}>SENTIMIENTO DE MERCADO · POLYMARKET</SectionLabel>}

      {isLoading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10, marginBottom:20 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} w="100%" h={140} />)}
        </div>
      )}

      {error && (
        <div style={{ background:t.rdBg, border:`1px solid ${t.rd}33`, borderRadius:10, padding:"14px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:20 }}>
          ⚠️ Error cargando datos de Polymarket. Intentá de nuevo en unos minutos.
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Argentina tracked */}
          {argTracked.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
                🇦🇷 MERCADOS ARGENTINOS
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:10 }}>
                {argTracked.map((m,i) => <TrackedMarketCard key={i} m={m} />)}
              </div>
              {argNote && (
                <div style={{ marginTop:8, padding:"8px 12px", background:t.alt, borderRadius:7, fontFamily:FB, fontSize:9, color:t.fa, borderLeft:`2px solid ${t.go}44` }}>
                  ⚖️ {argNote}
                </div>
              )}
            </div>
          )}

          {/* Tracked markets (global) */}
          {tracked.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
                🔴 MERCADOS EN FOCO
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:10 }}>
                {tracked.slice(0,6).map((m,i) => <TrackedMarketCard key={i} m={m} />)}
              </div>
            </div>
          )}

          {/* Indicators table */}
          {indicators.length > 0 && (
            <div>
              {/* Category filter */}
              <div style={{ display:"flex", gap:4, marginBottom:12, borderBottom:`1px solid ${t.brd}`, paddingBottom:8 }}>
                {CAT_TABS.map(ct => {
                  const count = ct.id === "todos" ? indicators.length : indicators.filter(m=>m.category===ct.id).length;
                  return (
                    <button key={ct.id} onClick={() => setActiveTab(ct.id)} style={{
                      padding:"5px 12px", borderRadius:6, fontFamily:FB, fontSize:11,
                      fontWeight:activeTab===ct.id?700:400, border:"none",
                      background:activeTab===ct.id?t.go+"18":"transparent",
                      color:activeTab===ct.id?t.go:t.mu, cursor:"pointer",
                    }}>
                      {ct.label} <span style={{ fontSize:9, opacity:.6 }}>({count})</span>
                    </button>
                  );
                })}
              </div>

              {filtered.length > 0 ? (
                <div style={{ border:`1px solid ${t.brd}`, borderRadius:10, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"55px 1fr 60px 65px", padding:"8px 14px", background:t.alt, borderBottom:`1px solid ${t.brd}`, fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".08em", textTransform:"uppercase" }}>
                    <span>PROB.</span><span>INDICADOR</span>
                    <span style={{ textAlign:"right" }}>SCORE</span>
                    <span style={{ textAlign:"right" }}>VOLUMEN</span>
                  </div>
                  {filtered.map((e,i) => {
                    const pct = Math.round(e.probability * 100);
                    const col = pct >= 65 ? t.gr : pct <= 35 ? t.rd : t.bl;
                    const catColor = e.category === "macro" ? "#f59e0b" : e.category === "geopolitics" ? "#8b5cf6" : "#3b82f6";
                    const vol = e.volume>=1e6?`$${(e.volume/1e6).toFixed(1)}M`:e.volume>=1000?`$${(e.volume/1000).toFixed(0)}K`:`$${Math.round(e.volume)}`;
                    return (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"55px 1fr 60px 65px", alignItems:"center", padding:"10px 14px", borderBottom:i<filtered.length-1?`1px solid ${t.brd}`:"none", transition:"background .15s" }}
                        onMouseEnter={ev=>(ev.currentTarget.style.background=t.alt)}
                        onMouseLeave={ev=>(ev.currentTarget.style.background="transparent")}>
                        <span style={{ fontFamily:FH, fontSize:18, fontWeight:800, color:col }}>{pct}%</span>
                        <div style={{ paddingRight:12, minWidth:0 }}>
                          <div style={{ fontFamily:FB, fontSize:12, fontWeight:600, color:t.tx, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>
                            {e.title}
                          </div>
                          <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:catColor, background:catColor+"18", padding:"1px 5px", borderRadius:4, letterSpacing:".06em" }}>
                            {e.category?.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.go, textAlign:"right" }}>{e.score?.toFixed(1) ?? "—"}</span>
                        <span style={{ fontFamily:FB, fontSize:10, color:t.mu, textAlign:"right" }}>{vol}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"40px 20px", fontFamily:FB, fontSize:13, color:t.fa }}>
                  No hay indicadores en esta categoría.
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, textAlign:"center" }}>
        Probabilidades en tiempo real · Polymarket.com · Solo informativo
      </div>
    </div>
  );
}
