"use client";
import { useState } from "react";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

type ProductProp = {
  id: string;
  name: string;
  price: number;
  images: string[];
  colors: string[];
};

const DEFAULT_SIZES = ["36", "37", "38", "39", "40", "41"];

export default function AddToCart({ product, sizes }: { product: ProductProp; sizes?: string[] }) {
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const sizeList = sizes?.length ? sizes : DEFAULT_SIZES;

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Lütfen numara seçiniz.");
      return;
    }
    addItem(product as never, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Renk seçimi */}
      {product.colors?.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">
            Renk — <span className="text-black font-medium">{selectedColor}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`text-xs border px-3 py-1.5 transition-colors ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Numara seçimi */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs tracking-widest uppercase text-gray-600">
            Numara{selectedSize && <span className="text-black font-medium"> — {selectedSize}</span>}
          </p>
          <span className="text-xs text-gray-400">Numara Rehberi</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {sizeList.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border py-2 text-sm transition-colors ${
                selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-xs text-red-400 mt-2">Lütfen numara seçiniz</p>
        )}
      </div>

      {/* Butonlar */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm tracking-widest uppercase font-semibold transition-colors ${
            added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {added ? <><Check size={16} />Sepete Eklendi</> : <><ShoppingBag size={16} />Sepete Ekle</>}
        </button>
        <button
          onClick={() => setWished(!wished)}
          className="border border-gray-200 px-4 hover:border-black transition-colors"
          aria-label="Favorilere ekle"
        >
          <Heart size={18} className={wished ? "fill-black text-black" : "text-gray-600"} />
        </button>
      </div>
    </div>
  );
}
