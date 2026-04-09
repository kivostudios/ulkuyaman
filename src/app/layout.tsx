import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ülkü Yaman Collection | Hakiki Deri Ayakkabı & Aksesuar",
  description:
    "Türkiye'nin seçkin hakiki deri ayakkabı ve aksesuar koleksiyonu. Sandalet, topuklu, bot, çanta ve daha fazlası. Manisa'dan Türkiye'ye hızlı kargo.",
  keywords: "hakiki deri sandalet, kadın ayakkabı, deri bot, türkiye, ülkü yaman",
  openGraph: {
    title: "Ülkü Yaman Collection",
    description: "Hakiki Deri Ayakkabı & Aksesuar",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
