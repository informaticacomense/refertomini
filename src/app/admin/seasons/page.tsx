"use client";

import { useEffect, useState } from "react";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Carica stagioni
  const loadSeasons = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seasons");
    const data = await res.json();
    setSeasons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  // 🔹 Crea nuova stagione
  const createSeason = async (e: any) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/seasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate, endDate }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "❌ Errore durante la creazione della stagione");
    } else {
      setMessage("✅ Stagione creata con successo!");
      setName("");
      setStartDate("");
      setEndDate("");
      loadSeasons();
    }
  };

  // 🔹 Elimina stagione
  const deleteSeason = async (id: string) => {
    if (!confirm("Vuoi davvero eliminare questa stagione?")) return;
    await fetch(`/api/admin/seasons/${id}`, { method: "DELETE" });
    loadSeasons();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">
        📅 Gestione Stagioni Sportive
      </h1>

      <form
        onSubmit={createSeason}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 border border-slate-200"
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
        <button
          type="submit"
          className="col-span-1 md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          ➕ Crea Stagione
        </button>
      </form>

      {message && (
        <div
          className={`border p-3 rounded-md ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border-green-300"
              : "bg-red-50 text-red-700 border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Elenco Stagioni</h2>

        {loading ? (
          <p className="text-gray-500">Caricamento in corso...</p>
        ) : seasons.length === 0 ? (
          <p className="text-gray-500">Nessuna stagione trovata.</p>
        ) : (
          <table className="w-full text-sm border border-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="border p-2 text-left">Nome</th>
                <th className="border p-2 text-left">Inizio</th>
                <th className="border p-2 text-left">Fine</th>
                <th className="border p-2 text-center w-24">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 transition-colors border-t"
                >
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">
                    {new Date(s.startDate).toLocaleDateString("it-IT")}
                  </td>
                  <td className="border p-2">
                    {new Date(s.endDate).toLocaleDateString("it-IT")}
                  </td>
                  <td className="border p-2 text-center space-x-2">
  {!s.isActive && (
    <button
      onClick={async () => {
        await fetch("/api/admin/seasons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: s.id }),
        });
        loadSeasons();
      }}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      Attiva
    </button>
  )}
  {s.isActive && (
    <span className="text-green-700 font-semibold">Attiva ✅</span>
  )}
  <button
    onClick={() => deleteSeason(s.id)}
    className="text-red-600 hover:text-red-800 font-medium"
  >
    Elimina
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
