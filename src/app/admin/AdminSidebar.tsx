"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Image as ImageIcon,
  Tag, LogOut, ChevronRight, ExternalLink,
} from "lucide-react";
import { signOut } from "next-auth/react";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Ürünler", href: "/admin/urunler", icon: Package },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingBag },
  { label: "Kuponlar", href: "/admin/kuponlar", icon: Tag },
  { label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
  { label: "İçerik & Tasarım", href: "/admin/icerik", icon: ImageIcon },
];

type Props = { user: { name?: string | null; email?: string | null; image?: string | null } };

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-sm font-bold tracking-[0.2em] uppercase">Ülkü Yaman</p>
        <p className="text-xs text-gray-500 mt-0.5 tracking-widest uppercase">Admin</p>
        <Link
          href="/"
          target="_blank"
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gray-400 hover:text-white"
        >
          Siteyi Aç <ExternalLink size={11} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                active ? "bg-white text-black font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          {user.image ? (
            <Image src={user.image} alt="" width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
              {user.name?.[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-white w-full transition-colors"
        >
          <LogOut size={14} /> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
