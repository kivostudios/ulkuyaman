"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useT();
  const current = searchParams.get("siralama") ?? "yeni";

  const options = [
    { value: "yeni", label: t.sortNewest },
    { value: "fiyat-asc", label: t.sortPriceAsc },
    { value: "fiyat-desc", label: t.sortPriceDesc },
    { value: "popular", label: t.sortPopular },
  ];

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "yeni") params.delete("siralama");
    else params.set("siralama", value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-[12px] text-black/70">
      <span className="tracking-[0.18em] uppercase">{t.sortBy}</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-black/30 bg-transparent py-1 pr-6 text-[13px] outline-none focus:border-black cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
