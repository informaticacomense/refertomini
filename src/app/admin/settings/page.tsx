"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [committee, setCommittee] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // carica dati comitato corrente
  useEffect(() => {
    fetch("/api/committee/me", { credentials: "include" })
      .then(async (r) => (r.ok ? (await r.json()).committee : null))
      .then(setCommittee)
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!logoFile) return;

    setMessage("⏳ Caricamento in corso...");
    const formData = new FormData();
    formData.append("file", logoFile);

    const res = await fetch("/api/committee/logo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Logo aggiornato con successo!");
      setCommittee((prev: any) => ({ ...prev, logoUrl: data.logoUrl }));
      setLogoFile(null);
    } else {
      setMessage(data.error || "Errore durante il caricamento del logo");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-800">Impostazioni Comitato</h2>

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6">
        <h3 className="text-xl font-semibold">Logo del Comitato</h3>

        <div className="flex items-center gap-6">
          {preview ? (
            <img src={preview} alt="Preview" className="h-24 rounded-lg shadow" />
          ) : committee?.logoUrl ? (
            <img src={committee.logoUrl} alt="Logo corrente" className="h-24 rounded-lg shadow" />
          ) : (
            <div className="h-24 w-24 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
              Nessun logo
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block text-sm text-gray-700"
            />
            <button
              onClick={handleUpload}
              disabled={!logoFile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Carica Logo
            </button>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith("✅") ? "text-green-700" : "text-gray-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
