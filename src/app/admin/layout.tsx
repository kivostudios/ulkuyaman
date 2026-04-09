import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export const metadata = { title: "Admin Panel | Ülkü Yaman" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true, image: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={{ name: user.name, email: user.email, image: user.image }} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
