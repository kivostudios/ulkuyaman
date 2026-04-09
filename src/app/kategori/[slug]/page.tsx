import { notFound } from "next/navigation";
import { categories, getProductsByCategory, products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} | Ülkü Yaman Collection` : "Kategori",
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  const categoryProducts = getProductsByCategory(slug);

  // If no products, show all products
  const displayProducts = categoryProducts.length > 0 ? categoryProducts : products;

  if (!cat) notFound();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <nav className="text-xs text-gray-400 mb-4 flex gap-2">
          <a href="/" className="hover:text-black">Anasayfa</a>
          <span>/</span>
          <span className="text-black">{cat.name}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide">{cat.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{displayProducts.length} ürün</p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sırala:</label>
            <select className="text-sm border border-gray-200 px-3 py-2 bg-white outline-none cursor-pointer">
              <option>Önerilen</option>
              <option>Fiyat: Artan</option>
              <option>Fiyat: Azalan</option>
              <option>Yeniden Eskiye</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="mb-8">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold mb-4 border-b border-gray-100 pb-3">
              Renk
            </h3>
            <div className="space-y-2">
              {["Siyah", "Beyaz", "Bej", "Taba", "Kahve"].map((color) => (
                <label key={color} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                  <input type="checkbox" className="accent-black" />
                  {color}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold mb-4 border-b border-gray-100 pb-3">
              Fiyat
            </h3>
            <div className="space-y-2">
              {["₺0 - ₺900", "₺900 - ₺1.100", "₺1.100+"].map((range) => (
                <label key={range} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                  <input type="checkbox" className="accent-black" />
                  {range}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold mb-4 border-b border-gray-100 pb-3">
              Malzeme
            </h3>
            <div className="space-y-2">
              {["Hakiki Deri"].map((mat) => (
                <label key={mat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                  <input type="checkbox" className="accent-black" defaultChecked />
                  {mat}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {displayProducts.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
              <a href="/" className="text-sm text-black underline mt-4 inline-block">
                Anasayfaya dön
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
