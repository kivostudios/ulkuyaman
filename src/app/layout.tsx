import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import "./globals.css";
import "./landing.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import CookieBanner from "@/components/CookieBanner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.ulkuyamancollection.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ülkü Yaman Collection | El Yapımı Hakiki Deri Kadın Sandaletleri",
    template: "%s | Ülkü Yaman Collection",
  },
  description:
    "Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri. Sade, dayanıklı, ayırt edilebilir tasarımlar. Türkiye geneline hızlı kargo.",
  keywords: [
    "hakiki deri sandalet",
    "kadın sandaleti",
    "el yapımı sandalet",
    "deri sandalet",
    "manisa",
    "ülkü yaman",
  ],
  openGraph: {
    title: "Ülkü Yaman Collection",
    description: "El Yapımı Hakiki Deri Kadın Sandaletleri",
    locale: "tr_TR",
    type: "website",
    siteName: "Ülkü Yaman Collection",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ülkü Yaman Collection",
    description: "El Yapımı Hakiki Deri Kadın Sandaletleri",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${interTight.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
