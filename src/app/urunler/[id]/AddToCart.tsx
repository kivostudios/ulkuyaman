"use client";
import { useMemo, useState } from "react";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

type ProductProp = {
  id: string;
  name: string;
  price: number;
  images: string[];
  colors: string[];
};

type Variant = { color: string; size: string; stock: number };

const DEFAULT_SIZES = ["36", "37", "38", "39", "40", "41"];

export default function AddToCart({
  product,
  variants = [],
  fallbackStock,
  sizes,
}: {
  product: ProductProp;
  variants?: Variant[];
  fallbackStock?: number;
  sizes?: string[];
}) {
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const hasVariants = variants.length > 0;

  const sizeList = useMemo(() => {
    if (sizes?.length) return sizes;
    if (hasVariants) {
      const all = Array.from(new Set(variants.map((v) => v.size)));
      return all.sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
    }
    return DEFAULT_SIZES;
  }, [sizes, hasVariants, variants]);

  const stockFor = (color: string, size: string): number => {
    if (!hasVariants) return fallbackStock ?? 0;
    return variants.find((v) => v.color === color && v.size === size)?.stock ?? 0;
  };

  const selectedStock = selectedColor && selectedSize ? stockFor(selectedColor, selectedSize) : null;
  const outOfStock = selectedStock !== null && selectedStock <= 0;

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Lütfen numara seçiniz.");
      return;
    }
    if (outOfStock) {
      alert("Bu numara stokta yok.");
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
          {sizeList.map((size) => {
            const stock = stockFor(selectedColor, size);
            const disabled = hasVariants && stock <= 0;
            return (
              <button
                key={size}
                disabled={disabled}
                onClick={() => setSelectedSize(size)}
                className={`border py-2 text-sm transition-colors relative ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : disabled
                    ? "border-gray-100 text-gray-300 line-through cursor-not-allowed"
                    : "border-gray-200 hover:border-black"
                }`}
                aria-label={disabled ? `${size} numara stokta yok` : size}
              >
                {size}
              </button>
            );
          })}
        </div>
        {!selectedSize && (
          <p className="text-xs text-red-400 mt-2">Lütfen numara seçiniz</p>
        )}
        {selectedSize && selectedStock !== null && selectedStock > 0 && selectedStock <= 3 && (
          <p className="text-xs text-orange-500 mt-2">Son {selectedStock} adet — acele et</p>
        )}
        {outOfStock && (
          <p className="text-xs text-red-500 mt-2">Bu kombinasyon stokta yok</p>
        )}
      </div>

      {/* Butonlar */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm tracking-widest uppercase font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
