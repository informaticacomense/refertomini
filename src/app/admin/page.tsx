export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-blue-800">Dashboard Amministrativa</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Referti Caricati", value: 0, color: "blue" },
          { label: "Gare Programmate", value: 0, color: "green" },
          { label: "Utenti Registrati", value: 0, color: "orange" },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-t-4 border-${card.color}-500 p-6 text-center hover:scale-[1.02] transition-transform`}
          >
            <h3 className="text-lg font-semibold text-gray-700">{card.label}</h3>
            <p className={`text-4xl font-bold text-${card.color}-600 mt-3`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-3 text-slate-800">Ultime attività</h3>
        <div className="bg-white/70 p-6 rounded-xl shadow-sm text-gray-500 italic">
          Nessuna attività recente.
        </div>
      </div>
    </div>
  );
}
