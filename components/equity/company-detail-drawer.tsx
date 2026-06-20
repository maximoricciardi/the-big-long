"use client";

import { X } from "lucide-react";
import { EquityIdentityMark } from "@/components/equity/equity-identity-mark";
import { FB, FH } from "@/lib/constants";
import type { EquityDetailRecord } from "@/lib/equity/client-types";
import { formatDailyChange, formatLargeMoney, formatNumberMetric, formatPercentMetric, formatPrice } from "@/lib/equity/formatters";
import type { EquityIntelligenceRow } from "@/lib/equity/intelligence";
import type { ThemeTokens } from "@/types";

function DetailMetric({ label, value, t, muted }: { label: string; value: string; t: ThemeTokens; muted?: boolean }) {
  return (
    <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, padding:"9px 10px", background:t.alt, minHeight:58 }}>
      <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, color:t.fa, letterSpacing:".08em", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
      <div style={{ fontFamily:FB, fontSize:14, fontWeight:800, color:muted ? t.fa : t.tx, overflowWrap:"anywhere" }}>{value}</div>
    </div>
  );
}

function DetailLine({ label, value, t }: { label: string; value: string | null; t: ThemeTokens }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"7px 0", borderBottom:`1px solid ${t.brd}55` }}>
      <span style={{ fontFamily:FB, fontSize:11, color:t.fa }}>{label}</span>
      <span style={{ fontFamily:FB, fontSize:11, color:value ? t.mu : t.fa, textAlign:"right", overflowWrap:"anywhere" }}>{value ?? "—"}</span>
    </div>
  );
}

