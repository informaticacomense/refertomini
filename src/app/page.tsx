export default function HomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", textAlign: "center", padding: "5rem" }}>
      <h1>🏀 REFERTIMINI</h1>
      <h2>powered by Informatica Comense</h2>
      <p>Benvenuto nel sistema di gestione referti minibasket.</p>
      <a
        href="/login"
        style={{
          display: "inline-block",
          marginTop: "2rem",
          padding: "1rem 2rem",
          background: "#0070f3",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Accedi
      </a>
    </main>
  );
}
