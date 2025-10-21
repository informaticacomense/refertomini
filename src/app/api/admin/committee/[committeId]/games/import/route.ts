import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { committeeId: string } }
) {
  try {
    const { seasonId, games } = await req.json();
    if (!seasonId || !games) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    let count = 0;

    for (const g of games) {
      const category = await prisma.category.findFirst({
        where: {
          name: g.categoria,
          seasonId,
          committeeId: params.committeeId,
        },
      });

      if (!category) continue;

      const group = await prisma.group.findFirst({
        where: {
          name: g.girone,
          categoryId: category.id,
        },
      });

      if (!group) continue;

      await prisma.game.create({
        data: {
          number: `${category.shortName || category.name}-${count + 1}`,
          dayName: g.giorno || "",
          date: new Date(g.data),
          timeStr: g.ora || "",
          venue: "",
          status: g.stato || "IN_PROGRAMMA",
          result:
            g.puntiA && g.puntiB ? `${g.puntiA}-${g.puntiB}` : undefined,
          categoryId: category.id,
          teamA: { connectOrCreate: {
            where: { name_committeeId: { name: g.squadraA, committeeId: params.committeeId }},
            create: { name: g.squadraA, committeeId: params.committeeId }
          }},
          teamB: { connectOrCreate: {
            where: { name_committeeId: { name: g.squadraB, committeeId: params.committeeId }},
            create: { name: g.squadraB, committeeId: params.committeeId }
          }},
        },
      });

      count++;
    }

    return NextResponse.json({ ok: true, count });
  } catch (error) {
    console.error("❌ Errore import partite:", error);
    return NextResponse.json(
      { error: "Errore durante l'import" },
      { status: 500 }
    );
  }
}
