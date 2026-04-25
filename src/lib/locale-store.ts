"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "tr" | "en";

type LocaleStore = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

export const useLocale = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: "tr",
      setLocale: (l) => set({ locale: l }),
      toggle: () => set({ locale: get().locale === "tr" ? "en" : "tr" }),
    }),
    { name: "uy-locale" }
  )
);
