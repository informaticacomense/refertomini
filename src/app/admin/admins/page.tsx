"use client";

import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", committeeId: "" });
  const [message, setMessage] = useState("");

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Gestione Admin dei Comitati</h1>

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

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Elenco Admin dei Comitati</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Comitato</th>
              <th className="border p-2 text-center w-24">Creato il</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
