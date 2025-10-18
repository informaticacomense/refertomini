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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login?logout=1");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-200 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-lg border-r border-slate-200 flex flex-col p-5 fixed inset-y-0">
        <div className="flex items-center gap-3 mb-10">
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
              className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                pathname === link.href
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-blue-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t pt-4 mt-6">
          {user && (
            <p className="text-sm text-gray-600 mb-3">
              👋 {user.firstName} {user.lastName}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* Contenuto */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
