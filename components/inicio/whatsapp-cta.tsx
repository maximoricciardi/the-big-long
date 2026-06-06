"use client";

/**
 * components/inicio/whatsapp-cta.tsx
 * Canal de difusión WhatsApp — acceso directo con diseño profesional
 */

import { MessageCircle } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH } from "@/lib/constants";

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbAtCLv7DAWtnb0xwD18";

export function WhatsAppCTA() {
  const t = useAppTheme();

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer noopener"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{
        background: `linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01)), ${t.srf}`,
        border: `1px solid ${t.brd}`,
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
        transition: "border-color .18s ease, transform .18s ease, background .18s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = t.go;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = t.brd;
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}>

        <div style={{
          width: 38, height: 38, borderRadius: 8, flexShrink: 0,
          background: t.alt,
          border: `1px solid ${t.brd}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <MessageCircle size={18} color={t.go} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FB, fontSize: 9, fontWeight: 700,
            color: t.go, letterSpacing: ".12em",
            textTransform: "uppercase", marginBottom: 4,
          }}>
            Canal privado
          </div>
          <div style={{
            fontFamily: FH, fontSize: 17, fontWeight: 700,
            color: t.tx, lineHeight: 1.3, marginBottom: 4,
          }}>
            Research & Mercados
          </div>
          <div style={{
            fontFamily: FB, fontSize: 11,
            color: t.mu, lineHeight: 1.5,
          }}>
            Actualizaciones de mercado y oportunidades para clientes e inversores calificados.
          </div>
        </div>

        <div style={{
          flexShrink: 0, textAlign: "center",
          background: t.goBg,
          border: `1px solid ${t.go}33`,
          borderRadius: 8, padding: "8px 12px",
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.go, whiteSpace: "nowrap" }}>
            Solicitar acceso
          </div>
        </div>
      </div>
    </a>
  );
}
