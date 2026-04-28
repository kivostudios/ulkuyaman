"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "tr" | "en";

type LocaleStore = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

// Server component'lerin locale'i okuyabilmesi icin localStorage yaninda
// document.cookie'ye de yaziyoruz (uy-locale=tr|en).
function setLocaleCookie(l: Locale) {
  if (typeof document === "undefined") return;
  // 1 yil
  document.cookie = `uy-locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export const useLocale = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: "tr",
      setLocale: (l) => {
        setLocaleCookie(l);
        set({ locale: l });
      },
      toggle: () => {
        const next = get().locale === "tr" ? "en" : "tr";
        setLocaleCookie(next);
        set({ locale: next });
      },
    }),
    {
      name: "uy-locale",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Sayfa yuklendiginde cookie'yi de senkronize et
        if (state?.locale) setLocaleCookie(state.locale);
      },
    }
  )
);
