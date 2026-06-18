export type EquityAssetType = "stock" | "cedear" | "etf" | "index";
export type EquityLogoStatus = "real_logo" | "provider_logo" | "mapped_logo" | "generated_fallback" | "unavailable";
export type EquityIdentityConfidence = "high" | "medium" | "low";

export interface EquityIdentity {
  localTicker: string;
  underlyingTicker: string;
  companyName: string;
  displayName: string;
  market: string;
  country: string;
  sector: string;
  industry: string;
  assetType: EquityAssetType;
  logoUrl: string | null;
  logoFallbackUrl: string | null;
  logoSource: string;
  logoStatus: EquityLogoStatus;
  identityConfidence: EquityIdentityConfidence;
  fallbackInitials: string;
}

type IdentitySeed = {
  underlyingTicker?: string;
  companyName?: string;
  displayName?: string;
  domain?: string;
  country?: string;
  sector?: string;
  industry?: string;
  assetType?: EquityAssetType;
  logoSource?: string;
  confidence?: EquityIdentityConfidence;
};

const DOMAIN_BY_TICKER: Record<string, string> = {
  AAPL:"apple.com",MSFT:"microsoft.com",GOOGL:"google.com",AMZN:"amazon.com",
  META:"meta.com",NVDA:"nvidia.com",TSLA:"tesla.com",NFLX:"netflix.com",
  JPM:"jpmorganchase.com",BAC:"bankofamerica.com",GS:"goldmansachs.com",
  V:"visa.com",MA:"mastercard.com",AMD:"amd.com",INTC:"intel.com",
  AVGO:"broadcom.com",ORCL:"oracle.com",ADBE:"adobe.com",CRM:"salesforce.com",
  QCOM:"qualcomm.com",IBM:"ibm.com",CSCO:"cisco.com",COST:"costco.com",
  WMT:"walmart.com",KO:"coca-cola.com",PEP:"pepsico.com",MCD:"mcdonalds.com",
  SBUX:"starbucks.com",NKE:"nike.com",DIS:"disney.com",
  XOM:"exxonmobil.com",CVX:"chevron.com",COP:"conocophillips.com",
  JNJ:"jnj.com",PFE:"pfizer.com",ABBV:"abbvie.com",UNH:"unitedhealthgroup.com",
  LLY:"lilly.com",ABT:"abbott.com",MRK:"merck.com",
  COIN:"coinbase.com",MSTR:"microstrategy.com",PLTR:"palantir.com",
  MELI:"mercadolibre.com",GLOB:"globant.com",BABA:"alibaba.com",
  SPGI:"spglobal.com",BX:"blackstone.com",KKR:"kkr.com",
  LMT:"lockheedmartin.com",NOC:"northropgrumman.com",RTX:"rtx.com",
  HON:"honeywell.com",BA:"boeing.com",CAT:"caterpillar.com",DE:"deere.com",
  HOOD:"robinhood.com",SCHW:"schwab.com",AMGN:"amgen.com",
  PYPL:"paypal.com",SNAP:"snap.com",UBER:"uber.com",SHOP:"shopify.com",
  TGT:"target.com",HD:"homedepot.com",LOW:"lowes.com",T:"att.com",
  VZ:"verizon.com",CMCSA:"comcast.com",TMUS:"t-mobile.com",
  GE:"ge.com",GEV:"gevernova.com",GM:"gm.com",F:"ford.com",
  DAL:"delta.com",UAL:"united.com",AAL:"aa.com",LUV:"southwest.com",
  MAR:"marriott.com",HLT:"hilton.com",BKNG:"bookingholdings.com",
  ABNB:"airbnb.com",DASH:"doordash.com",CMG:"chipotle.com",
  C:"citigroup.com",MS:"morganstanley.com",WFC:"wellsfargo.com",
  BLK:"blackrock.com",AXP:"americanexpress.com",COF:"capitalone.com",
  TSM:"tsmc.com",ASML:"asml.com",MU:"micron.com",TXN:"ti.com",
  NOW:"servicenow.com",PANW:"paloaltonetworks.com",CRWD:"crowdstrike.com",
  DDOG:"datadoghq.com",NET:"cloudflare.com",MDB:"mongodb.com",
  WDAY:"workday.com",SNOW:"snowflake.com",TEAM:"atlassian.com",
  ZS:"zscaler.com",ROKU:"roku.com",SPOT:"spotify.com",
  RBLX:"roblox.com",EA:"ea.com",TTWO:"take2games.com",
  PG:"pg.com",CL:"colgatepalmolive.com",KMB:"kimberly-clark.com",
  MO:"altria.com",PM:"pmi.com",EL:"esteelauder.com",
  TMO:"thermofisher.com",DHR:"danaher.com",ISRG:"intuitive.com",
  MDT:"medtronic.com",BMY:"bms.com",GILD:"gilead.com",
  REGN:"regeneron.com",VRTX:"vrtx.com",BIIB:"biogen.com",
  BRK_B:"berkshirehathaway.com",BRKB:"berkshirehathaway.com",
};

