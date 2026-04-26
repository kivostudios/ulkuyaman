import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Mesafeli Satış Sözleşmesi | Ülkü Yaman" };

export default function MesafeliSatisPage() {
  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi" updatedAt="2026">
      <p>
        İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri uyarınca düzenlenmiştir.
      </p>

      <h2>1. Taraflar</h2>
      <h3>Satıcı</h3>
      <p>
        Unvan: {COMPANY.legalName}<br />
        Adres: {COMPANY.address}<br />
        Telefon: {COMPANY.phone}<br />
        E-posta: {COMPANY.email}<br />
        Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNumber}<br />
        MERSİS: {COMPANY.mersis}
      </p>
      <h3>Alıcı</h3>
      <p>
        Sipariş sırasında belirtilen ad, soyad, adres ve iletişim bilgilerine sahip kişidir.
      </p>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu sözleşmenin konusu, alıcının satıcıya ait{" "}
        <a href={COMPANY.website}>{COMPANY.website}</a> internet sitesinden elektronik ortamda
        siparişini verdiği, sözleşmede nitelikleri ve satış fiyatı belirtilen ürünlerin satışı ve
        teslimi ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h2>3. Ürün, Fiyat ve Ödeme</h2>
      <p>
        Sözleşme konusu ürünlerin türü, miktarı, marka/modeli, satış fiyatı (KDV dahil), teslimat
        ücreti ve ödeme şekli sipariş özetinde yer almaktadır. Listelenen fiyatlar satış
        fiyatıdır; promosyonlar süreli olabilir. Ödeme, sipariş onayı sırasında belirtilen yöntemle
        gerçekleştirilir.
      </p>

      <h2>4. Teslimat</h2>
      <p>
        Ürün, ödemenin onayından sonra anlaşmalı kargo şirketi aracılığıyla, alıcının belirttiği
        teslimat adresine 1-5 iş günü içinde teslim edilir. Teslimat sırasındaki gecikmelerden kargo
        firması sorumludur.
      </p>

      <h2>5. Cayma Hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde herhangi bir
        gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma
        hakkının kullanımı, kullanılamayacağı haller ve iade prosedürü için{" "}
        <a href="/iade-cayma">İade ve Cayma Hakkı</a> sayfamıza bakınız.
      </p>

      <h2>6. Genel Hükümler</h2>
      <ul>
        <li>Alıcı, sözleşme konusu ürünün temel niteliklerini, satış fiyatını, ödeme şeklini ve teslimata ilişkin tüm ön bilgileri okuyup bilgi sahibi olduğunu kabul eder.</li>
        <li>Alıcı, ödeme ekranında işbu sözleşmeyi onayladığını teyit ederek elektronik onay verir.</li>
        <li>Ürün ile birlikte fatura alıcının belirttiği fatura adresine gönderilir.</li>
        <li>Sözleşme konusu ürün, alıcı dışında başka bir kişiye/kuruluşa teslim edilecek ise teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden satıcı sorumlu tutulamaz.</li>
        <li>Satıcı, mücbir sebepler veya kargonun aksaması gibi olağanüstü durumlarda teslimat süresi içinde ürünü teslim edemezse alıcıyı bilgilendirir.</li>
      </ul>

      <h2>7. Yetkili Mahkeme</h2>
      <p>
        İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığı tarafından ilan edilen değere
        kadar Tüketici Hakem Heyetleri ile alıcının veya satıcının yerleşim yerindeki Tüketici
        Mahkemeleri yetkilidir.
      </p>

      <h2>8. Yürürlük</h2>
      <p>
        Alıcı, siparişin verilmesi ile birlikte işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
      </p>
    </LegalPage>
  );
}
