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
              Günlük yaşamın koşuşturmacasında şık ve rahat olan herşey.
              Manisa&apos;dan Türkiye&apos;ye, hakiki deri kalitesi.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/ulkuyamancollection" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="text-sm font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Koleksiyonlar */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              Koleksiyonlar
            </h3>
            <ul className="space-y-3">
              {[
                ["Sandaletler", "/kategori/sandaletler"],
                ["Topuklu Ayakkabı", "/kategori/topuklu-ayakkabi"],
                ["Bot & Çizme", "/kategori/bot"],
                ["Sneakers", "/kategori/sneakers"],
                ["Çanta", "/kategori/canta"],
                ["Aksesuar", "/kategori/aksesuar"],
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
                ["Teslimat Koşulları", "/teslimat"],
                ["İptal & İade", "/iade"],
                ["Gizlilik Politikası", "/gizlilik"],
                ["Mesafeli Satış Sözleşmesi", "/sozlesme"],
                ["İletişim", "/iletisim"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim & Bülten */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              Bülten
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Yeni koleksiyonlar ve özel indirimler için abone olun.
            </p>
            <div className="flex border border-white/20 rounded-none">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 px-4 py-3 outline-none"
              />
              <button className="bg-white text-black text-xs tracking-widest uppercase px-4 font-semibold hover:bg-gray-100 transition-colors">
                Abone
              </button>
            </div>

            <div className="mt-8">
              <p className="text-xs text-gray-500 mb-1">Telefon</p>
              <p className="text-sm text-gray-300">+90 507 453 01 66</p>
              <p className="text-xs text-gray-500 mt-3 mb-1">E-posta</p>
              <p className="text-sm text-gray-300">info@ulkuyamancollection.com</p>
              <p className="text-xs text-gray-500 mt-3 mb-1">Adres</p>
              <p className="text-sm text-gray-300">Güzelyurt Mah. 5749 Sok. No: 10/A, Yunusemre / Manisa</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-gray-500 gap-4">
          <p>© 2025 Ülkü Yaman Collection. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="/gizlilik" className="hover:text-white">Gizlilik</Link>
            <Link href="/sozlesme" className="hover:text-white">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
