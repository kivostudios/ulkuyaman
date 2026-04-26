import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "İade ve Cayma Hakkı | Ülkü Yaman" };

export default function IadeCaymaPage() {
  return (
    <LegalPage title="Teslimat, İade ve Cayma Hakkı" updatedAt="2026">
      <h2>1. Teslimat</h2>
      <p>
        Siparişleriniz, ödemenin onaylanmasının ardından genellikle <strong>1-3 iş günü</strong>{" "}
        içinde anlaşmalı kargo şirketine teslim edilir. Türkiye geneline kargo süresi 1-3 iş günü
        arasıdır. Hafta sonu ve resmi tatillerde kargo işlem görmemektedir.
      </p>
      <p>
        Kargo ücreti sepet sayfasında ve ödeme aşamasında açıkça belirtilir. Ürün adresinize
        ulaştığında kargonun sağlam ve kapalı olduğundan emin olunuz; aksi halde tutanak tutturarak
        kargoyu teslim almayınız.
      </p>

      <h2>2. Cayma Hakkı (14 Gün)</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca
        tüketici, ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde herhangi bir
        gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
      </p>

      <h3>Cayma hakkının kullanılamayacağı haller</h3>
      <ul>
        <li>Kişiye özel hazırlanan ürünler</li>
        <li>Açıldığında iadesi sağlık veya hijyen açısından uygun olmayan ürünler (ambalajı açılmış)</li>
        <li>
          Tüketicinin kullanımına bağlı olarak değer kaybeden, yıpranan ürünler (giyilmiş /
          etiketleri çıkarılmış)
        </li>
      </ul>

      <h2>3. İade Süreci</h2>
      <ol>
        <li>
          Ürünü teslim aldığınız tarihten itibaren 14 gün içinde{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adresine sipariş numaranız ile
          birlikte iade talebinizi iletin.
        </li>
        <li>
          Ürünü, faturası ve orijinal ambalajı ile birlikte, anlaşmalı kargo şirketi (bilgisi
          tarafımızca paylaşılacaktır) üzerinden gönderin. Anlaşmalı kargo dışında bir şirketle
          gönderilen iadelerde kargo ücreti tarafınıza aittir.
        </li>
        <li>
          Ürün tarafımıza ulaşıp incelendikten sonra, iadenin uygun bulunması halinde ödemeniz{" "}
          <strong>14 gün içinde</strong> aynı ödeme aracına iade edilir.
        </li>
      </ol>

      <h2>4. Değişim</h2>
      <p>
        Numara veya renk değişimi taleplerinizi 14 gün içinde tarafımıza iletebilirsiniz. Değişim
        sürecinde stok durumuna göre yönlendirme yapılır.
      </p>

      <h2>5. Defolu / Yanlış Ürün</h2>
      <p>
        Defolu, hatalı veya yanlış ürün ulaşması durumunda lütfen 7 gün içinde fotoğraf ile birlikte{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adresine bildirim yapınız. Bu
        durumda kargo ücreti tarafımıza aittir.
      </p>

      <h2>6. İletişim</h2>
      <p>
        Soru ve talepleriniz için:
        <br />
        E-posta: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        <br />
        Telefon: {COMPANY.phone}
      </p>
    </LegalPage>
  );
}
