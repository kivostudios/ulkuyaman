"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Loader2, Plus, Star, ArrowUp, ArrowDown, Maximize2 } from "lucide-react";

type Variant = { color: string; size: string; stock: number };

type ProductData = {
  name: string; description: string; price: string; category: string;
  stock: string; colors: string[]; images: string[]; active: boolean;
  variants: Variant[];
};

const COLORS = ["Siyah", "Beyaz", "Kahverengi", "Bej", "Lacivert", "Kırmızı", "Gri", "Tan", "Nude"];
const CATEGORIES = ["Topuklu", "Düz", "Bot", "Sandalet", "Sneaker", "Loafer", "Terlik", "Diğer"];
const DEFAULT_SIZES = ["36", "37", "38", "39", "40", "41"];
const POSITIONS: { value: string; label: string }[] = [
  { value: "center", label: "Ortalı (varsayılan)" },
  { value: "top", label: "Üstten kırp" },
  { value: "bottom", label: "Alttan kırp" },
  { value: "left", label: "Soldan kırp" },
  { value: "right", label: "Sağdan kırp" },
];

// URL'in hash'inde "#pos=top" gibi metadata sakliyoruz; browser hash'i istek'e dahil etmez.
function splitImageUrl(url: string) {
  const i = url.indexOf("#");
  if (i === -1) return { url, position: "center" };
  const bare = url.slice(0, i);
  const params = new URLSearchParams(url.slice(i + 1));
  return { url: bare, position: params.get("pos") || "center" };
}
function joinImageUrl(bareUrl: string, position: string) {
  if (!position || position === "center") return bareUrl;
  return `${bareUrl}#pos=${position}`;
}

// Tarayici tarafinda fotoyu max 2000px genislik + 80% kalite ile yeniden boyutlandir.
// Vercel function body limiti ~4.5MB, 8MP foto kolay 6MB+ oluyor; bu ile altina iniyor.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const MAX_W = 2000;
  const QUALITY = 0.82;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  if (img.width <= MAX_W && file.size < 3 * 1024 * 1024) return file;

  const scale = Math.min(1, MAX_W / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY)
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

