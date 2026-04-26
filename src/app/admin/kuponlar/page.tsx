"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
};

const emptyForm = {
  code: "",
  description: "",
  type: "PERCENT" as "PERCENT" | "FIXED",
  value: "",
  minSubtotal: "",
  maxDiscount: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
};

export default function KuponlarPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kupon oluşturulamadı");
      return;
    }
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function toggleActive(c: Coupon) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  }

  async function remove(c: Coupon) {
    if (!confirm(`"${c.code}" kuponunu silmek istediğinden emin misin?`)) return;
    await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">İndirim Kuponları</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Yüzde veya sabit tutar indirimi tanımla
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          <Plus size={16} />
          {showForm ? "Kapat" : "Yeni Kupon"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-medium mb-1">Kod *</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full border border-gray-300 px-3 py-2 text-sm font-mono uppercase"
              placeholder="YAZ20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Tip *</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as "PERCENT" | "FIXED" })
              }
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="PERCENT">Yüzde (%)</option>
              <option value="FIXED">Sabit Tutar (₺)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Değer * {form.type === "PERCENT" ? "(0-100)" : "(₺)"}
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
              placeholder={form.type === "PERCENT" ? "20" : "100"}
            />
          </div>

          <div className="col-span-2 md:col-span-3">
            <label className="block text-xs font-medium mb-1">Açıklama</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
              placeholder="Yaz indirimi"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Min. sepet tutarı (₺)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.minSubtotal}
              onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
              placeholder="Limit yok"
            />
          </div>

          {form.type === "PERCENT" && (
            <div>
              <label className="block text-xs font-medium mb-1">
                Max indirim (₺)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 text-sm"
                placeholder="Limit yok"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1">Kullanım limiti</label>
            <input
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
              placeholder="Sınırsız"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Başlangıç</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Bitiş</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="col-span-3 text-sm text-red-600 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <div className="col-span-2 md:col-span-3 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border border-gray-300 hover:border-black"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-5 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Oluştur
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="animate-spin mx-auto text-gray-400" size={20} />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Henüz kupon yok. &quot;Yeni Kupon&quot; ile ekle.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Kod</th>
                <th className="text-left px-5 py-3 font-medium">İndirim</th>
                <th className="text-left px-5 py-3 font-medium">Min. Sepet</th>
                <th className="text-left px-5 py-3 font-medium">Kullanım</th>
                <th className="text-left px-5 py-3 font-medium">Geçerlilik</th>
                <th className="text-left px-5 py-3 font-medium">Durum</th>
                <th className="text-right px-5 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => {
                const expired =
                  c.expiresAt && new Date(c.expiresAt) < new Date();
                const limitReached =
                  c.usageLimit !== null && c.usedCount >= c.usageLimit;
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-semibold">{c.code}</p>
                      {c.description && (
                        <p className="text-xs text-gray-400">{c.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.type === "PERCENT"
                        ? `%${c.value}`
                        : `₺${c.value.toLocaleString("tr-TR")}`}
                      {c.maxDiscount && (
                        <p className="text-xs text-gray-400">
                          max ₺{c.maxDiscount.toLocaleString("tr-TR")}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.minSubtotal
                        ? `₺${c.minSubtotal.toLocaleString("tr-TR")}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.usedCount}/{c.usageLimit ?? "∞"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">
                      {c.startsAt && (
                        <p>
                          {new Date(c.startsAt).toLocaleDateString("tr-TR")} —
                        </p>
                      )}
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString("tr-TR")
                        : "Bitiş yok"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`text-xs px-2 py-1 font-medium ${
                          c.active && !expired && !limitReached
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {expired
                          ? "Süresi doldu"
                          : limitReached
                          ? "Limit doldu"
                          : c.active
                          ? "Aktif"
                          : "Pasif"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => remove(c)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
