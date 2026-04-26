import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Gizlilik Politikası | Ülkü Yaman" };

export default function GizlilikPage() {
  return (
    <LegalPage title="Gizlilik Politikası" updatedAt="2026">
      <p>
        Bu Gizlilik Politikası, {COMPANY.legalName} (&quot;Şirket&quot;, &quot;biz&quot;) tarafından
        işletilen{" "}
        <a href={COMPANY.website}>{COMPANY.website}</a> sitesini kullandığınızda kişisel
        verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
      </p>

      <h2>1. Topladığımız Bilgiler</h2>
      <ul>
        <li>
          <strong>Hesap bilgileri:</strong> Google ile giriş yaptığınızda ad, soyad, e-posta ve profil
          fotoğrafı.
        </li>
        <li>
          <strong>Sipariş bilgileri:</strong> Adres, telefon, T.C. kimlik no, sipariş içeriği, ödeme
          durumu. Kart bilgileri tarafımızca saklanmaz; ödeme {`{`} altyapı sağlayıcımız iyzico {`}`}{" "}
          tarafından işlenir.
        </li>
        <li>
          <strong>Otomatik bilgiler:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar,
          referans URL.
        </li>
        <li>
          <strong>Çerezler:</strong> Detaylar için <a href="/cerez">Çerez Politikası</a> sayfamıza
          bakınız.
        </li>
      </ul>

      <h2>2. Bilgileri Nasıl Kullanırız</h2>
      <ul>
        <li>Siparişinizi işlemek, ödeme almak ve teslim etmek</li>
        <li>Müşteri hizmetleri ve iletişim</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek (vergi, fatura)</li>
        <li>Sitenin güvenliğini ve performansını sağlamak</li>
        <li>Açık rızanızla pazarlama iletişimi göndermek</li>
      </ul>

      <h2>3. Bilgileri Kimlerle Paylaşırız</h2>
      <p>Verileriniz aşağıdaki üçüncü taraflarla, yalnızca hizmet sunumu için gerekli ölçüde paylaşılır:</p>
      <ul>
        <li>Ödeme: iyzico Ödeme Hizmetleri A.Ş.</li>
        <li>Hosting: Vercel Inc.</li>
        <li>Veri tabanı / dosya: Supabase</li>
        <li>E-posta gönderimi: Resend / SMTP sağlayıcı</li>
        <li>Kimlik doğrulama: Google LLC</li>
        <li>Kargo şirketi (gönderi adresi)</li>
      </ul>

      <h2>4. Saklama Süresi</h2>
      <p>
        Sipariş ve fatura kayıtları Vergi Usul Kanunu uyarınca en az 5 yıl saklanır. Pazarlama
        izinleri, izniniz geri alınana kadar korunur. Hesabınızı sildirmek için bizimle iletişime
        geçebilirsiniz.
      </p>

      <h2>5. Güvenlik</h2>
      <p>
        Verilerinizi yetkisiz erişime karşı korumak için endüstri standardı önlemler (HTTPS, parola
        hashleme, erişim kontrolü) uygularız. Mutlak güvenlik garantisi vermek mümkün olmasa da
        herhangi bir ihlal halinde KVKK&apos;nın gerektirdiği bildirimleri zamanında yaparız.
      </p>

      <h2>6. Çocukların Gizliliği</h2>
      <p>
        Sitemiz 18 yaşından küçüklere yönelik değildir. Bilerek 18 yaş altı bireylerden veri
        toplamayız.
      </p>

      <h2>7. Politikadaki Değişiklikler</h2>
      <p>
        Bu politika güncellenebilir. Önemli değişikliklerde sayfanın üstünde yer alan tarih
        güncellenir ve gerektiğinde e-posta ile bilgilendirme yapılır.
      </p>

      <h2>8. İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPage>
  );
}
