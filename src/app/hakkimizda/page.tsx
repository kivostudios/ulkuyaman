import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | Ülkü Yaman Collection",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] bg-gray-100 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1600&q=85"
          alt="Ülkü Yaman Hakkımızda"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/70 text-xs tracking-[0.4em] uppercase mb-3">Hikayemiz</p>
          <h1 className="text-white text-4xl md:text-6xl font-light">Hakkımızda</h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">Biz Kimiz</p>
            <h2 className="text-4xl font-light leading-snug mb-6">
              Manisa&apos;dan<br />
              <span className="font-semibold">Dünyaya Kalite</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Ülkü Yaman Collection, Manisa&apos;nın Yunusemre ilçesinde başlayan bir tutkun ürünüdür.
                Yıllar içinde büyüyen bu koleksiyon, günlük yaşamın koşuşturmacasında şık ve rahat olan
                herşeyi sunmayı hedefliyor.
              </p>
              <p>
                Her ürünümüz, sertifikalı hakiki deri ile titizlikle üretilmektedir. Ayakkabıdan çantaya,
                sandaletten bota uzanan geniş koleksiyonumuzda kalite her zaman ön plandadır.
              </p>
              <p>
                Türkiye&apos;nin dört bir yanına hızlı kargo ile ulaştırdığımız ürünlerimiz, müşteri
                memnuniyetini her zaman birinci sırada tutarak tasarlanmaktadır.
              </p>
            </div>
          </div>
          <div className="relative aspect-square bg-gray-100 img-hover">
            <Image
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=85"
              alt="Koleksiyon"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-3">Değerlerimiz</p>
            <h2 className="text-3xl font-light">Bizi Biz Yapan</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Kalite",
                desc: "Tüm ürünlerimiz sertifikalı hakiki deri ile üretilmektedir. Malzeme seçiminden üretimine kadar her aşamada kalite önceliğimizdir.",
                icon: "✦",
              },
              {
                title: "Şıklık",
                desc: "Modern tasarım anlayışı ile zamansız şıklığı birleştiriyoruz. Her sezon, güncel trendleri konfor ile buluşturan yeni koleksiyonlar sunuyoruz.",
                icon: "◆",
              },
              {
                title: "Güven",
                desc: "90 günlük koşulsuz iade politikamız ve 14 günlük değişim garantimizle alışverişinizi güvence altına alıyoruz.",
                icon: "●",
              },
            ].map((v) => (
              <div key={v.title} className="text-center p-8 bg-white">
                <span className="text-2xl mb-4 block">{v.icon}</span>
                <h3 className="text-lg font-semibold mb-3">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "10+", label: "Yıllık Deneyim" },
            { num: "5.000+", label: "Mutlu Müşteri" },
            { num: "200+", label: "Ürün Çeşidi" },
            { num: "90 Gün", label: "İade Garantisi" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-light mb-2">{stat.num}</p>
              <p className="text-xs tracking-widest uppercase text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">İletişim</p>
            <h2 className="text-3xl font-light mb-8">Bize Ulaşın</h2>
            <div className="space-y-6">
              {[
                { label: "Telefon", value: "+90 507 453 01 66" },
                { label: "E-posta", value: "info@ulkuyamancollection.com" },
                { label: "Adres", value: "Güzelyurt Mah. 5749 Sok. No: 10/A, Yunusemre / Manisa" },
                { label: "Çalışma Saatleri", value: "Hafta içi 09:00 - 18:00" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 tracking-wider uppercase mb-1">{item.label}</p>
                  <p className="text-sm text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8">
            <h3 className="text-lg font-medium mb-6">Mesaj Gönderin</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Adınız"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <textarea
                rows={4}
                placeholder="Mesajınız"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
              />
              <button className="w-full bg-black text-white py-3 text-sm tracking-widest uppercase font-semibold hover:bg-gray-800 transition-colors">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3">Keşfet</p>
        <h2 className="text-3xl font-light mb-6">Koleksiyonumuzu Görün</h2>
        <Link
          href="/kategori/sandaletler"
          className="inline-flex items-center gap-3 border border-white text-white px-10 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors font-semibold"
        >
          Alışverişe Başla <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
