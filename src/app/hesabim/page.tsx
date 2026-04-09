import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddressSection from "./AddressSection";
import { Package, MapPin, Heart, LogOut } from "lucide-react";

export const metadata = { title: "Hesabım | Ülkü Yaman Collection" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  const statusLabels: Record<string, string> = {
    PENDING: "Beklemede",
    PAYMENT_FAILED: "Ödeme Başarısız",
    PAID: "Ödendi",
    PREPARING: "Hazırlanıyor",
    SHIPPED: "Kargoya Verildi",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal Edildi",
    REFUNDED: "İade Edildi",
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-600 bg-yellow-50",
    PAYMENT_FAILED: "text-red-600 bg-red-50",
    PAID: "text-blue-600 bg-blue-50",
    PREPARING: "text-orange-600 bg-orange-50",
    SHIPPED: "text-purple-600 bg-purple-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-gray-600 bg-gray-100",
    REFUNDED: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-light mb-10">Hesabım</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside>
          <div className="flex items-center gap-4 mb-8 p-5 bg-gray-50">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || ""}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-sm">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { icon: Package, label: "Siparişlerim", href: "/siparisler" },
              { icon: MapPin, label: "Adreslerim", href: "#adresler" },
              { icon: Heart, label: "Favorilerim", href: "/favoriler" },
              { icon: LogOut, label: "Çıkış Yap", href: "/api/auth/signout" },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-10">
          {/* Son siparişler */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium">Son Siparişler</h2>
              <Link href="/siparisler" className="text-xs tracking-widest text-gray-500 hover:text-black uppercase">
                Tümünü Gör
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="bg-gray-50 text-center py-12">
                <Package size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Henüz siparişiniz bulunmuyor.</p>
                <Link href="/kategori/sandaletler" className="text-sm underline mt-2 inline-block">
                  Alışverişe başla
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 p-5">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Sipariş #{order.id.slice(-8).toUpperCase()} ·{" "}
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                        <p className="font-semibold">
                          ₺{order.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="relative w-14 h-16 bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || ""}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-14 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Adresler */}
          <section id="adresler">
            <h2 className="text-lg font-medium mb-5">Kayıtlı Adresler</h2>
            <AddressSection initialAddresses={addresses} />
          </section>
        </div>
      </div>
    </div>
  );
}
