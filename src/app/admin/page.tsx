"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Token mancante");
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login?logout=1");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
        <p className="text-blue-800 text-lg">Caricamento...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo-default.png" className="h-8" alt="Logo" />
            <h1 className="text-xl font-bold text-blue-700">REFERTIMINI</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Esci
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto p-6">
        {user ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800">
              Benvenuto, {user.firstName} {user.lastName}
            </h2>
            {user.isSuperAdmin && (
              <p className="text-gray-600">
                🔐 Accesso come <strong>Super Admin</strong>
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-blue-500">
                <h3 className="text-gray-700 font-semibold mb-2">Referti Caricati</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-green-500">
                <h3 className="text-gray-700 font-semibold mb-2">Gare in Programma</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-orange-500">
                <h3 className="text-gray-700 font-semibold mb-2">Utenti Registrati</h3>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Utente non trovato.</p>
        )}
      </main>

      <footer className="text-center py-4 text-sm text-gray-500">
        © 2025 Informatica Comense — REFERTIMINI
      </footer>
    </div>
  );
}
