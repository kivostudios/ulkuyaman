"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import ProductForm from "../ProductForm";

type Props = { params: Promise<{ id: string }> };

export default function EditProduct({ params }: Props) {
  const { id } = use(params);
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <p className="text-red-500">Ürün bulunamadı</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ürün Düzenle</h1>
        <p className="text-sm text-gray-500 mt-0.5">{product.name as string}</p>
      </div>
      <ProductForm
        productId={id}
        initialData={{
          name: product.name as string,
          description: product.description as string,
          price: String(product.price),
          category: product.category as string,
          stock: String(product.stock),
          colors: product.colors as string[],
          images: product.images as string[],
          active: product.active as boolean,
          variants: ((product.variants as Array<{ color: string; size: string; stock: number }> | undefined) || []).map(
            (v) => ({ color: v.color, size: v.size, stock: v.stock })
          ),
        }}
      />
    </div>
  );
}
