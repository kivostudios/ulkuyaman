"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Order = {
  id: string; total: number; status: string; createdAt: string;
  user: { name: string | null; email: string | null };
  items: { product: { name: string } }[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor", PAID: "Ödendi", PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda", DELIVERED: "Teslim", CANCELLED: "İptal",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800", PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800", SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
};
const STATUSES = ["", "PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = (s = status, p = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p) });
    if (s) params.set("status", s);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders); setTotal(d.total); setPages(d.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = (s: string) => { setStatus(s); setPage(1); load(s, 1); };
  const handlePage = (p: number) => { setPage(p); load(status, p); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} sipariş</p>
        </div>
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <button
              key={s || "all"}
              onClick={() => handleStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${status === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >
              {s ? STATUS_LABELS[s] : "Tümü"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Sipariş No</th>
                  <th className="text-left px-5 py-3 font-medium">Müşteri</th>
                  <th className="text-left px-5 py-3 font-medium">Ürünler</th>
                  <th className="text-left px-5 py-3 font-medium">Tutar</th>
                  <th className="text-left px-5 py-3 font-medium">Durum</th>
                  <th className="text-left px-5 py-3 font-medium">Tarih</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{o.user.name || "—"}</p>
                      <p className="text-xs text-gray-400">{o.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs max-w-[180px] truncate">
                      {o.items.map((i) => i.product.name).join(", ")}
                    </td>
                    <td className="px-5 py-3.5 font-semibold">{fmt(o.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/siparisler/${o.id}`} className="text-gray-400 hover:text-black transition-colors">
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-xs">Sipariş bulunamadı</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p} onClick={() => handlePage(p)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${page === p ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
