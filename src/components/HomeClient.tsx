"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/lib/locale-store";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  image: string | null;
};

type Props = {
  newArrivals: CardProduct[];
  bestsellers: CardProduct[];
};

const dict = {
  tr: {
    campaign: "Bahar / Yaz 2026 Kampanyası",
    aboutHeading: "ÜLKÜ YAMAN HAKKINDA",
    aboutBody:
      "Ülkü Yaman Collection, gündelik fonksiyon içinde heykelsi formu araştıran ayakkabı ve çantalar tasarlar. Manisa'daki atölyemizde, sertifikalı hakiki deri ile bağımsız ustalar tarafından elle üretilir. Sade, ölçülü, ama ayırt edilebilir bir estetiği savunuyoruz — modern hayatın ritmiyle doğal şekilde hareket eden parçalar.",
    newArrivals: "YENİ GELENLER",
    bestsellers: "ÇOK SATANLAR",
    shopAll: "TÜMÜ",
    atelierTitle: "ATÖLYE — MANİSA",
    atelierCta: "KEŞFET",
    categoriesHeading: "KOLEKSİYONU KEŞFET",
    cats: [
      { tr: "TÜM SANDALETLER", slug: "sandaletler", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=92", cta: "Tümünü İncele", href: "/sandaletler" },
      { tr: "YENİ GELENLER", slug: "yeni", image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1200&q=92", cta: "Yeni Sezon", href: "/sandaletler?yeni=1" },
      { tr: "İNDİRİM", slug: "indirim", image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1200&q=92", cta: "Fırsatları Gör", href: "/sandaletler?indirim=1" },
    ],
    journalHeading: "GÜNCE",
    journalBody:
      "Atölye notları, sezon kampanyaları ve sınırlı sayıda üretilen parçalardan ilk siz haberdar olun.",
    journalCta: "DEVAMINI OKU",
    newsletterHeading: "BÜLTEN",
    newsletterBody:
      "Yeni siluetler, özel davetler ve atölye haberleri için listemize katılın.",
    emailPh: "E-posta adresiniz",
    subscribe: "ABONE OL",
    noProducts: "Henüz ürün yok.",
  },
  en: {
    campaign: "Spring / Summer 2026 Campaign",
    aboutHeading: "ABOUT ÜLKÜ YAMAN",
    aboutBody:
      "Ülkü Yaman Collection designs footwear and handbags that explore sculptural form through everyday function. Handmade in our Manisa atelier with certified genuine leather by independent artisans. We stand for an understated yet recognisable aesthetic — pieces that move naturally with the rhythm of modern life.",
    newArrivals: "NEW ARRIVALS",
    bestsellers: "BESTSELLERS",
    shopAll: "SHOP ALL",
    atelierTitle: "THE ATELIER — MANISA",
    atelierCta: "DISCOVER",
    categoriesHeading: "EXPLORE THE COLLECTION",
    cats: [
      { tr: "ALL SANDALS", slug: "sandaletler", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=92", cta: "Shop All", href: "/sandaletler" },
      { tr: "NEW IN", slug: "yeni", image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1200&q=92", cta: "New Season", href: "/sandaletler?yeni=1" },
      { tr: "SALE", slug: "indirim", image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1200&q=92", cta: "Shop Sale", href: "/sandaletler?indirim=1" },
    ],
    journalHeading: "THE JOURNAL",
    journalBody:
      "Be the first to hear about atelier notes, seasonal campaigns and limited-run pieces.",
    journalCta: "READ MORE",
    newsletterHeading: "NEWSLETTER",
    newsletterBody:
      "Join our list for new silhouettes, private invitations and atelier news.",
    emailPh: "Your email",
    subscribe: "SUBSCRIBE",
    noProducts: "No products yet.",
  },
} as const;

export default function HomeClient({ newArrivals, bestsellers }: Props) {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = dict[mounted ? locale : "tr"];

  const [tab, setTab] = useState<"new" | "best">("best");
  const tabItems = tab === "best" ? bestsellers : newArrivals;

  return (
    <div className="bg-white text-black">
      {/* ───────── HERO ───────── */}
      <section className="relative w-full">
        <div className="relative w-full aspect-[16/9] md:aspect-[2.4/1] min-h-[480px] md:min-h-[620px] bg-[#1a1410] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=2400&q=95"
            alt="Ülkü Yaman Collection — SS26"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="px-6 md:px-10 pt-8 pb-2">
          <h1 className="text-[15px] md:text-[16px] font-bold tracking-[0.2em] uppercase">
            {t.campaign}
          </h1>
        </div>
      </section>

      {/* ───────── ABOUT ───────── */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase mb-8">
            {t.aboutHeading}
          </h2>
          <p className="text-[15px] md:text-base leading-[1.9] text-black/85 max-w-3xl mx-auto">
            {t.aboutBody}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-20 md:mt-28">
          <div className="relative aspect-[4/5] bg-[#efece6] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&q=92"
              alt="Editorial portrait"
              fill
              sizes="50vw"
              className="object-cover grayscale"
            />
          </div>
          <div className="relative aspect-[4/5] bg-[#efece6] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1400&q=92"
              alt="Editorial portrait"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────── PRODUCT GRID + TABS ───────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase mb-6">
          {t.newArrivals}
        </h2>
        <div className="flex items-center gap-8 mb-10 md:mb-12">
          <button
            onClick={() => setTab("best")}
            className={`text-[13px] tracking-[0.18em] uppercase pb-1 transition-all ${
              tab === "best"
                ? "font-bold text-black border-b border-black"
                : "font-medium text-black/40 hover:text-black/70"
            }`}
          >
            {t.bestsellers}
          </button>
          <button
            onClick={() => setTab("new")}
            className={`text-[13px] tracking-[0.18em] uppercase pb-1 transition-all ${
              tab === "new"
                ? "font-bold text-black border-b border-black"
                : "font-medium text-black/40 hover:text-black/70"
            }`}
          >
            {t.shopAll}
          </button>
        </div>

        {tabItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
            {tabItems.map((p) => (
              <Link key={p.id} href={`/urunler/${p.id}`} className="group block">
                <div className="relative aspect-square bg-[#f3f1ed] overflow-hidden">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[12px] font-bold tracking-[0.15em] uppercase">
                    {p.name}
                  </p>
                  <p className="text-[12px] mt-1 text-black/80">
                    ₺{p.price.toLocaleString("tr-TR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/50 py-12 text-center">{t.noProducts}</p>
        )}

        <div className="flex items-center justify-center gap-6 mt-12">
          <button aria-label="Prev" className="text-black/30" disabled>
            <ChevronLeft size={22} strokeWidth={1.6} />
          </button>
          <button aria-label="Next" className="text-black hover:opacity-60 transition-opacity">
            <ChevronRight size={22} strokeWidth={1.6} />
          </button>
        </div>
      </section>

      {/* ───────── EDITORIAL BANNER ───────── */}
      <section className="relative w-full">
        <div className="relative w-full aspect-[16/9] md:aspect-[2.4/1] min-h-[420px] md:min-h-[560px] overflow-hidden bg-[#1a1410]">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=2400&q=95"
            alt={t.atelierTitle}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="px-6 md:px-10 pt-8 pb-2 flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="text-[15px] md:text-[16px] font-bold tracking-[0.2em] uppercase">
            {t.atelierTitle}
          </h2>
          <Link
            href="/hakkimizda"
            className="text-[12px] tracking-[0.2em] font-semibold uppercase border-b border-black pb-1 hover:opacity-60 transition-opacity"
          >
            {t.atelierCta}
          </Link>
        </div>
      </section>

      {/* ───────── CATEGORIES ───────── */}
      <section className="px-6 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32">
        <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase mb-10 md:mb-14">
          {t.categoriesHeading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          {t.cats.map((cat) => (
            <Link key={cat.slug} href={cat.href} className="group block">
              <div className="relative aspect-[4/5] bg-[#efece6] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.tr}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <p className="text-[13px] font-bold tracking-[0.18em] uppercase">
                  {cat.tr}
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/50 group-hover:text-black transition-colors">
                  {cat.cta} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── BESTSELLERS DEEP LINK ───────── */}
      {bestsellers.length > 0 && (
        <section className="px-6 md:px-10 pb-24 md:pb-32">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase">
              {t.bestsellers}
            </h2>
            <Link
              href="/sandaletler"
              className="text-[11px] tracking-[0.2em] uppercase font-semibold border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
            >
              {t.shopAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
            {bestsellers.map((p) => (
              <Link key={p.id} href={`/urunler/${p.id}`} className="group block">
                <div className="relative aspect-square bg-[#f3f1ed] overflow-hidden">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[12px] font-bold tracking-[0.15em] uppercase">
                    {p.name}
                  </p>
                  <p className="text-[12px] mt-1 text-black/80">
                    ₺{p.price.toLocaleString("tr-TR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ───────── JOURNAL + NEWSLETTER ───────── */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="border-t border-black/10 pt-20 md:pt-28 grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase mb-6">
              {t.journalHeading}
            </h2>
            <p className="text-[15px] leading-[1.9] text-black/85 max-w-md">
              {t.journalBody}
            </p>
            <Link
              href="/hakkimizda"
              className="inline-block mt-8 text-[12px] tracking-[0.2em] uppercase font-semibold border-b border-black pb-1 hover:opacity-60 transition-opacity"
            >
              {t.journalCta}
            </Link>
          </div>
          <div>
            <h2 className="text-[15px] font-bold tracking-[0.2em] uppercase mb-6">
              {t.newsletterHeading}
            </h2>
            <p className="text-[15px] leading-[1.9] text-black/85 max-w-md mb-8">
              {t.newsletterBody}
            </p>
            <form className="flex border-b border-black max-w-md">
              <input
                type="email"
                placeholder={t.emailPh}
                className="flex-1 bg-transparent text-[14px] placeholder:text-black/40 px-1 py-3 outline-none"
              />
              <button
                type="submit"
                className="text-[12px] tracking-[0.2em] uppercase font-semibold px-3 py-3 hover:opacity-60 transition-opacity"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
