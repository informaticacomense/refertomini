"use client";

import { useEffect, useState } from "react";

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // === Carica stagioni dal backend ===
  useEffect(() => {
    async function loadSeasons() {
      try {
        const res = await fetch("/api/admin/seasons");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore caricamento stagioni");
        setSeasons(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError("Errore durante il caricamento delle stagioni");
      } finally {
        setLoading(false);
      }
    }

    loadSeasons();
  }, []);

  // === Crea una nuova stagione ===
  async function createSeason(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/admin/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Errore creazione stagione");

      setSeasons((prev) => [data, ...prev]);
      setForm({ name: "", startDate: "", endDate: "" });
    } catch (err: any) {
      console.error(err);
      setError("Errore durante la creazione della stagione");
    }
  }

  // === Elimina stagione ===
  async function deleteSeason(id: string) {
    if (!confirm("Eliminare questa stagione?")) return;
    try {
      await fetch(`/api/admin/seasons?id=${id}`, { method: "DELETE" });
      setSeasons((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Errore durante l'eliminazione");
    }
  }

  // === Attiva / Disattiva stagione ===
  async function toggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/seasons/toggle?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSeasons((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: data.isActive } : s))
      );
    } catch (err) {
      console.error(err);
      setError("Errore durante l'aggiornamento dello stato della stagione");
    }
  }

  if (loading) return <div className="p-6 text-gray-600">Caricamento...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestione Anni Sportivi</h1>

      {/* === Form creazione stagione === */}
      <form onSubmit={createSeason} className="space-y-3 mb-8">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nome stagione (es. 2024/2025)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crea stagione
        </button>
      </form>

      {/* === Elenco stagioni === */}
      {seasons.length === 0 ? (
        <p className="text-gray-500">Nessuna stagione presente.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2">Inizio</th>
              <th className="border p-2">Fine</th>
              <th className="border p-2">Stato</th>
              <th className="border p-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">
                  {new Date(s.startDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(s.endDate).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      s.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {s.isActive ? "Attiva" : "Non attiva"}
                  </span>
                </td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => toggleActive(s.id, s.isActive)}
                    className={`px-3 py-1 rounded text-xs ${
                      s.isActive
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {s.isActive ? "Disattiva" : "Attiva"}
                  </button>
                  <button
                    onClick={() => deleteSeason(s.id)}
                    className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
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
  );
}
