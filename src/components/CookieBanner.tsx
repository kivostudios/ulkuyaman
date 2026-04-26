"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "uy_cookie_consent_v1";

type Consent = "all" | "necessary";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) setOpen(true);
    } catch {
      // localStorage erişimi engellenmişse banner'ı yine de göster
      setOpen(true);
    }
  }, []);

  function decide(value: Consent) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, at: new Date().toISOString() })
      );
    } catch {
      /* noop */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60] bg-white border border-black/15 shadow-2xl">
      <div className="p-5">
        <h3 className="text-sm font-semibold tracking-wide mb-2">
          Çerez Tercihleri
        </h3>
        <p className="text-xs text-black/70 leading-relaxed">
          Sitemizde, deneyiminizi geliştirmek, alışverişi sürdürmek ve performansı ölçmek için
          çerezler kullanıyoruz. Detaylar için{" "}
          <Link href="/cerez" className="underline">
            Çerez Politikası
          </Link>{" "}
          ve{" "}
          <Link href="/gizlilik" className="underline">
            Gizlilik Politikası
          </Link>{" "}
          sayfalarımıza bakabilirsin.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => decide("necessary")}
            className="flex-1 border border-black/20 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:border-black"
          >
            Sadece Gerekli
          </button>
          <button
            onClick={() => decide("all")}
            className="flex-1 bg-black text-white px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:opacity-90"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
