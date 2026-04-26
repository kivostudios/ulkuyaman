import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Sipariş Detayı | Ülkü Yaman Collection" };
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

export default async function SiparisDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/giris?callbackUrl=/siparisler/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const address = order.addressSnapshot as {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-16">
      <nav className="text-xs text-gray-400 mb-4 flex gap-2">
        <Link href="/hesabim" className="hover:text-black">Hesabım</Link>
        <span>/</span>
        <Link href="/siparisler" className="hover:text-black">Siparişlerim</Link>
        <span>/</span>
        <span className="text-black">#{order.id.slice(-8).toUpperCase()}</span>
      </nav>

      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide">
            Sipariş #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`text-xs px-3 py-2 font-medium ${STATUS_COLOR[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-3">Ürünler</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-gray-100 p-4"
            >
              <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                {item.product.images[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.color} · Beden: {item.size} · Adet: {item.quantity}
                </p>
                <p className="text-sm mt-2">
                  ₺{(item.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="border border-gray-100 p-5">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">
              Teslimat Adresi
            </h2>
            <p className="text-sm font-medium">{address.name}</p>
            <p className="text-sm text-gray-700 mt-1">{address.phone}</p>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {address.address}
              <br />
              {address.district}, {address.city} {address.postalCode ?? ""}
            </p>
          </div>

          <div className="border border-gray-100 p-5">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Özet</h2>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Ara toplam</dt>
                <dd>₺{subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Kargo</dt>
                <dd>
                  {order.shippingCost === 0
                    ? "Ücretsiz"
                    : `₺${order.shippingCost.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-2 mt-2 font-semibold">
                <dt>Toplam</dt>
                <dd>₺{order.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</dd>
              </div>
            </dl>
          </div>

          <Link
            href="/iade-cayma"
            className="block text-center border border-black/15 px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold hover:border-black"
          >
            İade & Değişim
          </Link>
        </div>
      </div>
    </div>
  );
}
