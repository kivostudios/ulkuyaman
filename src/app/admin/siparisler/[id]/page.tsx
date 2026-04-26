"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, Tag } from "lucide-react";

type OrderDetail = {
  id: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode: string | null;
  status: string;
  createdAt: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  user: { name: string | null; email: string | null; image: string | null };
  items: {
    id: string;
    quantity: number;
    price: number;
    color: string;
    size: string;
    product: { name: string; images: string[]; price: number };
  }[];
  addressSnapshot: {
    name?: string;
    phone?: string;
    tcKimlik?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  } | null;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PAYMENT_FAILED: "Ödeme Başarısız",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
  REFUNDED: "İade",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_FAILED: "bg-red-100 text-red-800",
  PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};
const STATUSES = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const CARRIERS = ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "PTT", "Sürat", "UPS"];

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(n);
}

type Props = { params: Promise<{ id: string }> };

export default function OrderDetail({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  async function refresh() {
    const res = await fetch(`/api/admin/orders/${id}`);
    const data = await res.json();
    setOrder(data);
    setCarrier(data.trackingCarrier ?? "");
    setTracking(data.trackingNumber ?? "");
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrder((o) => (o ? { ...o, status } : o));
    setUpdating(false);
  }

  async function saveTracking() {
    setSavingTracking(true);
    setTrackingSaved(false);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingCarrier: carrier,
        trackingNumber: tracking,
      }),
    });
    setSavingTracking(false);
    if (res.ok) {
      setTrackingSaved(true);
      setTimeout(() => setTrackingSaved(false), 2000);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!order) return <p className="text-red-500">Sipariş bulunamadı</p>;

  const addr = order.addressSnapshot;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Sipariş #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold">Ürünler</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.color} · Beden {item.size} · {item.quantity} adet
                    </p>
                  </div>
                  <p className="font-semibold text-sm">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ara toplam</span>
                <span>{fmt(order.subtotal || order.total - order.shippingCost + order.discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Kargo</span>
                <span>{order.shippingCost === 0 ? "Ücretsiz" : fmt(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>
                    İndirim {order.couponCode && (
                      <span className="font-mono text-xs ml-1">({order.couponCode})</span>
                    )}
                  </span>
                  <span>−{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100 mt-2">
                <span>Toplam</span>
                <span>{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          {addr && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold mb-3">Teslimat Adresi</h2>
              <p className="text-sm font-medium">{addr.name}</p>
              <p className="text-sm text-gray-600 mt-0.5">{addr.phone}</p>
              {addr.tcKimlik && (
                <p className="text-xs text-gray-500 mt-0.5">
                  T.C.: {addr.tcKimlik}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">{addr.address}</p>
              <p className="text-sm text-gray-600">
                {addr.district}, {addr.city} {addr.postalCode ?? ""}
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-4">Kargo Takip</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Kargo Şirketi</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Seç</option>
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Takip No</label>
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-mono"
                  placeholder="123456789"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={saveTracking}
                disabled={savingTracking}
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50"
              >
                {savingTracking ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                Kaydet
              </button>
              {trackingSaved && (
                <span className="text-xs text-green-700">✓ Kaydedildi</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                Durumu &quot;Kargoda&quot; yapınca müşteriye e-posta gönderilir.
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Müşteri</h2>
            <p className="text-sm font-medium">{order.user.name || "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.user.email}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Durum</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                }`}
              >
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
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {order.couponCode && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag size={14} /> Kupon
              </h2>
              <p className="font-mono text-sm font-semibold">{order.couponCode}</p>
              <p className="text-xs text-green-700 mt-1">−{fmt(order.discount)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
