"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "yeni", label: "Yeni gelenler" },
  { value: "fiyat-asc", label: "Fiyat: artan" },
  { value: "fiyat-desc", label: "Fiyat: azalan" },
  { value: "popular", label: "Çok satanlar" },
] as const;

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("siralama") ?? "yeni";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "yeni") params.delete("siralama");
    else params.set("siralama", value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-[12px] text-black/70">
      <span className="tracking-[0.18em] uppercase">Sırala</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-black/30 bg-transparent py-1 pr-6 text-[13px] outline-none focus:border-black cursor-pointer"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
