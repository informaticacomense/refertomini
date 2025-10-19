"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    gender: "Maschile",
    seasonId: "",
  });
  const [message, setMessage] = useState("");

  const loadCategories = () =>
    fetch("/api/categories?committeeId=current", { credentials: "include" })
      .then(r => r.json())
      .then(setCategories);

  useEffect(() => {
    fetch("/api/seasons").then(r => r.json()).then(setSeasons);
    loadCategories();
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const createCategory = async (e: any) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || "Errore creazione categoria");
    else {
      setMessage("✅ Categoria creata con successo!");
      setForm({ name: "", shortName: "", gender: "Maschile", seasonId: "" });
      loadCategories();
    }
  };

  const addGroup = async (id: string) => {
    const name = prompt("Nome girone?");
    if (!name) return;
    await fetch(`/api/categories/${id}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    loadCategories();
  };

  const addPhase = async (id: string) => {
    const name = prompt("Nome fase?");
    if (!name) return;
    await fetch(`/api/categories/${id}/phases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    loadCategories();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Categorie di Gioco</h1>

      <form onSubmit={createCategory} className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo (es. Aquilotti Maschile)" required className="border p-2 rounded-lg md:col-span-2" />
        <input name="shortName" value={form.shortName} onChange={handleChange} placeholder="Nome breve (es. AQM)" required className="border p-2 rounded-lg" />
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded-lg">
          <option>Maschile</option>
          <option>Femminile</option>
        </select>
        <select name="seasonId" value={form.seasonId} onChange={handleChange} required className="border p-2 rounded-lg md:col-span-4">
          <option value="">Seleziona stagione</option>
          {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="col-span-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Crea Categoria</button>
      </form>

      {message && <p className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">{message}</p>}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Elenco Categorie</h2>
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Breve</th>
              <th className="border p-2">Genere</th>
              <th className="border p-2">Stagione</th>
              <th className="border p-2">Gironi</th>
              <th className="border p-2">Fasi</th>
              <th className="border p-2 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.shortName}</td>
                <td className="border p-2">{c.gender}</td>
                <td className="border p-2">{c.season?.name}</td>
                <td className="border p-2">{c.groups.map((g:any)=>g.name).join(", ") || "-"}</td>
                <td className="border p-2">{c.phases.map((p:any)=>p.name).join(", ") || "-"}</td>
                <td className="border p-2 text-center space-x-2">
                  <button onClick={() => addGroup(c.id)} className="text-blue-600 hover:underline">+ Girone</button>
                  <button onClick={() => addPhase(c.id)} className="text-green-600 hover:underline">+ Fase</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
