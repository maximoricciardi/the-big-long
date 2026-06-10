"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  BarChart3,
  FileText,
  Briefcase,
  Lock,
  AlertTriangle,
  PieChart,
  Globe,
  Clock,
  ArrowUpRight,
  Landmark,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { useAppTheme } from "@/lib/theme-context";
import { useIsMobile } from "@/hooks/use-window-size";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";
import { EarningsCalendar } from "@/components/mercados/earnings-calendar";
import { ReportsPanel } from "@/components/research/reports-panel";
import { useLiveNews } from "@/hooks/use-live-news";
import { PERFILES } from "@/lib/data/perfiles";
import { FB, FH, WHATSAPP_CHANNEL_URL } from "@/lib/constants";

const SUBTABS = [
  { id: "resumen", label: "Canal WhatsApp", Icon: ClipboardList },
  { id: "balances", label: "Earnings", Icon: BarChart3 },
  { id: "informes", label: "Inteligencia", Icon: FileText },
  { id: "reports", label: "Reports", Icon: Globe },
  { id: "recos", label: "Recomendaciones", Icon: Briefcase },
];

interface ResearchViewProps {
  initialSub?: string;
  onSubChange?: (sub: string) => void;
}

export function ResearchView({ initialSub = "resumen", onSubChange }: ResearchViewProps) {
  const t = useAppTheme();
  const [sub, setSub] = useState(initialSub);

  useEffect(() => {
    setSub(initialSub);
  }, [initialSub]);

  const handleSub = (id: string) => {
    setSub(id);
    onSubChange?.(id);
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {SUBTABS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSub(item.id)}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              fontFamily: FB,
              fontSize: 12,
              fontWeight: sub === item.id ? 700 : 450,
              cursor: "pointer",
              transition: "all .18s",
              border: `1px solid ${sub === item.id ? `${t.go}66` : t.brd}`,
              background: sub === item.id ? t.goBg : t.srf,
              color: sub === item.id ? t.go : t.mu,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <item.Icon size={14} /> {item.label}
          </button>
        ))}
      </div>

      {sub === "resumen" && <ResumenPanel />}
      {sub === "balances" && <BalancesPanel />}
      {sub === "informes" && <InformesPanel />}
      {sub === "reports" && <ReportsPanel />}
      {sub === "recos" && <RecomendacionesPanel />}
    </div>
  );
}

