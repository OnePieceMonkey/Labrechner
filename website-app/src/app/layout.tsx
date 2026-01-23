import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Labrechner – BEL-Abrechnung. Einfach. Aktuell.",
    template: "%s | Labrechner",
  },
  description:
    "BEL-Preise in Sekunden finden. Aktuelle Höchstpreise für alle 17 KZV-Regionen – immer aktuell für Dentallabore.",
  keywords: [
    "BEL",
    "BEL II",
    "Zahntechnik",
    "Dentallabor",
    "Abrechnung",
    "KZV",
    "Höchstpreise",
    "Zahntechniker",
  ],
  authors: [{ name: "Labrechner" }],
  creator: "Labrechner",
  metadataBase: new URL("https://labrechner.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://labrechner.de",
    siteName: "Labrechner",
    title: "Labrechner – BEL-Abrechnung. Einfach. Aktuell.",
    description:
      "BEL-Preise in Sekunden finden. Aktuelle Höchstpreise für alle 17 KZV-Regionen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Labrechner – BEL-Abrechnung. Einfach. Aktuell.",
    description:
      "BEL-Preise in Sekunden finden. Aktuelle Höchstpreise für alle 17 KZV-Regionen.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
