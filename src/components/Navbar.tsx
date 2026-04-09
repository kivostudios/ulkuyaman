"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import NavbarUserMenu from "./NavbarUserMenu";

const navLinks = [
  { label: "Sandaletler", href: "/kategori/sandaletler" },
  { label: "Topuklu", href: "/kategori/topuklu-ayakkabi" },
  { label: "Bot & Çizme", href: "/kategori/bot" },
  { label: "Sneakers", href: "/kategori/sneakers" },
  { label: "Çanta", href: "/kategori/canta" },
  { label: "Aksesuar", href: "/kategori/aksesuar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartStore((s) => s.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white border-b border-gray-100 shadow-sm" : "bg-white"
        }`}
      >
        {/* Top bar */}
        <div className="bg-black text-white text-xs text-center py-2 tracking-wider">
          250₺ üzeri siparişlerde ücretsiz kargo &nbsp;|&nbsp; 90 gün koşulsuz iade
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu */}
            <button
              className="lg:hidden p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest uppercase text-gray-700 hover:text-black font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-[0.2em] uppercase text-black"
            >
              Ülkü Yaman
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Ara"
                className="p-1 hover:opacity-60"
              >
                <Search size={20} />
              </button>
              <Link href="/favoriler" aria-label="Favoriler" className="p-1 hover:opacity-60 hidden sm:block">
                <Heart size={20} />
              </Link>
              <NavbarUserMenu />
              <Link href="/sepet" aria-label="Sepet" className="p-1 hover:opacity-60 relative">
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4">
            <div className="max-w-xl mx-auto flex items-center gap-3 border-b border-gray-300 pb-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Ne aramak istersiniz?"
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg tracking-widest uppercase text-gray-800 hover:text-black border-b border-gray-100 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/hakkimizda" onClick={() => setMenuOpen(false)} className="text-sm text-gray-500 mt-4">
              Hakkımızda
            </Link>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[88px]" />
    </>
  );
}
