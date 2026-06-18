"use client";

import { useMemo } from "react";
import type { EquityIdentity } from "@/lib/equity/identity";
import type { ThemeTokens } from "@/types";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = { sm: 26, md: 34, lg: 42 };

function colorFor(text: string): { bg: string; fg: string } {
  const palette = [
    { bg:"#0f766e", fg:"#ecfeff" },
    { bg:"#1d4ed8", fg:"#eff6ff" },
    { bg:"#7c3aed", fg:"#f5f3ff" },
    { bg:"#b45309", fg:"#fffbeb" },
    { bg:"#be123c", fg:"#fff1f2" },
    { bg:"#047857", fg:"#ecfdf5" },
    { bg:"#334155", fg:"#f8fafc" },
  ];
  const hash = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export function EquityIdentityMark({
  identity,
  t,
  size = "md",
  showTooltip = true,
}: {
  identity: Pick<EquityIdentity, "localTicker" | "underlyingTicker" | "displayName" | "fallbackInitials" | "logoUrl" | "logoFallbackUrl" | "logoSource" | "logoStatus" | "identityConfidence">;
  t: ThemeTokens;
  size?: Size;
  showTooltip?: boolean;
}) {
  const px = SIZE_PX[size];
  const colors = useMemo(() => colorFor(identity.underlyingTicker || identity.localTicker), [identity.localTicker, identity.underlyingTicker]);
  const activeLogo = identity.logoUrl ?? identity.logoFallbackUrl ?? null;

  const title = showTooltip
    ? `${identity.displayName} · ${identity.localTicker}${identity.underlyingTicker !== identity.localTicker ? ` / ${identity.underlyingTicker}` : ""} · ${activeLogo ? identity.logoStatus : "generated_fallback"} · ${identity.identityConfidence}`
    : undefined;

  return (
    <div
      title={title}
      aria-label={`${identity.displayName} logo`}
      style={{
        width:px,
        height:px,
        minWidth:px,
        borderRadius:Math.max(7, Math.round(px * 0.24)),
        background:`linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
        border:`1px solid ${t.brd}`,
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
        overflow:"hidden",
        boxShadow:"0 1px 2px rgba(0,0,0,.08)",
      }}
    >
      <span style={{ fontFamily:"monospace", fontSize:size === "sm" ? 9 : size === "lg" ? 13 : 11, fontWeight:850, color:colors.fg, letterSpacing:0 }}>
        {identity.fallbackInitials}
      </span>
      {activeLogo && (
        <span
          aria-hidden
          style={{
            position:"absolute",
            inset:0,
            backgroundImage:`url("${activeLogo}")`,
            backgroundSize:"contain",
            backgroundRepeat:"no-repeat",
            backgroundPosition:"center",
          }}
        />
      )}
    </div>
  );
}
