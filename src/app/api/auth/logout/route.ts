import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Cancella il cookie JWT impostandolo vuoto e scaduto
    const response = NextResponse.json({ message: "Logout effettuato con successo" });
    response.headers.append(
      "Set-Cookie",
      "refertimini_token=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0"
    );
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Errore durante il logout" }, { status: 500 });
  }
}
