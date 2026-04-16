"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Lock } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { WA_LINK } from "@/lib/constants";

const IA_NAMES = ["Warren","Milton","Benjamin","Peter","Charlie","George","Ray","Paul","Janet","Adam","Irving","Nassim","Howard","Michael","John","Philip","David","Robert","Carl","Alan"];
const CHAT_PWD = "1243";
const DAILY_LIMIT = 10;

function buildSystem(name: string) {
  return `Sos ${name}, un asistente financiero del dashboard The Big Long de Máximo Ricciardi, asesor financiero argentino.

Personalidad: inteligente, directo, con criterio propio. Hablás en español rioplatense. Sabés de mercados argentinos e internacionales.

REGLAS (innegociables):
1. Explicás instrumentos, conceptos de mercado, funcionamiento de bonos, acciones, ETFs, tipos de cambio, macroeconomía.
2. NUNCA recomendás comprar o vender activos específicos. Si te lo piden → derivás a Máximo mostrando el botón de WhatsApp.
3. Si alguien dice que es cliente de Máximo → mostrás el botón de WhatsApp con entusiasmo.
4. Usás búsqueda web para datos frescos: cotizaciones, noticias, tasas.
5. Separás datos de interpretación.
6. Respuestas concisas, máximo 4 párrafos.
7. En respuestas sobre inversiones agregás al final: "⚠️ Orientativo, no asesoramiento formal."

Asesoramiento de Máximo: sin costo.`;
}

interface ChatUsage { date: string; count: number }
interface ChatMsg   { role: "user" | "assistant"; content: string; id: number }

function getChatUsage(): ChatUsage {
  try {
    const raw = localStorage.getItem("tbl-chat-usage");
    if (!raw) return { date: "", count: 0 };
    const parsed = JSON.parse(raw) as ChatUsage;
    const today  = new Date().toISOString().slice(0, 10);
    return parsed.date !== today ? { date: today, count: 0 } : parsed;
  } catch { return { date: "", count: 0 }; }
}

