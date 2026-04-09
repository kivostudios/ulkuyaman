"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";

type ProductData = {
  name: string; description: string; price: string; category: string;
  stock: string; colors: string[]; images: string[]; active: boolean;
};

const COLORS = ["Siyah", "Beyaz", "Kahverengi", "Bej", "Lacivert", "Kırmızı", "Gri", "Tan", "Nude"];
const CATEGORIES = ["Topuklu", "Düz", "Bot", "Sandalet", "Sneaker", "Loafer", "Terlik", "Diğer"];

type Props = {
  initialData?: Partial<ProductData>;
  productId?: string;
};

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<ProductData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    stock: initialData?.stock || "0",
    colors: initialData?.colors || [],
    images: initialData?.images || [],
    active: initialData?.active ?? true,
  });

  const update = (k: keyof ProductData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleImages = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) update("images", [...form.images, data.url]);
      }
    } finally {
      setUploading(false);
    }
  };

  const toggleColor = (s: string) => {
    update("colors", form.colors.includes(s) ? form.colors.filter((x) => x !== s) : [...form.colors, s]);
  };

  const removeImage = (url: string) => update("images", form.images.filter((i) => i !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock), colors: form.colors }),
        }
      );
      if (res.ok) router.push("/admin/urunler");
      else alert("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left: main fields */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold">Ürün Bilgileri</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Adı *</label>
              <input
                value={form.name} onChange={(e) => update("name", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Örn: Yüksek Topuklu Deri Bot"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Açıklama</label>
              <textarea
                value={form.description} onChange={(e) => update("description", e.target.value)} rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                placeholder="Ürün detayları..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat (₺) *</label>
                <input
                  type="number" min="0" step="0.01" value={form.price}
                  onChange={(e) => update("price", e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stok</label>
                <input
                  type="number" min="0" value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Görseller</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((url) => (
                <div key={url} className="relative group">
                  <Image src={url} alt="" width={80} height={80} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  <button
                    type="button" onClick={() => removeImage(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span className="text-[10px] mt-1">{uploading ? "Yükleniyor" : "Ekle"}</span>
              </button>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => e.target.files && handleImages(e.target.files)} />
            <p className="text-xs text-gray-400">JPG, PNG, WEBP. İlk görsel ana görsel olarak kullanılır.</p>
          </div>
        </div>

        {/* Right: sidebar options */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Yayın Durumu</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => update("active", !form.active)}
                className={`w-10 h-5 rounded-full transition-colors ${form.active ? "bg-black" : "bg-gray-200"} relative`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-700">{form.active ? "Aktif (satışta)" : "Pasif (gizli)"}</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Kategori</h2>
            <select
              value={form.category} onChange={(e) => update("category", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="">Seçiniz</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Renkler</h2>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((s) => (
                <button
                  key={s} type="button" onClick={() => toggleColor(s)}
                  className={`px-2.5 h-7 text-xs rounded-lg border transition-colors ${
                    form.colors.includes(s) ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button" onClick={() => router.push("/admin/urunler")}
              className="flex-1 border border-gray-200 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {productId ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
