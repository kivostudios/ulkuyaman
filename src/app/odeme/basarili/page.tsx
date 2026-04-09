import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";

export const metadata = { title: "Sipariş Alındı | Ülkü Yaman Collection" };

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <CheckCircle size={56} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-light mb-3">Siparişiniz Alındı!</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Ödemeniz başarıyla tamamlandı. Siparişiniz hazırlanmaya başlanacak ve en kısa sürede kargoya verilecektir.
      </p>

      <div className="bg-gray-50 p-6 mb-8">
        <div className="flex items-center gap-3 justify-center text-sm text-gray-600">
          <Package size={18} />
          <span>Kargo takibi için e-posta adresinizi kontrol edin.</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/hesabim"
          className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors"
        >
          Siparişlerim
        </Link>
        <Link
          href="/"
          className="border border-gray-300 px-8 py-3 text-sm tracking-widest uppercase hover:border-black transition-colors"
        >
          Anasayfa
        </Link>
      </div>
    </div>
  );
}
