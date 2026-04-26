import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] uppercase mb-4">
              Ülkü Yaman
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri.
              Sade, dayanıklı, ayırt edilebilir.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/ulkuyamancollection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>

          {/* Alışveriş */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              Alışveriş
            </h3>
            <ul className="space-y-3">
              {[
                ["Tüm Sandaletler", "/sandaletler"],
                ["Yeni Gelenler", "/sandaletler?yeni=1"],
                ["İndirimde", "/sandaletler?indirim=1"],
                ["Çok Satanlar", "/sandaletler?siralama=popular"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              Yardım
            </h3>
            <ul className="space-y-3">
              {[
                ["İletişim", "/iletisim"],
                ["Hakkımızda", "/hakkimizda"],
                ["Teslimat & İade", "/iade-cayma"],
                ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis"],
                ["Ön Bilgilendirme Formu", "/on-bilgilendirme"],
                ["Gizlilik Politikası", "/gizlilik"],
                ["KVKK Aydınlatma Metni", "/kvkk"],
                ["Çerez Politikası", "/cerez"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              İletişim
            </h3>
            <p className="text-xs text-gray-500 mb-1">Telefon</p>
            <a href="tel:+905074530166" className="text-sm text-gray-300 hover:text-white">
              +90 507 453 01 66
            </a>
            <p className="text-xs text-gray-500 mt-3 mb-1">E-posta</p>
            <a
              href="mailto:info@ulkuyamancollection.com"
              className="text-sm text-gray-300 hover:text-white break-all"
            >
              info@ulkuyamancollection.com
            </a>
            <p className="text-xs text-gray-500 mt-3 mb-1">Adres</p>
            <p className="text-sm text-gray-300">
              Güzelyurt Mah. 5749 Sok. No: 10/A,
              <br />
              Yunusemre / Manisa
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Ülkü Yaman Collection. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/gizlilik" className="hover:text-white">
              Gizlilik
            </Link>
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <Link href="/cerez" className="hover:text-white">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
