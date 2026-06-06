"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Clock3,
  FileBadge2,
  Filter,
  Landmark,
  LibraryBig,
} from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { useCuratedReports } from "@/hooks/use-curated-reports";
import { Card } from "@/components/ui/card";
import { FB, FH } from "@/lib/constants";
import type { CuratedReport } from "@/types";

const TYPE_LABELS: Record<CuratedReport["reportType"], string> = {
  macro: "Macro",
  markets: "Markets",
  strategy: "Strategy",
  credit: "Credit",
  policy: "Policy",
};

const CADENCE_LABELS: Record<CuratedReport["cadence"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  "ad-hoc": "Ad hoc",
};

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  const t = useAppTheme();

  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 11px",
        borderRadius: 999,
        border: `1px solid ${active ? `${t.go}55` : t.brd}`,
        background: active ? t.goBg : t.srf,
        color: active ? t.go : t.mu,
        fontFamily: FB,
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all .18s",
      }}
    >
      {children}
    </button>
  );
}

function ReportCard({ report }: { report: CuratedReport }) {
  const t = useAppTheme();
  const accentMap: Record<CuratedReport["reportType"], string> = {
    macro: t.go,
    markets: t.bl,
    strategy: t.gr,
    credit: t.pu,
    policy: t.rd,
  };
  const accent = accentMap[report.reportType];

  return (
    <Card t={t} style={{ borderTop: `2px solid ${accent}` }}>
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: accent, letterSpacing: ".1em", textTransform: "uppercase" }}>
              {report.source}
            </span>
            <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>{TYPE_LABELS[report.reportType]}</span>
            {report.featured && (
              <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.go, background: t.goBg, border: `1px solid ${t.go}33`, borderRadius: 999, padding: "3px 7px" }}>
                Curated
              </span>
            )}
          </div>
          <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>{report.publishedLabel}</span>
        </div>

        <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: t.tx, lineHeight: 1.35, marginBottom: 10 }}>
          {report.title}
        </div>

        <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.75, marginBottom: 14 }}>
          {report.summary}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {report.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FB,
                fontSize: 9,
                color: t.mu,
                background: t.alt,
                border: `1px solid ${t.brd}`,
                borderRadius: 999,
                padding: "4px 8px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: FB, fontSize: 10, color: t.mu }}>
              <Clock3 size={12} />
              {CADENCE_LABELS[report.cadence]}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: FB, fontSize: 10, color: t.mu }}>
              <Landmark size={12} />
              {report.regions[0]}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={report.sourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: FB, fontSize: 10, color: t.mu, textDecoration: "none" }}
            >
              Source
            </a>
            <a
              href={report.reportUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FB,
                fontSize: 10,
                fontWeight: 700,
                color: accent,
                textDecoration: "none",
              }}
            >
              Open report
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ReportsPanel() {
  const t = useAppTheme();
  const isMobile = useIsMobile(640);
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(true);

  const { reports, filters, total, lastUpdate, status } = useCuratedReports({
    type: type || undefined,
    region: region || undefined,
    featured: featuredOnly,
    limit: 12,
  });

  const sourceCount = useMemo(() => new Set(reports.map((report) => report.source)).size, [reports]);

  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom: 18, borderTop: `3px solid ${t.go}` }}>
        <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr .85fr", gap: 16 }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.fa, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
              CURATED REPORTS
            </div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: t.tx, marginBottom: 8 }}>
              Research third-party, curado y listo para advisory.
            </div>
            <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.72, maxWidth: 660 }}>
              Esta capa no replica un portal de noticias. Ordena reportes oficiales de casas globales y organismos multilaterales, con selección editorial, taxonomía clara y acceso directo al documento original.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { label: "Cobertura", value: `${total} piezas`, Icon: LibraryBig },
              { label: "Fuentes", value: `${sourceCount}`, Icon: Building2 },
              { label: "Cadencia", value: "48h", Icon: FileBadge2 },
            ].map((item) => (
              <div key={item.label} style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <item.Icon size={13} color={t.go} />
                  <span style={{ fontFamily: FB, fontSize: 8, color: t.fa, letterSpacing: ".08em", textTransform: "uppercase" }}>{item.label}</span>
                </div>
                <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: t.tx }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card t={t} style={{ marginBottom: 16 }}>
        <div style={{ padding: "16px 18px", display: "grid", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={14} color={t.bl} />
            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.bl, letterSpacing: ".08em", textTransform: "uppercase" }}>
              Filtros editoriales
            </span>
            <span style={{ fontFamily: FB, fontSize: 10, color: t.fa }}>
              {status === "ok" && lastUpdate ? `Actualizado ${lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}` : "Curación en proceso"}
            </span>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill active={featuredOnly} onClick={() => setFeaturedOnly((value) => !value)}>
                Solo destacados
              </Pill>
              <Pill active={type === ""} onClick={() => setType("")}>
                Todas las categorías
              </Pill>
              {filters.types.map((item) => (
                <Pill key={item} active={type === item} onClick={() => setType(type === item ? "" : item)}>
                  {TYPE_LABELS[item as CuratedReport["reportType"]] ?? item}
                </Pill>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill active={region === ""} onClick={() => setRegion("")}>
                Todas las regiones
              </Pill>
              {filters.regions.slice(0, 6).map((item) => (
                <Pill key={item} active={region === item} onClick={() => setRegion(region === item ? "" : item)}>
                  {item}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {status === "loading" && reports.length === 0 && (
        <Card t={t} style={{ marginTop: 14 }}>
          <div style={{ padding: "18px 20px", fontFamily: FB, fontSize: 12, color: t.mu }}>
            Cargando catálogo curado de reports...
          </div>
        </Card>
      )}

      {status === "error" && reports.length === 0 && (
        <Card t={t} style={{ marginTop: 14 }}>
          <div style={{ padding: "18px 20px", fontFamily: FB, fontSize: 12, color: t.rd }}>
            La capa de reports no pudo actualizarse en este momento. El catálogo quedó desacoplado y va a reintentar automáticamente.
          </div>
        </Card>
      )}

      <Card t={t} style={{ marginTop: 18, borderTop: `2px solid ${t.bl}` }}>
        <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
          {[
            {
              title: "Ingesta",
              body: "Seleccionar solo documentos oficiales y piezas de research con valor de posicionamiento, no noticias recicladas.",
              Icon: BookOpen,
              color: t.go,
            },
            {
              title: "Storage",
              body: "Normalizar metadata en una colección única con tags, fecha, fuente, región y prioridad editorial.",
              Icon: LibraryBig,
              color: t.bl,
            },
            {
              title: "Workflow",
              body: "Objetivo operativo: una nueva pieza cada 48 horas con revisión humana antes de destacarla en portada.",
              Icon: FileBadge2,
              color: t.gr,
            },
          ].map((item) => (
            <div key={item.title} style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <item.Icon size={15} color={item.color} />
                <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {item.title}
                </div>
              </div>
              <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.65 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
