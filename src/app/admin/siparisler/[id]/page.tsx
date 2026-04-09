"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";

type OrderDetail = {
  id: string; total: number; status: string; createdAt: string;
  user: { name: string | null; email: string | null; image: string | null };
  items: { id: string; quantity: number; price: number; product: { name: string; images: string[]; price: number } }[];
  addressSnapshot: { name?: string; phone?: string; address?: string; city?: string; district?: string; zip?: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor", PAID: "Ödendi", PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda", DELIVERED: "Teslim Edildi", CANCELLED: "İptal",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800", PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800", SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
};
const STATUSES = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

type Props = { params: Promise<{ id: string }> };

export default function OrderDetail({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrder((o) => o ? { ...o, status } : o);
    setUpdating(false);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <p className="text-red-500">Sipariş bulunamadı</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sipariş #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order items */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold">Ürünler</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  {item.product.images[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.name} width={56} height={56} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Adet: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-between">
              <span className="text-sm font-semibold">Toplam</span>
              <span className="text-lg font-bold">{fmt(order.total)}</span>
            </div>
          </div>

          {/* Address */}
          {order.addressSnapshot && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold mb-3">Teslimat Adresi</h2>
              <p className="text-sm font-medium">{order.addressSnapshot.name}</p>
              <p className="text-sm text-gray-600 mt-0.5">{order.addressSnapshot.phone}</p>
              <p className="text-sm text-gray-600 mt-1">{order.addressSnapshot.address}</p>
              <p className="text-sm text-gray-600">{order.addressSnapshot.district}, {order.addressSnapshot.city} {order.addressSnapshot.zip}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Müşteri</h2>
            <p className="text-sm font-medium">{order.user.name || "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.user.email}</p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Sipariş Durumu</h2>
            <div className="mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <div className="space-y-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating || order.status === s}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                    order.status === s
                      ? "bg-black text-white cursor-default"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-50"
                  }`}
                >
                  {updating && order.status !== s ? <Loader2 size={12} className="inline animate-spin mr-1" /> : null}
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
