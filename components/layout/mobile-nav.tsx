"use client";

import { useAppTheme } from "@/lib/theme-context";
import { TABS, FB } from "@/lib/constants";

interface MobileNavProps {
  tab:    string;
  setTab: (tab: string) => void;
}

export function MobileNav({ tab, setTab }: MobileNavProps) {
  const t = useAppTheme();

  return (
    <div className="mobile-bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: t.hdr, borderTop: `1px solid ${t.brd}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "6px 0 env(safe-area-inset-bottom, 8px)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      {TABS.map(tb => {
        const active = tab === tb.id;
        return (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "4px 8px", color: active ? t.go : t.mu, transition: "color .15s",
            minWidth: 0,
          }}>
            <tb.Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
            <span style={{ fontFamily: FB, fontSize: 9, fontWeight: active ? 700 : 400 }}>
              {tb.label.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
