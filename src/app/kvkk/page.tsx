import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "KVKK Aydınlatma Metni | Ülkü Yaman" };

export default function KvkkPage() {
  return (
    <LegalPage title="KVKK Aydınlatma Metni" updatedAt="2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verilerinizin
        veri sorumlusu sıfatıyla {COMPANY.legalName} (&quot;Şirket&quot;) tarafından aşağıda açıklanan
        kapsamda işlenebileceğini bilgilerinize sunarız.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        {COMPANY.legalName}<br />
        Adres: {COMPANY.address}<br />
        E-posta: {COMPANY.email}<br />
        Telefon: {COMPANY.phone}
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>Kimlik bilgileri (ad, soyad, T.C. kimlik no — fatura için)</li>
        <li>İletişim bilgileri (e-posta, telefon, adres)</li>
        <li>Müşteri işlem bilgileri (sipariş geçmişi, ödeme bilgileri — kart bilgileri saklanmaz)</li>
        <li>İşlem güvenliği bilgileri (IP, çerez, oturum)</li>
        <li>Pazarlama bilgileri (bülten aboneliği, alışveriş tercihleri)</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Sipariş, ödeme ve teslimat süreçlerinin yürütülmesi</li>
        <li>Müşteri ilişkileri ve iletişim faaliyetlerinin sürdürülmesi</li>
        <li>Yasal yükümlülüklerin (faturalandırma, vergi mevzuatı) yerine getirilmesi</li>
        <li>Bilgi güvenliği ve dolandırıcılık önleme</li>
        <li>Açık rıza halinde pazarlama ve kampanya bilgilendirmeleri</li>
      </ul>

      <h2>4. Aktarım</h2>
      <p>
        Kişisel verileriniz; ödeme hizmet sağlayıcısı (iyzico Ödeme Hizmetleri A.Ş.), kargo şirketi,
        e-posta gönderim altyapısı, hosting ve veri tabanı sağlayıcıları (Vercel, Supabase) gibi yurt
        içi ve yurt dışı tedarikçilere, yalnızca hizmetin sunulması için gerekli olduğu ölçüde
        aktarılabilir.
      </p>

      <h2>5. KVKK Madde 11 Kapsamındaki Haklarınız</h2>
      <p>İlgili kişi olarak Şirketimize başvurarak;</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içi/yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>KVKK md. 7&apos;de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
        <li>Aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
        <li>Otomatik analiz sonucu aleyhinize bir sonuç doğmasına itiraz etme</li>
        <li>Kanuna aykırı işleme nedeniyle zarara uğrarsanız zararın giderilmesini talep etme</li>
      </ul>

      <h2>6. Başvuru</h2>
      <p>
        Yukarıdaki haklarınızı kullanmak için <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>{" "}
        adresine başvurabilir veya yazılı olarak {COMPANY.address} adresine başvurunuzu
        iletebilirsiniz. Başvurularınız Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ
        kapsamında en geç 30 gün içinde sonuçlandırılır.
      </p>
    </LegalPage>
  );
}
