"use client";

import { useState, useCallback } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { FB } from "@/lib/constants";
import type { ExtraItem } from "@/types";

interface AdminPanelProps {
  onClose:   () => void;
  onPublish: (item: ExtraItem) => void;
}

export function AdminPanel({ onClose, onPublish }: AdminPanelProps) {
  const t = useAppTheme();
  const [txt,     setTxt]     = useState("");
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");

  const process = useCallback(async () => {
    if (!txt.trim()) return;
    setLoading(true); setMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Sos un editor financiero argentino. Tu tarea: convertir el texto del usuario en un objeto JSON limpio para publicar en una landing page financiera.
Respondé SOLO con JSON válido, sin texto extra, sin markdown backticks.
Estructura:
{
  "title": "Titular breve y claro (máx 8 palabras)",
  "date": "fecha mencionada o 'HOY'",
  "type": "resumen|noticia|alerta|balance|dato",
  "kpis": [{"k":"LABEL","v":"VALOR","b":"CHIP","bc":"green|red|blue|gold|gray"}],
  "content": "HTML con análisis en 3-4 oraciones. Usá <b>negritas</b> para los datos clave."
}
Reglas: no inventés datos, usá solo lo que viene en el texto, tono técnico-profesional.`,
          messages:[{role:"user",content:txt}],
        }),
      });
      const d = await res.json() as { content?: Array<{ type: string; text: string }> };
      const raw    = d.content?.find(x=>x.type==="text")?.text ?? "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim()) as ExtraItem;
      parsed.id    = Date.now().toString();
      onPublish(parsed);
      setMsg("✅ Publicado correctamente");
      setTxt("");
    } catch {
      setMsg("❌ Error al procesar. Verificá el contenido.");
    }
    setLoading(false);
  }, [txt, onPublish]);

  return (
    <div style={{ background:t.goBg, borderBottom:`2px solid ${t.go}`, padding:"16px 20px" }}>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, color:t.go, fontFamily:FB, fontSize:14 }}>
            🔑 Panel Admin — Publicar contenido
          </span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:t.go, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <textarea
          value={txt} onChange={e=>setTxt(e.target.value)}
          placeholder="Pegá el texto con información del día: resumen de mercado, noticias, balance de empresa, cotizaciones, etc."
          style={{ width:"100%", height:90, padding:12, borderRadius:8, border:`1px solid ${t.go}55`, fontFamily:FB, fontSize:13, resize:"vertical", background:t.srf, color:t.tx, outline:"none" }}
        />
        <div style={{ display:"flex", gap:10, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={process} disabled={loading} style={{
            background:t.go, color:"#fff", border:"none", borderRadius:8,
            padding:"9px 22px", fontFamily:FB, fontWeight:700, fontSize:13, cursor:"pointer",
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Procesando…" : "✨ Procesar y publicar"}
          </button>
          {msg && <span style={{ fontSize:13, fontFamily:FB, color:msg.startsWith("✅")?t.gr:t.rd }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
