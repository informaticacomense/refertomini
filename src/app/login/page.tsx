"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@test.it");
  const [password, setPassword] = useState("Mujanovic1!");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout")) setInfo("Logout effettuato con successo.");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante il login.");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo-default.png" alt="Logo" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-blue-800">REFERTIMINI</h1>
          <p className="text-sm text-gray-500">powered by Informatica Comense</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">{error}</p>}
          {info && <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-md p-2">{info}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
