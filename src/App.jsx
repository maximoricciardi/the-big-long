import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, ClipboardList, Newspaper, DollarSign, BarChart3, Search, Briefcase,
  TrendingUp, TrendingDown, Banknote, Building2, LineChart, ArrowLeftRight,
  Shield, Scale, Rocket, Globe, Package, Star, Zap, AlertTriangle,
  Moon, Sun, MessageCircle, Lock, Send, Phone, Mail, X, ChevronDown,
  ExternalLink, Clock, RefreshCw, Eye, Target, Flame, CircleDot,
  Landmark, FileText, Mic, Gavel, Droplets, Info, Activity, Wallet,
  PieChart, BookOpen, Cpu, Heart, Factory, Wheat, HardHat, ChevronUp, ChevronRight,
  Menu
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════════════════ */
const TH = {
  l: {
    bg:"#FAF9F6", srf:"#FFFFFF", alt:"#F3F1EB", brd:"#E6E2D9",
    tx:"#0C1B30", mu:"#64748B", fa:"#94A3B8",
    go:"#B0782A", goBg:"#FEF9EC", goAcc:"#F59E0B",
    gr:"#166534", grBg:"#F0FDF4", grAcc:"#22C55E",
    rd:"#B91C1C", rdBg:"#FEF2F2", rdAcc:"#EF4444",
    bl:"#1E40AF", blBg:"#EFF6FF", blAcc:"#3B82F6",
    pu:"#6D28D9", puBg:"#F5F3FF",
    hdr:"#FFFFFF", tick:"#0C1B30", tickT:"#94A3B8",
    ft:"#0C1B30", ftT:"#E2E8F0",
    sh:"0 1px 3px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.05)",
    badge:{green:{bg:"#DCFCE7",tx:"#166534"},red:{bg:"#FEE2E2",tx:"#B91C1C"},blue:{bg:"#DBEAFE",tx:"#1E40AF"},gold:{bg:"#FEF3C7",tx:"#92400E"},gray:{bg:"#F3F4F6",tx:"#374151"},purple:{bg:"#EDE9FE",tx:"#6D28D9"}},
  },
  d: {
    bg:"#0D1117", srf:"#161B22", alt:"#1C2128", brd:"#30363D",
    tx:"#E6EDF3", mu:"#8B949E", fa:"#6E7681",
    go:"#D4A853", goBg:"#1A1500", goAcc:"#F59E0B",
    gr:"#3FB950", grBg:"#0A2012", grAcc:"#22C55E",
    rd:"#F85149", rdBg:"#1F0D0D", rdAcc:"#F87171",
    bl:"#58A6FF", blBg:"#0B1A30", blAcc:"#60A5FA",
    pu:"#A371F7", puBg:"#1A1240",
    hdr:"#161B22", tick:"#010409", tickT:"#6E7681",
    ft:"#010409", ftT:"#E6EDF3",
    sh:"0 1px 3px rgba(0,0,0,.3), 0 6px 20px rgba(0,0,0,.2)",
    badge:{green:{bg:"#0A2012",tx:"#3FB950"},red:{bg:"#1F0D0D",tx:"#F85149"},blue:{bg:"#0B1A30",tx:"#58A6FF"},gold:{bg:"#1A1500",tx:"#D4A853"},gray:{bg:"#21262D",tx:"#8B949E"},purple:{bg:"#1A1240",tx:"#A371F7"}},
  }
};

const FH = "'Sora','IBM Plex Sans',sans-serif";
const FB = "'IBM Plex Sans',sans-serif";
const FD = "'Playfair Display','Georgia',serif"; // Display font for hero titles

const CONTACT = {
  name: "Máximo Ricciardi",
  title: "Asesor Financiero",
  phone: "",
  email: "",
};

/* ════════════════════════════════════════════════════════════════
   FONTS & GLOBAL CSS
════════════════════════════════════════════════════════════════ */
function useFonts(dark) {
  useEffect(() => {
    if (!document.getElementById("mr-fonts")) {
      const l = document.createElement("link");
      l.id = "mr-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap";
      document.head.appendChild(l);
    }
    let s = document.getElementById("mr-css");
    if (!s) { s = document.createElement("style"); s.id = "mr-css"; document.head.appendChild(s); }
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${dark?"#0D1117":"#FAF9F6"};transition:background .3s}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes logoSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.15)}100%{transform:rotate(360deg) scale(1)}}
      @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.85}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .skeleton{background:linear-gradient(90deg,var(--sk1) 25%,var(--sk2) 50%,var(--sk1) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px}
      .mobile-bottom-nav{display:none}
      @media(max-width:768px){.mobile-bottom-nav{display:flex!important}.desktop-tabs{display:none!important}}
      .fade-up{animation:fadeUp .45s ease both}
      .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.1s}.fade-up-3{animation-delay:.15s}.fade-up-4{animation-delay:.2s}
      button:focus-visible,a:focus-visible{outline:2px solid #B0782A;outline-offset:2px}
      .mobile-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
      @media(max-width:640px){
        .hide-mobile{display:none!important}
        .mobile-px{padding-left:14px!important;padding-right:14px!important}
        .mobile-stack{flex-direction:column!important}
        .mobile-full{width:100%!important;min-width:0!important}
        .mobile-text-sm{font-size:11px!important}
        .mobile-hero-title{font-size:34px!important}
        .mobile-tab-label{display:none}
        .mobile-tab-icon{display:inline!important}
      }
    `;
  }, [dark]);
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return {
    time: now.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
    date: `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    dateShort: `${now.getDate()} ${months[now.getMonth()]}`,
  };
}

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ════════════════════════════════════════════════════════════════
   STATIC DATA
════════════════════════════════════════════════════════════════ */
// Breaking News — set to null when no active alert
// {text:"...", icon:"...", color:"red"|"gold"|"green", link:{tab,sub}} 
const BREAKING_NEWS = null;
// Example: { text:"Fallo YPF: la Cámara de Apelaciones de NY suspende la ejecución. Impacto positivo en ADR.", icon:"⚖️", color:"gold" }

const SUMMARIES = [
  {
    id:"s27", date:"27 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"SPOT ARS/USD",    v:"$1.368",       b:"mín. oct.",     bc:"green"},
      {k:"BCRA COMPRAS",    v:"USD 57M",      b:"acum. USD 4B",  bc:"green"},
      {k:"TASAS TEM",       v:"2,1–2,3%",     b:"mínimos",       bc:"blue"},
      {k:"ABSORCIÓN BCRA",  v:"$3,4B",        b:"repo",          bc:"blue"},
      {k:"GLOBALES",        v:"-0,4%",         b:"vs EM",         bc:"gold"},
      {k:"EMAE ENERO",      v:"+1,9% i.a.",   b:"máximo",        bc:"green"},
    ],
    dato:"📊 <b>Datos del día:</b> Balance cambiario (BCRA) y balanza de pagos (INDEC) — claves para leer el estado real de las reservas y los flujos externos.",
    cards:[
      { cat:"DEUDA · LICITACIÓN USD", icon:"🏛️", title:"Test clave: AO27 y AO28 en el mercado",
        ac:"#1D4ED8",
        rows:[{l:"AO27 oferta",v:"hasta USD 150M (ampliable)"},{l:"AO28 oferta",v:"hasta USD 150M (ampliable)"},{l:"Expectativa tasa AO28",v:"< 9% TNA",b:"blue"}],
        note:"La clave está en el <b>bid-to-cover y la demanda real</b>. El resultado del AO28 dará señales sobre el costo de financiamiento en dólares post-2027.",
      },
      { cat:"TASAS · LICITACIÓN PESOS", icon:"💵", title:"Licitación en pesos muy cómoda, sin instrumentos cortos",
        ac:"#16A34A",
        rows:[{l:"Instrumentos cortos (<100d)",v:"ninguno ofrecido"},{l:"TEM de referencia",v:"2,1–2,3%"},{l:"Absorción BCRA (repo)",v:"$3,4B"}],
        note:"El Gobierno está <b>cómodo con tasas bajas</b>. La ausencia de instrumentos cortos confirma que no necesita atraer liquidez de corto plazo.",
      },
      { cat:"FX · RESERVAS", icon:"💱", title:"Peso en mínimos desde octubre — BCRA acumula a ritmo récord",
        ac:"#16A34A",
        rows:[{l:"Spot ARS/USD",v:"$1.368",b:"green"},{l:"Compra BCRA (día)",v:"USD 57M"},{l:"Acumulado 2026",v:"~USD 4.000M",b:"green"}],
        note:"<b>Fuerte señal de acumulación de reservas.</b> El tipo de cambio firme y las compras sostenidas del BCRA son los datos más positivos de la semana.",
      },
      { cat:"SISTEMA FINANCIERO", icon:"🏦", title:"BCRA no renovaría el esquema de encajes con bonos",
        ac:"#7C3AED",rows:[],
        note:"El BCRA no renovaría el esquema que permitía integrar encajes con bonos del Tesoro, <b>cambiando las condiciones de liquidez</b> del sistema bancario. El impacto concreto dependerá del reemplazo que se implemente y los plazos de transición. <b>A seguir de cerca.</b>",
      },
      { cat:"MERCADOS · POLÍTICA", icon:"🌍", title:"Globales resilientes y ruido político sin impacto en mercado",
        ac:"#B45309",
        rows:[{l:"Globales (día)",v:"-0,4%",b:"gold"},{l:"Riesgo país",v:"comprimiendo"},{l:"Aprobación Milei (AtlasIntel)",v:"36,4%"},{l:"Aprobación Milei (UTDT)",v:"~46%"}],
        note:"Las encuestas muestran divergencia metodológica. <b>Sin impacto claro en mercado</b> por ahora — los activos siguen respondiendo a fundamentos.",
      },
      { cat:"ACTIVIDAD ECONÓMICA", icon:"📊", title:"EMAE marca nuevo máximo en enero 2026",
        ac:"#16A34A",
        rows:[{l:"EMAE enero (mensual)",v:"+0,4%",b:"green"},{l:"EMAE enero (interanual)",v:"+1,9%",b:"green"},{l:"Nivel",v:"nuevo máximo histórico"},{l:"Arrastre estadístico 2026",v:"+2,4%"}],
      },
    ],
  },
  {
    id:"s26", date:"26 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"AO28 LICITACIÓN", v:"8,52% TNA",   b:"result",        bc:"blue"},
      {k:"BCRA COMPRAS",    v:"USD 146M",      b:"USD 450M/3d",   bc:"green"},
      {k:"SPOT ARS/USD",    v:"-0,9%",         b:"firme",         bc:"green"},
      {k:"GLOBALES",        v:"+0,7%",         b:"rebote",        bc:"green"},
      {k:"RIESGO PAÍS",     v:"<600 pb",       b:"comprime",      bc:"green"},
      {k:"TASAS TEM",       v:"~2,2–2,3%",    b:"mínimos",       bc:"blue"},
    ],
    dato:"📊 <b>Dato del día:</b> Se publica el EMAE de enero — actividad económica, tras el rebote de diciembre.",
    cards:[
      { cat:"DEUDA · LICITACIÓN USD", icon:"🏛️", title:"Nueva prueba en dólares: AO28 y reapertura AO27",
        ac:"#1D4ED8",
        rows:[{l:"AO28 — tipo",v:"Bullet · cupón 6%"},{l:"AO28 — tasa esperada",v:"~9% TNA o menos",b:"blue"},{l:"AO27 — tasa",v:"~5,1% TNA"}],
        note:"<b>Foco del mercado:</b> demanda efectiva y tasa de corte. El AO28 es la primera prueba real de financiamiento más allá del mandato actual.",
      },
      { cat:"TASAS · LICITACIÓN PESOS", icon:"💵", title:"Licitación en pesos muy cómoda — sin presión",
        ac:"#16A34A",
        rows:[{l:"Instrumentos",v:"Lecap 108d, Boncer, TAMAR"},{l:"Otros",v:"USD linked + canje TZX26"},{l:"Absorción BCRA",v:"~$2,7B (repo)"},{l:"TEM referencia",v:"2,2–2,3%"}],
        note:"Con liquidez alta y tasas en mínimos, el Gobierno <b>no necesita convalidar tasas altas</b>.",
      },
      { cat:"FX · RESERVAS", icon:"💱", title:"Dólar firme — acumulación de reservas a ritmo récord",
        ac:"#16A34A",
        rows:[{l:"Variación spot",v:"-0,9%",b:"green"},{l:"Compra BCRA (día)",v:"USD 146M"},{l:"Acumulado 3 ruedas",v:"USD 450M",b:"green"}],
        note:"Se <b>acelera la acumulación de reservas</b>. Uno de los datos más positivos de la semana.",
      },
      { cat:"BONOS · MERCADOS", icon:"🌐", title:"Globales suben 0,7% y riesgo país vuelve a <600 pb",
        ac:"#16A34A",
        rows:[{l:"Globales (día)",v:"+0,7%",b:"green"},{l:"Riesgo país",v:"<600 pb",b:"green"},{l:"Merval",v:"firme"}],
        note:"Mejora de activos en línea con un <b>mejor clima global</b>. El riesgo país perforando 600 pb es una señal positiva.",
      },
      { cat:"BCRA · INSTITUCIONAL", icon:"🏦", title:"Martín Vauthier nombrado director del BCRA",
        ac:"#7C3AED",rows:[],
        note:"Cambio en la conducción del Banco Central. Vauthier es economista de perfil técnico, <b>bien considerado en el mercado</b>.",
      },
      { cat:"ECONOMÍA REAL", icon:"⚠️", title:"Salarios privados caen en términos reales por 5° mes",
        ac:"#DC2626",
        rows:[{l:"Salarios reales privados",v:"caída",b:"red"},{l:"Consecutivo",v:"5° mes"}],
        note:"El ajuste sigue presente en el bolsillo de los trabajadores, pese a la desaceleración inflacionaria. Señal de que la <b>recuperación del consumo es gradual</b>.",
      },
    ],
  },
  {
    id:"s25", date:"25 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"RIESGO PAÍS",     v:">600 pts",     b:"presionado",    bc:"red"},
      {k:"MERVAL USD",      v:"+2,5%",        b:"semana",        bc:"green"},
      {k:"BCRA COMPRAS",    v:"USD 172M",     b:"fuerte",        bc:"green"},
      {k:"DÓLAR MAYORISTA", v:"$1.390",       b:"mín. feb.",     bc:"green"},
      {k:"TASAS TEM",       v:"2,2–2,3%",    b:"mínimos",       bc:"blue"},
      {k:"PBI 2025",        v:"+4,4%",        b:"confirmado",    bc:"green"},
    ],
    cards:[
      { cat:"BONOS · RIESGO PAÍS", icon:"🌐", title:"Bonos rebotan pero riesgo país sigue sobre 600 puntos",
        ac:"#B45309",
        rows:[{l:"Riesgo país",v:">600 pb",b:"red"},{l:"Tramos largos",v:"rendimiento dos dígitos"}],
        note:"El conflicto en Medio Oriente y las <b>tasas altas globales</b> siguen limitando el upside de la deuda soberana en dólares.",
      },
      { cat:"RENTA VARIABLE", icon:"📈", title:"Merval acumula +2,5% en dólares en la semana",
        ac:"#16A34A",
        rows:[{l:"Merval USD (semana)",v:"+2,5%",b:"green"}],
        note:"La bolsa local se <b>desacopla del contexto global</b>. El petróleo alto favorece el desempeño de las energéticas y da soporte al índice.",
      },
      { cat:"TASAS · LICITACIÓN", icon:"💵", title:"Licitación del Tesoro hoy con tasas en mínimos",
        ac:"#1D4ED8",
        rows:[{l:"TEM referencia",v:"2,2–2,3%"},{l:"Liquidez del sistema",v:"alta"}],
        note:"El mercado lee las condiciones de hoy como <b>señal de tasa</b>. Con alta liquidez, no se esperan concesiones.",
      },
      { cat:"FX · RESERVAS", icon:"💱", title:"BCRA compra USD 172M — dólar cae a mínimo desde febrero",
        ac:"#16A34A",
        rows:[{l:"Compra BCRA (día)",v:"USD 172M",b:"green"},{l:"Spot mayorista",v:"$1.390 (mín. feb.)"}],
        note:"Compra fuerte y sostenida. El dólar sigue <b>bajo control</b> mientras el BCRA acumula reservas.",
      },
      { cat:"SISTEMA FINANCIERO", icon:"🏦", title:"Mora bancaria en máximos de dos décadas",
        ac:"#DC2626",
        rows:[{l:"Mora hogares",v:"10,6%",b:"red"},{l:"Referencia histórica",v:"máximo en 20 años"}],
        note:"<b>Señal clara de estrés financiero</b> en los hogares. Refleja el impacto de tasas altas y ajuste del poder adquisitivo.",
      },
      { cat:"ACTIVIDAD ECONÓMICA", icon:"📊", title:"PBI 2025 creció 4,4% — desaceleración en Q4",
        ac:"#16A34A",
        rows:[{l:"Crecimiento PBI 2025",v:"+4,4%",b:"green"},{l:"Q4 2025",v:"desaceleración"}],
        note:"El dato anual confirma la <b>recuperación económica de 2025</b>, aunque el cuarto trimestre mostró menor impulso. Base de comparación favorable para 2026.",
      },
    ],
  },
  {
    id:"s20", date:"20 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"DÓLAR OFICIAL",    v:"$1.394",      b:"estable",      bc:"blue"},
      {k:"BANCOS",           v:"+4/+6%",      b:"líderes",      bc:"green"},
      {k:"RESERVAS VENC.",   v:"USD 9.000M",  b:"cubiertos",    bc:"green"},
      {k:"CONFIANZA CONS.",  v:"-5%",         b:"marzo",        bc:"red"},
      {k:"ORO SPOT",         v:"<USD 4.700",  b:"cae",          bc:"gold"},
      {k:"FED TASAS",        v:"sin baja",    b:"todo 2026",    bc:"gold"},
    ],
    dato:"📊 <b>Dato del día:</b> Bancos habilitados a distribuir hasta el <b>60% de sus ganancias</b> como dividendos. Principal catalizador de la suba bursátil.",
    cards:[
      { cat:"RENTA VARIABLE", icon:"📈", title:"Fuerte suba de acciones a contramano del mundo",
        ac:"#16A34A",
        rows:[
          {l:"Bancos",       v:"+4% / +6%",   b:"green"},
          {l:"YPF",          v:"impulso propio",b:"blue"},
          {l:"Tendencia",    v:"liderando"},
        ],
        note:"Mientras los mercados globales caían, las acciones argentinas <b>subieron con fuerza</b>, con los bancos liderando. YPF se destacó por novedades judiciales positivas en el frente del juicio por la expropiación.",
      },
      { cat:"DEUDA · CONFIANZA", icon:"💰", title:"El gobierno muestra músculo financiero ante los mercados",
        ac:"#1D4ED8",
        rows:[
          {l:"Fondos vencimientos", v:"USD 9.000M", b:"green"},
          {l:"Fuente",             v:"Caputo (Min. Economía)"},
          {l:"Dólar oficial",      v:"$1.394 estable"},
        ],
        note:"El ministro confirmó fondos suficientes para cubrir próximos vencimientos, <b>reduciendo el riesgo de refinanciamiento</b> y generando calma en el mercado de deuda.",
      },
      { cat:"SISTEMA FINANCIERO", icon:"🏦", title:"Bancos habilitados a distribuir hasta el 60% de ganancias",
        ac:"#7C3AED",
        rows:[
          {l:"Distribución habilitada", v:"hasta 60%",  b:"blue"},
          {l:"Impacto bursátil",        v:"principal catalizador"},
          {l:"Subas",                   v:"hasta 6%",   b:"green"},
        ],
        note:"El regulador habilitó a las entidades financieras a distribuir hasta el <b>60% de sus utilidades</b> como dividendos, mejorando significativamente las expectativas del sector.",
      },
      { cat:"ECONOMÍA REAL", icon:"📉", title:"Señales mixtas: comercio débil y consumidor menos optimista",
        ac:"#B45309",
        rows:[
          {l:"Confianza consumidor", v:"-5% marzo",   b:"red"},
          {l:"Comercio exterior",   v:"desaceleración"},
          {l:"Meta inflación",      v:"< 1% agosto"},
        ],
        note:"Exportaciones e importaciones cayeron en términos interanuales. El índice de confianza del consumidor cayó <b>5% en marzo</b>. El gobierno mantiene el objetivo de llevar la inflación por debajo del 1% mensual hacia agosto.",
      },
    ],
    intl:[
      {n:"S&P 500",  v:"6.530",   ch:"-1,51%",   neg:true},
      {n:"Nasdaq",   v:"21.830",  ch:"-2,01%",   neg:true},
      {n:"Dow Jones",v:"45.815",  ch:"-0,96%",   neg:true},
      {n:"VIX",      v:"26,50",   ch:"+10,1%",   neg:true},
      {n:"Brent",    v:"USD 108,5",ch:"+3,2%",   neg:false},
      {n:"WTI",      v:"USD 96,7", ch:"+2,8%",   neg:false},
      {n:"Oro",      v:"USD 4.495",ch:"-2,48%",  neg:true},
    ],
    intlNote:"S&P 500 acumula su <b>cuarta semana consecutiva en rojo</b> — la racha más larga en un año. Fuertes pérdidas en <b>Tesla, Meta, Nvidia y Apple</b>. Trump dijo que <b>no quiere un alto el fuego con Irán</b>. El vencimiento masivo de opciones ('triple witching') por USD 5,7 billones amplificó la volatilidad al cierre. El mercado descuenta que la Fed <b>no recortará tasas en todo 2026</b>. Europa, Reino Unido y Japón mantuvieron tasas sin cambios.",
  },
  {
    id:"s19", date:"19 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"DÓLAR MAYORISTA",v:"$1.400",    b:"contenido",    bc:"blue"},
      {k:"BCRA COMPRAS",   v:"USD 58M",   b:"acumulando",   bc:"green"},
      {k:"TASA 1D",        v:"~20% TNA",  b:"piso",         bc:"blue"},
      {k:"MERVAL USD",     v:"+1,4%",     b:"sube",         bc:"green"},
      {k:"DESEMPLEO Q4",   v:"7,5%",      b:"vs 6,6%",      bc:"red"},
      {k:"YPF · APELACIÓN",v:"suspendida",b:"mercado calmo",bc:"gold"},
    ],
    dato:"📊 <b>Datos del día:</b> Balanza comercial de febrero · Índice de confianza del consumidor de marzo.",
    cards:[
      { cat:"FX · RESERVAS", icon:"💱", title:"Dólar mayorista contenido en $1.400",
        ac:"#1D4ED8",
        rows:[
          {l:"Dólar mayorista",        v:"$1.400"},
          {l:"Compra BCRA (día)",      v:"USD 58M",  b:"blue"},
          {l:"Intervención futuros",   v:"activa",    b:"blue"},
        ],
        note:"El BCRA habría intervenido en futuros para <b>ponerle techo al tipo de cambio</b>, manteniendo la estabilidad del peso.",
      },
      { cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Tasas planchadas, liquidez en máximos",
        ac:"#16A34A",
        rows:[
          {l:"Tasa 1D",             v:"~20% TNA (piso)"},
          {l:"Liquidez del sistema",v:"máximos desde dic.",b:"green"},
          {l:"Próxima licitación",  v:"fin de mes"},
        ],
        note:"Sin movimientos esperados hasta la <b>próxima licitación del Tesoro a fin de mes</b>. Exceso de pesos en el sistema.",
      },
      { cat:"RENTA VARIABLE · BONOS", icon:"📈", title:"Merval al alza a contramano de emergentes",
        ac:"#16A34A",
        rows:[
          {l:"Merval (USD)",  v:"+1,4%",             b:"green"},
          {l:"Bonos en USD",  v:"baja",               b:"red"},
          {l:"Contexto EM",   v:"presión generalizada",b:"red"},
        ],
        note:"Los bonos en dólares cayeron en línea con mercados emergentes, pero el <b>Merval se diferenció</b> y cerró en positivo.",
      },
      { cat:"ECONOMÍA REAL", icon:"📊", title:"Sube el desempleo en el Q4 2025",
        ac:"#DC2626",
        rows:[
          {l:"Desempleo Q4 2025",v:"7,5%",    b:"red"},
          {l:"Desempleo Q3 2025",v:"6,6%"},
          {l:"Variación",        v:"+0,9 p.p.",b:"red"},
        ],
        note:"La <b>subocupación también creció</b> en el trimestre. Señal de enfriamiento en el mercado laboral.",
      },
      { cat:"JUDICIAL · YPF", icon:"⚖️", title:"Cámara de Apelaciones de NY suspende la ejecución del fallo",
        ac:"#B45309",
        rows:[],
        note:"La Cámara de Apelaciones de Nueva York <b>suspendió la ejecución del fallo de primera instancia</b> hasta que se resuelva la apelación presentada por Argentina. <b>El mercado reaccionó con calma.</b> La suspensión da margen de tiempo al Estado para continuar con el proceso de apelación sin ejecución inmediata.",
      },
    ],
    intl:null,
    alert:{ type:"gold", text:"⚖️ <b>YPF · Fallo:</b> La Cámara de Apelaciones de NY suspende la ejecución del fallo de primera instancia. Apelación sigue su curso. Mercado lo tomó con calma." },
  },
  {
    id:"s18", date:"18 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"MERVAL USD",v:"USD 1.810",b:"+0,55%",bc:"green"},
      {k:"S&P 500",v:"-1,36%",b:"cierre",bc:"red"},
      {k:"BCRA COMPRAS",v:"USD 58M",b:"reservas USD 44.495M",bc:"blue"},
      {k:"RIESGO PAÍS",v:"610 pb",b:"cierre",bc:"red"},
      {k:"BRENT",v:"+5,78%",b:"geopolítica",bc:"gold"},
      {k:"INFLACIÓN FEB.",v:"1,0%",b:"mín. desde may.",bc:"green"},
    ],
    cards:[
      {cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Tasas en mínimos desde diciembre",
       note:"Lecap corta comprimió con fuerza. La tasa a 1 día se estabilizó en el <b>piso del 20% TNA</b> fijado por el BCRA. El Central absorbió liquidez vía repo, alcanzando <b>máximos recientes de pasivos remunerados</b>. Tasas proyectadas planchadas hasta la próxima licitación.",
       ac:"#16A34A",rows:[{l:"Caución 3D",v:"20,5% TNA"},{l:"Lecap TEM máx. 2026",v:"< 2,4% TEM",b:"gold"},{l:"Curva CER (TIR)",v:"8,6% / -6,2%",b:"gray"},{l:"REPO BCRA",v:"absorción activa"}]},
      {cat:"FX · RESERVAS", icon:"💱", title:"Tipos de cambio al cierre",
       note:"El BCRA compró <b>USD 58M</b> en la rueda. Las reservas brutas cerraron en <b>USD 44.495M</b>, con una caída de USD 226M respecto a la jornada previa, explicada por vencimientos de deuda.",
       ac:"#1D4ED8",rows:[
         {l:"Oficial",v:"$1.418,17",b:"-0,28%",bc:"gold"},
         {l:"MEP",v:"$1.422,57",b:"+0,25%",bc:"green"},
         {l:"CCL",v:"$1.470,27",b:"+0,12%",bc:"green"},
         {l:"Compras BCRA (día)",v:"USD 58M",b:"blue"},
         {l:"Reservas brutas",v:"USD 44.495M",b:"gray"},
       ]},
      {cat:"RENTA VARIABLE · BONOS", icon:"📈", title:"Merval positivo; soberanos a la baja",
       note:"El Merval cerró en <b>USD 1.810,52 (+0,55%)</b>. Lideró YPF con +4,07% y EDN con +3,09%. En el extremo negativo, TRAN cayó <b>-7,08%</b>. Los soberanos cerraron a la baja en línea con el clima externo adverso.",
       ac:"#16A34A",rows:[
         {l:"Merval USD",v:"1.810,52",b:"+0,55%",bc:"green"},
         {l:"YPFD",v:"+4,07%",b:"green"},{l:"EDN",v:"+3,09%",b:"green"},
         {l:"TRAN",v:"-7,08%",b:"red"},{l:"Riesgo país",v:"610 pb",b:"red"},
         {l:"Soberanos USD",v:"a la baja",b:"red"},
       ]},
      {cat:"DATO ECONÓMICO", icon:"📊", title:"Inflación mayorista: mínimo desde mayo",
       note:"",
       ac:"#059669",rows:[{l:"IPIM febrero",v:"1,0% mensual",b:"green"},{l:"Referencia",v:"mín. desde mayo"},{l:"Importados",v:"deflación",b:"green"}]},
    ],
    intl:[
      {n:"S&P 500",   v:"—",       ch:"-1,36%", neg:true},
      {n:"Nasdaq",    v:"—",       ch:"-1,30%", neg:true},
      {n:"Dow Jones", v:"—",       ch:"-1,65%", neg:true},
      {n:"Russell 2000",v:"—",     ch:"-1,63%", neg:true},
      {n:"Brent",     v:"106,23",  ch:"+5,78%", neg:false},
      {n:"Oro (GLD)", v:"444,83",  ch:"-3,14%", neg:true},
      {n:"Plata (SLV)",v:"68,72",  ch:"-4,10%", neg:true},
      {n:"Soja",      v:"1.163",   ch:"+6,72%", neg:false},
      {n:"Bitcoin",   v:"70.636",  ch:"-4,40%", neg:true},
      {n:"VIX",       v:"24,90",   ch:"+11,54%",neg:true},
      {n:"Treasury 10Y",v:"4,265%",ch:"+1,55%", neg:true},
      {n:"DXY",       v:"100,17",  ch:"+0,61%", neg:true},
    ],
    intlNote:"Jornada de <b>risk-off global</b>: todos los índices americanos cayeron más del 1,3%. El VIX trepó +11,5% a 24,90 puntos. Sectores defensivos como Energía (+0,36%) fueron la excepción; Materiales lideró las bajas con -3,29%. En acciones individuales, <b>MU +1,02%</b> (impacto positivo del earnings de la jornada anterior) e <b>INTC +2,80%</b>. En commodities, el Brent escaló +5,78% por tensión en Irán, mientras el oro y la plata retrocedieron con fuerza en la toma de ganancias.",
    intlDestacados:[
      {t:"INTC",ch:"+2,80%",neg:false},{t:"MU",ch:"+1,02%",neg:false},
      {t:"MSFT",ch:"-2,10%",neg:true},{t:"AMZN",ch:"-2,90%",neg:true},
      {t:"XLE (Energía)",ch:"+0,36%",neg:false},{t:"XLB (Materiales)",ch:"-3,29%",neg:true},
    ],
    alert:{type:"red",text:"⚠️ <b>Risk-off:</b> VIX 24,90 (+11,5%). S&P -1,36% · Dow -1,65%. Oro cede terreno; Brent sube +5,78% por Irán. Bitcoin -4,4%."},
  },
  {
    id:"s17", date:"17 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"LECAP MAYO",v:"2,33% TEM",b:"mínimo",bc:"gold"},
      {k:"DÓLAR BCRA",v:"-0,3%",b:"USD 50M",bc:"blue"},
      {k:"BONOS USD",v:"-0,4%",b:"sem.",bc:"red"},
      {k:"RIESGO PAÍS",v:">600 pts",b:"↑ máx. dic.",bc:"red"},
      {k:"SUPERÁVIT FEB.",v:"0,4% PBI",b:"primario",bc:"green"},
    ],
    dato:"📊 <b>Dato del día:</b> INDEC publica hoy a las 16hs la <b>inflación mayorista de febrero</b>.",
    cards:[
      {cat:"TASAS EN PESOS", icon:"💹", title:"Tasa fija en mínimos desde diciembre",
       note:"El mercado apuesta a que las tasas se <b>mantendrán bajas por período prolongado</b>. Niveles no vistos desde diciembre.",
       ac:"#16A34A",rows:[{l:"Lecap mayo (cierre)",v:"2,33% TEM",b:"green"},{l:"Referencia",v:"mín. desde dic."},{l:"Curva",v:"comprimiendo"}]},
      {cat:"FX · BONOS USD", icon:"💱", title:"Dólar firme, bonos bajo presión",
       note:"La caída de la <b>soja en Chicago</b> contribuyó al mal clima externo. Riesgo país supera 600 pts por primera vez desde diciembre.",
       ac:"#DC2626",rows:[{l:"Variación dólar",v:"-0,3%",b:"gold"},{l:"Compra BCRA",v:"USD 50M",b:"blue"},{l:"Bonos USD",v:"-0,4%",b:"red"},{l:"Riesgo país",v:">600 pts",b:"red"}]},
      {cat:"RESULTADO FISCAL", icon:"📊", title:"Superávit primario en febrero",
       note:"El gobierno acumula <b>24 de 26 meses con resultado positivo</b> desde el inicio de gestión.",
       ac:"#16A34A",rows:[{l:"Superávit feb.",v:"0,4% PBI",b:"green"},{l:"Meses positivos",v:"24 de 26"},{l:"Período",v:"Gestión Milei"}]},
      {cat:"CONTEXTO POLÍTICO", icon:"🎤", title:"Milei en Córdoba",
       note:"El Presidente brindó declaraciones con proyecciones optimistas sobre dinámica inflacionaria.",
       ac:"#1E40AF",quote:'"Para agosto la inflación podría comenzar con cero"',quoteBy:"Javier Milei, Presidente",rows:[]},
    ],
    intl:[{n:"S&P 500",v:"6.678",ch:"-0,15%",neg:true},{n:"Nasdaq",v:"22.350",ch:"-0,10%",neg:false},{n:"Brent",v:"USD 72,4",ch:"-0,8%",neg:true},{n:"Soja",v:"USD 374/t",ch:"-1,2%",neg:true}],
    intlNote:"Mal clima en commodities agrícolas. La soja en Chicago <b>presiona negativamente</b> sobre el ingreso de divisas.",
    alert:{type:"green",text:"📊 <b>INDEC</b> publica hoy a las 16:00hs la inflación mayorista de febrero (IPIM). Señal adelantada del IPC."},
  },
  {
    id:"s16", date:"16 MAR 2026", label:"APERTURA DE MERCADO",
    kpis:[
      {k:"SPOT ARS/USD",v:"$1.400",b:"estable",bc:"green"},
      {k:"CAUCIÓN 3D",v:"20,5% TNA",b:"tasa fija",bc:"blue"},
      {k:"MERVAL USD",v:"+1,1%",b:"sem.",bc:"green"},
      {k:"GLOBALES",v:"-0,9%",b:"sem.",bc:"red"},
      {k:"COMPRAS BCRA",v:"USD 295M",b:"sem.",bc:"blue"},
    ],
    dato:"📋 <b>Agenda:</b> Ministerio de Economía publica resultado fiscal de febrero. Ref. enero: superávit primario <b>0,3% del PBI</b> · financiero <b>0,1% del PBI</b>.",
    cards:[
      {cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Compresión en tasa fija",
       note:"Curva de tasa fija comprimió con fuerza tras la licitación del Tesoro. <b>No quedan bonos de tasa fija por encima del 2,5% TEM.</b>",
       ac:"#16A34A",rows:[{l:"Caución 3D",v:"20,5% TNA"},{l:"Lecap 2026 TEM máx.",v:"< 2,5% TEM",b:"gold"},{l:"REPO BCRA",v:"~$2,4B"}]},
      {cat:"FX · BCRA", icon:"💱", title:"Peso estable, BCRA comprador",
       note:"Peso con mayor resiliencia vs. pares LATAM. Aumento del interés abierto en futuros sugiere <b>presencia oficial activa</b>.",
       ac:"#1D4ED8",rows:[{l:"Compra viernes",v:"USD 45M",b:"blue"},{l:"Acumulado sem.",v:"USD 295M"},{l:"Spot cierre",v:"$1.400"}]},
      {cat:"MERCADOS · PERFORMANCE", icon:"📈", title:"Activos locales vs. sell-off global",
       note:"<b>Outperformance relativa.</b> Globales cedieron menos que la deuda EM. El Merval recortó ganancias pero mostró mayor resiliencia.",
       ac:"#B45309",rows:[{l:"Globales (sem.)",v:"-0,9%",b:"red"},{l:"Deuda emergente",v:"-1,4%",b:"red"},{l:"Merval USD (sem.)",v:"+1,1%",b:"green"}]},
      {cat:"SISTEMA FINANCIERO", icon:"🏛️", title:"Mora en máximos de dos décadas",
       note:"<b>15° mes consecutivo</b> de deterioro. Tasas altas y mayor volatilidad crediticia como factores clave.",
       ac:"#DC2626",rows:[{l:"Familias (ene.)",v:"10,6%",b:"red"},{l:"Ent. no financ.",v:">27%",b:"red"},{l:"Tendencia",v:"deterioro"}]},
    ],
    intl:[{n:"S&P 500",v:"6.720",ch:"+0,57%",neg:false},{n:"Nasdaq",v:"22.540",ch:"+0,82%",neg:false},{n:"Brent",v:"USD 74,1",ch:"+1,1%",neg:false},{n:"Oro",v:"USD 3.020",ch:"+0,4%",neg:false}],
    intlNote:"El sell-off en deuda emergente global presionó sobre los globales argentinos, aunque <b>en menor medida que al resto</b>.",
    alert:{type:"gold",text:"📋 <b>Licitación AO27:</b> Segunda vuelta completada. Colocado USD 100M. Prorrateo 46,5%. Tasa: 5,50% TNA."},
  },
];

const MICRON = {
  ticker:"MU", nombre:"Micron Technology", exchange:"NASDAQ",
  periodo:"Q2 FY2025", reportado:"18 MAR 2026",
  headline:"Beat en todas las líneas clave",
  headlineSub:"Revenue, EPS y Outlook superaron ampliamente las estimaciones del consenso",
  beats:[{label:"+19,7%",desc:"Rev."},{label:"+32,5%",desc:"EPS"},{label:"+63,6%",desc:"Guid."}],
  resultados:[
    {label:"Revenue reportado",valor:"$23,86B",badge:"+19,7%",bc:"green"},
    {label:"Estimado consenso",valor:"$19,94B"},
    {label:"Diferencia absoluta",valor:"+$3,92B",bc:"green"},
  ],
  rentabilidad:[
    {label:"Adj. EPS reportado",valor:"$12,20",badge:"+32,5%",bc:"green"},
    {label:"Adj. EPS estimado",valor:"$9,21"},
    {label:"Net Income",valor:"$13,79B"},
    {label:"Adj. Net Income",valor:"$14,02B"},
  ],
  guidance:[
    {label:"REVENUE Q3",valor:"$33,50B",est:"Est: $23,80B",beat:"+40,8%"},
    {label:"ADJ. EPS Q3",valor:"$19,15",est:"Est: $11,70",beat:"+63,7%"},
    {label:"EPS Q3",valor:"$18,90",est:"Guidance"},
    {label:"GROSS MARGIN Q3",valor:"81%",est:"Proyectado",isBar:true},
  ],
  analisis:`Micron reportó un trimestre <strong>excepcionalmente fuerte</strong>, superando estimaciones por márgenes inusuales en todos los frentes. El dato más relevante es el <strong>guidance de Q3: Revenue de $33,50B contra un consenso de $23,80B</strong>, un beat forward del <span style="display:inline-block;background:#DCFCE7;color:#166534;padding:1px 7px;border-radius:4px;font-weight:700">+40,8%</span>. Esto sugiere que la demanda de memoria — especialmente <strong>HBM (High Bandwidth Memory) para infraestructura de IA</strong> — está acelerando a un ritmo que el mercado subestimó significativamente.<br/><br/>El <strong>Gross Margin proyectado del 81%</strong> para Q3 refleja poder de fijación de precios sólido y mix favorable hacia productos premium. Si el guidance se materializa, Micron estaría encaminada a convertirse en uno de los mayores beneficiarios del ciclo de inversión en IA. <strong>Riesgo clave:</strong> ejecución en capacidad de HBM y posibles restricciones de exportación hacia China.`,
};

// ── LECAP (Tasa Fija) — 19 MAR 2026 10:45hs ─────────────────
const LECAP = [
  {mes:"Abril",     vto:"17/04/2026", dias:29,  rows:[{t:"S17A6", pre:"$107,82",r:"2,14%", tna:"26,91%", tem:"2,21%", fxbe:"$1.452"}]},
  {mes:"Abril",     vto:"30/04/2026", dias:42,  rows:[{t:"S30A6", pre:"$123,83",r:"2,96%", tna:"25,69%", tem:"2,10%", fxbe:"$1.463"}]},
  {mes:"Mayo",      vto:"15/05/2026", dias:57,  rows:[{t:"S15Y6", pre:"$100,00",r:"4,20%", tna:"26,90%", tem:"2,18%", fxbe:"$1.470"}]},
  {mes:"Mayo",      vto:"29/05/2026", dias:71,  rows:[{t:"S29Y6", pre:"$124,96",r:"5,67%", tna:"29,12%", tem:"2,36%", fxbe:"$1.502"}]},
  {mes:"Junio",     vto:"30/06/2026", dias:103, rows:[{t:"T30J6", pre:"$134,20",r:"7,97%", tna:"28,24%", tem:"2,26%", fxbe:"$1.535"}]},
  {mes:"Julio",     vto:"17/07/2026", dias:120, rows:[{t:"S17L6", pre:"$102,50",r:"8,64%", tna:"26,28%", tem:"2,16%", fxbe:"$1.548"}]},
  {mes:"Julio",     vto:"31/07/2026", dias:134, rows:[{t:"S31L6", pre:"$106,81",r:"10,18%",tna:"27,73%", tem:"2,19%", fxbe:"$1.566"}]},
  {mes:"Agosto",    vto:"31/08/2026", dias:165, rows:[{t:"S31G6", pre:"$112,28",r:"13,16%",tna:"29,12%", tem:"2,27%", fxbe:"$1.609"}]},
  {mes:"Septiembre",vto:"30/09/2026", dias:195, rows:[{t:"S30S6", pre:"$101,30",r:"16,03%",tna:"30,01%", tem:"2,31%", fxbe:"$1.649"}]},
  {mes:"Octubre",   vto:"30/10/2026", dias:225, rows:[{t:"S30O6", pre:"$114,00",r:"18,67%",tna:"30,28%", tem:"2,31%", fxbe:"$1.687"}]},
  {mes:"Noviembre", vto:"30/11/2026", dias:256, rows:[{t:"S30N6", pre:"$106,68",r:"21,75%",tna:"31,02%", tem:"2,33%", fxbe:"$1.731"}]},
  {mes:"Ene 2027",  vto:"15/01/2027", dias:302, rows:[{t:"T15E7", pre:"$127,45",r:"26,41%",tna:"31,91%", tem:"2,36%", fxbe:"$1.797"}]},
  {mes:"Abr 2027",  vto:"30/04/2027", dias:407, rows:[{t:"T30A7", pre:"$115,15",r:"36,64%",tna:"32,86%", tem:"2,33%", fxbe:"$1.942"}]},
  {mes:"May 2027",  vto:"31/05/2027", dias:438, rows:[{t:"T31Y7", pre:"$108,00",r:"40,34%",tna:"33,61%", tem:"2,35%", fxbe:"$1.995"}]},
  {mes:"Jun 2027",  vto:"30/06/2027", dias:468, rows:[{t:"T30J7", pre:"$110,25",r:"41,53%",tna:"32,39%", tem:"2,25%", fxbe:"$2.012"}]},
  {mes:"May 2030",  vto:"30/05/2030", dias:1533,rows:[{t:"TY30P", pre:"$118,55",r:"108,49%",tna:"25,83%",tem:"1,45%",fxbe:"$2.964"}]},
];

// ── BONOS DUALES — 19 MAR 2026 ──────────────────────────────
const DUALES = [
  {t:"TTJ26", vto:"30/06/2026", dias:103, temFija:"-1,29%", tnaFija:"-15,40%", temVar:"3,08%", tnaVar:"38,83%", fxbe:"$1.360"},
  {t:"TTS26", vto:"15/09/2026", dias:180, temFija:"0,33%",  tnaFija:"4,00%",   temVar:"3,28%", tnaVar:"43,28%", fxbe:"$1.450"},
  {t:"TTD26", vto:"15/12/2026", dias:271, temFija:"0,92%",  tnaFija:"11,66%",  temVar:"3,26%", tnaVar:"45,33%", fxbe:"$1.545"},
];

// ── LETRAS TAMAR — 19 MAR 2026 ──────────────────────────────
const TAMAR = [
  {t:"M30A6", vto:"30/04/2026", dias:42,  rend:"4,49%",  tna:"39,94%", tem:"3,26%", fxbe:"$1.485"},
  {t:"M31G6", vto:"31/08/2026", dias:165, rend:"19,23%", tna:"42,79%", tem:"3,27%", fxbe:"$1.695"},
];

// ── DÓLAR LINKED — 19 MAR 2026 ──────────────────────────────
const DOLARLINKED = [
  {t:"D30A6", vto:"30/04/2026", dias:42,  pre:"$1.383",rend:"1,17%",  tna:"10,18%"},
  {t:"TZV26", vto:"30/06/2026", dias:103, pre:"$1.412",rend:"-0,87%", tna:"-3,09%"},
  {t:"TZV27", vto:"30/06/2027", dias:468, pre:"$1.310",rend:"6,84%",  tna:"5,33%"},
];

// ── BONOS CER — Ajustados por inflación ──────────────────
const BONOS_CER = [
  {t:"TX26",  desc:"Bonte 2026",    vto:"09/11/2026", cupCer:2.00, tipo:"CER+2%",    ley:"ARG", amort:"Bullet"},
  {t:"TZXM6", desc:"BONCER Jun 26", vto:"30/06/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXO6", desc:"BONCER Oct 26", vto:"30/10/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXD6", desc:"BONCER Dic 26", vto:"30/12/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZX26", desc:"BONCER Mar 26", vto:"31/03/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZX27", desc:"BONCER Mar 27", vto:"31/03/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXM7", desc:"BONCER Jun 27", vto:"30/06/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXD7", desc:"BONCER Dic 27", vto:"31/12/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TX28",  desc:"Bonte 2028",    vto:"09/11/2028", cupCer:2.25, tipo:"CER+2,25%", ley:"ARG", amort:"Bullet"},
  {t:"TZX28", desc:"BONCER Mar 28", vto:"31/03/2028", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"DICP",  desc:"Discount 2033", vto:"31/12/2033", cupCer:5.83, tipo:"CER+5,83%", ley:"ARG", amort:"Amort."},
  {t:"PARP",  desc:"Par 2038",      vto:"31/12/2038", cupCer:1.68, tipo:"CER+1,68%", ley:"ARG", amort:"Amort."},
];

// ── SOBERANOS EN USD — 19 MAR 2026 ──────────────────────────
const SOBERANOS = [
  // ley argentina
  {t:"AO27D",vto:"Oct 2027",p:"$102,20",tir:"4,90%", sprd:"—",    cy:"5,87%",dur:1.56,pago:"Mensual", ley:"ARG",par:"101,84%",var1d:"+0,25%",var1w:"+1,29%",neg:false},
  {t:"AO28D",vto:"Oct 2028",p:"$95,00",tir:"9,50%",sprd:"—",   cy:"6,32%",dur:2.10,pago:"Mensual",  ley:"ARG",par:"95,00%",var1d:"—",     var1w:"—",     neg:false},
  {t:"AL29D",vto:"Jul 2029",p:"$61,99", tir:"8,38%", sprd:"-2,62%",cy:"1,21%",dur:1.69,pago:"Semestral",ley:"ARG",par:"77,34%", var1d:"-0,18%",var1w:"+1,46%",neg:true},
  {t:"AN29D",vto:"Nov 2029",p:"$94,14", tir:"9,15%", sprd:"—",    cy:"6,67%",dur:3.30,pago:"Semestral",ley:"ARG",par:"92,50%", var1d:"-0,12%",var1w:"+0,68%",neg:true},
  {t:"AL30D",vto:"Jul 2030",p:"$60,67", tir:"9,47%", sprd:"-2,41%",cy:"0,94%",dur:2.12,pago:"Semestral",ley:"ARG",par:"75,73%", var1d:"-0,61%",var1w:"+0,12%",neg:true},
  {t:"AL35D",vto:"Jul 2035",p:"$74,62", tir:"10,31%",sprd:"-1,28%",cy:"5,52%",dur:5.72,pago:"Semestral",ley:"ARG",par:"74,03%", var1d:"-0,64%",var1w:"-1,03%",neg:true},
  {t:"AE38D",vto:"Ene 2038",p:"$76,92", tir:"10,73%",sprd:"-2,95%",cy:"6,50%",dur:4.85,pago:"Semestral",ley:"ARG",par:"76,18%", var1d:"-0,54%",var1w:"-0,88%",neg:true},
  {t:"AL41D",vto:"Jul 2041",p:"$68,70", tir:"10,51%",sprd:"-1,86%",cy:"5,09%",dur:6.13,pago:"Semestral",ley:"ARG",par:"68,24%", var1d:"-0,89%",var1w:"-2,14%",neg:true},
  // ley nueva york
  {t:"GD29D",vto:"Jul 2029",p:"$63,66", tir:"6,72%", sprd:"+2,69%",cy:"1,18%",dur:1.71,pago:"Semestral",ley:"NY", par:"79,42%", var1d:"0,00%", var1w:"+0,89%",neg:false},
  {t:"GD30D",vto:"Jul 2030",p:"$62,17", tir:"8,24%", sprd:"+2,47%",cy:"0,92%",dur:2.14,pago:"Semestral",ley:"NY", par:"77,60%", var1d:"-0,38%",var1w:"-0,69%",neg:true},
  {t:"GD35D",vto:"Jul 2035",p:"$75,59", tir:"10,07%",sprd:"+1,30%",cy:"5,45%",dur:5.75,pago:"Semestral",ley:"NY", par:"74,99%", var1d:"-1,19%",var1w:"-2,97%",neg:true},
  {t:"GD38D",vto:"Ene 2038",p:"$79,26", tir:"10,06%",sprd:"+3,04%",cy:"6,31%",dur:4.92,pago:"Semestral",ley:"NY", par:"78,50%", var1d:"-0,60%",var1w:"-2,27%",neg:true},
  {t:"GD41D",vto:"Jul 2041",p:"$70,00", tir:"10,18%",sprd:"+1,89%",cy:"5,00%",dur:6.18,pago:"Semestral",ley:"NY", par:"69,53%", var1d:"-0,72%",var1w:"-3,05%",neg:true},
  {t:"GD46D",vto:"Jul 2046",p:"$67,07", tir:"—",     sprd:"—",    cy:"—",   dur:6.32,pago:"Semestral",ley:"NY", par:"—",       var1d:"0,00%", var1w:"-2,51%",neg:true},
];

const PERFILES = [
  {
    id:"conservador", label:"Conservador", Icon:Shield, color:"blue",
    desc:"Preservación de capital con rendimiento real positivo. Horizonte corto-mediano plazo. Fondos de bajo riesgo, LECAPs y cobertura cambiaria.",
    ideas:[
      {inst:"Balanz Income (ETP)",por:"25%",note:"T-Bills US · Rating AA · Duration 0.16 · Exterior",tipo:"fondo"},
      {inst:"Balanz Ahorro Corto Plazo",por:"20%",note:"Fondo RF corto plazo · T+1 · Destacado ARS",tipo:"fondo"},
      {inst:"LECAP S29Y6 (Mayo 2026)",por:"20%",note:"Tasa fija · TEM ~2,36% · Vto. mayo",tipo:"lecap"},
      {inst:"Balanz Money Market",por:"15%",note:"Fondo Money Market · T+0 · Parking",tipo:"fondo"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · T+1 · Destacado USD",tipo:"fondo"},
      {inst:"Caución Bursátil 7D",por:"10%",note:"~20% TNA · Liquidez semanal",tipo:"caucion"},
    ],
    retorno:"Renta fija ARS + T-Bills US + cobertura USD",
    riesgo:"Bajo",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"moderado", label:"Moderado", Icon:Scale, color:"gold",
    desc:"Equilibrio entre cobertura inflacionaria, tasa fija y rendimiento en dólares. Horizonte 6-12 meses. Incluye exposición a corporativos LatAm y balance de activos.",
    ideas:[
      {inst:"Balanz Fixed Income LATAM (ETP)",por:"20%",note:"+50 bonos LatAm · YTM 6,86% · Ley NY · Exterior",tipo:"bono"},
      {inst:"Balanz Balanced (ETP)",por:"15%",note:"50/50 RV/RF · Gestión activa · Exterior",tipo:"fondo"},
      {inst:"LECAP S31L6 (Julio 2026)",por:"15%",note:"Tasa fija · TNA ~27,7% · 4 meses",tipo:"lecap"},
      {inst:"Balanz Inflation Linked (Inst.)",por:"15%",note:"Fondo CER · Cobertura inflación",tipo:"fondo"},
      {inst:"GD30D — Global 2030 (Ley NY)",por:"15%",note:"Soberano USD · TIR ~8,2% · Duration 2,1",tipo:"bono"},
      {inst:"Cedear Oro (GLD)",por:"10%",note:"Cobertura geopolítica · Refugio",tipo:"cedear"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · Liquidez táctica",tipo:"fondo"},
    ],
    retorno:"Mixto ARS/USD · LatAm + RF + Oro",
    riesgo:"Moderado",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"agresivo", label:"Agresivo", Icon:Rocket, color:"purple",
    desc:"Máxima exposición a activos de mayor beta. Renta variable global, cripto y compresión de riesgo país. Horizonte 12-18 meses.",
    ideas:[
      {inst:"Balanz Global Equity (ETP)",por:"20%",note:"RV global · Supera S&P500 · Gestión activa · Exterior",tipo:"cedear"},
      {inst:"Balanz Crypto (ETP)",por:"10%",note:"BTC + ETH + ecosistema cripto · Alta volatilidad · Exterior",tipo:"cedear"},
      {inst:"GD38D — Global 2038 (Ley NY)",por:"20%",note:"Soberano USD · TIR ~10% · Duration 4,9",tipo:"bono"},
      {inst:"Balanz Acciones",por:"15%",note:"Fondo Acciones ARG · Blue chips locales",tipo:"fondo"},
      {inst:"Cedear VIST (Vista Energy)",por:"15%",note:"Pure-play Vaca Muerta · Score #1 RD",tipo:"cedear"},
      {inst:"Cedear NVDA / GOOGL",por:"10%",note:"Tech + IA · Mega-cap growth",tipo:"cedear"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · Liquidez táctica",tipo:"fondo"},
    ],
    retorno:"Potencial alfa USD+Cripto · Alta variabilidad",
    riesgo:"Alto",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
];

/* ════════════════════════════════════════════════════════════════
   FONDOS COMUNES DE INVERSIÓN · BALANZ
   Fuente: balanz.com — 22 MAR 2026
   Cada fondo linkea a su ficha en balanz.com
════════════════════════════════════════════════════════════════ */
const BZ = "https://balanz.com/inversiones/fondos"; // base URL

const FONDOS_BALANZ = [
  {
    cat: "Transaccionales — Pesos",
    Icon: Banknote,
    color: "blue",
    moneda: "ARS",
    desc: "Liquidez inmediata (T+0). Ideal para parking de pesos a tasa diaria.",
    fondos: [
      { nombre:"Balanz Money Market",               ticker:"BMMKT",  rescate:"T+0", tipo:"Money Market", url:`${BZ}/money-market/` },
      { nombre:"Balanz Lecaps (Performance II)",     ticker:"PERF2",  rescate:"T+0", tipo:"Tasa Fija",    url:`${BZ}/performance-ii/`, note:"Exposición a LECAPs" },
    ],
  },
  {
    cat: "Renta Fija — Pesos",
    Icon: ClipboardList,
    color: "gold",
    moneda: "ARS",
    desc: "Bonos soberanos, ONs y LECAPs. Horizonte corto-mediano plazo.",
    destacado: "BCAH",
    fondos: [
      { nombre:"Balanz Ahorro Corto Plazo",          ticker:"BCAH",   rescate:"T+1", tipo:"RF Corto Plazo", url:`${BZ}/ahorro/`, destacado:true },
      { nombre:"Balanz Crédito Privado Corto Plazo", ticker:"BCPCP",  rescate:"T+1", tipo:"ONs Corp.",      url:`${BZ}/credito-privado-corto-plazo/` },
      { nombre:"Balanz ONs (Performance III)",        ticker:"PERF3",  rescate:"T+1", tipo:"ONs Corp.",      url:`${BZ}/performance-iii/` },
      { nombre:"Balanz Opportunity",                  ticker:"BOPPO",  rescate:"T+1", tipo:"RF Flexible",    url:`${BZ}/renta-fija-opportunity/` },
      { nombre:"Balanz Long Pesos",                   ticker:"BLPSO",  rescate:"T+1", tipo:"RF Largo Plazo", url:`${BZ}/long-pesos/` },
      { nombre:"Balanz Abierto PyMES",                ticker:"BPYME",  rescate:"T+1", tipo:"SGR / PyME",     url:`${BZ}/abierto-pymes/` },
      { nombre:"Balanz Abierto Infraestructura",      ticker:"BINFA",  rescate:"T+1", tipo:"Infraestructura",url:`${BZ}/abierto-infraestructura/` },
    ],
  },
  {
    cat: "Cobertura — Pesos",
    Icon: Shield,
    color: "green",
    moneda: "ARS",
    desc: "Cobertura inflación (CER) y tipo de cambio (Dólar Linked).",
    fondos: [
      { nombre:"Balanz Inflation Linked (Inst.)",    ticker:"BINFL",  rescate:"T+1", tipo:"CER",           url:`${BZ}/institucional-inflation-linked/` },
      { nombre:"Balanz Dólar Linked",                ticker:"BDLNK",  rescate:"T+1", tipo:"Dólar Linked",  url:`${BZ}/renta-fija-dolar-linked/` },
    ],
  },
  {
    cat: "Renta Variable — Pesos",
    Icon: TrendingUp,
    color: "red",
    moneda: "ARS",
    desc: "Acciones argentinas, CEDEARs y commodities. Mayor volatilidad, mayor potencial.",
    fondos: [
      { nombre:"Balanz Acciones",                    ticker:"BACCA",  rescate:"T+1", tipo:"Acciones ARG",  url:`${BZ}/acciones/` },
      { nombre:"Balanz Equity Selection",            ticker:"BEQSL",  rescate:"T+1", tipo:"Acciones ARG",  url:`${BZ}/equity-selection/` },
      { nombre:"Balanz Renta Mixta (Retorno Total)", ticker:"BRTOT",  rescate:"T+1", tipo:"Mixto",         url:`${BZ}/retorno-total/` },
      { nombre:"Balanz Soja",                        ticker:"BSOJA",  rescate:"T+1", tipo:"Commodities",   url:`${BZ}/soja/` },
      { nombre:"Balanz Crecimiento",                 ticker:"BCREC",  rescate:"T+1", tipo:"RV Growth",     url:`${BZ}/crecimiento/` },
      { nombre:"Balanz Desarrollo",                  ticker:"BDESA",  rescate:"T+1", tipo:"RV Growth",     url:`${BZ}/desarrollo/` },
    ],
  },
  {
    cat: "Transaccionales — Dólares",
    Icon: DollarSign,
    color: "purple",
    moneda: "USD",
    desc: "Liquidez inmediata en dólares (T+0).",
    fondos: [
      { nombre:"Balanz Money Market USD",            ticker:"BMMUSD", rescate:"T+0", tipo:"Money Market",  url:`${BZ}/money-market-dolares/` },
    ],
  },
  {
    cat: "Renta Fija — Dólares",
    Icon: Globe,
    color: "purple",
    moneda: "USD",
    desc: "Soberanos, corporativos y LATAM en USD. Horizonte 3-18 meses.",
    destacado: "ESTRA1",
    fondos: [
      { nombre:"Balanz Dólar Corto Plazo (Estrategia I)", ticker:"ESTRA1", rescate:"T+1", tipo:"RF USD Corto",  url:`${BZ}/estrategia-i/`, destacado:true },
      { nombre:"Balanz Corporativo (Ahorro USD)",          ticker:"BAUSD",  rescate:"T+1", tipo:"ONs USD",       url:`${BZ}/ahorro-en-dolares/` },
      { nombre:"Balanz Latam (Estrategia III)",            ticker:"ESTRA3", rescate:"T+1", tipo:"RF Latam",      url:`${BZ}/estrategia-iii/` },
      { nombre:"Balanz Soberano (Renta Fija USD)",         ticker:"BSOBU",  rescate:"T+1", tipo:"Soberanos USD", url:`${BZ}/renta-fija-en-dolares/` },
      { nombre:"Balanz Latam sin Arg. Sudamericano",       ticker:"BSUDA",  rescate:"T+2", tipo:"RF Latam ex-AR",url:`${BZ}/sudamericano/` },
    ],
  },
  {
    cat: "Renta Variable — Dólares",
    Icon: Globe,
    color: "red",
    moneda: "USD",
    desc: "Acciones globales. Máximo potencial, máxima volatilidad.",
    fondos: [
      { nombre:"Balanz Renta Variable Global",       ticker:"BRVGL",  rescate:"T+2", tipo:"RV Global",     url:`${BZ}/renta-variable-global/` },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   ETPs BALANZ INTERNATIONAL — Fact Sheets Febrero 2026
   Domicilio: Irlanda · Custodio: StoneX · Auditor: BDO
   Todos en USD cable · Inversión mínima 1.000 VNs · T+2
════════════════════════════════════════════════════════════════ */
const BALANZ_ETPS = [
  {
    id:"income", nombre:"Balanz Income", tipo:"Renta Fija", perfil:"Ultra Conservador",
    color:"blue", tagline:"Bonos del Tesoro de EE.UU. — la inversión más segura del mundo",
    desc:"Preservación de capital invirtiendo en T-Bills de corta duración. Ideal para quien quiere estar en dólares, fuera del riesgo argentino, con la máxima seguridad.",
    aum:"84.9", nav:"108.48", ytm:"3.68%", duration:"0.16", fee:"0.85%", rating:"AA", isin:"XS2621330369", inicio:"15/09/2023",
    rend:{ m1:0.2, m3:0.7, m6:1.4, y1:2.9, ytd:0.4, y2024:3.8, sinceInc:8.5 },
    top3:[{n:"US Treasury Bill Jun-26",w:"34.9%"},{n:"US Treasury Bill Mar-26",w:"33.6%"},{n:"US Treasury Bill Abr-26",w:"31.2%"}],
    highlight:"100% US Treasuries · Rating AA · Duration 0.16 años",
  },
  {
    id:"short", nombre:"Balanz Short Duration", tipo:"Renta Fija", perfil:"Conservador+",
    color:"blue", tagline:"Renta fija global de corta duración con gestión activa",
    desc:"Portafolio diversificado de RF de corta duración. Alta calidad crediticia con exposición selectiva a mayor rendimiento para optimizar el carry.",
    aum:"5.0", nav:"100.17", ytm:"5.17%", duration:"1.44", fee:"0.85%", rating:"A", isin:"XS3281861446", inicio:"02/02/2026",
    rend:{ m1:0.2, m3:null, m6:null, y1:null, ytd:0.2, y2024:null, sinceInc:0.2 },
    top3:[{n:"Deuda corporativa global",w:"36.6%"},{n:"Deuda securitizada",w:"29.7%"},{n:"T-Bills",w:"12.5%"}],
    highlight:"64% EE.UU. · 23% Europa · Rating A · Nuevo (Feb 2026)",
  },
  {
    id:"latam", nombre:"Balanz Fixed Income LATAM", tipo:"Renta Fija", perfil:"Moderado",
    color:"gold", tagline:"+50 bonos corporativos LatAm con ley New York",
    desc:"Exposición diversificada a renta fija corporativa latinoamericana. Fuera del riesgo argentino, con rendimientos superiores al 7% anual y 53 emisores en cartera.",
    aum:"80.0", nav:"119.29", ytm:"6.86%", duration:"3.23", fee:"1.25%", rating:"BB+", isin:"XS2707193509", inicio:"20/11/2023",
    rend:{ m1:0.6, m3:2.7, m6:4.0, y1:7.6, ytd:1.6, y2024:7.0, sinceInc:19.3 },
    top3:[{n:"Ecopetrol",w:"4.5%"},{n:"Samarco Mineracao",w:"3.1%"},{n:"Engie Energía Chile",w:"2.9%"}],
    highlight:"53 emisores · 6 países · YTM 6.86% · Duration 3.23",
  },
  {
    id:"balanced", nombre:"Balanz Balanced", tipo:"Multi Activo", perfil:"Moderado",
    color:"gold", tagline:"50% renta fija + 50% renta variable — diversificación ideal",
    desc:"Asignación dinámica y diversificada. Gestión activa que combina crecimiento de capital con ingresos. El instrumento más equilibrado para inversores moderados.",
    aum:"37.8", nav:"121.86", ytm:"4.73%", duration:"0.94", fee:"1.50%", rating:null, isin:"XS2707193418", inicio:"18/01/2024",
    rend:{ m1:-0.6, m3:0.3, m6:4.2, y1:9.0, ytd:0.6, y2024:8.9, sinceInc:21.9 },
    top3:[{n:"SPDR S&P 500 ETF",w:"36.2%"},{n:"T-Bills",w:"17.6%"},{n:"Deuda securitizada",w:"12.5%"}],
    highlight:"54% RV + 45% RF · +21.9% desde inicio · NAV $121.86",
  },
  {
    id:"equity", nombre:"Balanz Global Equity", tipo:"Renta Variable", perfil:"Agresivo",
    color:"purple", tagline:"Superar al S&P 500 cuando sube, amortiguar cuando baja",
    desc:"Cartera global de renta variable con gestión activa profesional. Busca alfa sobre el benchmark, menor volatilidad en caídas y exposición a los mejores sectores del momento.",
    aum:"22.4", nav:"114.05", ytm:null, duration:null, fee:"1.50%", rating:null, isin:"XS3067937642", inicio:"19/05/2025",
    rend:{ m1:-1.4, m3:0.4, m6:6.2, y1:null, ytd:0.5, y2024:null, sinceInc:14.1 },
    top3:[{n:"SPDR S&P 500 ETF",w:"49.6%"},{n:"Fundstrat Granny Shots",w:"14.1%"},{n:"MSCI ACWI",w:"10.0%"}],
    highlight:"+14.1% desde inicio · Gestión activa · Exposición global",
  },
  {
    id:"crypto", nombre:"Balanz Crypto", tipo:"Criptoactivos", perfil:"Agresivo",
    color:"purple", tagline:"Bitcoin, Ethereum y el ecosistema cripto en un solo instrumento",
    desc:"Exposición diversificada al ecosistema de criptoactivos. Combina activos digitales directos con acciones de empresas del sector. Horizonte largo plazo, alta volatilidad.",
    aum:"3.8", nav:"51.20", ytm:null, duration:null, fee:"2.00%", rating:null, isin:"XS3146740496", inicio:"18/08/2025",
    rend:{ m1:-23.0, m3:-32.0, m6:-47.3, y1:null, ytd:-28.5, y2024:null, sinceInc:-48.8 },
    top3:[{n:"iShares Bitcoin Trust ETF",w:"59.6%"},{n:"iShares Ethereum Trust ETF",w:"28.7%"},{n:"BitMine Immersion",w:"4.3%"}],
    highlight:"88% cripto directo · Alta volatilidad · Largo plazo",
  },
];

const NOTICIAS = [
  // ════════════════════════════════════════════════════════
  //  INFORMES ESTRELLA — 08 ABR 2026
  // ════════════════════════════════════════════════════════
  {
    id:"inf_qqq", fecha:"08 ABR 2026", cat:"ESTRATEGIA · ETFs", catColor:"blue", seccion:"Informes", estrella:true,
    titulo:"De SPY a QQQ: la rotación que pocos hacen y más deberían",
    subtitulo:"El Nasdaq 100 tiene un upside estructuralmente mayor que el S&P 500 para el mediano plazo. Esta es la tesis.",
    emoji:"🔄",
    relevancia:"alta",
    cuerpo:`Cuando el mercado corrige, el instinto es refugiarse en lo más amplio y diversificado: el <strong>SPY</strong>. Pero en las recuperaciones de ciclos tecnológicos, esa lógica sale cara. El <strong>QQQ</strong> —que replica el Nasdaq 100— históricamente le lleva tres a cinco puntos porcentuales anuales al S&P 500 en períodos de diez años, y en ciclos de inteligencia artificial esa brecha se ensancha.

<strong>¿Por qué el QQQ gana más?</strong> El SPY incluye 500 empresas —bancos, utilities, supermercados, tabacaleras. El QQQ tiene 100, todas de crecimiento, con concentración en las seis empresas que más gasto en IA ejecutan en el mundo: Apple, Microsoft, NVIDIA, Amazon, Meta y Alphabet. En un ciclo donde el capex tecnológico sigue creciendo a doble dígito, el QQQ captura más de esa ola.

<strong>El contexto de hoy lo hace más interesante:</strong> el QQQ cayó ~12% en lo que va del año, mientras el SPY bajó ~8%. Esa diferencia de beta es exactamente la ventana. El mercado vendió el QQQ más fuerte por sus múltiplos altos, pero los fundamentos de las empresas del índice no cambiaron: siguen generando más caja libre, creciendo más rápido y reinvirtiendo más que el promedio del S&P.

<em>Dato histórico concreto:</em> en los últimos 15 años, el QQQ generó un retorno anualizado del 19,8% vs 13,6% del SPY. Con reinversión de dividendos, $10.000 invertidos en QQQ en 2010 equivalen a $155.000 hoy; los mismos $10.000 en SPY, a $64.000. La diferencia no es trivial.

<strong>Para un inversor argentino:</strong> ambos están disponibles como CEDEARs en BYMA. El QQQ en pesos se ajusta por CCL —sirve como cobertura cambiaria Y como apuesta de crecimiento en el índice tecnológico más importante del mundo. La relación riesgo/retorno en este momento, con el QQQ cerca de mínimos de 2026, es de las mejores entradas de los últimos años.

<em>Único riesgo real:</em> una recesión global que comprima los múltiplos de tech en forma prolongada. Pero incluso en ese escenario, el QQQ tiende a recuperar más rápido que el SPY por la calidad de sus componentes. La tesis es de mediano plazo —18 a 36 meses— no para tradear la semana.`,
  },
  {
    id:"inf_rot", fecha:"08 ABR 2026", cat:"ESTRATEGIA · ROTACIÓN", catColor:"green", seccion:"Informes", estrella:true,
    titulo:"La rotación de la semana: del petróleo a la tecnología",
    subtitulo:"El rally del crudo está cediendo. El dinero que sale de energía tiene un destino lógico: tech en zona de compra.",
    emoji:"⚡",
    relevancia:"alta",
    cuerpo:`El <strong>WTI cayó de $108 a $100 en menos de 48 horas</strong> después de que Irán señaló disposición a negociar el ceasefire. Eso es suficiente para que el dinero que entró en energía buscando el shock de oferta empiece a rotar hacia donde el riesgo/retorno es más atractivo en el nuevo escenario.

<strong>La secuencia que está pasando:</strong> desde la semana del 1 de abril, XOM, CVX, OXY y SLB empezaron a distribuir después de subidas del 30-36%. Al mismo tiempo, PANW y CRWD tocaron fondo y rebotaron hoy más de 4%. MSFT, que bajó 19% en lo que va del año, cotiza a 27x ganancias forward —por primera vez en dos años está en zona "razonable" por sus estándares históricos.

<strong>La lógica de la rotación:</strong> los fondos que sobreponderon energía por el conflicto iraní ahora tienen dos opciones —tomar ganancias y quedar en cash, o rotar hacia el sector que más corrigió y tiene el mayor leverage al siguiente ciclo. Tech gana ese debate por tres razones:

<em>1. Earnings en cuatro semanas:</em> Tesla el 22 ABR, Amazon el 23, Meta el 29, Apple el 30 y NVIDIA el 20 de mayo. Si los balances confirman que el gasto en IA no se frenó, el re-rating puede ser rápido y violento al alza.

<em>2. Los grandes nombres siguen generando caja a ritmo récord:</em> Microsoft generó $74B de free cash flow en los últimos doce meses. Meta generó $52B. NVIDIA duplicó su FCF año sobre año. Estas empresas no necesitan que el Brent esté a $100 para funcionar.

<em>3. Los CEDEARs de tech están en zona de acumulación:</em> MSFTD, AMZND, METAD y NVDAD bajaron entre 8% y 19% en pesos en 2026. Para un inversor argentino, esta corrección amplifica la ventana de entrada considerando que el CCL sigue estable.

<strong>Cómo ejecutar:</strong> no hace falta vender toda la energía —XOM y CVX siguen siendo nombres sólidos con dividendo. La idea es reducir exposición a los nombres más volátiles al precio del crudo (OXY, DVN, HAL) y rotar esos pesos hacia MSFT, META o el propio QQQD como forma de capturar la recuperación del sector.`,
  },
  {
    id:"inf3", fecha:"08 ABR 2026", cat:"INFORME · TECNOLOGÍA", catColor:"blue", seccion:"Informes",
    titulo:"Tecnológicas: el fondo del selloff o una trampa de valor",
    relevancia:"alta",
    cuerpo:`El <strong>S&P 500 acumula cuatro semanas en rojo</strong> y el sector tecnológico fue el más golpeado. NVDA bajó -4,3% en el año, MSFT -19%, META -8%, AMZN -9%. La pregunta que divide al mercado: ¿este es el piso de la corrección o el inicio de una rotación estructural fuera del sector?

<strong>El dato duro:</strong> las valuaciones siguen siendo altas en términos absolutos. El Nasdaq cotiza a 28x ganancias forward, bien por encima de su promedio histórico de 22x. Pero el contexto cambió: la Fed implícitamente señala que no recortará tasas antes de diciembre, lo que comprime múltiplos de crecimiento.

<strong>Earnings de abril serán el termómetro clave.</strong> Tesla reporta el 22 ABR, Amazon el 23, Meta el 29, Apple el 30. NVIDIA espera hasta el 20 de mayo. El mercado no perdonará guianzas conservadoras —los PEs actuales solo se justifican con crecimiento de dos dígitos sostenido.

<em>Dato vs. interpretación:</em> el selloff parece más un reacomodamiento de múltiplos que un deterioro de fundamentos. Los balances corporativos siguen fuertes, el gasto en IA no da señales de desaceleración. La clave está en el guidance de Q2. Los que aguanten la volatilidad de las próximas tres semanas tienen una ventana de entrada que históricamente generó retornos superiores.

<strong>Sectores con mayor margen de suba relativo:</strong> ciberseguridad (CRWD, PANW) que corrigieron ~10% sin deterioro de fundamentos, y software de infraestructura (NOW, DDOG) con crecimiento de ingresos acelerado.`,
  },
  {
    id:"inf2", fecha:"07 ABR 2026", cat:"INFORME · ENERGÍA", catColor:"gold", seccion:"Informes",
    titulo:"Petroleras: cómo leer el rally del petróleo y la decisión de toma de ganancias",
    relevancia:"alta",
    cuerpo:`El Brent escaló de USD 72 en enero a USD 108 en marzo, un rally de <strong>+50% en diez semanas</strong>. El catalizador fue el ataque de EE.UU. e Israel sobre instalaciones iraníes el 28 de febrero, que generó temores concretos sobre el estrecho de Ormuz, por donde transita el 20% del suministro mundial de crudo. Las grandes petroleras respondieron en consecuencia: <strong>XOM subió +31%</strong>, CVX +32%, OXY +36%, EOG +27%.

<strong>¿Es momento de vender?</strong> La señal iraní del 7 de abril —el presidente Pezeshkian dijo que Irán está dispuesto a terminar la guerra a cambio de garantías de seguridad— hizo caer el WTI -2% en la jornada, a ~$100. Esto es el primer indicador real de desescalada.

<em>La tesis para mantener:</em> incluso con ceasefire, la oferta de la OPEP sigue restringida, los inventarios de EEUU están 8% bajo el promedio de 5 años y la demanda asiática sorprendió al alza en Q1. El precio de equilibrio del Brent en un escenario sin conflicto sería ~$80-85 —todavía por encima del mínimo de enero.

<em>La tesis para rotar:</em> los stocks de energía ya descontaron un conflicto prolongado. La resolución —parcial o total— generaría una compresión rápida de 15-20% en los precios spot, arrastrando las acciones. Las compañías con mayor beta al Brent (OXY, DVN, HAL) serían las más expuestas.

<strong>Dato preciso para la decisión:</strong> OXY necesita Brent a $75 para generar FCF positivo. A $100, su FCF yield es ~12%. Eso es un colchón cómodo. SLB y HAL, como servicios de campo, tienen menos leverage directo al precio del crudo y mayor visibilidad de contratos —son mejores para mantener en cartera con horizonte más largo.`,
  },
  {
    id:"inf1", fecha:"06 ABR 2026", cat:"INFORME · GEOPOLÍTICA", catColor:"red", seccion:"Informes",
    titulo:"Conflicto Irán: el mapa del riesgo para carteras argentinas",
    relevancia:"alta",
    cuerpo:`El <strong>ataque coordinado de EE.UU. e Israel sobre Irán</strong> el 28 de febrero de 2026 marcó la escalada más significativa en Medio Oriente desde la Segunda Guerra del Golfo. El impacto sobre los mercados fue inmediato y diferenciado: el Brent saltó $25 en 48 horas, los índices americanos cedieron más del 8% en dos semanas, y el oro tocó USD 4.700 antes de corregir.

<strong>¿Cómo afecta esto a un inversor argentino?</strong>

<em>Canal 1 — Precio del petróleo → Vaca Muerta:</em> el petróleo alto es inequívocamente positivo para las exportaciones argentinas de crudo. YPF, Vista (VIST) y Pampa Energía se benefician directamente. Un Brent sostenido en $90-100 acelera los plazos de retorno de los pozos en Vaca Muerta y mejora el perfil de crédito soberano vía ingreso de divisas.

<em>Canal 2 — Tasas globales → Bonos soberanos:</em> el shock energético presionó la inflación americana al alza (FED revisó su estimación al 2.7%), lo que retrasó los recortes de tasas. Para Argentina, esto significa que sus soberanos en USD siguen compitiendo con Treasuries a tasas altas —un headwind para la compresión del spread.

<em>Canal 3 — Risk-off → Merval:</em> cuando el mundo entra en modo risk-off, los activos emergentes sufren en primer lugar. El Merval mostró resiliencia relativa (caída menor a pares EM) gracias al componente energético del índice.

<strong>Señal del 7 ABR:</strong> el presidente iraní expresó disposición a negociar con garantías de seguridad. WTI cayó 2% a $100. Si esta señal se materializa en un cese del fuego, el escenario más probable es una rotación desde energía y defensa hacia tech y consumo. El oro podría corregir otro 5-8%.

<em>Dato vs. interpretación:</em> el riesgo de cola —un ataque al estrecho de Ormuz con cierre real de la ruta— sería un evento con consecuencias inflacionarias globales de magnitud comparable a la crisis del '73. La probabilidad del mercado, según Polymarket, se ubica en torno al 12%.`,
  },
  {
    id:"n7", fecha:"20 MAR 2026", cat:"EMPRESAS · $BIOX", catColor:"red", seccion:"Empresas",
    titulo:"Bioceres (BIOX) en riesgo de desliste en Nasdaq: cotizó debajo de US$1 durante 30 ruedas",
    cuerpo:`<strong>Bioceres Crop Solutions ($BIOX)</strong> recibió una advertencia formal del Nasdaq por cotizar debajo del <strong>mínimo de US$1</strong> durante 30 ruedas hábiles consecutivas. La compañía tiene plazo hasta <strong>septiembre de 2026</strong> para recuperar el umbral mínimo exigido por el mercado.

Para evitar el desliste, la acción deberá mantenerse <strong>por encima de US$1 durante al menos 10 ruedas hábiles consecutivas</strong>. De no lograrlo, quedará expuesta a un proceso formal de exclusión del mercado.

<em>Dato vs. interpretación:</em> el caso BIOX es un ejemplo contundente de la importancia del análisis fundamental previo a cualquier decisión de inversión. Entender el valor agregado real de una empresa, su estructura financiera y sus fundamentos operativos es la única forma de separar una oportunidad de una trampa de valor. El FOMO y las redes sociales nunca son sustitutos del trabajo de research.`,
    relevancia:"alta",
  },
  {
    id:"n8", fecha:"20 MAR 2026", cat:"AGENDA · MERCADOS", catColor:"blue", seccion:"Internacional",
    titulo:"Semana que viene: petróleo volátil, Fed habla, PMIs globales y cumbre del G7",
    cuerpo:`La semana que comienza el <strong>23 de marzo</strong> concentra una agenda densa para los mercados internacionales:

<strong>🛢️ Petróleo:</strong> los precios seguirán dependiendo de los titulares de Medio Oriente y los datos de oferta. Semana clave para monitorear la evolución del conflicto en Irán y el estrecho de Ormuz.

<strong>🏦 Reserva Federal habla:</strong> varios funcionarios de la Fed darán discursos durante la semana, incluyendo la vicepresidencia de supervisión y presidentes de reservas regionales. El mercado estará atento a señales sobre tasas — cualquier lectura hawkish amplificará la presión sobre activos de riesgo.

<strong>📊 PMIs globales (martes):</strong> primer termómetro del impacto económico del conflicto en Medio Oriente sobre la actividad global. Dato clave para evaluar si el shock energético ya está afectando el ciclo.

<strong>🌎 G7 (jueves):</strong> los cancilleres del G7 se reúnen para discutir la guerra en Irán. Evento político relevante — cualquier señal de coordinación o escalada definirá el tono de la segunda parte de la semana.

<em>Dato vs. interpretación:</em> semana de alta densidad informativa. El dato más movedor del mercado será el PMI del martes y los discursos Fed. Si los PMIs muestran deterioro + Fed hawkish, el risk-off seguirá presionando activos de riesgo.`,
    relevancia:"alta",
  },
  {
    id:"n1", fecha:"18 MAR 2026", cat:"POLÍTICA MONETARIA · EEUU", catColor:"blue", seccion:"Internacional",
    titulo:"Fed mantiene tasas en 3,75% con primer voto disidente a favor de un recorte",
    cuerpo:`La Reserva Federal dejó sin cambios su tasa de referencia en <strong>3,75%</strong>, en línea con lo esperado por el mercado. Sin embargo, la reunión dejó señales que vale la pena leer con atención.

El elemento más relevante fue la presencia de un <strong>voto disidente</strong> dentro del comité, que solicitó una baja de 25 puntos básicos. Esto confirma que el debate interno sobre el inicio del ciclo de recortes ya está abierto — ya no es una posibilidad remota, sino una discusión activa.

En materia de proyecciones, la Fed <strong>elevó su estimación de PBI 2026 al 2,4%</strong>, señal de resiliencia del ciclo económico, pero también ajustó al alza la inflación esperada al <strong>2,7%</strong>, incorporando el impacto de la tensión geopolítica en Medio Oriente y la dinámica del petróleo. El mercado interpretó el comunicado de forma constructiva: los bonos relajaron rendimientos post-reunión y el mercado de futuros descuenta con mayor convicción un <strong>recorte completo de 25 pbs para diciembre de 2026</strong>.

<em>Dato vs. interpretación:</em> el dato es la tasa sin cambios y el voto disidente; la interpretación es que la Fed está más cerca del pivote de lo que su postura oficial sugiere.`,
    relevancia:"alta",
  },
  {
    id:"n2", fecha:"18 MAR 2026", cat:"ENERGÍA · ARGENTINA", catColor:"green", seccion:"Energía",
    titulo:"Bank of America: Vaca Muerta podría duplicar su producción en cinco a siete años",
    cuerpo:`Un informe de <strong>Bank of America</strong> posiciona a Vaca Muerta como uno de los desarrollos de shale más relevantes a escala global, con potencial para que Argentina ingrese al grupo de los <strong>20 principales productores de petróleo y gas del mundo</strong>.

El análisis destaca que la inclusión de proyectos upstream en el <strong>RIGI</strong> podría acelerar significativamente la perforación a nivel nacional. Sin embargo, el banco advierte que los <strong>costos operativos siguen siendo un 30% a 40% más elevados que en EEUU</strong>, lo que condiciona la velocidad de escala y la rentabilidad de los proyectos.

Los factores clave identificados para sostener el crecimiento son dos: <strong>economías de escala</strong> — que solo se logran con volúmenes sostenidos de perforación — y <strong>previsibilidad regulatoria</strong>, elemento que históricamente ha sido el talón de Aquiles del sector energético argentino.

<em>Dato vs. interpretación:</em> el potencial técnico está reconocido por uno de los bancos de inversión más importantes del mundo; el condicionante es institucional y de costos, no geológico.`,
    relevancia:"alta",
  },
  {
    id:"n3", fecha:"18 MAR 2026", cat:"JUDICIAL · YPF", catColor:"red", seccion:"Judicial",
    titulo:"Justicia de EEUU suspende demandas contra Argentina hasta resolver la cuestión de fondo",
    cuerpo:`La Justicia de Estados Unidos <strong>suspendió las demandas en curso contra la Argentina</strong> en el marco del juicio por la expropiación de YPF S.A., hasta tanto se resuelva la cuestión de fondo del caso.

La medida implica un compás de espera procesal que, en principio, reduce la presión de ejecución inmediata sobre activos soberanos argentinos en el exterior. El litigio, que involucra montos que superan los <strong>USD 16.000 millones</strong> según las estimaciones de los demandantes, es uno de los factores de riesgo de cola más relevantes para los activos argentinos.

<em>Dato vs. interpretación:</em> la suspensión es un hecho procesal, no una resolución de fondo. No implica un fallo favorable para Argentina — simplemente posterga el cronograma. El riesgo sigue latente y su evolución merece seguimiento estrecho.`,
    relevancia:"alta",
  },
  {
    id:"n4", fecha:"18 MAR 2026", cat:"TECNOLOGÍA · ENERGÍA", catColor:"purple", seccion:"Empresas",
    titulo:"IMPSA exportará componentes nucleares a EEUU: primera vasija de reactor modular del continente",
    cuerpo:`En un hecho que pasó prácticamente desapercibido durante el <strong>Argentina Week 2026</strong>, IMPSA — recientemente privatizada — anunció que exportará componentes nucleares al mercado estadounidense, apuntando directamente al segmento de <strong>reactores modulares pequeños (SMR)</strong>.

El CEO Jorge Salcedo explicó que la <strong>vasija de presión del CAREM 25</strong> — el reactor nuclear de diseño nacional — funcionará como carta de presentación ante desarrolladores de SMR en EEUU, que proyectan construir entre 15 y 30 unidades cada uno. IMPSA tiene capacidad de fabricar entre <strong>3 y 4 vasijas por año</strong>, lo que la posiciona como proveedor de componentes críticos a escala global.

Salcedo también anticipó una próxima asociación con una empresa americana en el área hidroeléctrica para la región latinoamericana. El hito técnico es significativo: <strong>Argentina terminaría la primera vasija de presión de un reactor modular en todo el continente americano</strong>, combinando la ingeniería de CNEA con la capacidad manufacturera de IMPSA.

<em>Dato vs. interpretación:</em> se trata de exportación de manufactura de alta tecnología con uso dual (civil y energético), en un contexto donde la demanda global de SMR está en plena expansión. Es una noticia de largo plazo con potencial impacto sobre la imagen inversora del país.`,
    relevancia:"media",
  },
  {
    id:"n5", fecha:"18 MAR 2026", cat:"MACRO · ARGENTINA", catColor:"red", seccion:"Macro",
    titulo:"INDEC: el desempleo trepó al 7,5% en el cuarto trimestre de 2025",
    cuerpo:`El <strong>INDEC</strong> publicó los datos oficiales del mercado laboral correspondientes al <strong>cuarto trimestre de 2025</strong>: la tasa de desempleo ascendió al <strong>7,5%</strong>, marcando un deterioro respecto a trimestres anteriores.

El dato se da en un contexto de recuperación económica gradual, pero refleja que el mercado de trabajo aún no absorbe el impacto del ajuste macroeconómico. Históricamente, el empleo es el indicador que más demora en reaccionar ante una estabilización: primero mejoran los precios, luego la actividad, y por último el empleo.

<em>Dato vs. interpretación:</em> el 7,5% es un número elevado en términos históricos recientes para Argentina, aunque dentro de los rangos observados en procesos de estabilización previos. La velocidad de recuperación del empleo será uno de los indicadores políticos y económicos más seguidos durante 2026.`,
    relevancia:"alta",
  },
  {
    id:"n6", fecha:"18 MAR 2026", cat:"EMPRESAS · $CEPU", catColor:"green", seccion:"Empresas",
    titulo:"Central Puerto invertirá USD 40M en un mega aserradero en Corrientes bajo beneficios del RIGI provincial",
    cuerpo:`<strong>Central Puerto ($CEPU)</strong> anunció una inversión de <strong>USD 40 millones</strong> en un mega aserradero en la provincia de Corrientes, proyecto que comenzará a ejecutarse durante 2026 bajo los beneficios de la ley provincial 5470, que otorga <strong>seguridad jurídica y exenciones impositivas por 15 años</strong>.

El movimiento marca una diversificación significativa para la compañía, tradicionalmente asociada al negocio energético. La apuesta forestal en Corrientes se enmarca en el desarrollo productivo de una provincia con fuerte potencial maderero.

En paralelo, el gobernador de Corrientes aprovechó la oportunidad para reiterar su pedido de <strong>reducir el umbral mínimo de USD 200 millones del RIGI nacional</strong>, buscando que el régimen sea accesible para proyectos de menor escala, característicos de las economías regionales del interior del país.

<em>Dato vs. interpretación:</em> para $CEPU, es una señal de diversificación fuera del core energético. Para el debate político, refuerza la tensión entre un RIGI diseñado para megaproyectos y la necesidad de herramientas para inversiones medianas en el interior.`,
    relevancia:"media",
  },
];

/* ════════════════════════════════════════════════════════════════
   BCRA DATA — 20 MAR 2026
   Fuente: BCRA Informe Monetario / La Macro (último dato disponible)
════════════════════════════════════════════════════════════════ */
// BCRA key variable IDs (API v4)
const BCRA_VARS = { RESERVAS:1, TC_MIN:4, TC_MAY:5, BADLAR:6, TPM:7, TAMAR:27, BASE_MON:15 };

/* ════════════════════════════════════════════════════════════════
   UI PRIMITIVES
════════════════════════════════════════════════════════════════ */
function Badge({ c, sm, children, t }) {
  const M = t.badge[c] || t.badge.gray;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      background:M.bg, color:M.tx,
      fontSize:sm?9:11, fontWeight:700, fontFamily:FB,
      padding:sm?"2px 6px":"3px 9px", borderRadius:20, letterSpacing:".02em",
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function SectionLabel({ children, t }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
      <div style={{ width:3, height:20, background:t.go, borderRadius:2 }} />
      <span style={{ fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB }}>{children}</span>
    </div>
  );
}

function Card({ children, t, style={} }) {
  return (
    <div style={{
      background:t.srf, borderRadius:14, border:`1px solid ${t.brd}`,
      boxShadow:t.sh, overflow:"hidden", ...style,
    }}>{children}</div>
  );
}

// ── Loading skeleton ────────────────────────────────
function Skeleton({ w="100%", h=16, r=6, style={} }) {
  return <div className="skeleton" style={{ width:w, height:h, borderRadius:r, "--sk1":"rgba(128,128,128,.08)", "--sk2":"rgba(128,128,128,.18)", ...style }} />;
}

// ── "Actualizado hace X min" ────────────────────────
function LiveTimestamp({ ts, t }) {
  const [,setTick] = useState(0);
  useEffect(() => { const id = setInterval(()=>setTick(x=>x+1), 30000); return ()=>clearInterval(id); }, []);
  if (!ts) return null;
  const diff = Math.round((Date.now() - ts) / 60000);
  const label = diff < 1 ? "ahora" : diff < 60 ? `hace ${diff} min` : `hace ${Math.floor(diff/60)}h`;
  return <span style={{ fontFamily:FB, fontSize:9, color:t.fa, display:"inline-flex", alignItems:"center", gap:4 }}>
    <span style={{width:5,height:5,borderRadius:"50%",background:diff<5?"#22c55e":"#94a3b8",display:"inline-block"}} />
    Actualizado {label}
  </span>;
}

// ── Error Boundary ──────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  render() {
    if (this.state.hasError) {
      const t = this.props.t || {};
      return (
        <div style={{ padding:40, textAlign:"center", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
          <div style={{ fontSize:14, fontWeight:700, color:t.tx||"#333", marginBottom:8 }}>Error al cargar este panel</div>
          <div style={{ fontSize:12, color:t.mu||"#888", marginBottom:16 }}>{this.state.error?.message || "Error desconocido"}</div>
          <button onClick={()=>this.setState({hasError:false,error:null})} style={{
            padding:"8px 20px", borderRadius:8, border:"1px solid #ddd", background:"transparent",
            cursor:"pointer", fontSize:12, color:t.tx||"#333",
          }}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function StatRow({ label, value, badge, bc, t }) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"8px 0", borderBottom:`1px solid ${t.brd}`,
      fontFamily:FB,
    }}>
      <span style={{ fontSize:12, color:t.mu }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:13, fontWeight:600, color:t.tx }}>{value}</span>
        {badge && <Badge c={bc||"gray"} sm t={t}>{badge}</Badge>}
      </div>
    </div>
  );
}

function KpiChip({ item, t }) {
  return (
    <div style={{
      background:t.alt, border:`1px solid ${t.brd}`, borderRadius:10,
      padding:"10px 14px", fontFamily:FB, minWidth:120,
    }}>
      <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{item.k}</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
        <span style={{ fontSize:14, fontWeight:700, color:t.tx }}>{item.v}</span>
        <Badge c={item.bc} sm t={t}>{item.b}</Badge>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SUMMARY CARD
════════════════════════════════════════════════════════════════ */
function SummaryCard({ s, t }) {
  if (!s) return null;
  const alertColors = {
    blue:{bg:t.blBg, brd:t.blAcc, tx:t.bl},
    green:{bg:t.grBg, brd:t.grAcc, tx:t.gr},
    gold:{bg:t.goBg, brd:t.goAcc, tx:t.go},
    red:{bg:t.rdBg, brd:t.rdAcc, tx:t.rd},
  };
  const alC = alertColors[s.alert?.type] || alertColors.blue;

  return (
    <div className="fade-up">
      {/* Header banner */}
      <div style={{
        background:`linear-gradient(135deg, ${t.tx} 0%, #1F3560 100%)`,
        borderRadius:14, padding:"28px 28px 24px", marginBottom:20,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.03)" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", letterSpacing:".12em", textTransform:"uppercase", fontFamily:FB, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:FD, fontSize:44, fontWeight:700, color:"#FFFFFF", lineHeight:1, letterSpacing:"-.01em" }}>
              {s.date.split(" ")[0]} <span style={{ color:t.go }}>{s.date.split(" ").slice(1).join(" ")}</span>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,.08)", borderRadius:10, padding:"8px 16px", border:"1px solid rgba(255,255,255,.12)" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", fontFamily:FB, letterSpacing:".08em", textTransform:"uppercase", marginBottom:2 }}>CIERRE</div>
            <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:"rgba(255,255,255,.8)" }}>{s.date}</div>
          </div>
        </div>
        {/* KPIs */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:20 }}>
          {s.kpis.map((k,i) => (
            <div key={i} style={{
              background:"rgba(255,255,255,.07)", borderRadius:8, padding:"8px 12px",
              border:"1px solid rgba(255,255,255,.1)", fontFamily:FB,
            }}>
              <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:3 }}>{k.k}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#FFFFFF" }}>{k.v}</span>
                <Badge c={k.bc} sm t={t}>{k.b}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dato/Agenda banner */}
      {s.dato && (
        <div style={{ background:t.goBg, border:`1px solid ${t.goAcc}33`, borderRadius:10, padding:"12px 16px", marginBottom:16, fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.6 }}
          dangerouslySetInnerHTML={{ __html: s.dato }} />
      )}

      {/* Cards grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14, marginBottom:16 }}>
        {s.cards.map((c2, i) => (
          <Card key={i} t={t}>
            <div style={{ padding:"16px 16px 0", borderBottom:`3px solid ${c2.ac}` }}>
              <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", fontFamily:FB, marginBottom:4 }}>
                {c2.icon} {c2.cat}
              </div>
              <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:14, lineHeight:1.2 }}>{c2.title}</h3>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              {c2.rows?.map((r,j) => <StatRow key={j} label={r.l} value={r.v} badge={r.b} bc={r.b?r.b:undefined} t={t} />)}
              {c2.quote && (
                <div style={{ background:t.alt, borderRadius:8, padding:"10px 14px", margin:"10px 0", fontFamily:FH, fontSize:17, fontStyle:"italic", color:t.tx, lineHeight:1.5 }}>
                  {c2.quote}
                  <div style={{ fontSize:11, fontFamily:FB, fontStyle:"normal", color:t.mu, marginTop:6 }}>— {c2.quoteBy}</div>
                </div>
              )}
              {c2.note && <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7, marginTop:c2.rows?.length?12:4 }} dangerouslySetInnerHTML={{ __html:c2.note }} />}
            </div>
          </Card>
        ))}
      </div>

      {/* Internacional */}
      {s.intl && (
        <Card t={t} style={{ marginBottom:14 }}>
          <div style={{ padding:"16px 20px" }}>
            <SectionLabel t={t}>MERCADOS INTERNACIONALES</SectionLabel>

            {/* Indices + commodities grid */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              {s.intl.map((m,i) => (
                <div key={i} style={{
                  background:m.neg ? t.rdBg : t.grBg,
                  borderRadius:8, padding:"10px 14px", fontFamily:FB,
                  border:`1px solid ${m.neg ? t.rdAcc+"33" : t.grAcc+"33"}`,
                  minWidth:100,
                }}>
                  <div style={{ fontSize:9, color:t.mu, marginBottom:3, textTransform:"uppercase", letterSpacing:".06em" }}>{m.n}</div>
                  {m.v !== "—" && <div style={{ fontSize:13, fontWeight:700, color:t.tx, marginBottom:1 }}>{m.v}</div>}
                  <div style={{ fontSize:12, fontWeight:700, color:m.neg?t.rd:t.gr }}>{m.ch}</div>
                </div>
              ))}
            </div>

            {/* Acciones destacadas si existen */}
            {s.intlDestacados && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>MOVIMIENTOS DESTACADOS</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {s.intlDestacados.map((d,i) => (
                    <div key={i} style={{
                      background:t.alt, borderRadius:8, padding:"6px 12px",
                      display:"flex", alignItems:"center", gap:8, fontFamily:FB,
                    }}>
                      <span style={{ fontSize:12, fontWeight:700, color:t.tx, fontFamily:"monospace" }}>{d.t}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:d.neg?t.rd:t.gr }}>{d.ch}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {s.intlNote && <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html:s.intlNote }} />}
          </div>
        </Card>
      )}

      {/* Alert */}
      {s.alert && (
        <div style={{
          background:alC.bg, border:`1px solid ${alC.brd}44`,
          borderRadius:10, padding:"12px 18px",
          fontFamily:FB, fontSize:13, color:alC.tx, lineHeight:1.6,
        }} dangerouslySetInnerHTML={{ __html:s.alert.text }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EARNINGS CARD
════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   SENTIMENT PANEL — Curated market-implied indicators
   Tracked elections + scored macro/geopolitical events
════════════════════════════════════════════════════════════════ */
function PolymarketPanel({ t }) {
  const [tracked, setTracked] = useState([]);
  const [argTracked, setArgTracked] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [status, setStatus] = useState("loading");
  const [tab, setTab] = useState("todos");
  const [argNote, setArgNote] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/polymarket");
        const d = await r.json();
        setTracked(d.tracked || []);
        setArgTracked(d.argTracked || []);
        setIndicators(d.indicators || []);
        setArgNote(d.argNote || "");
        setStatus("ok");
      } catch { setStatus("error"); }
    };
    load();
  }, []);

  const catTabs = [
    { id:"todos",       label:"Todos" },
    { id:"macro",       label:"Macro" },
    { id:"geopolitics", label:"Geopolítica" },
    { id:"markets",     label:"Mercados" },
  ];

  const filteredInd = tab === "todos" ? indicators : indicators.filter(e => e.category === tab);

  // Group tracked events by their parent event
  const trackedGroups = {};
  tracked.forEach(t => {
    const g = t.group || t.title;
    if (!trackedGroups[g]) trackedGroups[g] = { title:g, markets:[], slug:t.slug };
    trackedGroups[g].markets.push(t);
  });

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div>
            <h3 style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:t.tx, margin:0 }}>Indicadores de Sentimiento</h3>
            <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>
              Probabilidades implícitas de mercado · Indicadores macro, geopolíticos y electorales
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{
              width:8, height:8, borderRadius:"50%", display:"inline-block",
              background: status==="ok" ? "#22c55e" : status==="error" ? "#ef4444" : "#f59e0b",
              boxShadow: status==="ok" ? "0 0 6px #22c55e" : "none",
              animation: status==="loading" ? "blink 1s infinite" : "none",
            }} />
            <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color: status==="ok" ? t.gr : status==="error" ? t.rd : t.mu }}>
              {status==="ok" ? "API EN VIVO" : status==="error" ? "API OFFLINE" : "CONECTANDO..."}
            </span>
            {status==="ok" && <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>· {tracked.length + argTracked.length + indicators.length} indicadores</span>}
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {status === "loading" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <Skeleton w="100%" h={120} r={12} />
          <Skeleton w="100%" h={120} r={12} />
          {Array.from({length:5}).map((_,i) => <Skeleton key={i} w="100%" h={40} r={6} />)}
        </div>
      )}

      {status === "error" && (
        <div style={{ padding:30, textAlign:"center", fontFamily:FB, fontSize:12, color:t.mu, background:t.alt, borderRadius:10 }}>
          ⚠️ Sin conexión al proveedor de datos ·{" "}
          <button onClick={()=>window.location.reload()} style={{color:t.bl,background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontSize:12,fontWeight:600}}>Reintentar</button>
        </div>
      )}

      {status === "ok" && (
        <>
          {/* ══════ SECTION 2: Argentina ══════ */}
          {argTracked.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:14 }}>🇦🇷</span>
                <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.go, letterSpacing:".1em", textTransform:"uppercase" }}>
                  ARGENTINA · MERCADOS DE PREDICCIÓN
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
                {argTracked.map((m, i) => {
                  const isMulti = m.outcomes && m.outcomes.length > 2;
                  const isYesNo = m.outcomes && m.outcomes.length === 2;
                  return (
                    <Card key={i} t={t} style={{ borderLeft:`3px solid ${t.go}` }}>
                      <div style={{ padding:"14px 16px" }}>
                        <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx, marginBottom:10, lineHeight:1.3 }}>
                          {m.group || m.title}
                        </div>

                        {isYesNo && (() => {
                          const yes = m.outcomes.find(o => o.label === "Yes" || o.label === "Sí");
                          const pct = Math.round((yes || m.outcomes[0]).prob * 100);
                          const col = pct >= 65 ? t.gr : pct <= 35 ? t.rd : t.bl;
                          return (
                            <div>
                              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:FB, fontSize:10, color:t.mu, marginBottom:5 }}>
                                <span>{(yes || m.outcomes[0]).label === "Yes" ? "Probabilidad Sí" : m.outcomes[0].label}</span>
                                <span style={{ fontWeight:700, color:col }}>{pct}%</span>
                              </div>
                              <div style={{ height:18, background:t.alt, borderRadius:5, overflow:"hidden" }}>
                                <div style={{ width:`${pct}%`, height:"100%",
                                  background:`linear-gradient(90deg,${col}88,${col})`,
                                  borderRadius:5, transition:"width .6s cubic-bezier(.4,0,.2,1)" }} />
                              </div>
                              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:FB, fontSize:9, color:t.fa, marginTop:5 }}>
                                <span>No: {100-pct}%</span>
                                <span>Vol: ${m.volume >= 1e6 ? (m.volume/1e6).toFixed(1)+"M" : m.volume >= 1000 ? (m.volume/1000).toFixed(0)+"K" : Math.round(m.volume)}</span>
                              </div>
                            </div>
                          );
                        })()}

                        {isMulti && (
                          <div>
                            {m.outcomes.filter(o => o.prob >= 0.03).sort((a,b) => b.prob-a.prob).map((o, oi) => {
                              const pct = Math.round(o.prob * 100);
                              const colors = [t.bl, t.go, t.gr, t.pu, t.rd];
                              const col = colors[oi % colors.length];
                              return (
                                <div key={oi} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                                  <span style={{ fontFamily:FB, fontSize:10, color:t.mu, minWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.label}</span>
                                  <div style={{ flex:1, height:12, background:t.alt, borderRadius:4, overflow:"hidden" }}>
                                    <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:4, transition:"width .6s" }} />
                                  </div>
                                  <span style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:col, minWidth:35, textAlign:"right" }}>{pct}%</span>
                                </div>
                              );
                            })}
                            <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:4 }}>
                              Vol: ${m.volume >= 1e6 ? (m.volume/1e6).toFixed(1)+"M" : m.volume >= 1000 ? (m.volume/1000).toFixed(0)+"K" : Math.round(m.volume)}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              {argNote && (
                <div style={{ marginTop:8, padding:"8px 12px", background:t.alt, borderRadius:7, fontFamily:FB, fontSize:9, color:t.fa, borderLeft:`2px solid ${t.go}44` }}>
                  ⚖️ {argNote}
                </div>
              )}
            </div>
          )}

          {/* ══════ SECTION 3: Tracked Elections ══════ */}
          {Object.keys(trackedGroups).length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
                ELECCIONES MONITOREADAS
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:10 }}>
                {Object.values(trackedGroups).map((grp,gi) => (
                  <Card key={gi} t={t}>
                    <div style={{ padding:"16px 18px" }}>
                      <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, marginBottom:12, lineHeight:1.3 }}>
                        {grp.title}
                      </div>
                      {grp.markets.map((m,mi) => {
                        // For multi-outcome: show each outcome as a bar
                        const mainOutcome = m.outcomes && m.outcomes[0];
                        if (!mainOutcome) return null;
                        // If it's a simple Yes/No
                        if (m.outcomes.length === 2 && (m.outcomes[0].label === "Yes" || m.outcomes[0].label === "No")) {
                          const pct = Math.round(m.outcomes[0].prob * 100);
                          const col = pct >= 60 ? t.gr : pct <= 40 ? t.rd : t.bl;
                          return (
                            <div key={mi} style={{ marginBottom:8 }}>
                              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                {m.title.replace(/^Will /i,"").replace(/\?$/,"")}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <div style={{ flex:1, height:20, background:t.alt, borderRadius:5, overflow:"hidden" }}>
                                  <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${col}88,${col})`, borderRadius:5, transition:"width .6s cubic-bezier(.4,0,.2,1)" }} />
                                </div>
                                <span style={{ fontFamily:FH, fontSize:16, fontWeight:800, color:col, minWidth:42, textAlign:"right" }}>{pct}%</span>
                              </div>
                            </div>
                          );
                        }
                        // Multi-outcome (like Brazil election with candidates)
                        return m.outcomes.map((o,oi) => {
                          const pct = Math.round(o.prob * 100);
                          if (pct < 3) return null; // skip tiny outcomes
                          const col = oi === 0 ? t.bl : oi === 1 ? t.rd : oi === 2 ? t.gr : t.pu;
                          return (
                            <div key={`${mi}-${oi}`} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                              <span style={{ fontFamily:FB, fontSize:10, color:t.mu, minWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.label}</span>
                              <div style={{ flex:1, height:14, background:t.alt, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:4, transition:"width .6s cubic-bezier(.4,0,.2,1)" }} />
                              </div>
                              <span style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:col, minWidth:35, textAlign:"right" }}>{pct}%</span>
                            </div>
                          );
                        });
                      })}
                      <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:6 }}>
                        Vol: ${grp.markets.reduce((s,m)=>s+m.volume,0) >= 1e6 ? (grp.markets.reduce((s,m)=>s+m.volume,0)/1e6).toFixed(1)+"M" : Math.round(grp.markets.reduce((s,m)=>s+m.volume,0)/1000)+"K"}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ══════ SECTION 4: Curated Indicators ══════ */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
            INDICADORES MACRO Y GEOPOLÍTICOS
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, marginBottom:12, borderBottom:`1px solid ${t.brd}`, paddingBottom:8 }}>
            {catTabs.map(ct => {
              const count = ct.id === "todos" ? indicators.length : indicators.filter(e=>e.category===ct.id).length;
              return (
                <button key={ct.id} onClick={()=>setTab(ct.id)} style={{
                  padding:"5px 12px", borderRadius:6, fontFamily:FB, fontSize:11,
                  fontWeight:tab===ct.id?700:400, border:"none",
                  background:tab===ct.id?t.go+"18":"transparent",
                  color:tab===ct.id?t.go:t.mu, cursor:"pointer",
                }}>
                  {ct.label} <span style={{fontSize:9,opacity:.6}}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          {filteredInd.length > 0 ? (
            <div style={{ border:`1px solid ${t.brd}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{
                display:"grid", gridTemplateColumns:"55px 1fr 60px 65px",
                padding:"8px 14px", background:t.alt, borderBottom:`1px solid ${t.brd}`,
                fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".08em", textTransform:"uppercase",
              }}>
                <span>PROB.</span>
                <span>INDICADOR</span>
                <span style={{textAlign:"right"}}>SCORE</span>
                <span style={{textAlign:"right"}}>VOLUMEN</span>
              </div>

              {filteredInd.map((e,i) => {
                const pct = Math.round(e.probability * 100);
                const col = pct >= 65 ? t.gr : pct <= 35 ? t.rd : t.bl;
                const catLabel = e.category === "macro" ? "MACRO" : e.category === "geopolitics" ? "GEO" : "MKT";
                const catCol = e.category === "macro" ? "#f59e0b" : e.category === "geopolitics" ? "#8b5cf6" : "#3b82f6";
                const vol = e.volume >= 1e6 ? `$${(e.volume/1e6).toFixed(1)}M` : e.volume >= 1000 ? `$${(e.volume/1000).toFixed(0)}K` : `$${Math.round(e.volume)}`;

                return (
                  <div key={i} style={{
                    display:"grid", gridTemplateColumns:"55px 1fr 60px 65px", alignItems:"center",
                    padding:"10px 14px", borderBottom:i < filteredInd.length - 1 ? `1px solid ${t.brd}` : "none",
                    transition:"background .15s",
                  }}
                  onMouseEnter={ev=>ev.currentTarget.style.background=t.alt}
                  onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                    <span style={{ fontFamily:FH, fontSize:18, fontWeight:800, color:col }}>{pct}%</span>
                    <div style={{ paddingRight:12, minWidth:0 }}>
                      <div style={{ fontFamily:FB, fontSize:12, fontWeight:600, color:t.tx, lineHeight:1.3,
                        overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {e.title}
                      </div>
                      <div style={{ display:"flex", gap:4, marginTop:3, alignItems:"center" }}>
                        <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, padding:"1px 5px", borderRadius:3, color:catCol, background:catCol+"15" }}>{catLabel}</span>
                        {e.isArg && <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:"#3b82f6", background:"#3b82f612", padding:"1px 5px", borderRadius:3 }}>ARG</span>}
                        <div style={{ width:32, height:4, background:t.alt, borderRadius:2, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:2, transition:"width .6s cubic-bezier(.4,0,.2,1)" }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:e.score>=12?t.gr:e.score>=10?t.bl:t.mu }}>{e.score}</span>
                      <span style={{ fontFamily:FB, fontSize:8, color:t.fa }}>/15</span>
                    </div>
                    <div style={{ textAlign:"right", fontFamily:FB, fontSize:10, color:t.mu }}>{vol}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding:20, textAlign:"center", fontFamily:FB, fontSize:12, color:t.mu, background:t.alt, borderRadius:10 }}>
              Sin indicadores en esta categoría.
            </div>
          )}
        </>
      )}

      {/* ── Disclaimer ── */}
      <div style={{ marginTop:14, padding:"10px 14px", background:t.alt, borderRadius:8, borderLeft:`3px solid ${t.brd}` }}>
        <p style={{ fontFamily:FB, fontSize:10, color:t.fa, lineHeight:1.6, margin:0 }}>
          Este panel muestra indicadores probabilísticos basados en datos públicos. Las probabilidades implícitas reflejan el consenso agregado de participantes y no constituyen pronósticos, recomendaciones ni asesoramiento. Este panel no facilita ni promueve apuestas de ningún tipo.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   INFORMES VIEW — Balances · Informes de empresas
════════════════════════════════════════════════════════════════ */
function InformesView({ t, initialSub="resumen", onSubChange }) {
  const [sub, setSub] = useState(initialSub);
  const [selS, setSelS] = useState(0);

  // Sync with external sub changes (from Inicio → goResearch)
  useEffect(() => { setSub(initialSub); }, [initialSub]);

  const handleSub = (id) => { setSub(id); onSubChange?.(id); };

  const SUBTABS = [
    { id:"resumen",   label:"Resumen Diario", Icon:ClipboardList },
    { id:"balances",  label:"Balances",        Icon:BarChart3 },
    { id:"informes",  label:"Informes",        Icon:FileText },
    { id:"polymarket", label:"Sentimiento",    Icon:Activity },
    { id:"recos",     label:"Recomendaciones", Icon:Briefcase },
  ];

  return (
    <div className="fade-up">
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {SUBTABS.map(s => (
          <button key={s.id} onClick={()=>handleSub(s.id)} style={{
            padding:"9px 22px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s",
            border:`2px solid ${sub===s.id?t.go:t.brd}`,
            background:sub===s.id?t.go+"18":"transparent",
            color:sub===s.id?t.go:t.mu,
            display:"flex", alignItems:"center", gap:6,
          }}>{s.Icon && <s.Icon size={14} />} {s.label}</button>
        ))}
      </div>

      {/* ── RESUMEN DIARIO ── */}
      {sub === "resumen" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            {SUMMARIES.map((s,i) => (
              <button key={s.id} onClick={()=>setSelS(i)} style={{
                padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:500,
                cursor:"pointer", transition:"all .2s",
                border:`2px solid ${selS===i?t.tx:t.brd}`,
                background:selS===i?t.tx:"transparent",
                color:selS===i?"#fff":t.mu,
              }}>
                {i===0 && <CircleDot size={10} style={{marginRight:4,verticalAlign:"middle",color:"#ef4444"}} />}{s.date}
                {i===0&&<span style={{ marginLeft:6, fontSize:9, background:t.rd, color:"#fff", padding:"1px 5px", borderRadius:8 }}>ÚLTIMO</span>}
              </button>
            ))}
          </div>
          <SummaryCard s={SUMMARIES[selS]} t={t} />
        </div>
      )}

      {/* ── BALANCES ── */}
      {sub === "balances" && (
        <div>
          {/* Earnings Calendar — semana 6-10 ABR 2026 */}
          <Card t={t} style={{ marginBottom:20, borderLeft:`4px solid ${t.go}` }}>
            <div style={{ padding:"20px 22px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:t.goBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <ClipboardList size={18} color={t.go} />
                  </div>
                  <div>
                    <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>Earnings de la semana</div>
                    <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>6 — 10 ABR 2026 · Empresas que reportan resultados</div>
                  </div>
                </div>
                <div style={{ background:t.rdBg, border:`1px solid ${t.rdAcc}33`, borderRadius:8, padding:"5px 12px", fontFamily:FB, fontSize:10, fontWeight:700, color:t.rd, display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:t.rd, display:"inline-block", animation:"blink 1s infinite" }}/>
                  TEMPORADA INICIO Q1 2026
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8, marginBottom:16 }}>
                {[
                  { dia:"Lun 6", empresas:[
                    {t:"—",n:"Sin reportes relevantes",nota:"Mercados de apertura"},
                  ]},
                  { dia:"Mar 7", empresas:[
                    {t:"PLAY",n:"Dave & Buster's",nota:"Entretenimiento · After hours"},
                  ]},
                  { dia:"Mié 8", empresas:[
                    {t:"DAL",n:"Delta Air Lines",nota:"Aerolíneas · Pre-market · EPS est. $0.62",destacado:true},
                    {t:"STZ",n:"Constellation Brands",nota:"Consumo/Bebidas · Pre-market · EPS est. $1.72",destacado:true},
                    {t:"RPM",n:"RPM International",nota:"Materiales/Pintura · Pre-market · EPS est. $0.37"},
                    {t:"APLD",n:"Applied Digital",nota:"Data centers / IA · After hours"},
                  ]},
                  { dia:"Jue 9", empresas:[
                    {t:"PSMT",n:"PriceSmart",nota:"Retail · After hours"},
                  ]},
                  { dia:"Vie 10", empresas:[
                    {t:"—",n:"Mercados cerrados",nota:"Viernes Santo · NYSE/NASDAQ cierran"},
                  ]},
                ].map((d,di) => (
                  <div key={di} style={{ background:t.alt, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.go, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{d.dia}</div>
                    {d.empresas.map((e,ei) => (
                      <div key={ei} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:ei<d.empresas.length-1?6:0 }}>
                        {e.t !== "—" && (
                          <span style={{
                            fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
                            background:e.destacado?t.go+"22":t.srf, color:e.destacado?t.go:t.tx,
                            border:`1px solid ${e.destacado?t.go+"44":t.brd}`,
                          }}>{e.t}</span>
                        )}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:FB, fontSize:11, fontWeight:e.t!=="—"?600:400, color:e.t!=="—"?t.tx:t.fa, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.n}</div>
                          <div style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{e.nota}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Preview próxima semana — bancos Q1 */}
              <div style={{ background:`linear-gradient(135deg, ${t.blBg}, ${t.goBg})`, border:`1px solid ${t.bl}33`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.bl, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>
                  📅 PRÓXIMA SEMANA · 14 ABR — INICIO TEMPORADA BANCOS
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[
                    {t:"JPM",n:"JPMorgan Chase",nota:"Pre-market · EPS est. $5.40",acento:"blue"},
                    {t:"WFC",n:"Wells Fargo",nota:"Pre-market · Q1 2026",acento:"blue"},
                    {t:"BLK",n:"BlackRock",nota:"Pre-market · AUM récord $12.5T",acento:"gold"},
                    {t:"MS",n:"Morgan Stanley",nota:"Pre-market",acento:"blue"},
                    {t:"BAC",n:"Bank of America",nota:"A confirmar",acento:"blue"},
                    {t:"C",n:"Citigroup",nota:"A confirmar",acento:"blue"},
                  ].map((b,i) => (
                    <div key={i} style={{ background:t.srf, borderRadius:8, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, border:`1px solid ${t.brd}` }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:b.acento==="gold"?t.go:t.bl }}>{b.t}</span>
                      <div>
                        <div style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.tx }}>{b.n}</div>
                        <div style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{b.nota}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:10, lineHeight:1.5 }}>
                  El <strong>14 ABR</strong> es el día clave de la temporada: JPM y WFC marcan el tono para el sector financiero y el mercado global. El Q1 2026 será el primer termómetro del impacto del contexto geopolítico sobre la banca estadounidense.
                </p>
              </div>

              <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12 }}>
                Destacados en dorado = mayor relevancia. Viernes 10 ABR: NYSE/NASDAQ cerrados (Viernes Santo). Fuente: Yahoo Finance / Benzinga / Earnings Whispers.
              </p>
            </div>
          </Card>

          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:16, lineHeight:1.6 }}>
            Resultados trimestrales con análisis de ingresos, rentabilidad y guidance. Reportados por Máximo Ricciardi.
          </p>
          <EarningsCard t={t} />
        </div>
      )}

      {/* ── INFORMES ── */}
      {sub === "informes" && (
        <div>
          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:20, lineHeight:1.6 }}>
            Análisis fundamental de empresas y contexto de mercado. Research Desk · The Big Long.
          </p>

          {/* ── Informes de contexto (3 reports del NOTICIAS array) ── */}
          {NOTICIAS.filter(n => n.seccion === "Informes").map((n, ni) => {
            const acColors = { blue:t.bl, red:t.rd, gold:t.go, green:t.gr, purple:t.pu };
            const ac = acColors[n.catColor] || t.go;
            return (
              <div key={n.id} style={{
                background:t.srf, border:`1px solid ${t.brd}`, borderLeft:`4px solid ${ac}`,
                borderRadius:14, marginBottom:16, overflow:"hidden",
              }}>
                <div style={{ padding:"20px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase",
                      letterSpacing:".08em", color:ac, background:ac+"18", padding:"3px 10px", borderRadius:20 }}>{n.cat}</span>
                    <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{n.fecha}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:t.rd, background:t.rdBg,
                      padding:"2px 7px", borderRadius:20, display:"flex", alignItems:"center", gap:2 }}>
                      🔴 ALTA RELEVANCIA
                    </span>
                  </div>
                  <h2 style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.tx, marginBottom:16, lineHeight:1.3 }}>{n.titulo}</h2>
                  <div style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.85 }}
                    dangerouslySetInnerHTML={{ __html: n.cuerpo }} />
                </div>
              </div>
            );
          })}

          {/* ── Informe empresa: VIST ── */}
          <VISTInformeCard t={t} />
        </div>
      )}

      {/* ── POLYMARKET ── */}
      {sub === "polymarket" && <PolymarketPanel t={t} />}

      {sub === "recos" && <RecomendacionesView t={t} />}
    </div>
  );
}

/* ── Informe VIST ─────────────────────────────────────────────── */
function VISTInformeCard({ t }) {
  return (
    <div className="fade-up">
      <Card t={t} style={{ borderLeft:`4px solid ${t.gr}` }}>
        <div style={{ padding:"24px 26px" }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:12,
                background:"linear-gradient(135deg,#1a3a1a,#2d6a2d)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#4ade80", fontFamily:FB, fontWeight:900, fontSize:14 }}>VIST</span>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontFamily:FH, fontSize:24, fontWeight:800, color:t.tx }}>Vista Energy</span>
                  <Badge c="green" sm t={t}>🔬 ANÁLISIS FUNDAMENTAL</Badge>
                </div>
                <span style={{ fontFamily:FB, fontSize:12, color:t.mu }}>
                  E&P Shale · NYSE: VIST · Vaca Muerta · Earnings: 21 ABR 2026
                </span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FH, fontSize:34, fontWeight:800, color:t.tx, lineHeight:1 }}>$73.60</div>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>
                NYSE · 20 MAR 2026 · <span style={{color:t.gr,fontWeight:700}}>Score #1 universo 🔥</span>
              </div>
            </div>
          </div>

          {/* Tesis */}
          <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
              📌 Tesis de inversión
            </div>
            <p style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.75, margin:0 }}>
              Vista Energy es el <strong>pure-play más eficiente de Vaca Muerta</strong>. Con operación casi 100% shale, márgenes EBITDA superiores al 60% y producción creciendo a doble dígito, cotiza a un <strong>Fwd P/E de ~9x</strong> — descuento flagrante frente a pares que operan a 12–15x. El próximo catalizador es el <strong>earnings del 21 ABR 2026</strong>, con potencial de revisión de targets al alza.
            </p>
          </div>

          {/* Métricas clave */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10, marginBottom:20 }}>
            {[
              { l:"Fwd P/E",       v:"9.19x",    note:"Descuento vs peers ~12-15x", c:t.gr },
              { l:"EBITDA (TTM)",  v:"$1.877B",  note:"Margen EBITDA ~63,7%",       c:t.bl },
              { l:"Revenue (TTM)", v:"$2.474B",  note:"+25% YoY estimado",          c:t.bl },
              { l:"ROE (TTM)",     v:"34,99%",   note:"Retorno sobre equity",        c:t.gr },
              { l:"Margen Neto",   v:"29,2%",    note:"Alta calidad de resultados",  c:t.gr },
              { l:"Score RD",      v:"91.48",    note:"#1 universo Research Desk",   c:t.go },
            ].map((m,i) => (
              <div key={i} style={{ background:t.alt, borderRadius:10, padding:"13px 15px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{m.l}</div>
                <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:m.c, lineHeight:1 }}>{m.v}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:4, lineHeight:1.4 }}>{m.note}</div>
              </div>
            ))}
          </div>

          {/* Fortalezas / Riesgos */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
            <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>✅ Fortalezas</div>
              {[
                "Vaca Muerta — segundo play shale más grande fuera de EE.UU.",
                "Producción shale oil >70Kboe/d creciendo a ~15% CAGR.",
                "EBITDA margin >60% — estructura de costos entre las más bajas del sector.",
                "Contratos de exportación en USD — cobertura natural cambiaria.",
                "Management track-record impecable (Galuccio, ex-CEO YPF).",
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                  <span style={{ color:t.gr, fontWeight:700, flexShrink:0 }}>·</span>
                  <span style={{ fontFamily:FB, fontSize:11, color:t.tx, lineHeight:1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background:t.rdBg, border:`1px solid ${t.rd}22`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.rd, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>⚠️ Riesgos</div>
              {[
                "Precio del petróleo: caída bajo $65–70 presionaría márgenes.",
                "Riesgo regulatorio argentino: retenciones a exportaciones de crudo.",
                "Deuda neta elevada (D/E 117%) — expansión CAPEX en curso.",
                "Liquidez: ADR con menor volumen vs pares globales.",
                "Ejecución: integración La Amarga Chica debe mostrar sinergias.",
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                  <span style={{ color:t.rd, fontWeight:700, flexShrink:0 }}>·</span>
                  <span style={{ fontFamily:FB, fontSize:11, color:t.tx, lineHeight:1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Targets analistas */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            <span style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Targets:</span>
            {[
              { bank:"Goldman Sachs", target:"$66.90", date:"4 MAR 2026" },
              { bank:"Jefferies",     target:"BUY",    date:"26 FEB 2026" },
              { bank:"HSBC",          target:"BUY",    date:"18 MAR 2026" },
              { bank:"Research Desk", target:"$77.45", date:"20 MAR 2026" },
            ].map((a,i) => (
              <span key={i} style={{ background:t.alt, border:`1px solid ${t.brd}`, borderRadius:8, padding:"4px 12px", fontFamily:FB, fontSize:11 }}>
                <strong style={{ color:t.tx }}>{a.bank}</strong>
                <span style={{ color:t.gr, marginLeft:6, fontWeight:700 }}>{a.target}</span>
                <span style={{ color:t.fa, marginLeft:4 }}>· {a.date}</span>
              </span>
            ))}
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, margin:0, lineHeight:1.5 }}>
            * Análisis orientativo. No constituye recomendación de inversión. Consultar asesor antes de operar. · Máximo Ricciardi
          </p>
        </div>
      </Card>
    </div>
  );
}

function EarningsCard({ t }) {
  const m = MICRON;
  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom:16 }}>
        <div style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:12, background:t.tx, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.go, fontFamily:FB, fontWeight:800, fontSize:16 }}>{m.ticker}</span>
              </div>
              <div>
                <h2 style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:t.tx, marginBottom:4 }}>{m.nombre}</h2>
                <div style={{ display:"flex", gap:6 }}>
                  <Badge c="gray" sm t={t}>${m.ticker}</Badge>
                  <Badge c="blue" sm t={t}>{m.exchange}</Badge>
                </div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".08em", textTransform:"uppercase" }}>{m.periodo} · EARNINGS</div>
              <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:t.mu, marginTop:2 }}>Reported {m.reportado}</div>
            </div>
          </div>

          {/* Headline beat */}
          <div style={{ background:t.grBg, border:`1px solid ${t.grAcc}44`, borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:t.gr, flexShrink:0 }} />
              <div>
                <div style={{ fontFamily:FB, fontWeight:700, fontSize:15, color:t.gr }}>{m.headline}</div>
                <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginTop:2 }}>{m.headlineSub}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {m.beats.map((b,i) => (
                <div key={i} style={{ background:t.grAcc+"22", border:`1px solid ${t.grAcc}55`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                  <div style={{ fontFamily:FB, fontWeight:800, fontSize:14, color:t.gr }}>{b.label}</div>
                  <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".06em" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Q2 Results */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card t={t}>
          <div style={{ padding:"18px 20px" }}>
            <SectionLabel t={t}>INGRESOS (REVENUE)</SectionLabel>
            {m.resultados.map((r,i) => <StatRow key={i} label={r.label} value={r.valor} badge={r.badge} bc={r.bc} t={t} />)}
          </div>
        </Card>
        <Card t={t}>
          <div style={{ padding:"18px 20px" }}>
            <SectionLabel t={t}>RENTABILIDAD</SectionLabel>
            {m.rentabilidad.map((r,i) => <StatRow key={i} label={r.label} value={r.valor} badge={r.badge} bc={r.bc} t={t} />)}
          </div>
        </Card>
      </div>

      {/* Guidance Q3 */}
      <Card t={t} style={{ marginBottom:14 }}>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:9, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
            GUIDANCE Q3 — EL DATO QUE MUEVE EL MERCADO
          </div>
          <div style={{ background:t.blBg, border:`1px solid ${t.blAcc}33`, borderRadius:12, padding:"18px 20px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.bl, letterSpacing:".08em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
              🚀 PROYECCIÓN Q3 FY2025 — GUIDANCE VS. CONSENSO
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
              {m.guidance.map((g,i) => (
                <div key={i} style={{ background:t.srf, borderRadius:10, padding:"14px 16px", border:`1px solid ${t.brd}` }}>
                  <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", fontFamily:FB, marginBottom:6 }}>{g.label}</div>
                  <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.tx, lineHeight:1 }}>{g.valor}</div>
                  <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{g.est}</div>
                  {g.beat && <div style={{ marginTop:6 }}><Badge c="green" sm t={t}>▲ {g.beat}</Badge></div>}
                  {g.isBar && (
                    <div style={{ marginTop:8, height:6, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                      <div style={{ width:"81%", height:"100%", background:t.gr, borderRadius:3 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Análisis */}
      <Card t={t}>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:9, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
            PROYECCIÓN & CONTEXTO
          </div>
          <div style={{ background:t.alt, borderRadius:10, padding:"18px 20px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.go, textTransform:"uppercase", letterSpacing:".08em", fontFamily:FB, marginBottom:12 }}>
              ✨ ¿QUÉ IMPLICA ESTE RESULTADO?
            </div>
            <p style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.85 }} dangerouslySetInnerHTML={{ __html: m.analisis }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EQUITY SCREENER DATA  —  19 MAR 2026 · CIERRE NYC
   ARG ADRs: Google Finance (PAM/GGAL pages) live 19 MAR 2026
   US Mega-cap: Robinhood / TradingView / MacroTrends 19 MAR 2026
   NVDA $180.25 · AAPL $249.94 · VIST $57.00 · MELI $2,079
   Scores/Research: Research Desk (19 MAR 2026)
════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   TRADINGVIEW URL HELPERS
════════════════════════════════════════════════════════════════ */
const TV_NASDAQ = new Set(["NVDA","AMD","AAPL","MSFT","AMZN","META","GOOGL","TSLA","NFLX","ADBE","ORCL","INTC","AVGO","QCOM","ARM","ASML","COST","COIN","MSTR","PLTR","MELI","NIO","NBIS"]);
const TV_AMEX   = new Set(["SPY","QQQ","XLE","XLF","XLK","XLV","GLD","SLV","EWZ","SMH"]);
function tvUrl(ticker) {
  if (ticker === "MERV")      return "https://www.tradingview.com/chart/?symbol=BYMA:MERV";
  if (TV_AMEX.has(ticker))   return `https://www.tradingview.com/chart/?symbol=AMEX:${ticker}`;
  if (TV_NASDAQ.has(ticker)) return `https://www.tradingview.com/chart/?symbol=NASDAQ:${ticker}`;
  return `https://www.tradingview.com/chart/?symbol=NYSE:${ticker}`;
}
function tvBondUrl(ticker) { return `https://www.tradingview.com/chart/?symbol=BYMA:${ticker}`; }

/* ════════════════════════════════════════════════════════════════
   ONs — OBLIGACIONES NEGOCIABLES · DATA912 tickers
   88 ONs: 54 Ley Argentina + 34 Ley Nueva York
   Datos: Precio, TIR, Cupón, Duration, Calificación, Vto, Frecuencia
════════════════════════════════════════════════════════════════ */
const ONS_ARG_DATA = [
  {t:"YMCVD",em:"YPF",p:102.5,tir:-5.83,cup:6.0,vto:"26/05/2026",dur:0.17,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:63},
  {t:"NBS1D",em:"Balanz",p:100.5,tir:5.97,cup:5.0,vto:"06/06/2026",dur:0.2,freq:"Cuatrimestral",tipo:"Bullet",cal:"A",proxCpn:72},
  {t:"RC2CD",em:"Arcor",p:104.5,tir:2.62,cup:5.9,vto:"06/10/2026",dur:0.52,freq:"Semestral",tipo:"Bullet",cal:"A1+",proxCpn:11},
  {t:"DNC3D",em:"Edenor",p:105.4,tir:6.58,cup:9.75,vto:"22/11/2026",dur:0.64,freq:"Semestral",tipo:"Bullet",cal:"A",proxCpn:57},
  {t:"YM41D",em:"YPF",p:103.0,tir:3.83,cup:6.0,vto:"08/01/2027",dur:0.77,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:13},
  {t:"ZZC1D",em:"Camuzzi",p:102.75,tir:5.72,cup:7.95,vto:"21/02/2027",dur:0.9,freq:"Semestral",tipo:"Bullet",cal:"AA-",proxCpn:148},
  {t:"IRCJD",em:"IRSA",p:103.0,tir:4.28,cup:7.0,vto:"28/02/2027",dur:0.92,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:155},
  {t:"LMS8D",em:"Aluar",p:102.6,tir:2.23,cup:6.25,vto:"21/03/2027",dur:0.61,freq:"Trimestral",tipo:"Sinkable",cal:"AAA",proxCpn:87},
  {t:"VSCWD",em:"Vista Energy",p:102.55,tir:4.73,cup:6.0,vto:"15/04/2027",dur:1.03,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:20},
  {t:"PN42D",em:"Pan American Energy",p:104.35,tir:4.38,cup:6.0,vto:"17/04/2027",dur:1.03,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:22},
  {t:"OTS2D",em:"Oil Tanking",p:102.7,tir:5.66,cup:7.0,vto:"24/04/2027",dur:1.05,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:29},
  {t:"YM37D",em:"YPF",p:104.25,tir:3.98,cup:7.0,vto:"07/05/2027",dur:1.07,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:42},
  {t:"RCCRD",em:"Arcor",p:105.25,tir:4.29,cup:6.75,vto:"09/05/2027",dur:1.09,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:44},
  {t:"CIC9D",em:"CNH Industrial",p:105.0,tir:6.37,cup:8.25,vto:"21/05/2027",dur:1.11,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:56},
  {t:"HJCID",em:"John Deere",p:104.3,tir:5.93,cup:7.5,vto:"27/05/2027",dur:1.11,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:62},
  {t:"MCC2D",em:"PECOM",p:102.65,tir:7.36,cup:7.5,vto:"02/06/2027",dur:1.14,freq:"Semestral",tipo:"Bullet",cal:"AA-",proxCpn:68},
  {t:"PFC2D",em:"Profertil",p:104.2,tir:5.08,cup:7.25,vto:"14/07/2027",dur:1.26,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:110},
  {t:"YM38D",em:"YPF",p:105.0,tir:4.69,cup:7.5,vto:"22/07/2027",dur:1.25,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:27},
  {t:"MIC4D",em:"Mirgor",p:101.0,tir:8.75,cup:8.25,vto:"29/07/2027",dur:1.28,freq:"Trimestral",tipo:"Bullet",cal:"A+",proxCpn:34},
  {t:"PN38D",em:"Pan American Energy",p:106.0,tir:2.63,cup:6.5,vto:"11/08/2027",dur:1.33,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:138},
  {t:"SBC1D",em:"Scania Credit",p:88.7,tir:5.62,cup:8.75,vto:"05/09/2027",dur:0.82,freq:"Trimestral",tipo:"Sinkable",cal:"AA",proxCpn:71},
  {t:"TTCBD",em:"Tecpetrol",p:105.45,tir:4.82,cup:6.5,vto:"16/10/2027",dur:1.48,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:21},
  {t:"RUCED",em:"MSU Energy",p:100.45,tir:8.09,cup:7.5,vto:"30/10/2027",dur:1.41,freq:"Trimestral",tipo:"Sinkable",cal:"A",proxCpn:35},
  {t:"TLCOD",em:"Telecom",p:105.1,tir:5.93,cup:7.0,vto:"28/11/2028",dur:2.47,freq:"Semestral",tipo:"Bullet",cal:"AA+",proxCpn:63},
  {t:"PLC3D",em:"Pluspetrol",p:105.1,tir:5.29,cup:7.25,vto:"30/04/2028",dur:1.99,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:126},
  {t:"CRCJD",em:"Celulosa",p:17.6,tir:377.0,cup:9.25,vto:"16/05/2028",dur:1.8,freq:"Trimestral",tipo:"Sinkable",cal:"D",proxCpn:51},
  {t:"OLC5D",em:"Oleoductos del Valle",p:107.05,tir:5.64,cup:7.89,vto:"12/06/2028",dur:2.06,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:78},
  {t:"CICAD",em:"CNH Industrial",p:103.1,tir:7.83,cup:8.0,vto:"03/06/2028",dur:2.03,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:69},
  {t:"DNC5D",em:"Edenor",p:105.8,tir:7.52,cup:9.5,vto:"05/08/2028",dur:2.14,freq:"Semestral",tipo:"Bullet",cal:"A",proxCpn:132},
  {t:"YM40D",em:"YPF",p:105.85,tir:5.26,cup:7.5,vto:"28/08/2028",dur:2.26,freq:"Trimestral",tipo:"Bullet",cal:"AAA",proxCpn:63},
  {t:"LMS7D",em:"Aluar",p:95.5,tir:4.97,cup:7.0,vto:"12/10/2028",dur:1.24,freq:"Trimestral",tipo:"Sinkable",cal:"AAA",proxCpn:17},
  {t:"PECGD",em:"Petrolera Aconcagua",p:62.76,tir:36.83,cup:9.0,vto:"28/10/2028",dur:2.17,freq:"Semestral",tipo:"Bullet",cal:"BBB",proxCpn:33},
  {t:"PN37D",em:"Pan American Energy",p:105.15,tir:5.26,cup:6.25,vto:"13/11/2028",dur:2.44,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:48},
  {t:"SBC2D",em:"Scania Credit",p:102.5,tir:6.92,cup:7.49,vto:"16/01/2029",dur:1.48,freq:"Trimestral",tipo:"Sinkable",cal:"AA",proxCpn:112},
  {t:"LOC6D",em:"Loma Negra",p:103.1,tir:5.81,cup:6.5,vto:"23/01/2029",dur:2.64,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:119},
  {t:"HJCKD",em:"John Deere",p:102.5,tir:7.47,cup:7.75,vto:"16/01/2029",dur:2.57,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:112},
  {t:"CICBD",em:"CNH Industrial",p:100.5,tir:7.82,cup:7.5,vto:"09/02/2029",dur:2.65,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:136},
  {t:"LUC5D",em:"Luz de Tres Picos",p:100.2,tir:8.33,cup:8.0,vto:"26/02/2029",dur:2.68,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:153},
  {t:"PLC6D",em:"Pluspetrol",p:102.5,tir:5.82,cup:6.5,vto:"27/02/2029",dur:2.74,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:246},
  {t:"YM42D",em:"YPF",p:105.5,tir:5.85,cup:7.0,vto:"02/03/2029",dur:2.68,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:68},
  {t:"VSCPD",em:"Vista Energy",p:108.35,tir:5.68,cup:8.0,vto:"03/05/2029",dur:2.16,freq:"Semestral",tipo:"Sinkable",cal:"AAA",proxCpn:38},
  {t:"OLC6D",em:"Oleoductos del Valle",p:106.65,tir:6.07,cup:7.5,vto:"05/06/2029",dur:2.88,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:71},
  {t:"NPCCD",em:"Central Puerto",p:106.35,tir:6.22,cup:8.0,vto:"25/08/2029",dur:3.08,freq:"Semestral",tipo:"Bullet",cal:"AA+",proxCpn:152},
  {t:"PN41D",em:"Pan American Energy",p:106.25,tir:5.73,cup:7.5,vto:"27/08/2029",dur:3.11,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:154},
  {t:"PN35D",em:"Pan American Energy",p:103.85,tir:5.85,cup:7.0,vto:"27/09/2029",dur:3.06,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:185},
  {t:"IRCOD",em:"IRSA",p:105.05,tir:6.15,cup:7.25,vto:"23/10/2029",dur:3.22,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:119},
  {t:"TTC9D",em:"Tecpetrol",p:106.5,tir:5.74,cup:6.8,vto:"24/10/2029",dur:3.14,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:29},
  {t:"OT42D",em:"Oil Tanking",p:107.65,tir:6.32,cup:8.0,vto:"17/01/2030",dur:3.33,freq:"trimestral",tipo:"Bullet",cal:"AA",proxCpn:22},
  {t:"PLC2D",em:"Pluspetrol",p:107.9,tir:6.17,cup:7.5,vto:"27/01/2030",dur:3.36,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:32},
  {t:"OLC7D",em:"Oleoductos del Valle",p:103.95,tir:6.02,cup:6.9,vto:"23/02/2030",dur:3.52,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:150},
  {t:"YM39D",em:"YPF",p:111.15,tir:6.27,cup:8.75,vto:"22/07/2030",dur:3.64,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:118},
  {t:"PQCSD",em:"Petroquimica Cdro Riv",p:103.0,tir:7.6,cup:8.0,vto:"17/02/2031",dur:4.16,freq:"Semestral",tipo:"Bullet",cal:"AA",proxCpn:144},
  {t:"VSCRD",em:"Vista Energy",p:109.6,tir:6.19,cup:7.65,vto:"10/10/2031",dur:4.46,freq:"Semestral",tipo:"Sinkable",cal:"AAA",proxCpn:15},
  {t:"PN36D",em:"Pan American Energy",p:109.35,tir:5.92,cup:7.25,vto:"13/11/2031",dur:4.6,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:48}
];

const ONS_NY_DATA = [
  {t:"MTCGD",em:"Mastellone",p:105.8,tir:-1.19,cup:10.95,vto:"30/06/2026",dur:0.25,freq:"Trimestral",tipo:"Bullet",cal:"A",proxCpn:4},
  {t:"PNDCD",em:"Pan American Energy",p:65.9,tir:-1.1,cup:9.13,vto:"30/04/2027",dur:0.57,freq:"Semestral",tipo:"Sinkable",cal:"A1",proxCpn:35},
  {t:"YCAMD",em:"YPF",p:105.5,tir:3.67,cup:6.95,vto:"21/07/2027",dur:1.27,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:117},
  {t:"IRCFD",em:"IRSA",p:69.41,tir:5.45,cup:8.75,vto:"22/06/2028",dur:1.33,freq:"Semestral",tipo:"Sinkable",cal:"AA",proxCpn:88},
  {t:"CAC5D",em:"Capex",p:65.75,tir:5.99,cup:9.25,vto:"25/08/2028",dur:1.33,freq:"Semestral",tipo:"Sinkable",cal:"AA",proxCpn:152},
  {t:"BYCHD",em:"Banco Galicia",p:109.1,tir:5.47,cup:7.75,vto:"10/10/2028",dur:2.28,freq:"Semestral",tipo:"Bullet",cal:"A1",proxCpn:15},
  {t:"BACGD",em:"Banco Macro",p:107.7,tir:6.14,cup:8.0,vto:"23/06/2029",dur:2.87,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:89},
  {t:"YMCID",em:"YPF",p:108.35,tir:5.27,cup:9.0,vto:"30/06/2029",dur:1.62,freq:"Semestral",tipo:"Sinkable",cal:"AAA",proxCpn:96},
  {t:"DNC7D",em:"Edenor",p:108.75,tir:8.39,cup:9.75,vto:"24/10/2030",dur:2.97,freq:"Semestral",tipo:"Sinkable",cal:"B-",proxCpn:29},
  {t:"RUCDD",em:"MSU Energy",p:106.95,tir:8.77,cup:9.75,vto:"05/12/2030",dur:3.76,freq:"Semestral",tipo:"Sinkable",cal:"CCC+",proxCpn:71},
  {t:"TLCMD",em:"Telecom",p:111.0,tir:7.1,cup:9.5,vto:"18/07/2031",dur:3.59,freq:"Semestral",tipo:"Sinkable",cal:"AA+",proxCpn:114},
  {t:"TSC3D",em:"TGS",p:111.7,tir:6.31,cup:8.5,vto:"24/07/2031",dur:4.36,freq:"Semestral",tipo:"Bullet",cal:"B2",proxCpn:120},
  {t:"TTCDD",em:"Tecpetrol",p:108.0,tir:6.45,cup:7.63,vto:"30/11/2030",dur:3.92,freq:"Semestral",tipo:"Bullet",cal:"B1/BB",proxCpn:38},
  {t:"BACHD",em:"Banco Macro",p:106.95,tir:6.71,cup:8.0,vto:"28/01/2031",dur:4.13,freq:"Semestral",tipo:"Bullet",cal:"AAA",proxCpn:124},
  {t:"PLC5D",em:"Pluspetrol",p:109.1,tir:6.78,cup:8.13,vto:"18/05/2031",dur:4.2,freq:"Semestral",tipo:"Bullet",cal:"B1/BB",proxCpn:53},
  {t:"ARC1D",em:"Aeropuertos 2000",p:107.65,tir:5.91,cup:8.5,vto:"01/08/2031",dur:2.87,freq:"Trimestral",tipo:"Sinkable",cal:"B-",proxCpn:36},
  {t:"MGCMD",em:"Pampa Energía",p:108.5,tir:6.27,cup:7.95,vto:"10/09/2031",dur:4.54,freq:"Semestral",tipo:"Bullet",cal:"AA+/B-",proxCpn:168},
  {t:"YMCXD",em:"YPF",p:108.55,tir:6.85,cup:8.75,vto:"11/09/2031",dur:4.05,freq:"Semestral",tipo:"Sinkable",cal:"AAA",proxCpn:169},
  {t:"PNXCD",em:"Pan American Energy",p:114.15,tir:6.11,cup:8.5,vto:"30/04/2032",dur:4.77,freq:"Semestral",tipo:"Sinkable",cal:"B1",proxCpn:35},
  {t:"YFCJD",em:"YPF LUZ",p:108.9,tir:6.8,cup:7.88,vto:"16/10/2032",dur:4.45,freq:"Semestral",tipo:"Sinkable",cal:"B-",proxCpn:21},
  {t:"PLC4D",em:"Pluspetrol",p:110.6,tir:7.03,cup:8.5,vto:"30/05/2032",dur:4.83,freq:"Semestral",tipo:"Bullet",cal:"B1",proxCpn:65},
  {t:"TTCAD",em:"Tecpetrol",p:108.0,tir:6.33,cup:7.63,vto:"22/01/2033",dur:5.4,freq:"Semestral",tipo:"Sinkable",cal:"B1",proxCpn:118},
  {t:"YMCJD",em:"YPF",p:105.1,tir:6.76,cup:7.0,vto:"30/09/2033",dur:4.81,freq:"Semestral",tipo:"Sinkable",cal:"B-",proxCpn:4},
  {t:"TLCPD",em:"Telecom",p:111.75,tir:7.71,cup:9.25,vto:"28/05/2033",dur:5.02,freq:"Semestral",tipo:"Sinkable",cal:"B2",proxCpn:63},
  {t:"VSCVD",em:"VIsta Energy",p:111.6,tir:6.79,cup:8.5,vto:"10/06/2033",dur:4.86,freq:"Semestral",tipo:"Sinkable",cal:"B2",proxCpn:76},
  {t:"GN49D",em:"Genneia",p:107.55,tir:6.9,cup:7.75,vto:"02/12/2033",dur:5.28,freq:"Semestral",tipo:"Sinkable",cal:"AA+/B2",proxCpn:68},
  {t:"YM34D",em:"YPF",p:107.9,tir:7.2,cup:8.25,vto:"17/01/2034",dur:5.33,freq:"Semestral",tipo:"Sinkable",cal:"B-",proxCpn:113},
  {t:"MGCOD",em:"Pampa Energía",p:110.0,tir:6.79,cup:7.88,vto:"16/12/2034",dur:6.39,freq:"Semestral",tipo:"Bullet",cal:"B-",proxCpn:82},
  {t:"IRCPD",em:"IRSA",p:109.5,tir:7.19,cup:8.0,vto:"31/03/2035",dur:6.37,freq:"Semestral",tipo:"Sinkable",cal:"B-",proxCpn:5},
  {t:"TSC4D",em:"TGS",p:108.0,tir:7.11,cup:7.75,vto:"20/11/2035",dur:6.91,freq:"Semestral",tipo:"Bullet",cal:"B2",proxCpn:55},
  {t:"VSCTD",em:"VIsta Energy",p:109.8,tir:6.57,cup:7.63,vto:"10/12/2035",dur:6.39,freq:"Semestral",tipo:"Bullet",cal:"B2",proxCpn:76},
  {t:"TLCTD",em:"Telecom",p:107.2,tir:7.78,cup:8.5,vto:"20/01/2036",dur:6.53,freq:"Semestral",tipo:"Sinkable",cal:"B2",proxCpn:116},
  {t:"PN43D",em:"Pan American Energy",p:106.75,tir:7.13,cup:7.75,vto:"15/01/2037",dur:7.42,freq:"Semestral",tipo:"Sinkable",cal:"B1",proxCpn:55},
  {t:"MGCRD",em:"Pampa Energía",p:107.6,tir:7.27,cup:7.75,vto:"14/11/2037",dur:7.67,freq:"Semestral",tipo:"Bullet",cal:"B-",proxCpn:49}
];

const ON_COUPON_CALENDAR = [
  {month:1,label:"Enero",tickers:["TLCMO","TSC3O","TTCAO","YM34O","TLCTO","PN43O","YM41O","VSCWO","PFC2O","YM38O","LMS7O","SBC2O","HJCKO","OT42O","PLC2O","YM390","BACHO","MIC4O","RUCEO"]},
  {month:2,label:"Febrero",tickers:["CAC5O","ARC1O","NBS1O","ZZC1O","IRCJO","YM37O","PN38O","DNC5O","YM40O","NPCCO","PN41O","PQCSO","OLC7O","CICBO","PLC6O","LUC5O"]},
  {month:3,label:"Marzo",tickers:["MTCGO","MGCMO","YMCXO","YMCJO","IRCPO","LMS8O","SBC1O","PN35O","TLCUO"]},
  {month:4,label:"Abril",tickers:["PNDCO","BYCHO","DNC7O","PNXCO","YFCJO","RC2CO","YM41O","VSCWO","PN42O","OTS2O","YM38O","TTCBO","TLCOO","PLC3O","LMS7O","SBC2O","IRCOO","TTC9O","OT42O","VSCRO","MIC4O","RUCEO"]},
  {month:5,label:"Mayo",tickers:["TTCDO","PLC5O","ARC1O","PLC4O","TLCPO","TSC4O","MGCRO","DNC3O","YM37O","RCCRO","CIC9O","HJCIO","YM40O","PN36O"]},
  {month:6,label:"Junio",tickers:["MTCGO","IRCFO","BACGO","YMCIO","RUCDO","VSCVO","GN49O","MGCOO","VSCTO","NBS1O","LMS8O","MCC2O","SBC1O","OLC5O","CICAO","OLC6O"]},
  {month:7,label:"Julio",tickers:["TLCMO","TSC3O","TTCAO","YM34O","TLCTO","PN43O","YM41O","VSCWO","PFC2O","YM38O","LMS7O","SBC2O","HJCKO","OT42O","PLC2O","YM390","BACHO","MIC4O","RUCEO"]},
  {month:8,label:"Agosto",tickers:["CAC5O","ARC1O","ZZC1O","IRCJO","YM37O","PN38O","DNC5O","YM40O","NPCCO","PN41O","PQCSO","OLC7O","CICBO","PLC6O","LUC5O"]},
  {month:9,label:"Septiembre",tickers:["MTCGO","MGCMO","YMCXO","YMCJO","IRCPO","LMS8O","SBC1O","PN35O","TLCUO"]},
  {month:10,label:"Octubre",tickers:["PNDCO","BYCHO","DNC7O","PNXCO","YFCJO","YM41O","NBS1O","RC2CO","VSCWO","PN42O","OTS2O","YM38O","TTCBO","TLCOO","PLC3O","LMS7O","SBC2O","IRCOO","TTC9O","OT42O","VSCRO","MIC4O","RUCEO"]},
  {month:11,label:"Noviembre",tickers:["TTCDO","PLC5O","ARC1O","PLC4O","TLCPO","TSC4O","MGCRO","DNC3O","YM37O","RCCRO","CIC9O","HJCIO","YM40O","PN36O"]},
  {month:12,label:"Diciembre",tickers:["MTCGO","IRCFO","BACGO","YMCIO","RUCDO","VSCVO","GN49O","MGCOO","VSCTO","LMS8O","MCC2O","SBC1O","OLC5O","CICAO","OLC6O"]}
];


const EQUITIES = [
  // ── ARGENTINA — ADRs NYSE/NASDAQ · Google Finance 19 MAR ─────
  {t:"MERV", e:"Índice Merval (BYMA)",       p:2380000, mkt:"ARG",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null, cur:"ARS"},
  {t:"GGAL", e:"Gpo. Financiero Galicia",  p:49.52,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BMA",  e:"Banco Macro",              p:78.50,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BBAR", e:"BBVA Argentina",           p:14.10,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"SUPV", e:"Grupo Supervielle",        p:10.52,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"YPF",  e:"YPF S.A.",                p:38.23,   mkt:"ARG",tg:48.53,  an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"PAM",  e:"Pampa Energía",            p:87.15,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"CEPU", e:"Central Puerto",           p:14.60,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"EDN",  e:"Edenor",                   p:32.19,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"TGS",  e:"Transportadora Gas Sur",   p:30.82,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"VIST", e:"Vista Energy",             p:73.6,   mkt:"ARG",tg:77.45,  an:"BUY", fpe:11.37, fpg:1.44, rw:7.5,  ma:35.52,  up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE", mom:"MUY FUERTE",sc:91.48,s1:11.31,m1:29.95,a1:53.03, ytd:49.94},
  {t:"LOMA", e:"Loma Negra",              p:10.70,   mkt:"ARG",tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"GLOB", e:"Globant",                 p:61.20,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"MELI", e:"MercadoLibre",           p:1670.0, mkt:"ARG",tg:2624.01,an:"BUY", fpe:31.47, fpg:0.9, rw:11.27, ma:-32.5, up:"MUY ALTO",  cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",     sc:48.09,s1:-2.05,m1:-18.58,a1:-18.85,ytd:-17.24},
  {t:"TEO",  e:"Telecom Argentina",       p:12.89,   mkt:"ARG",tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  // ── ESTADOS UNIDOS · Robinhood/TradingView 19 MAR 2026 ──────
  {t:"MU",   e:"Micron Technology",      p:448.20,  mkt:"US", tg:501.78, an:"BUY", fpe:7.88,  fpg:0.03, rw:57.05, ma:50.64,  up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"MUY FUERTE",sc:90.90,s1:-0.76,m1:0.46,  a1:319.25,ytd:55.66},
  {t:"NVDA", e:"NVIDIA Corp.",           p:179.17,  mkt:"US", tg:264.57, an:"BUY", fpe:21.44, fpg:0.43, rw:81.24, ma:0.16,   up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",    sc:74.86,s1:-4.19, m1:-8.13, a1:49.75, ytd:-4.26},
  {t:"AVGO", e:"Broadcom Inc.",          p:319.84,  mkt:"US", tg:467.02, an:"BUY", fpe:27.93, fpg:0.48, rw:19.0, ma:-1.63,  up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",    sc:74.3,s1:-3.62, m1:-6.9, a1:58.18, ytd:-7.59},
  {t:"AMAT", e:"Applied Materials",      p:357.21,  mkt:"US", tg:407.73, an:"BUY", fpe:32.36, fpg:1.55, rw:19.11, ma:32.87,  up:"MEDIO",     cal:"ALTA",     val:"RAZONABLE", mom:"MUY FUERTE",sc:72.37,s1:4.55, m1:-3.31, a1:120.19,ytd:39.0},
  {t:"AMD",  e:"Advanced Micro Dev.",    p:203.27,  mkt:"US", tg:280.14, an:"BUY", fpe:31.08, fpg:0.52, rw:-0.21, ma:6.32,   up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:62.27,s1:4.11, m1:0.6, a1:81.75, ytd:-4.15},
  {t:"INTC", e:"Intel Corp.",            p:45.77,   mkt:"US", tg:46.07,  an:"HOLD",fpe:88.83, fpg:1.49, rw:-6.52, ma:25.24,  up:"BAJO",     cal:"BAJA",     val:"RAZONABLE", mom:"FUERTE",    sc:51.68,s1:null, m1:-4.88, a1:82.11, ytd:22.03},
  {t:"ASML", e:"ASML Holding",          p:1376.3, mkt:"US", tg:1444.7,an:"BUY", fpe:39.37, fpg:1.63, rw:34.12, ma:26.03,  up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:71.42,s1:-2.11, m1:-10.31, a1:79.31, ytd:27.72},
  {t:"TSM",  e:"Taiwan Semiconductor",   p:330.0,  mkt:"US", tg:410.08, an:"BUY", fpe:23.48, fpg:0.77, rw:17.55, ma:16.63,  up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:69.8,s1:-2.68, m1:-9.11, a1:88.98, ytd:11.48},
  {t:"QCOM", e:"Qualcomm",              p:129.9,  mkt:"US", tg:161.77, an:"HOLD",fpe:11.77, fpg:0.0,  rw:20.96, ma:-21.85, up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:40.63,s1:0.06, m1:-9.31, a1:-17.91,ytd:-23.25},
  {t:"ARM",  e:"ARM Holdings",          p:132.35,  mkt:"US", tg:149.7, an:"BUY", fpe:74.33, fpg:4.69, rw:5.52,  ma:-6.27,  up:"MEDIO",     cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",    sc:40.71,s1:14.34, m1:4.02, a1:6.70,  ytd:18.76},
  // mega-cap tech
  {t:"AAPL", e:"Apple Inc.",            p:248.96,  mkt:"US", tg:291.24, an:"BUY", fpe:29.05, fpg:2.35, rw:71.6, ma:0.95,   up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:60.03,s1:-0.85, m1:-6.19, a1:15.44, ytd:-8.42},
  {t:"MSFT", e:"Microsoft Corp.",       p:389.02,  mkt:"US", tg:595.55, an:"BUY", fpe:23.57, fpg:1.34, rw:23.92, ma:-23.23, up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:49.32,s1:1.94, m1:-1.79, a1:0.50,  ytd:-18.99},
  {t:"AMZN", e:"Amazon.com Inc.",       p:208.76,  mkt:"US", tg:279.13, an:"BUY", fpe:26.91, fpg:1.60, rw:7.16,  ma:-7.23,  up:"MUY ALTO", cal:"MEDIA",    val:"RAZONABLE", mom:"FUERTE",    sc:47.69,s1:2.48, m1:2.71,  a1:5.66,  ytd:-9.08},
  {t:"META", e:"Meta Platforms",        p:606.7,  mkt:"US", tg:855.97, an:"BUY", fpe:20.23, fpg:1.05, rw:18.64, ma:-14.2, up:"MUY ALTO", cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",    sc:51.4,s1:-3.27, m1:-7.7, a1:4.56,  ytd:-8.09},
  {t:"GOOGL",e:"Alphabet Inc.",         p:307.13,  mkt:"US", tg:359.64, an:"BUY", fpe:26.8, fpg:1.98, rw:27.83, ma:15.92,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:66.8,s1:-0.42, m1:-0.77,  a1:84.93, ytd:-1.88},
  {t:"TSLA", e:"Tesla Inc.",            p:380.3,  mkt:"US", tg:402.7, an:"HOLD",fpe:186.79,fpg:7.52, rw:-2.52, ma:-3.8,  up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:35.44,s1:-5.94, m1:-10.54, a1:61.47, ytd:-15.44},
  {t:"NFLX", e:"Netflix Inc.",          p:91.74,   mkt:"US", tg:114.16, an:"BUY", fpe:29.2, fpg:1.29, rw:19.15, ma:-18.32, up:"ALTO",     cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",     sc:53.55,s1:-3.66, m1:17.73, a1:-1.74, ytd:-2.15},
  {t:"ADBE", e:"Adobe Inc.",            p:248.15,  mkt:"US", tg:324.77, an:"BUY", fpe:10.41, fpg:0.82, rw:27.45, ma:-36.37, up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:53.6,s1:-0.47, m1:-5.71, a1:-35.76,ytd:-29.72},
  {t:"ORCL", e:"Oracle Corp.",          p:155.5,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.15, m1:null,  a1:null,   ytd:null},
  {t:"PLTR", e:"Palantir Tech.",        p:155.68,  mkt:"US", tg:189.88, an:"BUY", fpe:117.08,fpg:2.08, rw:30.04, ma:-5.05,  up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:66.02,s1:null, m1:11.37, a1:76.42, ytd:-12.4},
  // financials
  {t:"JPM",  e:"JPMorgan Chase",        p:287.97,  mkt:"US", tg:338.17, an:"BUY", fpe:13.01, fpg:1.43, rw:-5.86, ma:-4.61,  up:"ALTO",     cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:49.58,s1:1.1, m1:-7.2, a1:19.82, ytd:-10.63},
  {t:"GS",   e:"Goldman Sachs",         p:809.5,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BAC",  e:"Bank of America",       p:47.01,   mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.00, m1:null,  a1:null,   ytd:null},
  {t:"MS",   e:"Morgan Stanley",        p:158.54,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"WFC",  e:"Wells Fargo",           p:77.40,   mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"V",    e:"Visa Inc.",             p:299.71,  mkt:"US", tg:400.28, an:"BUY", fpe:23.3, fpg:1.83, rw:91.88, ma:-13.26, up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:51.85,s1:null, m1:-5.83, a1:-11.95,ytd:-14.54},
  {t:"MA",   e:"Mastercard",            p:491.14,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"AXP",  e:"American Express",      p:298.00,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  // energía / industrial
  {t:"GEV",  e:"GE Vernova",            p:880.22,  mkt:"US", tg:866.83, an:"BUY", fpe:59.6, fpg:0.8, rw:24.06, ma:28.05,  up:"BAJO",     cal:"EXCELENTE",val:"BARATA",   mom:"FUERTE",    sc:82.14,s1:5.72, m1:4.1,  a1:149.11,ytd:34.25},
  {t:"XOM",  e:"Exxon Mobil",           p:158.15,  mkt:"US", tg:152.31, an:"BUY", fpe:20.71, fpg:2.11, rw:4.99,  ma:23.34,  up:"BAJO",     cal:"BAJA",     val:"CARA",     mom:"FUERTE",    sc:66.58,s1:2.33, m1:6.02,  a1:36.26, ytd:31.43},
  {t:"CVX",  e:"Chevron Corp.",         p:201.43,  mkt:"US", tg:193.93, an:"BUY", fpe:18.99, fpg:1.51, rw:-1.19, ma:20.89,  up:"BAJO",     cal:"BAJA",     val:"RAZONABLE",     mom:"FUERTE",    sc:57.92,s1:2.49, m1:9.71, a1:21.65, ytd:32.17},
  {t:"GE",   e:"GE Aerospace",          p:291.61,  mkt:"US", tg:361.03, an:"BUY", fpe:39.15, fpg:2.5, rw:18.58, ma:-0.01,   up:"MUY ALTO",     cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:51.19,s1:-4.3, m1:-12.98,a1:41.53, ytd:-5.33},
  {t:"RTX",  e:"RTX Corp.",             p:200.73,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"CAT",  e:"Caterpillar Inc.",      p:688.65,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"UBER", e:"Uber Technologies",     p:73.89,   mkt:"US", tg:104.41, an:"BUY", fpe:22.24, fpg:5.27, rw:10.0, ma:-16.56, up:"MUY ALTO", cal:"MEDIA",     val:"CARA",     mom:"DÉBIL",    sc:36.51,s1:0.76, m1:1.54,  a1:5.85,  ytd:-7.8},
  // salud / pharma
  {t:"LLY",  e:"Eli Lilly",            p:917.5,  mkt:"US", tg:1201.43,an:"BUY", fpe:26.51, fpg:0.85, rw:36.46, ma:2.84,   up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",    sc:82.66,s1:-7.96, m1:-11.16,a1:9.56,  ytd:-14.63},
  {t:"JNJ",  e:"Johnson & Johnson",    p:237.6,  mkt:"US", tg:239.61, an:"BUY", fpe:20.58, fpg:2.62, rw:14.16, ma:18.45,  up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"FUERTE",    sc:65.8,s1:-2.55, m1:-3.93, a1:46.33, ytd:14.81},
  {t:"UNH",  e:"UnitedHealth Group",   p:275.59,  mkt:"US", tg:363.47, an:"BUY", fpe:15.74, fpg:2.04, rw:4.96,  ma:-12.31, up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:39.63,s1:-2.3, m1:-4.38, a1:-43.39,ytd:-15.05},
  {t:"ABBV", e:"AbbVie Inc.",          p:206.21,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:5.21, m1:null,  a1:null,   ytd:null},
  {t:"PFE",  e:"Pfizer Inc.",          p:26.97,   mkt:"US", tg:28.76,  an:"HOLD",fpe:9.2,  fpg:0.0,  rw:2.5,  ma:7.9,   up:"MEDIO",     cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:47.74,s1:1.5, m1:-1.42,  a1:4.85,  ytd:10.08},
  {t:"AMGN", e:"Amgen Inc.",           p:358.65,  mkt:"US", tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"MRK",  e:"Merck & Co.",          p:114.23,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.19, m1:null,  a1:null,   ytd:null},
  // consumo
  {t:"WMT",  e:"Walmart Inc.",         p:121.09,  mkt:"US", tg:134.9, an:"BUY", fpe:41.33, fpg:3.81, rw:8.06,  ma:11.03,  up:"MEDIO",    cal:"MEDIA",    val:"CARA",     mom:"NEUTRO",    sc:53.16,s1:-5.93, m1:-6.0, a1:40.56, ytd:8.69},
  {t:"MCD",  e:"McDonald's Corp.",     p:319.42,  mkt:"US", tg:346.68, an:"BUY", fpe:23.4, fpg:2.71, rw:17.92, ma:0.35,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:48.92,s1:null, m1:-5.81, a1:2.90,  ytd:1.29},
  {t:"KO",   e:"Coca-Cola Co.",        p:75.55,   mkt:"US", tg:83.53,  an:"BUY", fpe:23.36, fpg:3.19, rw:27.24, ma:5.97,   up:"MEDIO",    cal:"EXCELENTE",val:"CARA",     mom:"NEUTRO",    sc:60.94,s1:-3.35, m1:-5.96, a1:9.82,  ytd:8.07},
  {t:"PEP",  e:"PepsiCo Inc.",         p:150.04,  mkt:"US", tg:170.52, an:"HOLD",fpe:17.69, fpg:2.8, rw:13.81, ma:4.14,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:43.83,s1:-6.15, m1:-8.73, a1:3.78,  ytd:6.42},
  {t:"PG",   e:"Procter & Gamble",     p:144.85,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"COST", e:"Costco Wholesale",     p:974.78,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:1.63, m1:null,  a1:null,   ytd:null},
  {t:"HD",   e:"Home Depot Inc.",      p:328.21,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"NKE",  e:"Nike Inc.",            p:52.37,   mkt:"US", tg:75.93,  an:"BUY", fpe:34.56, fpg:4.45, rw:3.92,  ma:-26.02, up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:28.11,s1:-2.98, m1:-20.11,a1:-27.18,ytd:-16.12},
  {t:"DIS",  e:"Walt Disney Co.",      p:99.51,  mkt:"US", tg:130.3, an:"BUY", fpe:14.87, fpg:1.29, rw:-0.7, ma:-13.4, up:"MUY ALTO", cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:36.47,s1:0.21, m1:-7.1, a1:-0.52, ytd:-12.81},
  {t:"BABA", e:"Alibaba Group",        p:122.41,  mkt:"US", tg:192.05, an:"BUY", fpe:25.1, fpg:6.89, rw:-6.41, ma:-17.17,  up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:25.84,s1:-9.47, m1:-21.42,a1:-14.49,ytd:-14.79},
  {t:"IBM",  e:"IBM Corp.",            p:241.77,  mkt:"US", tg:305.0, an:"BUY", fpe:20.16, fpg:2.57, rw:6.25,  ma:-11.9, up:"MUY ALTO",     cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",    sc:40.21,s1:-1.83, m1:-7.29, a1:-0.66, ytd:-15.48},
  // emergentes / commodities
  {t:"VALE", e:"Vale S.A.",            p:12.17,   mkt:"US", tg:16.32,  an:"BUY", fpe:7.39,  fpg:0.08, rw:6.29,  ma:17.2,  up:"ALTO",     cal:"MEDIA",    val:"BARATA",   mom:"FUERTE",    sc:71.24,s1:-4.29, m1:-12.19,a1:38.37, ytd:12.28},
  {t:"PBR",  e:"Petrobras",            p:20.74,   mkt:"US", tg:16.89,  an:"BUY", fpe:6.56,  fpg:2.47, rw:10.82, ma:35.2,  up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"MUY FUERTE",sc:63.5,s1:null, m1:22.96, a1:41.66, ytd:66.92},
  {t:"BBD",  e:"Banco Bradesco",       p:3.41,    mkt:"US", tg:4.13,   an:"BUY", fpe:7.41,  fpg:0.44, rw:-6.8, ma:5.51,   up:"ALTO",     cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:59.05,s1:-3.4, m1:-14.32,a1:54.64, ytd:6.31},
  {t:"NIO",  e:"NIO Inc.",             p:5.43,    mkt:"US", tg:6.7,   an:"BUY", fpe:0.0,     fpg:0.0,    rw:16.81, ma:9.97,   up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"NEUTRO",    sc:62.71,s1:-7.34, m1:10.59, a1:10.74, ytd:15.49},
  // crypto / alternative
  {t:"COIN", e:"Coinbase",             p:197.5,  mkt:"US", tg:255.46, an:"BUY", fpe:59.29, fpg:3.44, rw:12.57, ma:-41.08, up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:36.32,s1:1.01, m1:20.39, a1:1.79,  ytd:-10.27},
  {t:"MSTR", e:"MicroStrategy",        p:135.66,  mkt:"US", tg:355.07, an:"BUY", fpe:3.7,  fpg:0.03, rw:-14.13,ma:-94.88, up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",    sc:21.55,s1:-2.87, m1:8.35,  a1:-55.99,ytd:-9.02},
  {t:"HUT",  e:"Hut 8 Corp.",          p:47.46,   mkt:"US", tg:64.07,  an:"BUY", fpe:0.0,     fpg:0.0,    rw:-18.79,ma:24.69,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:45.76,s1:-1.78, m1:-11.48,a1:263.96,ytd:9.14},
  {t:"GPRK", e:"Genie Energy",         p:9.80,    mkt:"US", tg:10.47,  an:"BUY", fpe:7.03, fpg:0.15, rw:13.76, ma:29.33,  up:"MEDIO",    cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:74.38,s1:11.74,m1:18.07, a1:25.32, ytd:37.52},
  {t:"NBIS", e:"Nebius Group",         p:117.62,  mkt:"US", tg:166.39, an:"BUY", fpe:0.00, fpg:0.00, rw:-9.14, ma:30.09,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"MUY FUERTE",sc:60.61,s1:4.13, m1:15.54, a1:349.36,ytd:45.18},
  {t:"NU",   e:"Nu Holdings",          p:13.94,   mkt:"US", tg:19.62,  an:"BUY", fpe:15.97,fpg:0.45, rw:-10.09,ma:-7.26,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:41.62,s1:0.36, m1:-18.81,a1:22.28, ytd:-15.41},
  {t:"BITF", e:"Bitfarms Ltd.",        p:2.22,    mkt:"US", tg:5.64,   an:"BUY", fpe:0.00, fpg:0.00, rw:-19.33,ma:3.84,   up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:40.64,s1:-3.12,m1:5.34,  a1:108.65,ytd:1.70},
  {t:"BRK.B", e:"Berkshire Hathaway B", p:480.94,  mkt:"US", tg:529.50, an:"BUY", fpe:23.07,fpg:8.30, rw:-6.44, ma:-2.04,  up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:30.89,s1:-1.81,m1:-3.59, a1:-9.00, ytd:-4.21},
  // ── ETFs SECTORIALES ────────────────────────────────────────
  {t:"SPY",  e:"S&P 500 ETF",          p:648.57,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.93, m1:null,  a1:null,   ytd:null},
  {t:"QQQ",  e:"Nasdaq 100 ETF",       p:585.72,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:1.18, m1:null,  a1:null,   ytd:null},
  {t:"XLE",  e:"Energy Sector SPDR",   p:55.92,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.78, m1:null,  a1:null,   ytd:null},
  {t:"XLF",  e:"Financial Sector SPDR",p:48.99,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"XLK",  e:"Technology SPDR",      p:139.5,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"XLV",  e:"Health Care SPDR",     p:160.2,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"GLD",  e:"SPDR Gold Shares",     p:433.5,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"MUY FUERTE",sc:null, s1:3.14, m1:null,  a1:null,   ytd:null},
  {t:"SLV",  e:"iShares Silver",       p:66.8,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:4.12, m1:null,  a1:null,   ytd:null},
  {t:"EWZ",  e:"iShares Brazil",       p:40.24,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"SMH",  e:"VanEck Semiconductors",p:195.0,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  // ── ENERGÍA — Rally post-conflicto Irán (feb-mar 2026) ──────
  {t:"COP",  e:"ConocoPhillips",         p:116.8,  mkt:"US", tg:130.0,  an:"BUY", fpe:13.2,  fpg:1.8,  rw:14.5,  ma:12.3,   up:"MEDIO",    cal:"ALTA",     val:"RAZONABLE", mom:"MUY FUERTE",sc:72.1, s1:4.1,  m1:18.3,  a1:28.5,  ytd:24.7},
  {t:"EOG",  e:"EOG Resources",          p:134.2,  mkt:"US", tg:155.0,  an:"BUY", fpe:10.4,  fpg:1.2,  rw:16.8,  ma:8.9,    up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"MUY FUERTE",sc:74.5, s1:3.8,  m1:21.4,  a1:31.2,  ytd:27.3},
  {t:"OXY",  e:"Occidental Petroleum",   p:69.8,   mkt:"US", tg:73.0,   an:"HOLD",fpe:11.1,  fpg:1.5,  rw:9.2,   ma:6.4,    up:"BAJO",     cal:"BAJA",     val:"RAZONABLE", mom:"MUY FUERTE",sc:55.3, s1:2.9,  m1:22.1,  a1:36.0,  ytd:31.5},
  {t:"SLB",  e:"SLB (Schlumberger)",     p:47.8,   mkt:"US", tg:58.0,   an:"BUY", fpe:14.2,  fpg:1.1,  rw:11.3,  ma:10.2,   up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"MUY FUERTE",sc:68.4, s1:3.4,  m1:16.7,  a1:22.4,  ytd:19.8},
  {t:"HAL",  e:"Halliburton Co.",        p:29.1,   mkt:"US", tg:38.0,   an:"BUY", fpe:12.8,  fpg:0.9,  rw:8.7,   ma:14.3,   up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:66.2, s1:2.7,  m1:14.5,  a1:18.9,  ytd:16.4},
  {t:"PSX",  e:"Phillips 66",            p:147.5,  mkt:"US", tg:162.0,  an:"BUY", fpe:10.9,  fpg:2.1,  rw:7.4,   ma:5.8,    up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE", mom:"FUERTE",    sc:61.8, s1:2.1,  m1:12.3,  a1:19.7,  ytd:15.6},
  {t:"DVN",  e:"Devon Energy",           p:44.9,   mkt:"US", tg:55.0,   an:"BUY", fpe:9.1,   fpg:0.8,  rw:12.4,  ma:17.6,   up:"ALTO",     cal:"MEDIA",    val:"BARATA",   mom:"MUY FUERTE",sc:63.7, s1:4.5,  m1:19.8,  a1:14.3,  ytd:18.2},
  // ── DEFENSA — Beneficiaria directa del conflicto Irán ───────
  {t:"LMT",  e:"Lockheed Martin",        p:528.4,  mkt:"US", tg:620.0,  an:"BUY", fpe:18.3,  fpg:2.4,  rw:null,  ma:3.2,    up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"MUY FUERTE",sc:76.3, s1:5.8,  m1:14.2,  a1:22.1,  ytd:18.9},
  {t:"NOC",  e:"Northrop Grumman",       p:543.7,  mkt:"US", tg:650.0,  an:"BUY", fpe:19.8,  fpg:2.6,  rw:null,  ma:2.4,    up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"MUY FUERTE",sc:74.1, s1:5.2,  m1:15.8,  a1:26.4,  ytd:21.7},
  // ── INDUSTRIALS ─────────────────────────────────────────────
  {t:"HON",  e:"Honeywell Intl.",        p:201.8,  mkt:"US", tg:228.0,  an:"BUY", fpe:22.1,  fpg:2.8,  rw:14.2,  ma:-4.3,   up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:58.4, s1:-2.1, m1:-3.8,  a1:4.2,   ytd:-3.1},
  {t:"BA",   e:"Boeing Co.",             p:168.2,  mkt:"US", tg:210.0,  an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:-18.4,  up:"ALTO",     cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:34.2, s1:-1.4, m1:-8.2,  a1:-12.3, ytd:-9.7},
  {t:"DE",   e:"John Deere & Co.",       p:387.6,  mkt:"US", tg:430.0,  an:"BUY", fpe:17.8,  fpg:2.1,  rw:18.4,  ma:-6.2,   up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:52.7, s1:-1.8, m1:-5.3,  a1:3.8,   ytd:-4.2},
  {t:"MMM",  e:"3M Company",             p:117.4,  mkt:"US", tg:130.0,  an:"HOLD",fpe:14.8,  fpg:1.9,  rw:6.3,   ma:-8.4,   up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE", mom:"DÉBIL",    sc:41.5, s1:-3.2, m1:-7.1,  a1:-4.8,  ytd:-5.9},
  // ── HEALTHCARE ADICIONAL ─────────────────────────────────────
  {t:"ABT",  e:"Abbott Laboratories",   p:121.8,  mkt:"US", tg:145.0,  an:"BUY", fpe:22.3,  fpg:2.4,  rw:15.7,  ma:-2.8,   up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:59.8, s1:-1.9, m1:-4.2,  a1:8.7,   ytd:-2.4},
  {t:"MDT",  e:"Medtronic PLC",          p:87.9,   mkt:"US", tg:95.0,   an:"HOLD",fpe:15.8,  fpg:2.1,  rw:8.4,   ma:-3.7,   up:"BAJO",     cal:"ALTA",     val:"RAZONABLE", mom:"NEUTRO",    sc:44.8, s1:-0.8, m1:-2.4,  a1:1.3,   ytd:-1.8},
  {t:"CVS",  e:"CVS Health Corp.",       p:78.3,   mkt:"US", tg:102.0,  an:"BUY", fpe:8.2,   fpg:0.6,  rw:3.8,   ma:-24.8,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:60.2, s1:6.8,  m1:12.4,  a1:-8.4,  ytd:9.7},
  {t:"BMY",  e:"Bristol-Myers Squibb",   p:47.8,   mkt:"US", tg:62.0,   an:"BUY", fpe:7.1,   fpg:0.5,  rw:5.2,   ma:-19.4,  up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"NEUTRO",    sc:54.3, s1:-0.6, m1:4.8,   a1:-14.2, ytd:3.2},
  // ── TECH/CIBERSEGURIDAD (selloff 2026 = zona de entrada) ────
  {t:"CRWD", e:"CrowdStrike Holdings",   p:309.8,  mkt:"US", tg:380.0,  an:"BUY", fpe:64.8,  fpg:2.1,  rw:18.4,  ma:-12.3,  up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:62.4, s1:4.2,  m1:-3.8,  a1:38.4,  ytd:-9.7},
  {t:"PANW", e:"Palo Alto Networks",     p:165.7,  mkt:"US", tg:220.0,  an:"BUY", fpe:44.8,  fpg:1.8,  rw:22.4,  ma:-11.8,  up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:60.8, s1:3.8,  m1:-4.2,  a1:12.4,  ytd:-7.8},
  {t:"NET",  e:"Cloudflare Inc.",        p:89.4,   mkt:"US", tg:120.0,  an:"BUY", fpe:null,  fpg:null, rw:8.4,   ma:-24.8,  up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:47.8, s1:2.4,  m1:-8.4,  a1:-18.4, ytd:-14.2},
  {t:"SNOW", e:"Snowflake Inc.",         p:135.4,  mkt:"US", tg:175.0,  an:"BUY", fpe:null,  fpg:null, rw:4.2,   ma:-28.4,  up:"MUY ALTO", cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",    sc:42.3, s1:1.8,  m1:-12.4, a1:-22.4, ytd:-18.7},
  {t:"NOW",  e:"ServiceNow Inc.",        p:948.7,  mkt:"US", tg:1100.0, an:"BUY", fpe:57.8,  fpg:2.8,  rw:32.4,  ma:-8.4,   up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:63.4, s1:-1.2, m1:-6.8,  a1:24.8,  ytd:-7.4},
  {t:"DDOG", e:"Datadog Inc.",           p:118.4,  mkt:"US", tg:148.0,  an:"BUY", fpe:null,  fpg:null, rw:12.4,  ma:-22.4,  up:"ALTO",     cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:51.2, s1:3.2,  m1:-9.4,  a1:4.8,   ytd:-12.4},
  // ── CONSUMER ADICIONAL ───────────────────────────────────────
  {t:"SBUX", e:"Starbucks Corp.",        p:90.8,   mkt:"US", tg:115.0,  an:"BUY", fpe:20.4,  fpg:1.8,  rw:null,  ma:-4.8,   up:"ALTO",     cal:"ALTA",     val:"CARA",     mom:"FUERTE",    sc:56.8, s1:3.4,  m1:8.2,   a1:2.8,   ytd:6.4},
  {t:"TGT",  e:"Target Corp.",           p:95.8,   mkt:"US", tg:110.0,  an:"HOLD",fpe:12.8,  fpg:1.4,  rw:4.2,   ma:-28.4,  up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE", mom:"DÉBIL",    sc:36.8, s1:-3.8, m1:-14.2, a1:-32.4, ytd:-18.7},
  {t:"CMG",  e:"Chipotle Mexican Grill", p:51.2,   mkt:"US", tg:65.0,   an:"BUY", fpe:39.8,  fpg:2.2,  rw:28.4,  ma:-16.4,  up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:55.4, s1:-0.8, m1:-8.4,  a1:-12.4, ytd:-9.8},
  {t:"LOW",  e:"Lowe's Companies",       p:219.4,  mkt:"US", tg:255.0,  an:"BUY", fpe:18.8,  fpg:1.9,  rw:null,  ma:-8.4,   up:"ALTO",     cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",    sc:51.4, s1:-2.4, m1:-6.4,  a1:-4.8,  ytd:-5.2},
  {t:"YUM",  e:"Yum! Brands",            p:134.8,  mkt:"US", tg:148.0,  an:"BUY", fpe:21.8,  fpg:2.4,  rw:null,  ma:-4.2,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"NEUTRO",    sc:49.8, s1:-1.4, m1:-2.8,  a1:4.8,   ytd:1.2},
  // ── FINANCIERO/ALTERNATIVO ───────────────────────────────────
  {t:"BX",   e:"Blackstone Inc.",        p:121.8,  mkt:"US", tg:148.0,  an:"BUY", fpe:22.4,  fpg:1.6,  rw:null,  ma:-12.4,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:56.4, s1:-2.8, m1:-8.4,  a1:-4.8,  ytd:-7.4},
  {t:"KKR",  e:"KKR & Co. Inc.",         p:117.4,  mkt:"US", tg:148.0,  an:"BUY", fpe:24.8,  fpg:1.8,  rw:null,  ma:-14.8,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:54.8, s1:-3.2, m1:-9.8,  a1:4.2,   ytd:-8.4},
  {t:"SCHW", e:"Charles Schwab Corp.",   p:77.2,   mkt:"US", tg:94.0,   an:"BUY", fpe:17.8,  fpg:1.2,  rw:null,  ma:-8.4,   up:"ALTO",     cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",    sc:48.4, s1:-2.4, m1:-4.2,  a1:-8.4,  ytd:-3.8},
  {t:"SPGI", e:"S&P Global Inc.",        p:471.8,  mkt:"US", tg:530.0,  an:"BUY", fpe:29.8,  fpg:2.4,  rw:34.8,  ma:-8.4,   up:"MEDIO",    cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:57.4, s1:-1.8, m1:-5.4,  a1:8.4,   ytd:-4.8},
  {t:"C",    e:"Citigroup Inc.",          p:70.4,   mkt:"US", tg:88.0,   an:"BUY", fpe:9.8,   fpg:0.7,  rw:null,  ma:-12.4,  up:"ALTO",     cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:46.4, s1:-3.8, m1:-8.4,  a1:-4.8,  ytd:-6.8},
  // ── UTILITIES / INFRAESTRUCTURA ──────────────────────────────
  {t:"NEE",  e:"NextEra Energy",         p:62.8,   mkt:"US", tg:78.0,   an:"BUY", fpe:20.8,  fpg:2.1,  rw:6.4,   ma:-4.8,   up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"NEUTRO",    sc:53.4, s1:-0.8, m1:2.4,   a1:-8.4,  ytd:3.8},
  {t:"SO",   e:"Southern Company",       p:82.4,   mkt:"US", tg:90.0,   an:"BUY", fpe:19.8,  fpg:2.8,  rw:4.8,   ma:-2.4,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"NEUTRO",    sc:47.8, s1:-0.4, m1:1.8,   a1:4.8,   ytd:3.2},
  // ── TELECOM / MEDIA ──────────────────────────────────────────
  {t:"T",    e:"AT&T Inc.",              p:21.8,   mkt:"US", tg:26.0,   an:"BUY", fpe:9.8,   fpg:1.2,  rw:1.4,   ma:-2.4,   up:"ALTO",     cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:48.2, s1:1.8,  m1:4.8,   a1:22.4,  ytd:18.4},
  {t:"VZ",   e:"Verizon Comm.",          p:38.8,   mkt:"US", tg:44.0,   an:"HOLD",fpe:9.2,   fpg:1.8,  rw:0.8,   ma:-4.8,   up:"MEDIO",    cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:39.8, s1:-0.4, m1:2.4,   a1:8.4,   ytd:6.2},
  {t:"CMCSA",e:"Comcast Corp.",          p:38.4,   mkt:"US", tg:48.0,   an:"BUY", fpe:9.8,   fpg:1.1,  rw:8.4,   ma:-14.8,  up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",    sc:52.4, s1:-2.4, m1:-4.8,  a1:-18.4, ytd:-8.4},
  // ── ARG ADRs ADICIONALES ─────────────────────────────────────
  {t:"CRESY",e:"Cresud S.A.",            p:11.2,   mkt:"ARG",tg:14.0,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:-8.4,   up:"ALTO",     cal:"MEDIA",    val:null,       mom:"DÉBIL",    sc:null, s1:-2.4, m1:-4.8,  a1:null,  ytd:null},
  {t:"IRS",  e:"IRSA Inversiones",       p:8.8,    mkt:"ARG",tg:12.0,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:-4.8,   up:"ALTO",     cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:3.8,  m1:8.4,   a1:null,  ytd:null},
  {t:"TX",   e:"Ternium S.A.",           p:27.8,   mkt:"ARG",tg:38.0,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:-18.4,  up:"MUY ALTO", cal:"MEDIA",    val:null,       mom:"DÉBIL",    sc:null, s1:-4.8, m1:-12.4, a1:null,  ytd:null},
];

const calColor  = {EXCELENTE:"green",ALTA:"blue",MEDIA:"gold",BAJA:"red"};
const valColor  = {BARATA:"green",RAZONABLE:"blue",CARA:"red"};
const momColor  = {"MUY FUERTE":"green",FUERTE:"blue",NEUTRO:"gray",DÉBIL:"red"};
const upColor   = {"MUY ALTO":"green",ALTO:"blue",MEDIO:"gold",BAJO:"gray"};

/* ════════════════════════════════════════════════════════════════
   EQUITY SCREENER COMPONENT
════════════════════════════════════════════════════════════════ */
// Finnhub — llamadas directas al API con key en frontend
// Finnhub via Vercel proxy — key is in env variable, never exposed to client
const FINNHUB_PROXY = "/api/quote?symbol";
const FINNHUB_CANDLE_PROXY = "/api/candle?symbol";

function EquityScreener({ t }) {
  // ── Filtros & sort ────────────────────────────────────────────
  const [sortCol, setSortCol] = useState("sc");
  const [sortDir, setSortDir] = useState(-1);
  const [fMkt,  setFMkt]  = useState("Todos");
  const [fCal,  setFCal]  = useState("Todas");
  const [fVal,  setFVal]  = useState("Todas");
  const [fMom,  setFMom]  = useState("Todos");
  const [fAn,   setFAn]   = useState("Todos");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("perf"); // "perf" | "fund"

  // ── Live data ─────────────────────────────────────────────────
  // Load cached prices from localStorage for instant display
  const [livePrices, setLivePrices] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tbl-live-prices") || "{}"); } catch { return {}; }
  });
  // Persist prices to localStorage when updated
  const updateLivePrice = (ticker, entry) => {
    setLivePrices(prev => {
      const next = { ...prev, [ticker]: entry };
      try { localStorage.setItem("tbl-live-prices", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const [liveHistory, setLiveHistory] = useState({});
  const [liveStatus,  setLiveStatus]  = useState("loading");
  const [histStatus,  setHistStatus]  = useState("loading");
  const [quotesComplete, setQuotesComplete] = useState(false);
  const livePricesRef = useRef({});

  // Phase 1 — Quotes batch: una sola llamada al proxy /api/batch en vez de 131 llamadas secuenciales
  // Tiempo anterior: 131 × 820ms = 107 segundos. Ahora: ~5-10 segundos total.
  useEffect(() => {
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const run = async () => {
      try {
        // Llamada única — Vercel resuelve todos en paralelo server-side
        const symbols = tickers.join(",");
        const r = await fetch(`/api/batch?symbols=${encodeURIComponent(symbols)}`);
        const data = await r.json();
        if (cancelled) return;
        const prices = data.prices || {};
        if (Object.keys(prices).length > 0) {
          // Cargar todos a la vez en lugar de uno por uno
          livePricesRef.current = prices;
          setLivePrices(prev => {
            const next = { ...prev, ...prices };
            try { localStorage.setItem("tbl-live-prices", JSON.stringify(next)); } catch {}
            return next;
          });
          setLiveStatus("ok");
        } else {
          setLiveStatus("error");
        }
      } catch {
        if (!cancelled) setLiveStatus("error");
      }
      if (!cancelled) setQuotesComplete(true);
    };
    run();
    // Refresh cada 90 segundos
    const id = setInterval(() => { if (!cancelled) run(); }, 90000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Phase 2 — Candles semanales (1S, 1M, YTD, 52H) — arranca cuando terminan los quotes
  useEffect(() => {
    if (!quotesComplete) return;
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t).filter(t => t && t !== "ARG" && t !== "US");
    const NOW     = Math.floor(Date.now() / 1000);
    const W52_AGO = NOW - 366 * 86400;
    const JAN1    = 1735689600;
    const M1_AGO  = NOW - 30  * 86400;
    const W1_AGO  = NOW - 7   * 86400;

    const findClose = (times, closes, targetTs) => {
      for (let j = 1; j < times.length; j++) {
        if (times[j] > targetTs) return closes[j - 1];
      }
      return closes[closes.length - 1];
    };

    // Fetch candles in parallel batches of 10 (respeta rate limit de Finnhub)
    const BATCH = 10;
    const run = async () => {
      let firstHit = false;
      for (let i = 0; i < tickers.length; i += BATCH) {
        if (cancelled) return;
        const batch = tickers.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(async ticker => {
          try {
            const url = `${FINNHUB_CANDLE_PROXY}=${ticker}&resolution=W&from=${W52_AGO}&to=${NOW}`;
            const r = await fetch(url);
            const d = await r.json();
            if (d.s === "ok" && d.c?.length > 1) {
              const closes = d.c, times = d.t;
              const cur     = livePricesRef.current[ticker]?.price ?? closes[closes.length - 1];
              const hi52    = Math.max(...closes);
              const s1Base  = findClose(times, closes, W1_AGO);
              const m1Base  = findClose(times, closes, M1_AGO);
              const ytdBase = findClose(times, closes, JAN1);
              setLiveHistory(prev => ({
                ...prev,
                [ticker]: {
                  s1:      (cur - s1Base)  / s1Base  * 100,
                  m1:      (cur - m1Base)  / m1Base  * 100,
                  ytd:     (cur - ytdBase) / ytdBase * 100,
                  distHi52:(cur - hi52)    / hi52    * 100,
                }
              }));
              if (!firstHit) { firstHit = true; setHistStatus("ok"); }
            }
          } catch {}
        }));
        if (i + BATCH < tickers.length) await new Promise(r => setTimeout(r, 1200));
      }
      if (!cancelled && !firstHit) setHistStatus("error");
    };
    run();
    return () => { cancelled = true; };
  }, [quotesComplete]);

  // ── Helpers ───────────────────────────────────────────────────
  const getUpCategory = (uPct) => {
    if (uPct === null) return null;
    if (uPct > 40)  return "MUY ALTO";
    if (uPct > 20)  return "ALTO";
    if (uPct > 5)   return "MEDIO";
    return "BAJO";
  };

  // Merge live data into equities for filtering & sorting
  const equitiesLive = EQUITIES.map(e => {
    const lp   = livePrices[e.t];
    const hist = liveHistory[e.t];
    const price = lp?.price ?? e.p;
    const upside = e.tg ? (e.tg / price - 1) * 100 : null;
    return {
      ...e,
      p:    price,
      _1d:  lp?.changePct ?? null,
      s1:   hist?.s1   ?? e.s1,
      m1:   hist?.m1   ?? e.m1,
      ytd:  hist?.ytd  ?? e.ytd,
      _d52: hist?.distHi52 ?? e.ma,
      _up:  upside,
      up:   upside !== null ? getUpCategory(upside) : e.up,
    };
  });

  const sort = (col) => {
    if (sortCol === col) setSortDir(d => -d);
    else { setSortCol(col); setSortDir(col === "sc" ? -1 : 1); }
  };

  const filtered = equitiesLive.filter(e => {
    if (fMkt !== "Todos" && e.mkt !== fMkt) return false;
    if (fAn  !== "Todos" && e.an  !== fAn)  return false;
    if (fCal !== "Todas" && e.cal !== fCal) return false;
    if (fVal !== "Todas" && e.val !== fVal) return false;
    if (fMom !== "Todos" && e.mom !== fMom) return false;
    if (search && !e.t.toLowerCase().includes(search.toLowerCase())
               && !e.e.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const av = a[sortCol], bv = b[sortCol];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string") return av.localeCompare(bv) * sortDir;
    return (av > bv ? 1 : -1) * sortDir;
  });

  // ── Sub-helpers ───────────────────────────────────────────────
  const mktBadge = {
    ARG:{ bg:"#FEF3C7", tx:"#92400E", label:"🇦🇷" },
    US: { bg:"#DBEAFE", tx:"#1E40AF", label:"🇺🇸" },
    ETF:{ bg:"#EDE9FE", tx:"#6D28D9", label:"📦"  },
  };

  const perfColor = (v) => v === null ? t.fa : v >= 0 ? t.gr : t.rd;
  const perfFmt   = (v) => v === null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

  // Skeleton for cells still loading
  const Skel = () => (
    <div style={{
      width:40, height:9, borderRadius:4,
      background:t.brd, opacity:0.6,
      animation:"blink 1.4s ease-in-out infinite",
    }}/>
  );

  const PerfCell = ({ val, loading }) => (
    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
      {loading ? <Skel /> :
        <span style={{ fontSize:12, fontWeight:600, color:perfColor(val) }}>
          {perfFmt(val)}
        </span>
      }
    </td>
  );

  const Th = ({ label, col, tip, right, center }) => {
    const active = sortCol === col;
    return (
      <th onClick={() => sort(col)} title={tip} style={{
        padding:"9px 10px", textAlign:center?"center":right?"right":"left",
        fontSize:9, fontWeight:700,
        color: active ? t.go : t.mu,
        letterSpacing:".07em", textTransform:"uppercase",
        borderBottom:`2px solid ${t.brd}`,
        background:t.alt, cursor:"pointer", whiteSpace:"nowrap",
        userSelect:"none", position:"sticky", top:0, zIndex:5,
        transition:"color .15s",
      }}>
        {label}{active ? (sortDir === 1 ? " ↑" : " ↓") : ""}
      </th>
    );
  };

  // Pill filter button
  const Pill = ({ label, active, onClick, color }) => (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:20, fontFamily:FB, fontSize:11,
      fontWeight:active?700:400, cursor:"pointer", transition:"all .15s",
      border:`1.5px solid ${active?(color||t.go)+"88":(t.brd)}`,
      background:active?(color||t.go)+"18":"transparent",
      color:active?(color||t.go):t.mu,
    }}>{label}</button>
  );

  const clearAll = () => {
    setFMkt("Todos"); setFCal("Todas"); setFVal("Todas");
    setFMom("Todos"); setFAn("Todos"); setSearch("");
  };
  const hasFilters = fMkt!=="Todos"||fCal!=="Todas"||fVal!=="Todas"||fMom!=="Todos"||fAn!=="Todos"||search;

  return (
    <div className="fade-up">

      {/* ── STATUS BAR ────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {/* Prices */}
        <div style={{
          display:"flex", alignItems:"center", gap:7, padding:"7px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${liveStatus==="ok"?t.grAcc+"55":liveStatus==="error"?t.rdAcc+"44":t.brd}`,
          background:liveStatus==="ok"?t.grBg:liveStatus==="error"?t.rdBg:t.alt,
          color:liveStatus==="ok"?t.gr:liveStatus==="error"?t.rd:t.mu,
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:liveStatus==="ok"?"#22c55e":liveStatus==="error"?"#ef4444":"#94a3b8",
            boxShadow:liveStatus==="ok"?"0 0 6px #22c55e":"none",
            animation:liveStatus==="loading"?"blink 1s infinite":"none",
          }}/>
          {liveStatus==="loading" && "Cargando precios..."}
          {liveStatus==="ok"      && `Precios en vivo · ${Object.keys(livePrices).length}/${EQUITIES.length} tickers`}
          {liveStatus==="error"   && "Sin conexión · Precios estáticos"}
        </div>
        {/* History */}
        <div style={{
          display:"flex", alignItems:"center", gap:7, padding:"7px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${histStatus==="ok"?t.blBg:t.brd}`,
          background:histStatus==="ok"?t.blBg:t.alt,
          color:histStatus==="ok"?t.bl:t.mu,
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:histStatus==="ok"?"#3b82f6":histStatus==="error"?"#ef4444":"#94a3b8",
            animation:(histStatus==="loading"||(!quotesComplete))?"blink 1s infinite":"none",
          }}/>
          {!quotesComplete         && "Historial: esperando precios..."}
          {quotesComplete && histStatus==="loading" && `Historial: cargando... ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          {histStatus==="ok"       && `1S · 1M · YTD · 52H en vivo · ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          {histStatus==="error"    && "Historial: usando datos estáticos"}
        </div>
        <div style={{ flex:1, fontFamily:FB, fontSize:10, color:t.fa, textAlign:"right" }}>
          Fundamentales (PE, Score): snapshot 19 MAR 2026 · Cotizaciones en tiempo real vía Finnhub
        </div>
      </div>

      {/* ── FILTROS ───────────────────────────────────────────── */}
      <div style={{ marginBottom:14 }}>
        {/* Búsqueda + mercado */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu, fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker o empresa..."
              style={{
                fontFamily:FB, fontSize:12, padding:"7px 10px 7px 30px",
                borderRadius:10, border:`1.5px solid ${t.brd}`,
                background:t.srf, color:t.tx, width:200, outline:"none",
              }}
              onFocus={e=>e.target.style.borderColor=t.go}
              onBlur={e=>e.target.style.borderColor=t.brd}
            />
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            <Pill label="🇦🇷 ARG" active={fMkt==="ARG"} onClick={()=>setFMkt(fMkt==="ARG"?"Todos":"ARG")} color="#92400E"/>
            <Pill label="🇺🇸 US"  active={fMkt==="US"}  onClick={()=>setFMkt(fMkt==="US" ?"Todos":"US")}  color="#1E40AF"/>
            <Pill label="📦 ETF" active={fMkt==="ETF"} onClick={()=>setFMkt(fMkt==="ETF"?"Todos":"ETF")} color="#6D28D9"/>
          </div>
          {/* View mode */}
          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
            {[{id:"perf",label:"Performance"},{id:"fund",label:"Fundamentals"}].map(v=>(
              <button key={v.id} onClick={()=>setViewMode(v.id)} style={{
                padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, cursor:"pointer",
                border:`1.5px solid ${viewMode===v.id?t.go:t.brd}`,
                background:viewMode===v.id?t.go+"18":"transparent",
                color:viewMode===v.id?t.go:t.mu, fontWeight:viewMode===v.id?700:400,
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Filtros categóricos */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em" }}>CALIDAD:</span>
          {["EXCELENTE","ALTA","MEDIA","BAJA"].map(v=>(
            <Pill key={v} label={v} active={fCal===v} onClick={()=>setFCal(fCal===v?"Todas":v)}
              color={v==="EXCELENTE"?t.gr:v==="ALTA"?t.bl:v==="MEDIA"?t.go:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>VAL:</span>
          {["BARATA","RAZONABLE","CARA"].map(v=>(
            <Pill key={v} label={v} active={fVal===v} onClick={()=>setFVal(fVal===v?"Todas":v)}
              color={v==="BARATA"?t.gr:v==="RAZONABLE"?t.bl:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>ANALISTAS:</span>
          {["BUY","HOLD"].map(v=>(
            <Pill key={v} label={v} active={fAn===v} onClick={()=>setFAn(fAn===v?"Todos":v)}
              color={v==="BUY"?t.gr:t.go}/>
          ))}
          {hasFilters && (
            <button onClick={clearAll} style={{
              marginLeft:4, padding:"5px 12px", borderRadius:20,
              border:`1px solid ${t.brd}`, background:"transparent",
              fontFamily:FB, fontSize:11, color:t.rd, cursor:"pointer",
            }}>✕ Limpiar</button>
          )}
          <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:11, color:t.fa }}>
            {filtered.length} de {EQUITIES.length} instrumentos
          </span>
        </div>
      </div>

      {/* ── TABLA ─────────────────────────────────────────────── */}
      <Card t={t}>
        <div style={{ overflowX:"auto", maxHeight:"72vh", overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
            <thead>
              <tr>
                <Th label="#"       col="_rank" tip="Ranking" />
                <Th label="Ticker"  col="t"     tip="Símbolo · Empresa · Mercado" />
                <Th label="Precio"  col="p"     tip="Precio en vivo" right />
                <Th label="Hoy"     col="_1d"   tip="Variación del día %" right />
                <Th label="Score"   col="sc"    tip="Score compuesto 0–100" right />

                {viewMode === "perf" ? (<>
                  <Th label="1 Sem" col="s1"  tip="Retorno última semana" right />
                  <Th label="1 Mes" col="m1"  tip="Retorno último mes" right />
                  <Th label="YTD"   col="ytd" tip="Retorno año hasta hoy" right />
                  <Th label="vs 52H" col="_d52" tip="% vs máximo 52 semanas" right />
                  <Th label="Target" col="tg" tip="Precio objetivo" right />
                  <Th label="Potencial" col="_up" tip="Upside al target" right />
                </>) : (<>
                  <Th label="Target"   col="tg"  tip="Precio objetivo consenso" right />
                  <Th label="Potencial" col="_up" tip="Upside al target" right />
                  <Th label="Fwd P/E"  col="fpe" tip="Precio / ganancias est. fwd" right />
                  <Th label="ROIC−WACC" col="rw" tip="Creación de valor económico" right />
                  <Th label="Calidad"  col="cal" tip="Calidad del negocio" center />
                  <Th label="Valuación" col="val" tip="Múltiplos vs histórico" center />
                </>)}

                <Th label="Momentum" col="mom" tip="Impulso de precio" center />
                <Th label="Analistas" col="an" tip="Consenso Wall St." center />
                <th style={{ padding:"6px 8px", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, width:36 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const mb      = mktBadge[e.mkt] || mktBadge.US;
                const lp      = livePrices[e.t];
                const hasHist = !!liveHistory[e.t];
                const histLoading = !hasHist && quotesComplete && histStatus !== "error";
                const ud      = e._up;
                const udStr   = ud !== null ? `${ud >= 0 ? "+" : ""}${ud.toFixed(1)}%` : null;
                const upCat   = e.up;

                return (
                  <tr key={e.t}
                    style={{ borderBottom:`1px solid ${t.brd}44`, transition:"background .1s" }}
                    onMouseEnter={ev=>ev.currentTarget.style.background=t.alt}
                    onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>

                    {/* # */}
                    <td style={{ padding:"7px 8px", fontSize:10, color:t.fa, textAlign:"center", width:30 }}>
                      {e.sc ? i+1 : "—"}
                    </td>

                    {/* Ticker + empresa + mercado */}
                    <td style={{ padding:"7px 10px", minWidth:170 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{
                          width:28, height:28, borderRadius:6, flexShrink:0,
                          background:mb.bg, display:"flex", alignItems:"center",
                          justifyContent:"center", fontSize:14,
                        }}>{mb.label}</div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:t.tx }}>{e.t}</span>
                            {lp && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} title="Precio en vivo"/>}
                          </div>
                          <div style={{ fontSize:10, color:t.mu, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.e}</div>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:t.tx }}>
                        {e.cur==="ARS" ? `$${e.p.toLocaleString("es-AR")}` : `$${e.p.toFixed(2)}`}
                      </div>
                    </td>

                    {/* Hoy 1D% */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e._1d !== null
                        ? <span style={{ fontSize:12, fontWeight:600, color:perfColor(e._1d) }}>{perfFmt(e._1d)}</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Score */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e.sc !== null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
                          <div style={{ width:32, height:4, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                            <div style={{ width:`${e.sc}%`, height:"100%", borderRadius:3,
                              background:e.sc>=70?t.grAcc:e.sc>=40?t.go:t.rdAcc }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:800, color:e.sc>=70?t.gr:e.sc>=40?t.go:t.rd }}>
                            {e.sc.toFixed(1)}
                          </span>
                        </div>
                      ) : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* PERFORMANCE VIEW */}
                    {viewMode === "perf" ? (<>
                      <PerfCell val={e.s1}   loading={histLoading && e.s1===null} />
                      <PerfCell val={e.m1}   loading={histLoading && e.m1===null} />
                      <PerfCell val={e.ytd}  loading={histLoading && e.ytd===null} />
                      <PerfCell val={e._d52} loading={histLoading && e._d52===null} />
                      {/* Target */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Potencial */}
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <div>
                            <span style={{ fontSize:12, fontWeight:700, color:ud>=0?t.gr:t.rd }}>{udStr}</span>
                            {upCat && <div style={{ fontSize:9, color:t.mu, marginTop:1 }}>{upCat}</div>}
                          </div>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>) : (<>
                      {/* FUNDAMENTALS VIEW */}
                      {/* Target */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Potencial */}
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <span style={{ fontSize:12, fontWeight:700, color:ud>=0?t.gr:t.rd }}>{udStr}</span>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Fwd P/E */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.fpe ? <span style={{ color:e.fpe<20?t.gr:e.fpe<35?t.mu:t.rd }}>{e.fpe}</span>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* ROIC-WACC */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.rw !== null
                          ? <span style={{ fontWeight:600, color:e.rw>=0?t.gr:t.rd }}>{e.rw>=0?"+":""}{e.rw}%</span>
                          : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Calidad */}
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.cal ? <Badge c={calColor[e.cal]||"gray"} sm t={t}>{e.cal}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Valuación */}
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.val ? <Badge c={valColor[e.val]||"gray"} sm t={t}>{e.val}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>)}

                    {/* Momentum — siempre visible */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.mom ? <Badge c={momColor[e.mom]||"gray"} sm t={t}>{e.mom}</Badge>
                             : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Analistas */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.an ? <Badge c={e.an==="BUY"?"green":"gold"} sm t={t}>{e.an}</Badge>
                            : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Chart */}
                    <td style={{ padding:"7px 6px", textAlign:"center" }}>
                      <button onClick={()=>window.__goChart?.(e.t)}
                        style={{ width:26, height:26, borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center",
                          background:t.alt, border:`1px solid ${t.brd}`, color:t.mu, transition:"all .15s", cursor:"pointer" }}
                        onMouseEnter={ev=>{ev.currentTarget.style.background=t.goBg;ev.currentTarget.style.borderColor=t.go;ev.currentTarget.style.color=t.go;}}
                        onMouseLeave={ev=>{ev.currentTarget.style.background=t.alt;ev.currentTarget.style.borderColor=t.brd;ev.currentTarget.style.color=t.mu;}}>
                        <LineChart size={13} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding:"8px 18px", borderTop:`1px solid ${t.brd}`,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8
        }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            Precios y datos en vivo · Research Desk
          </span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            {filtered.length} resultados · Ordenado por {sortCol} {sortDir === 1 ? "↑" : "↓"}
          </span>
        </div>
      </Card>
    </div>
  );
}
/* ════════════════════════════════════════════════════════════════
   CALCULADORA RENTA FIJA ARS
   Monto + Instrumento (LECAP live) + Comisión → Resultado
════════════════════════════════════════════════════════════════ */
function RentaFijaCalc({ instrumentos, t }) {
  const [monto, setMonto] = useState(1000000);
  const [selTicker, setSelTicker] = useState(instrumentos[0]?.ticker || "");
  const [comision, setComision] = useState(0.5);
  const [open, setOpen] = useState(false);

  const inst = instrumentos.find(i => i.ticker === selTicker) || instrumentos[0];
  if (!inst) return null;

  // Cálculos
  const montoNum = parseFloat(String(monto).replace(/\./g,"").replace(",",".")) || 0;
  const comPct = parseFloat(String(comision).replace(",",".")) || 0;

  const rendBruto = montoNum * (inst.rendimiento / 100);
  const costoComision = montoNum * (comPct / 100);
  const rendNeto = rendBruto - costoComision;
  const montoFinal = montoNum + rendNeto;
  const tnaEfectiva = inst.diasRest > 0 ? (rendNeto / montoNum) * (365 / inst.diasRest) * 100 : 0;

  const fmtARS = (v) => `$${Math.round(v).toLocaleString("es-AR")}`;

  return (
    <Card t={t} style={{ marginBottom:20, borderLeft:`4px solid ${t.go}` }}>
      <div style={{ padding:"18px 20px" }}>
        <button onClick={()=>setOpen(o=>!o)} style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%",
          background:"none", border:"none", cursor:"pointer", padding:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:t.goBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PieChart size={18} color={t.go} />
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>Calculadora de Rendimiento</div>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Simulá tu inversión en LECAPs y BONCAPs con datos en vivo</div>
            </div>
          </div>
          <div style={{ transform:open?"rotate(180deg)":"rotate(0deg)", transition:"transform .2s", color:t.mu }}>
            <ChevronDown size={20} />
          </div>
        </button>

        {open && (
          <div style={{ marginTop:18, borderTop:`1px solid ${t.brd}`, paddingTop:18 }}>
            {/* Inputs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:18 }}>

              {/* Monto */}
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                  Monto a invertir (ARS)
                </label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontFamily:FB, fontSize:13, color:t.mu }}>$</span>
                  <input
                    type="text"
                    value={monto.toLocaleString("es-AR")}
                    onChange={e => {
                      const raw = e.target.value.replace(/\./g,"").replace(/[^0-9]/g,"");
                      setMonto(parseInt(raw) || 0);
                    }}
                    style={{
                      width:"100%", padding:"10px 12px 10px 24px", borderRadius:10,
                      fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`,
                      background:t.srf, color:t.tx, outline:"none",
                    }}
                    onFocus={e=>e.target.style.borderColor=t.go}
                    onBlur={e=>e.target.style.borderColor=t.brd}
                  />
                </div>
              </div>

              {/* Instrumento */}
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                  Instrumento
                </label>
                <select
                  value={selTicker}
                  onChange={e=>setSelTicker(e.target.value)}
                  style={{
                    width:"100%", padding:"10px 12px", borderRadius:10,
                    fontFamily:FB, fontSize:13, border:`1.5px solid ${t.brd}`,
                    background:t.srf, color:t.tx, outline:"none", cursor:"pointer",
                  }}
                  onFocus={e=>e.target.style.borderColor=t.go}
                  onBlur={e=>e.target.style.borderColor=t.brd}
                >
                  {instrumentos.map(i => (
                    <option key={i.ticker} value={i.ticker}>
                      {i.ticker} — Vto. {i.vto} — TNA {i.tna.toFixed(2)}% — {i.diasRest}d
                    </option>
                  ))}
                </select>
              </div>

              {/* Comisión */}
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                  Comisión (%)
                </label>
                <div style={{ position:"relative" }}>
                  <input
                    type="text"
                    value={comision}
                    onChange={e=>setComision(e.target.value)}
                    style={{
                      width:"100%", padding:"10px 12px", borderRadius:10,
                      fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`,
                      background:t.srf, color:t.tx, outline:"none",
                    }}
                    onFocus={e=>e.target.style.borderColor=t.go}
                    onBlur={e=>e.target.style.borderColor=t.brd}
                  />
                  <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontFamily:FB, fontSize:13, color:t.mu }}>%</span>
                </div>
              </div>
            </div>

            {/* Instrument details chip */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
              {[
                { label:"Ticker", value:inst.ticker, color:t.go },
                { label:"TNA", value:`${inst.tna.toFixed(2)}%`, color:t.go },
                { label:"TEM", value:`${inst.tem.toFixed(2)}%`, color:t.bl },
                { label:"Rendim.", value:`${inst.rendimiento.toFixed(2)}%`, color:t.gr },
                { label:"Días rest.", value:`${inst.diasRest}d`, color:inst.diasRest<=30?t.rd:inst.diasRest<=90?t.go:t.mu },
                { label:"Precio teórico", value:`$${inst.pLive.toFixed(2)}`, color:t.tx },
              ].map((c,i) => (
                <div key={i} style={{ background:t.alt, borderRadius:8, padding:"5px 12px", fontFamily:FB }}>
                  <span style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".06em" }}>{c.label}: </span>
                  <span style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.value}</span>
                </div>
              ))}
            </div>

            {/* Results */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
              <div style={{ background:t.goBg, border:`1px solid ${t.go}22`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.go, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>RENDIMIENTO BRUTO</div>
                <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:t.go, lineHeight:1 }}>{fmtARS(rendBruto)}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{inst.rendimiento.toFixed(2)}% en {inst.diasRest} días</div>
              </div>
              <div style={{ background:t.rdBg, border:`1px solid ${t.rd}22`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.rd, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>COMISIÓN</div>
                <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:t.rd, lineHeight:1 }}>-{fmtARS(costoComision)}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{comPct}% sobre capital</div>
              </div>
              <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>RENDIMIENTO NETO</div>
                <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:rendNeto>=0?t.gr:t.rd, lineHeight:1 }}>{fmtARS(rendNeto)}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>TNA neta: {tnaEfectiva.toFixed(2)}%</div>
              </div>
              <div style={{ background:t.blBg, border:`1px solid ${t.bl}22`, borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.bl, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>MONTO FINAL</div>
                <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:t.bl, lineHeight:1 }}>{fmtARS(montoFinal)}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>Al vencimiento ({inst.vto})</div>
              </div>
            </div>

            <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12 }}>
              * Cálculo estimativo basado en precio teórico. No incluye spread bid/ask ni impuestos. No constituye asesoramiento.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   INSTRUMENTOS VIEW — tabs: LECAP | Soberanos | Corp | PF | RV
════════════════════════════════════════════════════════════════ */
/* ── Calcula YTM via bisección numérica (Newton aproximado) ── */
function calcBondMetrics(s, livePrice) {
  const baseP = parseFloat(s.p.replace("$","").replace(".","").replace(",","."));
  const price  = livePrice || baseP;
  const isLive = !!livePrice;

  // ── TIR por aproximación de duración modificada ───────────────
  let newTIR = null;
  if (s.tir !== "—") {
    const baseTIR = parseFloat(s.tir.replace("%","").replace(",","."))/100;
    const modDur  = s.dur / (1 + baseTIR / 2);
    const dTIR    = (baseP - price) / (baseP * modDur) * 100;
    newTIR = baseTIR * 100 + dTIR;
  }

  // ── Current Yield = cupón anual $ / precio live ───────────────
  let newCY = null;
  if (s.cy !== "—") {
    const baseCY = parseFloat(s.cy.replace("%","").replace(",","."))/100;
    const annualCouponUSD = baseCY * baseP;
    newCY = (annualCouponUSD / price) * 100;
  }

  // ── Paridad = precio / VT fijo ────────────────────────────────
  let newPar = null;
  if (s.par !== "—") {
    const basePar = parseFloat(s.par.replace("%","").replace(",","."))/100;
    const vtFixed = baseP / basePar;
    newPar = (price / vtFixed) * 100;
  }

  const varVsBase = ((price - baseP) / baseP * 100);
  return { price, isLive, newTIR, newCY, newPar, varVsBase };
}

/* ════════════════════════════════════════════════════════════════
   CALCULADORA DE SOBERANOS USD — v2
   Schedules reales por bono (prospectos restructuración 2020)
════════════════════════════════════════════════════════════════ */

// Genera pagos mensuales de cupón para AO27D (bullet)
// AO27: cupón 3% anual = 0.25% mensual, bullet Oct 2027, paga último día hábil del mes
const _ao27Flows = (() => {
  const out = [];
  const lastDay = (y,m) => new Date(y,m,0).getDate();
  let y = 2026, m = 4;
  while (!(y === 2027 && m === 11)) {
    const isLast = y === 2027 && m === 10;
    out.push({ date:`${y}-${String(m).padStart(2,"0")}-${lastDay(y,m)}`, cpn:0.25, amort: isLast ? 100 : 0 });
    m++; if (m > 12) { m = 1; y++; }
  }
  return out;
})();

// AO28: cupón 6% anual = 0.50% mensual, bullet Oct 2028, paga último día hábil del mes
const _ao28Flows = (() => {
  const out = [];
  const lastDay = (y,m) => new Date(y,m,0).getDate();
  let y = 2026, m = 5; // first coupon May 2026
  while (!(y === 2028 && m === 11)) {
    const isLast = y === 2028 && m === 10;
    out.push({ date:`${y}-${String(m).padStart(2,"0")}-${lastDay(y,m)}`, cpn:0.50, amort: isLast ? 100 : 0 });
    m++; if (m > 12) { m = 1; y++; }
  }
  return out;
})();

// Schedules verificados contra prospectos de restructuración 2020
// Cupones en USD por cada $100 VN outstanding en cada período
// ── HISTORIAL: pagos realizados desde emisión (Sep 2020) ────────
// Jan 9 y Jul 9 de cada año. Datos extraídos de prospectos MECON.
// Step-up GD30/AL30: 0.125% sem. años 1-5 (sep20-sep25) → 0.25% año 6+
const _sovHistSemi = (cpnConst, fromYear=2021, toYear=2026, toMonth=1) => {
  const out = [];
  for (let y = fromYear; y <= toYear; y++) {
    const months = y === fromYear ? [1,7] : y === toYear ? [1] : [1,7];
    for (const m of months) {
      if (y === toYear && m > toMonth) break;
      out.push({ date:`${y}-${String(m).padStart(2,"0")}-09`, cpn:cpnConst, amort:0 });
    }
  }
  return out;
};
// AL30/GD30 step-up histórico: 0.125% hasta Jul-2025, 0.25% desde Ene-2026
const _al30HistFlows = [
  ...[2021,2022,2023,2024].flatMap(y=>[
    {date:`${y}-01-09`,cpn:0.125,amort:0},
    {date:`${y}-07-09`,cpn:0.125,amort:0},
  ]),
  {date:"2025-01-09",cpn:0.125,amort:0},
  {date:"2025-07-09",cpn:0.125,amort:0},  // Año 5 aún
  {date:"2026-01-09",cpn:0.25,amort:0},   // Año 6 comienza Sep 2025
];

const BOND_SCHEDULES = {
  // AO27D — Bonar 2027 · Ley ARG · cupón 3% anual mensual · BULLET Oct-2027
  "AO27D": _ao27Flows,

  // AO28D — Bonar 2028 · Ley ARG · cupón 6% anual mensual · BULLET Oct-2028
  "AO28D": _ao28Flows,

  // AL29D — Bonar 2029 · Ley ARG · step-up · amort 4x25% Jul27-Ene29
  // Cupón: 0.5% sem sobre outstanding restante
  "AL29D": [
    // ── Historial desde emisión Sep 2020 ──
    ..._sovHistSemi(0.50, 2021, 2026, 1),
    // ── Flujos futuros ──
    {date:"2026-07-09",cpn:0.50,amort:0},
    {date:"2027-01-09",cpn:0.50,amort:0},
    {date:"2027-07-09",cpn:0.50,amort:25},
    {date:"2028-01-09",cpn:0.375,amort:25},
    {date:"2028-07-09",cpn:0.250,amort:25},
    {date:"2029-01-09",cpn:0.125,amort:25},
  ],

  // AN29D — Bonar Nov 2029 · Ley ARG · 3.5% anual · BULLET Nov-2029
  "AN29D": [
    {date:"2026-05-09",cpn:1.75,amort:0},{date:"2026-11-09",cpn:1.75,amort:0},
    {date:"2027-05-09",cpn:1.75,amort:0},{date:"2027-11-09",cpn:1.75,amort:0},
    {date:"2028-05-09",cpn:1.75,amort:0},{date:"2028-11-09",cpn:1.75,amort:0},
    {date:"2029-05-09",cpn:1.75,amort:0},{date:"2029-11-09",cpn:1.75,amort:100},
  ],

  // AL30D — Bonar 2030 · Ley ARG · step-up · amort 4x25%
  "AL30D": [
    // ── Historial: step-up 0.125% sem años 1-5, 0.25% año 6+ ──
    ..._al30HistFlows,
    // ── Flujos futuros ──
    {date:"2026-07-09",cpn:0.25,amort:0},{date:"2027-01-09",cpn:0.25,amort:25},
    {date:"2027-07-09",cpn:0.375,amort:25},{date:"2028-01-09",cpn:0.50,amort:25},
    {date:"2028-07-09",cpn:0.75,amort:0},{date:"2029-01-09",cpn:0.75,amort:0},
    {date:"2029-07-09",cpn:0.75,amort:0},{date:"2030-01-09",cpn:0.75,amort:0},
    {date:"2030-07-09",cpn:0.75,amort:25},
  ],

  // AL35D — Bonar 2035 · Ley ARG · 3.625% · amort desde Ene-2029
  "AL35D": [
    // ── Historial desde emisión Sep 2020 · 1.8125% sem constante ──
    ..._sovHistSemi(1.8125, 2021, 2026, 1),
    // ── Flujos futuros ──
    {date:"2026-07-09",cpn:1.8125,amort:0},{date:"2027-01-09",cpn:1.8125,amort:0},
    {date:"2027-07-09",cpn:1.8125,amort:0},{date:"2028-01-09",cpn:1.8125,amort:0},
    {date:"2028-07-09",cpn:1.8125,amort:0},{date:"2029-01-09",cpn:1.8125,amort:14.29},
    {date:"2029-07-09",cpn:1.556,amort:14.29},{date:"2030-01-09",cpn:1.300,amort:14.29},
    {date:"2030-07-09",cpn:1.043,amort:14.29},{date:"2031-01-09",cpn:0.786,amort:14.29},
    {date:"2031-07-09",cpn:0.530,amort:14.29},{date:"2032-01-09",cpn:0.273,amort:14.27},
  ],

  // AE38D — Bonar 2038 · Ley ARG · 3.875% · amort 8x12.5% desde Ene-2031
  "AE38D": [
    // ── Historial desde emisión Sep 2020 · 1.9375% sem constante ──
    ..._sovHistSemi(1.9375, 2021, 2026, 1),
    // ── Flujos futuros ──
    {date:"2026-07-09",cpn:1.9375,amort:0},{date:"2027-01-09",cpn:1.9375,amort:0},
    {date:"2027-07-09",cpn:1.9375,amort:0},{date:"2028-01-09",cpn:1.9375,amort:0},
    {date:"2028-07-09",cpn:1.9375,amort:0},{date:"2029-01-09",cpn:1.9375,amort:0},
    {date:"2029-07-09",cpn:1.9375,amort:0},{date:"2030-01-09",cpn:1.9375,amort:0},
    {date:"2030-07-09",cpn:1.9375,amort:0},{date:"2031-01-09",cpn:1.9375,amort:12.5},
    {date:"2031-07-09",cpn:1.6953,amort:12.5},{date:"2032-01-09",cpn:1.4531,amort:12.5},
    {date:"2032-07-09",cpn:1.2109,amort:12.5},{date:"2033-01-09",cpn:0.9688,amort:12.5},
    {date:"2033-07-09",cpn:0.7266,amort:12.5},{date:"2034-01-09",cpn:0.4844,amort:12.5},
    {date:"2034-07-09",cpn:0.2422,amort:12.5},{date:"2035-01-09",cpn:0.10,amort:12.5},
  ],

  // AL41D — Bonar 2041 · Ley ARG · 4.125% · amort 8x12.5% desde Jul-2027
  "AL41D": [
    // ── Historial desde emisión Sep 2020 · 2.0625% sem constante ──
    ..._sovHistSemi(2.0625, 2021, 2026, 1),
    // ── Flujos futuros ──
    {date:"2026-07-09",cpn:2.0625,amort:0},{date:"2027-01-09",cpn:2.0625,amort:0},
    {date:"2027-07-09",cpn:2.0625,amort:12.5},{date:"2028-01-09",cpn:1.8047,amort:12.5},
    {date:"2028-07-09",cpn:1.5469,amort:12.5},{date:"2029-01-09",cpn:1.2891,amort:12.5},
    {date:"2029-07-09",cpn:1.0313,amort:12.5},{date:"2030-01-09",cpn:0.7734,amort:12.5},
    {date:"2030-07-09",cpn:0.5156,amort:12.5},{date:"2031-01-09",cpn:0.2578,amort:12.5},
  ],

  // GD29D — Global 2029 · Ley NY · idéntico a AL29D
  "GD29D": [
    ..._sovHistSemi(0.50, 2021, 2026, 1),
    {date:"2026-07-09",cpn:0.50,amort:0},{date:"2027-01-09",cpn:0.50,amort:0},
    {date:"2027-07-09",cpn:0.50,amort:25},{date:"2028-01-09",cpn:0.375,amort:25},
    {date:"2028-07-09",cpn:0.250,amort:25},{date:"2029-01-09",cpn:0.125,amort:25},
  ],

  // GD30D — Global 2030 · Ley NY · step-up · amort 4x25%
  "GD30D": [
    ..._al30HistFlows,
    {date:"2026-07-09",cpn:0.25,amort:0},{date:"2027-01-09",cpn:0.25,amort:25},
    {date:"2027-07-09",cpn:0.375,amort:25},{date:"2028-01-09",cpn:0.50,amort:25},
    {date:"2028-07-09",cpn:0.75,amort:0},{date:"2029-01-09",cpn:0.75,amort:0},
    {date:"2029-07-09",cpn:0.75,amort:0},{date:"2030-01-09",cpn:0.75,amort:0},
    {date:"2030-07-09",cpn:0.75,amort:25},
  ],

  // GD35D — Global 2035 · Ley NY · 3.625% · idéntico a AL35D
  "GD35D": [
    ..._sovHistSemi(1.8125, 2021, 2026, 1),
    {date:"2026-07-09",cpn:1.8125,amort:0},{date:"2027-01-09",cpn:1.8125,amort:0},
    {date:"2027-07-09",cpn:1.8125,amort:0},{date:"2028-01-09",cpn:1.8125,amort:0},
    {date:"2028-07-09",cpn:1.8125,amort:0},{date:"2029-01-09",cpn:1.8125,amort:14.29},
    {date:"2029-07-09",cpn:1.556,amort:14.29},{date:"2030-01-09",cpn:1.300,amort:14.29},
    {date:"2030-07-09",cpn:1.043,amort:14.29},{date:"2031-01-09",cpn:0.786,amort:14.29},
    {date:"2031-07-09",cpn:0.530,amort:14.29},{date:"2032-01-09",cpn:0.273,amort:14.27},
  ],

  // GD38D — Global 2038 · Ley NY · 3.875% · idéntico a AE38D
  "GD38D": [
    ..._sovHistSemi(1.9375, 2021, 2026, 1),
    {date:"2026-07-09",cpn:1.9375,amort:0},{date:"2027-01-09",cpn:1.9375,amort:0},
    {date:"2027-07-09",cpn:1.9375,amort:0},{date:"2028-01-09",cpn:1.9375,amort:0},
    {date:"2028-07-09",cpn:1.9375,amort:0},{date:"2029-01-09",cpn:1.9375,amort:0},
    {date:"2029-07-09",cpn:1.9375,amort:0},{date:"2030-01-09",cpn:1.9375,amort:0},
    {date:"2030-07-09",cpn:1.9375,amort:0},{date:"2031-01-09",cpn:1.9375,amort:12.5},
    {date:"2031-07-09",cpn:1.6953,amort:12.5},{date:"2032-01-09",cpn:1.4531,amort:12.5},
    {date:"2032-07-09",cpn:1.2109,amort:12.5},{date:"2033-01-09",cpn:0.9688,amort:12.5},
    {date:"2033-07-09",cpn:0.7266,amort:12.5},{date:"2034-01-09",cpn:0.4844,amort:12.5},
    {date:"2034-07-09",cpn:0.2422,amort:12.5},{date:"2035-01-09",cpn:0.10,amort:12.5},
  ],

  // GD41D — Global 2041 · Ley NY · 4.125% · idéntico a AL41D
  "GD41D": [
    ..._sovHistSemi(2.0625, 2021, 2026, 1),
    {date:"2026-07-09",cpn:2.0625,amort:0},{date:"2027-01-09",cpn:2.0625,amort:0},
    {date:"2027-07-09",cpn:2.0625,amort:12.5},{date:"2028-01-09",cpn:1.8047,amort:12.5},
    {date:"2028-07-09",cpn:1.5469,amort:12.5},{date:"2029-01-09",cpn:1.2891,amort:12.5},
    {date:"2029-07-09",cpn:1.0313,amort:12.5},{date:"2030-01-09",cpn:0.7734,amort:12.5},
    {date:"2030-07-09",cpn:0.5156,amort:12.5},{date:"2031-01-09",cpn:0.2578,amort:12.5},
  ],

  // GD46D — Global 2046 · Ley NY · 4.25% anual · BULLET Jul-2046
  "GD46D": [
    ...[2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,
        2039,2040,2041,2042,2043,2044,2045].flatMap(y => [
      {date:`${y}-01-09`,cpn:2.125,amort:0},
      {date:`${y}-07-09`,cpn:2.125,amort:0},
    ]),
    {date:"2046-01-09",cpn:2.125,amort:0},
    {date:"2046-07-09",cpn:2.125,amort:100},
  ],
};

// TIR por bisección — convención anual sobre días reales
function calcSovTIR(priceWithCom, flows) {
  if (!flows || flows.length === 0) return null;
  const today = new Date();
  const fdays = flows
    .filter(f => new Date(f.date) > today)
    .map(f => ({ d: Math.max(1, Math.round((new Date(f.date)-today)/86400000)), cf: f.cpn+f.amort }));
  if (fdays.length === 0) return null;
  const fn = r => fdays.reduce((s,{d,cf}) => s + cf/Math.pow(1+r, d/365), 0) - priceWithCom;
  let lo=-0.5, hi=4.0;
  for (let i=0; i<120; i++) {
    const m=(lo+hi)/2;
    if (fn(m)>0) lo=m; else hi=m;
    if (hi-lo<1e-9) break;
  }
  return (lo+hi)/2;
}

/* ════════════════════════════════════════════════════════════════
   SVG YIELD CURVE — SOBERANOS USD
   X = Duration modificada · Y = TIR (%)
   Gold = Ley ARG · Blue = Ley NY
════════════════════════════════════════════════════════════════ */
function SovYieldCurve({ t, bondPrices }) {
  const [hover, setHover] = useState(null);
  const W=700, H=320, pad={t:35,r:35,b:52,l:56};
  const iW=W-pad.l-pad.r, iH=H-pad.t-pad.b;

  const pts = SOBERANOS.filter(s=>!s.nuevo).map(s => {
    const liveRaw = (bondPrices[s.t] || bondPrices[s.t.replace("D","")]||{}).price||null;
    const m = calcBondMetrics(s, liveRaw);
    const tir = m.newTIR !== null ? m.newTIR : parseFloat(String(s.tir).replace(",",".").replace("%",""));
    if (!tir || isNaN(tir) || tir<=0) return null;
    return { ticker:s.t, dur:s.dur, tir, ley:s.ley, price:m.price, isLive:m.isLive };
  }).filter(Boolean);

  if (pts.length < 3) return null;

  const durs = pts.map(p=>p.dur), tirs = pts.map(p=>p.tir);
  const dMin=Math.floor(Math.min(...durs)*0.7), dMax=Math.ceil(Math.max(...durs)*1.05);
  const tMin=Math.floor(Math.min(...tirs)-1), tMax=Math.ceil(Math.max(...tirs)+0.5);

  const sx = d => pad.l + ((d-dMin)/(dMax-dMin))*iW;
  const sy = v => pad.t + (1-(v-tMin)/(tMax-tMin))*iH;

  const argPts = pts.filter(p=>p.ley==="ARG").sort((a,b)=>a.dur-b.dur);
  const nyPts  = pts.filter(p=>p.ley==="NY").sort((a,b)=>a.dur-b.dur);

  // Smooth curve path
  const smoothLine = arr => {
    if (arr.length < 2) return "";
    let d = `M${sx(arr[0].dur).toFixed(1)},${sy(arr[0].tir).toFixed(1)}`;
    for (let i=1; i<arr.length; i++) {
      const cx = (sx(arr[i-1].dur) + sx(arr[i].dur)) / 2;
      d += ` C${cx.toFixed(1)},${sy(arr[i-1].tir).toFixed(1)} ${cx.toFixed(1)},${sy(arr[i].tir).toFixed(1)} ${sx(arr[i].dur).toFixed(1)},${sy(arr[i].tir).toFixed(1)}`;
    }
    return d;
  };
  const areaPath = (arr, col) => {
    if (arr.length < 2) return null;
    const linePath = smoothLine(arr);
    const lastX = sx(arr[arr.length-1].dur), firstX = sx(arr[0].dur), bottom = H-pad.b;
    return linePath + ` L${lastX.toFixed(1)},${bottom} L${firstX.toFixed(1)},${bottom} Z`;
  };

  const yTicks = [];
  for (let v=Math.ceil(tMin); v<=Math.floor(tMax); v++) yTicks.push(v);
  const xTicks = [];
  for (let d=Math.ceil(dMin); d<=Math.floor(dMax); d++) xTicks.push(d);

  const hp = hover !== null ? pts[hover] : null;
  const ttX = hp ? Math.min(sx(hp.dur)+14, W-145) : 0;
  const ttY = hp ? Math.max(sy(hp.tir)-55, 5) : 0;

  return (
    <Card t={t} style={{ marginBottom:16 }}>
      <div style={{ padding:"18px 22px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
          <Activity size={16} color={t.go} />
          <span style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx }}>Curva de Rendimiento</span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>Soberanos USD · TIR vs Duration</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <span style={{ fontSize:9, fontFamily:FB, color:t.go, background:t.goBg, padding:"3px 10px", borderRadius:10, fontWeight:600 }}>● Ley ARG</span>
            <span style={{ fontSize:9, fontFamily:FB, color:t.bl, background:t.blBg, padding:"3px 10px", borderRadius:10, fontWeight:600 }}>● Ley NY</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", maxHeight:320, fontFamily:FB }}>
          <defs>
            <linearGradient id="sovGradARG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.go} stopOpacity="0.12"/><stop offset="100%" stopColor={t.go} stopOpacity="0.01"/></linearGradient>
            <linearGradient id="sovGradNY" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.bl} stopOpacity="0.12"/><stop offset="100%" stopColor={t.bl} stopOpacity="0.01"/></linearGradient>
            <filter id="sovShadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/></filter>
          </defs>
          {/* Axes */}
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H-pad.b} stroke={t.brd} strokeWidth={1}/>
          <line x1={pad.l} y1={H-pad.b} x2={W-pad.r} y2={H-pad.b} stroke={t.brd} strokeWidth={1}/>
          {/* Grid */}
          {yTicks.map(v=><g key={`y${v}`}><line x1={pad.l+1} y1={sy(v)} x2={W-pad.r} y2={sy(v)} stroke={t.brd} strokeDasharray="2,4" strokeWidth={0.4}/><text x={pad.l-8} y={sy(v)+3} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text></g>)}
          {xTicks.map(d=><g key={`x${d}`}><line x1={sx(d)} y1={pad.t} x2={sx(d)} y2={H-pad.b-1} stroke={t.brd} strokeDasharray="2,4" strokeWidth={0.4}/><text x={sx(d)} y={H-pad.b+16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}a</text></g>)}
          <text x={W/2} y={H-6} textAnchor="middle" fontSize={10} fill={t.mu} fontWeight={500}>Duration Modificada (años)</text>
          <text x={14} y={H/2} textAnchor="middle" fontSize={10} fill={t.mu} fontWeight={500} transform={`rotate(-90,14,${H/2})`}>TIR (%)</text>
          {/* Area fills */}
          {argPts.length>1 && <path d={areaPath(argPts)} fill="url(#sovGradARG)"/>}
          {nyPts.length>1 && <path d={areaPath(nyPts)} fill="url(#sovGradNY)"/>}
          {/* Smooth curves */}
          {argPts.length>1 && <path d={smoothLine(argPts)} fill="none" stroke={t.go} strokeWidth={2.5} opacity={0.8} strokeLinecap="round"/>}
          {nyPts.length>1 && <path d={smoothLine(nyPts)} fill="none" stroke={t.bl} strokeWidth={2.5} opacity={0.8} strokeLinecap="round"/>}
          {/* Crosshair on hover */}
          {hp && <>
            <line x1={sx(hp.dur)} y1={pad.t} x2={sx(hp.dur)} y2={H-pad.b} stroke={t.mu} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4}/>
            <line x1={pad.l} y1={sy(hp.tir)} x2={W-pad.r} y2={sy(hp.tir)} stroke={t.mu} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4}/>
          </>}
          {/* Points */}
          {pts.map((p,i) => {
            const col = p.ley==="ARG"?t.go:t.bl;
            const isH = hover===i;
            return (
              <g key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{cursor:"pointer"}}>
                {isH && <circle cx={sx(p.dur)} cy={sy(p.tir)} r={12} fill={col} opacity={0.12}/>}
                <circle cx={sx(p.dur)} cy={sy(p.tir)} r={isH?5.5:4} fill={col} stroke="#fff" strokeWidth={2}/>
                <text x={sx(p.dur)} y={sy(p.tir)-10} textAnchor="middle" fontSize={8} fontWeight={700} fill={col} opacity={isH?1:0.75}>{p.ticker.replace("D","")}</text>
              </g>
            );
          })}
          {/* Tooltip */}
          {hp && (
            <g filter="url(#sovShadow)">
              <rect x={ttX} y={ttY} width={135} height={52} rx={8} fill={t.srf} stroke={t.brd} strokeWidth={1}/>
              <text x={ttX+10} y={ttY+16} fontSize={10} fontWeight={700} fill={t.tx}>{hp.ticker} · Ley {hp.ley}</text>
              <text x={ttX+10} y={ttY+30} fontSize={9} fill={t.mu}>TIR: <tspan fontWeight={700} fill={hp.ley==="ARG"?t.go:t.bl}>{hp.tir.toFixed(2)}%</tspan> · Dur: {hp.dur.toFixed(2)}</text>
              <text x={ttX+10} y={ttY+43} fontSize={9} fill={hp.isLive?t.gr:t.fa}>{hp.isLive?"Live":"Base"}: ${hp.price.toFixed(2)}</text>
            </g>
          )}
        </svg>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SVG YIELD CURVE — RENTA FIJA ARS (LECAPs / BONCAPs / DL)
════════════════════════════════════════════════════════════════ */
function LecapYieldCurve({ t, points }) {
  const [hover, setHover] = useState(null);
  if (!points || points.length < 3) return null;

  const W=700, H=300, pad={t:35,r:35,b:52,l:56};
  const iW=W-pad.l-pad.r, iH=H-pad.t-pad.b;

  const dias = points.map(p=>p.dias), tnas = points.map(p=>p.tna);
  const dMin=0, dMax=Math.ceil(Math.max(...dias)*1.08);
  const tMin=Math.floor(Math.min(...tnas)-1), tMax=Math.ceil(Math.max(...tnas)+1);

  const sx = d => pad.l + ((d-dMin)/(dMax-dMin))*iW;
  const sy = v => pad.t + (1-(v-tMin)/(tMax-tMin))*iH;

  const typeColor = { S:t.go, T:t.bl, X:t.pu };
  const typeLabel = { S:"LECAP", T:"BONCAP", X:"Dual/DL" };

  const byType = {};
  points.forEach(p => { const k=p.tipo; if(!byType[k]) byType[k]=[]; byType[k].push(p); });
  Object.values(byType).forEach(arr => arr.sort((a,b)=>a.dias-b.dias));

  const smoothLine = arr => {
    if (arr.length < 2) return "";
    let d = `M${sx(arr[0].dias).toFixed(1)},${sy(arr[0].tna).toFixed(1)}`;
    for (let i=1; i<arr.length; i++) {
      const cx = (sx(arr[i-1].dias) + sx(arr[i].dias)) / 2;
      d += ` C${cx.toFixed(1)},${sy(arr[i-1].tna).toFixed(1)} ${cx.toFixed(1)},${sy(arr[i].tna).toFixed(1)} ${sx(arr[i].dias).toFixed(1)},${sy(arr[i].tna).toFixed(1)}`;
    }
    return d;
  };

  const yTicks = [];
  for (let v=Math.ceil(tMin); v<=Math.floor(tMax); v+=2) yTicks.push(v);
  const xTicks = [30,60,90,120,180,270,365,450].filter(d=>d<=dMax);

  const hp = hover !== null ? points[hover] : null;
  const ttX = hp ? Math.min(sx(hp.dias)+14, W-155) : 0;
  const ttY = hp ? Math.max(sy(hp.tna)-50, 5) : 0;

  return (
    <Card t={t} style={{ marginTop:16, marginBottom:16 }}>
      <div style={{ padding:"18px 22px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
          <Activity size={16} color={t.go} />
          <span style={{ fontFamily:FH, fontSize:15, fontWeight:700, color:t.tx }}>Curva de Tasas</span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>Renta Fija ARS · TNA vs Días</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            {Object.entries(typeLabel).map(([k,l])=>(
              <span key={k} style={{ fontSize:9, fontFamily:FB, color:typeColor[k], background:typeColor[k]+"12", padding:"3px 10px", borderRadius:10, fontWeight:600 }}>● {l}</span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", maxHeight:300, fontFamily:FB }}>
          <defs>
            <linearGradient id="lecGradS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.go} stopOpacity="0.1"/><stop offset="100%" stopColor={t.go} stopOpacity="0.01"/></linearGradient>
            <linearGradient id="lecGradT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.bl} stopOpacity="0.1"/><stop offset="100%" stopColor={t.bl} stopOpacity="0.01"/></linearGradient>
            <filter id="lecShadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/></filter>
          </defs>
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H-pad.b} stroke={t.brd} strokeWidth={1}/>
          <line x1={pad.l} y1={H-pad.b} x2={W-pad.r} y2={H-pad.b} stroke={t.brd} strokeWidth={1}/>
          {yTicks.map(v=><g key={`y${v}`}><line x1={pad.l+1} y1={sy(v)} x2={W-pad.r} y2={sy(v)} stroke={t.brd} strokeDasharray="2,4" strokeWidth={0.4}/><text x={pad.l-8} y={sy(v)+3} textAnchor="end" fontSize={9} fill={t.fa}>{v}%</text></g>)}
          {xTicks.map(d=><g key={`x${d}`}><line x1={sx(d)} y1={pad.t} x2={sx(d)} y2={H-pad.b-1} stroke={t.brd} strokeDasharray="2,4" strokeWidth={0.4}/><text x={sx(d)} y={H-pad.b+16} textAnchor="middle" fontSize={9} fill={t.fa}>{d}d</text></g>)}
          <text x={W/2} y={H-6} textAnchor="middle" fontSize={10} fill={t.mu} fontWeight={500}>Días al vencimiento</text>
          <text x={14} y={H/2} textAnchor="middle" fontSize={10} fill={t.mu} fontWeight={500} transform={`rotate(-90,14,${H/2})`}>TNA (%)</text>
          {/* Smooth curves */}
          {Object.entries(byType).map(([k,arr])=>arr.length>1 && <path key={k} d={smoothLine(arr)} fill="none" stroke={typeColor[k]} strokeWidth={2.5} opacity={0.7} strokeLinecap="round"/>)}
          {/* Crosshair */}
          {hp && <>
            <line x1={sx(hp.dias)} y1={pad.t} x2={sx(hp.dias)} y2={H-pad.b} stroke={t.mu} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4}/>
            <line x1={pad.l} y1={sy(hp.tna)} x2={W-pad.r} y2={sy(hp.tna)} stroke={t.mu} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4}/>
          </>}
          {/* Points */}
          {points.map((p,i) => {
            const col = typeColor[p.tipo]||t.go;
            const isH = hover===i;
            return (
              <g key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{cursor:"pointer"}}>
                {isH && <circle cx={sx(p.dias)} cy={sy(p.tna)} r={12} fill={col} opacity={0.12}/>}
                <circle cx={sx(p.dias)} cy={sy(p.tna)} r={isH?5.5:4} fill={col} stroke="#fff" strokeWidth={2}/>
                <text x={sx(p.dias)} y={sy(p.tna)-10} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={col} opacity={isH?1:0.7}>{p.ticker}</text>
              </g>
            );
          })}
          {/* Tooltip */}
          {hp && (
            <g filter="url(#lecShadow)">
              <rect x={ttX} y={ttY} width={148} height={45} rx={8} fill={t.srf} stroke={t.brd} strokeWidth={1}/>
              <text x={ttX+10} y={ttY+16} fontSize={10} fontWeight={700} fill={t.tx}>{hp.ticker} · {typeLabel[hp.tipo]}</text>
              <text x={ttX+10} y={ttY+30} fontSize={9} fill={t.mu}>TNA: <tspan fontWeight={700} fill={typeColor[hp.tipo]}>{hp.tna.toFixed(2)}%</tspan> · {hp.dias}d</text>
              <text x={ttX+10} y={ttY+42} fontSize={9} fill={t.fa}>Precio: ${hp.price?.toFixed(2)||"—"}</text>
            </g>
          )}
        </svg>
      </div>
    </Card>
  );
}

function SoberanosCalc({ t, bondPrices }) {
  const [selTicker, setSelTicker] = useState("GD30D");
  const [monto,     setMonto]     = useState("10000");
  const [comision,  setComision]  = useState("0.5");
  const [precioEdit,setPrecioEdit]= useState("");
  const [open,      setOpen]      = useState(false);
  const [fechaCompra, setFechaCompra] = useState(""); // ISO yyyy-mm-dd, vacío = hoy
  const [showPaid,  setShowPaid]  = useState(false);

  const bond      = SOBERANOS.find(s => s.t === selTicker) || SOBERANOS[0];
  const liveEntry = bondPrices[selTicker];
  const livePrice = liveEntry?.price ?? null;
  const basePrice = livePrice ?? parseFloat(bond.p.replace("$","").replace(",","."));
  const precioUso = precioEdit !== "" ? parseFloat(precioEdit)||basePrice : basePrice;

  const today      = new Date();
  const compraDate = fechaCompra ? new Date(fechaCompra) : today;
  // Todos los flujos del schedule
  const allFlows   = BOND_SCHEDULES[selTicker] || [];
  // Pagados: entre fecha de compra y hoy (exclusive de hoy)
  const paidFlows  = allFlows.filter(f => {
    const d = new Date(f.date);
    return d >= compraDate && d < today;
  });
  // Pendientes: desde hoy en adelante
  const rawFlows   = allFlows.filter(f => new Date(f.date) >= today);

  const montoNum   = parseFloat(monto)||0;
  const comPct     = parseFloat(comision)||0;
  const precioComp = precioUso * (1 + comPct/100);
  const vnComprado = montoNum > 0 ? montoNum / (precioComp/100) : 0;

  const flows = rawFlows.map(f => {
    const cpnUSD   = f.cpn * vnComprado / 100;
    const amortUSD = f.amort * vnComprado / 100;
    const days     = Math.max(1, Math.round((new Date(f.date)-today)/86400000));
    return { ...f, cpnUSD, amortUSD, totalUSD: cpnUSD+amortUSD, days };
  });

  const paidFlowsCalc = paidFlows.map(f => {
    const cpnUSD   = f.cpn * vnComprado / 100;
    const amortUSD = f.amort * vnComprado / 100;
    return { ...f, cpnUSD, amortUSD, totalUSD: cpnUSD+amortUSD };
  });

  const totalCobradoHist = paidFlowsCalc.reduce((a,f) => a+f.totalUSD, 0);
  const totalCobros  = flows.reduce((a,f) => a+f.totalUSD, 0);
  const totalGlobal  = totalCobradoHist + totalCobros;
  const gananciaNeta = totalGlobal - montoNum;
  const gananciaSolo = totalCobros - montoNum; // sin considerar lo ya cobrado
  const retornoPct   = montoNum > 0 ? gananciaNeta/montoNum*100 : 0;
  const tirCalc      = montoNum > 0 ? calcSovTIR(precioComp, rawFlows) : null;
  const tirMercado   = bond.tir !== "—" ? parseFloat(bond.tir.replace("%","").replace(",",".")) : null;

  const fmt2  = n => n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
  const fmtD  = s => new Date(s).toLocaleDateString("es-AR",{day:"numeric",month:"short",year:"numeric"});
  const fmtYr = s => { const d=new Date(s); return `${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][d.getMonth()]} ${d.getFullYear()}`; };

  let acum = totalCobradoHist; // acumulado parte de lo ya cobrado

  return (
    <div style={{ marginTop:28 }}>

      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:t.goBg,border:`1px solid ${t.go}33`,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Target size={18} color={t.go}/>
          </div>
          <div>
            <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase" }}>Calculadora de flujos</div>
            <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>Bonos Soberanos USD</div>
          </div>
        </div>
        <button onClick={()=>setOpen(o=>!o)} style={{
          display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:10, cursor:"pointer",
          fontFamily:FB, fontSize:12, fontWeight:600, transition:"all .18s",
          background: open ? "transparent" : t.go,
          color: open ? t.go : "#fff",
          border:`1.5px solid ${t.go}`,
        }}>
          {open ? <><ChevronUp size={13}/> Cerrar</> : <><Target size={13}/> Calcular flujos</>}
        </button>
      </div>

      {open && (
        <div className="fade-up">

          {/* ── INPUTS ── */}
          <div style={{ background:t.srf, borderRadius:14, border:`1px solid ${t.brd}`, padding:"20px", marginBottom:16 }}>
            <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>
              Parámetros de la operación
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14 }}>

              {/* Bono */}
              <div>
                <label style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>Bono</label>
                <select value={selTicker} onChange={e=>{setSelTicker(e.target.value);setPrecioEdit("");}} style={{
                  width:"100%", padding:"10px 12px", borderRadius:9, fontFamily:FB, fontSize:12, fontWeight:600,
                  border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, cursor:"pointer", outline:"none",
                }}
                onFocus={e=>e.target.style.borderColor=t.go}
                onBlur={e=>e.target.style.borderColor=t.brd}>
                  <optgroup label="🇦🇷 Ley Argentina">
                    {SOBERANOS.filter(s=>s.ley==="ARG").map(s=><option key={s.t} value={s.t}>{s.t} — {s.vto}</option>)}
                  </optgroup>
                  <optgroup label="🇺🇸 Ley Nueva York">
                    {SOBERANOS.filter(s=>s.ley==="NY").map(s=><option key={s.t} value={s.t}>{s.t} — {s.vto}</option>)}
                  </optgroup>
                </select>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:3, display:"flex", gap:6 }}>
                  <span>{bond.pago}</span><span>·</span><span>{bond.ley==="NY"?"Ley NY":"Ley ARG"}</span>
                  {tirMercado && <><span>·</span><span style={{color:t.go}}>TIR ref: {tirMercado.toFixed(2)}%</span></>}
                </div>
              </div>

              {/* Monto */}
              <div>
                <label style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>Inversión (USD)</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontFamily:FB, fontSize:13, fontWeight:600, color:t.mu }}>$</span>
                  <input type="number" value={monto} onChange={e=>setMonto(e.target.value)} min="100" style={{
                    width:"100%", padding:"10px 12px 10px 26px", borderRadius:9, fontFamily:FB, fontSize:13, fontWeight:600,
                    border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none",
                  }}
                  onFocus={e=>e.target.style.borderColor=t.go}
                  onBlur={e=>e.target.style.borderColor=t.brd}/>
                </div>
              </div>

              {/* Precio */}
              <div>
                <label style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>
                  Precio / $100 VN
                  {livePrice && precioEdit==="" && <span style={{ marginLeft:6, background:"#22c55e22", color:"#16a34a", padding:"1px 6px", borderRadius:5, fontSize:8 }}>● LIVE</span>}
                  {precioEdit!=="" && <span style={{ marginLeft:6, background:t.goBg, color:t.go, padding:"1px 6px", borderRadius:5, fontSize:8 }}>SIMULACIÓN</span>}
                </label>
                <input type="number" value={precioEdit!==""?precioEdit:basePrice.toFixed(2)}
                  onChange={e=>setPrecioEdit(e.target.value)} style={{
                  width:"100%", padding:"10px 12px", borderRadius:9, fontFamily:FB, fontSize:13, fontWeight:600,
                  border:`1.5px solid ${precioEdit!==""?t.go:t.brd}`, background:t.srf, color:t.tx, outline:"none",
                }}
                onFocus={e=>e.target.style.borderColor=t.go}
                onBlur={e=>e.target.style.borderColor=precioEdit!==""?t.go:t.brd}/>
                {precioEdit!=="" && (
                  <button onClick={()=>setPrecioEdit("")} style={{ fontFamily:FB, fontSize:9, color:t.go, background:"none", border:"none", cursor:"pointer", marginTop:3, padding:0 }}>
                    ↩ Volver al precio live ({basePrice.toFixed(2)})
                  </button>
                )}
              </div>

              {/* Comisión */}
              <div>
                <label style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>Comisión (%)</label>
                <div style={{ position:"relative" }}>
                  <input type="number" value={comision} onChange={e=>setComision(e.target.value)} min="0" max="5" step="0.1" style={{
                    width:"100%", padding:"10px 36px 10px 12px", borderRadius:9, fontFamily:FB, fontSize:13, fontWeight:600,
                    border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none",
                  }}
                  onFocus={e=>e.target.style.borderColor=t.go}
                  onBlur={e=>e.target.style.borderColor=t.brd}/>
                  <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontFamily:FB, fontSize:13, color:t.mu }}>%</span>
                </div>
                <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:3 }}>Precio efectivo: ${fmt2(precioComp)}</div>
              </div>

              {/* Fecha de compra */}
              <div>
                <label style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>
                  Fecha de compra
                  <span style={{ marginLeft:6, fontWeight:400, color:t.fa, textTransform:"none" }}>(para ver pagados)</span>
                </label>
                <input type="date" value={fechaCompra} onChange={e=>setFechaCompra(e.target.value)}
                  max={today.toISOString().split("T")[0]}
                  style={{
                    width:"100%", padding:"10px 12px", borderRadius:9, fontFamily:FB, fontSize:13, fontWeight:600,
                    border:`1.5px solid ${fechaCompra?t.go:t.brd}`, background:t.srf, color:fechaCompra?t.tx:t.fa, outline:"none",
                  }}
                  onFocus={e=>e.target.style.borderColor=t.go}
                  onBlur={e=>e.target.style.borderColor=fechaCompra?t.go:t.brd}
                  placeholder="Seleccioná la fecha"
                />
                {fechaCompra && (
                  <button onClick={()=>setFechaCompra("")} style={{ fontFamily:FB, fontSize:9, color:t.go, background:"none", border:"none", cursor:"pointer", marginTop:3, padding:0 }}>
                    ✕ Solo flujos futuros
                  </button>
                )}
                {!fechaCompra && <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:3 }}>Opcional · calculará flujos futuros</div>}
              </div>
            </div>
          </div>

          {montoNum > 0 && (flows.length > 0 || paidFlowsCalc.length > 0) && (
            <>
              {/* ── BANNER PAGADOS ── solo si hay historial */}
              {paidFlowsCalc.length > 0 && (
                <div style={{ background:t.grBg, border:`1px solid ${t.grAcc}44`, borderRadius:12, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:18 }}>✅</span>
                    <div>
                      <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.gr, textTransform:"uppercase", letterSpacing:".08em" }}>
                        Ya cobrado desde {fechaCompra ? new Date(fechaCompra).toLocaleDateString("es-AR",{day:"numeric",month:"short",year:"numeric"}) : "tu ingreso"}
                      </div>
                      <div style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.gr, lineHeight:1.1 }}>
                        USD {fmt2(totalCobradoHist)}
                      </div>
                      <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:2 }}>
                        {paidFlowsCalc.length} pago{paidFlowsCalc.length!==1?"s":""} recibido{paidFlowsCalc.length!==1?"s":""} · {((totalCobradoHist/montoNum)*100).toFixed(1)}% de la inversión recuperado
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>setShowPaid(v=>!v)} style={{
                    display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:8, cursor:"pointer",
                    fontFamily:FB, fontSize:11, fontWeight:600, border:`1px solid ${t.gr}44`,
                    background:"transparent", color:t.gr,
                  }}>
                    {showPaid ? <><ChevronUp size={12}/> Ocultar detalle</> : <><ChevronDown size={12}/> Ver detalle</>}
                  </button>
                </div>
              )}

              {/* ── TABLA PAGOS YA COBRADOS ── */}
              {paidFlowsCalc.length > 0 && showPaid && (
                <div style={{ background:t.grBg, border:`1px solid ${t.grAcc}33`, borderRadius:14, overflow:"hidden", marginBottom:16, opacity:0.85 }}>
                  <div style={{ padding:"12px 18px", borderBottom:`1px solid ${t.grAcc}22`, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.gr }}>
                      ✅ Pagos cobrados · {paidFlowsCalc.length} cupones
                    </span>
                    <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>escalados al VN comprado</span>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                      <thead>
                        <tr style={{ background:t.grBg }}>
                          {[["#","l"],["Fecha","l"],["Renta","r"],["Amortización","r"],["Total","r"]].map(([h,a]) => (
                            <th key={h} style={{ padding:"7px 14px", textAlign:a==="l"?"left":"right", fontSize:8, fontWeight:700,
                              color:t.gr, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paidFlowsCalc.map((f,i) => {
                          const hasAmort = f.amortUSD > 0.001;
                          const hasCpn   = f.cpnUSD   > 0.001;
                          return (
                            <tr key={i} style={{ borderBottom:`1px solid ${t.grAcc}22` }}>
                              <td style={{ padding:"6px 14px", fontSize:10, color:t.gr }}>{i+1}</td>
                              <td style={{ padding:"6px 14px", fontSize:11, fontWeight:600, color:t.gr, whiteSpace:"nowrap" }}>
                                {fmtD(f.date)} <span style={{ fontSize:9, color:t.gr, background:t.grAcc+"22", padding:"1px 5px", borderRadius:4, marginLeft:4 }}>✓ COBRADO</span>
                              </td>
                              <td style={{ padding:"6px 14px", fontSize:11, color:t.gr, textAlign:"right" }}>
                                {hasCpn ? `$${fmt2(f.cpnUSD)}` : <span style={{color:t.fa}}>—</span>}
                              </td>
                              <td style={{ padding:"6px 14px", fontSize:11, textAlign:"right", color:hasAmort?t.go:t.fa }}>
                                {hasAmort ? `$${fmt2(f.amortUSD)}` : "—"}
                              </td>
                              <td style={{ padding:"6px 14px", fontSize:12, fontWeight:700, color:t.gr, textAlign:"right" }}>
                                ${fmt2(f.totalUSD)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr style={{ background:t.grBg, borderTop:`1px solid ${t.grAcc}44` }}>
                          <td colSpan={2} style={{ padding:"8px 14px", fontFamily:FB, fontSize:9, fontWeight:700, color:t.gr, textTransform:"uppercase" }}>TOTAL COBRADO</td>
                          <td style={{ padding:"8px 14px", fontSize:12, fontWeight:700, color:t.gr, textAlign:"right" }}>
                            ${fmt2(paidFlowsCalc.reduce((a,f)=>a+f.cpnUSD,0))}
                          </td>
                          <td style={{ padding:"8px 14px", fontSize:12, fontWeight:700, color:t.go, textAlign:"right" }}>
                            ${fmt2(paidFlowsCalc.reduce((a,f)=>a+f.amortUSD,0))}
                          </td>
                          <td style={{ padding:"8px 14px", fontSize:13, fontWeight:700, color:t.gr, textAlign:"right" }}>
                            ${fmt2(totalCobradoHist)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── KPIs — adaptativos si hay historial o no ── */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10, marginBottom:16 }}>
                {[
                  { label:"Inversión",         val:`USD ${fmt2(montoNum)}`,                                   color:t.bl,  bg:t.blBg },
                  { label:"VN comprado",        val:`USD ${fmt2(vnComprado)}`,                                 color:t.mu,  bg:t.alt  },
                  { label:"TIR calculada",      val:tirCalc!=null?`${(tirCalc*100).toFixed(2)}%`:"—",          color:t.go,  bg:t.goBg,
                    sub: tirMercado ? `Mercado: ${tirMercado.toFixed(2)}%` : null },
                  { label:"Próximo pago",       val:flows[0] ? fmtYr(flows[0].date) : "—",                    color:t.pu,  bg:t.puBg },
                  ...(paidFlowsCalc.length > 0 ? [
                    { label:"Ya cobrado",       val:`USD ${fmt2(totalCobradoHist)}`,                           color:t.gr,  bg:t.grBg,
                      sub:`${paidFlowsCalc.length} pago${paidFlowsCalc.length!==1?"s":""}` },
                  ] : []),
                  { label:"Por cobrar",         val:`USD ${fmt2(totalCobros)}`,                                color:t.bl,  bg:t.blBg,
                    sub:`${flows.length} flujo${flows.length!==1?"s":""}` },
                  { label:"Ganancia neta",      val:`${gananciaNeta>=0?"+ ":""}USD ${fmt2(Math.abs(gananciaNeta))}`, color:gananciaNeta>=0?t.gr:t.rd, bg:gananciaNeta>=0?t.grBg:t.rdBg,
                    sub: paidFlowsCalc.length > 0 ? "cobrado + pendiente" : null },
                  { label:"Retorno total",      val:`${retornoPct>=0?"+":""}${retornoPct.toFixed(1)}%`,        color:retornoPct>=0?t.gr:t.rd, bg:retornoPct>=0?t.grBg:t.rdBg },
                  { label:"Vencimiento",        val:bond.vto,                                                  color:t.mu,  bg:t.alt  },
                ].map((k,i) => (
                  <div key={i} style={{ background:k.bg, border:`1px solid ${k.color}22`, borderRadius:12, padding:"12px 14px" }}>
                    <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:k.color, marginBottom:5 }}>{k.label}</div>
                    <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:k.color, lineHeight:1.1 }}>{k.val}</div>
                    {k.sub && <div style={{ fontFamily:FB, fontSize:9, color:t.fa, marginTop:3 }}>{k.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Barra de recupero — incluye pagado + pendiente */}
              <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, marginBottom:8 }}>
                  <span>Recupero de la inversión {paidFlowsCalc.length>0?"(cobrado + pendiente)":"sobre flujos futuros"}</span>
                  <span style={{ color: totalGlobal>=montoNum ? t.gr : t.go }}>
                    {Math.min(100,(totalGlobal/montoNum*100)).toFixed(1)}%
                    {totalGlobal >= montoNum && " ✓"}
                  </span>
                </div>
                <div style={{ height:10, background:t.alt, borderRadius:99, overflow:"hidden", display:"flex" }}>
                  {/* Segmento cobrado (verde) */}
                  {paidFlowsCalc.length > 0 && (
                    <div style={{ height:"100%", transition:"width .5s", width:`${Math.min(100,totalCobradoHist/montoNum*100)}%`,
                      background:`linear-gradient(90deg,${t.grAcc},${t.gr})` }}/>
                  )}
                  {/* Segmento pendiente (azul→dorado) */}
                  <div style={{ height:"100%", transition:"width .5s", width:`${Math.min(100,Math.max(0, totalGlobal/montoNum*100 - totalCobradoHist/montoNum*100))}%`,
                    background:`linear-gradient(90deg,${t.bl},${totalCobros>=montoNum?t.go:t.go})`, opacity:0.7 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:FB, fontSize:9, color:t.fa, marginTop:6, flexWrap:"wrap", gap:8 }}>
                  {paidFlowsCalc.length > 0 && <span style={{color:t.gr}}>✅ Cobrado: USD {fmt2(totalCobradoHist)}</span>}
                  <span>⏳ Pendiente: USD {fmt2(totalCobros)}</span>
                  <span>Inversión: USD {fmt2(montoNum)}</span>
                </div>
              </div>

              {/* ── TABLA DE FLUJOS PENDIENTES ── */}
              {flows.length > 0 && (
                <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14, overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.brd}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx }}>
                      Flujos pendientes · {flows.length} pagos
                    </span>
                    <div style={{ display:"flex", gap:10, fontFamily:FB, fontSize:10, color:t.fa }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:t.blBg, border:`1px solid ${t.bl}44`, display:"inline-block" }}/>Renta
                      </span>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ width:8, height:8, borderRadius:2, background:t.goBg, border:`1px solid ${t.go}44`, display:"inline-block" }}/>Amortización
                      </span>
                    </div>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                      <thead>
                        <tr style={{ background:t.alt }}>
                          {[["#","l"],["Fecha","l"],["Días","r"],["Renta","r"],["Amortización","r"],["Total","r"],["Acumulado","r"],["Recupero","r"]].map(([h,a]) => (
                            <th key={h} style={{ padding:"8px 14px", textAlign:a==="l"?"left":"right", fontSize:8, fontWeight:700,
                              color:t.mu, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {flows.map((f,i) => {
                          acum += f.totalUSD;
                          const rec = montoNum > 0 ? acum/montoNum*100 : 0;
                          const hasAmort = f.amortUSD > 0.001;
                          const hasCpn   = f.cpnUSD   > 0.001;
                          return (
                            <tr key={i} style={{
                              background: hasAmort ? t.goBg+"88" : i%2===0 ? t.srf : t.alt,
                              borderBottom:`1px solid ${t.brd}44`,
                            }}>
                              <td style={{ padding:"7px 14px", fontSize:10, color:t.fa }}>{i+1}</td>
                              <td style={{ padding:"7px 14px", fontSize:11, fontWeight:600, color:t.tx, whiteSpace:"nowrap" }}>{fmtD(f.date)}</td>
                              <td style={{ padding:"7px 14px", fontSize:10, color:t.mu, textAlign:"right" }}>{f.days}d</td>
                              <td style={{ padding:"7px 14px", fontSize:11, color:t.bl, textAlign:"right", fontWeight:hasCpn?500:400 }}>
                                {hasCpn ? `$${fmt2(f.cpnUSD)}` : <span style={{color:t.fa}}>—</span>}
                              </td>
                              <td style={{ padding:"7px 14px", fontSize:11, textAlign:"right", fontWeight:hasAmort?700:400, color:hasAmort?t.go:t.fa }}>
                                {hasAmort ? `$${fmt2(f.amortUSD)}` : "—"}
                              </td>
                              <td style={{ padding:"7px 14px", fontSize:12, fontWeight:700, color:t.gr, textAlign:"right" }}>
                                ${fmt2(f.totalUSD)}
                              </td>
                              <td style={{ padding:"7px 14px", fontSize:11, color:t.tx, textAlign:"right" }}>
                                ${fmt2(acum)}
                              </td>
                              <td style={{ padding:"7px 14px", textAlign:"right" }}>
                                <span style={{
                                  fontFamily:FB, fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:8,
                                  background: rec>=100?t.grBg:rec>=50?t.goBg:t.rdBg,
                                  color:      rec>=100?t.gr  :rec>=50?t.go  :t.rd,
                                }}>{rec.toFixed(0)}%</span>
                              </td>
                            </tr>
                          );
                        })}
                        <tr style={{ background:t.alt, borderTop:`2px solid ${t.brd}` }}>
                          <td colSpan={3} style={{ padding:"10px 14px", fontFamily:FB, fontSize:9, fontWeight:700, color:t.mu, textTransform:"uppercase", letterSpacing:".06em" }}>TOTALES PENDIENTES</td>
                          <td style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:t.bl, textAlign:"right" }}>
                            ${fmt2(flows.reduce((a,f)=>a+f.cpnUSD,0))}
                          </td>
                          <td style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:t.go, textAlign:"right" }}>
                            ${fmt2(flows.reduce((a,f)=>a+f.amortUSD,0))}
                          </td>
                          <td style={{ padding:"10px 14px", fontSize:13, fontWeight:700, color:t.gr, textAlign:"right" }}>
                            ${fmt2(totalCobros)}
                          </td>
                          <td colSpan={2} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, textAlign:"right", color:gananciaSolo>=0?t.gr:t.rd }}>
                            {gananciaSolo>=0?"+":""}${fmt2(gananciaSolo)} ({retornoPct>=0?"+":""}{retornoPct.toFixed(1)}%)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, lineHeight:1.6 }}>
                Flujos escalados al VN comprado · TIR calculada por bisección numérica · Filas doradas = amortización de capital ·
                Historial disponible para bonos 2020 (GD/AL 29-30-35-38-41-46) desde emisión Sep 2020 ·
                TIR de referencia según convención Bloomberg. No constituye asesoramiento de inversión.
              </p>
            </>
          )}

          {flows.length === 0 && paidFlowsCalc.length === 0 && montoNum > 0 && (
            <div style={{ textAlign:"center", padding:"24px", fontFamily:FB, fontSize:12, color:t.fa, background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12 }}>
              Sin flujos registrados para este bono en el período seleccionado.
            </div>
          )}

        </div>
      )}
    </div>
  );
}


function ETPsPanel({ t }) {
  const [pin, setPin]           = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError]       = useState(false);
  const ETPS_PIN = "1243";

  const tryUnlock = () => {
    if (pin === ETPS_PIN) { setUnlocked(true); setError(false); }
    else { setError(true); setPin(""); setTimeout(()=>setError(false), 1800); }
  };

  if (!unlocked) return (
    <div className="fade-up" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:320 }}>
      <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:16, padding:"36px 32px", textAlign:"center", maxWidth:340, width:"100%" }}>
        <div style={{ width:52, height:52, borderRadius:14, background:t.goBg, border:`1px solid ${t.go}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Lock size={22} color={t.go} />
        </div>
        <h3 style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:t.tx, marginBottom:8 }}>ETPs Balanz</h3>
        <p style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:20, lineHeight:1.6 }}>
          Acceso restringido. Ingresá el PIN para ver los productos de inversión.
        </p>
        <input
          type="password" placeholder="PIN de acceso" value={pin}
          onChange={e=>{setPin(e.target.value);setError(false);}}
          onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
          autoFocus
          style={{
            width:"100%", padding:"11px 14px", borderRadius:10, fontFamily:FB, fontSize:15, textAlign:"center",
            border:`2px solid ${error?t.rd:t.brd}`, background:t.alt, color:t.tx, outline:"none",
            marginBottom:12, letterSpacing:"0.2em", transition:"border-color .2s",
          }}
        />
        {error && <p style={{ fontFamily:FB, fontSize:11, color:t.rd, marginBottom:12 }}>PIN incorrecto</p>}
        <button onClick={tryUnlock} style={{
          width:"100%", padding:"11px", borderRadius:10, fontFamily:FB, fontSize:13, fontWeight:700,
          background:t.go, color:"#fff", border:"none", cursor:"pointer",
        }}>Acceder</button>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
          <div style={{
            background:"linear-gradient(135deg, #0A1E3D 0%, #14355A 50%, #1A4270 100%)",
            borderRadius:16, padding:"28px 28px 24px", marginBottom:24,
            border:"1px solid rgba(255,255,255,.08)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:"rgba(255,255,255,.4)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:6 }}>BALANZ INTERNATIONAL</div>
                <h2 style={{ fontFamily:FD, fontSize:28, fontWeight:700, color:"#fff", lineHeight:1.1, margin:0 }}>
                  Fondos de Inversión <span style={{ color:"#4A90D9" }}>Offshore</span>
                </h2>
                <p style={{ fontFamily:FB, fontSize:13, color:"rgba(255,255,255,.6)", marginTop:10, lineHeight:1.6, maxWidth:520 }}>
                  Instrumentos domiciliados en Irlanda con custodia en StoneX. Inversión mínima 1.000 VNs, liquidación T+2, en dólares cable. Gestión activa del equipo de Balanz Capital.
                </p>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[{l:"Domicilio",v:"Irlanda"},{l:"Moneda",v:"USD Cable"},{l:"Custodio",v:"StoneX"},{l:"Auditor",v:"BDO"}].map((c,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                    <div style={{ fontFamily:FB, fontSize:8, color:"rgba(255,255,255,.4)", letterSpacing:".08em", textTransform:"uppercase" }}>{c.l}</div>
                    <div style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:"#fff", marginTop:2 }}>{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fund cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
            {BALANZ_ETPS.map((f, fi) => {
              const cMapE = {blue:{ac:"#4A90D9",bg:"rgba(74,144,217,.08)",grad:"linear-gradient(135deg,#0A1E3D,#1A4270)"},
                gold:{ac:"#B0782A",bg:"rgba(176,120,42,.08)",grad:"linear-gradient(135deg,#2A1A05,#4A3010)"},
                purple:{ac:"#7C3AED",bg:"rgba(124,58,237,.08)",grad:"linear-gradient(135deg,#1A0A3D,#2D1A5E)"}};
              const cc = cMapE[f.color]||cMapE.blue;
              const waUrl = `https://wa.me/5491140500087?text=${encodeURIComponent(`Hola Máximo, me gustaría conocer más acerca del fondo ${f.nombre} que cotiza en el exterior.`)}`;
              const rendArr = [
                {l:"1M",v:f.rend.m1},{l:"3M",v:f.rend.m3},{l:"6M",v:f.rend.m6},{l:"1A",v:f.rend.y1},{l:"YTD",v:f.rend.ytd},{l:"Inicio",v:f.rend.sinceInc}
              ].filter(r=>r.v!==null);

              return (
                <a key={fi} href={waUrl} target="_blank" rel="noreferrer" style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{
                    background:t.srf, border:`1px solid ${t.brd}`, borderRadius:16,
                    overflow:"hidden", transition:"all .2s", cursor:"pointer",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,.15)";e.currentTarget.style.borderColor=cc.ac;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=t.brd;}}>

                    {/* Card header */}
                    <div style={{ background:cc.grad, padding:"20px 22px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:cc.ac, background:"rgba(255,255,255,.1)", padding:"3px 8px", borderRadius:6, letterSpacing:".08em" }}>{f.tipo.toUpperCase()}</span>
                          <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:"#fff", margin:"8px 0 4px", lineHeight:1.2 }}>{f.nombre}</h3>
                          <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.5)", margin:0 }}>{f.tagline}</p>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:FB, fontSize:8, color:"rgba(255,255,255,.4)", letterSpacing:".06em" }}>NAV</div>
                          <div style={{ fontFamily:FH, fontSize:22, fontWeight:800, color:"#fff" }}>${f.nav}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding:"16px 22px 20px" }}>
                      <p style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.6, marginBottom:14 }}>{f.desc}</p>

                      {/* KPI chips */}
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                        {[
                          f.ytm && {l:"YTM",v:f.ytm},
                          f.duration && {l:"Duration",v:`${f.duration}a`},
                          {l:"Fee",v:f.fee},
                          {l:"AUM",v:`$${f.aum}M`},
                          f.rating && {l:"Rating",v:f.rating},
                        ].filter(Boolean).map((c,i)=>(
                          <div key={i} style={{ background:t.alt, borderRadius:6, padding:"3px 10px", fontFamily:FB }}>
                            <span style={{ fontSize:8, color:t.fa, textTransform:"uppercase", letterSpacing:".05em" }}>{c.l} </span>
                            <span style={{ fontSize:11, fontWeight:700, color:cc.ac }}>{c.v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Rendimientos */}
                      <div style={{ display:"flex", gap:4, marginBottom:14 }}>
                        {rendArr.map((r,i)=>(
                          <div key={i} style={{ flex:1, background:t.alt, borderRadius:6, padding:"5px 0", textAlign:"center" }}>
                            <div style={{ fontFamily:FB, fontSize:8, color:t.fa, letterSpacing:".05em" }}>{r.l}</div>
                            <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:r.v>=0?t.gr:t.rd }}>{r.v>0?"+":""}{r.v}%</div>
                          </div>
                        ))}
                      </div>

                      {/* Top 3 tenencias */}
                      <div style={{ borderTop:`1px solid ${t.brd}`, paddingTop:10 }}>
                        <div style={{ fontFamily:FB, fontSize:8, color:t.fa, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>PRINCIPALES TENENCIAS</div>
                        {f.top3.map((h,i)=>(
                          <div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:FB, fontSize:11, color:t.mu, marginBottom:2 }}>
                            <span>{h.n}</span><span style={{ fontWeight:700, color:t.tx }}>{h.w}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div style={{ marginTop:14, padding:"10px 0", borderTop:`1px solid ${t.brd}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        <MessageCircle size={14} color={cc.ac} />
                        <span style={{ fontFamily:FB, fontSize:12, fontWeight:700, color:cc.ac }}>Consultar con Máximo</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div style={{ marginTop:20, padding:"16px 20px", background:t.alt, borderRadius:12, border:`1px solid ${t.brd}` }}>
            <p style={{ fontFamily:FB, fontSize:10, color:t.fa, lineHeight:1.6, margin:0 }}>
              Informe mensual Febrero 2026 · Balanz Capital S.A.U. · Los rendimientos pasados no garantizan rendimientos futuros. Inversión mínima 1.000 VNs. Domicilio Irlanda. Custodio StoneX. Agente de cálculo: LynX Markets. Trustee: TMF Group. Auditor: BDO. Agente emisor y de pago: BNY Mellon. No constituye asesoramiento de inversión.
            </p>
          </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CALENDARIO DE VENCIMIENTOS Y PAGOS — 18 meses
   Fuentes: BOND_SCHEDULES (soberanos) + LECAP (ARS)
════════════════════════════════════════════════════════════════ */
function CalendarioPanel({ t }) {
  const [calFilter, setCalFilter] = useState("Todos");
  const filterOpts = ["Todos","Soberanos USD","Renta Fija ARS","Corporativos (ONs)"];
  const now = new Date();
  const horizon = new Date(now.getTime() + 12*365*86400000); // 12 years for ONs to 2037
  const currentYear = now.getFullYear();

  const sovEvents = [];
  SOBERANOS.forEach(s => {
    const flows = BOND_SCHEDULES[s.t] || [];
    flows.forEach(f => {
      const d = new Date(f.date);
      if (d <= now || d > horizon) return;
      const isAmort = f.amort > 0, isCpn = f.cpn > 0;
      if (!isAmort && !isCpn) return;
      const monto = ((f.cpn + f.amort) / 100 * 1000).toFixed(2);
      const tipo = isAmort && isCpn ? "Renta + Amort." : isAmort ? "Amortización" : "Renta";
      sovEvents.push({ date:d, ticker:s.t, tipo, monto, cat:"Soberanos USD", ley:s.ley });
    });
  });

  const lecapEvents = LECAP.flatMap(g => {
    const parts = g.vto.split("/");
    if (parts.length !== 3) return [];
    const [dd, mm, yy] = parts.map(Number);
    const d = new Date(yy, mm-1, dd);
    if (d <= now || d > horizon) return [];
    return g.rows.map(r => ({
      date:d, ticker:r.t, tipo:"Vencimiento", monto:"Capital + cupón", cat:"Renta Fija ARS", ley:"ARG"
    }));
  });

  // ON coupon events from ON_COUPON_CALENDAR — month-only, respects maturity
  const onEvents = [];
  // Build a lookup of maturity dates from ON data (ticker ending D → vto date)
  const onVtoMap = {};
  [...ONS_ARG_DATA, ...ONS_NY_DATA].forEach(o => {
    if (o.vto) {
      // Parse dd/mm/yyyy
      const [dd,mm,yy] = o.vto.split("/").map(Number);
      if (yy) onVtoMap[o.t] = new Date(yy, mm-1, dd);
    }
  });
  ON_COUPON_CALENDAR.forEach(m => {
    for (let yr = currentYear; yr <= 2037; yr++) {
      const d = new Date(yr, m.month-1, 1);
      if (d <= new Date(now.getFullYear(), now.getMonth(), 1) || d > horizon) continue;
      m.tickers.forEach(tk => {
        // Calendar tickers end in O, ON data tickers end in D
        const dTicker = tk.replace(/O$/, "D");
        const vto = onVtoMap[dTicker];
        // Only generate events before the ON's maturity
        if (vto && d > vto) return;
        onEvents.push({ date:d, ticker:tk, tipo:"Cupón ON", monto:"—", cat:"Corporativos (ONs)", ley:"CORP", monthOnly:true });
      });
    }
  });

  let allEvents = [...sovEvents, ...lecapEvents, ...onEvents].sort((a,b)=>a.date-b.date);
  if (calFilter !== "Todos") allEvents = allEvents.filter(e=>e.cat===calFilter);

  const byMonth = {};
  allEvents.forEach(e => {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth()+1).padStart(2,"0")}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e);
  });
  const months = Object.keys(byMonth).sort();
  const monthName = k => {
    const [y,m] = k.split("-");
    return new Date(+y, +m-1, 1).toLocaleDateString("es-AR",{month:"long",year:"numeric"});
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {filterOpts.map(f=>(
          <button key={f} onClick={()=>setCalFilter(f)} style={{
            padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, cursor:"pointer",
            border:`1.5px solid ${calFilter===f?t.go:t.brd}`,
            background:calFilter===f?t.go+"18":"transparent",
            color:calFilter===f?t.go:t.mu, fontWeight:calFilter===f?700:400,
          }}>{f}</button>
        ))}
        <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:10, color:t.fa }}>{allEvents.length} eventos próximos · 18 meses</span>
      </div>

      {months.length === 0 && (
        <Card t={t}><div style={{ padding:40, textAlign:"center", fontFamily:FB, fontSize:13, color:t.mu }}>No hay eventos para el filtro seleccionado.</div></Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:12 }}>
        {months.map(k => {
          const events = byMonth[k];
          const bondEvents = events.filter(e=>!e.monthOnly);
          const onEvents2 = events.filter(e=>e.monthOnly);
          return (
          <Card key={k} t={t}>
            <div style={{ padding:"16px 20px" }}>
              <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, textTransform:"capitalize", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                <Clock size={14} color={t.go} /> {monthName(k)}
                <span style={{ fontFamily:FB, fontSize:9, color:t.fa, fontWeight:400, marginLeft:"auto" }}>{events.length} eventos</span>
              </div>

              {/* Soberanos + LECAPs — individual rows with dates */}
              {bondEvents.map((ev,i) => {
                const typeColor = ev.tipo.includes("Amort")?t.go:ev.tipo==="Vencimiento"?t.gr:ev.tipo==="Renta"?t.bl:t.mu;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${t.brd}22` }}>
                    <span style={{ fontFamily:FB, fontSize:10, color:t.fa, minWidth:40, flexShrink:0 }}>
                      {ev.date.toLocaleDateString("es-AR",{day:"2-digit",month:"short"}).replace(".","").toUpperCase()}
                    </span>
                    <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:ev.ley==="NY"?t.bl:t.go, background:(ev.ley==="NY"?t.bl:t.go)+"12", padding:"1px 6px", borderRadius:4 }}>{ev.ticker}</span>
                    <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:typeColor }}>{ev.tipo}</span>
                    {ev.monto !== "—" && (
                      <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:10, fontWeight:700, color:t.tx }}>
                        {typeof ev.monto === "string" && ev.monto.startsWith("Capital") ? ev.monto : `$${ev.monto}`}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* ONs — compact chip grid */}
              {onEvents2.length > 0 && (
                <div style={{ marginTop:bondEvents.length>0?10:0, padding:"10px 0 0", borderTop:bondEvents.length>0?`1px solid ${t.brd}44`:"none" }}>
                  <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.pu, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>
                    CUPONES ONs · {onEvents2.length} pagos
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {onEvents2.map((ev,i) => (
                      <span key={i} style={{ fontFamily:"monospace", fontSize:8, fontWeight:600, color:t.pu, background:t.pu+"10", padding:"2px 5px", borderRadius:3, border:`1px solid ${t.pu}20` }}>{ev.ticker}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          );
        })}
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12 }}>
        Fuente: BOND_SCHEDULES (flujos reales soberanos) + LECAPs (vencimientos). Montos por cada $1.000 VN invertidos. No constituye asesoramiento.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ONs PANEL — Obligaciones Negociables con DATA912 live
   PIN locked · Fetch arg_corp · Agrupadas por ley y emisor
════════════════════════════════════════════════════════════════ */
function ONsPanel({ t }) {
  const [corpPrices, setCorpPrices] = useState({});
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("dur");
  const [sortDir, setSortDir] = useState(1);
  const [onSub, setOnSub] = useState("cotiz");
  const [calcTicker, setCalcTicker] = useState("");
  const [calcMonto, setCalcMonto] = useState(10000);
  const [calcCom, setCalcCom] = useState(0.5);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/equities?type=corp");
        const json = await r.json();
        const map = json.map || {};
        setCorpPrices(map);
        setStatus(Object.keys(map).length > 0 ? "ok" : "empty");
      } catch { setStatus("error"); }
    };
    load();
    const id = setInterval(load, 300000);
    return () => clearInterval(id);
  }, []);

  const sort = (col) => { if (sortCol===col) setSortDir(d=>-d); else { setSortCol(col); setSortDir(1); } };

  const renderTable = (label, data, color) => {
    let filtered = data.filter(o => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return o.t.toLowerCase().includes(q) || o.em.toLowerCase().includes(q);
    });
    filtered.sort((a,b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (av===null||av===undefined) return 1;
      if (bv===null||bv===undefined) return -1;
      return (av>bv?1:-1)*sortDir;
    });

    return (
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
          {label} — {filtered.length} instrumentos
        </div>
        <Card t={t}>
          <div style={{ overflowX:"auto", maxHeight:"55vh", overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
              <thead>
                <tr>
                  {[
                    {h:"Ticker",col:"t",r:false},{h:"Emisor",col:"em",r:false},{h:"Precio",col:"p",r:true},
                    {h:"TIR",col:"tir",r:true},{h:"Cupón",col:"cup",r:true},{h:"Dur.",col:"dur",r:true},
                    {h:"Vto.",col:"vto",r:false},{h:"Cal.",col:"cal",r:false},{h:"Tipo",col:"tipo",r:false},{h:"",col:"_tv",r:false}
                  ].map(({h,col,r},i)=>(
                    <th key={i} onClick={()=>col!=="_tv"&&sort(col)} style={{
                      padding:"8px 10px", textAlign:r?"right":"left", fontSize:9, fontWeight:700,
                      color:sortCol===col?t.go:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`,
                      background:t.alt, position:"sticky", top:0, zIndex:5, cursor:col!=="_tv"?"pointer":"default",
                      whiteSpace:"nowrap"
                    }}>{h}{sortCol===col?(sortDir===1?" ↑":" ↓"):""}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o,i) => {
                  const live = corpPrices[o.t];
                  const px = live?.price || o.p;
                  const pctLive = live?.pct;
                  const tirOk = o.tir !== null && o.tir > 0;
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${t.brd}44`, transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.alt}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"6px 10px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:4,
                            background:color+"15", color, border:`1px solid ${color}33` }}>{o.t}</span>
                          {live && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 4px #22c55e"}}/>}
                        </div>
                      </td>
                      <td style={{ padding:"6px 10px", fontSize:10, color:t.tx, fontWeight:500, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.em}</td>
                      <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700, color:live?t.tx:t.mu }}>${px.toFixed(2)}</td>
                      <td style={{ padding:"6px 10px", textAlign:"right" }}>
                        {tirOk ? <span style={{ fontWeight:700, color:o.tir>=7?t.gr:o.tir>=5?t.go:t.mu }}>{o.tir.toFixed(2)}%</span>
                                : <span style={{color:t.fa}}>—</span>}
                      </td>
                      <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.cup?`${o.cup.toFixed(1)}%`:"—"}</td>
                      <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.dur?`${o.dur.toFixed(1)}a`:"—"}</td>
                      <td style={{ padding:"6px 10px", fontSize:10, color:t.mu }}>{o.vto}</td>
                      <td style={{ padding:"6px 10px" }}>
                        <span style={{ fontSize:9, fontWeight:600, padding:"1px 5px", borderRadius:4,
                          background:o.cal.startsWith("AAA")?t.grBg:o.cal.startsWith("AA")?t.blBg:o.cal.startsWith("A")?t.goBg:t.rdBg,
                          color:o.cal.startsWith("AAA")?t.gr:o.cal.startsWith("AA")?t.bl:o.cal.startsWith("A")?t.go:t.rd
                        }}>{o.cal}</span>
                      </td>
                      <td style={{ padding:"6px 10px", fontSize:9, color:t.fa }}>{o.tipo}</td>
                      <td style={{ padding:"6px 6px" }}>
                        <button onClick={()=>window.__goChart?.("BYMA:"+o.t)}
                          style={{ width:24, height:24, borderRadius:5, display:"inline-flex", alignItems:"center", justifyContent:"center",
                            background:t.alt, border:`1px solid ${t.brd}`, color:t.mu, transition:"all .15s", cursor:"pointer" }}
                          onMouseEnter={e=>{e.currentTarget.style.background=color+"15";e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color;}}
                          onMouseLeave={e=>{e.currentTarget.style.background=t.alt;e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.color=t.mu;}}>
                          <LineChart size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="fade-up">
      <div style={{
        background:"linear-gradient(135deg, #0A1E3D 0%, #14355A 50%, #1A4270 100%)",
        borderRadius:16, padding:"22px 28px", marginBottom:20, border:"1px solid rgba(255,255,255,.08)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:FH, fontSize:11, fontWeight:700, color:"rgba(255,255,255,.4)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:4 }}>MERCADO SECUNDARIO · 88 INSTRUMENTOS</div>
            <h2 style={{ fontFamily:FD, fontSize:24, fontWeight:700, color:"#fff", margin:0 }}>
              Obligaciones <span style={{ color:"#4A90D9" }}>Negociables</span>
            </h2>
            <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.5)", marginTop:6 }}>Datos: mercado secundario · en vivo</p>
          </div>
          <div style={{
            borderRadius:8, padding:"6px 12px", fontFamily:FB, fontSize:10,
            background:status==="ok"?"rgba(34,197,94,.15)":"rgba(255,255,255,.06)",
            color:status==="ok"?"#22c55e":"rgba(255,255,255,.5)",
            display:"flex", alignItems:"center", gap:6, border:"1px solid rgba(255,255,255,.1)",
          }}>
            <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",
              background:status==="ok"?"#22c55e":status==="error"?"#ef4444":"#94a3b8",
              boxShadow:status==="ok"?"0 0 6px #22c55e":"none"}}/>
            {status==="ok" ? `${Object.keys(corpPrices).length} precios live` : status==="error" ? "Sin datos live" : "Cargando..."}
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[{id:"cotiz",label:"Cotizaciones",Icon:BarChart3},{id:"calc",label:"Calculadora",Icon:PieChart},{id:"sell",label:"Señales de Venta",Icon:AlertTriangle}].map(s=>(
          <button key={s.id} onClick={()=>setOnSub(s.id)} style={{
            padding:"7px 16px", borderRadius:8, fontFamily:FB, fontSize:11, fontWeight:600, cursor:"pointer",
            border:`1.5px solid ${onSub===s.id?t.go:t.brd}`,
            background:onSub===s.id?t.go+"15":"transparent",
            color:onSub===s.id?t.go:t.mu,
            display:"flex", alignItems:"center", gap:5,
          }}><s.Icon size={13}/> {s.label}</button>
        ))}
      </div>

      {/* ── TAB: Cotizaciones ── */}
      {onSub === "cotiz" && (<>
        <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker o emisor..."
              style={{ fontFamily:FB, fontSize:12, padding:"7px 10px 7px 30px", borderRadius:10, width:200,
                border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
          </div>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa, marginLeft:"auto" }}>
            {ONS_ARG_DATA.length + ONS_NY_DATA.length} ONs · Click en columnas para ordenar
          </span>
        </div>
        {renderTable("LEY ARGENTINA · 54 ONs", ONS_ARG_DATA, t.go)}
        {renderTable("LEY NUEVA YORK · 34 ONs", ONS_NY_DATA, t.bl)}
      </>)}

      {/* ── TAB: Calculadora de Flujos ── */}
      {onSub === "calc" && (() => {
        const allONs = [...ONS_ARG_DATA, ...ONS_NY_DATA].filter(o=>o.tir>0 && o.cup>0 && o.dur>0);
        const sel = allONs.find(o=>o.t===calcTicker) || allONs[0];
        if (!sel) return <p style={{fontFamily:FB,color:t.mu}}>No hay ONs con datos suficientes.</p>;

        const live = corpPrices[sel.t];
        const precio = live?.price || sel.p;
        const cupAnual = sel.cup;
        const tir = sel.tir;
        const durYears = sel.dur;
        const montoNum = parseFloat(String(calcMonto).replace(/\./g,"")) || 0;

        // 1 lámina = $100 VN, comprada al precio (que es por $100 VN)
        const laminas = montoNum > 0 ? Math.floor(montoNum / precio) : 0;
        const capitalInvertido = laminas * precio;

        // Frecuencia de pagos
        const freqMult = sel.freq?.toLowerCase().includes("trim") ? 4 : 2;
        const cupPorPago = cupAnual / freqMult; // % por período
        const totalPagos = Math.max(1, Math.round(durYears * freqMult));

        // Flujos: cada cupón = cupPorPago% de $100 VN = $cupPorPago por lámina
        const flows = [];
        let totalCupones = 0;
        for (let i=1; i<=totalPagos; i++) {
          const months = Math.round(i * 12 / freqMult);
          const isLast = i === totalPagos;
          const amort = isLast ? 100 : 0;
          totalCupones += cupPorPago;
          flows.push({ periodo:i, meses:months, cupon:cupPorPago, amort, cf:cupPorPago+amort });
        }
        // Total recibido: cada punto de cf = $1 por lámina
        const totalRecibido = (totalCupones + 100) * laminas;
        const comPct = parseFloat(String(calcCom).replace(",",".")) || 0;
        const costoComision = capitalInvertido * (comPct / 100);
        const ganancia = totalRecibido - capitalInvertido - costoComision;
        const retPct = capitalInvertido > 0 ? (ganancia / capitalInvertido * 100) : 0;

        return (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Instrumento (buscar por ticker)</label>
                <input list="on-list" value={calcTicker || sel.t} onChange={e=>setCalcTicker(e.target.value.toUpperCase())}
                  placeholder="Escribí el ticker..."
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:"monospace", fontSize:13, fontWeight:700, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
                <datalist id="on-list">
                  {allONs.map(o=><option key={o.t} value={o.t}>{o.em} — TIR {o.tir.toFixed(1)}%</option>)}
                </datalist>
              </div>
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Monto a invertir (USD)</label>
                <input type="text" value={calcMonto.toLocaleString("es-AR")} onChange={e=>{const raw=e.target.value.replace(/\./g,"").replace(/[^0-9]/g,"");setCalcMonto(parseInt(raw)||0);}}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
              </div>
              <div>
                <label style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.mu, textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Comisión (%)</label>
                <input type="text" value={calcCom} onChange={e=>setCalcCom(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, fontFamily:FB, fontSize:14, fontWeight:600, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }} />
              </div>
            </div>

            {/* Info del instrumento */}
            <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:12 }}>
              <strong style={{color:t.tx}}>{sel.t}</strong> — {sel.em} · Vto: {sel.vto} · {sel.freq} · {sel.tipo} · Cal: {sel.cal}
            </div>

            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:16 }}>
              {[
                {l:"Precio",v:`$${precio.toFixed(2)}`,c:live?t.gr:t.mu},
                {l:"TIR",v:`${tir.toFixed(2)}%`,c:t.go},
                {l:"Cupón anual",v:`${cupAnual.toFixed(2)}%`,c:t.bl},
                {l:"Láminas",v:`${laminas}`,c:t.tx},
                {l:"Capital invertido",v:`$${capitalInvertido.toLocaleString("es-AR",{maximumFractionDigits:0})}`,c:t.tx},
                {l:"Comisión",v:`-$${costoComision.toLocaleString("es-AR",{maximumFractionDigits:0})}`,c:t.rd},
                {l:"Total a recibir",v:`$${totalRecibido.toLocaleString("es-AR",{maximumFractionDigits:0})}`,c:t.bl},
                {l:"Ganancia neta",v:`$${ganancia.toLocaleString("es-AR",{maximumFractionDigits:0})}`,c:ganancia>=0?t.gr:t.rd},
                {l:"Retorno neto %",v:`${retPct>=0?"+":""}${retPct.toFixed(1)}%`,c:retPct>=0?t.gr:t.rd},
              ].map((c,i)=>(
                <div key={i} style={{ background:t.alt, borderRadius:8, padding:"8px 12px", fontFamily:FB, borderLeft:`3px solid ${c.c}` }}>
                  <div style={{ fontSize:8, color:t.fa, textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{c.l}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:c.c }}>{c.v}</div>
                </div>
              ))}
            </div>

            {/* Flow table */}
            <Card t={t}>
              <div style={{ overflowX:"auto", maxHeight:"45vh", overflowY:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
                  <thead><tr>
                    {["#","Meses","Cupón (%)","Amort. (%)","Flujo (%)","Flujo USD"].map((h,i)=>(
                      <th key={h} style={{ padding:"8px 10px", textAlign:i>=2?"right":"center", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {flows.map((f,i)=>(
                      <tr key={i} style={{ borderBottom:`1px solid ${t.brd}33` }}>
                        <td style={{ padding:"5px 10px", textAlign:"center", color:t.fa, fontSize:10 }}>{f.periodo}</td>
                        <td style={{ padding:"5px 10px", textAlign:"center", color:t.mu }}>{f.meses}m</td>
                        <td style={{ padding:"5px 10px", textAlign:"right", color:t.bl }}>{f.cupon.toFixed(2)}%</td>
                        <td style={{ padding:"5px 10px", textAlign:"right", color:f.amort>0?t.go:t.fa }}>{f.amort>0?`${f.amort}%`:"—"}</td>
                        <td style={{ padding:"5px 10px", textAlign:"right", fontWeight:600, color:t.tx }}>{f.cf.toFixed(2)}%</td>
                        <td style={{ padding:"5px 10px", textAlign:"right", fontWeight:700, color:f.amort>0?t.go:t.bl }}>
                          ${(f.cf * laminas).toLocaleString("es-AR",{maximumFractionDigits:2})}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop:`2px solid ${t.brd}`, background:t.alt }}>
                      <td colSpan={4} style={{ padding:"8px 10px", fontWeight:700, color:t.tx }}>TOTAL RECIBIDO</td>
                      <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:t.tx }}>{(totalCupones+100).toFixed(1)}%</td>
                      <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:t.gr }}>
                        ${totalRecibido.toLocaleString("es-AR",{maximumFractionDigits:0})}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
            <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:8 }}>
              * 1 lámina = $100 VN · Pagos {sel.freq.toLowerCase()}s · {sel.tipo} · No incluye comisiones ni impuestos.
            </p>
          </div>
        );
      })()}

      {/* ── TAB: Señales de Venta (TIR < 5.3%) ── */}
      {onSub === "sell" && (() => {
        const TIR_THRESHOLD = 5.3;
        const allONs = [...ONS_ARG_DATA.map(o=>({...o,ley:"ARG"})), ...ONS_NY_DATA.map(o=>({...o,ley:"NY"}))];
        const sellCandidates = allONs
          .filter(o => o.tir !== null && o.tir > 0 && o.tir < TIR_THRESHOLD)
          .sort((a,b) => a.tir - b.tir);

        return (
          <div>
            <div style={{ background:t.rdBg, border:`1px solid ${t.rdAcc}44`, borderRadius:10, padding:"14px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:16, lineHeight:1.6, display:"flex", alignItems:"flex-start", gap:10 }}>
              <AlertTriangle size={16} style={{flexShrink:0, marginTop:2}} />
              <div>
                <strong>Señales de venta:</strong> ONs con TIR menor a {TIR_THRESHOLD}% en tiempo real. Considerá rotar hacia instrumentos de mayor rendimiento. Esta lista se actualiza con los precios de mercado.
              </div>
            </div>

            {sellCandidates.length === 0 ? (
              <Card t={t}><div style={{ padding:40, textAlign:"center" }}>
                <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.gr, marginBottom:8 }}>Sin señales de venta</div>
                <p style={{ fontFamily:FB, fontSize:12, color:t.mu }}>Ninguna ON del universo cotiza debajo de {TIR_THRESHOLD}% de TIR actualmente.</p>
              </div></Card>
            ) : (
              <Card t={t}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
                    <thead><tr>
                      {["Ticker","Emisor","TIR","Cupón","Precio","Duration","Vto","Ley","Acción"].map((h,i)=>(
                        <th key={h} style={{ padding:"8px 10px", textAlign:i>=2&&i<=5?"right":"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em", borderBottom:`2px solid ${t.brd}`, background:t.alt }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {sellCandidates.map((o,i) => {
                        const live = corpPrices[o.t];
                        return (
                          <tr key={i} style={{ borderBottom:`1px solid ${t.brd}33`, background:t.rdBg+"44" }}>
                            <td style={{ padding:"6px 10px" }}>
                              <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:4, background:t.rd+"15", color:t.rd, border:`1px solid ${t.rd}33` }}>{o.t}</span>
                            </td>
                            <td style={{ padding:"6px 10px", fontSize:10, color:t.tx }}>{o.em}</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700, color:t.rd }}>{o.tir.toFixed(2)}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.cup?.toFixed(1)}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:600, color:live?t.tx:t.mu }}>${(live?.price||o.p).toFixed(2)}</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", color:t.mu }}>{o.dur?.toFixed(1)}a</td>
                            <td style={{ padding:"6px 10px", fontSize:10, color:t.mu }}>{o.vto}</td>
                            <td style={{ padding:"6px 10px" }}>
                              <span style={{ fontSize:9, fontWeight:600, padding:"2px 6px", borderRadius:4, background:o.ley==="NY"?t.blBg:t.goBg, color:o.ley==="NY"?t.bl:t.go }}>{o.ley}</span>
                            </td>
                            <td style={{ padding:"6px 10px" }}>
                              <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.rd, background:t.rdBg, padding:"3px 8px", borderRadius:6, border:`1px solid ${t.rd}33` }}>VENDER</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.brd}`, fontFamily:FB, fontSize:10, color:t.fa }}>
                  {sellCandidates.length} ONs con TIR &lt; {TIR_THRESHOLD}% · Umbral configurable · No constituye asesoramiento
                </div>
              </Card>
            )}
          </div>
        );
      })()}

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, lineHeight:1.5, marginTop:12 }}>
        Fuente: datos en vivo. No constituye asesoramiento.
      </p>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   CEDEARs PANEL — Top 50 · Precios live vía DATA912
   /live/arg_cedears → { symbol, c, pct_change }
════════════════════════════════════════════════════════════════ */
const CEDEARS_LIST = [
  {t:"AAPL",n:"Apple",s:"Tech"},{t:"MSFT",n:"Microsoft",s:"Tech"},{t:"GOOGL",n:"Alphabet",s:"Tech"},
  {t:"AMZN",n:"Amazon",s:"Tech"},{t:"META",n:"Meta Platforms",s:"Tech"},{t:"NVDA",n:"NVIDIA",s:"Tech"},
  {t:"TSLA",n:"Tesla",s:"Autos"},{t:"NFLX",n:"Netflix",s:"Media"},{t:"AMD",n:"AMD",s:"Semis"},
  {t:"INTC",n:"Intel",s:"Semis"},{t:"AVGO",n:"Broadcom",s:"Semis"},{t:"ORCL",n:"Oracle",s:"Tech"},
  {t:"ADBE",n:"Adobe",s:"Tech"},{t:"CRM",n:"Salesforce",s:"Tech"},{t:"QCOM",n:"Qualcomm",s:"Semis"},
  {t:"JPM",n:"JPMorgan Chase",s:"Financiero"},{t:"BAC",n:"Bank of America",s:"Financiero"},
  {t:"GS",n:"Goldman Sachs",s:"Financiero"},{t:"V",n:"Visa",s:"Financiero"},{t:"MA",n:"Mastercard",s:"Financiero"},
  {t:"XOM",n:"ExxonMobil",s:"Energía"},{t:"CVX",n:"Chevron",s:"Energía"},
  {t:"KO",n:"Coca-Cola",s:"Consumo"},{t:"PEP",n:"PepsiCo",s:"Consumo"},{t:"MCD",n:"McDonald's",s:"Consumo"},
  {t:"WMT",n:"Walmart",s:"Consumo"},{t:"NKE",n:"Nike",s:"Consumo"},{t:"DIS",n:"Walt Disney",s:"Media"},
  {t:"JNJ",n:"Johnson & Johnson",s:"Salud"},{t:"PFE",n:"Pfizer",s:"Salud"},{t:"ABBV",n:"AbbVie",s:"Salud"},
  {t:"UNH",n:"UnitedHealth",s:"Salud"},{t:"COST",n:"Costco",s:"Consumo"},
  {t:"MELI",n:"MercadoLibre",s:"Tech"},{t:"BABA",n:"Alibaba",s:"Tech"},{t:"NIO",n:"NIO",s:"Autos"},
  {t:"PBR",n:"Petrobras",s:"Energía"},{t:"VALE",n:"Vale",s:"Materiales"},{t:"GLOB",n:"Globant",s:"Tech"},
  {t:"COIN",n:"Coinbase",s:"Cripto"},{t:"MSTR",n:"Strategy (MicroStr.)",s:"Cripto"},
  {t:"PLTR",n:"Palantir",s:"Tech"},{t:"ARM",n:"ARM Holdings",s:"Semis"},
  {t:"SPY",n:"S&P 500 ETF",s:"ETF"},{t:"QQQ",n:"Nasdaq 100 ETF",s:"ETF"},
  {t:"EWZ",n:"Brasil ETF",s:"ETF"},{t:"XLE",n:"Energy ETF",s:"ETF"},
  {t:"GLD",n:"Gold ETF",s:"ETF"},{t:"DIA",n:"Dow Jones ETF",s:"ETF"},
  {t:"ARKK",n:"ARK Innovation",s:"ETF"},{t:"ASML",n:"ASML Holding",s:"Semis"},
  // ── ENERGÍA ──
  {t:"COP",n:"ConocoPhillips",s:"Energía"},{t:"EOG",n:"EOG Resources",s:"Energía"},
  {t:"OXY",n:"Occidental Petroleum",s:"Energía"},{t:"SLB",n:"Schlumberger",s:"Energía"},
  {t:"HAL",n:"Halliburton",s:"Energía"},{t:"PSX",n:"Phillips 66",s:"Energía"},
  {t:"DVN",n:"Devon Energy",s:"Energía"},{t:"MPC",n:"Marathon Petroleum",s:"Energía"},
  // ── DEFENSA ──
  {t:"LMT",n:"Lockheed Martin",s:"Defensa"},{t:"NOC",n:"Northrop Grumman",s:"Defensa"},
  {t:"GD",n:"General Dynamics",s:"Defensa"},{t:"RTX",n:"RTX Corp.",s:"Defensa"},
  // ── INDUSTRIALES ──
  {t:"HON",n:"Honeywell",s:"Industrial"},{t:"BA",n:"Boeing",s:"Industrial"},
  {t:"DE",n:"John Deere",s:"Industrial"},{t:"MMM",n:"3M Company",s:"Industrial"},
  {t:"CAT",n:"Caterpillar",s:"Industrial"},{t:"UPS",n:"UPS",s:"Industrial"},
  {t:"FDX",n:"FedEx Corp.",s:"Industrial"},
  // ── SALUD ──
  {t:"LLY",n:"Eli Lilly",s:"Salud"},{t:"ABT",n:"Abbott Labs",s:"Salud"},
  {t:"MDT",n:"Medtronic",s:"Salud"},{t:"CVS",n:"CVS Health",s:"Salud"},
  {t:"BMY",n:"Bristol-Myers",s:"Salud"},{t:"MRK",n:"Merck",s:"Salud"},
  // ── TECH/CLOUD ──
  {t:"CRWD",n:"CrowdStrike",s:"Tech"},{t:"PANW",n:"Palo Alto Networks",s:"Tech"},
  {t:"NET",n:"Cloudflare",s:"Tech"},{t:"SNOW",n:"Snowflake",s:"Tech"},
  {t:"NOW",n:"ServiceNow",s:"Tech"},{t:"DDOG",n:"Datadog",s:"Tech"},
  {t:"SHOP",n:"Shopify",s:"Tech"},{t:"HOOD",n:"Robinhood",s:"Financiero"},
  // ── FINANCIERO/ALT ──
  {t:"BX",n:"Blackstone",s:"Financiero"},{t:"KKR",n:"KKR & Co.",s:"Financiero"},
  {t:"SCHW",n:"Charles Schwab",s:"Financiero"},{t:"SPGI",n:"S&P Global",s:"Financiero"},
  {t:"C",n:"Citigroup",s:"Financiero"},{t:"MS",n:"Morgan Stanley",s:"Financiero"},
  {t:"BRK.B",n:"Berkshire Hathaway B",s:"Financiero"},
  // ── CONSUMO ──
  {t:"SBUX",n:"Starbucks",s:"Consumo"},{t:"TGT",n:"Target Corp.",s:"Consumo"},
  {t:"CMG",n:"Chipotle",s:"Consumo"},{t:"LOW",n:"Lowe's",s:"Consumo"},
  {t:"YUM",n:"Yum! Brands",s:"Consumo"},{t:"TJX",n:"TJX Companies",s:"Consumo"},
  {t:"HD",n:"Home Depot",s:"Consumo"},
  // ── UTILITIES ──
  {t:"NEE",n:"NextEra Energy",s:"Utilities"},{t:"SO",n:"Southern Co.",s:"Utilities"},
  {t:"DUK",n:"Duke Energy",s:"Utilities"},
  // ── ETFs ADICIONALES ──
  {t:"IVV",n:"iShares S&P 500 ETF",s:"ETF"},{t:"VTI",n:"Vanguard Total Market",s:"ETF"},
  {t:"TLT",n:"iShares 20Y Treasury",s:"ETF"},{t:"HYG",n:"iShares High Yield Bond",s:"ETF"},
  {t:"COPX",n:"Global X Copper Miners",s:"ETF"},{t:"ILF",n:"iShares Latin America 40",s:"ETF"},
  {t:"XLI",n:"Industrial Sector SPDR",s:"ETF"},{t:"XLU",n:"Utilities Sector SPDR",s:"ETF"},
  // ── TELECOM ──
  {t:"T",n:"AT&T Inc.",s:"Telecom"},{t:"VZ",n:"Verizon",s:"Telecom"},
  {t:"CMCSA",n:"Comcast Corp.",s:"Telecom"},
  // ── LATAM ──
  {t:"EC",n:"Ecopetrol S.A.",s:"Energía"},{t:"BRFS",n:"BRF S.A.",s:"Consumo"},
  {t:"TX",n:"Ternium S.A.",s:"Industrial"},
];

function CEDEARsPanel({ t }) {
  const [prices, setPrices] = useState({});
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [fSector, setFSector] = useState("Todos");
  const [view, setView] = useState("grid"); // "grid" | "heat" | "table"
  const [sortBy, setSortBy] = useState("pct"); // "pct" | "t" | "price"
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Usar proxy /api/cedears en lugar de llamar DATA912 directamente
        // (evita CORS y normaliza símbolos server-side)
        const r = await fetch("/api/cedears");
        const json = await r.json();
        const map = json.map || {};
        setPrices(map);
        setLastUpdate(new Date());
        setStatus(Object.keys(map).length > 0 ? "ok" : "empty");
      } catch { setStatus("error"); }
    };
    load();
    const id = setInterval(load, 120000);
    return () => clearInterval(id);
  }, []);

  const sectors = ["Todos", ...new Set(CEDEARS_LIST.map(c=>c.s))].sort((a,b)=>a==="Todos"?-1:b==="Todos"?1:a.localeCompare(b));

  const enriched = CEDEARS_LIST.map(c => {
    const live = prices[c.t] || prices[c.t+"D"] || prices[c.t.toUpperCase()] || prices[c.t.toUpperCase()+"D"] || prices[c.t+".BA"] || null;
    return { ...c, price: live?.price ?? null, pct: live?.pct ?? null, hasLive: !!live };
  });

  const filtered = enriched.filter(c => {
    if (fSector !== "Todos" && c.s !== fSector) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.t.toLowerCase().includes(q) || c.n.toLowerCase().includes(q) || c.s.toLowerCase().includes(q);
    }
    return true;
  }).sort((a,b) => {
    if (sortBy === "pct") {
      if (a.pct === null && b.pct === null) return a.t.localeCompare(b.t);
      if (a.pct === null) return 1;
      if (b.pct === null) return -1;
      return b.pct - a.pct;
    }
    if (sortBy === "price") {
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return b.price - a.price;
    }
    return a.t.localeCompare(b.t);
  });

  const liveCount = enriched.filter(c=>c.hasLive).length;
  const withPct = filtered.filter(c=>c.pct!==null);
  const topGainers = [...withPct].sort((a,b)=>b.pct-a.pct).slice(0,3);
  const topLosers  = [...withPct].sort((a,b)=>a.pct-b.pct).slice(0,3);
  const maxAbsPct  = Math.max(...withPct.map(c=>Math.abs(c.pct||0)), 1);

  const secColor = {
    "Tech":t.bl,"Semis":t.pu,"Energía":t.go,"Financiero":t.gr,"Salud":t.rd,
    "Consumo":"#f97316","Industrial":"#6366f1","ETF":"#0ea5e9","Autos":"#a78bfa",
    "Media":"#ec4899","Defensa":"#dc2626","Materiales":"#84cc16","Utilities":"#14b8a6",
    "Telecom":"#64748b","Cripto":"#f59e0b","Inmob.":"#8b5cf6",
  };
  const secBg = {
    "Tech":t.blBg,"Semis":t.puBg,"Energía":t.goBg,"Financiero":t.grBg,"Salud":t.rdBg,
    "Consumo":"#fff7ed","Industrial":"#eef2ff","ETF":"#f0f9ff","Autos":"#f5f3ff",
    "Media":"#fdf2f8","Defensa":"#fef2f2","Materiales":"#f7fee7","Utilities":"#f0fdfa",
    "Telecom":"#f8fafc","Cripto":"#fffbeb","Inmob.":"#faf5ff",
  };

  const getSC = s => secColor[s] || t.mu;
  const getSB = s => secBg[s] || t.alt;

  const heatColor = (pct) => {
    if (pct === null) return t.alt;
    if (pct >= 3)    return "#14532d";
    if (pct >= 2)    return "#166534";
    if (pct >= 1)    return "#15803d";
    if (pct >= 0.5)  return "#16a34a";
    if (pct >= 0)    return "#22c55e33";
    if (pct >= -0.5) return "#fca5a533";
    if (pct >= -1)   return "#ef4444";
    if (pct >= -2)   return "#dc2626";
    return "#991b1b";
  };
  const heatText = (pct) => {
    if (pct === null) return t.mu;
    return pct >= 0 ? (pct >= 0.5 ? "#fff" : t.gr) : (pct <= -0.5 ? "#fff" : t.rd);
  };

  const secEmoji = s => ({"Tech":"💻","Energía":"⚡","Financiero":"🏦","Salud":"⚕️","Defensa":"🛡️","ETF":"📊","Semis":"🔬","Consumo":"🛒","Industrial":"⚙️","Cripto":"₿","Utilities":"🔌","Telecom":"📡","Media":"🎬","Autos":"🚗"}[s] || "📈");

  return (
    <div className="fade-up">
      {/* ═══ HEADER ═══ */}
      <div style={{
        background:"linear-gradient(135deg,#0a1628 0%,#0d2137 50%,#0a1628 100%)",
        borderRadius:20, padding:"28px 32px", marginBottom:20,
        border:"1px solid rgba(255,255,255,.06)", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-60, top:-60, width:240, height:240, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(14,165,233,.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)",
              letterSpacing:".15em", textTransform:"uppercase", marginBottom:6 }}>
              BYMA · CERTIFICADOS DE DEPÓSITO ARGENTINO
            </div>
            <h2 style={{ fontFamily:FD, fontSize:32, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-.02em" }}>
              CEDEARs <span style={{color:"#0ea5e9"}}>Market</span>
            </h2>
            <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,.4)", margin:"8px 0 0" }}>
              {CEDEARS_LIST.length} activos internacionales · Precios en ARS · Ajustados por CCL
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8,
              background:"rgba(255,255,255,.06)", borderRadius:10, padding:"8px 16px",
              border:"1px solid rgba(255,255,255,.08)" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", display:"inline-block",
                background: status==="ok" ? "#22c55e" : "#f59e0b",
                boxShadow: status==="ok" ? "0 0 8px #22c55e" : "none",
                animation: status==="loading" ? "blink 1.2s infinite" : "none" }} />
              <span style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:"rgba(255,255,255,.8)" }}>
                {status==="ok" ? `${liveCount} precios en vivo` : status==="error" ? "API offline" : "Conectando..."}
              </span>
            </div>
            {lastUpdate && (
              <span style={{ fontFamily:FB, fontSize:9, color:"rgba(255,255,255,.3)" }}>
                Act. {lastUpdate.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}
              </span>
            )}
          </div>
        </div>

        {/* Live movers bar */}
        {(topGainers.length > 0 || topLosers.length > 0) && (
          <div style={{ marginTop:20, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontFamily:FB, fontSize:9, color:"rgba(255,255,255,.3)", marginRight:4, textTransform:"uppercase", letterSpacing:".08em" }}>HOY</span>
            {topGainers.map((c,i)=>(
              <div key={"g"+i} style={{ background:"rgba(34,197,94,.15)", border:"1px solid rgba(34,197,94,.25)",
                borderRadius:8, padding:"4px 10px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:"#4ade80" }}>{c.t}</span>
                <span style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:"#22c55e" }}>+{c.pct.toFixed(2)}%</span>
              </div>
            ))}
            <span style={{ color:"rgba(255,255,255,.15)", fontSize:12 }}>|</span>
            {topLosers.map((c,i)=>(
              <div key={"l"+i} style={{ background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.25)",
                borderRadius:8, padding:"4px 10px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:"#f87171" }}>{c.t}</span>
                <span style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:"#ef4444" }}>{c.pct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CONTROLS BAR ═══ */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"0 0 auto" }}>
          <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker, empresa..."
            style={{ fontFamily:FB, fontSize:12, padding:"9px 12px 9px 32px", borderRadius:12, width:220,
              border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none", transition:"border-color .15s" }}
            onFocus={e=>e.target.style.borderColor=t.bl}
            onBlur={e=>e.target.style.borderColor=t.brd} />
        </div>

        <div style={{ display:"flex", background:t.alt, borderRadius:10, padding:3, border:`1px solid ${t.brd}`, gap:2 }}>
          {[{id:"grid",label:"▦ Grid"},{id:"heat",label:"⬛ Mapa"},{id:"table",label:"≡ Tabla"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{
              padding:"5px 13px", borderRadius:8, fontFamily:FB, fontSize:10, fontWeight:600, cursor:"pointer",
              border:"none", transition:"all .15s",
              background:view===v.id?t.bl:"transparent",
              color:view===v.id?"#fff":t.mu,
            }}>{v.label}</button>
          ))}
        </div>

        <div style={{ display:"flex", background:t.alt, borderRadius:10, padding:3, border:`1px solid ${t.brd}`, gap:2 }}>
          {[{id:"pct",label:"% Var."},{id:"price",label:"Precio"},{id:"t",label:"A–Z"}].map(s=>(
            <button key={s.id} onClick={()=>setSortBy(s.id)} style={{
              padding:"5px 13px", borderRadius:8, fontFamily:FB, fontSize:10, fontWeight:600, cursor:"pointer",
              border:"none", transition:"all .15s",
              background:sortBy===s.id?t.go:"transparent",
              color:sortBy===s.id?"#fff":t.mu,
            }}>{s.label}</button>
          ))}
        </div>

        <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:10, color:t.fa }}>
          {filtered.filter(c=>c.hasLive).length} live / {filtered.length} mostrados
        </span>
      </div>

      {/* ═══ SECTOR PILLS ═══ */}
      <div style={{ display:"flex", gap:5, marginBottom:20, flexWrap:"wrap" }}>
        {sectors.map(s=>{
          const sc = getSC(s);
          const isActive = fSector===s;
          const count = s==="Todos" ? CEDEARS_LIST.length : CEDEARS_LIST.filter(c=>c.s===s).length;
          return (
            <button key={s} onClick={()=>setFSector(s)} style={{
              padding:"6px 14px", borderRadius:20, fontFamily:FB, fontSize:10, fontWeight:700, cursor:"pointer",
              border:`1.5px solid ${isActive?sc:t.brd}`,
              background:isActive?sc:"transparent",
              color:isActive?"#fff":(s==="Todos"?t.mu:sc),
              transition:"all .18s", display:"flex", alignItems:"center", gap:5,
            }}>
              {s !== "Todos" && <span style={{fontSize:11}}>{secEmoji(s)}</span>}
              {s} <span style={{ opacity:.65, fontSize:8 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* ═══ GRID VIEW ═══ */}
      {view === "grid" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:10 }}>
          {filtered.map((c,i) => {
            const sc = getSC(c.s);
            const isUp = c.pct !== null && c.pct >= 0;
            const pctColor = c.pct === null ? t.mu : c.pct >= 0 ? t.gr : t.rd;
            return (
              <div key={i} style={{
                background:t.srf, border:`1px solid ${t.brd}`,
                borderTop:`3px solid ${sc}`,
                borderRadius:14, padding:"16px 16px 13px",
                cursor:"pointer", transition:"all .18s", position:"relative", overflow:"hidden",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 28px ${sc}22`;e.currentTarget.style.borderColor=sc;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.borderTopColor=sc;}}
              onClick={()=>window.__goChart?.(c.t)}>
                <div style={{ position:"absolute", right:-6, bottom:-14, fontSize:56, opacity:.04, pointerEvents:"none", userSelect:"none" }}>
                  {secEmoji(c.s)}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:800, color:sc,
                    background:sc+"15", padding:"3px 8px", borderRadius:6, border:`1px solid ${sc}30` }}>
                    {c.t}
                  </div>
                  <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:sc,
                    background:getSB(c.s), padding:"2px 7px", borderRadius:10 }}>{c.s}</span>
                </div>
                <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:t.tx, marginBottom:12,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</div>
                {c.hasLive ? (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                      <div style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, lineHeight:1 }}>
                        ${c.price.toLocaleString("es-AR",{maximumFractionDigits:0})}
                      </div>
                      <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:pctColor }}>
                        {isUp?"+":""}{c.pct.toFixed(2)}%
                      </div>
                    </div>
                    <div style={{ height:4, background:t.alt, borderRadius:4, overflow:"hidden", marginBottom:6 }}>
                      <div style={{
                        width:`${50 + (c.pct||0)/maxAbsPct*50}%`,
                        height:"100%", borderRadius:4,
                        background:`linear-gradient(90deg,${isUp?t.gr:t.rd}66,${isUp?t.gr:t.rd})`,
                        transition:"width .6s",
                      }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",
                        display:"inline-block",boxShadow:"0 0 5px #22c55e"}}/>
                      <span style={{ fontFamily:FB, fontSize:8, color:t.fa }}>EN VIVO</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily:FB, fontSize:10, color:t.fa, padding:"8px 0",
                    borderTop:`1px solid ${t.brd}44`, fontStyle:"italic" }}>
                    Sin precio · sin cobertura DATA912
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ HEAT MAP VIEW ═══ */}
      {view === "heat" && (
        <div>
          <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginBottom:14 }}>
            Verde oscuro = mayor suba del día · Rojo oscuro = mayor baja · Gris = sin precio disponible
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))", gap:4 }}>
            {filtered.map((c,i) => {
              const bg = heatColor(c.pct);
              const fg = heatText(c.pct);
              return (
                <button key={i} onClick={()=>window.__goChart?.(c.t)} style={{
                  background:bg, borderRadius:8, padding:"10px 8px 8px",
                  border:"1px solid rgba(0,0,0,.08)", cursor:"pointer", textAlign:"center",
                  transition:"transform .12s",
                }}
                title={`${c.n} · ${c.pct!==null?(c.pct>=0?"+":"")+c.pct.toFixed(2)+"%":"sin dato"}`}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{ fontFamily:"monospace", fontSize:11, fontWeight:800, color:fg, marginBottom:2 }}>{c.t}</div>
                  {c.pct !== null
                    ? <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:fg }}>{c.pct>=0?"+":""}{c.pct.toFixed(1)}%</div>
                    : <div style={{ fontFamily:FB, fontSize:8, color:"rgba(128,128,128,.5)" }}>—</div>
                  }
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:16, alignItems:"center" }}>
            <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>Escala:</span>
            {[["#14532d",">3%"],["#166534","2-3%"],["#15803d","1-2%"],["#22c55e33","0-1%"],
              ["#fca5a533","-1-0%"],["#ef4444","-2--1%"],["#dc2626","-3--2%"],["#991b1b","<-3%"]
            ].map(([bg,label],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:3 }}>
                <div style={{ width:12,height:12,borderRadius:3,background:bg,border:"1px solid rgba(0,0,0,.1)" }}/>
                <span style={{ fontFamily:FB, fontSize:8, color:t.mu }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ TABLE VIEW ═══ */}
      {view === "table" && (
        <Card t={t}>
          <div style={{ overflowX:"auto", maxHeight:"65vh", overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:11 }}>
              <thead><tr>
                {["Ticker","Empresa","Sector","Precio ARS","Var. %",""].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 12px", textAlign:i>2?"right":"left",
                    fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".06em",
                    borderBottom:`2px solid ${t.brd}`, whiteSpace:"nowrap", position:"sticky", top:0,
                    zIndex:2, background:t.alt }}>
                    {h}
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((c,i) => {
                  const sc = getSC(c.s);
                  const isUp = c.pct !== null && c.pct >= 0;
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${t.brd}22`, transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.alt}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontFamily:"monospace", fontSize:10, fontWeight:700,
                            background:sc+"15", color:sc, padding:"2px 7px", borderRadius:5,
                            border:`1px solid ${sc}30` }}>{c.t}</span>
                          {c.hasLive && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e"}}/>}
                        </div>
                      </td>
                      <td style={{ padding:"8px 12px", color:t.tx, fontWeight:500,
                        maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</td>
                      <td style={{ padding:"8px 12px" }}>
                        <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, padding:"2px 8px",
                          borderRadius:12, background:sc+"18", color:sc }}>{c.s}</span>
                      </td>
                      <td style={{ padding:"8px 12px", textAlign:"right", fontFamily:"monospace",
                        fontWeight:700, color:c.hasLive?t.tx:t.fa }}>
                        {c.price ? `$${c.price.toLocaleString("es-AR",{maximumFractionDigits:0})}` : "—"}
                      </td>
                      <td style={{ padding:"8px 12px", textAlign:"right" }}>
                        {c.pct !== null
                          ? <span style={{ fontWeight:700, fontSize:12, color:isUp?t.gr:t.rd }}>
                              {isUp?"+":""}{c.pct.toFixed(2)}%
                            </span>
                          : <span style={{color:t.fa}}>—</span>}
                      </td>
                      <td style={{ padding:"8px 8px", textAlign:"right" }}>
                        <button onClick={()=>window.__goChart?.(c.t)} style={{
                          width:28,height:28,borderRadius:8,display:"inline-flex",alignItems:"center",
                          justifyContent:"center",background:t.alt,border:`1px solid ${t.brd}`,
                          color:t.mu,cursor:"pointer",transition:"all .15s",
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.background=sc+"15";e.currentTarget.style.color=sc;e.currentTarget.style.borderColor=sc;}}
                        onMouseLeave={e=>{e.currentTarget.style.background=t.alt;e.currentTarget.style.color=t.mu;e.currentTarget.style.borderColor=t.brd;}}>
                          <LineChart size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.brd}`,
            display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
            <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>
              Fuente: DATA912 · BYMA · Refresh 2 min
            </span>
            <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>
              {filtered.filter(c=>c.hasLive).length} live / {filtered.length} total
            </span>
          </div>
        </Card>
      )}

      <div style={{ marginTop:20, padding:"12px 16px", background:t.alt, borderRadius:10, border:`1px solid ${t.brd}` }}>
        <p style={{ fontFamily:FB, fontSize:9, color:t.fa, margin:0, lineHeight:1.7 }}>
          Precios en ARS · Ajustados por CCL implícito · Fuente: DATA912 / BYMA ·
          Cada CEDEAR representa una fracción de la acción subyacente según ratio de conversión Banco Comafi ·
          Los rendimientos pasados no garantizan resultados futuros
        </p>
      </div>
    </div>
  );
}

function InstrumentosView({ t }) {
  const [sub, setSub] = useState("lecap");
  const [bondPrices,  setBondPrices]  = useState({});
  const [bondStatus,  setBondStatus]  = useState("loading");
  const [lecapLive,   setLecapLive]   = useState({}); // precios live S-prefix de DATA912
  const [uvaIndex,    setUvaIndex]    = useState(null);
  const [tamarRate,   setTamarRate]   = useState(null);
  const [arsStatus,   setArsStatus]   = useState("loading");
  const [lastUpdate,  setLastUpdate]  = useState(null);
  const REFRESH_MS = 5 * 60 * 1000; // 5 minutos

  const BASE_DATE     = new Date("2026-03-19");
  const BASE_TC_A3500 = 1399.60;
  const daysSinceBase = Math.floor((Date.now() - BASE_DATE.getTime()) / 86400000);
  const today = new Date().toLocaleDateString("es-AR");

  // Fetch 1: DATA912 — UN SOLO endpoint arg_bonds tiene TODO
  // Verificado 24/MAR/2026:
  //   Soberanos: AO27D=102.5, AL30D=60.96, GD30D=62.68
  //   BONCAPs:   T15E7=128.5, T30A7=116.7, T30J6=135.5, T31Y7=109.8, TY30P=117.9
  //   Duales:    TTJ26=151.4, TTS26=150.0, TTD26=148.5
  //   CER:       TX26=1300, TX28=1880, TX31=1333
  //   DL:        TZV26=138700, TZV27=132480
  // arg_notes tiene S-prefix (LECAPs) + X-prefix (LECAP DL)
  useEffect(() => {
    const load = async () => {
      try {
        // arg_bonds via proxy (evita CORS)
        const rb = await fetch("/api/equities?type=bonds");
        const bondsJson = await rb.json();
        const prices = bondsJson.map || {};
        // también indexar sin sufijo para compatibilidad
        (bondsJson.raw || []).forEach(b => {
          if (!b.symbol || b.c == null) return;
          prices[b.symbol] = { price: b.c, pct: b.pct_change };
        });
        const matched = SOBERANOS.filter(s => prices[s.t]).length;
        setBondPrices(prices);
        setBondStatus(matched > 0 ? "ok" : "error");
      } catch {
        setBondStatus("error");
      }

      try {
        // arg_notes via proxy (LECAPs)
        const rn = await fetch("/api/equities?type=notes");
        const notesJson = await rn.json();
        const lp = notesJson.map || {};
        setLecapLive(lp);
      } catch {}

      setLastUpdate(new Date());
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Fetch 2: UVA + TAMAR — refresh cada 5 min
  useEffect(() => {
    const run = async () => {
      let hits = 0;
      try {
        const r = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva");
        const data = await r.json();
        if (Array.isArray(data) && data.length > 0) {
          setUvaIndex(parseFloat(data[data.length - 1].valor));
          hits++;
        }
      } catch {}
      try {
        const r = await fetch("/api/bcra?list=1");
        const data = await r.json();
        const results = data.results || [];
        const tamar = results.find(v =>
          (v.descripcion || "").toLowerCase().includes("tamar") && (v.descripcion || "").toLowerCase().includes("privad")
        );
        if (tamar && tamar.ultValorInformado) { setTamarRate(parseFloat(tamar.ultValorInformado)); hits++; }
      } catch {}
      setArsStatus(hits > 0 ? "ok" : "partial");
      setLastUpdate(new Date());
    };
    run();
    const id = setInterval(run, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // LECAP/BONCAP: cálculo correcto
  // VN_vto = pBase × (1 + r_base) — valor técnico al vencimiento, fijo
  // TEM_live = (VN_vto / pLive)^(30/diasRest) - 1
  // TNA = rendimiento_total × (365 / diasRest)  ← convención mercado ARG
  const calcLECAPMetrics = (row, g) => {
    const pBase   = parseFloat(row.pre.replace("$","").replace(/\./g,"").replace(",","."));
    const rBase   = parseFloat(row.r.replace("%","").replace(",",".")) / 100;
    const temBase = parseFloat(row.tem.replace("%","").replace(",",".")) / 100;
    if (!pBase || !rBase || !temBase) return null;

    const vnVto    = pBase * (1 + rBase);
    const diasBase = g.dias;
    const diasRest = Math.max(1, diasBase - daysSinceBase);

    // Precio live: S-prefix → lecapLive (arg_notes), T-prefix → bondPrices (arg_bonds)
    // Verificado 24/MAR: T15E7=128.5, T31Y7=109.8, S29Y6=126.01
    const isS = row.t.startsWith("S");
    const isT = row.t.startsWith("T");
    const liveData = isS ? lecapLive[row.t] : isT ? bondPrices[row.t] : null;
    const pLive = liveData?.price > 0
      ? liveData.price
      : pBase * Math.pow(1 + temBase, daysSinceBase / 30);
    const isLiveLECAP = !!(liveData?.price > 0);

    if (diasRest <= 0) return { pLive, rendimiento:0, tem:0, tna:0, diasRest:0, isLiveLECAP };

    const rendimiento = (vnVto / pLive - 1) * 100;
    const temLive = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;
    const tnaLive = rendimiento * (365 / diasRest);

    return { pLive, rendimiento, tem: temLive, tna: tnaLive, diasRest, isLiveLECAP };
  };

  const diasHasta = (vtoStr) => {
    const parts = vtoStr.split("/");
    if (parts.length !== 3) return 0;
    const [d, m, y] = parts.map(Number);
    const vto = new Date(y, m - 1, d);
    return Math.max(0, Math.floor((vto - Date.now()) / 86400000));
  };

  const Th2 = ({children, right}) => (
    <th style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:700,
      color:t.mu, letterSpacing:".08em", textTransform:"uppercase",
      borderBottom:`2px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap",
      position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
  const Td2 = ({children, right, bold, color}) => (
    <td style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:12,
      fontWeight:bold?700:400, color:color||t.tx, whiteSpace:"nowrap" }}>
      {children}
    </td>
  );
  const trStyle = { borderBottom:`1px solid ${t.brd}`, transition:"background .12s" };
  const trHover = e => { e.currentTarget.style.background=t.alt; };
  const trLeave = e => { e.currentTarget.style.background="transparent"; };

  const ArsStatusChip = () => {
    const [secsAgo, setSecsAgo] = useState(0);
    useEffect(() => {
      if (!lastUpdate) return;
      const id = setInterval(() => {
        setSecsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }, [lastUpdate]);
    const nextIn = Math.max(0, Math.round((REFRESH_MS / 1000) - secsAgo));
    const lastStr = lastUpdate
      ? lastUpdate.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })
      : null;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${arsStatus==="ok"?t.grAcc+"55":t.brd}`,
          background:arsStatus==="ok"?t.grBg:t.alt, color:arsStatus==="ok"?t.gr:t.mu }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:arsStatus==="ok"?"#22c55e":"#94a3b8",
            boxShadow:arsStatus==="ok"?"0 0 6px #22c55e":"none",
            animation:arsStatus==="loading"?"blink 1s infinite":"none" }}/>
          {arsStatus==="loading" && "Cargando datos ARS..."}
          {arsStatus!=="loading" && (lastStr ? `Últ. actualización: ${lastStr}` : "Precios teóricos activos")}
          {uvaIndex  && <span style={{marginLeft:4,opacity:.7}}>· UVA {uvaIndex.toFixed(2)}</span>}
          {tamarRate && <span style={{marginLeft:2,opacity:.7}}>· TAMAR {tamarRate.toFixed(2)}%</span>}
        </div>
        {lastUpdate && arsStatus!=="loading" && (
          <div style={{ fontFamily:FB, fontSize:10, color:t.fa, display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%",
              background:t.go, opacity: nextIn < 30 ? 1 : 0.4,
              animation: nextIn < 30 ? "blink 0.8s infinite" : "none" }}/>
            Próximo refresh en {nextIn}s · cada 5 min
          </div>
        )}
      </div>
    );
  };

  const SUBTABS = [
    {id:"lecap",      label:"Renta Fija ARS",    Icon:ClipboardList},
    {id:"cer",        label:"Bonos CER",          Icon:TrendingUp},
    {id:"soberano",   label:"Soberanos USD",      Icon:Globe},
    {id:"calendario", label:"Calendario",         Icon:Clock},
    {id:"corp",       label:"Corporativos (ONs)", Icon:Building2},
    {id:"pf",         label:"Plazos Fijos",       Icon:Landmark},
  ];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBTABS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s", border:`2px solid ${sub===s.id?t.go:t.brd}`,
            background:sub===s.id?t.go+"18":"transparent", color:sub===s.id?t.go:t.mu,
            display:"flex", alignItems:"center", gap:6,
          }}><s.Icon size={14} /> {s.label}</button>
        ))}
      </div>

      {/* ── RENTA FIJA ARS ── */}
      {sub === "lecap" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <ArsStatusChip />
            <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
              Precio teórico = precio base 19-MAR capitalizado a TEM diaria. No incluye spread bid/ask.
            </span>
          </div>

          {/* ── CALCULADORA RENTA FIJA ── */}
          {(() => {
            // Build instrument list with live metrics
            const instrumentos = LECAP.flatMap(g => g.rows.map(r => {
              const m = calcLECAPMetrics(r, g);
              if (!m || m.diasRest <= 0) return null;
              return { ticker: r.t, vto: g.vto, mes: g.mes, ...m };
            })).filter(Boolean);

            return <RentaFijaCalc instrumentos={instrumentos} t={t} />;
          })()}

          {/* LECAP / BONCAP */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
            LECAP & BONCAP — Tasa Fija Capitalizable
          </div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto", maxHeight:"52vh", overflowY:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Vto","Ticker","Precio vivo","Días rest.","Rendim. act.","TNA act.","TEM","Var. base","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {LECAP.map((g, i) => g.rows.map((r, j) => {
                    const m = calcLECAPMetrics(r, g);
                    if (!m) return null;
                    const pBase = parseFloat(r.pre.replace("$","").replace(/\./g,"").replace(",","."));
                    const varBase = ((m.pLive - pBase) / pBase * 100);
                    return (
                      <tr key={`${i}-${j}`} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2 bold>{g.vto}</Td2>
                        <Td2>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{r.t}</span>
                            {m.isLiveLECAP
                              ? <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e",display:"inline-block"}} title="Precio en vivo"/>
                              : <span style={{fontSize:8,color:t.fa,fontFamily:FB}} title="Precio teórico (BONCAP)">~</span>
                            }
                          </div>
                        </Td2>
                        <Td2 right bold>
                          ${m.pLive.toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                        </Td2>
                        <Td2 right color={m.diasRest<=30?t.rd:m.diasRest<=90?t.go:t.mu}>{m.diasRest}d</Td2>
                        <Td2 right color={t.go} bold>{m.rendimiento.toFixed(2)}%</Td2>
                        <Td2 right>
                          <span style={{background:t.goBg,color:t.go,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>
                            {m.tna.toFixed(2)}%
                          </span>
                        </Td2>
                        <Td2 right color={t.bl}>{m.tem.toFixed(2)}%</Td2>
                        <Td2 right>
                          <span style={{fontWeight:600,color:varBase>=0?t.gr:t.rd}}>
                            {varBase>=0?"+":""}{varBase.toFixed(3)}%
                          </span>
                        </Td2>
                        <Td2 right color={t.mu}>{r.fxbe}</Td2>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bonos Duales */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>BONOS DUALES — Mayor de Fija o TAMAR</div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","TEM Fija","TNA Fija","TEM Var.","TNA Var.","TAMAR live","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {DUALES.map((d,i) => {
                    const diasAct = diasHasta(d.vto);
                    const tamarTEM = tamarRate ? ((Math.pow(1 + tamarRate/100/365, 30) - 1)*100) : null;
                    const liveD = bondPrices[d.t];
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span>
                            {liveD && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e",display:"inline-block"}} title="Precio en vivo"/>}
                          </div>
                        </Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right bold color={liveD?t.tx:t.mu}>
                          {liveD ? `$${liveD.price.toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "—"}
                        </Td2>
                        <Td2 right color={parseFloat(d.temFija.replace(",","."))<0?t.rd:t.go} bold>{d.temFija}</Td2>
                        <Td2 right color={parseFloat(d.tnaFija.replace(",","."))<0?t.rd:t.go}>{d.tnaFija}</Td2>
                        <Td2 right color={t.bl} bold>{d.temVar}</Td2>
                        <Td2 right><span style={{background:t.blBg,color:t.bl,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>{d.tnaVar}</span></Td2>
                        <Td2 right>
                          {tamarTEM
                            ? <span style={{background:t.puBg,color:t.pu,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>{tamarTEM.toFixed(2)}% TEM</span>
                            : <span style={{color:t.fa}}>—</span>}
                        </Td2>
                        <Td2 right color={t.mu}>{d.fxbe}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {tamarRate && (
              <div style={{padding:"8px 12px",fontFamily:FB,fontSize:10,color:t.mu,borderTop:`1px solid ${t.brd}`}}>
                💡 TAMAR actual: <strong>{tamarRate.toFixed(2)}% TNA</strong> · TEM: {((Math.pow(1+tamarRate/100/365,30)-1)*100).toFixed(2)}% · Fuente: BCRA API
              </div>
            )}
          </Card>

          {/* TAMAR */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>LETRAS TAMAR — Tasa Variable BCRA</div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","Rendim.","TNA live","TEM live","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {TAMAR.map((d,i) => {
                    const diasAct  = diasHasta(d.vto);
                    const tamarTEM = tamarRate ? ((Math.pow(1 + tamarRate/100/365, 30) - 1)*100) : null;
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span>
                            {tamarRate && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>}
                          </div>
                        </Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right color={t.go} bold>{d.rend}</Td2>
                        <Td2 right>
                          <span style={{background:t.puBg,color:t.pu,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>
                            {tamarRate ? `${tamarRate.toFixed(2)}%` : d.tna}
                          </span>
                        </Td2>
                        <Td2 right color={t.bl}>{tamarTEM ? `${tamarTEM.toFixed(2)}%` : d.tem}</Td2>
                        <Td2 right color={t.mu}>{d.fxbe}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Dólar Linked */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>DÓLAR LINKED</div>
          <Card t={t}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","Precio live","Rendim.","TNA"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {DOLARLINKED.map((d,i) => {
                    const diasAct = diasHasta(d.vto);
                    const liveD = bondPrices[d.t];
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span>
                            {liveD && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e",display:"inline-block"}} title="Precio en vivo"/>}
                          </div>
                        </Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right bold color={liveD?t.tx:t.mu}>
                          {liveD
                            ? `$${liveD.price.toLocaleString("es-AR",{minimumFractionDigits:0,maximumFractionDigits:0})}`
                            : d.pre}
                        </Td2>
                        <Td2 right color={parseFloat(d.rend.replace(",","."))<0?t.rd:t.gr} bold>{d.rend}</Td2>
                        <Td2 right color={parseFloat(d.tna.replace(",","."))<0?t.rd:t.gr}>{d.tna}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"8px 12px", fontFamily:FB, fontSize:10, color:t.fa, borderTop:`1px solid ${t.brd}` }}>
              * No constituye asesoramiento. TC base referencia: $1.399,60 al 19-MAR-2026.
            </div>
          </Card>

          {/* Yield Curve ARS — solo LECAPs y BONCAPs, máx 1 año */}
          {(() => {
            const curvePoints = LECAP.flatMap(g => g.rows.map(r => {
              const m = calcLECAPMetrics(r, g);
              if (!m || m.diasRest <= 0 || m.tna <= 0) return null;
              // Solo S-prefix (LECAPs) y T-prefix (BONCAPs), no X ni D (duales/DL)
              if (!r.t.startsWith("S") && !r.t.startsWith("T")) return null;
              // Máximo 365 días
              if (m.diasRest > 365) return null;
              const tipo = r.t.startsWith("T") ? "T" : "S";
              return { ticker:r.t, dias:m.diasRest, tna:m.tna, tipo, price:m.pLive };
            })).filter(Boolean);
            return <LecapYieldCurve t={t} points={curvePoints} />;
          })()}

        </div>
      )}

      {/* ── BONOS CER ── */}
      {sub === "cer" && (
        <div>
          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.6, marginBottom:16 }}>
            Bonos ajustados por inflación (CER). Precios en ARS vía DATA912. Los BONCER zero-coupon capitalizan el ajuste CER. TX26/TX28 pagan cupón real + CER.
          </p>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${t.brd}` }}>
                  {["Ticker","Descripción","Vto","Tipo","Cupón Real","Ley","Precio","Var %"].map((h,i)=>(
                    <th key={i} style={{ padding:"10px 8px", textAlign:i>4?"right":"left", fontSize:10, fontWeight:700, color:t.fa, textTransform:"uppercase", letterSpacing:".08em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BONOS_CER.map((b,i) => {
                  const liveP = bondPrices[b.t];
                  const price = liveP ? `$${liveP.price.toLocaleString("es-AR",{minimumFractionDigits:2})}` : "—";
                  const pct = liveP?.changePct;
                  const pctCol = pct > 0 ? t.gr : pct < 0 ? t.rd : t.mu;
                  const [d,m,y] = b.vto.split("/");
                  const dias = Math.floor((new Date(+y,+m-1,+d) - Date.now()) / 86400000);
                  const vencido = dias <= 0;
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${t.brd}`, opacity:vencido?0.4:1 }}>
                      <td style={{ padding:"8px", fontWeight:700, color:t.bl }}>
                        <button onClick={()=>window.__goChart?.("BYMA:"+b.t)} style={{background:"none",border:"none",color:t.bl,fontWeight:700,fontFamily:FB,fontSize:12,cursor:"pointer",padding:0}}>
                          {b.t}
                        </button>
                      </td>
                      <td style={{ padding:"8px", color:t.tx }}>{b.desc}</td>
                      <td style={{ padding:"8px", color:t.mu, fontSize:11 }}>{b.vto} <span style={{fontSize:9,color:t.fa}}>({dias}d)</span></td>
                      <td style={{ padding:"8px" }}>
                        <span style={{ fontSize:10, fontWeight:600, color:b.cupCer>0?"#22c55e":t.mu, background:b.cupCer>0?"#22c55e15":t.alt, padding:"2px 6px", borderRadius:4 }}>{b.tipo}</span>
                      </td>
                      <td style={{ padding:"8px", textAlign:"right", color:t.tx, fontWeight:600 }}>{b.cupCer > 0 ? `${b.cupCer.toFixed(2)}%` : "—"}</td>
                      <td style={{ padding:"8px", color:t.fa, fontSize:10 }}>{b.ley}</td>
                      <td style={{ padding:"8px", textAlign:"right", fontWeight:700, color:t.tx, fontFamily:"monospace" }}>{price}</td>
                      <td style={{ padding:"8px", textAlign:"right", fontWeight:600, color:pctCol }}>
                        {pct != null ? `${pct>=0?"+":""}${pct.toFixed(2)}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, lineHeight:1.6 }}>
            * BONCER zero-coupon: el rendimiento surge del descuento sobre el valor ajustado por CER al vencimiento. TX26/TX28/DICP/PARP: pagan cupón real semestral sobre capital ajustado. Fuente precios: DATA912.
          </p>
        </div>
      )}

      {/* ── SOBERANOS USD ── */}
      {sub === "soberano" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <p style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.6, flex:1 }}>
              TIR calculada por bisección numérica sobre flujos reales. CY y Paridad actualizadas con precio de mercado.
            </p>
            <div style={{
              borderRadius:8, padding:"8px 14px", fontFamily:FB, fontSize:11,
              border:`1px solid ${bondStatus==="ok"?t.grAcc+"66":t.brd}`,
              background:bondStatus==="ok"?t.grBg:t.alt,
              color:bondStatus==="ok"?t.gr:t.mu,
              display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap",
            }}>
              <span style={{width:8,height:8,borderRadius:"50%",display:"inline-block",
                background:bondStatus==="ok"?"#22c55e":"#94a3b8",
                boxShadow:bondStatus==="ok"?"0 0 6px #22c55e":"none",
                animation:bondStatus==="loading"?"blink 1s infinite":"none"}}/>
              {bondStatus==="loading" && "Actualizando bonos..."}
              {bondStatus==="ok"      && "Precios en vivo"}
              {bondStatus==="error"   && "Usando precios de cierre"}
            </div>
          </div>
          {[{label:"LEY ARGENTINA", items:SOBERANOS.filter(s=>s.ley==="ARG"), color:t.go},
            {label:"LEY NUEVA YORK", items:SOBERANOS.filter(s=>s.ley==="NY"),  color:t.bl}].map(grp => (
            <div key={grp.label} style={{ marginBottom:20 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:grp.color, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
                {grp.label} — {grp.items.length} bonos
              </div>
              <Card t={t}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                    <thead><tr>
                      {["Ticker","Vto","Precio","Var. día","TIR","Curr. Yield","Duración","Pago","Paridad","Var. 1W",""].map((h,i) => (
                        <Th2 key={h} right={i>=2&&i<=8}>{h}</Th2>
                      ))}
                    </tr></thead>
                    <tbody>
                      {grp.items.map((s,i) => {
                        const liveEntry = bondPrices[s.t] || bondPrices[s.t.replace("D","")] || null;
                        const liveRaw = liveEntry?.price ?? null;
                        const m = calcBondMetrics(s, liveRaw);
                        return (
                          <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                            <Td2>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ fontFamily:"monospace", fontSize:11, background:grp.color+"22", color:grp.color, padding:"2px 8px", borderRadius:5, fontWeight:700 }}>{s.t}</span>
                                {m.isLive && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}} title="Precio en vivo"/>}
                                {s.nuevo && <span style={{fontSize:7,fontWeight:700,color:"#fff",background:t.bl,padding:"1px 5px",borderRadius:6}}>NUEVO</span>}
                              </div>
                            </Td2>
                            <Td2 bold>{s.vto}</Td2>
                            <Td2 right bold><span style={{color:m.isLive?t.tx:t.mu}}>${m.price.toFixed(2)}</span></Td2>
                            <Td2 right>
                              <span style={{ fontWeight:600, color:m.varVsBase>0?t.gr:m.varVsBase<0?t.rd:t.mu }}>
                                {m.isLive ? `${m.varVsBase>=0?"+":""}${m.varVsBase.toFixed(2)}%` : s.var1d}
                              </span>
                            </Td2>
                            <Td2 right>
                              {m.newTIR !== null
                                ? <span style={{ fontWeight:700, color:t.rd }}>{m.newTIR.toFixed(2)}%</span>
                                : <span style={{color:t.fa}}>—</span>}
                            </Td2>
                            <Td2 right color={t.mu}>{m.newCY !== null ? `${m.newCY.toFixed(2)}%` : s.cy}</Td2>
                            <Td2 right color={t.mu}>{s.dur.toFixed(2)}</Td2>
                            <Td2 color={t.mu}>{s.pago}</Td2>
                            <Td2 right color={t.mu}>{m.newPar !== null ? `${m.newPar.toFixed(2)}%` : s.par}</Td2>
                            <Td2 right color={s.var1w.startsWith("-")?t.rd:s.var1w.startsWith("+")?t.gr:t.mu}>{s.var1w}</Td2>
                            <Td2>
                              <button onClick={()=>window.__goChart?.("BYMA:"+s.t)}
                                style={{ width:26, height:26, borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center",
                                  background:t.alt, border:`1px solid ${t.brd}`, color:t.mu, transition:"all .15s", cursor:"pointer" }}
                                onMouseEnter={e=>{e.currentTarget.style.background=grp.color+"15";e.currentTarget.style.borderColor=grp.color;e.currentTarget.style.color=grp.color;}}
                                onMouseLeave={e=>{e.currentTarget.style.background=t.alt;e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.color=t.mu;}}>
                                <LineChart size={13} />
                              </button>
                            </Td2>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ))}
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, lineHeight:1.5 }}>
            * TIR calculada por bisección sobre flujos reales. No constituye recomendación de inversión.
          </p>

          {/* ══════════════════════════════════════════════════
              CALCULADORA SOBERANOS USD
          ══════════════════════════════════════════════════ */}
          {/* Yield Curve */}
          <SovYieldCurve t={t} bondPrices={bondPrices} />

          {/* Calculadora */}
          <SoberanosCalc t={t} bondPrices={bondPrices} />

        </div>
      )}

      {/* ── CALENDARIO DE VENCIMIENTOS Y PAGOS ── */}
      {sub === "calendario" && <CalendarioPanel t={t} />}

      {/* ── PLAZOS FIJOS — ArgentinaDatos API ── */}
      {sub === "pf" && <PlazosFijosPanel t={t} />}

      {/* ── BONOS CORPORATIVOS (ONs) — DATA912 LIVE ── */}
      {sub === "corp" && <ONsPanel t={t} />}

      <WhatsAppCTA t={t} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PLAZOS FIJOS PANEL — ArgentinaDatos API (live)
   Endpoint: /v1/finanzas/tasas/plazoFijo
   TNA para colocaciones online de $100.000 a 30 días
════════════════════════════════════════════════════════════════ */
function PlazosFijosPanel({ t }) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [sortCol, setSortCol] = useState("tnaClientes");
  const [sortDir, setSortDir] = useState(-1);
  const [viewType, setViewType] = useState("clientes"); // "clientes" | "noClientes"
  const [search, setSearch] = useState("");
  const REFRESH_MS = 10 * 60 * 1000; // 10 min

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo");
        const json = await r.json();
        if (Array.isArray(json) && json.length > 0) {
          const parsed = json.map(d => ({
            entidad: d.entidad || "—",
            logo: d.logo || null,
            tnaClientes: d.tnaClientes ? +(d.tnaClientes * 100).toFixed(2) : null,
            tnaNoClientes: d.tnaNoClientes ? +(d.tnaNoClientes * 100).toFixed(2) : null,
          })).filter(d => d.tnaClientes !== null || d.tnaNoClientes !== null);
          setData(parsed);
          setStatus("ok");
          setLastUpdate(new Date());
        } else { setStatus("error"); }
      } catch { setStatus("error"); }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const sort = (col) => {
    if (sortCol === col) setSortDir(d => -d);
    else { setSortCol(col); setSortDir(-1); }
  };

  const tnaKey = viewType === "clientes" ? "tnaClientes" : "tnaNoClientes";

  const filtered = data
    .filter(d => {
      if (search.trim()) return d.entidad.toLowerCase().includes(search.toLowerCase());
      return true;
    })
    .sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (av === null) return 1;
      if (bv === null) return -1;
      return (av > bv ? 1 : -1) * sortDir;
    });

  // Stats
  const tnas = data.map(d => d[tnaKey]).filter(v => v !== null);
  const maxTNA = tnas.length ? Math.max(...tnas) : 0;
  const minTNA = tnas.length ? Math.min(...tnas) : 0;
  const avgTNA = tnas.length ? (tnas.reduce((a, b) => a + b, 0) / tnas.length) : 0;
  const bestBank = data.find(d => d[tnaKey] === maxTNA);

  // Simular ganancia para $1M a 30 días
  const sim = (tna) => tna ? Math.round(1000000 * (tna / 100) * (30 / 365)) : 0;

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 }}>
        <div>
          <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
            TNA para colocaciones online de $100.000 a 30 días.
          </p>
        </div>
        <div style={{
          borderRadius:8, padding:"7px 14px", fontFamily:FB, fontSize:11,
          border:`1px solid ${status==="ok"?t.grAcc+"66":t.brd}`,
          background:status==="ok"?t.grBg:t.alt, color:status==="ok"?t.gr:t.mu,
          display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap",
        }}>
          <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",
            background:status==="ok"?"#22c55e":status==="error"?"#ef4444":"#94a3b8",
            boxShadow:status==="ok"?"0 0 6px #22c55e":"none",
            animation:status==="loading"?"blink 1s infinite":"none"}}/>
          {status==="loading" && "Cargando tasas..."}
          {status==="ok" && `${data.length} bancos · ${lastUpdate?.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}`}
          {status==="error" && "Sin datos · Reintentar"}
        </div>
      </div>

      {/* KPI cards */}
      {status === "ok" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:20 }}>
          <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${t.gr}` }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>MEJOR TNA</div>
            <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.gr, lineHeight:1 }}>{maxTNA.toFixed(2)}%</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{bestBank?.entidad}</div>
          </div>
          <div style={{ background:t.blBg, border:`1px solid ${t.bl}22`, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${t.bl}` }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.bl, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>PROMEDIO</div>
            <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.bl, lineHeight:1 }}>{avgTNA.toFixed(2)}%</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>TNA {data.length} entidades</div>
          </div>
          <div style={{ background:t.goBg, border:`1px solid ${t.go}22`, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${t.go}` }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.go, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>GANANCIA $1M / 30D</div>
            <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.go, lineHeight:1 }}>${sim(maxTNA).toLocaleString("es-AR")}</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>Al mejor TNA · bruto</div>
          </div>
          <div style={{ background:t.alt, border:`1px solid ${t.brd}`, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${t.mu}` }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>MENOR TNA</div>
            <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.rd, lineHeight:1 }}>{minTNA.toFixed(2)}%</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>Spread: {(maxTNA-minTNA).toFixed(2)} p.p.</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar banco..."
            style={{
              fontFamily:FB, fontSize:12, padding:"7px 10px 7px 30px", borderRadius:10,
              border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, width:180, outline:"none",
            }}
            onFocus={e=>e.target.style.borderColor=t.go}
            onBlur={e=>e.target.style.borderColor=t.brd}
          />
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[{id:"clientes",label:"Clientes"},{id:"noClientes",label:"No Clientes"}].map(v=>(
            <button key={v.id} onClick={()=>{setViewType(v.id);setSortCol(v.id==="clientes"?"tnaClientes":"tnaNoClientes");}} style={{
              padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, cursor:"pointer",
              border:`1.5px solid ${viewType===v.id?t.go:t.brd}`,
              background:viewType===v.id?t.go+"18":"transparent",
              color:viewType===v.id?t.go:t.mu, fontWeight:viewType===v.id?700:400,
            }}>{v.label}</button>
          ))}
        </div>
        <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:10, color:t.fa }}>
          {filtered.length} de {data.length} entidades
        </span>
      </div>

      {/* Table */}
      <Card t={t}>
        <div style={{ overflowX:"auto", maxHeight:"65vh", overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
            <thead>
              <tr>
                <th style={{ padding:"9px 12px", textAlign:"center", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, width:40 }}>#</th>
                <th style={{ padding:"9px 12px", textAlign:"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5 }}>ENTIDAD</th>
                <th onClick={()=>sort("tnaClientes")} style={{ padding:"9px 12px", textAlign:"right", fontSize:9, fontWeight:700, color:sortCol==="tnaClientes"?t.go:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, cursor:"pointer", whiteSpace:"nowrap" }}>
                  TNA CLIENTES{sortCol==="tnaClientes"?(sortDir===1?" ↑":" ↓"):""}
                </th>
                <th onClick={()=>sort("tnaNoClientes")} style={{ padding:"9px 12px", textAlign:"right", fontSize:9, fontWeight:700, color:sortCol==="tnaNoClientes"?t.go:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, cursor:"pointer", whiteSpace:"nowrap" }}>
                  TNA NO CLIENTES{sortCol==="tnaNoClientes"?(sortDir===1?" ↑":" ↓"):""}
                </th>
                <th style={{ padding:"9px 12px", textAlign:"right", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5, whiteSpace:"nowrap" }}>
                  GANANCIA $1M/30D
                </th>
                <th style={{ padding:"9px 12px", textAlign:"right", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".07em", borderBottom:`2px solid ${t.brd}`, background:t.alt, position:"sticky", top:0, zIndex:5 }}>
                  VS MEJOR
                </th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:t.mu }}>
                  <RefreshCw size={20} style={{ animation:"blink 1s infinite", marginBottom:8 }} /><br/>Cargando tasas de plazo fijo...
                </td></tr>
              )}
              {status === "error" && (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:t.rd }}>
                  <AlertTriangle size={20} style={{ marginBottom:8 }} /><br/>No se pudieron cargar los datos. Intentá de nuevo más tarde.
                </td></tr>
              )}
              {filtered.map((d, i) => {
                const tna = d[tnaKey];
                const isBest = tna === maxTNA;
                const diffVsBest = tna !== null ? (tna - maxTNA).toFixed(2) : null;
                const barWidth = tna !== null && maxTNA > 0 ? (tna / maxTNA * 100) : 0;
                return (
                  <tr key={i} style={{ borderBottom:`1px solid ${t.brd}44`, transition:"background .1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=t.alt}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"8px 12px", textAlign:"center", fontSize:10, color:t.fa }}>{i+1}</td>
                    <td style={{ padding:"8px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {d.logo && <img src={d.logo} alt="" style={{ width:20, height:20, borderRadius:4, objectFit:"contain" }} onError={e=>e.target.style.display="none"} />}
                        <span style={{ fontSize:12, fontWeight:isBest?700:500, color:isBest?t.gr:t.tx }}>{d.entidad}</span>
                        {isBest && <span style={{ fontSize:8, fontWeight:700, color:"#fff", background:t.gr, padding:"1px 6px", borderRadius:8 }}>TOP</span>}
                      </div>
                    </td>
                    <td style={{ padding:"8px 12px", textAlign:"right" }}>
                      {d.tnaClientes !== null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
                          <div style={{ width:50, height:4, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                            <div style={{ width:`${d.tnaClientes/maxTNA*100}%`, height:"100%", borderRadius:3,
                              background:d.tnaClientes>=avgTNA?t.grAcc:t.rdAcc }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:d.tnaClientes>=avgTNA?t.gr:t.mu }}>{d.tnaClientes.toFixed(2)}%</span>
                        </div>
                      ) : <span style={{ color:t.fa }}>—</span>}
                    </td>
                    <td style={{ padding:"8px 12px", textAlign:"right" }}>
                      {d.tnaNoClientes !== null
                        ? <span style={{ fontSize:12, fontWeight:600, color:t.mu }}>{d.tnaNoClientes.toFixed(2)}%</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>
                    <td style={{ padding:"8px 12px", textAlign:"right", fontFamily:FB }}>
                      {tna !== null
                        ? <span style={{ fontSize:12, fontWeight:600, color:t.go }}>${sim(tna).toLocaleString("es-AR")}</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>
                    <td style={{ padding:"8px 12px", textAlign:"right" }}>
                      {diffVsBest !== null && diffVsBest !== "0.00"
                        ? <span style={{ fontSize:11, fontWeight:600, color:t.rd }}>{diffVsBest} p.p.</span>
                        : diffVsBest === "0.00" ? <span style={{ fontSize:11, fontWeight:700, color:t.gr }}>MEJOR</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"8px 14px", borderTop:`1px solid ${t.brd}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            Fuente: BCRA · Colocaciones online $100K a 30 días
          </span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            Refresh cada 10 min · No constituye asesoramiento
          </span>
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MERCADOS VIEW — LIVE QUOTES (dolarapi.com + argentinadatos.com)
════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   BCRA PANEL — Live data from BCRA API v4 via Vercel proxy
   Variables: Reservas, TAMAR, BADLAR, TC, Compras del día
════════════════════════════════════════════════════════════════ */
function BCRAPanel({ t }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch the full list of principales variables — each has ultValorInformado
        const r = await fetch("/api/bcra?list=1");
        const json = await r.json();
        const vars = json.results || [];
        
        if (!vars.length) { setStatus("error"); return; }

        // Search by description keywords (more robust than hardcoding IDs)
        const find = (keywords) => {
          const lower = keywords.map(k => k.toLowerCase());
          return vars.find(v => {
            const desc = (v.descripcion || "").toLowerCase();
            return lower.every(k => desc.includes(k));
          });
        };

        const reservas  = find(["reservas","internacionales"]);
        const tamar     = find(["tamar","privados"]) || find(["tamar"]);
        const badlar    = find(["badlar","privados"]) || find(["badlar"]);
        const tcMin     = find(["tipo","cambio","minorista"]);

        // For compras: diff between last 2 reserve values
        let comprasVal = null;
        if (reservas) {
          try {
            const hoy = new Date().toISOString().split("T")[0];
            const hace7 = new Date(Date.now()-7*86400000).toISOString().split("T")[0];
            const rHist = await fetch(`/api/bcra?id=${reservas.idVariable}&desde=${hace7}&hasta=${hoy}`);
            const hJson = await rHist.json();
            const det = hJson.results?.[0]?.detalle;
            if (det && det.length >= 2) {
              // detalle is sorted desc by date
              comprasVal = det[0].valor - det[1].valor;
            }
          } catch {}
        }

        setData({
          reservas:  reservas  ? { val:reservas.ultValorInformado, fecha:reservas.ultFechaInformada } : null,
          tamar:     tamar     ? { val:tamar.ultValorInformado, fecha:tamar.ultFechaInformada } : null,
          badlar:    badlar    ? { val:badlar.ultValorInformado, fecha:badlar.ultFechaInformada } : null,
          tcMin:     tcMin     ? { val:tcMin.ultValorInformado, fecha:tcMin.ultFechaInformada } : null,
          compras:   comprasVal,
        });
        setUpdatedAt(Date.now());
        setStatus("ok");
      } catch (e) {
        console.error("BCRA:", e);
        setStatus("error");
      }
    };
    load();
  }, []);

  const fmtDate = (d) => {
    if (!d) return "";
    const [y,m,dd] = d.split("-");
    return `${dd}/${m}/${y}`;
  };

  const items = data ? [
    data.tamar   && { label:"TAMAR",           val:`${data.tamar.val.toFixed(2)}%`,                       nota:`TNA · Bcos. Privados · ${fmtDate(data.tamar.fecha)}`, color:t.bl, bg:t.blBg },
    data.badlar  && { label:"BADLAR",          val:`${data.badlar.val.toFixed(2)}%`,                      nota:`TNA · Bcos. Privados · ${fmtDate(data.badlar.fecha)}`, color:t.pu, bg:t.puBg },
    data.compras!=null && { label:"COMPRAS BCRA",     val:`USD ${data.compras>=0?"+":""}${data.compras}M`, nota:"Variación diaria de reservas",  color:data.compras>=0?t.gr:t.rd, bg:data.compras>=0?t.grBg:t.rdBg },
    data.reservas && { label:"RESERVAS BRUTAS", val:`USD ${data.reservas.val.toLocaleString("es-AR")}M`,  nota:`${fmtDate(data.reservas.fecha)} · Cifras provisorias`, color:t.go, bg:t.goBg },
    data.tcMin   && { label:"TC MINORISTA",    val:`$${data.tcMin.val.toLocaleString("es-AR",{minimumFractionDigits:2})}`, nota:`Pesos por USD · ${fmtDate(data.tcMin.fecha)}`, color:t.mu, bg:t.alt },
  ].filter(Boolean) : [];

  return (
    <Card t={t} style={{ marginTop:4 }}>
      <div style={{ padding:"20px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <SectionLabel t={t}>BANCO CENTRAL · DATOS DEL DÍA</SectionLabel>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",
              background:status==="ok"?"#22c55e":status==="error"?"#ef4444":"#94a3b8",
              boxShadow:status==="ok"?"0 0 5px #22c55e":"none"}} />
            <LiveTimestamp ts={updatedAt} t={t} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:14 }}>
          {status==="loading" && Array.from({length:5}).map((_,i) => (
            <div key={i} style={{ background:t.alt, borderRadius:10, padding:"12px 14px" }}>
              <Skeleton w={60} h={10} style={{marginBottom:8}} />
              <Skeleton w={90} h={22} style={{marginBottom:6}} />
              <Skeleton w={110} h={10} />
            </div>
          ))}
          {status==="ok" && items.map((item,i) => (
            <div key={i} style={{ background:item.bg, border:`1px solid ${item.color}22`, borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${item.color}` }}>
              <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:item.color, marginBottom:5 }}>{item.label}</div>
              <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.tx, lineHeight:1 }}>{item.val}</div>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4, lineHeight:1.4 }}>{item.nota}</div>
            </div>
          ))}
          {status==="error" && (
            <div style={{ gridColumn:"1 / -1", textAlign:"center", padding:20 }}>
              <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:8 }}>⚠️ No se pudo conectar con la API del BCRA</div>
              <button onClick={()=>window.location.reload()} style={{ fontFamily:FB, fontSize:11, color:t.bl, background:"transparent", border:`1px solid ${t.brd}`, borderRadius:8, padding:"6px 16px", cursor:"pointer" }}>Reintentar</button>
            </div>
          )}
        </div>
        <div style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
          Fuente: Banco Central de la República Argentina · API v4.0
        </div>
      </div>
    </Card>
  );
}

function MercadosView({ dolar, riesgoPais, fxError, liveMarket={}, t }) {
  const cMap = {
    blue:{bg:t.blBg,ac:t.bl}, gold:{bg:t.goBg,ac:t.go}, green:{bg:t.grBg,ac:t.gr},
    red:{bg:t.rdBg,ac:t.rd}, purple:{bg:t.puBg,ac:t.pu}, gray:{bg:t.alt,ac:t.mu},
  };

  // Use liveMarket from App (already fetched globally)
  const gold     = liveMarket.gold;
  const brent    = liveMarket.brent;
  const mervalARS= liveMarket.mervalARS;


  // ── LECAP mayor TNA ≤ 6 meses ─────────────────────────────
  const bestLECAP = (() => {
    const today = Date.now();
    const maxDays = 180;
    const candidates = LECAP.flatMap(g => {
      const [d,m,y] = g.vto.split("/").map(Number);
      const dias = Math.floor((new Date(y,m-1,d) - today) / 86400000);
      if (dias > maxDays || dias <= 0) return [];
      return g.rows.map(r => ({
        ticker: r.t,
        mes: g.vto,
        tna: parseFloat(r.tna.replace(",",".")),
        tnaStr: r.tna,
        tem: r.r,
        dias,
      }));
    });
    if (!candidates.length) return null;
    return candidates.reduce((best, cur) => cur.tna > best.tna ? cur : best, candidates[0]);
  })();

  const fmt = (v) => v ? `$${Math.round(v).toLocaleString("es-AR")}` : "—";
  const pct = (num, den) => {
    if (!num || !den) return null;
    return (((num / den) - 1) * 100).toFixed(1);
  };

  const of  = dolar?.oficial?.venta;
  const bl  = dolar?.blue?.venta;
  const mep = dolar?.bolsa?.venta;
  const ccl = dolar?.contadoconliqui?.venta;
  const may = dolar?.mayorista?.venta;

  const bBlue = pct(bl, of);
  const bMEP  = pct(mep, of);
  const bCCL  = pct(ccl, of);
  const bCCLmep = pct(ccl, mep);

  const FxCard = ({ label, value, compra, sub, color, badge, loading }) => {
    const col = cMap[color] || cMap.gray;
    return (
      <div style={{
        background:col.bg, border:`1px solid ${col.ac}22`,
        borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`,
        transition:"transform .18s, box-shadow .18s",
        display:"flex", flexDirection:"column", gap:4,
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=t.sh;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="";}}>
        <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:col.ac, lineHeight:1 }}>
            {loading
              ? <span style={{ fontSize:20, color:t.fa, animation:"blink 1s infinite" }}>cargando…</span>
              : fxError ? <span style={{ fontSize:16, color:t.rd }}>sin datos</span>
              : value}
          </span>
          {!loading && !fxError && badge !== null && badge !== undefined && (
            <span style={{
              fontFamily:FB, fontSize:11, fontWeight:700,
              color: parseFloat(badge) > 0 ? t.rd : t.gr,
              background: parseFloat(badge) > 0 ? t.rdBg : t.grBg,
              padding:"2px 8px", borderRadius:20,
            }}>
              {parseFloat(badge) > 0 ? "+" : ""}{badge}%
            </span>
          )}
        </div>
        {compra && !fxError && <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Compra: {compra}</div>}
        <div style={{ fontFamily:FB, fontSize:11, color:t.fa, marginTop:2 }}>{sub}</div>
      </div>
    );
  };

  // Chip genérico para el panel de indicadores
  const LivePanel = ({ label, value, sub, changePct, color, badge, dot }) => {
    const col = cMap[color] || cMap.gray;
    return (
      <div style={{
        background:col.bg, border:`1px solid ${col.ac}22`,
        borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`,
        position:"relative",
      }}>
        {badge && (
          <div style={{ position:"absolute", top:10, right:12,
            fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em",
            color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:10,
            textTransform:"uppercase" }}>{badge}</div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
          <span style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</span>
          {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e", display:"inline-block" }}/>}
        </div>
        <div style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:col.ac, lineHeight:1 }}>
          {value || <span style={{ fontSize:16, color:t.fa, animation:"blink 1s infinite" }}>—</span>}
        </div>
        {changePct !== null && changePct !== undefined && (
          <div style={{ fontFamily:FB, fontSize:11, fontWeight:600,
            color: changePct >= 0 ? t.gr : t.rd, marginTop:4 }}>
            {changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}% hoy
          </div>
        )}
        <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>{sub}</div>
      </div>
    );
  };

  const loading = !dolar && !fxError;

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>MERCADO DE CAMBIOS — TIEMPO REAL</SectionLabel>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {fxError ? (
            <span style={{ fontFamily:FB, fontSize:11, color:t.rd, background:t.rdBg, padding:"3px 10px", borderRadius:8 }}>
              ⚠️ Sin conexión — recargá la página
            </span>
          ) : (
            <span style={{ fontFamily:FB, fontSize:11, color:dolar?t.gr:t.fa, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:7, height:7, borderRadius:"50%",
                background:dolar?t.gr:t.fa,
                boxShadow:dolar?"0 0 5px "+t.gr:"none",
                animation:(!dolar&&!fxError)?"blink 1s infinite":"none" }} />
              {dolar?"Datos en vivo":"Conectando..."}
            </span>
          )}
        </div>
      </div>

      {/* ── PANEL INDICADORES CLAVE — 5 chips en tiempo real ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:24 }}>

        {/* Riesgo País — JP Morgan EMBI · ArgentinaDatos */}
        <LivePanel
          label="Riesgo País"
          value={riesgoPais ? `${riesgoPais.valor} pb` : null}
          sub="EMBI · JP Morgan"
          changePct={null}
          color="red"
          dot={!!riesgoPais}
        />

        {/* Merval — pesos, ArgentinaDatos */}
        <LivePanel
          label="Merval (BYMA)"
          value={mervalARS ? `$${mervalARS.value.toLocaleString("es-AR", {maximumFractionDigits:0})}` : null}
          sub="Índice en pesos · live"
          changePct={mervalARS?.changePct ?? null}
          color="green"
          dot={!!mervalARS}
        />

        {/* Oro — GLD ETF proxy */}
        <LivePanel
          label="Oro (GLD)"
          value={gold ? `USD ${gold.price.toFixed(2)}` : null}
          sub="Proxy ETF GLD · Tiempo real"
          changePct={gold?.changePct ?? null}
          color="gold"
          dot={!!gold}
        />

        {/* Petróleo — BNO ETF proxy Brent */}
        <LivePanel
          label="Petróleo (BNO)"
          value={brent ? `USD ${brent.price.toFixed(2)}` : null}
          sub="Proxy ETF BNO · Tiempo real"
          changePct={brent?.changePct ?? null}
          color="gold"
          dot={!!brent}
        />

        {/* LECAP mayor TNA ≤ 6 meses — dinámico */}
        {bestLECAP && (
          <div style={{
            background:t.blBg, border:`1px solid ${t.bl}22`,
            borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${t.bl}`,
            position:"relative",
          }}>
            <div style={{ position:"absolute", top:10, right:12,
              fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em",
              color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:10,
              textTransform:"uppercase" }}>MAYOR TNA</div>
            <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>
              LECAP / BONCAP
            </div>
            <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:t.bl, lineHeight:1 }}>
              {bestLECAP.tnaStr} TNA
            </div>
            <div style={{ fontFamily:"monospace", fontSize:11, color:t.tx, marginTop:6, background:t.alt, display:"inline-block", padding:"2px 8px", borderRadius:5 }}>
              {bestLECAP.ticker}
            </div>
            <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:6 }}>
              {bestLECAP.tem} acum. · Vto. {bestLECAP.mes} · {bestLECAP.dias}d
            </div>
          </div>
        )}
      </div>

      {/* ── FOREX GRID ── */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
          TIPOS DE CAMBIO (venta)
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:24 }}>
          <FxCard label="Dólar Oficial (BNA)" value={fmt(of)} compra={fmt(dolar?.oficial?.compra)} sub="Tipo de cambio oficial" color="blue" loading={loading} />
          <FxCard label="Dólar Mayorista" value={fmt(may)} sub="Mercado de mayoristas" color="blue" loading={loading} />
          <FxCard label="Dólar Blue" value={fmt(bl)} compra={fmt(dolar?.blue?.compra)} sub="Mercado informal" color="gold" loading={loading} />
          <FxCard label="Dólar MEP (bolsa)" value={fmt(mep)} sub="Bonos en pesos → USD" color="purple" loading={loading} />
          <FxCard label="Dólar CCL" value={fmt(ccl)} sub="Contado con liquidación" color="purple" loading={loading} />
        </div>
      </div>

      {/* ── BRECHAS ── */}
      <Card t={t} style={{ marginBottom:20 }}>
        <div style={{ padding:"18px 22px" }}>
          <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>
            BRECHAS CAMBIARIAS (vs. Oficial)
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {[
              { label:"Blue / Oficial", val:bBlue, desc:"Mercado informal vs. BNA" },
              { label:"MEP / Oficial",  val:bMEP,  desc:"Dólar bolsa vs. BNA" },
              { label:"CCL / Oficial",  val:bCCL,  desc:"Contado con liqui vs. BNA" },
              { label:"CCL / MEP",      val:bCCLmep, desc:"Spread financiero interno" },
            ].map((br, i) => {
              const v = br.val ? parseFloat(br.val) : null;
              const isHigh = v !== null && v > 5;
              const color = v === null ? t.mu : isHigh ? t.rd : t.gr;
              const bg    = v === null ? t.alt : isHigh ? t.rdBg : t.grBg;
              return (
                <div key={i} style={{ background:bg, borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{br.label}</div>
                  <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color, lineHeight:1 }}>
                    {v !== null ? `+${br.val}%` : "—"}
                  </div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>{br.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── PANEL BCRA — LIVE ── */}
      <BCRAPanel t={t} />

      <p style={{ fontFamily:FB, fontSize:11, color:t.fa, marginTop:16, lineHeight:1.6 }}>
        Datos en tiempo real · Múltiples fuentes
      </p>

      {/* ── NOTICIAS — fusionadas en Mercados ── */}
      <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${t.brd}` }}>
        <NoticiasView t={t} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NOTICIAS VIEW — Buscador + Categorías por tipo
════════════════════════════════════════════════════════════════ */
const SECCIONES = [
  { id:"todas",          label:"Todas",           Icon:Newspaper,    color:null },
  { id:"Macro",          label:"Macro",           Icon:Activity,     color:"red" },
  { id:"Internacional",  label:"Internacional",   Icon:Globe,        color:"blue" },
  { id:"Empresas",       label:"Empresas",        Icon:Building2,    color:"green" },
  { id:"Energía",        label:"Energía",         Icon:Flame,        color:"gold" },
  { id:"Judicial",       label:"Judicial",        Icon:Gavel,        color:"purple" },
];

function NoticiasView({ t }) {
  const [tab2, setTab2]           = useState("live"); // "live" | "analisis"
  const [search, setSearch]       = useState("");
  const [expandida, setExpandida] = useState(null);
  const [seccion, setSeccion]     = useState("todas");

  // ── Google News RSS via Vercel Function propia (/api/news) ──
  const [liveNews,    setLiveNews]    = useState([]);
  const [liveStatus,  setLiveStatus]  = useState("loading");
  const [liveUpdated, setLiveUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const parseRSS = (xmlText) => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        return Array.from(xml.querySelectorAll("item")).map(item => {
          const link  = item.querySelector("link")?.textContent?.trim() || "";
          const title = item.querySelector("title")?.textContent?.trim() || "";
          const pub   = item.querySelector("pubDate")?.textContent?.trim() || "";
          const src   = item.querySelector("source")?.textContent?.trim() || "";
          const d     = new Date(pub);
          return { link, title, src, fechaObj: d,
            fechaStr: isNaN(d) ? "" : d.toLocaleString("es-AR", {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) };
        }).filter(i => i.link && i.title);
      } catch { return []; }
    };

    const fetchNews = async () => {
      const queries = [
        "Argentina+finanzas",
        "dolar+hoy+Argentina",
        "bonos+mercado+argentino",
        "economia+Argentina+2026",
      ];
      const seen = new Set();
      const results = [];

      for (const q of queries) {
        try {
          const r = await fetch(`/api/news?q=${encodeURIComponent(q)}`);
          if (!r.ok) continue;
          const txt = await r.text();
          if (!txt || txt.length < 50) continue;
          for (const item of parseRSS(txt)) {
            const key = item.title.slice(0, 60);
            if (seen.has(key)) continue;
            seen.add(key);
            const host = (() => { try { return new URL(item.link).hostname.replace("www.","").replace(".com.ar","").replace(".com",""); } catch { return item.src || ""; } })();
            results.push({ id: item.link, titulo: item.title, fuente: item.src || host, link: item.link, fechaObj: item.fechaObj, fecha: item.fechaStr });
          }
        } catch {}
      }

      results.sort((a,b) => b.fechaObj - a.fechaObj);

      if (!cancelled) {
        if (results.length > 0) {
          setLiveNews(results.slice(0, 24));
          setLiveStatus("ok");
          setLiveUpdated(new Date());
        } else {
          setLiveStatus("error");
        }
      }
    };

    fetchNews();
    const id = setInterval(fetchNews, 3 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const catColors = { blue:t.bl, green:t.gr, red:t.rd, purple:t.pu, gold:t.go, gray:t.mu };
  const catBgs    = { blue:t.blBg, green:t.grBg, red:t.rdBg, purple:t.puBg, gold:t.goBg, gray:t.alt };

  const filtradas = NOTICIAS.filter(n => {
    if (seccion !== "todas" && n.seccion !== seccion) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return n.titulo.toLowerCase().includes(q)
          || n.cat.toLowerCase().includes(q)
          || n.cuerpo.replace(/<[^>]+>/g,"").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fade-up">

      {/* ── TABS: En vivo / Análisis ── */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:t.alt, padding:4, borderRadius:12, width:"fit-content" }}>
        {[
          { id:"live",     label:"En vivo",         icon:"🔴" },
          { id:"analisis", label:"Seleccionadas", icon:"📌" },
        ].map(tb => (
          <button key={tb.id} onClick={()=>setTab2(tb.id)} style={{
            padding:"8px 20px", borderRadius:9, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s", border:"none",
            background: tab2===tb.id ? t.srf : "transparent",
            color: tab2===tb.id ? t.tx : t.mu,
            boxShadow: tab2===tb.id ? t.sh : "none",
          }}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ TAB: EN VIVO ═══════════════ */}
      {tab2 === "live" && (
        <div>
          {/* Status bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <p style={{ fontFamily:FB, fontSize:12, color:t.mu }}>
              Noticias financieras en tiempo real · Google News
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontFamily:FB, fontSize:10,
              color: liveStatus==="ok" ? t.gr : t.mu }}>
              <span style={{
                width:6, height:6, borderRadius:"50%", display:"inline-block",
                background: liveStatus==="ok" ? "#22c55e" : liveStatus==="error" ? t.rd : "#94a3b8",
                boxShadow: liveStatus==="ok" ? "0 0 5px #22c55e" : "none",
                animation: liveStatus==="loading" ? "blink 1s infinite" : "none",
              }}/>
              {liveStatus==="loading" && "Cargando..."}
              {liveStatus==="ok" && `${liveNews.length} notas · ${liveUpdated?.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})} · actualiza c/2min`}
              {liveStatus==="empty" && "Sin resultados · reintentando..."}
              {liveStatus==="error" && "Sin conexión · Google News"}
            </div>
          </div>

          {/* Skeleton loading */}
          {liveStatus === "loading" && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[...Array(5)].map((_,i) => (
                <div key={i} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:10,
                  height:64, animation:"blink 1.2s infinite", opacity: 1 - i*0.15 }} />
              ))}
            </div>
          )}

          {/* Error */}
          {liveStatus === "error" && (
            <div style={{ background:t.rdBg, border:`1px solid ${t.rd}22`, borderRadius:10,
              padding:"20px 24px", fontFamily:FB, fontSize:13, color:t.rd, textAlign:"center" }}>
              No se pudo conectar con Google News. Verificá tu conexión e intentá de nuevo.
            </div>
          )}

          {/* News list */}
          {liveStatus === "ok" && (
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {liveNews.map((n, i) => (
                <a key={n.id} href={n.link} target="_blank" rel="noreferrer"
                  style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"12px 16px", borderRadius:10,
                    background: i === 0 ? t.goBg : "transparent",
                    border:`1px solid ${i === 0 ? t.go+"44" : "transparent"}`,
                    transition:"all .15s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=t.alt;e.currentTarget.style.borderColor=t.brd;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=i===0?t.goBg:"transparent";e.currentTarget.style.borderColor=i===0?t.go+"44":"transparent";}}>

                    {/* Index */}
                    <span style={{ fontFamily:FB, fontSize:11, fontWeight:700,
                      color: i < 3 ? t.go : t.fa, width:20, flexShrink:0, textAlign:"right" }}>
                      {i+1}
                    </span>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:FB, fontSize:13, fontWeight: i < 5 ? 600 : 400,
                        color:t.tx, lineHeight:1.4, margin:0,
                        overflow:"hidden", textOverflow:"ellipsis",
                        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                        {n.titulo}
                      </p>
                    </div>

                    {/* Meta */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                      <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.go,
                        maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {n.fuente}
                      </span>
                      <span style={{ fontFamily:FB, fontSize:9, color:t.fa, whiteSpace:"nowrap" }}>
                        {n.fecha}
                      </span>
                    </div>

                    <ExternalLink size={12} color={t.fa} style={{ flexShrink:0 }} />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ TAB: ANÁLISIS ═══════════════ */}
      {tab2 === "analisis" && (
        <div>
          {/* Search */}
          <div style={{ position:"relative", marginBottom:14 }}>
            <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar: YPF, inflación, Fed, petróleo…"
              style={{ width:"100%", padding:"10px 12px 10px 36px", borderRadius:10,
                fontFamily:FB, fontSize:12, border:`1.5px solid ${t.brd}`,
                background:t.srf, color:t.tx, outline:"none" }}
              onFocus={e=>e.target.style.borderColor=t.go}
              onBlur={e=>e.target.style.borderColor=t.brd}
            />
            {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:t.mu }}><X size={14}/></button>}
          </div>

          {/* Section pills */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
            {SECCIONES.map(s => {
              const isActive = seccion === s.id;
              const pillColor = s.color ? catColors[s.color] : t.mu;
              return (
                <button key={s.id} onClick={()=>setSeccion(s.id)} style={{
                  padding:"5px 14px", borderRadius:20, fontFamily:FB, fontSize:11, fontWeight:600,
                  cursor:"pointer", transition:"all .18s",
                  border:`1.5px solid ${isActive ? pillColor : t.brd}`,
                  background: isActive ? pillColor+"18" : "transparent",
                  color: isActive ? pillColor : t.mu,
                  display:"flex", alignItems:"center", gap:4,
                }}>
                  <s.Icon size={11} /> {s.label}
                  <span style={{ fontSize:9, opacity:.7, background:t.alt, padding:"1px 5px", borderRadius:8 }}>
                    {s.id==="todas" ? NOTICIAS.length : NOTICIAS.filter(n=>n.seccion===s.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Alta relevancia badge */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:t.rd,
              background:t.rdBg, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
              <CircleDot size={9}/> {NOTICIAS.filter(n=>n.relevancia==="alta").length} de alta relevancia
            </span>
            <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
              {filtradas.length} nota{filtradas.length!==1?"s":""}
            </span>
          </div>

          {/* Articles */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {filtradas.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 20px", color:t.mu, fontFamily:FB, fontSize:13 }}>
                Sin resultados para "{search}"
              </div>
            )}
            {filtradas.map(n => {
              const ac  = catColors[n.catColor] || t.mu;
              const bg  = catBgs[n.catColor] || t.alt;
              const open = expandida === n.id;
              return (
                <div key={n.id} style={{
                  background:t.srf, borderRadius:12, border:`1px solid ${t.brd}`,
                  borderLeft:`3px solid ${ac}`, overflow:"hidden",
                  boxShadow: open ? t.sh : "none",
                }}>
                  <button onClick={()=>setExpandida(open ? null : n.id)} style={{
                    width:"100%", textAlign:"left", background:"none", border:"none",
                    padding:"14px 18px", cursor:"pointer",
                    display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12,
                  }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, flexWrap:"wrap" }}>
                        <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase",
                          letterSpacing:".08em", color:ac, background:bg, padding:"2px 8px", borderRadius:20 }}>{n.cat}</span>
                        {n.relevancia==="alta" && (
                          <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:t.rd, background:t.rdBg,
                            padding:"2px 7px", borderRadius:20, display:"flex", alignItems:"center", gap:2 }}>
                            <AlertTriangle size={8}/> ALTA
                          </span>
                        )}
                        <span style={{ fontFamily:FB, fontSize:9, color:t.fa }}>{n.fecha}</span>
                      </div>
                      <h3 style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx, lineHeight:1.3, margin:0 }}>
                        {n.titulo}
                      </h3>
                      {!open && <p style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.6, marginTop:5 }}
                        dangerouslySetInnerHTML={{ __html: n.cuerpo.replace(/<[^>]+>/g,"").slice(0,120)+"…" }} />}
                    </div>
                    <div style={{ color:t.mu, flexShrink:0, transform:open?"rotate(180deg)":"none", transition:"transform .2s", marginTop:2 }}>
                      <ChevronDown size={16}/>
                    </div>
                  </button>
                  {open && (
                    <div style={{ padding:"0 18px 18px", borderTop:`1px solid ${t.brd}`, paddingTop:14 }}>
                      <div style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.8 }}
                        dangerouslySetInnerHTML={{ __html: n.cuerpo }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:16 }}>
            Contenido editorial informativo. No constituye asesoramiento de inversión.
          </p>
        </div>
      )}

    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FCIs PANEL — 24 Fondos Comunes de Inversión
════════════════════════════════════════════════════════════════ */
const WhatsAppCTA = ({ t }) => (
  <a href="https://wa.me/541140500087?text=Hola%20Máximo%2C%20quiero%20más%20información" target="_blank" rel="noreferrer"
    style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none",
      background:"linear-gradient(135deg,#075e54,#128c7e)", borderRadius:12,
      padding:"14px 18px", marginTop:20, transition:"opacity .15s",
    }}
    onMouseEnter={e=>e.currentTarget.style.opacity=".92"}
    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
    <MessageCircle size={18} color="#fff" />
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:"#fff" }}>¿Consultas? Escribime por WhatsApp</div>
      <div style={{ fontFamily:FB, fontSize:10, color:"rgba(255,255,255,.6)" }}>Máximo Ricciardi · Asesor Financiero</div>
    </div>
    <ExternalLink size={14} color="rgba(255,255,255,.4)" />
  </a>
);

/* ════════════════════════════════════════════════════════════════
   CUENTAS Y BILLETERAS — Top FCIs MM + Billeteras garantizadas
   Live from CAFCI via ArgentinaDatos · Solo ARS · Top 20
════════════════════════════════════════════════════════════════ */
const BILLETERAS_GARANTIZADAS = [
  { nombre:"Carrefour Banco", tna:27.0, tipo:"Billetera", limite:"$4M", desde:"21/03/2026" },
  { nombre:"Fiwind", tna:23.0, tipo:"Billetera", limite:"$750K", desde:"19/03/2026" },
  { nombre:"Ualá", tna:23.0, tipo:"Billetera", limite:"$1M", desde:"12/02/2026" },
  { nombre:"Naranja X", tna:21.0, tipo:"Billetera", limite:"$1M", desde:"19/03/2026" },
];

// Blacklist USD/foreign funds by keyword
const USD_KEYWORDS = ["dolar","dollar","usd","latam","global","infraestructura"];
const isUSD = (name) => { const l = name.toLowerCase(); return USD_KEYWORDS.some(k => l.includes(k)); };

function CuentasPanel({ t }) {
  const [entries, setEntries] = useState([]);
  const [pfTNA, setPfTNA] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [status, setStatus] = useState("loading");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [rU, rP, rPF] = await Promise.all([
          fetch("https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo").then(r=>r.json()).catch(()=>[]),
          fetch("https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/penultimo").then(r=>r.json()).catch(()=>[]),
          fetch("https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo").then(r=>r.json()).catch(()=>[]),
        ]);
        const mapU = {}, mapMeta = {};
        if (Array.isArray(rU)) rU.forEach(f => { if (f.fondo && f.vcp > 0) { mapU[f.fondo] = f.vcp; mapMeta[f.fondo] = { patrimonio:f.patrimonio, fecha:f.fecha }; } });
        const mapP = {};
        if (Array.isArray(rP)) rP.forEach(f => { if (f.fondo && f.vcp > 0) mapP[f.fondo] = f.vcp; });

        const fciEntries = [];
        const ENTITY_COLORS = {
          "mercado":"#00BCFF","balanz":"#C4956A","pellegrini":"#1A5276","galicia":"#F97316",
          "supervielle":"#EF4444","icbc":"#22C55E","adcap":"#8B5CF6","ieb":"#3B82F6",
          "uala":"#7B2EFF","fiwind":"#F59E0B","cocos":"#FF6B35","lemon":"#4CD964",
          "sbs":"#E91E63","allaria":"#6366F1","provincia":"#14B8A6","bind":"#A855F7",
          "taca":"#FF4081","toronto":"#0EA5E9","delta":"#D97706","st zero":"#8B5CF6",
        };
        const guessEntity = (name) => {
          const low = name.toLowerCase();
          for (const [key,col] of Object.entries(ENTITY_COLORS)) { if (low.includes(key)) return { entity:key, color:col }; }
          return { entity:"otro", color:"#94A3B8" };
        };

        Object.keys(mapU).forEach(fondo => {
          if (isUSD(fondo)) return;
          // Filter out "Super Ahorro Plus" — different product category
          const low = fondo.toLowerCase();
          if (low.includes("super ahorro") || low.includes("súper ahorro")) return;

          const u = mapU[fondo], p = mapP[fondo];
          if (!u || !p || p <= 0) return;
          const tna = ((u / p - 1) * 365 * 100);
          if (tna <= 5 || tna > 60) return;
          const meta = mapMeta[fondo] || {};
          const patStr = meta.patrimonio ? (meta.patrimonio >= 1e9 ? `${(meta.patrimonio/1e9).toFixed(1)}B` : `${Math.round(meta.patrimonio/1e6)}M`) : null;
          const { entity, color } = guessEntity(fondo);
          fciEntries.push({ nombre:fondo, tipo:"Money Market", tna, patrimonio:patStr, isFCI:true, entity, color });
        });

        const billEntries = BILLETERAS_GARANTIZADAS.map(b => ({
          nombre:b.nombre, tipo:"Billetera", tna:b.tna, limite:b.limite, desde:b.desde, isFCI:false,
        }));

        // Merge, sort by TNA desc, take top 20
        const all = [...billEntries, ...fciEntries].sort((a,b) => b.tna - a.tna).slice(0, 20);
        setEntries(all);

        if (Array.isArray(rPF) && rPF.length > 0) setPfTNA(rPF.reduce((s,b)=>s+(b.tnaClientes||0),0) / rPF.length);
        setUpdatedAt(Date.now());
        setStatus("ok");
      } catch { setStatus("error"); }
    };
    load();
  }, []);

  const maxTNA = entries.length > 0 ? entries[0].tna : 30;
  const chartEntries = expanded ? entries : entries.slice(0, 10);

  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <div>
          <h3 style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:t.tx, margin:0 }}>Billeteras y Fondos de Liquidez</h3>
          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>
            {status==="ok" ? `Top ${entries.length} en pesos · TNA sobre cuotaparte CAFCI` : "Cargando datos..."}
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",background:status==="ok"?"#22c55e":"#94a3b8",boxShadow:status==="ok"?"0 0 5px #22c55e":"none"}}/>
          <LiveTimestamp ts={updatedAt} t={t} />
        </div>
      </div>

      {/* ── Bar chart ── */}
      <Card t={t} style={{ marginBottom:16 }}>
        <div style={{ padding:"18px 22px" }}>
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>
            COMPARACIÓN DE RENDIMIENTOS
          </div>
          <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginBottom:16 }}>
            TNA de billeteras y fondos de liquidez ordenados por rendimiento
          </div>
          {status==="loading" && Array.from({length:8}).map((_,i) => <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><Skeleton w={100} h={16} r={4}/><Skeleton w="100%" h={24} r={6}/></div>)}
          {chartEntries.map((e,i) => {
            const isBill = !e.isFCI;
            const barColor = isBill ? t.go : (e.color || t.gr);
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontFamily:FB, fontSize:10, color:t.mu, minWidth:140, textAlign:"right", flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {e.nombre.replace(/ - Clase.*$/,"")}
                </span>
                <div style={{ flex:1, height:24, background:t.alt, borderRadius:6, overflow:"hidden" }}>
                  <div style={{
                    width:`${Math.max((e.tna/maxTNA*100),8).toFixed(1)}%`, height:"100%",
                    background:`linear-gradient(90deg, ${barColor}66, ${barColor})`,
                    borderRadius:6, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:10,
                    transition:"width .4s ease",
                  }}>
                    <span style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:"#fff" }}>{e.tna.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          {entries.length > 10 && (
            <button onClick={()=>setExpanded(!expanded)} style={{
              marginTop:8, fontFamily:FB, fontSize:11, fontWeight:600, color:t.go, background:"transparent",
              border:"none", cursor:"pointer", padding:0,
            }}>
              {expanded ? "Ver menos ↑" : `Ver ${entries.length - 10} más ↓`}
            </button>
          )}
        </div>
      </Card>

      {/* ── Detail list ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {entries.map((e,i) => {
          const isBill = !e.isFCI;
          return (
            <Card key={i} t={t}>
              <div style={{ display:"flex", alignItems:"center", padding:"12px 16px", gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background:isBill ? t.goBg : (e.color||t.gr)+"15", border:`1px solid ${isBill?t.go:(e.color||t.gr)}33`,
                }}>
                  <span style={{ fontFamily:FH, fontSize:13, fontWeight:800, color:isBill?t.go:(e.color||t.gr) }}>
                    {i+1}
                  </span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {e.nombre.replace(/ - Clase.*$/,"")}
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:3, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:FB, fontSize:9, fontWeight:600, color:isBill?t.go:(e.color||t.gr), background:isBill?t.goBg:(e.color||t.gr)+"15", padding:"1px 7px", borderRadius:4 }}>{e.tipo}</span>
                    {e.patrimonio && <span style={{fontFamily:FB,fontSize:9,color:t.mu}}>Patrimonio: {e.patrimonio}</span>}
                    {e.limite && <span style={{fontFamily:FB,fontSize:9,color:t.rd,background:t.rdBg,padding:"1px 6px",borderRadius:4}}>Límite: {e.limite}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.gr }}>{e.tna.toFixed(2)}%</div>
                  <div style={{fontFamily:FB,fontSize:9,color:t.fa}}>TNA</div>
                  {e.desde && <div style={{fontFamily:FB,fontSize:8,color:t.fa}}>Desde {e.desde}</div>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {pfTNA && (
        <div style={{ marginTop:12, padding:"14px 18px", background:t.alt, borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${t.brd}` }}>
          <div>
            <span style={{fontFamily:FB,fontSize:12,fontWeight:600,color:t.tx}}>Plazo Fijo promedio</span>
            <div style={{fontFamily:FB,fontSize:10,color:t.mu}}>BCRA · Colocaciones online $100K a 30 días</div>
          </div>
          <span style={{fontFamily:FH,fontSize:20,fontWeight:700,color:t.tx}}>{pfTNA.toFixed(1)}% <span style={{fontSize:11,color:t.fa}}>TNA</span></span>
        </div>
      )}

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, lineHeight:1.6 }}>
        * FCIs: TNA calculada sobre variación diaria de cuotaparte vía CAFCI. Billeteras: tasa garantizada publicada. Solo instrumentos en pesos. Las tasas cambian frecuentemente.
      </p>
    </div>
  );
}

function FCIsPanel({ t }) {
  const cMapF = {blue:{ac:t.bl,bg:t.blBg},gold:{ac:t.go,bg:t.goBg},purple:{ac:t.pu,bg:t.puBg},green:{ac:t.gr,bg:t.grBg},red:{ac:t.rd,bg:t.rdBg}};
  return (
    <div className="fade-up">
      <p style={{ fontFamily:FB, fontSize:12, color:t.mu, marginBottom:20, lineHeight:1.6 }}>
        24 Fondos Comunes de Inversión. Hacé click en cualquier fondo para ver su ficha completa en balanz.com.
      </p>
      {FONDOS_BALANZ.map((cat, ci) => {
        const catCol = cMapF[cat.color] || cMapF.blue;
        return (
          <div key={ci} style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:catCol.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <cat.Icon size={18} color={catCol.ac} strokeWidth={2} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>{cat.cat}</span>
                  <Badge c={cat.color==="purple"?"purple":"gray"} sm t={t}>{cat.moneda}</Badge>
                </div>
                <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>{cat.desc}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:8 }}>
              {cat.fondos.map((f, fi) => (
                <a key={fi} href={f.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{ background:f.destacado?catCol.bg:t.srf, border:`1px solid ${f.destacado?catCol.ac+"44":t.brd}`, borderLeft:`3px solid ${f.destacado?catCol.ac:catCol.ac+"66"}`, borderRadius:12, padding:"14px 16px", transition:"all .18s", cursor:"pointer", position:"relative" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=t.sh;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                    {f.destacado && <div style={{ position:"absolute", top:8, right:10, fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em", color:"#fff", background:catCol.ac, padding:"2px 8px", borderRadius:10, textTransform:"uppercase", display:"flex", alignItems:"center", gap:3 }}><Star size={9} /> DESTACADO</div>}
                    <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, marginBottom:6, paddingRight:f.destacado?80:0 }}>{f.nombre}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:FB, fontSize:10, color:catCol.ac, background:catCol.bg, padding:"2px 8px", borderRadius:5, fontWeight:600 }}>{f.tipo}</span>
                      <span style={{ fontFamily:FB, fontSize:10, color:t.fa, marginLeft:"auto" }}>Rescate: <strong style={{color:t.tx}}>{f.rescate}</strong></span>
                    </div>
                    {f.note && <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:6 }}>{f.note}</div>}
                    <div style={{ fontFamily:FB, fontSize:10, color:catCol.ac, fontWeight:600, marginTop:8, display:"flex", alignItems:"center", gap:4 }}><ExternalLink size={10} /> Ver ficha en Balanz</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:12, lineHeight:1.5 }}>
        * Rendimientos pasados no garantizan rendimientos futuros. Consultá valores actualizados con tu asesor. · Balanz Capital S.A.U. · ACDIFCI N°62 ante CNV
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   RENTA VARIABLE VIEW — CEDEARs + Research Desk
════════════════════════════════════════════════════════════════ */
function RentaVariableView({ t, initialTicker, onTickerConsumed }) {
  const [sub, setSub] = useState(initialTicker ? "charts" : "cedears");
  const [chartTicker, setChartTicker] = useState(initialTicker || "AAPL");
  const [chartInput, setChartInput] = useState(initialTicker || "AAPL");

  // When a new ticker arrives from outside, switch to charts
  useEffect(() => {
    if (initialTicker) {
      setChartTicker(initialTicker);
      setChartInput(initialTicker);
      setSub("charts");
      onTickerConsumed?.();
    }
  }, [initialTicker]);

  const SUBS = [
    {id:"cedears", label:"CEDEARs", Icon:Globe},
    {id:"charts",  label:"Gráficos", Icon:Activity},
    {id:"rv",      label:"Análisis de Acciones", Icon:LineChart},
  ];

  const loadChart = (tk) => {
    const clean = tk.trim().toUpperCase();
    if (clean) { setChartTicker(clean); setChartInput(clean); }
  };

  const tvTheme = t.bg === "#FFFFFF" || t.bg === "#F9FAFB" ? "light" : "dark";
  const chartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv_chart&symbol=${chartTicker}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=${tvTheme==="dark"?"1C2030":"f1f3f6"}&studies=MASimple%7C20%7C0&theme=${tvTheme}&style=1&timezone=America%2FArgentina%2FBuenos_Aires&withdateranges=1&showpopupbutton=0&locale=es&allow_symbol_change=1&width=100%25&height=100%25`;

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:400,
            border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.goBg:"transparent",
            color:sub===s.id?t.go:t.mu, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
            transition:"all .15s",
          }}><s.Icon size={14} strokeWidth={sub===s.id?2.5:1.5}/> {s.label}</button>
        ))}
      </div>

      {sub === "cedears" && <CEDEARsPanel t={t} />}

      {sub === "charts" && (
        <div className="fade-up">
          {/* Ticker search */}
          <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, maxWidth:300 }}>
              <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu }} />
              <input
                value={chartInput} onChange={e=>setChartInput(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&loadChart(chartInput)}
                placeholder="Ticker (ej: AAPL, MSFT, GGAL)"
                style={{ width:"100%", padding:"10px 10px 10px 32px", borderRadius:10, fontFamily:"monospace", fontSize:13, fontWeight:700, border:`1.5px solid ${t.brd}`, background:t.srf, color:t.tx, outline:"none" }}
              />
            </div>
            <button onClick={()=>loadChart(chartInput)} style={{
              padding:"10px 20px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:700,
              background:t.go, color:"#fff", border:"none", cursor:"pointer",
            }}>Buscar</button>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {["AAPL","MSFT","NVDA","TSLA","GGAL","YPF","VIST","MELI","SPY","BTC"].map(tk=>(
                <button key={tk} onClick={()=>loadChart(tk)} style={{
                  padding:"4px 10px", borderRadius:6, fontFamily:"monospace", fontSize:10, fontWeight:600,
                  border:`1px solid ${chartTicker===tk?t.go:t.brd}`,
                  background:chartTicker===tk?t.goBg:"transparent",
                  color:chartTicker===tk?t.go:t.mu, cursor:"pointer",
                }}>{tk}</button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:14, overflow:"hidden", height:520 }}>
            <iframe
              key={chartTicker+tvTheme}
              src={chartUrl}
              style={{ width:"100%", height:"100%", border:"none" }}
              title={`Gráfico ${chartTicker}`}
              allow="clipboard-write"
            />
          </div>
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:8, textAlign:"center" }}>
            Gráficos interactivos · Podés agregar indicadores, cambiar temporalidad y hacer zoom ·
            <a href="https://www.tradingview.com" target="_blank" rel="noreferrer" style={{ color:t.bl, marginLeft:4, textDecoration:"none" }}>Powered by TradingView</a>
          </p>
        </div>
      )}

      {sub === "rv" && <EquityScreener t={t} />}
      <WhatsAppCTA t={t} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PRODUCTOS VIEW — FCIs + ETPs
════════════════════════════════════════════════════════════════ */
function ProductosView({ t }) {
  const [sub, setSub] = useState("cuentas");
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const tryUnlock = () => {
    if (pin === "1243") { setUnlocked(true); setError(false); }
    else { setError(true); setPin(""); setTimeout(()=>setError(false), 1800); }
  };
  const SUBS = [
    {id:"cuentas", label:"Cuentas y Billeteras", Icon:Banknote},
    {id:"fondos",  label:"FCIs", Icon:Wallet},
    {id:"etps",    label:"ETPs", Icon:Package},
  ];
  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:sub===s.id?700:400,
            border:`1.5px solid ${sub===s.id?t.go:t.brd}`, background:sub===s.id?t.goBg:"transparent",
            color:sub===s.id?t.go:t.mu, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
            transition:"all .15s",
          }}><s.Icon size={14} strokeWidth={sub===s.id?2.5:1.5}/> {s.label}</button>
        ))}
      </div>
      {sub === "cuentas" && <CuentasPanel t={t} />}
      {sub === "fondos" && <FCIsPanel t={t} />}
      {sub === "etps" && <ETPsPanel t={t} pin={pin} setPin={setPin} unlocked={unlocked} error={error} tryUnlock={tryUnlock} />}
      <WhatsAppCTA t={t} />
    </div>
  );
}

function InicioView({ dolar, riesgoPais, t, setTab, goResearch, isMobile=false, clock, liveMarket={} }) {
  const mep = dolar?.bolsa;
  const ccl = dolar?.contadoconliqui;
  const rp  = riesgoPais?.valor;
  const spy = liveMarket.spy;
  const mervalARS = liveMarket.mervalARS;
  const latest = SUMMARIES[0];

  // Best LECAP TNA ≤ 6 months
  const bestLec = LECAP.filter(l=>l.dias<=180).sort((a,b)=>parseFloat(b.rows[0].tna)-parseFloat(a.rows[0].tna))[0];

  // Top movers from cache
  const cached = (() => { try { return JSON.parse(localStorage.getItem("tbl-live-prices")||"{}"); } catch { return {}; } })();
  const withData = Object.entries(cached).filter(([,v]) => v && typeof v.changePct === "number" && v.price > 0).map(([ticker, v]) => ({ ticker, price:v.price, pct:v.changePct }));
  const sorted = [...withData].sort((a,b) => b.pct - a.pct);
  const topMovers = withData.length >= 6 ? [...sorted.slice(0,3), ...sorted.slice(-3).reverse()] : [];

  return (
    <div className="fade-up" style={{ maxWidth:900, margin:"0 auto" }}>

      {/* ── BREAKING NEWS ── */}
      {BREAKING_NEWS && (
        <div style={{
          background:BREAKING_NEWS.color==="red"?"linear-gradient(135deg,#7f1d1d,#991b1b)":BREAKING_NEWS.color==="green"?"linear-gradient(135deg,#14532d,#166534)":"linear-gradient(135deg,#78350f,#92400e)",
          borderRadius:12, padding:"14px 20px", marginBottom:12,
          display:"flex", alignItems:"center", gap:12, cursor:"pointer",
          animation:"pulse 2s ease-in-out infinite",
        }} onClick={()=>BREAKING_NEWS.link?setTab(BREAKING_NEWS.link.tab):null}>
          <span style={{ fontSize:20, flexShrink:0 }}>{BREAKING_NEWS.icon||"🔴"}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".12em", color:"rgba(255,255,255,.5)", textTransform:"uppercase", marginBottom:2 }}>ALERTA · ALTO IMPACTO</div>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.35 }}>{BREAKING_NEWS.text}</div>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,.5)" />
        </div>
      )}

      {/* ── COMPACT HERO ── */}
      <div style={{
        borderRadius:16, padding:isMobile?"28px 20px 24px":"36px 40px 32px",
        background:`linear-gradient(145deg, #0d1117 0%, #1a2744 55%, #0d2137 100%)`,
        marginBottom:16, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:200, height:200, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(176,120,42,.1) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:FD, fontSize:isMobile?32:44, fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:"-.02em", margin:0 }}>
              The Big <span style={{color:"#C4956A"}}>Long</span>
            </h1>
            <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,.4)", marginTop:6, margin:"6px 0 0" }}>
              {clock?.date || ""} · Buenos Aires
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>goResearch("resumen")} style={{
              background:"rgba(196,149,106,.9)", color:"#fff", border:"none", borderRadius:10,
              padding:"10px 20px", fontFamily:FB, fontWeight:700, fontSize:12, cursor:"pointer",
            }}>Resumen del día</button>
            <button onClick={()=>setTab("mercados")} style={{
              background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.7)",
              border:"1px solid rgba(255,255,255,.12)", borderRadius:10,
              padding:"10px 20px", fontFamily:FB, fontWeight:600, fontSize:12, cursor:"pointer",
            }}>Cotizaciones</button>
          </div>
        </div>
      </div>

      {/* ── 4 KPIs · sin duplicación · todo live ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          { label:"Dólar MEP", value:mep?`$${Math.round(mep.venta).toLocaleString("es-AR")}`:"—", sub:"tiempo real", accent:t.bl },
          { label:"Riesgo País", value:rp?`${rp.toLocaleString("es-AR")} pb`:"—", sub:"EMBI+ JP Morgan", accent:rp?(rp<600?t.gr:t.rd):t.mu, color:rp?(rp<600?t.gr:t.rd):null },
          { label:"Merval", value:mervalARS?`$${(mervalARS.value/1000).toFixed(0)}K`:"—", sub:mervalARS?.changePct!=null?`${mervalARS.changePct>=0?"+":""}${mervalARS.changePct.toFixed(2)}% hoy`:"BYMA", accent:t.gr },
          { label:"Mejor LECAP", value:bestLec?bestLec.rows[0].tna:"—", sub:bestLec?`${bestLec.rows[0].t} · ${bestLec.dias}d`:"", accent:t.go },
        ].map((k,i)=>(
          <div key={i} style={{ background:t.srf, border:`1px solid ${t.brd}`, borderTop:`3px solid ${k.accent}`, borderRadius:14, padding:isMobile?"14px 12px":"18px 18px" }}>
            <div style={{ fontFamily:FB, fontSize:9, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>{k.label}</div>
            {k.value === "—"
              ? <Skeleton w={isMobile?80:110} h={isMobile?20:26} style={{marginBottom:4}} />
              : <div style={{ fontFamily:FH, fontSize:isMobile?20:26, fontWeight:700, color:k.color||t.tx, lineHeight:1 }}>{k.value}</div>
            }
            {k.sub && <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* ── RESUMEN DEL DÍA · Dinámico desde SUMMARIES[0] ── */}
      <div style={{
        background:t.srf, border:`1px solid ${t.brd}`,
        borderLeft:`4px solid ${t.go}`, borderRadius:16,
        padding:isMobile?"16px 14px":"22px 26px", marginBottom:16,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:t.go, background:t.goBg, padding:"3px 10px", borderRadius:20 }}>
            ● {latest.date}
          </span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{latest.label || "CIERRE DE MERCADO"}</span>
        </div>

        {/* KPI chips — clickeables */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
          {latest.kpis?.slice(0,6).map((k,i) => {
            const bcMap = {green:t.gr,red:t.rd,blue:t.bl,gold:t.go,gray:t.mu};
            const col = bcMap[k.bc]||t.mu;
            const tabMap = {"SPOT ARS/USD":"mercados","BCRA COMPRAS":"mercados","TASAS TEM":"rentafija","LECAP CORTA":"rentafija","LECAP MAYO":"rentafija","DÓLAR BCRA":"mercados","RIESGO PAÍS":"mercados","MERVAL USD":"mercados","GLOBALES":"mercados","ABSORCIÓN BCRA":"mercados","EMAE ENERO":"mercados","INFLACIÓN MAY. FEB.":"mercados","SUPERÁVIT FEB.":"mercados","AO28 LICITACIÓN":"rentafija"};
            const dest = tabMap[k.k] || "mercados";
            return (
              <button key={i} onClick={()=>setTab(dest)} style={{
                background:t.alt, borderRadius:8, padding:"6px 10px", fontFamily:FB, fontSize:10,
                display:"flex", flexDirection:"column", gap:2, border:"none", cursor:"pointer", textAlign:"left",
              }}>
                <span style={{ fontSize:8, color:t.fa, letterSpacing:".06em", textTransform:"uppercase" }}>{k.k}</span>
                <span style={{ fontWeight:700, color:t.tx }}>{k.v}</span>
                {k.b && <span style={{ fontSize:8, fontWeight:600, color:col, background:col+"15", padding:"0 5px", borderRadius:4, width:"fit-content" }}>{k.b}</span>}
              </button>
            );
          })}
        </div>

        {/* First 2 news cards — dinámicas */}
        {latest.cards?.slice(0,2).map((c,i) => (
          <div key={i} style={{ padding:"10px 0", borderTop:`1px solid ${t.brd}33`, cursor:"pointer" }} onClick={()=>setTab("mercados")}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:12 }}>{c.icon}</span>
              <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:c.ac, letterSpacing:".08em", textTransform:"uppercase" }}>{c.cat}</span>
            </div>
            <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:t.tx, marginBottom:4 }}>{c.title}</div>
            {c.note && <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }} dangerouslySetInnerHTML={{__html:c.note.length>180?c.note.slice(0,180)+"...":c.note}} />}
          </div>
        ))}
      </div>

      {/* ── TOP MOVERS ── */}
      {topMovers.length >= 6 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.fa, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>
            ACCIONES DESTACADAS · EN VIVO
          </div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(6,1fr)", gap:8 }}>
            {topMovers.map((m,i) => {
              const isUp = m.pct >= 0;
              const col = isUp ? t.gr : t.rd;
              return (
                <button key={i} onClick={()=>window.__goChart?.(m.ticker)} style={{
                  background:t.srf, border:`1px solid ${t.brd}`, borderLeft:`3px solid ${col}`, borderRadius:12, padding:"12px 14px",
                  textAlign:"left", cursor:"pointer", transition:"all .15s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:col }}>{m.ticker}</span>
                    <span style={{ fontFamily:FB, fontSize:7, fontWeight:700, color:"#fff", background:col, padding:"1px 5px", borderRadius:5 }}>
                      {i < 3 ? "▲" : "▼"}
                    </span>
                  </div>
                  <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>${m.price.toFixed(2)}</div>
                  <div style={{ fontFamily:FB, fontSize:11, fontWeight:700, color:col }}>{isUp?"+":""}{m.pct.toFixed(2)}%</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── INFORMES ESTRELLA · Acceso directo ── */}
      {(() => {
        const stars = NOTICIAS.filter(n => n.estrella);
        if (!stars.length) return null;
        const acMap = { blue:t.bl, green:t.gr, gold:t.go, red:t.rd };
        return (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10, marginBottom:16 }}>
            {stars.map((n, i) => {
              const ac = acMap[n.catColor] || t.go;
              return (
                <button key={n.id} onClick={()=>goResearch("informes")} style={{
                  background:t.srf, border:`1px solid ${t.brd}`,
                  borderTop:`3px solid ${ac}`,
                  borderRadius:14, padding:"18px 20px", textAlign:"left", cursor:"pointer",
                  transition:"all .18s", display:"flex", flexDirection:"column", gap:10,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${ac}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.borderTopColor=ac;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:20 }}>{n.emoji}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase",
                      letterSpacing:".1em", color:ac, background:ac+"18", padding:"2px 8px", borderRadius:10 }}>
                      {n.cat}
                    </span>
                    <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:8, fontWeight:700,
                      color:"#fff", background:t.rd, padding:"2px 7px", borderRadius:8 }}>
                      🔴 INFORME HOY
                    </span>
                  </div>
                  <div style={{ fontFamily:FH, fontSize:isMobile?15:17, fontWeight:700, color:t.tx, lineHeight:1.3 }}>{n.titulo}</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }}>{n.subtitulo}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                    <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:ac }}>Leer informe completo</span>
                    <ChevronRight size={14} color={ac} />
                  </div>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ── QUICK NAV ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:8, marginBottom:16 }}>
        {[
          {label:"Mercados",tab:"mercados",Icon:DollarSign,color:t.bl,desc:"FX · Riesgo País · Noticias"},
          {label:"Renta Fija",tab:"rentafija",Icon:ClipboardList,color:t.go,desc:"LECAPs · Soberanos · ONs"},
          {label:"Renta Variable",tab:"rentavariable",Icon:BarChart3,color:t.gr,desc:"CEDEARs · Screener"},
          {label:"Research",tab:"research",Icon:Search,color:t.pu,desc:"Resúmenes · Balances · Recos"},
        ].map((n,i)=>(
          <button key={i} onClick={()=>setTab(n.tab)} style={{
            background:t.srf, border:`1px solid ${t.brd}`, borderRadius:12,
            padding:"14px 14px", textAlign:"left", cursor:"pointer",
            transition:"all .15s", display:"flex", flexDirection:"column", gap:6,
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=n.color;e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.transform="none";}}>
            <n.Icon size={18} color={n.color} strokeWidth={1.8} />
            <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:t.tx }}>{n.label}</div>
            <div style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{n.desc}</div>
          </button>
        ))}
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center" }}>
        Contenido informativo · No constituye asesoramiento de inversión · The Big Long
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   RECOMENDACIONES VIEW — Password protected
════════════════════════════════════════════════════════════════ */
const RECO_PWD = "1243";

function RecomendacionesView({ t }) {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [active, setActive] = useState("conservador");
  const pf = PERFILES.find(p=>p.id===active);
  const cMap = {blue:{ac:t.bl,bg:t.blBg},gold:{ac:t.go,bg:t.goBg},purple:{ac:t.pu,bg:t.puBg},green:{ac:t.gr,bg:t.grBg},red:{ac:t.rd,bg:t.rdBg}};
  const col = cMap[pf.color]||cMap.blue;

  const checkPwd = () => {
    if (pwd === RECO_PWD) { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); setPwd(""); }
  };

  if (!auth) {
    return (
      <div className="fade-up" style={{ maxWidth:400, margin:"60px auto", textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:t.goBg, border:`1px solid ${t.go}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <Lock size={28} color={t.go} />
        </div>
        <h3 style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.tx, marginBottom:8 }}>Recomendaciones</h3>
        <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.7, marginBottom:24 }}>
          Esta sección es de acceso exclusivo para clientes. Ingresá la contraseña para ver las recomendaciones de cartera.
        </p>
        <input
          type="password" placeholder="Contraseña"
          value={pwd} onChange={e=>{setPwd(e.target.value);setPwdErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&checkPwd()}
          autoFocus
          style={{
            width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:FB, fontSize:14,
            border:`1.5px solid ${pwdErr?t.rd:t.brd}`, background:t.srf, color:t.tx, outline:"none",
            letterSpacing:".1em", textAlign:"center", marginBottom:12,
          }}
        />
        {pwdErr && <p style={{ fontFamily:FB, fontSize:11, color:t.rd, marginBottom:8 }}>Contraseña incorrecta.</p>}
        <button onClick={checkPwd} style={{
          width:"100%", padding:"12px", borderRadius:12, border:"none",
          background:t.go, color:"#fff", fontFamily:FB, fontWeight:700, fontSize:14, cursor:"pointer",
        }}>Ingresar</button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ background:t.rdBg, border:`1px solid ${t.rdAcc}44`, borderRadius:10, padding:"12px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:20, lineHeight:1.6, display:"flex", alignItems:"flex-start", gap:10 }}>
        <AlertTriangle size={16} style={{flexShrink:0, marginTop:2}} />
        <span><strong>Aviso importante:</strong> Contenido orientativo e informativo. No constituye asesoramiento financiero ni oferta de compra o venta. Consultá siempre con un asesor.</span>
      </div>

      {/* Profile selector */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {PERFILES.map(p => {
          const pc = cMap[p.color]||cMap.blue;
          const isA = active===p.id;
          return (
            <button key={p.id} onClick={()=>setActive(p.id)} style={{
              padding:"10px 22px", borderRadius:10, fontFamily:FB, fontSize:13, fontWeight:600,
              cursor:"pointer", transition:"all .2s",
              border:`2px solid ${isA?pc.ac:t.brd}`,
              background:isA?pc.ac:"transparent",
              color:isA?"#fff":t.mu,
              display:"flex", alignItems:"center", gap:7,
            }}>
              <p.Icon size={16} /> {p.label}
            </button>
          );
        })}
      </div>

      {/* Profile detail */}
      <Card t={t}>
        <div style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:t.tx, marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
                <pf.Icon size={26} color={col.ac} /> Perfil {pf.label}
              </h2>
              <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.6, maxWidth:520 }}>{pf.desc}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:4 }}>Retorno orientativo</div>
              <Badge c={pf.color==="blue"?"blue":pf.color==="gold"?"gold":"purple"} t={t}>{pf.retorno}</Badge>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:8 }}>Nivel de riesgo: <strong>{pf.riesgo}</strong></div>
            </div>
          </div>

          <SectionLabel t={t}>COMPOSICIÓN ORIENTATIVA DE CARTERA</SectionLabel>

          <div style={{ display:"flex", height:8, borderRadius:6, overflow:"hidden", marginBottom:16 }}>
            {pf.ideas.map((idea,i) => {
              const pctNum = parseInt(idea.por);
              const colors = [t.bl, t.gr, t.go, t.pu, t.rd, t.mu];
              return <div key={i} style={{ width:`${pctNum}%`, background:colors[i%colors.length], transition:"width .4s" }} />;
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
            {pf.ideas.map((idea,i) => {
              const tipoMap = {
                fondo:  { c:t.bl, bg:t.blBg, Icon:PieChart, label:"FONDO" },
                lecap:  { c:t.go, bg:t.goBg, Icon:ClipboardList, label:"LECAP" },
                bono:   { c:t.pu, bg:t.puBg, Icon:FileText, label:"BONO" },
                cedear: { c:t.gr, bg:t.grBg, Icon:Globe, label:"CEDEAR" },
                caucion:{ c:t.mu, bg:t.alt,  Icon:Clock, label:"CAUCIÓN" },
              };
              const tm = tipoMap[idea.tipo] || tipoMap.fondo;
              return (
                <div key={i} style={{
                  background:tm.bg, border:`1px solid ${tm.c}22`,
                  borderRadius:12, padding:"16px 18px",
                  borderLeft:`4px solid ${tm.c}`,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontFamily:FH, fontWeight:800, fontSize:24, color:tm.c }}>{idea.por}</span>
                    <span style={{ fontFamily:FB, fontSize:8, fontWeight:700, color:tm.c, background:tm.c+"18", padding:"2px 7px", borderRadius:10, letterSpacing:".06em", display:"flex", alignItems:"center", gap:3 }}>
                      <tm.Icon size={10} /> {tm.label}
                    </span>
                  </div>
                  <div style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:t.tx, marginBottom:4 }}>{idea.inst}</div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.5 }}>{idea.note}</div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:16, fontStyle:"italic" }}>
            {pf.disclaimer}
          </p>
        </div>
      </Card>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════════════════════════════ */
function AdminPanel({ onClose, onPublish, t }) {
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
  "content": "HTML con análisis en 3-4 oraciones. Usá <b>negritas</b> para los datos clave. Diferenciá datos de interpretación."
}
Reglas: no inventés datos, usá solo lo que viene en el texto, tono técnico-profesional.`,
          messages:[{role:"user",content:txt}],
        }),
      });
      const d = await res.json();
      const raw = d.content?.find(x=>x.type==="text")?.text||"{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      parsed.id = Date.now().toString();
      onPublish(parsed);
      setMsg("✅ Publicado correctamente");
      setTxt("");
    } catch(e) {
      setMsg("❌ Error al procesar. Verificá el contenido.");
    }
    setLoading(false);
  }, [txt, onPublish]);

  return (
    <div style={{ background:t.goBg, borderBottom:`2px solid ${t.go}`, padding:"16px 20px" }}>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, color:t.go, fontFamily:FB, fontSize:14 }}>🔑 Panel Admin — Publicar contenido</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:t.go, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)}
          placeholder="Pegá el texto con información del día: resumen de mercado, noticias, balance de empresa, cotizaciones, etc."
          style={{ width:"100%", height:90, padding:12, borderRadius:8, border:`1px solid ${t.go}55`, fontFamily:FB, fontSize:13, resize:"vertical", background:t.srf, color:t.tx, outline:"none" }}
        />
        <div style={{ display:"flex", gap:10, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={process} disabled={loading} style={{
            background:t.go, color:"#fff", border:"none", borderRadius:8,
            padding:"9px 22px", fontFamily:FB, fontWeight:700, fontSize:13, cursor:"pointer", opacity:loading?.6:1,
          }}>{loading?"Procesando…":"✨ Procesar y publicar"}</button>
          {msg && <span style={{ fontSize:13, fontFamily:FB, color:msg.startsWith("✅")?t.gr:t.rd }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   AI CHAT WIDGET
   Nombres: referentes de finanzas globales
   Contraseña: 1243 · WhatsApp: +54 11 4050-0087
════════════════════════════════════════════════════════════════ */
const IA_NAMES = ["Warren","Milton","Benjamin","Peter","Charlie","George","Ray","Paul","Janet","Adam","Irving","Nassim","Howard","Michael","John","Philip","David","Robert","Carl","Alan"];
const IA_NAME  = IA_NAMES[Math.floor(Math.random() * IA_NAMES.length)];
const WA_NUM   = "5491140500087";
const WA_LINK  = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const CHAT_PWD = "1243";

const IA_SYSTEM = `Sos ${IA_NAME}, un asistente financiero del dashboard The Big Long de Máximo Ricciardi, asesor financiero argentino.

Personalidad: inteligente, directo, con criterio propio. Hablás en español rioplatense. Sabés de mercados argentinos e internacionales.

REGLAS (innegociables):
1. Explicás instrumentos, conceptos de mercado, funcionamiento de bonos, acciones, ETFs, tipos de cambio, macroeconomía.
2. NUNCA recomendás comprar o vender activos específicos. Si te lo piden → derivás a Máximo mostrando el botón de WhatsApp.
3. Si alguien dice que es cliente de Máximo → mostrás el botón de WhatsApp con entusiasmo.
4. Usás búsqueda web para datos frescos: cotizaciones, noticias, tasas.
5. Separás datos de interpretación.
6. Respuestas concisas, máximo 4 párrafos.
7. En respuestas sobre inversiones agregás al final: "⚠️ Orientativo, no asesoramiento formal."

Asesoramiento de Máximo: sin costo. WhatsApp: +54 11 4050-0087.`;

function AIChatWidget({ t, isMobile }) {
  const [open, setOpen]     = useState(false);
  const [auth, setAuth]     = useState(false);
  const [pwd, setPwd]       = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [msgs, setMsgs]     = useState([{
    role:"assistant",
    content:`Hola, soy **${IA_NAME}**. Podés preguntarme sobre mercados, instrumentos financieros, tipos de cambio o economía. ¿En qué te ayudo?`,
    id:Date.now(),
  }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // ── Daily message limit: 10 messages/day via localStorage ──
  const DAILY_LIMIT = 10;
  const getChatUsage = () => {
    try {
      const raw = localStorage.getItem("tbl-chat-usage");
      if (!raw) return { date: "", count: 0 };
      const parsed = JSON.parse(raw);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date !== today) return { date: today, count: 0 };
      return parsed;
    } catch { return { date: "", count: 0 }; }
  };
  const [chatUsage, setChatUsage] = useState(getChatUsage);
  const msgsLeft = DAILY_LIMIT - chatUsage.count;
  const isLimited = msgsLeft <= 0;

  const incrementUsage = () => {
    const today = new Date().toISOString().slice(0, 10);
    const next = { date: today, count: chatUsage.count + 1 };
    setChatUsage(next);
    try { localStorage.setItem("tbl-chat-usage", JSON.stringify(next)); } catch {}
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const checkPwd = () => {
    if (pwd === CHAT_PWD) { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); }
  };

  const isClientMsg = (txt) => /soy cliente|cliente de m[aá]ximo|cliente tuyo/i.test(txt);
  const isRecoMsg   = (txt) => /recomend[aá]s?|debo comprar|conviene comprar|debo vender|conviene vender|me entr[aá]s?|me sal[ií]s?|qué compro|qué vendo/i.test(txt);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Check daily limit
    if (isLimited) {
      setMsgs(prev => [...prev, { role:"assistant", id:Date.now(),
        content:"Alcanzaste el límite de **10 consultas diarias**. El límite se renueva mañana. Si necesitás asesoramiento ahora, contactá a Máximo directamente.\n\n[WA_CONSULT]" }]);
      return;
    }

    setInput("");
    const userMsg = { role:"user", content:text, id:Date.now() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setLoading(true);

    if (isClientMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Perfecto, le aviso a Máximo ahora mismo. Hacé click abajo y le llega tu mensaje directo.\n\n[WA_ALERT]` }]);
      setLoading(false); return;
    }
    if (isRecoMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Las recomendaciones de compra y venta son terreno de Máximo. Su asesoramiento es **sin costo** — te lo conecto directamente.\n\n[WA_CONSULT]` }]);
      setLoading(false); return;
    }

    // Increment usage counter (only for actual API calls)
    incrementUsage();

    try {
      const apiMsgs = history.map(m => ({ role:m.role, content:m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:IA_SYSTEM,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:apiMsgs,
        }),
      });
      const data = await res.json();
      const reply = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("")
        || "No pude procesar tu consulta. Intentá de nuevo.";
      setMsgs([...history, { role:"assistant", content:reply, id:Date.now()+1 }]);
    } catch {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:"Error de conexión con el servidor. Verificá tu conexión e intentá de nuevo." }]);
    }
    setLoading(false);
  };

  const MiniMarkdown = ({ text }) => (
    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.75, color:"inherit" }}>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p,j) =>
          p.startsWith("**")&&p.endsWith("**") ? <strong key={j} style={{fontWeight:700}}>{p.slice(2,-2)}</strong> : p
        );
        return <div key={i} style={{ marginBottom:line===""?8:2 }}>{parts}</div>;
      })}
    </div>
  );

  const renderContent = (content) => {
    const waBtn = (href, label) => (
      <a href={href} target="_blank" rel="noreferrer" style={{
        display:"inline-flex", alignItems:"center", gap:8, marginTop:12,
        background:"#22c55e", color:"#fff", borderRadius:10, padding:"9px 18px",
        fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, textDecoration:"none",
        boxShadow:"0 2px 10px rgba(34,197,94,.3)",
      }}>
        <MessageCircle size={16} /> {label}
      </a>
    );
    if (content.includes("[WA_ALERT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_ALERT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Soy cliente tuyo y me gustaría consultarte."),"Avisarle a Máximo")}
      </div>
    );
    if (content.includes("[WA_CONSULT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_CONSULT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Me gustaría que me asesores."),"Hablar con Máximo (sin costo)")}
      </div>
    );
    return <MiniMarkdown text={content} />;
  };

  const CHAT_W = isMobile ? "100vw" : 400;
  const CHAT_H = isMobile ? "100dvh" : 580;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={()=>setOpen(true)} title={`Hablar con ${IA_NAME}`} style={{
          position:"fixed", bottom:isMobile?24:28, right:22, zIndex:200,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(145deg,#1a1a2e,#16213e)",
          border:"2px solid rgba(176,120,42,.5)",
          cursor:"pointer", boxShadow:"0 4px 24px rgba(0,0,0,.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"transform .2s, box-shadow .2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 6px 32px rgba(176,120,42,.5)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,.35)";}}>
          <span style={{fontSize:22}}><MessageCircle size={22} color="#D4A853" /></span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position:"fixed",
          bottom:isMobile?0:24, right:isMobile?0:22,
          width:CHAT_W, height:CHAT_H,
          borderRadius:isMobile?0:20,
          background:t.srf, border:`1px solid ${t.brd}`,
          boxShadow:"0 24px 64px rgba(0,0,0,.22)",
          zIndex:300, display:"flex", flexDirection:"column", overflow:"hidden",
        }}>

          {/* Header */}
          <div style={{
            background:"linear-gradient(145deg,#1a1a2e,#0f3460)",
            padding:"16px 18px", flexShrink:0,
            display:"flex", alignItems:"center", gap:12,
            borderBottom:"1px solid rgba(176,120,42,.3)",
          }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:"linear-gradient(135deg,#B0782A,#D4A853)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, flexShrink:0,
            }}><MessageCircle size={16} color="#fff" /></div>
            <div style={{flex:1}}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-.01em",
              }}>{IA_NAME}</div>
              <div style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:10, color:"rgba(255,255,255,.5)", marginTop:1, letterSpacing:".06em",
              }}>ASISTENTE FINANCIERO · THE BIG LONG</div>
            </div>
            {/* Status dot */}
            <div style={{display:"flex",alignItems:"center",gap:5,marginRight:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}} />
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"rgba(255,255,255,.4)"}}>en línea</span>
            </div>
            <button onClick={()=>setOpen(false)} style={{
              background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)",
              borderRadius:8, width:32, height:32, cursor:"pointer",
              color:"rgba(255,255,255,.7)", fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"background .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>✕</button>
          </div>

          {/* Auth gate */}
          {!auth ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:18 }}>
              <div style={{
                width:64, height:64, borderRadius:16,
                background:"linear-gradient(135deg,#B0782A22,#D4A85322)",
                border:"1px solid rgba(176,120,42,.3)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
              }}><Lock size={28} color="#D4A853" /></div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:t.tx, marginBottom:6 }}>Acceso privado</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.mu, lineHeight:1.7 }}>
                  Ingresá la contraseña para acceder al asistente.
                </p>
              </div>
              <div style={{width:"100%", display:"flex", flexDirection:"column", gap:10}}>
                <input
                  type="password" placeholder="Contraseña"
                  value={pwd}
                  onChange={e=>{ setPwd(e.target.value); setPwdErr(false); }}
                  onKeyDown={e=>e.key==="Enter"&&checkPwd()}
                  autoFocus
                  style={{
                    width:"100%", padding:"12px 16px", borderRadius:12,
                    fontFamily:"'DM Sans',sans-serif", fontSize:14, letterSpacing:".1em",
                    border:`1.5px solid ${pwdErr?"#ef4444":t.brd}`,
                    background:t.alt, color:t.tx, outline:"none",
                    transition:"border-color .2s",
                  }}
                />
                {pwdErr && (
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#ef4444", marginTop:-4 }}>
                    Contraseña incorrecta. Intentá de nuevo.
                  </p>
                )}
                <button onClick={checkPwd} style={{
                  width:"100%", padding:"13px", borderRadius:12, border:"none",
                  background:"linear-gradient(135deg,#1a1a2e,#0f3460)",
                  color:"#fff", fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700, fontSize:14, cursor:"pointer",
                  letterSpacing:".02em", transition:"opacity .2s",
                }}>Ingresar</button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages area */}
              <div style={{
                flex:1, overflowY:"auto", padding:"18px 16px",
                display:"flex", flexDirection:"column", gap:14,
                background:t.bg,
              }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
                    {m.role==="assistant" && (
                      <div style={{
                        width:28, height:28, borderRadius:8, flexShrink:0,
                        background:"linear-gradient(135deg,#B0782A,#D4A853)",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                      }}><MessageCircle size={16} color="#fff" /></div>
                    )}
                    <div style={{
                      maxWidth:"82%",
                      background: m.role==="user"
                        ? "linear-gradient(135deg,#1a1a2e,#0f3460)"
                        : t.srf,
                      color: m.role==="user" ? "#fff" : t.tx,
                      borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding:"11px 15px",
                      border: m.role==="assistant" ? `1px solid ${t.brd}` : "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                    }}>
                      {m.role==="assistant"
                        ? renderContent(m.content)
                        : <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65 }}>{m.content}</span>
                      }
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                    <div style={{
                      width:28, height:28, borderRadius:8, flexShrink:0,
                      background:"linear-gradient(135deg,#B0782A,#D4A853)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                    }}><MessageCircle size={16} color="#fff" /></div>
                    <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:"18px 18px 18px 4px", padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{
                            width:7, height:7, borderRadius:"50%",
                            background:"#B0782A",
                            animation:"blink 1.4s infinite ease-in-out",
                            animationDelay:`${i*0.18}s`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              {msgs.length <= 1 && (
                <div style={{ padding:"10px 16px 6px", background:t.bg, display:"flex", gap:6, flexWrap:"wrap", borderTop:`1px solid ${t.brd}33` }}>
                  {["¿Qué es un LECAP?","¿Cómo funciona el MEP?","¿Qué es el riesgo país?","¿Cómo dolarizo?"].map((s,i) => (
                    <button key={i} onClick={()=>setInput(s)} style={{
                      background:"transparent",
                      border:`1px solid ${t.brd}`,
                      borderRadius:20, padding:"5px 12px",
                      fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.mu,
                      cursor:"pointer", whiteSpace:"nowrap",
                      transition:"all .15s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#B0782A";e.currentTarget.style.color="#B0782A";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.color=t.mu;}}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div style={{
                padding:"12px 16px 14px",
                background:t.srf,
                borderTop:`1px solid ${t.brd}`,
                display:"flex", gap:10, flexShrink:0, alignItems:"center",
              }}>
                <input
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                  placeholder={isLimited ? "Límite diario alcanzado" : `Preguntale a ${IA_NAME}...`}
                  disabled={loading || isLimited}
                  style={{
                    flex:1, padding:"11px 15px", borderRadius:12,
                    fontFamily:"'DM Sans',sans-serif", fontSize:13,
                    border:`1px solid ${t.brd}`,
                    background:t.alt, color:t.tx, outline:"none",
                    transition:"border-color .2s",
                  }}
                  onFocus={e=>e.target.style.borderColor="#B0782A"}
                  onBlur={e=>e.target.style.borderColor=t.brd}
                />
                <button onClick={send} disabled={loading||!input.trim()} style={{
                  width:42, height:42, borderRadius:12, border:"none", flexShrink:0,
                  background:input.trim()&&!loading
                    ? "linear-gradient(135deg,#B0782A,#D4A853)"
                    : t.alt,
                  color:input.trim()&&!loading?"#fff":t.mu,
                  cursor:input.trim()&&!loading?"pointer":"default",
                  fontSize:16, transition:"all .2s",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:input.trim()&&!loading?"0 2px 10px rgba(176,120,42,.35)":"none",
                }}>➤</button>
              </div>

              {/* Footer */}
              <div style={{ padding:"6px 16px 10px", background:t.srf, textAlign:"center" }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.fa, lineHeight:1.5 }}>
                  {msgsLeft > 0 ? `${msgsLeft} consultas restantes hoy` : "Límite diario alcanzado"} · No es asesoramiento ·{" "}
                  <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")} target="_blank" rel="noreferrer"
                    style={{ color:"#B0782A", textDecoration:"none", fontWeight:600 }}>
                    Hablar con Máximo →
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("inicio");
  const [chartTickerGlobal, setChartTickerGlobal] = useState(null);

  // Global function: any component can call goChart("AAPL") to open chart tab
  const goChart = useCallback((ticker) => {
    setChartTickerGlobal(ticker);
    setTab("rentavariable");
  }, []);
  const [researchSub, setResearchSub] = useState("resumen");
  const [admin, setAdmin] = useState(false);
  const [adminPrompt, setAdminPrompt] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [extra, setExtra] = useState([]);
  const [dolar, setDolar] = useState(null);
  const [riesgoPais, setRiesgoPais] = useState(null);
  const [fxError, setFxError] = useState(false);
  // ── Live market data (shared across ticker + components) ──
  const [liveMarket, setLiveMarket] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tbl-live-market") || "null") || { spy:null, gold:null, brent:null, mervalARS:null }; } catch { return { spy:null, gold:null, brent:null, mervalARS:null }; }
  });
  const winW = useWindowSize();
  const isMobile = winW < 640;
  const clock = useClock();
  const t = dark ? TH.d : TH.l;
  useFonts(dark);

  // Load extra from storage
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("mr-extra"); if (r?.value) setExtra(JSON.parse(r.value)); } catch {}
    })();
  }, []);

  // ── Live FX: dolarapi.com directo con fallback a valores del día ──
  useEffect(() => {
    // Valores verificados 20 MAR 2026 — Fuente: La Nación / El Cronista / c5n
    const FALLBACK = {
      oficial:          { compra: 1365, venta: 1415 },
      blue:             { compra: 1410, venta: 1430 },
      bolsa:            { compra: 1418, venta: 1421 },
      contadoconliqui:  { compra: 1462, venta: 1478 },
      mayorista:        { compra: 1392, venta: 1394 },
    };
    const FALLBACK_RP = { valor: 640, fecha: "20 MAR 2026" };

    async function loadLiveData() {
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 5000); // 5s timeout
        const res = await fetch("https://dolarapi.com/v1/dolares", { signal: ctrl.signal });
        clearTimeout(tid);
        const data = await res.json();
        const byName = k => data.find(d => d.casa === k);
        setDolar({
          oficial:         byName("oficial")          || FALLBACK.oficial,
          blue:            byName("blue")             || FALLBACK.blue,
          bolsa:           byName("bolsa")            || FALLBACK.bolsa,
          contadoconliqui: byName("contadoconliqui")  || FALLBACK.contadoconliqui,
          mayorista:       byName("mayorista")         || FALLBACK.mayorista,
        });
        setFxError(false);
      } catch {
        setDolar(FALLBACK);
        setFxError(true);
      }
      try {
        const ctrl2 = new AbortController();
        const tid2 = setTimeout(() => ctrl2.abort(), 5000);
        const rpRes = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo", { signal: ctrl2.signal });
        clearTimeout(tid2);
        const rpData = await rpRes.json();
        if (rpData?.valor) setRiesgoPais(rpData);
        else setRiesgoPais(FALLBACK_RP);
      } catch {
        setRiesgoPais(FALLBACK_RP);
      }
    }

    loadLiveData();
    const interval = setInterval(loadLiveData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Live: SPY, Oro (GLD), Brent (BNO), Merval ARS — refresh 60s ──
  useEffect(() => {
    let cancelled = false;
    const fetchMarket = async () => {
      const updates = {};
      try {
        const r = await fetch(`${FINNHUB_PROXY}=SPY`);
        const d = await r.json();
        if (d.c > 0) updates.spy = { price: d.c, changePct: d.dp };
      } catch {}
      try {
        // Oro — GLD ETF via Finnhub proxy (GLD ≈ 1/10 oz gold, multiply ~23.3 for XAU/USD approx)
        const rg = await fetch(`${FINNHUB_PROXY}=GLD`);
        const dg = await rg.json();
        if (dg.c > 0) updates.gold = { price: dg.c, changePct: dg.dp };
      } catch {}
      try {
        // Brent crude — BNO ETF via Finnhub proxy
        const rb = await fetch(`${FINNHUB_PROXY}=BNO`);
        const db = await rb.json();
        if (db.c > 0) updates.brent = { price: db.c, changePct: db.dp };
      } catch {}
      try {
        // Merval — ArgentinaDatos (no CORS, no auth, real ARS price)
        const r = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/merval");
        const d = await r.json();
        const val = d?.valor || d?.ultimo || (Array.isArray(d) ? d[d.length-1]?.valor : null);
        if (val > 0) updates.mervalARS = { value: val, changePct: d?.variacion ?? null };
      } catch {}
      if (!cancelled && Object.keys(updates).length > 0) {
        setLiveMarket(prev => {
          const next = { ...prev, ...updates };
          try { localStorage.setItem("tbl-live-market", JSON.stringify(next)); } catch {}
          return next;
        });
      }
    };
    fetchMarket();
    const id = setInterval(fetchMarket, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const handleLogoClick = () => {
    // Volver al inicio y limpiar estado
    setTab("inicio");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Admin access after 5 rapid clicks (mantener funcionalidad oculta)
    setLogoClicks(n => { const next = n+1; if(next>=5){ setAdminPrompt(true); return 0; } return next; });
  };

  const [logoSpin, setLogoSpin] = useState(false);
  const [logoIdx, setLogoIdx] = useState(0);

  // Professional, muted color palette for logo cycle
  const LOGO_COLORS = [
    null, // default (uses t.tx / t.go)
    { main:"#1E3A5F", accent:"#B0782A" }, // navy + gold (original vibe)
    { main:"#2D4A3E", accent:"#8B7355" }, // forest + bronze
    { main:"#4A3728", accent:"#C4956A" }, // espresso + copper
    { main:"#3B3B5C", accent:"#9B8EC4" }, // slate purple + lavender
    { main:"#1A3C40", accent:"#5B9A8B" }, // dark teal + sage
    { main:"#4A2C2A", accent:"#C17C74" }, // burgundy + rose
  ];
  const logoC = LOGO_COLORS[logoIdx];

  const publishExtra = useCallback(async (item) => {
    const updated = [item, ...extra];
    setExtra(updated);
    try { await window.storage.set("mr-extra", JSON.stringify(updated)); } catch {}
  }, [extra]);

  const removeExtra = useCallback(async (id) => {
    const updated = extra.filter(x=>x.id!==id);
    setExtra(updated);
    try { await window.storage.set("mr-extra", JSON.stringify(updated)); } catch {}
  }, [extra]);

  const TABS = [
    { id:"inicio",       label:"Inicio",         Icon:Home,       desc:"Dashboard y resumen del día" },
    { id:"mercados",     label:"Mercados",        Icon:DollarSign, desc:"Cotizaciones, FX y noticias live" },
    { id:"rentafija",    label:"Renta Fija",      Icon:ClipboardList, desc:"LECAPs, soberanos, ONs y plazos fijos" },
    { id:"rentavariable",label:"Renta Variable",  Icon:BarChart3,  desc:"CEDEARs y screener de equities" },
    { id:"productos",    label:"Productos",       Icon:Package,    desc:"FCIs y ETPs Balanz" },
    { id:"research",     label:"Research",        Icon:Search,     desc:"Resúmenes, balances y recomendaciones" },
  ];

  // Expose goChart globally so nested components can call it without prop drilling
  useEffect(() => { window.__goChart = goChart; return () => { delete window.__goChart; }; }, [goChart]);

  const goResearch = (sub) => { setResearchSub(sub); setTab("research"); };

  const of  = dolar?.oficial?.venta;
  const bl  = dolar?.blue?.venta;
  const mep = dolar?.bolsa?.venta;
  const ccl = dolar?.contadoconliqui?.venta;

  // ── Última noticia para el ticker ──────────────────────────
  const lastNews = NOTICIAS[0];
  const newsSnippet = lastNews ? `📰 ${lastNews.titulo.slice(0, 60)}${lastNews.titulo.length > 60 ? "…" : ""}` : "";

  // ── Ticker items — 100% live ────────────────────────────────
  const fmt2 = (v, prefix="$") => v ? `${prefix}${Math.round(v).toLocaleString("es-AR")}` : "—";
  const fmtPct = (v) => v != null ? ` (${v >= 0 ? "+" : ""}${v.toFixed(2)}%)` : "";

  // ── TIRA MOBILE — solo cotizaciones en vivo ──
  const mkItem = (label, val, pct) => {
    const sign = pct > 0 ? "▲" : pct < 0 ? "▼" : "";
    const pctStr = pct != null ? ` ${sign}${Math.abs(pct).toFixed(2)}%` : "";
    return { label, val, pctStr, pos: pct > 0, neg: pct < 0 };
  };
  const tickerData = [
    dolar?.oficial?.venta     ? mkItem("USD Oficial",  fmt2(dolar.oficial.venta),    null)                                          : null,
    dolar?.bolsa?.venta       ? mkItem("USD MEP",      fmt2(dolar.bolsa.venta),       null)                                          : null,
    dolar?.contadoconliqui?.venta ? mkItem("CCL",      fmt2(dolar.contadoconliqui.venta), null)                                       : null,
    riesgoPais                ? mkItem("Riesgo País",  `${riesgoPais.valor} pb`,             null)                                          : null,
    liveMarket.mervalARS      ? mkItem("Merval",       `${liveMarket.mervalARS.value.toLocaleString("es-AR",{maximumFractionDigits:0})}`, liveMarket.mervalARS.changePct) : null,
    liveMarket.spy            ? mkItem("SPY",          `$${liveMarket.spy.price.toFixed(2)}`,  liveMarket.spy.changePct)                    : null,
    liveMarket.gold           ? mkItem("Oro",          `$${liveMarket.gold.price.toFixed(0)}`, liveMarket.gold.changePct)                   : null,
    liveMarket.brent          ? mkItem("Brent",        `$${liveMarket.brent.price.toFixed(2)}`,liveMarket.brent.changePct)                  : null,
  ].filter(Boolean);

  return (
    <div style={{ fontFamily:FB, background:t.bg, minHeight:"100vh", color:t.tx, transition:"background .3s, color .3s",
      paddingBottom: isMobile ? 72 : 0 }}>

      {/* ── HEADER ── */}
      <header style={{ background:t.hdr, borderBottom:`1px solid ${t.brd}`, position:"sticky", top:0, zIndex:100, boxShadow:t.sh }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 ${isMobile?12:20}px`, display:"flex", alignItems:"center", justifyContent:"space-between", height:isMobile?50:56, gap:isMobile?8:16 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", flexShrink:0, cursor:"pointer", userSelect:"none" }} onClick={handleLogoClick}>
            <div style={{
              fontFamily:FD,
              fontSize: isMobile ? 18 : 23,
              fontWeight: 700,
              color: logoC ? logoC.main : t.tx,
              letterSpacing: "-.02em",
              lineHeight: 1,
              transition: "color .4s ease",
              animation: logoSpin ? "logoSpin .5s cubic-bezier(.4,0,.2,1)" : "none",
            }}>
              The Big <span style={{ color: logoC ? logoC.accent : t.go, transition:"color .4s ease" }}>Long</span>
            </div>
          </div>

          {/* Nav — desktop only */}
          {!isMobile && (
            <nav style={{ display:"flex", gap:2, flexWrap:"nowrap" }}>
              {TABS.map(tb => (
                <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
                  padding:"6px 12px", borderRadius:8, border:"none", fontFamily:FB,
                  fontSize:11, fontWeight:tab===tb.id?700:400,
                  background:tab===tb.id?t.go+"18":"transparent",
                  color:tab===tb.id?t.go:t.mu,
                  cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:5,
                }}><tb.Icon size={13} strokeWidth={tab===tb.id?2.5:1.8} /> {tb.label}</button>
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
            <button onClick={()=>setDark(d=>!d)} style={{
              background:t.alt, border:`1px solid ${t.brd}`, borderRadius:8,
              padding:isMobile?"6px 10px":"6px 12px", fontFamily:FB, fontSize:12, color:t.mu, cursor:"pointer",
            }}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      <div style={{ background:t.tick, padding:"6px 0", overflow:"hidden", borderBottom:`1px solid rgba(255,255,255,.04)` }}>
        <div style={{ display:"flex", animation:"marquee 50s linear infinite", width:"max-content" }}>
          {[...tickerData, ...tickerData, ...tickerData].map((item, k) => (
            <span key={k} style={{ display:"inline-flex", alignItems:"center", gap:6, paddingRight:28, whiteSpace:"nowrap" }}>
              <span style={{ fontFamily:FB, fontSize:10, fontWeight:500, color:"rgba(255,255,255,.38)", letterSpacing:".06em", textTransform:"uppercase" }}>
                {item.label}
              </span>
              <span style={{ fontFamily:FB, fontSize:11, fontWeight:700,
                color: item.pos ? "#4ade80" : item.neg ? "#f87171" : "#e2e8f0" }}>
                {item.val}
              </span>
              {item.pctStr && (
                <span style={{ fontFamily:FB, fontSize:10, fontWeight:600,
                  color: item.pos ? "#4ade80" : item.neg ? "#f87171" : "#94a3b8" }}>
                  {item.pctStr}
                </span>
              )}
              <span style={{ color:"rgba(255,255,255,.15)", fontSize:10 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── ADMIN PIN PROMPT ── */}
      {adminPrompt && !admin && (
        <div style={{
          position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.6)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }} onClick={()=>{setAdminPrompt(false);setAdminPin("");}}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:t.srf, borderRadius:20, padding:"32px 36px", width:320,
            boxShadow:"0 24px 64px rgba(0,0,0,.3)", border:`1px solid ${t.brd}`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <Lock size={20} color={t.go} />
              <span style={{ fontFamily:FH, fontSize:18, fontWeight:700, color:t.tx }}>Admin</span>
            </div>
            <input
              type="password" placeholder="PIN de acceso"
              value={adminPin} onChange={e=>setAdminPin(e.target.value)}
              onKeyDown={e=>{
                if(e.key==="Enter"){
                  if(adminPin==="1243"){setAdmin(true);setAdminPrompt(false);setAdminPin("");}
                  else{setAdminPin("");}
                }
              }}
              autoFocus
              style={{
                width:"100%", padding:"12px 16px", borderRadius:12, fontFamily:FB, fontSize:14,
                border:`1.5px solid ${t.brd}`, background:t.alt, color:t.tx, outline:"none",
                letterSpacing:".15em", textAlign:"center",
              }}
            />
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={()=>{setAdminPrompt(false);setAdminPin("");}} style={{
                flex:1, padding:"10px", borderRadius:10, border:`1px solid ${t.brd}`,
                background:"transparent", fontFamily:FB, fontSize:12, color:t.mu, cursor:"pointer",
              }}>Cancelar</button>
              <button onClick={()=>{
                if(adminPin==="1243"){setAdmin(true);setAdminPrompt(false);setAdminPin("");}
                else{setAdminPin("");}
              }} style={{
                flex:1, padding:"10px", borderRadius:10, border:"none",
                background:t.go, fontFamily:FB, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer",
              }}>Ingresar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ── */}
      {admin && <AdminPanel onClose={()=>setAdmin(false)} onPublish={publishExtra} t={t} />}

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"16px 12px 40px":"28px 20px 60px" }}>

        {/* Extra published content */}
        {extra.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <SectionLabel t={t}>ÚLTIMO · ACTUALIZACIÓN EN VIVO</SectionLabel>
            {extra.map(item => (
              <Card key={item.id} t={t} style={{ marginBottom:12, borderLeft:`4px solid ${t.go}` }}>
                <div style={{ padding:"16px 20px", position:"relative" }}>
                  {admin && <button onClick={()=>removeExtra(item.id)} style={{ position:"absolute", top:12, right:12, background:t.rdBg, border:"none", borderRadius:6, padding:"3px 8px", color:t.rd, cursor:"pointer", fontSize:11, fontFamily:FB }}>Eliminar</button>}
                  <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginBottom:6 }}>{item.date} · {item.type?.toUpperCase()}</div>
                  <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:10 }}>{item.title}</h3>
                  {item.kpis?.length>0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                      {item.kpis.map((k,i) => <KpiChip key={i} item={k} t={t} />)}
                    </div>
                  )}
                  <div style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.75 }} dangerouslySetInnerHTML={{ __html:item.content }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab content */}
        <ErrorBoundary t={t} key={tab}>
        {tab==="inicio" && <InicioView dolar={dolar} riesgoPais={riesgoPais} fxError={fxError} t={t} setTab={setTab} goResearch={goResearch} isMobile={isMobile} clock={clock} liveMarket={liveMarket} />}
        {tab==="mercados" && <MercadosView dolar={dolar} riesgoPais={riesgoPais} fxError={fxError} liveMarket={liveMarket} t={t} />}
        {tab==="rentafija" && <InstrumentosView t={t} />}
        {tab==="rentavariable" && <RentaVariableView t={t} initialTicker={chartTickerGlobal} onTickerConsumed={()=>setChartTickerGlobal(null)} />}
        {tab==="productos" && <ProductosView t={t} />}
        {tab==="research" && <InformesView t={t} initialSub={researchSub} onSubChange={setResearchSub} />}
        </ErrorBoundary>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:t.ft, padding:"36px 20px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          <div style={{ display:"flex", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", flexDirection:isMobile?"column":"row", gap:isMobile?24:40, marginBottom:24 }}>

            {/* Brand */}
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontFamily:FD, fontSize:isMobile?28:36, fontWeight:700, color:t.ftT, letterSpacing:"-.02em", lineHeight:1 }}>The</span>
              <span style={{ fontFamily:FD, fontSize:isMobile?28:36, fontWeight:700, color:t.go, letterSpacing:"-.02em", lineHeight:1 }}>Big Long</span>
            </div>

            {/* Contact */}
            <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontFamily:FB, fontSize:15, fontWeight:600, color:t.ftT }}>{CONTACT.name}</div>
                <div style={{ fontFamily:FB, fontSize:11, fontWeight:300, color:"rgba(255,255,255,.35)" }}>{CONTACT.title}</div>
              </div>
              <div style={{ display:"flex", gap:16 }}>
                <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")} target="_blank" rel="noreferrer" style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Phone size={14} /> {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} style={{ fontFamily:FB, fontSize:13, fontWeight:500, color:t.go, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                  <Mail size={14} /> {CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,.06)", marginBottom:16 }} />

          {/* Bottom row */}
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

      {/* ── AI CHAT WIDGET ── */}
      <AIChatWidget t={t} isMobile={isMobile} />

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <div className="mobile-bottom-nav" style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          background:t.hdr, borderTop:`1px solid ${t.brd}`,
          display:"flex", justifyContent:"space-around", alignItems:"center",
          padding:"6px 0 env(safe-area-inset-bottom, 8px)",
          backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        }}>
          {TABS.map(tb => {
            const active = tab === tb.id;
            return (
              <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                padding:"4px 8px", color:active?t.go:t.mu, transition:"color .15s",
                minWidth:0,
              }}>
                <tb.Icon size={18} strokeWidth={active?2.5:1.5} />
                <span style={{ fontFamily:FB, fontSize:9, fontWeight:active?700:400 }}>{tb.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
