"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

type FilterFacets = {
  colors: string[];
  subcategories: string[];
  priceMin: number;
  priceMax: number;
};

type Props = {
  facets: FilterFacets;
};

const COLOR_SWATCH: Record<string, string> = {
  siyah: "#0f0f0f",
  beyaz: "#f5f5f3",
  bej: "#e8d8b9",
  krem: "#f0e6d0",
  kahverengi: "#7a4f2a",
  taba: "#a07550",
  bordo: "#5a1417",
  kirmizi: "#c1272d",
  pembe: "#f0bcc8",
  pudra: "#f1d6d0",
  altin: "#d4a951",
  gumus: "#c9c9c9",
  lacivert: "#1a2447",
  mavi: "#3b6fb8",
  yesil: "#3a6b3a",
  gri: "#8a8a8a",
  hardal: "#c9a23a",
};

function colorKey(name: string) {
  return name
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/10 py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-[12px] tracking-[0.18em] font-semibold uppercase"
      >
        {title}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function ProductFilters({ facets }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialColors = useMemo(
    () => (searchParams.get("renk")?.split(",").filter(Boolean) ?? []),
    [searchParams]
  );
  const initialSubs = useMemo(
    () => (searchParams.get("alt")?.split(",").filter(Boolean) ?? []),
    [searchParams]
  );
  const initialMin = searchParams.get("min") ?? "";
  const initialMax = searchParams.get("max") ?? "";
  const indirim = searchParams.get("indirim") === "1";
  const yeni = searchParams.get("yeni") === "1";
  const stokta = searchParams.get("stokta") === "1";

  const [colors, setColors] = useState<string[]>(initialColors);
  const [subs, setSubs] = useState<string[]>(initialSubs);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  useEffect(() => {
    setColors(initialColors);
    setSubs(initialSubs);
    setMin(initialMin);
    setMax(initialMax);
  }, [initialColors, initialSubs, initialMin, initialMax]);

  const updateUrl = useCallback(
    (mut: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mut(params);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  function toggleArrayParam(
    key: "renk" | "alt",
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) {
    const next = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    setter(next);
    updateUrl((p) => {
      if (next.length) p.set(key, next.join(","));
      else p.delete(key);
    });
  }

  function toggleFlag(key: "indirim" | "yeni" | "stokta", on: boolean) {
    updateUrl((p) => {
      if (on) p.set(key, "1");
      else p.delete(key);
    });
  }

  function applyPrice() {
    updateUrl((p) => {
      if (min) p.set("min", min);
      else p.delete("min");
      if (max) p.set("max", max);
      else p.delete("max");
    });
  }

  function clearAll() {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const activeCount =
    colors.length +
    subs.length +
    (min ? 1 : 0) +
    (max ? 1 : 0) +
    (indirim ? 1 : 0) +
    (yeni ? 1 : 0) +
    (stokta ? 1 : 0);

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-[12px] tracking-[0.2em] font-semibold uppercase">
          Filtrele
          {activeCount > 0 && (
            <span className="ml-2 text-black/50 font-normal">({activeCount})</span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-black/50 hover:text-black underline underline-offset-2"
          >
            Temizle
          </button>
        )}
      </div>

      <Section title="Hızlı Filtre">
        <div className="space-y-2.5">
          {[
            { key: "yeni", label: "Yeni gelenler", on: yeni },
            { key: "indirim", label: "İndirimde", on: indirim },
            { key: "stokta", label: "Sadece stoktakiler", on: stokta },
          ].map((f) => (
            <label
              key={f.key}
              className="flex items-center gap-3 text-[13px] cursor-pointer hover:text-black/70"
            >
              <input
                type="checkbox"
                checked={f.on}
                onChange={(e) =>
                  toggleFlag(f.key as "indirim" | "yeni" | "stokta", e.target.checked)
                }
                className="w-4 h-4 accent-black"
              />
              {f.label}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Fiyat (₺)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(facets.priceMin)}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="w-full border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
          />
          <span className="text-black/40 text-sm">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(facets.priceMax)}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className="w-full border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>
      </Section>

      {facets.colors.length > 0 && (
        <Section title="Renk">
          <div className="grid grid-cols-5 gap-3">
            {facets.colors.map((c) => {
              const k = colorKey(c);
              const swatch = COLOR_SWATCH[k] ?? "#cccccc";
              const selected = colors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => toggleArrayParam("renk", c, colors, setColors)}
                  className={`relative w-9 h-9 rounded-full border ${
                    selected ? "ring-2 ring-black ring-offset-2" : "border-black/20"
                  }`}
                  style={{ backgroundColor: swatch }}
                  aria-label={c}
                  aria-pressed={selected}
                >
                  {selected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                      <X size={10} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {colors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <span
                  key={c}
                  className="text-[11px] uppercase tracking-wider px-2 py-1 bg-black text-white"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {facets.subcategories.length > 0 && (
        <Section title="Model">
          <div className="space-y-2.5">
            {facets.subcategories.map((s) => (
              <label
                key={s}
                className="flex items-center gap-3 text-[13px] cursor-pointer hover:text-black/70"
              >
                <input
                  type="checkbox"
                  checked={subs.includes(s)}
                  onChange={() => toggleArrayParam("alt", s, subs, setSubs)}
                  className="w-4 h-4 accent-black"
                />
                {s}
              </label>
            ))}
          </div>
        </Section>
      )}
    </aside>
  );
}
