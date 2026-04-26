import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const CATEGORY_NAMES: Record<string, string> = {
  sandaletler: "Sandaletler",
  "topuklu-ayakkabi": "Topuklu Ayakkabı",
  bot: "Bot & Çizme",
  sneakers: "Sneakers",
  canta: "Çanta",
  aksesuar: "Aksesuar",
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = CATEGORY_NAMES[slug] || slug;
  return { title: `${name} | Ülkü Yaman` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const catName = CATEGORY_NAMES[slug];

  const products = await prisma.product.findMany({
    where: { active: true, deletedAt: null, category: { equals: catName, mode: "insensitive" } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="mb-10">
        <nav className="text-xs text-gray-400 mb-4 flex gap-2">
          <Link href="/" className="hover:text-black">Anasayfa</Link>
          <span>/</span>
          <span className="text-black">{catName || slug}</span>
        </nav>
        <h1 className="text-3xl font-light tracking-wide">{catName || slug}</h1>
        <p className="text-sm text-gray-500 mt-1">{products.length} ürün</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
          <Link href="/" className="text-sm text-black underline">Anasayfaya dön</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
