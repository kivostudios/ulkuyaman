"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Save, Upload, X } from "lucide-react";

type ContentMap = Record<string, { id: string; value: string }>;

const SECTIONS = [
  {
    key: "hero_title",
    label: "Hero Başlık",
    type: "text",
    placeholder: "Ana sayfa başlığı",
  },
  {
    key: "hero_subtitle",
    label: "Hero Alt Başlık",
    type: "text",
    placeholder: "Kısa açıklama metni",
  },
  {
    key: "hero_button_text",
    label: "Hero Buton Metni",
    type: "text",
    placeholder: "Örn: Koleksiyonu Keşfet",
  },
  {
    key: "hero_image",
    label: "Hero Görseli",
    type: "image",
    placeholder: "",
  },
  {
    key: "banner_text",
    label: "Üst Banner Metni",
    type: "text",
    placeholder: "Örn: Tüm siparişlerde ücretsiz kargo",
  },
  {
    key: "collection_title",
    label: "Koleksiyon Bölüm Başlığı",
    type: "text",
    placeholder: "Örn: Yeni Koleksiyon",
  },
  {
    key: "about_text",
    label: "Hakkımızda Metni",
    type: "textarea",
    placeholder: "Marka hakkında kısa açıklama",
  },
  {
    key: "instagram_url",
    label: "Instagram Linki",
    type: "text",
    placeholder: "https://instagram.com/...",
  },
] as const;

export default function AdminContent() {
  const [content, setContent] = useState<ContentMap>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = () => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data: ContentMap) => {
        setContent(data);
        const v: Record<string, string> = {};
        Object.entries(data).forEach(([k, { value }]) => { v[k] = value; });
        setValues(v);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (key: string) => {
    setSaving(key);
    await fetch("/api/admin/content", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: values[key] || "" }),
    });
    setSaving(null);
    load();
  };

  const uploadImage = async (key: string, file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      setValues((v) => ({ ...v, [key]: data.url }));
      await fetch("/api/admin/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: data.url }),
      });
      load();
    }
    setUploading(false);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">İçerik & Tasarım</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ana sayfa içeriklerini buradan düzenleyin</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SECTIONS.map(({ key, label, type, placeholder }) => (
          <div key={key} className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm ${type === "textarea" ? "col-span-2" : ""}`}>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">{label}</label>

            {type === "image" ? (
              <div>
                {values[key] && (
                  <div className="relative inline-block mb-3 group">
                    <Image src={values[key]} alt={label} width={320} height={180} className="rounded-lg object-cover max-h-40 border border-gray-100" />
                    <button
                      type="button" onClick={() => setValues((v) => ({ ...v, [key]: "" }))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRefs.current[key]?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 text-sm border border-dashed border-gray-300 px-4 py-2 rounded-lg hover:border-gray-500 transition-colors text-gray-500 hover:text-black"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {values[key] ? "Değiştir" : "Görsel Yükle"}
                  </button>
                </div>
                <input
                  ref={(el) => { fileRefs.current[key] = el; }}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(key, f); }}
                />
              </div>
            ) : type === "textarea" ? (
              <div className="flex gap-2">
                <textarea
                  value={values[key] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  rows={4} placeholder={placeholder}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                />
                <button
                  onClick={() => save(key)} disabled={saving === key}
                  className="self-end p-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving === key ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text" value={values[key] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <button
                  onClick={() => save(key)} disabled={saving === key}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-xs"
                >
                  {saving === key ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Kaydet
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
