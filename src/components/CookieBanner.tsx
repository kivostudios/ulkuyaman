"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

const STORAGE_KEY = "uy_cookie_consent_v1";

type Consent = "all" | "necessary";

export default function CookieBanner() {
  const { t } = useT();
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
          {t.footerCookies}
        </h3>
        <p className="text-xs text-black/70 leading-relaxed">
          {t.cookieBannerText}{" "}
          <Link href="/cerez" className="underline">
            {t.cookieBannerLearn}
          </Link>
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => decide("necessary")}
            className="flex-1 border border-black/20 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:border-black"
          >
            {t.cookieBannerReject}
          </button>
          <button
            onClick={() => decide("all")}
            className="flex-1 bg-black text-white px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:opacity-90"
          >
            {t.cookieBannerAccept}
          </button>
        </div>
      </div>
    </div>
  );
}
