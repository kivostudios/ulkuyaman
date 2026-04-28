// Merkezi i18n sözlük. Client component'ler `useT()` ile sözlüğe erişir
// (zustand locale-store'dan locale okur). Server component'ler `tFor(locale)`
// kullanir; locale Navbar'in cookie'sinden okunmali (su an client-side toggle).
//
// Eklenecek key'ler: oncelik gore eklenir, eksik alanlar TR'ye fallback olur.

import { useLocale } from "./locale-store";

export type Locale = "tr" | "en";

export const I18N = {
  tr: {
    // Common
    addToCart: "SEPETE EKLE",
    added: "Sepete Eklendi",
    selectSize: "Lütfen numara seçiniz.",
    outOfStock: "Stokta yok",
    onlyXLeft: (n: number) => `Son ${n} adet — acele et`,
    free: "Ücretsiz",
    save: "Kaydet",
    cancel: "İptal",
    delete: "Sil",
    confirm: "Onayla",
    loading: "Yükleniyor…",
    soonAvailable: "Yakında",

    // Hero / homepage
    seasonEyebrow: "BAHAR / YAZ 2026",
    heroLine1: "Heykelsi siluetler,",
    heroLine2: "gündelik bir dilde.",
    heroMeta: "EL YAPIMI · MANİSA",
    heroMetaSep: "SERTİFİKALI HAKİKİ DERİ",
    heroCta: "KOLEKSİYONU GÖR",

    aboutEyebrow: "— ÜLKÜ YAMAN HAKKINDA",
    aboutTitle1: "Gündelik fonksiyonun içinde",
    aboutTitleEm: "heykelsi formu",
    aboutTitle2: "arayan ayakkabılar.",
    aboutBody:
      "Manisa'daki atölyemizde, sertifikalı hakiki deri ile bağımsız ustalar tarafından elle üretilir. Sade, ölçülü, ama ayırt edilebilir bir estetiği savunuyoruz — modern hayatın ritmiyle doğal şekilde hareket eden parçalar.",

    bestsellers: "ÇOK SATANLAR",
    newArrivals: "YENİ GELENLER",
    drag: "SÜRÜKLE",
    prev: "Önceki",
    next: "Sonraki",
    noProductsInTab: "Bu kategoride şu an gösterilecek ürün yok.",

    atelierEyebrow: "— YAPIM SÜRECİ",
    atelierTitle: "Üç usta, üç adım, bir çift.",
    atelierBadge: "ATÖLYE",
    atelierBadgeCity: "Manisa, Türkiye",
    atelierBadgeCoords: "41° kuzey · 27° doğu",
    atelierStep1Title: "DERİ SEÇİMİ",
    atelierStep1Body:
      "Sertifikalı tabakhanelerden gelen sebze tabaklı dana derisi. Her parça elle inceleniyor; doku, esneklik, renk uyumu için.",
    atelierStep2Title: "KESİM & ŞABLON",
    atelierStep2Body:
      "Heykelsi siluet, milimetrik şablonlarla başlıyor. Bir usta her gün yalnızca on çift kesebilir.",
    atelierStep3Title: "EL DİKİŞİ",
    atelierStep3Body:
      "Saten dikiş ve elle çakılan tabanlar — ayağa zamanla şekil veren, yumuşayan bir his. Manisa'da, üç ustanın imzasıyla.",
    atelierCta: "ATÖLYEYİ KEŞFET",

    catsEyebrow: "— KOLEKSİYONU KEŞFET",
    catsTitle: "Üç giriş, bir koleksiyon.",
    cat1Sub: "01 — Koleksiyon",
    cat1Name: "TÜM SANDALETLER",
    cat1Cta: "Tümünü İncele",
    cat2Sub: "02 — SS26",
    cat2Name: "YENİ GELENLER",
    cat2Cta: "Yeni Sezon",
    cat3Sub: "03 — Sezon Sonu",
    cat3Name: "İNDİRİM",
    cat3Cta: "Fırsatları Gör",

    testimonialsEyebrow: "— MÜŞTERİLERİMİZ",

    journalEyebrow: "— GÜNCE",
    journalTitle: "Atölyeden notlar, sezon arasında.",
    journalBody:
      "Sezon kampanyaları, sınırlı sayıda üretilen parçalar ve atölye günlükleri için listemize katılın.",
    journalCta: "DEVAMINI OKU →",

    newsletterEyebrow: "— BÜLTEN",
    newsletterTitle: "Yeni siluetlere ilk siz erişin.",
    newsletterPlaceholder: "E-posta adresiniz",
    newsletterSent: "Listemize katıldınız ✓",
    newsletterCta: "ABONE OL",
    newsletterSentCta: "GÖNDERİLDİ",
    newsletterFineprint:
      "Üye olarak Gizlilik Politikamızı kabul etmiş olursunuz.",

    // Footer
    footerBrandBlurb:
      "Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri. Sade, dayanıklı, ayırt edilebilir.",
    footerShopHeading: "Alışveriş",
    footerHelpHeading: "Yardım",
    footerContactHeading: "İletişim",
    footerAllSandals: "Tüm Sandaletler",
    footerNewArrivals: "Yeni Gelenler",
    footerOnSale: "İndirimde",
    footerBestsellers: "Çok Satanlar",
    footerContactPage: "İletişim",
    footerAboutPage: "Hakkımızda",
    footerShippingReturns: "Teslimat & İade",
    footerDistanceContract: "Mesafeli Satış",
    footerCopyright: "Tüm hakları saklıdır.",
    footerPrivacy: "Gizlilik",
    footerKvkk: "KVKK",
    footerCookies: "Çerezler",
  },
  en: {
    addToCart: "ADD TO BAG",
    added: "Added to Bag",
    selectSize: "Please select a size.",
    outOfStock: "Out of stock",
    onlyXLeft: (n: number) => `Only ${n} left — hurry`,
    free: "Free",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm: "Confirm",
    loading: "Loading…",
    soonAvailable: "Coming soon",

    seasonEyebrow: "SPRING / SUMMER 2026",
    heroLine1: "Sculptural silhouettes,",
    heroLine2: "in an everyday language.",
    heroMeta: "HANDMADE · MANISA",
    heroMetaSep: "CERTIFIED REAL LEATHER",
    heroCta: "EXPLORE THE COLLECTION",

    aboutEyebrow: "— ABOUT ÜLKÜ YAMAN",
    aboutTitle1: "Footwear that searches for",
    aboutTitleEm: "sculptural form",
    aboutTitle2: "within everyday function.",
    aboutBody:
      "Handcrafted in our Manisa atelier from certified full-grain leather by independent artisans. We stand for a simple, considered, yet distinguishable aesthetic — pieces that move naturally with the rhythm of modern life.",

    bestsellers: "BESTSELLERS",
    newArrivals: "NEW IN",
    drag: "DRAG",
    prev: "Previous",
    next: "Next",
    noProductsInTab: "No products to show in this category right now.",

    atelierEyebrow: "— THE PROCESS",
    atelierTitle: "Three artisans, three steps, one pair.",
    atelierBadge: "ATELIER",
    atelierBadgeCity: "Manisa, Türkiye",
    atelierBadgeCoords: "41° N · 27° E",
    atelierStep1Title: "LEATHER SELECTION",
    atelierStep1Body:
      "Vegetable-tanned calfskin from certified tanneries. Each piece is inspected by hand for grain, suppleness and tonal harmony.",
    atelierStep2Title: "CUTTING & PATTERNING",
    atelierStep2Body:
      "The sculptural silhouette begins with millimetric patterns. A single artisan cuts only ten pairs per day.",
    atelierStep3Title: "HAND STITCHING",
    atelierStep3Body:
      "Saddle stitched seams and hand-laid soles — a feel that conforms to the foot and softens with time. Made in Manisa, signed by three artisans.",
    atelierCta: "DISCOVER THE ATELIER",

    catsEyebrow: "— DISCOVER THE COLLECTION",
    catsTitle: "Three entries, one collection.",
    cat1Sub: "01 — Collection",
    cat1Name: "ALL SANDALS",
    cat1Cta: "Browse All",
    cat2Sub: "02 — SS26",
    cat2Name: "NEW IN",
    cat2Cta: "New Season",
    cat3Sub: "03 — End of Season",
    cat3Name: "SALE",
    cat3Cta: "See Offers",

    testimonialsEyebrow: "— OUR CUSTOMERS",

    journalEyebrow: "— JOURNAL",
    journalTitle: "Notes from the atelier, between seasons.",
    journalBody:
      "Join the list for season campaigns, limited-run releases and atelier diaries.",
    journalCta: "READ MORE →",

    newsletterEyebrow: "— NEWSLETTER",
    newsletterTitle: "Be the first to see new silhouettes.",
    newsletterPlaceholder: "Your email address",
    newsletterSent: "You're on the list ✓",
    newsletterCta: "SUBSCRIBE",
    newsletterSentCta: "SENT",
    newsletterFineprint:
      "By subscribing you accept our Privacy Policy.",

    footerBrandBlurb:
      "Handmade leather sandals for women, crafted in our Manisa atelier. Simple, durable, distinguishable.",
    footerShopHeading: "Shop",
    footerHelpHeading: "Help",
    footerContactHeading: "Contact",
    footerAllSandals: "All Sandals",
    footerNewArrivals: "New In",
    footerOnSale: "On Sale",
    footerBestsellers: "Bestsellers",
    footerContactPage: "Contact",
    footerAboutPage: "About",
    footerShippingReturns: "Shipping & Returns",
    footerDistanceContract: "Distance Contract",
    footerCopyright: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerKvkk: "KVKK",
    footerCookies: "Cookies",
  },
};

export type Dict = (typeof I18N)["tr"];

export function tFor(locale: Locale): Dict {
  return I18N[locale] || I18N.tr;
}

// Client component'ler icin hook. Locale degisirse otomatik re-render olur.
export function useT(): { t: Dict; locale: Locale } {
  const { locale } = useLocale();
  return { t: tFor(locale), locale };
}
