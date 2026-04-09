import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Ödeme Başarısız | Ülkü Yaman Collection" };

export default function FailPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <XCircle size={56} className="mx-auto text-red-500 mb-6" />
      <h1 className="text-3xl font-light mb-3">Ödeme Başarısız</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Ödeme işleminiz tamamlanamadı. Kart bilgilerinizi kontrol ederek tekrar deneyebilirsiniz. Sepetinizdeki ürünler korunmaktadır.
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/odeme"
          className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors"
        >
          Tekrar Dene
        </Link>
        <Link
          href="/sepet"
          className="border border-gray-300 px-8 py-3 text-sm tracking-widest uppercase hover:border-black transition-colors"
        >
          Sepete Dön
        </Link>
      </div>
    </div>
  );
}
