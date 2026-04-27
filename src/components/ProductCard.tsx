"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  colors: string[];
  material?: string;
  isNew?: boolean;
  isBestseller?: boolean;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const [wished, setWished] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [errored, setErrored] = useState(false);
  const src = product.images[imgIdx] || product.images[0];
  const showImage = src && !errored;

  return (
    <Link href={`/urunler/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {showImage ? (
          <Image
            src={src}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            onMouseEnter={() => product.images[1] && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
            onError={() => setErrored(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center text-stone-400 text-xs gap-2 p-4 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
            <span className="tracking-wider uppercase">Yakında</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1 font-medium">Yeni</span>
          )}
          {product.originalPrice && (
            <span className="bg-red-600 text-white text-[10px] tracking-widest uppercase px-2 py-1 font-medium">İndirim</span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-white text-black text-[10px] tracking-widest uppercase px-2 py-1 font-medium border border-black">Çok Satan</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Favorilere ekle"
        >
          <Heart size={16} className={wished ? "fill-black text-black" : "text-gray-600"} />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-xs tracking-widest uppercase text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium">
          İncele
        </div>
      </div>

      <div className="mt-3">
        {product.material && <p className="text-xs text-gray-500 tracking-wider uppercase mb-1">{product.material}</p>}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold">₺{product.price.toLocaleString("tr-TR")}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₺{product.originalPrice.toLocaleString("tr-TR")}</span>
          )}
        </div>
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((color, i) => (
              <span key={color} className="text-[10px] text-gray-400">
                {color}{i < Math.min(product.colors.length, 4) - 1 && " /"}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
