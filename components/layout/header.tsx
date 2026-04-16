"use client";

import { useState, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppTheme } from "@/lib/theme-context";
import { useClock } from "@/hooks/use-clock";
import { useIsMobile } from "@/hooks/use-window-size";
import { TABS, FD, FB, ADMIN_PIN } from "@/lib/constants";
import { Lock } from "lucide-react";

interface HeaderProps {
  tab:        string;
  setTab:     (tab: string) => void;
  onAdminOpen?: () => void;
}

export function Header({ tab, setTab, onAdminOpen }: HeaderProps) {
  const t             = useAppTheme();
  const clock         = useClock();
  const isMobile      = useIsMobile(640);
  const { resolvedTheme, setTheme } = useTheme();
  const dark          = resolvedTheme === "dark";

  const [logoSpin, setLogoSpin] = useState(false);
  const [logoIdx,  setLogoIdx]  = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);

  const LOGO_COLORS = [
    null,
    { main:"#1E3A5F", accent:"#B0782A" },
    { main:"#2D4A3E", accent:"#8B7355" },
    { main:"#4A3728", accent:"#C4956A" },
    { main:"#3B3B5C", accent:"#9B8EC4" },
    { main:"#1A3C40", accent:"#5B9A8B" },
    { main:"#4A2C2A", accent:"#C17C74" },
  ];
  const logoC = LOGO_COLORS[logoIdx];

  const handleLogoClick = useCallback(() => {
    setTab("inicio");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLogoSpin(true);
    setTimeout(() => setLogoSpin(false), 600);
    setLogoIdx(prev => (prev + 1) % LOGO_COLORS.length);
    setLogoClicks(n => {
      const next = n + 1;
      if (next >= 5) { onAdminOpen?.(); return 0; }
      return next;
    });
  }, [setTab, onAdminOpen, LOGO_COLORS.length]);

  return (
    <header style={{
      background: t.hdr, borderBottom: `1px solid ${t.brd}`,
      position: "sticky", top: 0, zIndex: 100, boxShadow: t.sh,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: `0 ${isMobile ? 12 : 20}px`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: isMobile ? 50 : 56, gap: isMobile ? 8 : 16,
      }}>

        {/* Logo */}
        <div
          style={{ display:"flex", alignItems:"center", flexShrink:0, cursor:"pointer", userSelect:"none" }}
          onClick={handleLogoClick}
        >
          <div style={{
            fontFamily: FD, fontSize: isMobile ? 18 : 23, fontWeight: 700,
            color: logoC ? logoC.main : t.tx, letterSpacing: "-.02em", lineHeight: 1,
            transition: "color .4s ease",
            animation: logoSpin ? "logoSpin .5s cubic-bezier(.4,0,.2,1)" : "none",
          }}>
            The Big{" "}
            <span style={{ color: logoC ? logoC.accent : t.go, transition: "color .4s ease" }}>
              Long
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className="desktop-tabs" style={{ display:"flex", gap:2, flexWrap:"nowrap" }}>
            {TABS.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                padding: "6px 12px", borderRadius: 8, border: "none", fontFamily: FB,
                fontSize: 11, fontWeight: tab === tb.id ? 700 : 400,
                background: tab === tb.id ? `${t.go}18` : "transparent",
                color: tab === tb.id ? t.go : t.mu,
                cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <tb.Icon size={13} strokeWidth={tab === tb.id ? 2.5 : 1.8} />
                {tb.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right controls */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {!isMobile && (
            <div style={{ textAlign:"right", lineHeight:1.3 }}>
              <div style={{ fontFamily:FB, fontSize:13, fontWeight:700, color:t.tx, letterSpacing:".01em", fontVariantNumeric:"tabular-nums" }}>
                {clock.time}
              </div>
              <div style={{ fontFamily:FB, fontSize:9, color:t.mu, letterSpacing:".04em", textTransform:"uppercase" }}>
                {clock.date}
              </div>
            </div>
          )}
          <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            style={{
              background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 8,
              padding: isMobile ? "6px 10px" : "6px 12px",
              fontFamily: FB, fontSize: 12, color: t.mu, cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