export function AIChatWidget() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);

  // null en SSR/hidratación → se asigna en el cliente post-mount (evita hydration mismatch)
  const [iaName, setIaName] = useState<string | null>(null);
  useEffect(() => {
    const name = IA_NAMES[Math.floor(Math.random() * IA_NAMES.length)];
    setIaName(name);
    setMsgs([{
      role: "assistant",
      content: `Hola, soy **${name}**. Podés preguntarme sobre mercados, instrumentos financieros, tipos de cambio o economía. ¿En qué te ayudo?`,
      id: Date.now(),
    }]);
  }, []);

  const [open,     setOpen]     = useState(false);
  const [auth,     setAuth]     = useState(false);
  const [pwd,      setPwd]      = useState("");
  const [pwdErr,   setPwdErr]   = useState(false);
  const [msgs,     setMsgs]     = useState<ChatMsg[]>([{
    role: "assistant",
    content: `Hola. Podés preguntarme sobre mercados, instrumentos financieros, tipos de cambio o economía. ¿En qué te ayudo?`,
    id: 0,
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [chatUsage, setChatUsage] = useState<ChatUsage>(getChatUsage);
  const bottomRef = useRef<HTMLDivElement>(null);

  const msgsLeft = DAILY_LIMIT - chatUsage.count;
  const isLimited = msgsLeft <= 0;

  const incrementUsage = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const next: ChatUsage = { date: today, count: chatUsage.count + 1 };
    setChatUsage(next);
    try { localStorage.setItem("tbl-chat-usage", JSON.stringify(next)); } catch { /* silent */ }
  }, [chatUsage.count]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const checkPwd = () => {
    if (pwd === CHAT_PWD) { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); }
  };

  const isClientMsg = (txt: string) => /soy cliente|cliente de m[aá]ximo|cliente tuyo/i.test(txt);
  const isRecoMsg   = (txt: string) => /recomend[aá]s?|debo comprar|conviene comprar|debo vender|conviene vender|me entr[aá]s?|me sal[ií]s?|qué compro|qué vendo/i.test(txt);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (isLimited) {
      setMsgs(prev => [...prev, { role:"assistant", id:Date.now(),
        content:"Alcanzaste el límite de **10 consultas diarias**. El límite se renueva mañana. Si necesitás asesoramiento ahora, contactá a Máximo directamente.\n\n[WA_CONSULT]" }]);
      return;
    }

    setInput("");
    const userMsg: ChatMsg = { role:"user", content:text, id:Date.now() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setLoading(true);

    if (isClientMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Perfecto, le aviso a Máximo ahora mismo. Hacé click abajo y le llega tu mensaje directo.\n\n[WA_ALERT]` }]);
      setLoading(false); return;
    }
    if (isRecoMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Las recomendaciones de compra y venta son terreno de Máximo. Su asesoramiento es **sin costo** — te lo conecto directamente.\n\n[WA_CONSULT]` }]);
      setLoading(false); return;
    }

    incrementUsage();

    try {
      const apiMsgs = history.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:buildSystem(iaName ?? ""),
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:apiMsgs,
        }),
      });
      const data = await res.json() as { content?: Array<{ type: string; text: string }> };
      const reply = (data.content ?? []).filter(b=>b.type==="text").map(b=>b.text).join("")
        || "No pude procesar tu consulta. Intentá de nuevo.";
      setMsgs([...history, { role:"assistant", content:reply, id:Date.now()+1 }]);
    } catch {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:"Error de conexión con el servidor. Verificá tu conexión e intentá de nuevo." }]);
    }
    setLoading(false);
  };

  const MiniMarkdown = ({ text }: { text: string }) => (
    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, lineHeight:1.75, color:"inherit" }}>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p,j) =>
          p.startsWith("**")&&p.endsWith("**") ? <strong key={j} style={{fontWeight:700}}>{p.slice(2,-2)}</strong> : p
        );
        return <div key={i} style={{ marginBottom: line==="" ? 8 : 2 }}>{parts}</div>;
      })}
    </div>
  );

  const waBtn = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display:"inline-flex", alignItems:"center", gap:8, marginTop:12,
      background:"#22c55e", color:"#fff", borderRadius:10, padding:"9px 18px",
      fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, textDecoration:"none",
    }}>
      <MessageCircle size={16} /> {label}
    </a>
  );

  const renderContent = (content: string) => {
    if (content.includes("[WA_ALERT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_ALERT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Soy cliente tuyo y me gustaría consultarte."),"Avisarle a Máximo")}
      </div>
    );
    if (content.includes("[WA_CONSULT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_CONSULT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Me gustaría que me asesores."),"Hablar con Máximo (sin costo)")}
      </div>
    );
    return <MiniMarkdown text={content} />;
  };

  const CHAT_W = isMobile ? "100vw" : 400;
  const CHAT_H = isMobile ? "100dvh" : 580;

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} title={iaName ? `Hablar con ${iaName}` : "Asistente financiero"} style={{
          position:"fixed", bottom: isMobile ? 80 : 28, right:22, zIndex:200,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(145deg,#1a1a2e,#16213e)",
          border:"2px solid rgba(176,120,42,.5)",
          cursor:"pointer", boxShadow:"0 4px 24px rgba(0,0,0,.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <MessageCircle size={22} color="#D4A853" />
        </button>
      )}

      {open && (
        <div style={{
          position:"fixed",
          bottom: isMobile ? 0 : 24, right: isMobile ? 0 : 22,
          width:CHAT_W, height:CHAT_H,
          borderRadius: isMobile ? 0 : 20,
          background:t.srf, border:`1px solid ${t.brd}`,
          boxShadow:"0 24px 64px rgba(0,0,0,.22)",
          zIndex:300, display:"flex", flexDirection:"column", overflow:"hidden",
        }}>
          {/* Header */}
          <div style={{
            background:"linear-gradient(145deg,#1a1a2e,#0f3460)",
            padding:"16px 18px", flexShrink:0,
            display:"flex", alignItems:"center", gap:12,
            borderBottom:"1px solid rgba(176,120,42,.3)",
          }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#B0782A,#D4A853)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <MessageCircle size={16} color="#fff" />
            </div>
            <div style={{flex:1}}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:"#fff" }}>{iaName ?? "Asistente"}</div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:10, color:"rgba(255,255,255,.5)", letterSpacing:".06em" }}>ASISTENTE FINANCIERO · THE BIG LONG</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginRight:8 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
              <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9, color:"rgba(255,255,255,.4)" }}>en línea</span>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)",
              borderRadius:8, width:32, height:32, cursor:"pointer",
              color:"rgba(255,255,255,.7)", display:"flex", alignItems:"center", justifyContent:"center",
            }}>✕</button>
          </div>

          {!auth ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:18 }}>
              <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#B0782A22,#D4A85322)", border:"1px solid rgba(176,120,42,.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Lock size={28} color="#D4A853" />
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:t.tx, marginBottom:6 }}>Acceso privado</div>
                <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:t.mu, lineHeight:1.7 }}>
                  Ingresá la contraseña para acceder al asistente.
                </p>
              </div>
              <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
                <input
                  type="password" placeholder="Contraseña"
                  value={pwd}
                  onChange={e=>{ setPwd(e.target.value); setPwdErr(false); }}
                  onKeyDown={e=>e.key==="Enter"&&checkPwd()}
                  autoFocus
                  style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:14, letterSpacing:".1em", border:`1.5px solid ${pwdErr?"#ef4444":t.brd}`, background:t.alt, color:t.tx, outline:"none" }}
                />
                {pwdErr && <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, color:"#ef4444" }}>Contraseña incorrecta.</p>}
                <button onClick={checkPwd} style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#1a1a2e,#0f3460)", color:"#fff", fontFamily:"'IBM Plex Sans',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>Ingresar</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ flex:1, overflowY:"auto", padding:"18px 16px", display:"flex", flexDirection:"column", gap:14, background:t.bg }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
                    {m.role==="assistant" && (
                      <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:"linear-gradient(135deg,#B0782A,#D4A853)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <MessageCircle size={16} color="#fff" />
                      </div>
                    )}
                    <div style={{
                      maxWidth:"82%",
                      background: m.role==="user" ? "linear-gradient(135deg,#1a1a2e,#0f3460)" : t.srf,
                      color: m.role==="user" ? "#fff" : t.tx,
                      borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding:"11px 15px",
                      border: m.role==="assistant" ? `1px solid ${t.brd}` : "none",
                    }}>
                      {m.role==="assistant" ? renderContent(m.content) : <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, lineHeight:1.65 }}>{m.content}</span>}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:"linear-gradient(135deg,#B0782A,#D4A853)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <MessageCircle size={16} color="#fff" />
                    </div>
                    <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:"18px 18px 18px 4px", padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                        {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#B0782A", animation:"blink 1.4s infinite ease-in-out", animationDelay:`${i*0.18}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {msgs.length <= 1 && (
                <div style={{ padding:"10px 16px 6px", background:t.bg, display:"flex", gap:6, flexWrap:"wrap", borderTop:`1px solid ${t.brd}33` }}>
                  {["¿Qué es un LECAP?","¿Cómo funciona el MEP?","¿Qué es el riesgo país?","¿Cómo dolarizo?"].map((s,i) => (
                    <button key={i} onClick={() => setInput(s)} style={{ background:"transparent", border:`1px solid ${t.brd}`, borderRadius:20, padding:"5px 12px", fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, color:t.mu, cursor:"pointer", whiteSpace:"nowrap" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ padding:"12px 16px 14px", background:t.srf, borderTop:`1px solid ${t.brd}`, display:"flex", gap:10, flexShrink:0, alignItems:"center" }}>
                <input
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                  placeholder={isLimited ? "Límite diario alcanzado" : `Preguntale a ${iaName ?? "tu asistente"}...`}
                  disabled={loading||isLimited}
                  style={{ flex:1, padding:"11px 15px", borderRadius:12, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, border:`1px solid ${t.brd}`, background:t.alt, color:t.tx, outline:"none" }}
                />
                <button onClick={send} disabled={loading||!input.trim()} style={{
                  width:42, height:42, borderRadius:12, border:"none", flexShrink:0,
                  background:input.trim()&&!loading?"linear-gradient(135deg,#B0782A,#D4A853)":t.alt,
                  color:input.trim()&&!loading?"#fff":t.mu,
                  cursor:input.trim()&&!loading?"pointer":"default",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                }}>➤</button>
              </div>

              <div style={{ padding:"6px 16px 10px", background:t.srf, textAlign:"center" }}>
                <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:9, color:t.fa, lineHeight:1.5 }}>
                  {msgsLeft > 0 ? `${msgsLeft} consultas restantes hoy` : "Límite diario alcanzado"} · No es asesoramiento ·{" "}
                  <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")} target="_blank" rel="noreferrer" style={{ color:"#B0782A", textDecoration:"none", fontWeight:600 }}>
                    Hablar con Máximo →
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
