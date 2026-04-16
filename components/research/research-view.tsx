"use client";

import { useState, useEffect } from "react";
import { ClipboardList, BarChart3, FileText, Activity, Briefcase, CircleDot, Lock, AlertTriangle, PieChart, Globe, Clock } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";
import { PolymarketPanel } from "@/components/polymarket/polymarket-panel";
import { SUMMARIES } from "@/lib/data/summaries";
import { NOTICIAS } from "@/lib/data/noticias";
import { MICRON } from "@/lib/data/micron";
import { PERFILES } from "@/lib/data/perfiles";
import { FB, FH } from "@/lib/constants";

const SUBTABS = [
  { id:"resumen",    label:"Resumen Diario",  Icon:ClipboardList },
  { id:"balances",   label:"Balances",         Icon:BarChart3 },
  { id:"informes",   label:"Informes",         Icon:FileText },
  { id:"polymarket", label:"Sentimiento",      Icon:Activity },
  { id:"recos",      label:"Recomendaciones",  Icon:Briefcase },
];

interface ResearchViewProps {
  initialSub?: string;
  onSubChange?: (sub: string) => void;
}

export function ResearchView({ initialSub = "resumen", onSubChange }: ResearchViewProps) {
  const t = useAppTheme();
  const [sub, setSub] = useState(initialSub);

  useEffect(() => { setSub(initialSub); }, [initialSub]);

  const handleSub = (id: string) => { setSub(id); onSubChange?.(id); };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {SUBTABS.map(s => (
          <button key={s.id} onClick={() => handleSub(s.id)} style={{
            padding:"9px 22px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s",
            border:`2px solid ${sub===s.id?t.go:t.brd}`,
            background:sub===s.id?t.go+"18":"transparent",
            color:sub===s.id?t.go:t.mu,
            display:"flex", alignItems:"center", gap:6,
          }}>
            <s.Icon size={14} /> {s.label}
          </button>
        ))}
      </div>

      {sub === "resumen"    && <ResumenPanel />}
      {sub === "balances"   && <BalancesPanel />}
      {sub === "informes"   && <InformesPanel />}
      {sub === "polymarket" && <PolymarketPanel standalone />}
      {sub === "recos"      && <RecomendacionesPanel />}
    </div>
  );
}

/* ── RESUMEN DIARIO ── */
function ResumenPanel() {
  const t = useAppTheme();
  const [selS, setSelS] = useState(0);

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUMMARIES.map((s, i) => (
          <button key={s.id} onClick={() => setSelS(i)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:500,
            cursor:"pointer", transition:"all .2s",
            border:`2px solid ${selS===i?t.tx:t.brd}`,
            background:selS===i?t.tx:"transparent",
            color:selS===i?"#fff":t.mu,
          }}>
            {i===0 && <CircleDot size={10} style={{ marginRight:4, verticalAlign:"middle", color:"#ef4444" }} />}
            {s.date}
            {i===0 && <span style={{ marginLeft:6, fontSize:9, background:t.rd, color:"#fff", padding:"1px 5px", borderRadius:8 }}>ÚLTIMO</span>}
          </button>
        ))}
      </div>
      <SummaryCard s={SUMMARIES[selS]} />
    </div>
  );
}

