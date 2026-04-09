"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function NavbarUserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session) {
    return (
      <Link href="/giris" aria-label="Giriş Yap" className="p-1 hover:opacity-60 hidden sm:block">
        <User size={20} />
      </Link>
    );
  }

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 hover:opacity-60"
        aria-label="Hesabım"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || ""}
            width={26}
            height={26}
            className="rounded-full"
          />
        ) : (
          <User size={20} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-52 bg-white border border-gray-100 shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-medium">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
          <div className="py-1">
            <Link href="/hesabim" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <User size={15} /> Hesabım
            </Link>
            <Link href="/siparisler" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <Package size={15} /> Siparişlerim
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left border-t border-gray-100 mt-1"
            >
              <LogOut size={15} /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
