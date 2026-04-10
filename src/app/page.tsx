import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { name: "Sandaletler", slug: "sandaletler", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=85" },
  { name: "Topuklu", slug: "topuklu-ayakkabi", image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=85" },
  { name: "Bot & Çizme", slug: "bot", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85" },
  { name: "Sneakers", slug: "sneakers", image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&q=85" },
  { name: "Çanta", slug: "canta", image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&q=85" },
  { name: "Aksesuar", slug: "aksesuar", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=85" },
];

export default async function Home() {
  const [bestsellers, newProducts] = await Promise.all([
    prisma.product.findMany({ where: { active: true, isBestseller: true }, take: 4, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { active: true, isNew: true }, take: 4, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[560px] bg-gray-100 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=85"
          alt="Ülkü Yaman Collection"
          fill className="object-cover object-center" priority sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20">
          <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4">Yeni Koleksiyon</p>
          <h1 className="text-white text-5xl md:text-7xl font-light leading-tight max-w-lg">
            Hakiki<br /><span className="font-semibold">Deri ile</span><br />Şıklık
          </h1>
          <p className="text-white/80 mt-5 max-w-sm text-base leading-relaxed">
            El işçiliğiyle üretilen hakiki deri koleksiyonumuz şimdi yayında.
          </p>
          <div className="flex gap-4 mt-8 flex-wrap">
            <Link href="/kategori/sandaletler" className="bg-white text-black px-8 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-gray-100 transition-colors">
              Koleksiyonu Keşfet
            </Link>
            <Link href="/hakkimizda" className="border border-white text-white px-8 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-white/10 transition-colors">
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { label: "Ücretsiz Kargo", sub: "250₺ üzeri siparişlerde" },
            { label: "90 Gün İade", sub: "Koşulsuz iade garantisi" },
            { label: "Hakiki Deri", sub: "Sertifikalı malzeme" },
            { label: "7/24 Destek", sub: "+90 507 453 01 66" },
          ].map((item) => (
            <div key={item.label} className="text-center py-6 px-4">
              <p className="text-sm font-semibold tracking-wide">{item.label}</p>
              <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-2">Keşfet</p>
            <h2 className="text-3xl font-light">Kategoriler</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.slug} href={`/kategori/${cat.slug}`}
              className={`group relative overflow-hidden bg-gray-100 ${i === 0 ? "md:col-span-2" : ""}`}>
              <div className={`relative ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                <div className="absolute bottom-6 left-6">
                  <h3 className={`text-white font-semibold tracking-wide ${i === 0 ? "text-2xl" : "text-lg"}`}>{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      {bestsellers.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-2">En Çok Tercih Edilenler</p>
                <h2 className="text-3xl font-light">Çok Satanlar</h2>
              </div>
              <Link href="/kategori/sandaletler" className="text-sm tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* BANNER */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1600&q=85" alt="Koleksiyon" fill className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/70 text-xs tracking-[0.4em] uppercase mb-3">Ülkü Yaman Collection</p>
          <h2 className="text-white text-4xl md:text-6xl font-light mb-4">Hakiki Deri</h2>
          <p className="text-white/80 text-sm mb-8 max-w-xs">Manisa&apos;nın köklü deri ustalarından, ayağınıza özel üretim.</p>
          <Link href="/kategori/sandaletler" className="border border-white text-white px-10 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors font-semibold">
            Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-2">Yeni Gelenler</p>
              <h2 className="text-3xl font-light">Yeni Koleksiyon</h2>
            </div>
            <Link href="/kategori/sandaletler" className="text-sm tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
              Tümünü Gör <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* MATERIAL STORY */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-gray-100">
            <Image src="https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&q=85" alt="Hakiki Deri" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="bg-stone-50 flex flex-col justify-center px-10 md:px-16 py-16">
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">Fark Yaratanlar</p>
            <h2 className="text-4xl font-light leading-snug mb-6">Hakiki Deri.<br /><span className="font-semibold">Gerçek Kalite.</span></h2>
            <p className="text-gray-600 leading-relaxed text-sm mb-8">
              Ülkü Yaman Collection olarak her ürünümüzü sertifikalı hakiki deri ile üretiyoruz.
              El işçiliğinin ustalığı ve modern tasarımın zarafetini bir araya getirerek ayağınıza mükemmeliyeti sunuyoruz.
            </p>
            <ul className="space-y-3 mb-8">
              {["Sertifikalı hakiki deri malzeme", "14 gün değişim garantisi", "90 gün koşulsuz iade", "Türk ustalığı, uluslararası kalite"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/hakkimizda" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase border-b border-black pb-1 hover:opacity-60 transition-opacity w-fit">
              Hikayemizi Okuyun <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
