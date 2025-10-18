"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore nel caricamento utente");
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento in corso...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <a href="/login" className="mt-4 text-blue-600 hover:underline">
          Torna al login
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo-default.png" alt="Logo" className="h-8" />
          <h1 className="font-bold text-xl">REFERTIMINI</h1>
        </div>
        <div className="text-sm text-gray-600">
          Super Admin: <span className="font-semibold">{user.firstName} {user.lastName}</span>
          <br />
          <span className="text-xs">{user.email}</span>
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Pannello di Controllo</h2>
        <div className="grid grid-cols-2 gap-6">
          <a
            href="#"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            📄 <strong>Carica Referto</strong>
            <p className="text-sm text-gray-500 mt-1">Invia PDF referti partite</p>
          </a>

          <a
            href="#"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            📅 <strong>Calendari</strong>
            <p className="text-sm text-gray-500 mt-1">Gestisci il calendario gare</p>
          </a>

          <a
            href="#"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            👥 <strong>Utenti</strong>
            <p className="text-sm text-gray-500 mt-1">Visualizza e gestisci gli utenti</p>
          </a>

          <a
            href="/logout"
            className="bg-red-50 border border-red-200 rounded-xl p-6 hover:bg-red-100 transition"
          >
            🚪 <strong>Logout</strong>
            <p className="text-sm text-gray-500 mt-1">Esci dal sistema</p>
          </a>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 mt-10">
        Powered by Informatica Comense
      </footer>
    </div>
  );
}
