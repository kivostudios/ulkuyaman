"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Address } from "@prisma/client";
import { Plus, CreditCard, Loader2, Tag, X } from "lucide-react";

type SimpleProduct = { id: string; name: string; price: number; images: string[] };
type CartItemWithProduct = {
  id: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product: SimpleProduct;
};

type Props = {
  cartItems: CartItemWithProduct[];
  addresses: Address[];
  subtotal: number;
  shipping: number;
};

type AppliedCoupon = {
  code: string;
  discount: number;
};

export default function CheckoutClient({ cartItems, addresses, subtotal, shipping }: Props) {
  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [addingAddress, setAddingAddress] = useState(addresses.length === 0);
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    tcKimlik: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
  });
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  async function handleAddAddress(e: React.FormEvent) {
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
      window.location.reload();
    }
  }

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setCouponError(data.error || "Kupon uygulanamadı.");
        return;
      }
      setApplied({ code: data.coupon.code, discount: data.discount });
      setCouponCode("");
    } catch {
      setCouponError("Bir hata oluştu.");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handlePayment() {
    if (!selectedAddress) {
      setError("Lütfen bir teslimat adresi seçin.");
      return;
    }
    if (!acceptTerms) {
      setError("Devam edebilmek için sözleşmeleri onaylaman gerekiyor.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/iyzico/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          couponCode: applied?.code,
        }),
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
  }

  if (iframeHtml) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-light mb-8">Ödeme</h1>
        <div dangerouslySetInnerHTML={{ __html: iframeHtml }} className="w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-light mb-10">Ödeme</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Sol: Adres + Onay */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-medium mb-5">Teslimat Adresi</h2>

            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-4 border p-4 cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5 accent-black"
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        {addr.name} · {addr.phone}
                      </p>
                      <p className="text-gray-600 mt-0.5">{addr.address}</p>
                      <p className="text-gray-500">
                        {addr.district} / {addr.city}
                      </p>
                      {!addr.tcKimlik && (
                        <p className="text-xs text-orange-600 mt-1">
                          T.C. kimlik numarası ekli değil — fatura için gerekli.
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {addingAddress ? (
              <form
                onSubmit={handleAddAddress}
                className="border border-gray-200 p-5 space-y-4"
              >
                <h3 className="text-sm font-medium">Yeni Adres</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Ad Soyad"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2"
                  />
                  <input
                    required
                    placeholder="Telefon"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    placeholder="T.C. Kimlik No (fatura için)"
                    value={newAddr.tcKimlik}
                    onChange={(e) =>
                      setNewAddr({
                        ...newAddr,
                        tcKimlik: e.target.value.replace(/\D/g, "").slice(0, 11),
                      })
                    }
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <input
                    required
                    placeholder="İl"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <input
                    required
                    placeholder="İlçe"
                    value={newAddr.district}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, district: e.target.value })
                    }
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <input
                    placeholder="Posta Kodu"
                    value={newAddr.postalCode}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, postalCode: e.target.value })
                    }
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2"
                  />
                  <textarea
                    required
                    placeholder="Açık adres"
                    value={newAddr.address}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, address: e.target.value })
                    }
                    rows={3}
                    className="border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black col-span-2 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                  >
                    Kaydet
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddingAddress(false)}
                      className="border border-gray-200 px-6 py-2.5 text-sm hover:border-black transition-colors"
                    >
                      İptal
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAddingAddress(true)}
                className="flex items-center gap-2 text-sm border border-dashed border-gray-300 w-full py-3 justify-center hover:border-black hover:text-black text-gray-500 transition-colors"
              >
                <Plus size={16} /> Yeni Adres Ekle
              </button>
            )}
          </section>

          <section>
            <h2 className="text-lg font-medium mb-4">Ödeme</h2>
            <div className="border border-gray-100 p-5 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={20} className="text-gray-500" />
                <p className="text-sm font-medium">Güvenli Ödeme — iyzico</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kredi kartı, banka kartı
                ve taksit seçenekleri mevcuttur. Kart bilgileriniz tarafımızca saklanmaz.
              </p>
              <div className="flex gap-2 mt-4">
                {["Visa", "Mastercard", "Troy"].map((b) => (
                  <span
                    key={b}
                    className="text-xs bg-white border border-gray-200 px-2 py-1 font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-gray-200 p-5">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 accent-black"
              />
              <span className="text-sm leading-relaxed text-gray-700">
                <Link href="/on-bilgilendirme" target="_blank" className="underline">
                  Ön Bilgilendirme Formu
                </Link>{" "}
                ve{" "}
                <Link href="/mesafeli-satis" target="_blank" className="underline">
                  Mesafeli Satış Sözleşmesi
                </Link>
                &apos;ni okudum, içeriğini kabul ediyorum.
              </span>
            </label>
          </section>
        </div>

        {/* Sağ: Sipariş özeti */}
        <div>
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-base font-medium mb-5 pb-4 border-b border-gray-200">
              Sipariş Özeti
            </h2>

            <div className="space-y-4 mb-5 max-h-[40vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-[10px] rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="text-sm flex-1">
                    <p className="font-medium leading-tight">{item.product.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.color} · {item.size}
                    </p>
                    <p className="font-semibold mt-1">
                      ₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              {applied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <Tag size={14} className="text-green-700" />
                    <span className="font-mono font-semibold">{applied.code}</span>
                    <span className="text-green-700">
                      −₺{applied.discount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                  <button
                    onClick={() => setApplied(null)}
                    className="text-gray-500 hover:text-black"
                    aria-label="Kuponu kaldır"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={applyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kupon kodu"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="border border-black px-4 py-2 text-xs tracking-widest uppercase font-semibold hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Uygula"}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-2">{couponError}</p>
              )}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ara toplam</span>
                <span>₺{subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0
                    ? "Ücretsiz"
                    : `₺${shipping.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>İndirim</span>
                  <span>
                    −₺{discount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
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
              disabled={loading || !selectedAddress || !acceptTerms}
              className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Yükleniyor...
                </>
              ) : (
                "Ödemeyi Tamamla"
              )}
            </button>

            <p className="mt-3 text-[11px] text-gray-500 text-center leading-relaxed">
              Devam ederek{" "}
              <Link href="/iade-cayma" target="_blank" className="underline">
                Teslimat & İade Politikası
              </Link>
              &apos;nı kabul etmiş olursun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
