"use client";

import { useEffect, useState } from "react";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const loadSeasons = () =>
    fetch("/api/seasons").then(r => r.json()).then(setSeasons);

  useEffect(() => { loadSeasons(); }, []);

  const createSeason = async (e: any) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/seasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate, endDate }),
    });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || "Errore creazione stagione");
    else {
      setMessage("✅ Stagione creata con successo!");
      setName(""); setStartDate(""); setEndDate("");
      loadSeasons();
    }
  };

  const deleteSeason = async (id: string) => {
    if (!confirm("Vuoi davvero eliminare questa stagione?")) return;
    await fetch(`/api/seasons?id=${id}`, { method: "DELETE" });
    loadSeasons();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Gestione Stagioni Sportive</h1>

      <form
        onSubmit={createSeason}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Nome stagione (es. 2025/2026)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded-lg md:col-span-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="border p-2 rounded-lg"
        />
        <button className="col-span-1 md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
          Crea Stagione
        </button>
      </form>

      {message && (
        <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Elenco Stagioni</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">Inizio</th>
              <th className="border p-2 text-left">Fine</th>
              <th className="border p-2 text-center w-24">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">
                  {new Date(s.startDate).toLocaleDateString("it-IT")}
                </td>
                <td className="border p-2">
                  {new Date(s.endDate).toLocaleDateString("it-IT")}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteSeason(s.id)}
                    className="text-red-600 hover:text-red-800"
                  >
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
