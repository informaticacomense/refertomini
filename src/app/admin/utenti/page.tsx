"use client";
import { useEffect, useState } from "react";

export default function UtentiPage() {
  const [utente, setUtente] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => r.ok ? (await r.json()).user : null)
      .then(setUtente)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-800">Gestione Utenti</h2>
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr><th className="p-3">Nome</th><th className="p-3">Cognome</th><th className="p-3">Ruolo</th></tr>
          </thead>
          <tbody>
            {utente && (
              <tr className="border-b hover:bg-blue-50">
                <td className="p-3">{utente.firstName}</td>
                <td className="p-3">{utente.lastName}</td>
                <td className="p-3">{utente.isSuperAdmin ? "Super Admin" : "Admin"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
