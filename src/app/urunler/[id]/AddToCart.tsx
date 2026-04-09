"use client";
import { useState } from "react";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/data";

export default function AddToCart({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Lütfen numara seçiniz.");
      return;
    }
    addItem(product, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm tracking-widest uppercase font-semibold transition-colors ${
          added
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Sepete Eklendi
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Sepete Ekle
          </>
        )}
      </button>
      <button
        onClick={() => setWished(!wished)}
        className="border border-gray-200 px-4 hover:border-black transition-colors"
        aria-label="Favorilere ekle"
      >
        <Heart
          size={18}
          className={wished ? "fill-black text-black" : "text-gray-600"}
        />
      </button>
    </div>
  );
}
