"use client";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
  const cartCount = count();
  const cartTotal = total();

  if (cartCount === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-light mb-3">Sepetiniz boş</h1>
        <p className="text-gray-500 mb-8">Henüz sepetinize ürün eklemediniz.</p>
        <Link
          href="/kategori/sandaletler"
          className="inline-block bg-black text-white px-10 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-light mb-10">
        Sepetim <span className="text-gray-400 text-xl">({cartCount} ürün)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.color}-${item.size}`}
              className="flex gap-5 border-b border-gray-100 pb-6"
            >
              <Link href={`/urunler/${item.product.id}`} className="relative w-28 h-36 bg-gray-100 flex-shrink-0 img-hover">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500 tracking-wider uppercase">{item.product.material}</p>
                    <h3 className="text-sm font-medium mt-0.5">{item.product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Renk: {item.color} &nbsp;|&nbsp; Numara: {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.color, item.size)}
                    className="p-1 text-gray-400 hover:text-black"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-semibold text-sm">
                    ₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-8 h-fit sticky top-24">
          <h2 className="text-lg font-medium mb-6 pb-4 border-b border-gray-200">Sipariş Özeti</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ara Toplam</span>
              <span>₺{cartTotal.toLocaleString("tr-TR")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kargo</span>
              <span className={cartTotal >= 250 ? "text-green-600" : ""}>
                {cartTotal >= 250 ? "Ücretsiz" : "₺49,90"}
              </span>
            </div>
            {cartTotal < 250 && (
              <p className="text-xs text-gray-500 bg-white p-2 border border-dashed border-gray-200">
                Ücretsiz kargo için ₺{(250 - cartTotal).toLocaleString("tr-TR")} daha ekleyin.
              </p>
            )}
          </div>

          <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-4 mb-6">
            <span>Toplam</span>
            <span>₺{(cartTotal + (cartTotal >= 250 ? 0 : 49.9)).toLocaleString("tr-TR")}</span>
          </div>

          {/* Discount */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="İndirim kodu"
              className="flex-1 border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button className="bg-black text-white text-xs tracking-widest uppercase px-4 hover:bg-gray-800 transition-colors">
              Uygula
            </button>
          </div>

          <button className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors">
            Ödemeye Geç
          </button>

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {["💳 Kredi Kartı", "🏦 Havale", "📱 Kapıda Ödeme"].map((m) => (
              <span key={m} className="text-xs text-gray-500">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
