import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// GET – Elenco stagioni
// ======================================================
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(seasons);
  } catch (err) {
    console.error("Errore GET /api/admin/seasons:", err);
    return NextResponse.json({ error: "Errore nel caricamento stagioni" }, { status: 500 });
  }
}

// ======================================================
// POST – Creazione nuova stagione
// ======================================================
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, startDate, endDate } = data;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Campi mancanti" }, { status: 400 });
    }

    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(season);
  } catch (err) {
    console.error("Errore POST /api/admin/seasons:", err);
    return NextResponse.json({ error: "Errore nella creazione stagione" }, { status: 500 });
  }
}

// ======================================================
// DELETE – Eliminazione stagione
// ======================================================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    await prisma.season.delete({ where: { id } });
    return NextResponse.json({ message: "Eliminata con successo" });
  } catch (err) {
    console.error("Errore DELETE /api/admin/seasons:", err);
    return NextResponse.json({ error: "Errore durante l'eliminazione" }, { status: 500 });
  }
}
