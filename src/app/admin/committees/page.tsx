"use client";

import { useEffect, useState } from "react";

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [seasons, setSeasons] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/committees").then(r => r.json()).then(setCommittees);
    fetch("/api/seasons").then(r => r.json()).then(setSeasons);
  }, []);

  const createCommittee = async (e: any) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/committees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logoUrl, seasonId }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Errore creazione");
    setMessage("✅ Comitato creato con successo!");
    setName(""); setLogoUrl(""); setSeasonId("");
    fetch("/api/committees").then(r => r.json()).then(setCommittees);
  };

  const deleteCommittee = async (id: string) => {
    if (!confirm("Vuoi davvero eliminare questo comitato?")) return;
    await fetch(`/api/committees?id=${id}`, { method: "DELETE" });
    setCommittees(committees.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Gestione Comitati</h1>

      <form onSubmit={createCommittee} className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text" placeholder="Nome Comitato"
          value={name} onChange={(e) => setName(e.target.value)} required
          className="border p-2 rounded-lg"
        />
        <select
          value={seasonId} onChange={(e) => setSeasonId(e.target.value)} required
          className="border p-2 rounded-lg"
        >
          <option value="">Seleziona stagione</option>
          {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input
          type="text" placeholder="Logo URL (facoltativo)"
          value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <button className="col-span-1 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
          Crea Comitato
        </button>
      </form>

      {message && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">{message}</div>}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Elenco Comitati</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">Stagione</th>
              <th className="border p-2 text-left">Logo</th>
              <th className="border p-2 text-center w-24">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {committees.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.season?.name || "N/A"}</td>
                <td className="border p-2">
                  {c.logoUrl ? <img src={c.logoUrl} alt="" className="h-8" /> : "-"}
                </td>
                <td className="border p-2 text-center">
                  <button onClick={() => deleteCommittee(c.id)} className="text-red-600 hover:text-red-800">
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
