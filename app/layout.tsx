import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Sans, DM_Serif_Display, DM_Mono, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300","400","500"], variable: "--font-dm-sans", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], style: ["normal","italic"], variable: "--font-dm-serif", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono", display: "swap" });
const syne = Syne({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-syne", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Zaelyn — Tu inteligencia personal",
  description: "Zaelyn aprende de ti, recuerda lo que importa y te acompaña en cada área de tu vida.",
  keywords: ["IA", "privacidad", "inteligencia personal", "diario", "inteligencia artificial"],
  openGraph: {
    title: "Zaelyn — Tu inteligencia personal",
    description: "Zaelyn aprende de ti, recuerda lo que importa y te acompaña en cada área de tu vida.",
    siteName: "Zaelyn",
    images: ["/og-image.png"],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable} ${syne.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var saved = localStorage.getItem('zae-theme');
            var theme = saved || (sys ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          } catch(e) {
            document.documentElement.setAttribute('data-theme','dark');
            document.documentElement.classList.add('dark');
          }
        `}} />
      </head>
      {/* Suspense wraps all pages — required for useSearchParams() in child components */}
      <body><Suspense>{children}</Suspense></body>
    </html>
  );
}
