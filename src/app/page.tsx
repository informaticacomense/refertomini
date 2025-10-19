import Link from "next/link";

export default function Home() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-3">REFERTIMINI</h1>
      <p className="text-slate-600 mb-8">Area riservata caricamento referti PDF</p>
      <Link
        href="/login"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Vai al Login
      </Link>
    </div>
  );
}
