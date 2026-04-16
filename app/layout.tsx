import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppThemeProvider } from "@/lib/theme-context";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Big Long — Finanzas Argentinas",
  description: "Dashboard financiero: CEDEARs, Renta Fija, Mercados, Research y más.",
  keywords: ["finanzas", "argentina", "cedears", "renta fija", "dolar", "merval", "lecap"],
  openGraph: {
    title: "The Big Long",
    description: "Dashboard financiero para el inversor argentino",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppThemeProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </AppThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
