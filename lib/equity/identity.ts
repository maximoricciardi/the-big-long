export type EquityAssetType = "stock" | "cedear" | "etf" | "index" | "private_market_exposure" | "custom_instrument";
export type EquityLogoStatus = "official_logo" | "curated_logo" | "provider_verified_logo" | "issuer_logo" | "local_asset_logo" | "emergency_fallback" | "unavailable";
export type EquityLogoQuality = "verified_high_quality" | "verified_acceptable" | "issuer_acceptable" | "unverified" | "unavailable";
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
  logoQuality: EquityLogoQuality;
  logoNotes: string | null;
  logoBackground: string | null;
  officialDomain: string | null;
  identityConfidence: EquityIdentityConfidence;
  fallbackInitials: string;
}

type IdentitySeed = {
  underlyingTicker?: string;
  companyName?: string;
  displayName?: string;
  domain?: string;
  logoUrl?: string;
  country?: string;
  sector?: string;
  industry?: string;
  assetType?: EquityAssetType;
  logoSource?: string;
  logoStatus?: EquityLogoStatus;
  logoQuality?: EquityLogoQuality;
  logoNotes?: string;
  logoBackground?: string;
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
  SPCX:"spacex.com",BRK:"berkshirehathaway.com",ACN:"accenture.com",
  LIN:"linde.com",INTU:"intuit.com",UPS:"ups.com",
  SAP:"sap.com",NVO:"novonordisk.com",
  SHEL:"shell.com",TM:"toyota-global.com",PDD:"pddholdings.com",
  SE:"sea.com",RACE:"ferrari.com",SONY:"sony.com",HSBC:"hsbc.com",
  ELV:"elevancehealth.com",LRCX:"lamresearch.com",KLAC:"kla.com",
  ADP:"adp.com",MDLZ:"mondelezinternational.com",CB:"chubb.com",
  FI:"fiserv.com",MMC:"marshmclennan.com",CME:"cmegroup.com",
  ICE:"ice.com",WM:"wm.com",DUK:"duke-energy.com",APD:"airproducts.com",
  TTE:"totalenergies.com",UL:"unilever.com",AZN:"astrazeneca.com",
  SNY:"sanofi.com",RIO:"riotinto.com",
};

const FINNHUB_VERIFIED_LOGO_TICKERS = new Set([
  "GLOB","MELI","TX","MU","NVDA","AVGO","AMAT","AMD","INTC","QCOM",
  "AAPL","MSFT","AMZN","GOOGL","TSLA","NFLX","ADBE","ORCL","PLTR",
  "JPM","GS","BAC","MS","WFC","V","MA","AXP","XOM","CVX","GE","RTX",
  "CAT","UBER","LLY","JNJ","UNH","ABBV","PFE","AMGN","MRK","WMT","MCD",
  "KO","PEP","PG","COST","HD","NKE","DIS","BABA","IBM","NIO","COIN",
  "MSTR","NU","BRK.B","COP","EOG","OXY","SLB","HAL","DVN","LMT","NOC",
  "HON","BA","DE","MMM","ABT","MDT","CVS","BMY","CRWD","PANW","NET",
  "SNOW","NOW","DDOG","SBUX","TGT","CMG","LOW","YUM","BX","KKR","SCHW",
  "C","NEE","SO","T","VZ","CMCSA","SPCX","CRM","ACN","LIN","TMO","INTU",
  "TXN","ISRG","UPS","BKNG","BLK","SPGI","PDD","SE","SHOP","ABNB","PM",
  "MO","GILD","LRCX","KLAC","ADP","MDLZ","CB","MMC","CME","ICE","DUK",
  "APD","DHR","TMUS","MAR","HLT","PYPL","REGN","VRTX","ROKU","SPOT","EA",
  "TTWO","GM","F","DAL","UAL","AAL","LUV","COF","DASH","WDAY","ZS","MDB",
  "CL","EL","GD","HOOD",
]);

const FMP_VERIFIED_LOGO_TICKERS = new Set([
  "GGAL","BMA","BBAR","SUPV","YPF","PAM","CEPU","EDN","TGS","VIST","LOMA",
  "TEO","CRESY","IRS","ASML","TSM","ARM","META","GEV","VALE","PBR","BBD",
  "HUT","GPRK","NBIS","BITF","BRKB","CSCO","SAP","NVO","SHEL","TM","RACE",
  "SONY","HSBC","ELV","FI","WM","TEAM","TTE","UL","AZN","SNY","RIO","SPY",
  "QQQ","XLE","XLF","XLK","XLV","GLD","SLV","EWZ","SMH","EC","BRFS","DIA",
  "IVV","TLT","ILF","XLI","ARKK","AGRO",
]);