function ResumenPanel() {
  const t = useAppTheme();

  return (
    <div>
      <Card t={t} style={{ marginBottom: 18, borderTop: `3px solid ${t.go}` }}>
        <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.fa, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
              THE BIG LONG · MARKET INTELLIGENCE
            </div>
            <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 850, color: t.tx, marginBottom: 8, lineHeight: 1.15 }}>
              Inteligencia diaria para seguir mercados sin ruido.
            </div>
            <div style={{ fontFamily: FB, fontSize: 13, color: t.mu, lineHeight: 1.75, maxWidth: 680 }}>
              El canal concentra lectura de mercado, contexto local e internacional, cambios relevantes en renta fija, renta variable, FX y oportunidades según distintos perfiles de riesgo. La promesa no es adivinar el mercado: es monitorear mejor y decidir con más contexto.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
              {["Renta fija local", "FX y macro", "Equity global", "Riesgo y duration"].map(item => (
                <span key={item} style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.go, background: t.goBg, border: `1px solid ${t.go}33`, borderRadius: 6, padding: "5px 8px" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 800, color: t.go, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
              Canal de difusión
            </div>
            <div style={{ fontFamily: FH, fontSize: 20, fontWeight: 850, color: t.tx, marginBottom: 8 }}>
              The Big Long en WhatsApp
            </div>
            <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.6, marginBottom: 14 }}>
              Recibí el seguimiento directamente donde ya leés el mercado durante el día.
            </div>
            <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noreferrer noopener" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: t.go, color: "#090D14", borderRadius: 8, padding: "11px 14px", fontFamily: FB, fontSize: 12, fontWeight: 850 }}>
              Unirme al canal <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 18 }}>
        {[
          { title: "Monitoreo diario", body: "Precios, curvas, tasas, FX, riesgo país, balances y noticias con lectura de impacto.", Icon: Clock, color: t.bl },
          { title: "Contexto local", body: "Argentina primero: deuda soberana, Tesoro, BCRA, liquidez, inflación y flujos locales.", Icon: Landmark, color: t.go },
          { title: "Contexto global", body: "Tasas internacionales, commodities, equities y eventos que mueven apetito por riesgo.", Icon: Globe, color: t.gr },
          { title: "Perfiles de riesgo", body: "Ideas ordenadas por objetivo y tolerancia, sin prometer retornos ni empujar operaciones.", Icon: PieChart, color: t.pu },
        ].map(item => (
          <div key={item.title} style={{ background: t.srf, border: `1px solid ${t.brd}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <item.Icon size={15} color={item.color} />
              <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 800, color: item.color, letterSpacing: ".08em", textTransform: "uppercase" }}>{item.title}</div>
            </div>
            <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.65 }}>{item.body}</div>
          </div>
        ))}
      </div>

      <div style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 8, padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AlertTriangle size={15} color={t.fa} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontFamily: FB, fontSize: 11, color: t.fa, lineHeight: 1.6 }}>
          Información exclusivamente informativa. El canal no reemplaza asesoramiento personalizado ni constituye recomendación de compra o venta.
        </div>
      </div>
    </div>
  );
}

function BalancesPanel() {
  const t = useAppTheme();

  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom: 18, borderTop: `3px solid ${t.bl}` }}>
        <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {[
            {
              title: "Data source real",
              body: "El monitor ahora se apoya en la fuente viva de Nasdaq y ya no muestra una semana fija hardcodeada.",
              Icon: Landmark,
              color: t.bl,
            },
            {
              title: "Cobertura visual",
              body: "Los logos siguen estrategia escalonada: Clearbit, favicon institucional y monograma cuando no existe mapeo.",
              Icon: Sparkles,
              color: t.go,
            },
            {
              title: "Uso sugerido",
              body: "Ideal para preparar la agenda semanal, detectar pre/post-market y revisar rápidamente qué compañías ameritan follow-up.",
              Icon: BarChart3,
              color: t.gr,
            },
          ].map((item) => (
            <div key={item.title} style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <item.Icon size={15} color={item.color} />
                <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: ".08em", textTransform: "uppercase" }}>{item.title}</div>
              </div>
              <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.65 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </Card>

      <EarningsCalendar />
    </div>
  );
}

function IntelligenceCard({ article }: { article: ReturnType<typeof useLiveNews>["articles"][number] }) {
  const t = useAppTheme();
  const accent = article.sourceTier === "preferred" ? t.go : t.bl;

  return (
    <a
      href={article.articleUrl}
      target="_blank"
      rel="noreferrer"
      className="premium-hover"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: t.srf,
        border: `1px solid ${t.brd}`,
        borderTop: `2px solid ${accent}`,
        borderRadius: 12,
        padding: "16px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {article.sourceFaviconUrl ? (
            <img src={article.sourceFaviconUrl} alt={article.sourceName} width={18} height={18} style={{ borderRadius: 99, background: "#fff", border: `1px solid ${t.brd}` }} />
          ) : (
            <div style={{ width: 18, height: 18, borderRadius: 99, background: t.alt, border: `1px solid ${t.brd}` }} />
          )}
          <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: accent, letterSpacing: ".08em", textTransform: "uppercase" }}>{article.sourceName}</span>
        </div>
        <span style={{ fontFamily: FB, fontSize: 9, color: t.fa }}>{article.publishedLabel}</span>
      </div>

      <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: t.tx, lineHeight: 1.35, marginBottom: 10 }}>
        {article.title}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FB, fontSize: 10, color: t.mu }}>{article.locale === "global" ? "Cobertura global" : "Cobertura regional"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 10, fontWeight: 700, color: accent }}>
          Abrir fuente
          <ArrowUpRight size={13} />
        </span>
      </div>
    </a>
  );
}

function InformesPanel() {
  const t = useAppTheme();
  const isMobile = useIsMobile(640);
  const { articles, status, lastUpdate } = useLiveNews();

  const preferred = useMemo(() => articles.filter((article) => article.sourceTier === "preferred").slice(0, 6), [articles]);
  const sources = useMemo(() => [...new Set(preferred.map((article) => article.sourceName))].slice(0, 8), [preferred]);

  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom: 18, borderTop: `3px solid ${t.go}` }}>
        <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.25fr .75fr", gap: 16 }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.fa, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
              MARKET INTELLIGENCE
            </div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: t.tx, marginBottom: 8 }}>
              Radar curado de research y noticias relevantes.
            </div>
            <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.7 }}>
              Esta sección reemplaza el archivo obsoleto de informes hardcodeados por un radar vivo. Priorizamos medios financieros de referencia y enlaces directos a la cobertura original.
            </div>
          </div>

          <div style={{ background: t.alt, border: `1px solid ${t.brd}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Newspaper size={15} color={t.bl} />
              <div style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.bl, letterSpacing: ".08em", textTransform: "uppercase" }}>
                Estado del feed
              </div>
            </div>
            <div style={{ fontFamily: FB, fontSize: 12, color: t.mu, lineHeight: 1.65, marginBottom: 10 }}>
              {status === "loading" && "Actualizando la curación automática de noticias."}
              {status === "error" && "El radar no pudo actualizarse en este momento."}
              {status === "ok" && `Última actualización ${lastUpdate?.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}.`}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {sources.map((source) => (
                <span key={source} style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.go, background: t.goBg, border: `1px solid ${t.go}33`, borderRadius: 999, padding: "4px 8px" }}>
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10 }}>
        {preferred.map((article) => (
          <IntelligenceCard key={article.id} article={article} />
        ))}
      </div>

      {status === "loading" && preferred.length === 0 && (
        <Card t={t} style={{ marginTop: 14 }}>
          <div style={{ padding: "18px 20px", fontFamily: FB, fontSize: 12, color: t.mu }}>
            Cargando radar curado de research...
          </div>
        </Card>
      )}

      {status === "error" && preferred.length === 0 && (
        <Card t={t} style={{ marginTop: 14 }}>
          <div style={{ padding: "18px 20px", fontFamily: FB, fontSize: 12, color: t.rd }}>
            No pudimos traer la capa de inteligencia en vivo. La integración quedó desacoplada del archivo estático y reintentará automáticamente.
          </div>
        </Card>
      )}
    </div>
  );
}

