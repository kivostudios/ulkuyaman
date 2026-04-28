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

    // Breadcrumbs / navigation
    home: "Anasayfa",
    sandals: "Sandaletler",
    products: "Ürünler",
    backToHome: "Anasayfaya dön",

    // Sandaletler list
    allSandals: "Tüm Sandaletler",
    searchResults: (q: string) => `"${q}" araması`,
    productCount: (n: number, plus: boolean) => `${n} ürün${plus ? "+" : ""}`,
    noProducts: "Bu filtreler için ürün bulunamadı.",
    noSearchResults: "Aramanızla eşleşen ürün bulunamadı.",
    clearFilters: "Filtreleri temizle",
    storyMeta:
      "Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri.",

    // ProductFilters
    filtersTitle: "Filtreler",
    quickFilters: "Hızlı Filtreler",
    fNew: "Yeni Gelenler",
    fSale: "İndirimde",
    fInStock: "Stokta",
    priceRange: "Fiyat",
    minPrice: "Min",
    maxPrice: "Max",
    color: "Renk",
    subcategory: "Model",
    apply: "Uygula",
    reset: "Sıfırla",

    // SortDropdown
    sortBy: "Sıralama",
    sortNewest: "Yeni",
    sortPriceAsc: "Fiyat: Düşükten Yükseğe",
    sortPriceDesc: "Fiyat: Yüksekten Düşüğe",
    sortPopular: "Popüler",

    // Product card
    badgeNew: "Yeni",
    badgeSale: "İndirim",
    badgeBestseller: "Çok Satan",
    addToWishlist: "Favorilere ekle",
    quickView: "İncele",

    // Product detail
    selectColor: "Renk",
    selectSizeLabel: "Numara",
    sizeGuide: "Numara Rehberi",
    similarProducts: "Benzer Ürünler",
    feature1: "Hakiki deri üretim",
    feature2: "250₺ üzeri ücretsiz kargo",
    feature3: "90 gün koşulsuz iade",
    feature4: "14 gün değişim garantisi",
    pleaseSelectSize: "Lütfen numara seçiniz",
    thisCombinationOos: "Bu kombinasyon stokta yok",

    // Cart
    cartTitle: "Sepet",
    cartEmpty: "Sepetiniz boş.",
    cartContinueShopping: "Alışverişe devam et",
    cartItemCount: (n: number) => `${n} ürün`,
    cartSubtotal: "Ara Toplam",
    cartShipping: "Kargo",
    cartShippingFree: "Ücretsiz",
    cartShippingFreeAt: (n: number) => `${n}₺ üzeri ücretsiz`,
    cartTotal: "Toplam",
    cartCheckout: "Ödemeye Geç",
    cartRemove: "Çıkar",
    cartIncrement: "Arttır",
    cartDecrement: "Azalt",
    cartShippingNote: (rem: number) =>
      `Kalan ${rem.toLocaleString("tr-TR")}₺ için ücretsiz kargo.`,

    // Checkout
    checkoutTitle: "Ödeme",
    addressSection: "Teslimat Adresi",
    addAddress: "Yeni Adres Ekle",
    selectAddress: "Adres Seçin",
    couponCode: "Kupon Kodu",
    couponPlaceholder: "Kuponu yapıştır",
    couponApply: "Uygula",
    couponApplied: "Uygulandı",
    couponRemove: "Kaldır",
    couponDiscount: "İndirim",
    paymentMethod: "Ödeme Yöntemi",
    iyzicoCard: "Kredi/Banka Kartı (iyzico)",
    agreementCheckbox:
      "Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni okudum, kabul ediyorum.",
    proceedToPay: "Ödemeye Geç",
    processingPayment: "Yönlendiriliyorsun…",
    orderSummary: "Sipariş Özeti",

    // Address form
    addrName: "Ad Soyad",
    addrPhone: "Telefon",
    addrTcKimlik: "T.C. Kimlik No",
    addrTcKimlikHint: "Fatura için zorunlu",
    addrCity: "İl",
    addrDistrict: "İlçe",
    addrAddress: "Adres",
    addrPostalCode: "Posta Kodu",
    addrIsDefault: "Varsayılan adres",
    addrSave: "Kaydet",

    // Account / hesabim
    accountTitle: "Hesabım",
    accountWelcome: (n: string) => `Merhaba, ${n}`,
    accountSignOut: "Çıkış Yap",
    sectionMyOrders: "Siparişlerim",
    sectionAddresses: "Adreslerim",
    sectionFavorites: "Favorilerim",
    noOrders: "Henüz sipariş yok.",
    noAddresses: "Kayıtlı adres yok.",
    noFavorites: "Henüz favoride ürün yok.",

    // Orders
    ordersTitle: "Siparişlerim",
    orderNumber: "Sipariş No",
    orderDate: "Tarih",
    orderStatus: "Durum",
    orderTotal: "Toplam",
    orderViewDetail: "Detay",
    statusPending: "Beklemede",
    statusPaymentFailed: "Ödeme Başarısız",
    statusPaid: "Ödendi",
    statusPreparing: "Hazırlanıyor",
    statusShipped: "Kargoda",
    statusDelivered: "Teslim Edildi",
    statusCancelled: "İptal Edildi",
    statusRefunded: "İade Edildi",
    trackingCarrier: "Kargo Şirketi",
    trackingNumber: "Takip No",
    trackOrder: "Kargo Takip",

    // Login
    loginTitle: "Hoş Geldiniz",
    loginSubtitle: "Hesabınıza giriş yapın veya üye olun",
    loginGoogle: "Google ile Giriş Yap",
    loginSecure: "güvenli giriş",
    loginConsent1: "Giriş yaparak",
    loginConsentPrivacy: "Gizlilik Politikamızı",
    loginConsentAnd: "ve",
    loginConsentTerms: "Kullanım Şartlarımızı",
    loginConsent2: "kabul etmiş olursunuz.",
    loginPerks: "Üye avantajları",
    loginPerk1: "Sipariş takibi ve geçmiş",
    loginPerk2: "Kayıtlı adresler",
    loginPerk3: "Favoriler listesi",
    loginPerk4: "Özel kampanya bildirimleri",

    // Misc
    notFoundTitle: "Sayfa bulunamadı",
    notFoundBody: "Aradığın sayfayı bulamadık. Bağlantı kırılmış olabilir.",
    cookieBannerText:
      "Sitemizin düzgün çalışması ve deneyiminizi iyileştirmek için çerezler kullanıyoruz.",
    cookieBannerAccept: "Kabul et",
    cookieBannerReject: "Reddet",
    cookieBannerSettings: "Ayarlar",
    cookieBannerLearn: "Çerez Politikası",
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

    home: "Home",
    sandals: "Sandals",
    products: "Products",
    backToHome: "Back to home",

    allSandals: "All Sandals",
    searchResults: (q: string) => `Results for "${q}"`,
    productCount: (n: number, plus: boolean) => `${n} product${n === 1 ? "" : "s"}${plus ? "+" : ""}`,
    noProducts: "No products match these filters.",
    noSearchResults: "No products match your search.",
    clearFilters: "Clear filters",
    storyMeta:
      "Handmade leather sandals for women, crafted in our Manisa atelier.",

    filtersTitle: "Filters",
    quickFilters: "Quick Filters",
    fNew: "New In",
    fSale: "On Sale",
    fInStock: "In Stock",
    priceRange: "Price",
    minPrice: "Min",
    maxPrice: "Max",
    color: "Colour",
    subcategory: "Style",
    apply: "Apply",
    reset: "Reset",

    sortBy: "Sort by",
    sortNewest: "Newest",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortPopular: "Popular",

    badgeNew: "New",
    badgeSale: "Sale",
    badgeBestseller: "Bestseller",
    addToWishlist: "Add to wishlist",
    quickView: "View",

    selectColor: "Colour",
    selectSizeLabel: "Size",
    sizeGuide: "Size guide",
    similarProducts: "You may also like",
    feature1: "Genuine leather",
    feature2: "Free shipping over ₺250",
    feature3: "90-day no-questions returns",
    feature4: "14-day exchange",
    pleaseSelectSize: "Please select a size",
    thisCombinationOos: "This combination is out of stock",

    cartTitle: "Bag",
    cartEmpty: "Your bag is empty.",
    cartContinueShopping: "Continue shopping",
    cartItemCount: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
    cartSubtotal: "Subtotal",
    cartShipping: "Shipping",
    cartShippingFree: "Free",
    cartShippingFreeAt: (n: number) => `Free over ₺${n}`,
    cartTotal: "Total",
    cartCheckout: "Checkout",
    cartRemove: "Remove",
    cartIncrement: "Increase",
    cartDecrement: "Decrease",
    cartShippingNote: (rem: number) =>
      `₺${rem.toLocaleString("en-US")} more for free shipping.`,

    checkoutTitle: "Checkout",
    addressSection: "Delivery Address",
    addAddress: "Add new address",
    selectAddress: "Select an address",
    couponCode: "Promo Code",
    couponPlaceholder: "Paste promo code",
    couponApply: "Apply",
    couponApplied: "Applied",
    couponRemove: "Remove",
    couponDiscount: "Discount",
    paymentMethod: "Payment Method",
    iyzicoCard: "Credit/Debit Card (iyzico)",
    agreementCheckbox:
      "I have read and accept the Pre-Information Form and Distance Sales Agreement.",
    proceedToPay: "Proceed to Pay",
    processingPayment: "Redirecting…",
    orderSummary: "Order Summary",

    addrName: "Full name",
    addrPhone: "Phone",
    addrTcKimlik: "T.R. ID No.",
    addrTcKimlikHint: "Required for invoice",
    addrCity: "City",
    addrDistrict: "District",
    addrAddress: "Address",
    addrPostalCode: "Postal code",
    addrIsDefault: "Set as default",
    addrSave: "Save",

    accountTitle: "Account",
    accountWelcome: (n: string) => `Hello, ${n}`,
    accountSignOut: "Sign out",
    sectionMyOrders: "My Orders",
    sectionAddresses: "Addresses",
    sectionFavorites: "Favorites",
    noOrders: "No orders yet.",
    noAddresses: "No saved addresses.",
    noFavorites: "No favorites yet.",

    ordersTitle: "My Orders",
    orderNumber: "Order #",
    orderDate: "Date",
    orderStatus: "Status",
    orderTotal: "Total",
    orderViewDetail: "Details",
    statusPending: "Pending",
    statusPaymentFailed: "Payment Failed",
    statusPaid: "Paid",
    statusPreparing: "Preparing",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    statusRefunded: "Refunded",
    trackingCarrier: "Carrier",
    trackingNumber: "Tracking No.",
    trackOrder: "Track parcel",

    loginTitle: "Welcome",
    loginSubtitle: "Sign in to your account or join us",
    loginGoogle: "Sign in with Google",
    loginSecure: "secure login",
    loginConsent1: "By signing in you accept our",
    loginConsentPrivacy: "Privacy Policy",
    loginConsentAnd: "and",
    loginConsentTerms: "Terms of Service",
    loginConsent2: ".",
    loginPerks: "Member perks",
    loginPerk1: "Order tracking and history",
    loginPerk2: "Saved addresses",
    loginPerk3: "Favorites list",
    loginPerk4: "Exclusive campaign updates",

    notFoundTitle: "Page not found",
    notFoundBody: "We couldn't find the page you're looking for.",
    cookieBannerText:
      "We use cookies to make our site work properly and to improve your experience.",
    cookieBannerAccept: "Accept",
    cookieBannerReject: "Reject",
    cookieBannerSettings: "Settings",
    cookieBannerLearn: "Cookie Policy",
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
