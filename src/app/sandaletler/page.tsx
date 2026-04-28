import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import SortDropdown from "@/components/SortDropdown";
import { getServerT } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tüm Sandaletler | Ülkü Yaman Collection",
  description:
    "Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri. Yeni gelenler, indirimler ve klasik koleksiyon.",
};

type SP = Promise<{ [key: string]: string | string[] | undefined }>;

function pickStr(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SandaletlerPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { t } = await getServerT();

  const renk = pickStr(sp.renk)?.split(",").filter(Boolean) ?? [];
  const alt = pickStr(sp.alt)?.split(",").filter(Boolean) ?? [];
  const min = Number(pickStr(sp.min)) || undefined;
  const max = Number(pickStr(sp.max)) || undefined;
  const indirim = pickStr(sp.indirim) === "1";
  const yeni = pickStr(sp.yeni) === "1";
  const stokta = pickStr(sp.stokta) === "1";
  const q = pickStr(sp.q)?.trim();
  const siralama = pickStr(sp.siralama) ?? "yeni";

  const where: Prisma.ProductWhereInput = {
    active: true,
    deletedAt: null,
    category: { equals: "Sandaletler", mode: "insensitive" },
  };

  if (renk.length) where.colors = { hasSome: renk };
  if (alt.length) where.subcategory = { in: alt };
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = min;
    if (max) where.price.lte = max;
  }
  if (indirim) where.originalPrice = { not: null };
  if (yeni) where.isNew = true;
  if (stokta) where.stock = { gt: 0 };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    siralama === "fiyat-asc"
      ? { price: "asc" }
      : siralama === "fiyat-desc"
      ? { price: "desc" }
      : siralama === "popular"
      ? { isBestseller: "desc" }
      : { createdAt: "desc" };

  const [products, allSandals] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: 60 }),
    prisma.product.findMany({
      where: { active: true, deletedAt: null, category: { equals: "Sandaletler", mode: "insensitive" } },
      select: { colors: true, subcategory: true, price: true },
    }),
  ]);

  const colorSet = new Set<string>();
  const subSet = new Set<string>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of allSandals) {
    p.colors.forEach((c) => colorSet.add(c));
    if (p.subcategory) subSet.add(p.subcategory);
    if (p.price < priceMin) priceMin = p.price;
    if (p.price > priceMax) priceMax = p.price;
  }
  const facets = {
    colors: Array.from(colorSet).sort((a, b) => a.localeCompare(b, "tr")),
    subcategories: Array.from(subSet).sort((a, b) => a.localeCompare(b, "tr")),
    priceMin: priceMin === Infinity ? 0 : Math.floor(priceMin),
    priceMax: Math.ceil(priceMax),
  };

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-10 md:py-14">
      <nav className="text-xs text-gray-400 mb-4 flex gap-2">
        <Link href="/" className="hover:text-black">{t.home}</Link>
        <span>/</span>
        <span className="text-black">{t.sandals}</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide">
            {q ? t.searchResults(q) : t.allSandals}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {t.productCount(products.length, products.length === 60)}
          </p>
        </div>
        <SortDropdown />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <ProductFilters facets={facets} />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-400 border border-dashed border-black/10">
              <p className="text-lg mb-4">
                {q ? t.noSearchResults : t.noProducts}
              </p>
              <Link href="/sandaletler" className="text-sm text-black underline">
                {t.clearFilters}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