function RecomendacionesPanel() {
  const t = useAppTheme();
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [active, setActive] = useState("conservador");

  const checkPwd = () => {
    if (pwd === "1243") {
      setAuth(true);
      setPwdErr(false);
    } else {
      setPwdErr(true);
      setPwd("");
    }
  };

  const pf = PERFILES.find((p) => p.id === active)!;
  const cMap: Record<string, { ac: string; bg: string }> = {
    blue: { ac: t.bl, bg: t.blBg },
    gold: { ac: t.go, bg: t.goBg },
    purple: { ac: t.pu, bg: t.puBg },
    green: { ac: t.gr, bg: t.grBg },
    red: { ac: t.rd, bg: t.rdBg },
  };
  const col = cMap[pf?.color ?? "blue"];

  if (!auth) {
    return (
      <div className="fade-up" style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: t.goBg, border: `1px solid ${t.go}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Lock size={28} color={t.go} />
        </div>
        <h3 style={{ fontFamily: FH, fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 8 }}>Recomendaciones</h3>
        <p style={{ fontFamily: FB, fontSize: 13, color: t.mu, lineHeight: 1.7, marginBottom: 24 }}>
          Esta sección es de acceso exclusivo para clientes.
        </p>
        <input
          type="password"
          placeholder="Contraseña"
          value={pwd}
          onChange={(event) => {
            setPwd(event.target.value);
            setPwdErr(false);
          }}
          onKeyDown={(event) => event.key === "Enter" && checkPwd()}
          autoFocus
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontFamily: FB, fontSize: 14, border: `1.5px solid ${pwdErr ? t.rd : t.brd}`, background: t.srf, color: t.tx, outline: "none", letterSpacing: ".1em", textAlign: "center", marginBottom: 12 }}
        />
        {pwdErr && <p style={{ fontFamily: FB, fontSize: 11, color: t.rd, marginBottom: 8 }}>Contraseña incorrecta.</p>}
        <button onClick={checkPwd} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: t.go, color: "#fff", fontFamily: FB, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ background: t.rdBg, border: `1px solid ${t.rd}44`, borderRadius: 10, padding: "12px 18px", fontFamily: FB, fontSize: 12, color: t.rd, marginBottom: 20, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span><strong>Aviso importante:</strong> Contenido orientativo e informativo. No constituye asesoramiento financiero ni oferta de compra o venta.</span>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {PERFILES.map((profile) => {
          const pc = cMap[profile.color] ?? cMap.blue;
          const isActive = active === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => setActive(profile.id)}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                fontFamily: FB,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .2s",
                border: `2px solid ${isActive ? pc.ac : t.brd}`,
                background: isActive ? pc.ac : "transparent",
                color: isActive ? "#fff" : t.mu,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <profile.Icon size={16} /> {profile.label}
            </button>
          );
        })}
      </div>

      <Card t={t}>
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: FH, fontSize: 26, fontWeight: 700, color: t.tx, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: col.ac, display: "flex" }}><pf.Icon size={26} /></span> Perfil {pf.label}
              </h2>
              <p style={{ fontFamily: FB, fontSize: 13, color: t.mu, lineHeight: 1.6, maxWidth: 520 }}>{pf.desc}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FB, fontSize: 11, color: t.mu, marginBottom: 4 }}>Retorno orientativo</div>
              <Badge c="gold" t={t}>{pf.retorno}</Badge>
              <div style={{ fontFamily: FB, fontSize: 11, color: t.mu, marginTop: 8 }}>Riesgo: <strong>{pf.riesgo}</strong></div>
            </div>
          </div>

          <SectionLabel t={t}>COMPOSICIÓN ORIENTATIVA</SectionLabel>

          <div style={{ display: "flex", height: 8, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            {pf.ideas.map((idea, index) => {
              const pctNum = parseInt(idea.por);
              const colors = [t.bl, t.gr, t.go, t.pu, t.rd, t.mu];
              return <div key={index} style={{ width: `${pctNum}%`, background: colors[index % colors.length], transition: "width .4s" }} />;
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
            {pf.ideas.map((idea, index) => {
              type TipoKey = "fondo" | "lecap" | "bono" | "cedear" | "caucion";
              const tipoMap: Record<TipoKey, { c: string; bg: string; Icon: React.ElementType; label: string }> = {
                fondo: { c: t.bl, bg: t.blBg, Icon: PieChart, label: "FONDO" },
                lecap: { c: t.go, bg: t.goBg, Icon: ClipboardList, label: "LECAP" },
                bono: { c: t.pu, bg: t.puBg, Icon: FileText, label: "BONO" },
                cedear: { c: t.gr, bg: t.grBg, Icon: Globe, label: "CEDEAR" },
                caucion: { c: t.mu, bg: t.alt, Icon: Clock, label: "CAUCIÓN" },
              };
              const tm = tipoMap[idea.tipo as TipoKey] ?? tipoMap.fondo;
              return (
                <div key={index} style={{ background: tm.bg, border: `1px solid ${tm.c}22`, borderRadius: 12, padding: "16px 18px", borderLeft: `4px solid ${tm.c}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: FH, fontWeight: 800, fontSize: 24, color: tm.c }}>{idea.por}</span>
                    <span style={{ fontFamily: FB, fontSize: 8, fontWeight: 700, color: tm.c, background: `${tm.c}18`, padding: "2px 7px", borderRadius: 10, letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 3 }}>
                      <tm.Icon size={10} /> {tm.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: t.tx, marginBottom: 4 }}>{idea.inst}</div>
                  <div style={{ fontFamily: FB, fontSize: 11, color: t.mu, lineHeight: 1.5 }}>{idea.note}</div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: FB, fontSize: 10, color: t.fa, marginTop: 16, fontStyle: "italic" }}>{pf.disclaimer}</p>
        </div>
      </Card>
    </div>
  );
}
