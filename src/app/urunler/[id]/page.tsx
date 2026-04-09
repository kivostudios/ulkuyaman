import { notFound } from "next/navigation";
import Image from "next/image";
import { products, getProductById, categories } from "@/lib/data";
import AddToCart from "./AddToCart";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: product ? `${product.name} | Ülkü Yaman Collection` : "Ürün",
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const cat = categories.find((c) => c.slug === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const sizes = ["36", "37", "38", "39", "40", "41"];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-8 flex gap-2">
        <a href="/" className="hover:text-black">Anasayfa</a>
        <span>/</span>
        <a href={`/kategori/${product.category}`} className="hover:text-black">
          {cat?.name || product.category}
        </a>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {product.images.map((img, i) => (
            <div
              key={i}
              className={`relative img-hover bg-gray-100 ${
                i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="sticky top-24 self-start">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.isNew && (
              <span className="text-xs tracking-widest uppercase bg-black text-white px-3 py-1">
                Yeni
              </span>
            )}
            {product.isBestseller && (
              <span className="text-xs tracking-widest uppercase border border-black px-3 py-1">
                Çok Satan
              </span>
            )}
          </div>

          <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-2">
            {product.material}
          </p>
          <h1 className="text-2xl md:text-3xl font-light leading-snug mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">
              ₺{product.price.toLocaleString("tr-TR")}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₺{product.originalPrice.toLocaleString("tr-TR")}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">
              Renk — <span className="text-black">{product.colors[0]}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className="text-xs border border-gray-200 px-3 py-1.5 hover:border-black transition-colors first:border-black"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs tracking-widest uppercase text-gray-600">Numara</p>
              <button className="text-xs text-gray-400 underline hover:text-black">
                Numara Rehberi
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="border border-gray-200 py-2 text-sm hover:border-black transition-colors first:bg-black first:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <AddToCart product={product} />

          {/* Description */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          <div className="mt-6 border-t border-gray-100 pt-6 space-y-3">
            {[
              "Hakiki deri üretim",
              "250₺ üzeri siparişlerde ücretsiz kargo",
              "90 gün koşulsuz iade",
              "14 gün değişim garantisi",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-1">Aynı Kategoriden</p>
              <h2 className="text-2xl font-light">Benzer Ürünler</h2>
            </div>
            <Link href={`/kategori/${product.category}`} className="text-sm tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
              Tümünü Gör <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
