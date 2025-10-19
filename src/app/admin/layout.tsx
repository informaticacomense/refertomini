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
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const d = await r.json();
        setUser(d.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login?logout=1");
  };

  const links = [
    { href: "/admin", label: "🏠 Dashboard" },
    { href: "/admin/utenti", label: "🧑‍💼 Utenti" },
    { href: "/admin/referti", label: "📄 Referti" },
    { href: "/admin/gare", label: "🗓️ Gare" },
    { href: "/admin/settings", label: "⚙️ Impostazioni" },
  ];

  if (user?.isSuperAdmin) {
    links.splice(1, 0, { href: "/admin/committees", label: "🏛️ Comitati" });
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 fixed inset-y-0 bg-white/80 backdrop-blur-lg shadow-xl border-r border-slate-200 flex flex-col p-5 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo-default.png" alt="Logo" className="h-10 drop-shadow-md" />
          <div>
            <h1 className="text-xl font-bold text-blue-700 tracking-tight">REFERTIMINI</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col space-y-2 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                      : "text-slate-700 hover:bg-blue-100 hover:scale-[1.01]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t pt-4 mt-6">
          {user && (
            <p className="text-sm text-gray-600 mb-3">
              👋 {user.firstName} {user.lastName}
              {user.isSuperAdmin && <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md">SUPER</span>}
            </p>
          )}
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto bg-gradient-to-br from-blue-50/40 to-blue-100/50">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-slate-200 min-h-[80vh]">
          {children}
        </div>
      </main>
    </div>
  );
}