function SummaryCard({ s }: { s: typeof SUMMARIES[0] }) {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  if (!s) return null;

  const bcMap: Record<string, string> = { green:t.gr, red:t.rd, blue:t.bl, gold:t.go, gray:t.mu };

  return (
    <Card t={t}>
      <div style={{ padding:isMobile?"18px 14px":"24px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:t.go, background:t.goBg, padding:"3px 10px", borderRadius:20 }}>● {s.date}</span>
          {s.label && <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{s.label}</span>}
        </div>

        {/* KPIs */}
        {s.kpis && s.kpis.length > 0 && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
            {s.kpis.map((k, i) => {
              const col = bcMap[k.bc] ?? t.mu;
              return (
                <div key={i} style={{ background:t.alt, borderRadius:8, padding:"8px 12px", fontFamily:FB, display:"flex", flexDirection:"column", gap:2 }}>
                  <span style={{ fontSize:8, color:t.fa, letterSpacing:".06em", textTransform:"uppercase" }}>{k.k}</span>
                  <span style={{ fontSize:15, fontWeight:700, color:t.tx }}>{k.v}</span>
                  {k.b && <span style={{ fontSize:8, fontWeight:600, color:col, background:`${col}15`, padding:"0 5px", borderRadius:4, width:"fit-content" }}>{k.b}</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Cards */}
        {s.cards && s.cards.map((c, i) => (
          <div key={i} style={{ padding:"14px 0", borderTop:`1px solid ${t.brd}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:14 }}>{c.icon}</span>
              <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:c.ac, letterSpacing:".08em", textTransform:"uppercase" }}>{c.cat}</span>
            </div>
            <div style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx, marginBottom:6 }}>{c.title}</div>
            {c.note && <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html:c.note }} />}
          </div>
        ))}

        {/* International markets */}
        {s.intl && s.intl.length > 0 && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>MERCADOS INTERNACIONALES</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {s.intl.map((item, i) => {
                const col = item.neg ? t.rd : item.ch?.startsWith("+") ? t.gr : t.mu;
                return (
                  <div key={i} style={{ background:t.alt, borderRadius:8, padding:"8px 12px", fontFamily:FB, textAlign:"center" }}>
                    <div style={{ fontSize:9, color:t.fa, textTransform:"uppercase", letterSpacing:".06em", marginBottom:2 }}>{item.n}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:t.tx }}>{item.v}</div>
                    {item.ch && <div style={{ fontSize:10, fontWeight:700, color:col }}>{item.ch}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── BALANCES ── */
function BalancesPanel() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);

  const WEEK_EARNINGS = [
    { dia:"Lun 6",  empresas:[{t:"—",n:"Sin reportes relevantes",nota:"Mercados de apertura"}] },
    { dia:"Mar 7",  empresas:[{t:"PLAY",n:"Dave & Buster's",nota:"Entretenimiento · After hours"}] },
    { dia:"Mié 8",  empresas:[
      {t:"DAL",n:"Delta Air Lines",nota:"Pre-market · EPS est. $0.62",dest:true},
      {t:"STZ",n:"Constellation Brands",nota:"Pre-market · EPS est. $1.72",dest:true},
      {t:"RPM",n:"RPM International",nota:"Pre-market · EPS est. $0.37"},
      {t:"APLD",n:"Applied Digital",nota:"Data centers / IA · After hours"},
    ]},
    { dia:"Jue 9",  empresas:[{t:"PSMT",n:"PriceSmart",nota:"Retail · After hours"}] },
    { dia:"Vie 10", empresas:[{t:"—",n:"Mercados cerrados",nota:"Viernes Santo · NYSE/NASDAQ cierran"}] },
  ];

  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom:20, borderLeft:`4px solid ${t.go}` }}>
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:t.goBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ClipboardList size={18} color={t.go} />
              </div>
              <div>
                <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>Earnings de la semana</div>
                <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>6 — 10 ABR 2026 · Empresas que reportan resultados</div>
              </div>
            </div>
            <div style={{ background:t.rdBg, border:`1px solid ${t.rd}33`, borderRadius:8, padding:"5px 12px", fontFamily:FB, fontSize:10, fontWeight:700, color:t.rd, display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:t.rd, display:"inline-block" }} />
              TEMPORADA Q1 2026
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8, marginBottom:16 }}>
            {WEEK_EARNINGS.map((d, di) => (
              <div key={di} style={{ background:t.alt, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.go, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{d.dia}</div>
                {d.empresas.map((e: { t: string; n: string; nota: string; dest?: boolean }, ei) => (
                  <div key={ei} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:ei<d.empresas.length-1?6:0 }}>
                    {e.t !== "—" && (
                      <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4, background:e.dest?t.go+"22":t.srf, color:e.dest?t.go:t.tx, border:`1px solid ${e.dest?t.go+"44":t.brd}` }}>{e.t}</span>
                    )}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:FB, fontSize:11, fontWeight:e.t!=="—"?600:400, color:e.t!=="—"?t.tx:t.fa, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.n}</div>
                      <div style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{e.nota}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Micron balance */}
          <div style={{ background:t.blBg, border:`1px solid ${t.bl}33`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.bl, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>
              📊 BALANCE DETALLADO — {MICRON.ticker} · {MICRON.nombre}
            </div>
            <div style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx, marginBottom:4 }}>{MICRON.headline}</div>
            <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6, marginBottom:12 }}>{MICRON.headlineSub} · Período: {MICRON.periodo}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {MICRON.resultados.map((r, ri) => (
                <div key={ri} style={{ background:t.srf, borderRadius:8, padding:"8px 12px" }}>
                  <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx }}>{r.valor}</div>
                  {r.badge && <div style={{ fontFamily:FB, fontSize:9, color:r.bc==="green"?t.gr:r.bc==="red"?t.rd:t.mu }}>{r.badge}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── INFORMES ── */
function InformesPanel() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  const [selected, setSelected] = useState<typeof NOTICIAS[0] | null>(null);

  const acMap: Record<string, string> = { blue:t.bl, green:t.gr, gold:t.go, red:t.rd };

  if (selected) {
    const ac = acMap[selected.catColor] ?? t.go;
    return (
      <div className="fade-up">
        <button onClick={() => setSelected(null)} style={{ fontFamily:FB, fontSize:12, color:t.bl, background:"none", border:"none", cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
          ← Volver a informes
        </button>
        <Card t={t}>
          <div style={{ padding:"24px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:24 }}>{selected.emoji}</span>
              <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:ac, background:`${ac}18`, padding:"3px 10px", borderRadius:12, textTransform:"uppercase", letterSpacing:".08em" }}>{selected.cat}</span>
              <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>{selected.fecha}</span>
            </div>
            <h1 style={{ fontFamily:FH, fontSize:isMobile?20:26, fontWeight:800, color:t.tx, lineHeight:1.25, marginBottom:8 }}>{selected.titulo}</h1>
            <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.7, marginBottom:20 }}>{selected.subtitulo}</p>
            <div style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.9 }} dangerouslySetInnerHTML={{ __html:selected.cuerpo }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
        {NOTICIAS.map((n) => {
          const ac = acMap[n.catColor] ?? t.go;
          return (
            <button key={n.id} onClick={() => setSelected(n)} style={{
              background:t.srf, border:`1px solid ${t.brd}`, borderTop:`3px solid ${ac}`,
              borderRadius:14, padding:"18px 20px", textAlign:"left", cursor:"pointer",
              transition:"all .18s", display:"flex", flexDirection:"column", gap:10,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:20 }}>{n.emoji}</span>
                <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:ac, background:`${ac}18`, padding:"2px 8px", borderRadius:10 }}>{n.cat}</span>
                {n.estrella && <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:8, fontWeight:700, color:"#fff", background:t.rd, padding:"2px 7px", borderRadius:8 }}>🔴 DESTACADO</span>}
              </div>
              <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, lineHeight:1.3 }}>{n.titulo}</div>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }}>{n.subtitulo}</div>
              <div style={{ fontFamily:FB, fontSize:10, color:t.fa }}>{n.fecha}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── RECOMENDACIONES ── */
function RecomendacionesPanel() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  const [auth,    setAuth]    = useState(false);
  const [pwd,     setPwd]     = useState("");
  const [pwdErr,  setPwdErr]  = useState(false);
  const [active,  setActive]  = useState("conservador");

  const checkPwd = () => {
    if (pwd === "1243") { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); setPwd(""); }
  };

  const pf = PERFILES.find(p => p.id === active)!;
  const cMap: Record<string, { ac: string; bg: string }> = {
    blue:  { ac:t.bl, bg:t.blBg },
    gold:  { ac:t.go, bg:t.goBg },
    purple:{ ac:t.pu, bg:t.puBg },
    green: { ac:t.gr, bg:t.grBg },
    red:   { ac:t.rd, bg:t.rdBg },
  };
  const col = cMap[pf?.color ?? "blue"];

  if (!auth) {
    return (
      <div className="fade-up" style={{ maxWidth:400, margin:"60px auto", textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:t.goBg, border:`1px solid ${t.go}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <Lock size={28} color={t.go} />
        </div>
        <h3 style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.tx, marginBottom:8 }}>Recomendaciones</h3>
        <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.7, marginBottom:24 }}>
          Esta sección es de acceso exclusivo para clientes.
        </p>
        <input type="password" placeholder="Contraseña" value={pwd}
          onChange={e => { setPwd(e.target.value); setPwdErr(false); }}
          onKeyDown={e => e.key==="Enter" && checkPwd()}
          autoFocus
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:FB, fontSize:14, border:`1.5px solid ${pwdErr?t.rd:t.brd}`, background:t.srf, color:t.tx, outline:"none", letterSpacing:".1em", textAlign:"center", marginBottom:12 }}
        />
        {pwdErr && <p style={{ fontFamily:FB, fontSize:11, color:t.rd, marginBottom:8 }}>Contraseña incorrecta.</p>}
        <button onClick={checkPwd} style={{ width:"100%", padding:"12px", borderRadius:12, border:"none", background:t.go, color:"#fff", fontFamily:FB, fontWeight:700, fontSize:14, cursor:"pointer" }}>
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ background:t.rdBg, border:`1px solid ${t.rd}44`, borderRadius:10, padding:"12px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:20, lineHeight:1.6, display:"flex", alignItems:"flex-start", gap:10 }}>
        <AlertTriangle size={16} style={{ flexShrink:0, marginTop:2 }} />
        <span><strong>Aviso importante:</strong> Contenido orientativo e informativo. No constituye asesoramiento financiero ni oferta de compra o venta.</span>
      </div>

      {/* Profile selector */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {PERFILES.map(p => {
          const pc = cMap[p.color] ?? cMap.blue;
          const isA = active === p.id;
          return (
            <button key={p.id} onClick={() => setActive(p.id)} style={{
              padding:"10px 22px", borderRadius:10, fontFamily:FB, fontSize:13, fontWeight:600,
              cursor:"pointer", transition:"all .2s",
              border:`2px solid ${isA?pc.ac:t.brd}`,
              background:isA?pc.ac:"transparent",
              color:isA?"#fff":t.mu,
              display:"flex", alignItems:"center", gap:7,
            }}>
              <p.Icon size={16} /> {p.label}
            </button>
          );
        })}
      </div>

      <Card t={t}>
        <div style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:t.tx, marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:col.ac, display:"flex" }}><pf.Icon size={26} /></span> Perfil {pf.label}
              </h2>
              <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.6, maxWidth:520 }}>{pf.desc}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:4 }}>Retorno orientativo</div>
              <Badge c="gold" t={t}>{pf.retorno}</Badge>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:8 }}>Riesgo: <strong>{pf.riesgo}</strong></div>
            </div>
          </div>

          <SectionLabel t={t}>COMPOSICIÓN ORIENTATIVA</SectionLabel>

          {/* Bar chart */}
          <div style={{ display:"flex", height:8, borderRadius:6, overflow:"hidden", marginBottom:16 }}>
            {pf.ideas.map((idea, i) => {
              const pctNum = parseInt(idea.por);
              const colors = [t.bl, t.gr, t.go, t.pu, t.rd, t.mu];
              return <div key={i} style={{ width:`${pctNum}%`, background:colors[i%colors.length], transition:"width .4s" }} />;
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
            {pf.ideas.map((idea, i) => {
              type TipoKey = "fondo"|"lecap"|"bono"|"cedear"|"caucion";
              const tipoMap: Record<TipoKey, { c: string; bg: string; Icon: React.ElementType; label: string }> = {
                fondo:   { c:t.bl, bg:t.blBg, Icon:PieChart,     label:"FONDO" },
                lecap:   { c:t.go, bg:t.goBg, Icon:ClipboardList, label:"LECAP" },
                bono:    { c:t.pu, bg:t.puBg, Icon:FileText,      label:"BONO" },
                cedear:  { c:t.gr, bg:t.grBg, Icon:Globe,         label:"CEDEAR" },
                caucion: { c:t.mu, bg:t.alt,  Icon:Clock,         label:"CAUCIÓN" },
              };
              const tm = tipoMap[idea.tipo as TipoKey] ?? tipoMap.fondo;
              return (
                <div key={i} style={{ background:tm.bg, border:`1px solid ${tm.c}22`, borderRadius:12, padding:"16px 18px", borderLeft:`4px solid ${tm.c}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontFamily:FH, fontWeight:800, fontSize:24, color:tm.c }}>{idea.por}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:tm.c, background:`${tm.c}18`, padding:"2px 7px", borderRadius:10, letterSpacing:".06em", display:"flex", alignItems:"center", gap:3 }}>
                      <tm.Icon size={10} /> {tm.label}
                    </span>
                  </div>
                  <div style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:t.tx, marginBottom:4 }}>{idea.inst}</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.5 }}>{idea.note}</div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:16, fontStyle:"italic" }}>{pf.disclaimer}</p>
        </div>
      </Card>
    </div>
  );
}
