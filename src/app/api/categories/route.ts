import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const committeeId = searchParams.get("committeeId");
  if (!committeeId) return NextResponse.json([]);
  
  const categories = await prisma.category.findMany({
    where: { committeeId },
    include: { season: true, groups: true, phases: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, shortName, gender, seasonId, committeeId } = body;
    if (!name || !shortName || !gender || !seasonId || !committeeId)
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, shortName, gender, seasonId, committeeId },
    });

    return NextResponse.json(category);
  } catch (err: any) {
    return NextResponse.json({ error: "Errore creazione categoria", details: err.message }, { status: 500 });
  }
}
