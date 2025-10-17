"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  teamName: string;
  committee?: { name: string };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Errore nel caricamento utente:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-600">
        <p>Caricamento in corso...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-600">
        <p>Nessun utente trovato. <a href="/login" className="text-blue-600 underline">Torna al login</a></p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">🏀 REFERTIMINI</h1>
          <p className="text-sm text-gray-500">
            powered by Informatica Comense
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </header>

      {/* CONTENUTO */}
      <section className="p-8 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Benvenuto nel portale</h2>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="mb-3">
            Ciao <strong>{user.firstName}</strong> 👋
          </p>

          {user.isSuperAdmin && (
            <div className="border-l-4 border-blue-500 pl-3 mb-3">
              <h3 className="font-semibold text-blue-700">Super Admin</h3>
              <p className="text-sm text-gray-600">
                Hai accesso completo a tutti i comitati, società e referti.
              </p>
            </div>
          )}

          {user.isAdmin && !user.isSuperAdmin && (
            <div className="border-l-4 border-green-500 pl-3 mb-3">
              <h3 className="font-semibold text-green-700">Amministratore Comitato</h3>
              <p className="text-sm text-gray-600">
                Gestisci il comitato: <strong>{user.committee?.name || "—"}</strong>
              </p>
            </div>
          )}

          {!user.isAdmin && !user.isSuperAdmin && (
            <div className="border-l-4 border-gray-400 pl-3 mb-3">
              <h3 className="font-semibold text-gray-700">Utente Società</h3>
              <p className="text-sm text-gray-600">
                Squadra: <strong>{user.teamName}</strong>
              </p>
            </div>
          )}

          <p className="text-gray-600 mt-4">
            Da qui potrai caricare referti, visualizzare partite e gestire i tuoi dati.
          </p>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Esci
          </button>
        </div>
      </section>
    </main>
  );
}
