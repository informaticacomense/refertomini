"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";

export default function ImportGamesPage({
  params,
}: {
  params: { committeeId: string };
}) {
  const { committeeId } = params;
  const [season, setSeason] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Carica stagione attiva
 // 🔹 Carica stagione attiva o l’ultima disponibile
useEffect(() => {
  async function loadSeason() {
    const res = await fetch("/api/admin/seasons");
    const data = await res.json();

    // Prova prima quella attiva
    let active = data.find((s: any) => s.isActive);

    // Se non c'è, prendi la più recente (fine stagione più grande)
    if (!active && data.length > 0) {
      active = data.sort(
        (a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      )[0];
      console.warn("⚠️ Nessuna stagione attiva, uso quella più recente:", active.name);
    }

    if (active) setSeason(active);
  }

  loadSeason();
}, []);


  // 🔹 Leggi file CSV
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsed(results.data);
      },
    });
  };

  // 🔹 Invia partite al server
  const importGames = async () => {
    if (!season) return alert("Nessuna stagione attiva trovata.");
    if (parsed.length === 0) return alert("Nessun dato da importare.");

    setUploading(true);
    setMessage("");

    const res = await fetch(`/api/admin/committee/${committeeId}/games/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId: season.id,
        games: parsed,
      }),
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) setMessage(`❌ Errore: ${data.error || "import fallito"}`);
    else setMessage(`✅ Import completato: ${data.count} partite caricate`);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">
        📥 Importa Partite da CSV
      </h1>

      {season && (
        <p className="text-sm text-gray-600">
          Stagione attiva: <strong>{season.name}</strong>
        </p>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full border border-slate-300 p-2 rounded-lg text-sm"
        />

        {file && (
          <p className="text-sm text-gray-700">
            File selezionato: <strong>{file.name}</strong> ({parsed.length} righe)
          </p>
        )}

        {parsed.length > 0 && (
          <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-slate-50 text-xs">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  {Object.keys(parsed[0]).map((h) => (
                    <th key={h} className="px-2 py-1">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-2 py-1">
                        {v as string}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          onClick={importGames}
          disabled={uploading || parsed.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {uploading ? "⏳ Import in corso..." : "📤 Importa partite"}
        </Button>

        {message && (
          <div
            className={`border p-3 rounded-md text-sm ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600">
        <p className="font-semibold mb-1">Formato CSV richiesto:</p>
        <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto">
stagione;categoria;girone;fase;giorno;data;ora;squadraA;squadraB;puntiA;puntiB;stato
2025/2026;Aquilotti;Girone A;Provinciale;Domenica;2025-10-27;15:00;Team A;Team B;42;39;IN_PROGRAMMA
        </pre>
      </div>
    </div>
  );
}
