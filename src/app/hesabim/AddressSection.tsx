"use client";
import { useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import type { Address } from "@prisma/client";

type Props = { initialAddresses: Address[] };

export default function AddressSection({ initialAddresses }: Props) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", city: "", district: "", address: "", postalCode: "", isDefault: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setAddresses((prev) =>
        form.isDefault
          ? [data, ...prev.map((a) => ({ ...a, isDefault: false }))]
          : [...prev, data]
      );
      setAdding(false);
      setForm({ name: "", phone: "", city: "", district: "", address: "", postalCode: "", isDefault: false });
    }
  };

  const remove = async (id: string) => {
    await fetch("/api/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr.id} className="border border-gray-100 p-5 flex justify-between items-start">
          <div className="flex gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              {addr.isDefault && (
                <span className="text-[10px] bg-black text-white px-2 py-0.5 tracking-widest uppercase mb-1 inline-block">
                  Varsayılan
                </span>
              )}
              <p className="text-sm font-medium">{addr.name} · {addr.phone}</p>
              <p className="text-sm text-gray-600 mt-0.5">{addr.address}</p>
              <p className="text-sm text-gray-500">{addr.district} / {addr.city} {addr.postalCode}</p>
            </div>
          </div>
          <button onClick={() => remove(addr.id)} className="text-gray-400 hover:text-red-500 p-1">
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={submit} className="border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-medium mb-2">Yeni Adres</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2" />
            <input required placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            <input required placeholder="Posta Kodu" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            <input required placeholder="İl" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            <input required placeholder="İlçe" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
            <textarea required placeholder="Açık adres" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2 resize-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-black" />
            Varsayılan adres olarak kaydet
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-black text-white px-6 py-2.5 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors">
              Kaydet
            </button>
            <button type="button" onClick={() => setAdding(false)} className="border border-gray-200 px-6 py-2.5 text-sm hover:border-black transition-colors">
              İptal
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 text-sm border border-dashed border-gray-300 w-full py-4 justify-center hover:border-black hover:text-black text-gray-500 transition-colors">
          <Plus size={16} />
          Yeni Adres Ekle
        </button>
      )}
    </div>
  );
}
