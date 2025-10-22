import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// === GET tutte le stagioni ===
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(seasons);
  } catch (err) {
    console.error("Errore GET /api/admin/seasons:", err);
    return NextResponse.json({ error: "Errore caricamento stagioni" }, { status: 500 });
  }
}

// === CREA nuova stagione ===
export async function POST(req: Request) {
  try {
    const { name, startDate, endDate } = await req.json();

    if (!name || !startDate || !endDate)
      return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });

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
    return NextResponse.json({ error: "Errore creazione stagione" }, { status: 500 });
  }
}

// === ELIMINA stagione ===
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID mancante" }, { status: 400 });

    await prisma.season.delete({ where: { id } });
    return NextResponse.json({ message: "Stagione eliminata" });
  } catch (err) {
    console.error("Errore DELETE /api/admin/seasons:", err);
    return NextResponse.json({ error: "Errore eliminazione stagione" }, { status: 500 });
  }
}
