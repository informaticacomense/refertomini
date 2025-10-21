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

