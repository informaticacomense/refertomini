"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ImportGamesPage({ params }: { params: { committeeId: string } }) {
  const { committeeId } = params;
  const [file, setFile] = useState<File | null>(null);
  const [seasonId, setSeasonId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("seasonId", seasonId);
    formData.append("categoryId", categoryId);
    formData.append("groupId", groupId);
    formData.append("phaseId", phaseId);

    const res = await fetch(`/api/admin/committee/${committeeId}/games/import`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.ok) setMessage(`✅ ${data.created} partite importate con successo`);
    else setMessage(`❌ Errore: ${data.error}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📥 Importa Partite CSV</h1>

      <Card>
        <CardHeader>
          <CardTitle>Parametri di importazione</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="ID Stagione" value={seasonId} onChange={(e) => setSeasonId(e.target.value)} />
              <Input placeholder="ID Categoria" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
              <Input placeholder="ID Girone" value={groupId} onChange={(e) => setGroupId(e.target.value)} />
              <Input placeholder="ID Fase" value={phaseId} onChange={(e) => setPhaseId(e.target.value)} />
            </div>

            <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <Button type="submit">Importa CSV</Button>
          </form>
        </CardContent>
      </Card>

      {message && <p className="text-sm font-medium mt-2">{message}</p>}
    </div>
  );
}
