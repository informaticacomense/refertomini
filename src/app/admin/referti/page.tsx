export default function RefertiPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800">Gestione Referti</h2>
      <p className="text-gray-600">Carica e visualizza i referti PDF delle gare.</p>

      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md">
          + Carica Referto
        </button>
      </div>
    </div>
  );
}
