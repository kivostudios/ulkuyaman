"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Product = {
  id: string; name: string; price: number; images: string[]; category: string;
  stock: number; active: boolean; createdAt: string;
  _count: { orderItems: number };
};

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    load();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Plus size={16} /> Yeni Ürün
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Ürün</th>
                <th className="text-left px-5 py-3 font-medium">Kategori</th>
                <th className="text-left px-5 py-3 font-medium">Fiyat</th>
                <th className="text-left px-5 py-3 font-medium">Stok</th>
                <th className="text-left px-5 py-3 font-medium">Satış</th>
                <th className="text-left px-5 py-3 font-medium">Durum</th>
                <th className="text-right px-5 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.name} width={40} height={40} className="rounded-lg object-cover w-10 h-10 border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100" />
                      )}
                      <span className="font-medium text-black">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.category || "—"}</td>
                  <td className="px-5 py-3.5 font-semibold">{fmt(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <span className={p.stock === 0 ? "text-red-500 font-medium" : "text-gray-700"}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p._count.orderItems}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(p.id, p.active)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-black"
                        title={p.active ? "Pasife al" : "Aktife al"}
                      >
                        {p.active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        href={`/admin/urunler/${p.id}`}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-black"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => remove(p.id, p.name)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-xs">
                    Henüz ürün yok. <Link href="/admin/urunler/yeni" className="text-black underline">Yeni ürün ekle</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
