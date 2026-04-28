"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <h2
              className="leading-none mb-4"
              style={{ fontFamily: "var(--font-bodoni), 'Times New Roman', serif" }}
            >
              <span className="block text-[30px] tracking-[0.02em] font-medium">Ülkü Yaman</span>
              <span
                className="block text-[11px] tracking-[0.44em] uppercase mt-1.5 text-white/70"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 600 }}
              >
                Collection
              </span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">{t.footerBrandBlurb}</p>
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

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              {t.footerShopHeading}
            </h3>
            <ul className="space-y-3">
              {[
                [t.footerAllSandals, "/sandaletler"],
                [t.footerNewArrivals, "/sandaletler?yeni=1"],
                [t.footerOnSale, "/sandaletler?indirim=1"],
                [t.footerBestsellers, "/sandaletler?siralama=popular"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              {t.footerHelpHeading}
            </h3>
            <ul className="space-y-3">
              {[
                [t.footerContactPage, "/iletisim"],
                [t.footerAboutPage, "/hakkimizda"],
                [t.footerShippingReturns, "/iade-cayma"],
                [t.footerDistanceContract, "/mesafeli-satis"],
                [t.footerPrivacy, "/gizlilik"],
                [t.footerKvkk, "/kvkk"],
                [t.footerCookies, "/cerez"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-5 text-gray-200">
              {t.footerContactHeading}
            </h3>
            <a href="tel:+905074530166" className="text-sm text-gray-300 hover:text-white block mb-3">
              +90 507 453 01 66
            </a>
            <a
              href="mailto:info@ulkuyamancollection.com"
              className="text-sm text-gray-300 hover:text-white break-all block mb-3"
            >
              info@ulkuyamancollection.com
            </a>
            <p className="text-sm text-gray-300">
              Güzelyurt Mah. 5749 Sok. No: 10/A,
              <br />
              Yunusemre / Manisa
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Ülkü Yaman Collection. {t.footerCopyright}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/gizlilik" className="hover:text-white">
              {t.footerPrivacy}
            </Link>
            <Link href="/kvkk" className="hover:text-white">
              {t.footerKvkk}
            </Link>
            <Link href="/cerez" className="hover:text-white">
              {t.footerCookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
