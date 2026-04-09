export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  colors: string[];
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  material: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
};

export const categories: Category[] = [
  { id: "1", name: "Sandaletler", slug: "sandaletler", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", count: 75 },
  { id: "2", name: "Topuklu Ayakkabı", slug: "topuklu-ayakkabi", image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80", count: 32 },
  { id: "3", name: "Bot", slug: "bot", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", count: 18 },
  { id: "4", name: "Sneakers", slug: "sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", count: 24 },
  { id: "5", name: "Çanta", slug: "canta", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", count: 20 },
  { id: "6", name: "Aksesuar", slug: "aksesuar", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80", count: 15 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Hakiki Deri Klasik Sandalet",
    price: 1099,
    category: "sandaletler",
    colors: ["Taba", "Siyah", "Beyaz"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&q=80",
    ],
    isNew: false,
    isBestseller: true,
    material: "Hakiki Deri",
    description: "Günlük kullanım için ideal, hakiki deri üretim sandalet. Ayağınıza tam oturan yapısı ve dayanıklı tabanıyla uzun yürüyüşlerde bile konforu korur.",
  },
  {
    id: "2",
    name: "Topuklu Deri Sandalet",
    price: 949,
    category: "sandaletler",
    colors: ["Beyaz", "Bej", "Siyah"],
    images: [
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80",
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&q=80",
    ],
    isNew: true,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Şık topuklu tasarımı ve hakiki deri yapısıyla özel günlerinizde fark yaratın. Ergonomik tabanı sayesinde gün boyu rahatlık sunar.",
  },
  {
    id: "3",
    name: "Çapraz Bantlı Sandalet",
    price: 1099,
    category: "sandaletler",
    colors: ["Taba", "Kum"],
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    ],
    isNew: true,
    isBestseller: true,
    material: "Hakiki Deri",
    description: "Modern çapraz bant tasarımıyla sezon trendi sandalet. Hakiki deri üretimi ile uzun ömürlü kullanım sunar.",
  },
  {
    id: "4",
    name: "Comfort Düz Sandalet",
    price: 899,
    category: "sandaletler",
    colors: ["Bej", "Siyah", "Kahve"],
    images: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    ],
    isNew: false,
    isBestseller: true,
    material: "Hakiki Deri",
    description: "Yumuşak iç astarı ve anatomik tabanıyla bütün gün konfor sunan düz sandalet modeli.",
  },
  {
    id: "5",
    name: "Dolgu Taban Sandalet",
    price: 1199,
    category: "sandaletler",
    colors: ["Bej", "Siyah"],
    images: [
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&q=80",
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80",
    ],
    isNew: true,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Trend dolgu taban tasarımıyla boy uzatan ve şık görünüm sağlayan bu model, hakiki derinin kalitesini konforla birleştirir.",
  },
  {
    id: "6",
    name: "Minyon Topuklu Sandalet",
    price: 949,
    originalPrice: 1199,
    category: "topuklu-ayakkabi",
    colors: ["Beyaz", "Bej"],
    images: [
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    ],
    isNew: false,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "İnce ve zarif topuk yapısıyla şıklığınızı tamamlayan topuklu sandalet. Resmi davetler ve özel anlar için ideal.",
  },
  {
    id: "7",
    name: "Stiletto Topuklu",
    price: 1349,
    category: "topuklu-ayakkabi",
    colors: ["Siyah", "Kırmızı", "Bej"],
    images: [
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&q=80",
    ],
    isNew: true,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Klasik stiletto formunu modern yorumla buluşturan bu model, özel gecelerinizin vazgeçilmezi olacak.",
  },
  {
    id: "8",
    name: "Deri Ankle Bot",
    price: 1499,
    category: "bot",
    colors: ["Siyah", "Kahve", "Haki"],
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    ],
    isNew: false,
    isBestseller: true,
    material: "Hakiki Deri",
    description: "Kaliteli hakiki deri yapısı ve şık tasarımıyla her kombine uyum sağlayan ankle bot. Sonbahar ve kış sezonu için vazgeçilmez.",
  },
  {
    id: "9",
    name: "Yandan Lastikli Bot",
    price: 850,
    category: "bot",
    colors: ["Haki", "Siyah"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    isNew: false,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Pratik yandan lastik yapısıyla kolayca giyip çıkarabilirsiniz. Günlük kullanım için ideal, dayanıklı hakiki deri bot.",
  },
  {
    id: "10",
    name: "Deri Sneaker",
    price: 1299,
    category: "sneakers",
    colors: ["Beyaz", "Siyah", "Bej"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    isNew: true,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Spor şıklığı hakiki deri kalitesiyle birleştiren sneaker model. Günlük kullanım için mükemmel konfor sunar.",
  },
  {
    id: "11",
    name: "Deri Omuz Çantası",
    price: 1599,
    category: "canta",
    colors: ["Taba", "Siyah", "Bej"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    isNew: true,
    isBestseller: true,
    material: "Hakiki Deri",
    description: "Geniş iç hacmi ve şık tasarımıyla günlük kullanım için ideal hakiki deri omuz çantası.",
  },
  {
    id: "12",
    name: "Mini Deri Çanta",
    price: 1299,
    category: "canta",
    colors: ["Siyah", "Beyaz", "Kırmızı"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    isNew: false,
    isBestseller: false,
    material: "Hakiki Deri",
    description: "Kompakt tasarımı ile özel günlerinizin tamamlayıcısı. Hakiki deri mini çanta.",
  },
];

export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getBestsellers = () => products.filter((p) => p.isBestseller);

export const getNewProducts = () => products.filter((p) => p.isNew);
