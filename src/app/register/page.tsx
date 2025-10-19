"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    committeeId: "",
    companyId: "",
    teamName: ""
  });
  const [committees, setCommittees] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/data/committees").then(r => r.json()).then(setCommittees);
  }, []);

  useEffect(() => {
    if (form.committeeId)
      fetch(`/api/data/companies?committeeId=${form.committeeId}`).then(r => r.json()).then(setCompanies);
  }, [form.committeeId]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Errore durante la registrazione");
    else setSuccess("Registrazione avvenuta! Controlla la tua email per confermare.");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Registrazione Utente</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input name="firstName" placeholder="Nome" value={form.firstName} onChange={handleChange} required className="border rounded-lg p-3"/>
          <input name="lastName" placeholder="Cognome" value={form.lastName} onChange={handleChange} required className="border rounded-lg p-3"/>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border rounded-lg p-3 col-span-2"/>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border rounded-lg p-3 col-span-2"/>
          
          <select name="committeeId" value={form.committeeId} onChange={handleChange} required className="border rounded-lg p-3 col-span-2">
            <option value="">Seleziona Comitato</option>
            {committees.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {form.committeeId && (
            <select name="companyId" value={form.companyId} onChange={handleChange} required className="border rounded-lg p-3 col-span-2">
              <option value="">Seleziona Società</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}

          <input name="teamName" placeholder="Nome Squadra" value={form.teamName} onChange={handleChange} required className="border rounded-lg p-3 col-span-2"/>

          <div className="col-span-2">
            {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</p>}
            {success && <p className="text-green-600 bg-green-50 border border-green-200 rounded-md p-2">{success}</p>}
          </div>

          <button className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-3">Registrati</button>
        </form>
      </div>
    </div>
  );
}
