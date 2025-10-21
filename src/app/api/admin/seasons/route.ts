import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// API: /api/admin/seasons
// ======================================================
// Restituisce l’elenco delle stagioni sportive disponibili
// ======================================================

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error("❌ Errore nel caricamento delle stagioni:", error);
    return NextResponse.json(
      { error: "Errore nel caricamento delle stagioni" },
      { status: 500 }
    );
  }
}
