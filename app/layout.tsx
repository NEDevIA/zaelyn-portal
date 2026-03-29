import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zaelyn — Tu segunda mente",
  description:
    "IA que recuerda lo que importa, conecta tus ideas y crece contigo. Sin logs. Sin vigilancia. Tu contexto, tu dispositivo.",
  keywords: ["IA", "privacidad", "segunda mente", "diario", "inteligencia artificial"],
  openGraph: {
    title: "Zaelyn — Tu segunda mente",
    description: "IA que recuerda lo que importa, sin vigilancia.",
    siteName: "Zaelyn",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`dark ${dmSans.variable} ${dmSerif.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
