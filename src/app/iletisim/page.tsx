import Link from "next/link";
import { Mail, Phone, MapPin, AtSign, Clock } from "lucide-react";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "İletişim | Ülkü Yaman Collection" };

export default function IletisimPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
      <nav className="text-xs text-gray-400 mb-6 flex gap-2">
        <Link href="/" className="hover:text-black">Anasayfa</Link>
        <span>/</span>
        <span className="text-black">İletişim</span>
      </nav>
      <h1 className="text-4xl font-light tracking-wide mb-3">İletişim</h1>
      <p className="text-sm text-gray-600 max-w-xl mb-12">
        Sorularınız, sipariş takibi, iade ve değişim talepleri için bize aşağıdaki kanallardan
        ulaşabilirsiniz. Genelde aynı gün içinde yanıtlıyoruz.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex gap-4">
            <Phone size={20} className="text-black/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Telefon</p>
              <a
                href={`tel:${COMPANY.phone.replaceAll(" ", "")}`}
                className="text-base font-medium hover:underline"
              >
                {COMPANY.phone}
              </a>
              <p className="text-xs text-black/50 mt-1">Hafta içi 09:00 — 18:00</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Mail size={20} className="text-black/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">E-posta</p>
              <a href={`mailto:${COMPANY.email}`} className="text-base font-medium hover:underline">
                {COMPANY.email}
              </a>
              <p className="text-xs text-black/50 mt-1">24 saat içinde dönüş yaparız</p>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin size={20} className="text-black/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Atölye</p>
              <p className="text-base font-medium leading-relaxed">{COMPANY.address}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <AtSign size={20} className="text-black/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Instagram</p>
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium hover:underline"
              >
                @ulkuyamancollection
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock size={20} className="text-black/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-black/50 mb-1">Çalışma Saatleri</p>
              <p className="text-base">
                Pazartesi — Cumartesi: 09:00 — 18:00
                <br />
                Pazar: Kapalı
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f5f3ee] p-8 md:p-10">
          <h2 className="text-lg font-medium tracking-wide mb-4">Hızlı Yardım</h2>
          <p className="text-sm text-black/75 mb-6 leading-relaxed">
            Sorunuz aşağıdaki konulardan biri ise, ilgili sayfada hemen cevabını bulabilirsin.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              ["Siparişim ne zaman kargoya verilir?", "/iade-cayma#teslimat"],
              ["Ürünü iade etmek istiyorum", "/iade-cayma"],
              ["Hesabım & adreslerim", "/hesabim"],
              ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis"],
              ["KVKK / kişisel verilerim", "/kvkk"],
              ["Çerez tercihleri", "/cerez"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center justify-between border-b border-black/10 py-2 hover:text-black/60"
                >
                  <span>{label}</span>
                  <span className="text-black/40">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
