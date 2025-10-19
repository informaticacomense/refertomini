import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔹 GET – Elenco stagioni
export async function GET() {
  const seasons = await prisma.season.findMany({
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(seasons);
}

// 🔹 POST – Crea nuova stagione
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate)
      return NextResponse.json({ error: "Tutti i campi sono obbligatori." }, { status: 400 });

    const exists = await prisma.season.findUnique({ where: { name } });
    if (exists)
      return NextResponse.json({ error: "Stagione già esistente." }, { status: 400 });

    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(season);
  } catch (err: any) {
    return NextResponse.json({ error: "Errore creazione stagione", details: err.message }, { status: 500 });
  }
}

// 🔹 DELETE – Elimina stagione
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  await prisma.season.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
