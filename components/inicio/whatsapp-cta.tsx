"use client";

/**
 * components/inicio/whatsapp-cta.tsx
 * Canal de difusión WhatsApp — acceso directo con diseño profesional
 */

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { FB, FH, WHATSAPP_CHANNEL_URL } from "@/lib/constants";

export function WhatsAppCTA() {
  const t = useAppTheme();

  return (
    <a
      href={WHATSAPP_CHANNEL_URL}
      target="_blank"
      rel="noreferrer noopener"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{
        background: `linear-gradient(135deg, rgba(31,61,91,.20), rgba(255,255,255,.035) 48%, rgba(20,83,45,.10)), ${t.srf}`,
        border: `1px solid ${t.brd}`,
        borderRadius: 8,
        padding: "18px 20px",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 16,
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
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: t.goBg,
          border: `1px solid ${t.go}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <MessageCircle size={20} color={t.go} strokeWidth={1.9} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FB, fontSize: 9, fontWeight: 700,
            color: t.go, letterSpacing: ".12em",
            textTransform: "uppercase", marginBottom: 4,
          }}>
            Inteligencia diaria por WhatsApp
          </div>
          <div style={{
            fontFamily: FH, fontSize: 20, fontWeight: 800,
            color: t.tx, lineHeight: 1.3, marginBottom: 4,
          }}>
            Sumate al canal de The Big Long
          </div>
          <div style={{
            fontFamily: FB, fontSize: 12,
            color: t.mu, lineHeight: 1.5,
          }}>
            Resúmenes diarios, seguimiento de mercado, contexto local e internacional e ideas según distintos perfiles de riesgo y objetivos.
          </div>
        </div>

        <div style={{
          flexShrink: 0, textAlign: "center", display: "flex", alignItems: "center", gap: 7,
          background: t.go,
          border: `1px solid ${t.go}`,
          borderRadius: 8, padding: "10px 13px",
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 800, color: "#090D14", whiteSpace: "nowrap" }}>
            Unirme al canal
          </div>
          <ArrowUpRight size={14} color="#090D14" />
        </div>
      </div>
    </a>
  );
}
