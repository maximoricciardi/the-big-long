"use client";

import { Phone, Mail } from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { CONTACT, WA_LINK, FD, FB } from "@/lib/constants";

export function Footer() {
  const t        = useAppTheme();
  const isMobile = useIsMobile(640);

  return (
    <footer style={{ background: t.ft, padding: "36px 20px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{
          display: "flex", alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 24 : 40, marginBottom: 24,
        }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
            <span style={{ fontFamily:FD, fontSize: isMobile?28:36, fontWeight:700, color:t.ftT, letterSpacing:"-.02em", lineHeight:1 }}>The</span>
            <span style={{ fontFamily:FD, fontSize: isMobile?28:36, fontWeight:700, color:t.go,  letterSpacing:"-.02em", lineHeight:1 }}>Big Long</span>
          </div>

          {/* Contact */}
          <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:FB, fontSize:15, fontWeight:600, color:t.ftT }}>{CONTACT.name}</div>
              <div style={{ fontFamily:FB, fontSize:11, fontWeight:300, color:"rgba(255,255,255,.35)" }}>{CONTACT.title}</div>
            </div>
            <div style={{ display:"flex", gap:16 }}>
              {CONTACT.phone && (
                <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")}
                  target="_blank" rel="noreferrer"
                  style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Phone size={14} /> {CONTACT.phone}
                </a>
              )}
              {CONTACT.email && (
                <a href={`mailto:${CONTACT.email}`}
                  style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Mail size={14} /> {CONTACT.email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ height:1, background:"rgba(255,255,255,.06)", marginBottom:16 }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <p style={{ fontFamily:FB, fontSize:10, fontWeight:300, color:"rgba(255,255,255,.18)", lineHeight:1.7, maxWidth:560 }}>
            Información exclusivamente informativa. No constituye asesoramiento de inversión ni oferta pública. Invertir implica riesgos.
          </p>
          <span style={{ fontFamily:FB, fontSize:10, fontWeight:400, color:"rgba(255,255,255,.15)", whiteSpace:"nowrap" }}>
            Fundada en marzo 2026
          </span>
        </div>

      </div>
    </footer>
  );
}
