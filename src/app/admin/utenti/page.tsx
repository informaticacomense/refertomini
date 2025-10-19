"use client";

import { useEffect, useState } from "react";

interface Utente {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  committeeName?: string;
}

export default function UtentiPage() {
  const [utente, setUtente] = useState<any>(null);
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // recupera utente loggato
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => (r.ok ? (await r.json()).user : null))
      .then(setUtente)
      .catch(() => {});
  }, []);

  // se è super admin, carica tutti gli utenti
  useEffect(() => {
    if (utente?.isSuperAdmin) {
      fetch("/api/users", { credentials: "include" })
        .then(async (r) => (r.ok ? (await r.json()).users : []))
        .then(setUtenti)
        .catch(() => {});
    }
  }, [utente]);

  const openModal = (committeeId: string) => {
    setSelectedCommitteeId(committeeId);
    setNewPassword("");
    setMessage("");
    setShowModal(true);
  };

  const handleResetPassword = async () => {
    if (!selectedCommitteeId || newPassword.length < 8) {
      setMessage("La password deve avere almeno 8 caratteri");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/committees/${selectedCommitteeId}/admin/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newPassword }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Password aggiornata con successo!");
      setTimeout(() => setShowModal(false), 1500);
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Errore nel reset della password");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-800">Gestione Utenti</h2>

      {/* TABELLA UTENTI */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Cognome</th>
              <th className="p-3">Ruolo</th>
              {utente?.isSuperAdmin && <th className="p-3 text-center">Azioni</th>}
            </tr>
          </thead>
          <tbody>
            {utente?.isSuperAdmin ? (
              utenti.map((u) => (
                <tr key={u.id} className="border-b hover:bg-blue-50">
                  <td className="p-3">{u.firstName}</td>
                  <td className="p-3">{u.lastName}</td>
                  <td className="p-3">
                    {u.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : u.role === "COMITATO_ADMIN"
                      ? "Admin Comitato"
                      : "Utente Società"}
                  </td>
                  {utente.isSuperAdmin && (
                    <td className="p-3 text-center">
                      {u.role === "COMITATO_ADMIN" && (
                        <button
                          onClick={() => openModal(u.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
                        >
                          Reimposta Password
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="border-b hover:bg-blue-50">
                <td className="p-3">{utente?.firstName}</td>
                <td className="p-3">{utente?.lastName}</td>
                <td className="p-3">{utente?.isSuperAdmin ? "Super Admin" : "Admin"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE RESET PASSWORD */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Reimposta Password Admin</h3>
            <input
              type="password"
              placeholder="Nuova password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md p-2 w-full mb-3"
            />
            {message && <p className="text-sm text-red-600 mb-3">{message}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Annulla
              </button>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {loading ? "Salvataggio..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
