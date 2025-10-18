"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState(""); // per visualizzare risposta API

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebug("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🧩 API response:", data);

      // Mostra risposta API nella pagina per debug
      setDebug(JSON.stringify(data, null, 2));

      if (!res.ok) {
        throw new Error(data.error || "Errore sconosciuto durante il login.");
      }

      // Login riuscito
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Errore login:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="/logo-default.png"
            alt="Logo"
            className="mx-auto w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">REFERTIMINI</h1>
          <p className="text-sm text-gray-500">
            powered by <strong>Informatica Comense</strong>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            <strong>Errore:</strong> {error}
          </div>
        )}

        {/* Debug area visibile solo se l'API risponde con dettagli */}
        {debug && (
          <pre className="mt-4 text-xs bg-gray-50 border p-2 rounded-lg overflow-x-auto text-gray-600">
            {debug}
          </pre>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/forgot" className="text-blue-600 hover:underline">
            Password dimenticata?
          </a>
        </div>
      </div>
    </div>
  );
}

