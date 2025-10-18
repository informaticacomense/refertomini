export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-800">Dashboard Amministrativa</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg border-t-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Referti Caricati</h3>
          <p className="text-4xl font-bold text-blue-600 mt-3">0</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg border-t-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Gare Programmate</h3>
          <p className="text-4xl font-bold text-green-600 mt-3">0</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg border-t-4 border-orange-500">
          <h3 className="text-lg font-semibold text-gray-700">Utenti Registrati</h3>
          <p className="text-4xl font-bold text-orange-600 mt-3">0</p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-slate-800">Ultime attività</h3>
        <p className="text-gray-500 italic">Nessuna attività recente.</p>
      </div>
    </div>
  );
}
