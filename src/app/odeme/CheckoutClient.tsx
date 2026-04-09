"use client";
import { useState } from "react";
import Image from "next/image";
import type { Address } from "@prisma/client";
import { Plus, CreditCard, Loader2 } from "lucide-react";

type SimpleProduct = { id: string; name: string; price: number; images: string[] };
type CartItemWithProduct = {
  id: string; productId: string; quantity: number; color: string; size: string;
  product: SimpleProduct;
};

type Props = {
  cartItems: CartItemWithProduct[];
  addresses: Address[];
  subtotal: number;
  shipping: number;
};

export default function CheckoutClient({ cartItems, addresses, subtotal, shipping }: Props) {
  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [addingAddress, setAddingAddress] = useState(addresses.length === 0);
  const [newAddr, setNewAddr] = useState({ name: "", phone: "", city: "", district: "", address: "", postalCode: "" });
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal + shipping;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAddr, isDefault: addresses.length === 0 }),
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedAddress(data.id);
      setAddingAddress(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError("Lütfen bir teslimat adresi seçin.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/iyzico/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddress }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ödeme başlatılamadı.");
        return;
      }

      setIframeHtml(data.checkoutFormContent);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // Iyzico ödeme formu aktifse
  if (iframeHtml) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-light mb-8">Ödeme</h1>
        <div
          dangerouslySetInnerHTML={{ __html: iframeHtml }}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-light mb-10">Ödeme</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Sol: Adres */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-medium mb-5">Teslimat Adresi</h2>

            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-4 border p-4 cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5 accent-black"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.name} · {addr.phone}</p>
                      <p className="text-gray-600 mt-0.5">{addr.address}</p>
                      <p className="text-gray-500">{addr.district} / {addr.city}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {addingAddress ? (
              <form onSubmit={handleAddAddress} className="border border-gray-200 p-5 space-y-4">
                <h3 className="text-sm font-medium">Yeni Adres</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Ad Soyad" value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2" />
                  <input required placeholder="Telefon" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
                  <input placeholder="Posta Kodu" value={newAddr.postalCode} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
                  <input required placeholder="İl" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
                  <input required placeholder="İlçe" value={newAddr.district} onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
                  <textarea required placeholder="Açık adres" value={newAddr.address} onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })} rows={3} className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-black text-white px-6 py-2.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                    Kaydet
                  </button>
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => setAddingAddress(false)} className="border border-gray-200 px-6 py-2.5 text-sm hover:border-black transition-colors">
                      İptal
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <button onClick={() => setAddingAddress(true)} className="flex items-center gap-2 text-sm border border-dashed border-gray-300 w-full py-3 justify-center hover:border-black hover:text-black text-gray-500 transition-colors">
                <Plus size={16} /> Yeni Adres Ekle
              </button>
            )}
          </section>

          {/* Ödeme bilgisi */}
          <section>
            <h2 className="text-lg font-medium mb-4">Ödeme</h2>
            <div className="border border-gray-100 p-5 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={20} className="text-gray-500" />
                <p className="text-sm font-medium">Güvenli Ödeme — Iyzico</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kredi kartı, banka kartı ve taksit seçenekleri mevcuttur.
              </p>
              <div className="flex gap-2 mt-4">
                {["Visa", "Mastercard", "Troy"].map((b) => (
                  <span key={b} className="text-xs bg-white border border-gray-200 px-2 py-1 font-medium">{b}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sağ: Sipariş özeti */}
        <div>
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-base font-medium mb-5 pb-4 border-b border-gray-200">
              Sipariş Özeti
            </h2>

            <div className="space-y-4 mb-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-[10px] rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="text-sm flex-1">
                    <p className="font-medium leading-tight">{item.product.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.color} · {item.size}</p>
                    <p className="font-semibold mt-1">₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ara toplam</span>
                <span>₺{subtotal.toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Ücretsiz" : `₺${shipping.toLocaleString("tr-TR")}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-semibold border-t border-gray-200 pt-4 mb-6">
              <span>Toplam</span>
              <span>₺{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4 bg-red-50 p-3">{error}</p>
            )}

            <button
              onClick={handlePayment}
              disabled={loading || !selectedAddress}
              className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Yükleniyor...</>
              ) : (
                "Ödemeyi Tamamla"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
