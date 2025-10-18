"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login?logout=1");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg shadow-lg border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo-default.png" alt="Logo" className="h-10" />
          <div>
            <h1 className="text-xl font-bold text-blue-700">REFERTIMINI</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col space-y-2 flex-1">
          {[
            { href: "/admin", label: "🏠 Dashboard" },
            { href: "/admin/utenti", label: "🧑‍💼 Utenti" },
            { href: "/admin/referti", label: "🏀 Referti" },
            { href: "/admin/gare", label: "🗓️ Gare" },
            { href: "/admin/settings", label: "⚙️ Impostazioni" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg transition-all ${
                pathname === link.href
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t pt-4 mt-6">
          {user && (
            <p className="text-sm text-gray-600 mb-2">
              👋 {user.firstName} {user.lastName}
            </p>
          )}
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* Contenuto */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
