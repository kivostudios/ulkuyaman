import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Çerez Politikası | Ülkü Yaman" };

export default function CerezPage() {
  return (
    <LegalPage title="Çerez Politikası" updatedAt="2026">
      <p>
        Bu Çerez Politikası, {COMPANY.legalName} olarak{" "}
        <a href={COMPANY.website}>{COMPANY.website}</a> üzerinde kullandığımız çerezleri açıklar.
      </p>

      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerez, bir web sitesini ziyaret ettiğinizde tarayıcınıza yerleştirilen küçük bir metin
        dosyasıdır. Çerezler, oturumun sürdürülmesi, tercihlerinizin hatırlanması, sitenin
        performansının ölçülmesi gibi amaçlarla kullanılır.
      </p>

      <h2>2. Kullandığımız Çerez Türleri</h2>
      <h3>Zorunlu Çerezler</h3>
      <p>
        Site temel işlevleri için gereklidir (giriş oturumu, sepet, güvenlik). Bu çerezler
        kapatılamaz.
      </p>

      <h3>Performans / Analiz Çerezleri</h3>
      <p>
        Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardım eder (Google Analytics gibi).
        İstatistik amaçlıdır, kişisel kimlik tespiti yapmaz.
      </p>

      <h3>Pazarlama Çerezleri</h3>
      <p>
        Reklam görüntüleyebilmek ve reklam etkinliğini ölçmek için kullanılır (Meta Pixel gibi).
        Yalnızca açık rızanız ile etkinleştirilir.
      </p>

      <h2>3. Çerez Tercihlerinizi Yönetme</h2>
      <p>
        Site açılışında çıkan çerez bandı üzerinden tercihinizi belirleyebilirsiniz. Tarayıcınızın
        ayarlarından da çerezleri silebilir veya engelleyebilirsiniz; ancak bu durumda sitenin bazı
        özellikleri çalışmayabilir.
      </p>
      <ul>
        <li>
          Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve diğer site verileri
        </li>
        <li>Safari: Tercihler → Gizlilik → Çerezleri Yönet</li>
        <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
      </ul>

      <h2>4. İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPage>
  );
}
