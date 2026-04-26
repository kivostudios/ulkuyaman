import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Ön Bilgilendirme Formu | Ülkü Yaman" };

export default function OnBilgilendirmePage() {
  return (
    <LegalPage title="Ön Bilgilendirme Formu" updatedAt="2026">
      <p>
        İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği uyarınca, alıcının siparişi tamamlamadan önce sözleşme konusu mal ve
        hizmetlere ilişkin temel bilgilerden haberdar olmasını sağlamak amacıyla hazırlanmıştır.
      </p>

      <h2>1. Satıcı Bilgileri</h2>
      <p>
        Unvan: {COMPANY.legalName}<br />
        Adres: {COMPANY.address}<br />
        Telefon: {COMPANY.phone}<br />
        E-posta: {COMPANY.email}<br />
        Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNumber}
      </p>

      <h2>2. Sözleşme Konusu Mal/Hizmet</h2>
      <p>
        Sipariş özetinde yer alan ürünlerin tür, miktar, marka/model, renk, beden, satış fiyatı
        (KDV dahil) ve teslimat masrafları sipariş onayı sırasında alıcıya gösterilir.
      </p>

      <h2>3. Ödeme</h2>
      <p>
        Ödeme, sipariş onayı sırasında alıcı tarafından seçilen yöntemle (kredi kartı, banka kartı
        vb.) gerçekleştirilir. Kart bilgileri tarafımızca saklanmaz; ödeme işlemi anlaşmalı ödeme
        kuruluşu (iyzico Ödeme Hizmetleri A.Ş.) altyapısı üzerinden tamamlanır.
      </p>

      <h2>4. Teslimat</h2>
      <p>
        Ürün, ödemenin onayını takiben anlaşmalı kargo şirketi ile, alıcının belirttiği teslimat
        adresine en geç 30 gün içinde teslim edilir. Türkiye geneli için ortalama teslim süresi 1-5
        iş günüdür.
      </p>

      <h2>5. Cayma Hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin
        ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanımı ve
        prosedürü için <a href="/iade-cayma">İade ve Cayma Hakkı</a> sayfasına bakınız.
      </p>

      <h2>6. Cayma Hakkının Kullanılamayacağı Haller</h2>
      <ul>
        <li>Kişiye özel hazırlanan / üretilen ürünler</li>
        <li>Niteliği itibariyle iade edilmesi mümkün olmayan ürünler</li>
        <li>Kullanım sonrası giyilmiş, etiketleri çıkarılmış ürünler</li>
      </ul>

      <h2>7. Şikâyet ve İtirazlar</h2>
      <p>
        Şikâyet ve itirazlarınızı, ikametgahınızın bulunduğu yerdeki Tüketici Hakem Heyetlerine veya
        Tüketici Mahkemelerine, Sanayi ve Ticaret Bakanlığı tarafından her yıl belirlenen parasal
        sınırlar dahilinde başvurabilirsiniz.
      </p>

      <h2>8. Onay</h2>
      <p>
        Alıcı, ödeme aşamasında işbu Ön Bilgilendirme Formunu okuduğunu ve içeriğini onayladığını
        elektronik ortamda teyit eder.
      </p>
    </LegalPage>
  );
}