const LOGO_OVERRIDES: Record<string, Pick<IdentitySeed, "logoUrl" | "logoSource" | "logoStatus" | "logoQuality" | "logoNotes" | "logoBackground">> = {
  MERV: {
    logoUrl:"https://cdn.prod.website-files.com/6697a441a50c6b926e1972e0/682f4f060a306e6d3804523d_BYMA-isologo.svg",
    logoSource:"official:byma-press-kit",
    logoStatus:"official_logo",
    logoQuality:"verified_high_quality",
    logoNotes:"Index identity uses official BYMA press-kit isologo because Merval is an index, not an issuer.",
  },
  PAMP: {
    logoUrl:"https://financialmodelingprep.com/image-stock/PAM.png",
    logoSource:"financialmodelingprep:verified-logo:PAM",
    logoStatus:"curated_logo",
    logoQuality:"verified_acceptable",
    logoNotes:"Local ticker alias uses the verified Pampa Energia ADR logo.",
  },
  BRKB: {
    logoUrl:"https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/BRK.B.png",
    logoSource:"finnhub-static:verified-logo:BRK.B",
    logoStatus:"curated_logo",
    logoQuality:"verified_high_quality",
    logoNotes:"Normalizes BRKB to the Berkshire Hathaway B visual identity.",
  },
  TRAN: { logoUrl:"https://www.transener.com.ar/wp-content/uploads/2018/06/Transener-logo-1.png", logoSource:"official:transener.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  BYMA: { logoUrl:"https://cdn.prod.website-files.com/6697a441a50c6b926e1972e0/682f4f060a306e6d3804523d_BYMA-isologo.svg", logoSource:"official:byma-press-kit", logoStatus:"official_logo", logoQuality:"verified_high_quality" },
  VALO: { logoUrl:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo-VALO.svg", logoSource:"curated:wikimedia:Logo-VALO.svg", logoStatus:"curated_logo", logoQuality:"verified_acceptable" },
  ALUA: { logoUrl:"https://www.aluar.com.ar/footer/aluar-logo.svg", logoSource:"official:aluar.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  COME: { logoUrl:"https://www.scp.com.ar/img/logo_scp.svg", logoSource:"official:scp.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  MIRG: { logoUrl:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Mirgor_company_logo.png", logoSource:"curated:wikimedia:Mirgor_company_logo.png", logoStatus:"curated_logo", logoQuality:"verified_acceptable" },
  METR: { logoUrl:"https://www.metrogas.com.ar/assets/media/2022/08/metrogas-logo.svg", logoSource:"official:metrogas.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  TGNO4:{ logoUrl:"https://www.tgn.com.ar/assets/media/2023/12/TGN_logo_2023_50.png", logoSource:"official:tgn.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  HAVA: { logoUrl:"https://havanna.com.ar/images/logo.png?v=1.2", logoSource:"official:havanna.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  AUSO: { logoUrl:"https://back.ausol.com.ar/wp-content/uploads/2025/09/logo-sol-naranja.png", logoSource:"official:ausol.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable" },
  CAPX: { logoUrl:"https://capex.com.ar/wp-content/uploads/2023/11/logo-capex-blanco.svg", logoSource:"official:capex.com.ar", logoStatus:"official_logo", logoQuality:"verified_acceptable", logoBackground:"#0f172a" },
};

const CURATED_IDENTITY: Record<string, IdentitySeed> = {
  MERV: { companyName:"Indice Merval", displayName:"Merval", domain:"byma.com.ar", country:"Argentina", sector:"Indice", industry:"Equity index", assetType:"index", confidence:"high" },
  SPCX: { companyName:"SpaceX", displayName:"SpaceX", domain:"spacex.com", country:"Estados Unidos", sector:"Aeroespacial", industry:"Private space technology", assetType:"private_market_exposure", logoStatus:"official_logo", logoQuality:"verified_high_quality", confidence:"high" },
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
  CRES: { underlyingTicker:"CRESY", companyName:"Cresud", domain:"cresud.com.ar", country:"Argentina", sector:"Real estate", industry:"Agribusiness / real estate", confidence:"high" },
  CRESY:{ companyName:"Cresud", domain:"cresud.com.ar", country:"Argentina", sector:"Real estate", industry:"Agribusiness / real estate", confidence:"high" },
  IRSA: { underlyingTicker:"IRS", companyName:"IRSA", domain:"irsa.com.ar", country:"Argentina", sector:"Real estate", industry:"Real estate", confidence:"high" },
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
  TGNO4:{ companyName:"Transportadora de Gas del Norte", domain:"tgn.com.ar", country:"Argentina", sector:"Energia", industry:"Gas midstream", confidence:"high" },
  AGRO: { companyName:"Agrometal", domain:"agrometal.com", country:"Argentina", sector:"Industrial", industry:"Agricultural machinery", confidence:"medium" },
  HAVA: { companyName:"Havanna", domain:"havanna.com.ar", country:"Argentina", sector:"Consumo", industry:"Food retail", confidence:"high" },
  AUSO: { companyName:"Autopistas del Sol", domain:"ausol.com.ar", country:"Argentina", sector:"Infraestructura", industry:"Toll roads", confidence:"medium" },
  BOLT: { companyName:"Boldt", domain:"boldt.com.ar", country:"Argentina", sector:"Tecnologia", industry:"Technology services", confidence:"medium" },
  DGCU2:{ companyName:"Distribuidora de Gas Cuyana", domain:"ecogas.com.ar", country:"Argentina", sector:"Utilities", industry:"Gas distribution", confidence:"medium" },
  CAPX: { companyName:"Capex", domain:"capex.com.ar", country:"Argentina", sector:"Energia", industry:"Power / oil & gas", confidence:"high" },
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
  BRKB: { underlyingTicker:"BRK.B", companyName:"Berkshire Hathaway Inc. Class B", domain:"berkshirehathaway.com", country:"Estados Unidos", sector:"Financiero", industry:"Diversified holding company", confidence:"high" },
};

function normalizeTicker(ticker: string): string {
  return ticker.trim().toUpperCase().replace(".", "_").replace("/", "_");
}

function providerLogoUrl(symbol: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
}

function highQualityProviderLogoUrl(symbol: string): string {
  return `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${encodeURIComponent(symbol)}.png`;
}

function resolveLogo(localTicker: string, underlyingTicker: string, curated?: IdentitySeed) {
  const override = LOGO_OVERRIDES[localTicker] ?? LOGO_OVERRIDES[underlyingTicker];
  if (override?.logoUrl) {
    return {
      logoUrl: override.logoUrl,
      logoFallbackUrl: FMP_VERIFIED_LOGO_TICKERS.has(underlyingTicker) ? providerLogoUrl(underlyingTicker) : null,
      logoSource: override.logoSource ?? "curated:override",
      logoStatus: override.logoStatus ?? "curated_logo",
      logoQuality: override.logoQuality ?? "verified_high_quality",
      logoNotes: override.logoNotes ?? null,
      logoBackground: override.logoBackground ?? null,
    };
  }

  if (curated?.logoUrl) {
    return {
      logoUrl: curated.logoUrl,
      logoFallbackUrl: FMP_VERIFIED_LOGO_TICKERS.has(underlyingTicker) ? providerLogoUrl(underlyingTicker) : null,
      logoSource: curated.logoSource ?? "curated:remote",
      logoStatus: curated.logoStatus ?? "curated_logo",
      logoQuality: curated.logoQuality ?? "verified_high_quality",
      logoNotes: curated.logoNotes ?? null,
      logoBackground: curated.logoBackground ?? null,
    };
  }

  if (FINNHUB_VERIFIED_LOGO_TICKERS.has(underlyingTicker)) {
    return {
      logoUrl: highQualityProviderLogoUrl(underlyingTicker),
      logoFallbackUrl: FMP_VERIFIED_LOGO_TICKERS.has(underlyingTicker) ? providerLogoUrl(underlyingTicker) : null,
      logoSource: `finnhub-static:verified-logo:${underlyingTicker}`,
      logoStatus: "provider_verified_logo" as const,
      logoQuality: "verified_high_quality" as const,
      logoNotes: null,
      logoBackground: null,
    };
  }

  if (FMP_VERIFIED_LOGO_TICKERS.has(underlyingTicker) || FMP_VERIFIED_LOGO_TICKERS.has(localTicker)) {
    const symbol = FMP_VERIFIED_LOGO_TICKERS.has(underlyingTicker) ? underlyingTicker : localTicker;
    return {
      logoUrl: providerLogoUrl(symbol),
      logoFallbackUrl: FINNHUB_VERIFIED_LOGO_TICKERS.has(underlyingTicker) ? highQualityProviderLogoUrl(underlyingTicker) : null,
      logoSource: `financialmodelingprep:verified-logo:${symbol}`,
      logoStatus: "provider_verified_logo" as const,
      logoQuality: "verified_acceptable" as const,
      logoNotes: null,
      logoBackground: null,
    };
  }

  return {
    logoUrl: null,
    logoFallbackUrl: null,
    logoSource: "unavailable",
    logoStatus: "unavailable" as const,
    logoQuality: "unavailable" as const,
    logoNotes: "No approved visual identity source is configured for this ticker.",
    logoBackground: null,
  };
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
  const logo = resolveLogo(localTicker, underlyingTicker, curated);

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
    logoUrl: logo.logoUrl,
    logoFallbackUrl: logo.logoFallbackUrl,
    logoSource: logo.logoSource,
    logoStatus: logo.logoStatus,
    logoQuality: logo.logoQuality,
    logoNotes: logo.logoNotes,
    logoBackground: logo.logoBackground,
    officialDomain: domain ?? null,
    identityConfidence: curated?.confidence ?? (logo.logoQuality === "unavailable" ? "low" : domain ? "high" : "medium"),
    fallbackInitials: fallbackInitials(localTicker, companyName),
  };
}

export function resolveEarningsLogo(symbol: string): { logo: string | null; companyDomain: string | null; logoFallback: string | null } {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const identity = resolveEquityIdentity({ ticker: normalizedSymbol });
  if (identity.logoUrl) {
    return {
      logo: identity.logoUrl,
      companyDomain: identity.officialDomain,
      logoFallback: identity.logoFallbackUrl ?? providerLogoUrl(identity.underlyingTicker),
    };
  }

  return {
    logo: providerLogoUrl(normalizedSymbol),
    companyDomain: identity.officialDomain,
    logoFallback: highQualityProviderLogoUrl(normalizedSymbol),
  };
}
