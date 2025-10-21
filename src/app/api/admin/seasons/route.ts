import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// GET → elenco stagioni
// POST → crea nuova stagione
// PATCH → imposta stagione attiva
// ======================================================

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(seasons);
  } catch (error) {
    console.error("❌ Errore nel caricamento stagioni:", error);
    return NextResponse.json({ error: "Errore nel caricamento" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Campi mancanti" }, { status: 400 });
    }

    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: false,
      },
    });

    return NextResponse.json(season);
  } catch (error) {
    console.error("❌ Errore nella creazione stagione:", error);
    return NextResponse.json({ error: "Errore nella creazione" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID stagione mancante" }, { status: 400 });

    // Disattiva tutte
    await prisma.season.updateMany({ data: { isActive: false } });

    // Attiva quella scelta
    const updated = await prisma.season.update({
      where: { id },
      data: { isActive: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Errore attivazione stagione:", error);
    return NextResponse.json({ error: "Errore durante l’attivazione" }, { status: 500 });
  }
}

