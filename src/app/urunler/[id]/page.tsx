import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImageMeta } from "@/lib/image-meta";
import { getServerT } from "@/lib/locale-server";
import AddToCart from "./AddToCart";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    select: { name: true },
  });
  return { title: product ? `${product.name} | Ülkü Yaman` : "Ürün" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, active: true, deletedAt: null },
    include: { variants: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: id }, active: true, deletedAt: null },
    take: 4,
  });

  const { t } = await getServerT();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-8 flex gap-2">
        <Link href="/" className="hover:text-black">{t.home}</Link>
        <span>/</span>
        <Link href={`/kategori/${product.category.toLowerCase()}`} className="hover:text-black capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Görseller */}
        <div className="grid grid-cols-2 gap-2">
          {product.images.length > 0 ? product.images.map((img, i) => {
            const m = parseImageMeta(img);
            return (
              <div key={i} className={`relative bg-gray-100 ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}>
                <Image src={m.url} alt={`${product.name} - ${i + 1}`} fill className="object-cover"
                  style={{ objectPosition: m.position }}
                  sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0} unoptimized />
              </div>
            );
          }) : (
            <div className="col-span-2 aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Görsel yok
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div className="sticky top-24 self-start">
          <div className="flex gap-2 mb-4">
            {product.isNew && <span className="text-xs tracking-widest uppercase bg-black text-white px-3 py-1">{t.badgeNew}</span>}
            {product.isBestseller && <span className="text-xs tracking-widest uppercase border border-black px-3 py-1">{t.badgeBestseller}</span>}
          </div>

          <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-2">{product.material}</p>
          <h1 className="text-2xl md:text-3xl font-light leading-snug mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl font-semibold">₺{product.price.toLocaleString("tr-TR")}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">₺{product.originalPrice.toLocaleString("tr-TR")}</span>
            )}
          </div>

          {/* Renk + Numara + Sepet — client component */}
          <AddToCart
            product={{ id: product.id, name: product.name, price: product.price, images: product.images, colors: product.colors }}
            variants={product.variants.map((v) => ({ color: v.color, size: v.size, stock: v.stock }))}
            fallbackStock={product.stock}
          />

          {product.description && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mt-6 border-t border-gray-100 pt-6 space-y-3">
            {[t.feature1, t.feature2, t.feature3, t.feature4].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-light mb-8">{t.similarProducts}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/urunler/${p.id}`} className="group">
                <div className="aspect-[3/4] bg-gray-100 relative mb-3 overflow-hidden">
                  {p.images[0] && (() => {
                    const m = parseImageMeta(p.images[0]);
                    return <Image src={m.url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: m.position }} sizes="25vw" unoptimized />;
                  })()}
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">₺{p.price.toLocaleString("tr-TR")}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