function SectionTitle({ children, t }: { children: string; t: ThemeTokens }) {
  return (
    <div style={{ fontFamily:FB, fontSize:10, fontWeight:850, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>
      {children}
    </div>
  );
}

function ChipList({ items, t }: { items: string[]; t: ThemeTokens }) {
  if (!items.length) return <span style={{ fontFamily:FB, fontSize:11, color:t.fa }}>No disponible</span>;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {items.map((item) => (
        <span key={item} style={{ border:`1px solid ${t.brd}`, background:t.alt, color:t.mu, borderRadius:6, padding:"4px 7px", fontFamily:FB, fontSize:10, fontWeight:650 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function CompanyDetailDrawer({
  t,
  row,
  detail,
  status,
  onClose,
}: {
  t: ThemeTokens;
  row: EquityIntelligenceRow | null;
  detail: EquityDetailRecord | null;
  status: "idle" | "loading" | "ok" | "error";
  onClose: () => void;
}) {
  if (!row) return null;

  const quote = detail?.quote ?? null;
  const price = quote?.price ?? row.price;
  const changePct = quote?.changePct ?? row.changePct;
  const change = quote?.change ?? row.change;
  const currency = detail?.currency ?? quote?.currency ?? row.currency;
  const daily = formatDailyChange(change, changePct, currency);
  const isPrivate = detail?.assetType === "private_market_exposure" || row.identity.assetType === "private_market_exposure";
  const sourceLabel = detail?.source ?? (status === "loading" ? "cargando" : "no disponible");
  const quoteLabel = quote?.availabilityStatus === "private_market_not_listed"
    ? "exposicion privada"
    : quote?.provider
      ? `${quote.provider} · ${quote.freshnessStatus ?? "recent"}`
      : row.quoteProvider
        ? `${row.quoteProvider} · ${row.quoteFreshness ?? "recent"}`
        : "sin quote confirmado";
  const dailyColor = changePct === null ? t.fa : changePct >= 0 ? t.gr : t.rd;
  const sector = detail?.sector ?? row.sector;
  const industry = detail?.industry ?? row.industry;
  const country = detail?.country ?? row.country;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position:"fixed",
        inset:0,
        zIndex:80,
        background:"rgba(2,6,23,.58)",
        display:"flex",
        justifyContent:"flex-end",
        backdropFilter:"blur(6px)",
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${row.name}`}
        onClick={(event) => event.stopPropagation()}
        style={{
          width:"min(560px, 100vw)",
          height:"100%",
          background:t.bg,
          borderLeft:`1px solid ${t.brd}`,
          boxShadow:"-24px 0 60px rgba(0,0,0,.35)",
          overflowY:"auto",
          padding:"18px",
        }}
      >
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
            <EquityIdentityMark identity={row.identity} t={t} size="lg" />
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:FH, fontSize:20, fontWeight:800, color:t.tx, lineHeight:1.1, overflowWrap:"anywhere" }}>{detail?.companyName ?? row.name}</div>
              <div style={{ fontFamily:"monospace", fontSize:12, fontWeight:800, color:t.go, marginTop:5 }}>
                {row.ticker}{row.underlyingTicker !== row.ticker ? ` / ${row.underlyingTicker}` : ""} · {detail?.exchange ?? row.market}
              </div>
              <div style={{ marginTop:7, display:"flex", gap:6, flexWrap:"wrap" }}>
                <span style={{ padding:"3px 7px", borderRadius:5, border:`1px solid ${t.brd}`, background:t.alt, color:t.mu, fontFamily:FB, fontSize:10, fontWeight:750 }}>{country}</span>
                <span style={{ padding:"3px 7px", borderRadius:5, border:`1px solid ${t.go}55`, background:t.goBg, color:t.go, fontFamily:FB, fontSize:10, fontWeight:750 }}>{sector}</span>
                {isPrivate && <span style={{ padding:"3px 7px", borderRadius:5, border:`1px solid ${t.go}55`, background:t.goBg, color:t.go, fontFamily:FB, fontSize:10, fontWeight:800 }}>private_market_exposure</span>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            style={{ width:30, height:30, borderRadius:6, border:`1px solid ${t.brd}`, background:t.srf, color:t.mu, display:"inline-flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, background:t.srf, padding:12, marginBottom:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.15fr .85fr", gap:10, alignItems:"end" }}>
            <div>
              <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:t.fa, marginBottom:4 }}>Precio</div>
              <div style={{ fontFamily:FH, fontSize:26, fontWeight:850, color:price !== null && price > 0 ? t.tx : t.fa, lineHeight:1 }}>
                {isPrivate ? "No listado" : formatPrice(price, currency)}
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:t.fa, marginBottom:4 }}>Hoy</div>
              <div style={{ fontFamily:FB, fontSize:15, fontWeight:850, color:dailyColor }}>{daily.pct}</div>
              <div style={{ fontFamily:FB, fontSize:11, fontWeight:750, color:dailyColor, marginTop:2 }}>{daily.abs}</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap", fontFamily:FB, fontSize:10, color:t.fa }}>
            <span>{quoteLabel}</span>
            <span>{quote?.changeSource ? `Variacion: ${quote.changeSource}` : "Variacion: no disponible"}</span>
          </div>
        </div>

        {status === "loading" && (
          <div style={{ border:`1px solid ${t.brd}`, background:t.srf, borderRadius:8, padding:14, fontFamily:FB, fontSize:12, color:t.mu, marginBottom:14 }}>
            Cargando perfil y fundamentos...
          </div>
        )}
        {status === "error" && (
          <div style={{ border:`1px solid ${t.rd}55`, background:t.rdBg, borderRadius:8, padding:14, fontFamily:FB, fontSize:12, color:t.rd, marginBottom:14 }}>
            No se pudo cargar el detalle. El screener conserva quote e identidad disponibles.
          </div>
        )}

        <section style={{ marginBottom:16 }}>
          <SectionTitle t={t}>Business Overview</SectionTitle>
          <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, background:t.srf, padding:13 }}>
            <p style={{ margin:0, fontFamily:FB, fontSize:12, lineHeight:1.55, color:detail?.description ? t.mu : t.fa }}>
              {detail?.description ?? "Perfil no disponible con fuente suficiente para este instrumento."}
            </p>
            {detail?.businessSummary && (
              <p style={{ margin:"10px 0 0", fontFamily:FB, fontSize:12, lineHeight:1.55, color:t.mu }}>{detail.businessSummary}</p>
            )}
            <div style={{ marginTop:12 }}>
              <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, color:t.fa, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>Segmentos</div>
              <ChipList t={t} items={detail?.mainSegments ?? []} />
            </div>
          </div>
        </section>

        <section style={{ marginBottom:16 }}>
          <SectionTitle t={t}>Investor Lens</SectionTitle>
          <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, background:t.srf, padding:13 }}>
            {detail?.whyInvestorsTrack && <p style={{ margin:0, fontFamily:FB, fontSize:12, lineHeight:1.55, color:t.mu }}>{detail.whyInvestorsTrack}</p>}
            {detail?.investorFocus && <p style={{ margin:detail?.whyInvestorsTrack ? "10px 0 0" : 0, fontFamily:FB, fontSize:12, lineHeight:1.55, color:t.mu }}>{detail.investorFocus}</p>}
            <div style={{ marginTop:12 }}>
              <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, color:t.fa, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>Drivers</div>
              <ChipList t={t} items={detail?.keyDrivers ?? []} />
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ fontFamily:FB, fontSize:9, fontWeight:800, color:t.fa, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>Riesgos / sensibilidades</div>
              <ChipList t={t} items={detail?.riskSensitivities ?? []} />
            </div>
            {detail?.keyRisks && <p style={{ margin:"10px 0 0", fontFamily:FB, fontSize:12, lineHeight:1.55, color:t.fa }}>{detail.keyRisks}</p>}
          </div>
        </section>

        <section style={{ marginBottom:16 }}>
          <SectionTitle t={t}>Fundamentals Snapshot</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:8, marginBottom:8 }}>
            <DetailMetric t={t} label="Market cap" value={formatLargeMoney(detail?.marketCap ?? null, detail?.currency ?? "USD")} muted={!detail?.marketCap} />
            <DetailMetric t={t} label="P/E" value={formatNumberMetric(detail?.peRatio ?? detail?.forwardPE ?? row.peForward, 2)} muted={(detail?.peRatio ?? detail?.forwardPE ?? row.peForward) === null} />
            <DetailMetric t={t} label="EV/EBITDA" value={formatNumberMetric(detail?.evToEbitda ?? row.evEbitda, 2)} muted={(detail?.evToEbitda ?? row.evEbitda) === null} />
            <DetailMetric t={t} label="Dividend yield" value={formatPercentMetric(detail?.dividendYield ?? row.dividendYield, { normalizeRatio: true, signed: false })} muted={(detail?.dividendYield ?? row.dividendYield) === null} />
          </div>
          <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, background:t.srf, padding:"5px 12px" }}>
            <DetailLine t={t} label="Sector" value={sector} />
            <DetailLine t={t} label="Industria" value={industry} />
            <DetailLine t={t} label="Beta" value={formatNumberMetric(detail?.beta ?? row.beta, 2)} />
            <DetailLine t={t} label="Volumen promedio" value={formatNumberMetric(detail?.averageVolume ?? row.avgVolume, 0)} />
            <DetailLine t={t} label="Proximo earnings" value={detail?.nextEarningsDate ?? row.earningsDate} />
          </div>
        </section>

        <section>
          <SectionTitle t={t}>Data Quality</SectionTitle>
          <div style={{ border:`1px solid ${t.brd}`, borderRadius:8, background:t.alt, padding:"5px 12px" }}>
            <DetailLine t={t} label="Quote" value={quoteLabel} />
            <DetailLine t={t} label="Fundamentos" value={sourceLabel} />
            <DetailLine t={t} label="Perfil" value={detail?.profileSource ?? null} />
            <DetailLine t={t} label="Tipo de fuente" value={detail?.sourceType ?? null} />
            <DetailLine t={t} label="Confianza" value={detail?.confidence ?? row.identityConfidence} />
            <DetailLine t={t} label="Actualizado" value={detail?.sourceUpdatedAt ?? quote?.sourceUpdatedAt ?? row.quoteFetchedAt} />
          </div>
          <p style={{ margin:"10px 0 0", fontFamily:FB, fontSize:10, lineHeight:1.45, color:t.fa }}>
            Informacion para analisis. No constituye recomendacion de inversion.
          </p>
        </section>
      </aside>
    </div>
  );
}
