"use client";

import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", committeeId: "" });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAdmins = () => fetch("/api/admins").then(r => r.json()).then(setAdmins);
  const loadCommittees = () => fetch("/api/committees").then(r => r.json()).then(setCommittees);

  useEffect(() => {
    loadAdmins();
    loadCommittees();
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const createAdmin = async (e: any) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || "Errore creazione admin");
    else {
      setMessage("✅ Admin creato con successo e credenziali inviate via email.");
      setForm({ firstName: "", lastName: "", email: "", committeeId: "" });
      loadAdmins();
    }
  };

  const openModal = (committeeId: string | undefined) => {
    if (!committeeId) {
      setModalMsg("⚠️ Questo admin non ha un comitato associato");
      return;
    }
    setSelectedCommitteeId(committeeId);
    setNewPassword("");
    setModalMsg("");
    setShowModal(true);
  };

  const handleResetPassword = async () => {
    if (!selectedCommitteeId || newPassword.length < 8) {
      setModalMsg("La password deve contenere almeno 8 caratteri");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/committees/${selectedCommitteeId}/admin/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    setLoading(false);

    if (res.ok) {
      setModalMsg("✅ Password aggiornata con successo!");
      setTimeout(() => setShowModal(false), 1500);
    } else {
      const err = await res.json().catch(() => ({}));
      setModalMsg(err.error || "Errore nel reset della password");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Gestione Admin dei Comitati</h1>

      {/* FORM CREAZIONE ADMIN */}
      <form
        onSubmit={createAdmin}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="firstName"
          placeholder="Nome"
          value={form.firstName}
          onChange={handleChange}
          required
          className="border p-2 rounded-lg"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Cognome"
          value={form.lastName}
          onChange={handleChange}
          required
          className="border p-2 rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 rounded-lg md:col-span-2"
        />
        <select
          name="committeeId"
          value={form.committeeId}
          onChange={handleChange}
          required
          className="border p-2 rounded-lg md:col-span-4"
        >
          <option value="">Seleziona Comitato</option>
          {committees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="col-span-1 md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
          Crea Admin Comitato
        </button>
      </form>

      {message && (
        <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">
          {message}
        </div>
      )}

      {/* ELENCO ADMIN */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Elenco Admin dei Comitati</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Comitato</th>
              <th className="border p-2 text-center">Creato il</th>
              <th className="border p-2 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="border p-2">{a.firstName} {a.lastName}</td>
                <td className="border p-2">{a.email}</td>
                <td className="border p-2">{a.committee?.name || "-"}</td>
                <td className="border p-2 text-center">
                  {new Date(a.createdAt).toLocaleDateString("it-IT")}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => openModal(a.committee?.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Reimposta Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE RESET PASSWORD */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Reimposta Password</h3>
            <input
              type="password"
              placeholder="Nuova password (min 8 caratteri)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md p-2 w-full mb-3"
            />
            {modalMsg && <p className="text-sm text-red-600 mb-3">{modalMsg}</p>}
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
