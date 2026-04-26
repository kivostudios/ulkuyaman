import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "./AdminSidebar";

export const metadata = { title: "Admin Panel | Ülkü Yaman" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris?callbackUrl=/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true, image: true },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center border border-black/10 p-10">
          <h1 className="text-xl font-light tracking-wide mb-3">Yetkisiz Erişim</h1>
          <p className="text-sm text-gray-600 mb-6">
            Bu sayfa yalnızca yönetici hesaplarına açıktır. Hesabınız:
            <br />
            <span className="font-medium text-black">{session.user.email}</span>
          </p>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Eğer yönetici olduğunu düşünüyorsan, hesabının &quot;ADMIN&quot; rolüne yükseltildiğinden
            emin ol. Tipik olarak Supabase &gt; Table Editor &gt; User tablosundan kendi satırının{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">role</code> sütununu{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">ADMIN</code> yapman gerekir. Ardından
            buraya geri dönüp sayfayı yenile — token 5 dakikada bir tazelenir, yenilemek istemezsen
            çıkış-giriş yap.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="border border-black px-5 py-2 text-xs tracking-widest uppercase font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Anasayfa
            </Link>
            <Link
              href="/api/auth/signout"
              className="border border-black/20 px-5 py-2 text-xs tracking-widest uppercase font-semibold hover:border-black transition-colors"
            >
              Çıkış Yap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={{ name: user.name, email: user.email, image: user.image }} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