const CURATED_IDENTITY: Record<string, IdentitySeed> = {
  MERV: { companyName:"Indice Merval", displayName:"Merval", country:"Argentina", sector:"Indice", industry:"Equity index", assetType:"index", confidence:"medium" },
  YPF:  { companyName:"YPF S.A.", domain:"ypf.com", country:"Argentina", sector:"Energia", industry:"Integrated oil & gas", confidence:"high" },
  YPFD: { underlyingTicker:"YPF", companyName:"YPF S.A.", domain:"ypf.com", country:"Argentina", sector:"Energia", industry:"Integrated oil & gas", confidence:"high" },
  GGAL: { companyName:"Grupo Financiero Galicia", domain:"galicia.ar", country:"Argentina", sector:"Financiero", industry:"Banking", confidence:"high" },
  BMA:  { companyName:"Banco Macro", domain:"macro.com.ar", country:"Argentina", sector:"Financiero", industry:"Banking", confidence:"high" },
  BBAR: { companyName:"BBVA Argentina", domain:"bbva.com.ar", country:"Argentina", sector:"Financiero", industry:"Banking", confidence:"high" },
  SUPV: { companyName:"Grupo Supervielle", domain:"supervielle.com.ar", country:"Argentina", sector:"Financiero", industry:"Banking", confidence:"high" },
  PAM:  { companyName:"Pampa Energia", domain:"pampaenergia.com", country:"Argentina", sector:"Energia", industry:"Power / utilities", confidence:"high" },
  PAMP: { underlyingTicker:"PAM", companyName:"Pampa Energia", domain:"pampaenergia.com", country:"Argentina", sector:"Energia", industry:"Power / utilities", confidence:"high" },
  CEPU: { companyName:"Central Puerto", domain:"centralpuerto.com", country:"Argentina", sector:"Energia", industry:"Power generation", confidence:"high" },
  EDN:  { companyName:"Edenor", domain:"edenor.com", country:"Argentina", sector:"Utilities", industry:"Electric distribution", confidence:"high" },
  TGS:  { companyName:"Transportadora de Gas del Sur", domain:"tgs.com.ar", country:"Argentina", sector:"Energia", industry:"Gas midstream", confidence:"high" },
  TGSU2:{ underlyingTicker:"TGS", companyName:"Transportadora de Gas del Sur", domain:"tgs.com.ar", country:"Argentina", sector:"Energia", industry:"Gas midstream", confidence:"high" },
  VIST: { companyName:"Vista Energy", domain:"vistaenergy.com", country:"Argentina", sector:"Energia", industry:"Oil & gas E&P", confidence:"high" },
  LOMA: { companyName:"Loma Negra", domain:"lomanegra.com", country:"Argentina", sector:"Materiales", industry:"Cement", confidence:"high" },
  GLOB: { companyName:"Globant", domain:"globant.com", country:"Argentina", sector:"Tecnologia", industry:"IT services", confidence:"high" },
  CRESY:{ companyName:"Cresud", domain:"cresud.com.ar", country:"Argentina", sector:"Real estate", industry:"Agribusiness / real estate", confidence:"high" },
  IRS:  { companyName:"IRSA", domain:"irsa.com.ar", country:"Argentina", sector:"Real estate", industry:"Real estate", confidence:"high" },
  TX:   { companyName:"Ternium", domain:"ternium.com", country:"Argentina", sector:"Materiales", industry:"Steel", confidence:"high" },
  TXAR: { underlyingTicker:"TX", companyName:"Ternium Argentina", domain:"ternium.com", country:"Argentina", sector:"Materiales", industry:"Steel", confidence:"high" },
  ALUA: { companyName:"Aluar", domain:"aluar.com.ar", country:"Argentina", sector:"Materiales", industry:"Aluminum", confidence:"high" },
  COME: { companyName:"Sociedad Comercial del Plata", domain:"scp.com.ar", country:"Argentina", sector:"Holding", industry:"Diversified holding", confidence:"medium" },
  MIRG: { companyName:"Mirgor", domain:"mirgor.com.ar", country:"Argentina", sector:"Industrial", industry:"Manufacturing", confidence:"high" },
  TRAN: { companyName:"Transener", domain:"transener.com.ar", country:"Argentina", sector:"Utilities", industry:"Electric transmission", confidence:"high" },
  BYMA: { companyName:"Bolsas y Mercados Argentinos", domain:"byma.com.ar", country:"Argentina", sector:"Financiero", industry:"Exchange operator", confidence:"high" },
  VALO: { companyName:"Grupo Financiero Valores", domain:"grupovalores.com.ar", country:"Argentina", sector:"Financiero", industry:"Financial services", confidence:"medium" },
  METR: { companyName:"Metrogas", domain:"metrogas.com.ar", country:"Argentina", sector:"Utilities", industry:"Gas distribution", confidence:"high" },
  SPY:  { companyName:"SPDR S&P 500 ETF Trust", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"US broad market ETF", assetType:"etf", confidence:"high" },
  QQQ:  { companyName:"Invesco QQQ Trust", domain:"invesco.com", country:"Estados Unidos", sector:"ETF", industry:"US growth ETF", assetType:"etf", confidence:"high" },
  DIA:  { companyName:"SPDR Dow Jones Industrial Average ETF", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"US blue-chip ETF", assetType:"etf", confidence:"high" },
  IVV:  { companyName:"iShares Core S&P 500 ETF", domain:"ishares.com", country:"Estados Unidos", sector:"ETF", industry:"US broad market ETF", assetType:"etf", confidence:"high" },
  XLE:  { companyName:"Energy Select Sector SPDR Fund", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"Energy ETF", assetType:"etf", confidence:"high" },
  XLF:  { companyName:"Financial Select Sector SPDR Fund", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"Financials ETF", assetType:"etf", confidence:"high" },
  XLK:  { companyName:"Technology Select Sector SPDR Fund", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"Technology ETF", assetType:"etf", confidence:"high" },
  XLV:  { companyName:"Health Care Select Sector SPDR Fund", domain:"ssga.com", country:"Estados Unidos", sector:"ETF", industry:"Health care ETF", assetType:"etf", confidence:"high" },
  GLD:  { companyName:"SPDR Gold Shares", domain:"spdrgoldshares.com", country:"Estados Unidos", sector:"ETF", industry:"Gold ETF", assetType:"etf", confidence:"high" },
  SLV:  { companyName:"iShares Silver Trust", domain:"ishares.com", country:"Estados Unidos", sector:"ETF", industry:"Silver ETF", assetType:"etf", confidence:"high" },
  EWZ:  { companyName:"iShares MSCI Brazil ETF", domain:"ishares.com", country:"Estados Unidos", sector:"ETF", industry:"Brazil ETF", assetType:"etf", confidence:"high" },
  SMH:  { companyName:"VanEck Semiconductor ETF", domain:"vaneck.com", country:"Estados Unidos", sector:"ETF", industry:"Semiconductors ETF", assetType:"etf", confidence:"high" },
  ARKK: { companyName:"ARK Innovation ETF", domain:"ark-funds.com", country:"Estados Unidos", sector:"ETF", industry:"Innovation ETF", assetType:"etf", confidence:"high" },
  TLT:  { companyName:"iShares 20+ Year Treasury Bond ETF", domain:"ishares.com", country:"Estados Unidos", sector:"ETF", industry:"Treasury ETF", assetType:"etf", confidence:"high" },
};

