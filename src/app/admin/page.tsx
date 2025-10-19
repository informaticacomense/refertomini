export default function AdminDashboard() {
  const cards = [
    { label: "Referti Caricati", value: 0, color: "blue" },
    { label: "Gare Programmate", value: 0, color: "green" },
    { label: "Utenti Registrati", value: 0, color: "orange" }
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-blue-800">Dashboard Amministrativa</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-t-4 border-${c.color}-500 p-6 text-center`}
          >
            <h3 className="text-lg font-semibold text-gray-700">{c.label}</h3>
            <p className={`text-4xl font-bold text-${c.color}-600 mt-3`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
