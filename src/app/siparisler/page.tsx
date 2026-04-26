import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";

export const metadata = { title: "Siparişlerim | Ülkü Yaman Collection" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Beklemede",
  PAYMENT_FAILED: "Ödeme Başarısız",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  PAYMENT_FAILED: "text-red-700 bg-red-50",
  PAID: "text-blue-700 bg-blue-50",
  PREPARING: "text-orange-700 bg-orange-50",
  SHIPPED: "text-purple-700 bg-purple-50",
  DELIVERED: "text-green-700 bg-green-50",
  CANCELLED: "text-gray-700 bg-gray-100",
  REFUNDED: "text-gray-700 bg-gray-100",
};

export default async function SiparislerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris?callbackUrl=/siparisler");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
      <nav className="text-xs text-gray-400 mb-4 flex gap-2">
        <Link href="/hesabim" className="hover:text-black">Hesabım</Link>
        <span>/</span>
        <span className="text-black">Siparişlerim</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-10">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-50 text-center py-20 border border-dashed border-black/10">
          <Package size={36} className="mx-auto text-gray-300 mb-4" />
          <p className="text-sm text-gray-500 mb-3">Henüz siparişiniz bulunmuyor.</p>
          <Link href="/sandaletler" className="text-sm underline">
            Alışverişe başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/siparisler/${order.id}`}
              className="block border border-gray-100 p-5 hover:border-black/30 transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Sipariş #{order.id.slice(-8).toUpperCase()} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-semibold text-base">
                    ₺
                    {order.total.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.items.length} ürün
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 font-medium ${STATUS_COLOR[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {order.items.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="relative w-14 h-16 bg-gray-100 flex-shrink-0"
                  >
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="w-14 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    +{order.items.length - 5}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
