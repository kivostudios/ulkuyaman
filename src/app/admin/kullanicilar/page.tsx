"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Shield, ShieldOff, Loader2 } from "lucide-react";

type User = {
  id: string; name: string | null; email: string | null; image: string | null;
  role: string; createdAt: string; _count: { orders: number };
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRole = async (userId: string, role: string) => {
    setUpdating(userId);
    const newRole = role === "ADMIN" ? "USER" : "ADMIN";
    await fetch("/api/admin/users", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUpdating(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} kullanıcı</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Kullanıcı</th>
                <th className="text-left px-5 py-3 font-medium">Rol</th>
                <th className="text-left px-5 py-3 font-medium">Sipariş</th>
                <th className="text-left px-5 py-3 font-medium">Kayıt Tarihi</th>
                <th className="text-right px-5 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        <Image src={u.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {u.name?.[0] || u.email?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{u.name || "—"}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "ADMIN" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                      {u.role === "ADMIN" ? "Admin" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{u._count.orders}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      disabled={updating === u.id}
                      className="flex items-center gap-1.5 ml-auto text-xs text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                      title={u.role === "ADMIN" ? "Admin yetkisini kaldır" : "Admin yap"}
                    >
                      {updating === u.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : u.role === "ADMIN" ? <ShieldOff size={14} /> : <Shield size={14} />
                      }
                      {u.role === "ADMIN" ? "Yetkiyi Kaldır" : "Admin Yap"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
