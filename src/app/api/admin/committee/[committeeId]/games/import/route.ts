import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// IMPORT PARTITE – compatibile con il modello Game
// ======================================================

export async function POST(req: Request, { params }: { params: { committeeId: string } }) {
  try {
    const { committeeId } = params;
    const { seasonId, games } = await req.json();

    if (!seasonId || !games || games.length === 0) {
      return NextResponse.json({ error: "Dati CSV mancanti o invalidi" }, { status: 400 });
    }

    let importedCount = 0;

    for (const g of games) {
      if (!g.categoria || !g.squadraA || !g.squadraB || !g.data) continue;

      // 🔹 Cerca categoria
      const category = await prisma.category.findFirst({
        where: {
          name: g.categoria.trim(),
          seasonId,
          committeeId,
        },
      });
      if (!category) continue;

      // 🔹 Controlla se esiste già una partita simile
      const existing = await prisma.game.findFirst({
        where: {
          categoryId: category.id,
          date: new Date(`${g.data.split("/").reverse().join("-")}T${g.ora || "00:00"}:00`),
          teamAName: g.squadraA.trim(),
          teamBName: g.squadraB.trim(),
        },
      });
      if (existing) continue;

      // 🔹 Crea la partita
      await prisma.game.create({
        data: {
          seasonId,
          committeeId,
          categoryId: category.id,
          dayName: g.giorno?.trim() || "",
          phase: g.fase?.trim() || null,
          groupName: g.girone?.trim() || "",
          date: new Date(`${g.data.split("/").reverse().join("-")}T${g.ora || "00:00"}:00`),
          timeStr: g.ora?.trim() || "",
          status: g.stato?.trim() || "IN_PROGRAMMA",
          result: `${g.puntiA || 0}-${g.puntiB || 0}`,

          // 🔸 Se il tuo schema usa teamA/teamB come relazioni
          teamA: {
            connectOrCreate: {
              where: {
                committeeId_name: {
                  committeeId,
                  name: g.squadraA.trim(),
                },
              },
              create: {
                committeeId,
                name: g.squadraA.trim(),
              },
            },
          },
          teamB: {
            connectOrCreate: {
              where: {
                committeeId_name: {
                  committeeId,
                  name: g.squadraB.trim(),
                },
              },
              create: {
                committeeId,
                name: g.squadraB.trim(),
              },
            },
          },
        },
      });

      importedCount++;
    }

    return NextResponse.json({
      message: `✅ Import completato (${importedCount} partite importate)`,
      count: importedCount,
    });
  } catch (err) {
    console.error("❌ Errore import CSV:", err);
    return NextResponse.json({ error: "Errore durante l'import CSV" }, { status: 500 });
  }
}
