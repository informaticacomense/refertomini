import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // per ora prendiamo il primo comitato (da sostituire con sessione)
    const committee = await prisma.committee.findFirst();

    if (!committee) {
      return NextResponse.json({ error: "Nessun comitato trovato" }, { status: 404 });
    }

    return NextResponse.json({ committee });
  } catch (error) {
    console.error("Errore GET /api/committee/me:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
