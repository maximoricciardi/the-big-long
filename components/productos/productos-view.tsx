"use client";

import { useState } from "react";
import { Banknote, Wallet, Package, Lock } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { Card } from "@/components/ui/card";
import { FONDOS_BALANZ } from "@/lib/data/fondos";
import { BALANZ_ETPS } from "@/lib/data/etps";
import { FB, FH, WA_LINK } from "@/lib/constants";

const SUBS = [
  { id:"cuentas", label:"Cuentas y Billeteras", Icon:Banknote },
  { id:"fondos",  label:"FCIs",                  Icon:Wallet },
  { id:"etps",    label:"ETPs",                  Icon:Package },
];

export function ProductosView() {
  const t = useAppTheme();
  const [sub,      setSub]      = useState("cuentas");
  const [pin,      setPin]      = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error,    setError]    = useState(false);

  const tryUnlock = () => {
    if (pin === "1243") { setUnlocked(true); setError(false); }
    else { setError(true); setPin(""); setTimeout(() => setError(false), 1800); }
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBS.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:400,
            border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.goBg:"transparent",
            color:sub===s.id?t.go:t.mu, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .15s",
          }}>
            <s.Icon size={14} strokeWidth={sub===s.id?2.5:1.5} /> {s.label}
          </button>
        ))}
      </div>

      {sub === "cuentas" && <CuentasPanel />}
      {sub === "fondos"  && <FCIsPanel />}
      {sub === "etps"    && <ETPsPanel pin={pin} setPin={setPin} unlocked={unlocked} error={error} tryUnlock={tryUnlock} />}

      <WhatsAppCTA />
    </div>
  );
}