type Props = {
  initialData?: Partial<ProductData>;
  productId?: string;
};

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const [form, setForm] = useState<ProductData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    stock: initialData?.stock || "0",
    colors: initialData?.colors || [],
    images: initialData?.images || [],
    active: initialData?.active ?? true,
    variants: initialData?.variants || [],
  });

  const update = <K extends keyof ProductData>(k: K, v: ProductData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImages = async (files: FileList) => {
    setUploading(true);
    setUploadError(null);
    try {
      for (const original of Array.from(files)) {
        try {
          const file = await compressImage(original);
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.url) {
            throw new Error(data.error || `HTTP ${res.status}`);
          }
          // Functional setState — closure'da eski form.images'i kullanmıyoruz
          setForm((f) => ({ ...f, images: [...f.images, data.url as string] }));
        } catch (e) {
          setUploadError(`${original.name}: ${(e as Error).message}`);
        }
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleColor = (s: string) => {
    update("colors", form.colors.includes(s) ? form.colors.filter((x) => x !== s) : [...form.colors, s]);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= form.images.length) return;
    const next = [...form.images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update("images", next);
  };
  const setPrimary = (i: number) => moveImage(i, 0);
  const removeImageAt = (i: number) => update("images", form.images.filter((_, idx) => idx !== i));
  const setPositionAt = (i: number, pos: string) => {
    const { url } = splitImageUrl(form.images[i]);
    update("images", form.images.map((x, idx) => (idx === i ? joinImageUrl(url, pos) : x)));
  };

  const generateVariantMatrix = () => {
    if (!form.colors.length) {
      alert("Önce en az bir renk seç.");
      return;
    }
    const existing = new Map(form.variants.map((v) => [`${v.color}|${v.size}`, v.stock]));
    const rows: Variant[] = [];
    for (const c of form.colors) {
      for (const s of DEFAULT_SIZES) {
        const key = `${c}|${s}`;
        rows.push({ color: c, size: s, stock: existing.get(key) ?? 0 });
      }
    }
    update("variants", rows);
  };

  const addVariantRow = () => update("variants", [...form.variants, { color: form.colors[0] || "", size: "", stock: 0 }]);
  const removeVariantRow = (i: number) =>
    update("variants", form.variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, patch: Partial<Variant>) =>
    update("variants", form.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            colors: form.colors,
            variants: form.variants
              .filter((v) => v.color && v.size)
              .map((v) => ({ color: v.color, size: v.size, stock: Number(v.stock) || 0 })),
          }),
        }
      );
      if (res.ok) router.push("/admin/urunler");
      else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || `Kaydedilemedi (HTTP ${res.status})`);
      }
    } finally {
      setSaving(false);
    }
  };

  // ESC ile preview kapat
  useEffect(() => {
    if (previewIdx === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreviewIdx(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewIdx]);

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
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Toplam Stok <span className="text-gray-400 font-normal">(varyant yoksa fallback)</span>
                </label>
                <input
                  type="number" min="0" value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold">Beden / Renk Stokları</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Burada satır varsa müşteri o (renk × beden) için stoğa göre satın alabilir. Boşsa toplam stok kullanılır.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button" onClick={generateVariantMatrix}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  Renkler × Bedenler matrisi oluştur
                </button>
                <button
                  type="button" onClick={addVariantRow}
                  className="text-xs flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <Plus size={12} /> Satır
                </button>
              </div>
            </div>

            {form.variants.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Henüz varyant yok. Yukarıdaki &quot;matris oluştur&quot; butonu hızlı başlatır.</p>
            ) : (
              <div className="space-y-1.5">
                <div className="grid grid-cols-[1fr_120px_120px_36px] gap-2 text-[10px] uppercase tracking-wider text-gray-400 px-1">
                  <div>Renk</div>
                  <div>Beden</div>
                  <div>Stok</div>
                  <div></div>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_120px_36px] gap-2 items-center">
                    <select
                      value={v.color}
                      onChange={(e) => updateVariant(i, { color: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    >
                      <option value="">—</option>
                      {(form.colors.length ? form.colors : COLORS).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      value={v.size}
                      onChange={(e) => updateVariant(i, { size: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                      placeholder="36"
                    />
                    <input
                      type="number" min="0" value={v.stock}
                      onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    />
                    <button
                      type="button" onClick={() => removeVariantRow(i)}
                      className="text-red-500 hover:bg-red-50 rounded-lg p-1.5"
                      aria-label="Sil"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images — yenilenmiş galeri */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold">Görseller</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  İlk görsel ana görsel olarak kullanılır. ★ butonuyla başka birini ana yap.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-xs flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "Yükleniyor…" : "Foto Ekle"}
              </button>
            </div>

            {uploadError && (
              <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                Yükleme hatası: {uploadError}
              </div>
            )}

            {form.images.length === 0 ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-lg py-12 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Upload size={20} />
                <span className="text-xs mt-2">JPG, PNG, WEBP — max 8MB (otomatik küçültülür)</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((raw, i) => {
                  const { url, position } = splitImageUrl(raw);
                  const isPrimary = i === 0;
                  return (
                    <div
                      key={raw + i}
                      className={`group relative border rounded-lg overflow-hidden ${
                        isPrimary ? "border-black ring-2 ring-black/5" : "border-gray-200"
                      }`}
                    >
                      <div
                        className="relative aspect-[3/4] bg-gray-50 cursor-zoom-in"
                        onClick={() => setPreviewIdx(i)}
                      >
                        <Image
                          src={url}
                          alt={`Foto ${i + 1}`}
                          fill
                          className="object-cover"
                          style={{ objectPosition: position }}
                          sizes="200px"
                          unoptimized
                        />
                        {isPrimary && (
                          <span className="absolute top-2 left-2 text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5 rounded">
                            Ana
                          </span>
                        )}
                        <span className="absolute top-2 right-2 text-[10px] bg-white/90 px-1.5 py-0.5 rounded text-gray-600">
                          {i + 1}/{form.images.length}
                        </span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 size={20} className="text-white drop-shadow" />
                        </div>
                      </div>

                      <div className="p-2 space-y-1.5 bg-white">
                        <select
                          value={position}
                          onChange={(e) => setPositionAt(i, e.target.value)}
                          className="w-full text-[11px] border border-gray-200 rounded px-1.5 py-1"
                          title="Foto kırpma pozisyonu"
                        >
                          {POSITIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          <button
                            type="button" onClick={() => setPrimary(i)}
                            disabled={isPrimary}
                            className="flex-1 text-[11px] border border-gray-200 rounded px-1.5 py-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            title="Ana foto yap"
                          >
                            <Star size={11} className={isPrimary ? "fill-black" : ""} />
                          </button>
                          <button
                            type="button" onClick={() => moveImage(i, i - 1)}
                            disabled={i === 0}
                            className="text-[11px] border border-gray-200 rounded px-1.5 py-1 hover:bg-gray-50 disabled:opacity-40"
                            title="Yukarı taşı"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button" onClick={() => moveImage(i, i + 1)}
                            disabled={i === form.images.length - 1}
                            className="text-[11px] border border-gray-200 rounded px-1.5 py-1 hover:bg-gray-50 disabled:opacity-40"
                            title="Aşağı taşı"
                          >
                            <ArrowDown size={11} />
                          </button>
                          <button
                            type="button" onClick={() => removeImageAt(i)}
                            className="text-[11px] border border-red-200 text-red-600 rounded px-1.5 py-1 hover:bg-red-50"
                            title="Sil"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  <span className="text-[11px] mt-1">{uploading ? "Yükleniyor" : "Foto ekle"}</span>
                </button>
              </div>
            )}

            <input
              ref={fileRef} type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => e.target.files && e.target.files.length && handleImages(e.target.files)}
            />
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

      {/* Preview modal — büyük göster */}
      {previewIdx !== null && form.images[previewIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6"
          onClick={() => setPreviewIdx(null)}
        >
          <div
            className="relative max-w-[min(900px,90vw)] max-h-[85vh] w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={splitImageUrl(form.images[previewIdx]).url}
              alt={`Önizleme ${previewIdx + 1}`}
              width={900}
              height={1200}
              className="max-h-[85vh] w-auto h-auto object-contain"
              style={{ objectPosition: splitImageUrl(form.images[previewIdx]).position }}
              unoptimized
            />
            <button
              type="button" onClick={() => setPreviewIdx(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
              aria-label="Kapat"
            >
              <X size={16} />
            </button>
            <div className="text-white text-xs text-center mt-3 opacity-70">
              Foto {previewIdx + 1} / {form.images.length} — ESC veya dışarı tıkla kapanır
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
