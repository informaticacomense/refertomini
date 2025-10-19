import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔹 GET – tutti i comitati
export async function GET() {
  const committees = await prisma.committee.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, logoUrl: true, season: { select: { name: true } } },
  });
  return NextResponse.json(committees);
}

// 🔹 POST – crea nuovo comitato
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, logoUrl, seasonId } = body;

    if (!name || !seasonId)
      return NextResponse.json({ error: "Nome e stagione sono obbligatori" }, { status: 400 });

    const existing = await prisma.committee.findFirst({ where: { name, seasonId } });
    if (existing)
      return NextResponse.json({ error: "Comitato già esistente per questa stagione" }, { status: 400 });

    const committee = await prisma.committee.create({
      data: { name, logoUrl, seasonId },
    });

    return NextResponse.json(committee);
  } catch (err: any) {
    return NextResponse.json({ error: "Errore creazione comitato", details: err.message }, { status: 500 });
  }
}

// 🔹 DELETE – elimina comitato
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  await prisma.committee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