function CuentasPanel() {
  const t       = useAppTheme();
  const isMobile= useIsMobile(640);

  const cuentas = [
    {
      nombre:"Cuenta Comitente (BYMA)",
      desc:"Cuenta de inversión habilitada para operar acciones, bonos, LECAPs, CEDEARs y demás valores negociables en el mercado argentino.",
      items:["Apertura 100% digital en menos de 24hs","Operatoria en pesos y dólares","Acceso a todos los instrumentos del mercado local","Liquidación T+2 estándar, T+1 en cauciones"],
      color:"blue", badge:"RECOMENDADA",
    },
    {
      nombre:"Caja de Ahorro en USD",
      desc:"Cuenta bancaria en dólares para mantener fondos líquidos en moneda dura con rendimiento a través de FCI o plazos fijos USD.",
      items:["Transferencias en USD al exterior","Inversión en FCIs dólar linked","Plazos fijos en USD (7 días mín.)","Sin límite de depósito"],
      color:"gold",
    },
    {
      nombre:"Cuenta Corriente Inversora",
      desc:"Cuenta operativa integrada con tu comitente para transferir fondos en tiempo real y aprovechar las oportunidades del mercado.",
      items:["Débito automático para suscripción de FCIs","Plataforma web y mobile integrada","Alertas de precios y vencimientos","Soporte personalizado"],
      color:"green",
    },
  ];

  const cMap: Record<string, { ac: string; bg: string }> = {
    blue:  { ac:t.bl, bg:t.blBg },
    gold:  { ac:t.go, bg:t.goBg },
    green: { ac:t.gr, bg:t.grBg },
  };

  return (
    <div className="fade-up">
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {cuentas.map((c, i) => {
          const col = cMap[c.color];
          return (
            <div key={i} style={{ background:col.bg, border:`1px solid ${col.ac}22`, borderLeft:`4px solid ${col.ac}`, borderRadius:14, padding:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx }}>{c.nombre}</div>
                {c.badge && <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:col.ac, background:col.ac+"18", padding:"2px 8px", borderRadius:10 }}>{c.badge}</span>}
              </div>
              <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6, marginBottom:12 }}>{c.desc}</p>
              <ul style={{ margin:0, padding:0, listStyle:"none" }}>
                {c.items.map((item, j) => (
                  <li key={j} style={{ fontFamily:FB, fontSize:11, color:t.tx, padding:"3px 0", display:"flex", alignItems:"flex-start", gap:6 }}>
                    <span style={{ color:col.ac, flexShrink:0, marginTop:1 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FCIsPanel() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);
  const [active, setActive] = useState(0);
  const cat = FONDOS_BALANZ[active];

  return (
    <div className="fade-up">
      {/* Category tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {FONDOS_BALANZ.map((c, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, fontWeight:active===i?700:400,
            border:`1.5px solid ${active===i?t.go:t.brd}`, background:active===i?t.goBg:"transparent",
            color:active===i?t.go:t.mu, cursor:"pointer", transition:"all .15s",
          }}>{c.cat}</button>
        ))}
      </div>

          {cat && (
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
          {cat.fondos.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
              <Card t={t} style={{ height:"100%", cursor:"pointer" }}>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:t.go }}>{f.ticker}</span>
                    {f.destacado && <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:8 }}>★ DESTACADO</span>}
                  </div>
                  <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx, marginBottom:4 }}>{f.nombre}</div>
                  {f.note && <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginBottom:10, lineHeight:1.5 }}>{f.note}</div>}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:"auto" }}>
                    <span style={{ fontFamily:FB, fontSize:9, background:t.blBg, color:t.bl, padding:"2px 7px", borderRadius:8 }}>{f.tipo}</span>
                    <span style={{ fontFamily:FB, fontSize:9, background:t.alt, color:t.mu, padding:"2px 7px", borderRadius:8 }}>Rescate {f.rescate}</span>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ETPsPanel({ pin, setPin, unlocked, error, tryUnlock }: {
  pin: string; setPin: (v: string) => void;
  unlocked: boolean; error: boolean; tryUnlock: () => void;
}) {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);

  if (!unlocked) {
    return (
      <div className="fade-up" style={{ maxWidth:360, margin:"40px auto", textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:14, background:t.goBg, border:`1px solid ${t.go}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Lock size={24} color={t.go} />
        </div>
        <div style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:8 }}>ETPs Balanz International</div>
        <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6, marginBottom:20 }}>
          Contenido exclusivo para clientes. Ingresá tu PIN para ver los ETPs disponibles.
        </p>
        <input
          type="password" placeholder="PIN"
          value={pin} onChange={e => { setPin(e.target.value); }}
          onKeyDown={e => e.key==="Enter" && tryUnlock()}
          autoFocus
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:FB, fontSize:14, border:`1.5px solid ${error?t.rd:t.brd}`, background:t.srf, color:t.tx, outline:"none", letterSpacing:".1em", textAlign:"center", marginBottom:12 }}
        />
        {error && <p style={{ fontFamily:FB, fontSize:11, color:t.rd, marginBottom:8 }}>PIN incorrecto.</p>}
        <button onClick={tryUnlock} style={{ width:"100%", padding:"12px", borderRadius:12, border:"none", background:t.go, color:"#fff", fontFamily:FB, fontWeight:700, fontSize:14, cursor:"pointer" }}>
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {BALANZ_ETPS.map((etp, i) => {
          const cMap: Record<string, { ac: string; bg: string }> = {
            blue:  { ac:t.bl, bg:t.blBg }, gold: { ac:t.go, bg:t.goBg },
            green: { ac:t.gr, bg:t.grBg }, red:  { ac:t.rd, bg:t.rdBg },
          };
          const col = cMap[etp.color] ?? cMap.blue;
          return (
            <Card key={i} t={t}>
              <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:col.ac, background:col.bg, padding:"2px 8px", borderRadius:8, textTransform:"uppercase", letterSpacing:".06em" }}>{etp.tipo}</span>
                  <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>AUM: ${etp.aum}M</span>
                </div>
                <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, marginBottom:4 }}>{etp.nombre}</div>
                <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.5, marginBottom:10 }}>{etp.tagline}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:8 }}>
                  {[
                    { label:"NAV",      value:etp.nav },
                    { label:"YTM",      value:etp.ytm ?? "—" },
                    { label:"Duration", value:etp.duration ?? "—" },
                    { label:"Fee",      value:etp.fee },
                  ].map((kv, j) => (
                    <div key={j} style={{ background:t.alt, borderRadius:6, padding:"5px 8px" }}>
                      <div style={{ fontFamily:FB, fontSize:8, color:t.fa, marginBottom:1 }}>{kv.label}</div>
                      <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx }}>{kv.value}</div>
                    </div>
                  ))}
                </div>
                {etp.rend.ytd != null && (
                  <div style={{ fontFamily:FB, fontSize:10, color:t.mu }}>
                    YTD: <strong style={{ color:etp.rend.ytd >= 0 ? t.gr : t.rd }}>{etp.rend.ytd >= 0 ? "+" : ""}{etp.rend.ytd.toFixed(1)}%</strong>
                    {etp.rend.y1 != null && <> · 12m: <strong style={{ color:etp.rend.y1 >= 0 ? t.gr : t.rd }}>{etp.rend.y1 >= 0 ? "+" : ""}{etp.rend.y1.toFixed(1)}%</strong></>}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function WhatsAppCTA() {
  const t = useAppTheme();
  return (
    <div style={{ background:t.goBg, border:`1px solid ${t.go}33`, borderRadius:14, padding:"20px 24px", marginTop:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
      <div>
        <div style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx, marginBottom:4 }}>¿Te interesa suscribir a algún FCI?</div>
        <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.5 }}>Consultá con un asesor para armar la estrategia que mejor se adapta a tu perfil.</div>
      </div>
      <a href={WA_LINK("Hola Máximo, me gustaría consultar sobre FCIs y productos Balanz.")} target="_blank" rel="noreferrer"
        style={{ background:t.go, color:"#fff", borderRadius:10, padding:"10px 20px", fontFamily:FB, fontWeight:700, fontSize:12, textDecoration:"none", whiteSpace:"nowrap" }}>
        Consultar →
      </a>
    </div>
  );
}
