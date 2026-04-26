"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useLocale } from "@/lib/locale-store";
import NavbarUserMenu from "./NavbarUserMenu";

const NAV = {
  tr: [
    { label: "TÜM SANDALETLER", href: "/sandaletler" },
    { label: "YENİ GELENLER", href: "/sandaletler?yeni=1" },
    { label: "İNDİRİM", href: "/sandaletler?indirim=1" },
    { label: "HİKÂYE", href: "/hakkimizda" },
  ],
  en: [
    { label: "ALL SANDALS", href: "/sandaletler" },
    { label: "NEW IN", href: "/sandaletler?yeni=1" },
    { label: "SALE", href: "/sandaletler?indirim=1" },
    { label: "STORY", href: "/hakkimizda" },
  ],
} as const;

const SEARCH_PH = {
  tr: "Ne aramak istersiniz?",
  en: "What are you looking for?",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((s) => s.count());
  const { locale, toggle } = useLocale();
  const activeLocale = mounted ? locale : "tr";
  const navLinks = NAV[activeLocale];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow ${
          scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="px-6 md:px-10">
          <div className="grid grid-cols-3 items-center h-[68px]">
            {/* Sol: nav (desktop) / hamburger (mobile) */}
            <div className="flex items-center">
              <nav className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11.5px] tracking-[0.18em] font-semibold text-black hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button
                className="lg:hidden p-1.5 -ml-1.5"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Orta: brand */}
            <Link
              href="/"
              className="text-center text-[19px] md:text-[24px] font-semibold tracking-[0.18em] text-black whitespace-nowrap"
            >
              ÜLKÜ YAMAN
            </Link>

            {/* Sağ: araçlar */}
            <div className="flex items-center justify-end gap-3 md:gap-5">
              <button
                onClick={toggle}
                aria-label="Dil değiştir"
                className="hidden md:flex items-center gap-1 text-[12px] tracking-[0.15em] font-semibold"
              >
                <span className={activeLocale === "tr" ? "text-black" : "text-black/30"}>TR</span>
                <span className="text-black/30">/</span>
                <span className={activeLocale === "en" ? "text-black" : "text-black/30"}>EN</span>
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-1 hover:opacity-60"
              >
                <Search size={18} strokeWidth={1.6} />
              </button>
              <NavbarUserMenu />
              <Link href="/sepet" aria-label="Cart" className="p-1 hover:opacity-60 relative">
                <ShoppingBag size={18} strokeWidth={1.6} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-black/5 bg-white px-6 py-4">
            <form
              action="/sandaletler"
              method="GET"
              className="max-w-xl mx-auto flex items-center gap-3 border-b border-black/20 pb-2"
            >
              <Search size={18} className="text-black/40" />
              <input
                type="text"
                name="q"
                placeholder={SEARCH_PH[activeLocale]}
                className="flex-1 outline-none text-sm text-black placeholder:text-black/40"
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close">
                <X size={18} className="text-black/40" />
              </button>
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] tracking-[0.15em] font-semibold text-black border-b border-black/10 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggle();
                setMenuOpen(false);
              }}
              className="text-[13px] tracking-[0.15em] font-semibold text-black/70 mt-4 self-start"
            >
              {activeLocale === "tr" ? "EN" : "TR"} →
            </button>
          </nav>
        </div>
      )}

      <div className="h-[68px]" />
    </>
  );
}
