"use client";
import { useState } from "react";

export default function RefertiPage() {
  const [gameId, setGameId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const upload = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    if (!file || !gameId) return setMsg("Seleziona PDF e inserisci ID gara.");

    const form = new FormData();
    form.append("file", file);
    form.append("gameId", gameId);

    const res = await fetch("/api/reports/upload", { method: "POST", body: form, credentials: "include" });
    const data = await res.json();
    setMsg(res.ok ? "Referto caricato con successo." : (data.error || "Errore upload."));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-800">Gestione Referti</h2>
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <form onSubmit={upload} className="flex flex-col gap-4">
          <input
            type="text" placeholder="ID Gara (gameId)" value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="file" accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="px-3 py-2 border rounded-lg bg-white"
          />
          <button className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Carica PDF
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
