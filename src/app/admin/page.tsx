"use client";
import { useEffect, useState } from "react";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Stats = {
  revenue: { total: number; month: number; lastMonth: number; growth: string | null };
  orders: { total: number; month: number };
  users: { total: number; month: number };
  products: { active: number };
  recentOrders: {
    id: string; total: number; status: string; createdAt: string;
    user: { name: string | null; email: string | null; image: string | null };
    items: { product: { name: string } }[];
  }[];
  ordersByStatus: { status: string; _count: { status: number } }[];
  chartData: { day: string; gelir: number }[];
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

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!stats) return <p className="text-red-500">Veriler yüklenemedi.</p>;

  const cards = [
    {
      label: "Toplam Gelir",
      value: fmt(stats.revenue.total),
      sub: `Bu ay: ${fmt(stats.revenue.month)}`,
      icon: DollarSign,
      growth: stats.revenue.growth,
    },
    {
      label: "Toplam Sipariş",
      value: stats.orders.total.toLocaleString("tr-TR"),
      sub: `Bu ay: ${stats.orders.month} sipariş`,
      icon: ShoppingBag,
      growth: null,
    },
    {
      label: "Toplam Kullanıcı",
      value: stats.users.total.toLocaleString("tr-TR"),
      sub: `Bu ay: ${stats.users.month} yeni`,
      icon: Users,
      growth: null,
    },
    {
      label: "Aktif Ürün",
      value: stats.products.active.toLocaleString("tr-TR"),
      sub: "Şu an satışta",
      icon: Package,
      growth: null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Satış ve sipariş özeti</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, growth }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-black">{value}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-500">{sub}</span>
              {growth && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${parseFloat(growth) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {parseFloat(growth) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(parseFloat(growth))}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Status */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Son 7 Gün Gelir</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="gelirGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Area type="monotone" dataKey="gelir" stroke="#000" strokeWidth={2} fill="url(#gelirGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Sipariş Durumları</h2>
          <div className="space-y-2.5">
            {stats.ordersByStatus.map(({ status, _count }) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
                  {STATUS_LABELS[status] || status}
                </span>
                <span className="text-sm font-semibold text-black">{_count.status}</span>
              </div>
            ))}
            {stats.ordersByStatus.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Henüz sipariş yok</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold">Son Siparişler</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium">Müşteri</th>
              <th className="text-left px-5 py-3 font-medium">Ürünler</th>
              <th className="text-left px-5 py-3 font-medium">Tutar</th>
              <th className="text-left px-5 py-3 font-medium">Durum</th>
              <th className="text-left px-5 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-black">{order.user.name || "—"}</p>
                  <p className="text-xs text-gray-400">{order.user.email}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-600 text-xs max-w-[200px] truncate">
                  {order.items.map((i) => i.product.name).join(", ")}
                </td>
                <td className="px-5 py-3.5 font-semibold">{fmt(order.total)}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">Henüz sipariş yok</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
