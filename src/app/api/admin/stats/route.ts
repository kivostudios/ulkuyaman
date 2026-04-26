import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    totalOrders,
    monthOrders,
    totalUsers,
    monthUsers,
    totalProducts,
    recentOrders,
    ordersByStatus,
    revenueByDay,
  ] = await Promise.all([
    // Toplam gelir (ödenenler)
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
    // Bu ay gelir
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    }),
    // Geçen ay gelir
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { total: true },
    }),
    // Toplam sipariş
    prisma.order.count(),
    // Bu ay sipariş
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Toplam kullanıcı
    prisma.user.count(),
    // Bu ay yeni kullanıcı
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Aktif ürün
    prisma.product.count({ where: { active: true, deletedAt: null } }),
    // Son 10 sipariş
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, image: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
    // Durum dağılımı
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    // Son 7 günlük gelir
    prisma.order.findMany({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { total: true, createdAt: true },
    }),
  ]);

  // 7 günlük grafik verisi
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const revenueMap: Record<string, number> = {};
  revenueByDay.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10);
    revenueMap[day] = (revenueMap[day] || 0) + o.total;
  });

  const chartData = last7Days.map((day) => ({
    day: day.slice(5),
    gelir: Math.round(revenueMap[day] || 0),
  }));

  const revenueGrowth =
    lastMonthRevenue._sum.total && monthRevenue._sum.total
      ? (((monthRevenue._sum.total - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100).toFixed(1)
      : null;

  return NextResponse.json({
    revenue: {
      total: totalRevenue._sum.total || 0,
      month: monthRevenue._sum.total || 0,
      lastMonth: lastMonthRevenue._sum.total || 0,
      growth: revenueGrowth,
    },
    orders: { total: totalOrders, month: monthOrders },
    users: { total: totalUsers, month: monthUsers },
    products: { active: totalProducts },
    recentOrders,
    ordersByStatus,
    chartData,
  });
}