function normalizeTicker(ticker: string): string {
  return ticker.trim().toUpperCase().replace(".", "_").replace("/", "_");
}

function providerLogoUrl(symbol: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
}

function domainLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

function fallbackInitials(ticker: string, name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return ticker.replace(/[^A-Z0-9]/g, "").slice(0, 3).toUpperCase() || "EQ";
}

export function resolveEquityIdentity(input: {
  ticker: string;
  name?: string | null;
  market?: string | null;
  sector?: string | null;
  industry?: string | null;
  country?: string | null;
  assetType?: EquityAssetType | null;
}): EquityIdentity {
  const localTicker = input.ticker.trim().toUpperCase();
  const key = normalizeTicker(localTicker);
  const curated = CURATED_IDENTITY[key] ?? CURATED_IDENTITY[localTicker];
  const underlyingTicker = curated?.underlyingTicker ?? localTicker;
  const underlyingKey = normalizeTicker(underlyingTicker);
  const domain = curated?.domain ?? DOMAIN_BY_TICKER[underlyingKey] ?? DOMAIN_BY_TICKER[localTicker];
  const companyName = curated?.companyName ?? input.name ?? localTicker;
  const displayName = curated?.displayName ?? companyName;
  const assetType = curated?.assetType ?? input.assetType ?? (input.market === "ETF" ? "etf" : input.market === "CEDEAR" ? "cedear" : "stock");
  const logoUrl = domain ? domainLogoUrl(domain) : providerLogoUrl(underlyingTicker);
  const logoFallbackUrl = domain ? providerLogoUrl(underlyingTicker) : null;

  return {
    localTicker,
    underlyingTicker,
    companyName,
    displayName,
    market: input.market ?? "US",
    country: curated?.country ?? input.country ?? (input.market === "ARG" ? "Argentina" : "Estados Unidos"),
    sector: curated?.sector ?? input.sector ?? "Sin clasificar",
    industry: curated?.industry ?? input.industry ?? "No informado",
    assetType,
    logoUrl,
    logoFallbackUrl,
    logoSource: domain ? `domain:${domain}` : "financialmodelingprep:ticker-image",
    logoStatus: domain ? "mapped_logo" : "provider_logo",
    identityConfidence: curated?.confidence ?? (domain ? "high" : "medium"),
    fallbackInitials: fallbackInitials(localTicker, companyName),
  };
}

export function resolveEarningsLogo(symbol: string): { logo: string | null; companyDomain: string | null; logoFallback: string | null } {
  const identity = resolveEquityIdentity({ ticker: symbol });
  const domain = identity.logoSource.startsWith("domain:") ? identity.logoSource.slice("domain:".length) : null;
  return {
    logo: identity.logoUrl,
    companyDomain: domain,
    logoFallback: identity.logoFallbackUrl,
  };
}
