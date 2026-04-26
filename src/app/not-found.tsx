import Link from "next/link";

export const metadata = { title: "Sayfa Bulunamadı | Ülkü Yaman Collection" };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <p className="text-[11px] tracking-[0.3em] text-black/40 uppercase mb-6">
          404 — Sayfa Bulunamadı
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-5">
          Aradığın sayfayı bulamadık.
        </h1>
        <p className="text-sm text-black/60 mb-10 leading-relaxed">
          Bağlantı kırılmış olabilir veya sayfa kaldırılmış olabilir. Aşağıdan kollesiyona göz atabilir
          veya anasayfaya dönebilirsin.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-7 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:opacity-90"
          >
            Anasayfa
          </Link>
          <Link
            href="/sandaletler"
            className="border border-black px-7 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-black hover:text-white transition-colors"
          >
            Tüm Sandaletler
          </Link>
        </div>
      </div>
    </div>
  );
}
