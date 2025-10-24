import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// IMPORT PARTITE – da JSON (non da file diretto)
// ======================================================

export async function POST(req: Request, { params }: { params: { committeeId: string } }) {
  try {
    const { committeeId } = params;
    const { seasonId, games } = await req.json(); // ✅ ora legge JSON

    if (!seasonId || !games || games.length === 0) {
      return NextResponse.json({ error: "Dati CSV mancanti o invalidi" }, { status: 400 });
    }

    let importedCount = 0;

    for (const g of games) {
      if (!g.categoria || !g.squadraA || !g.squadraB || !g.data) continue;

      // 🔍 Cerca la categoria (deve esistere)
      const category = await prisma.category.findFirst({
        where: {
          name: g.categoria.trim(),
          seasonId,
          committeeId,
        },
      });

      if (!category) continue;

      // 🔍 Controlla se la partita esiste già
      const existing = await prisma.game.findFirst({
        where: {
          categoryId: category.id,
          date: new Date(`${g.data.split("/").reverse().join("-")}T${g.ora || "00:00"}:00`),
          homeTeamName: g.squadraA.trim(),
          awayTeamName: g.squadraB.trim(),
        },
      });
      if (existing) continue;

      // 🔹 Crea nuova partita
      await prisma.game.create({
        data: {
          seasonId,
          committeeId,
          categoryId: category.id,
          homeTeamName: g.squadraA.trim(),
          awayTeamName: g.squadraB.trim(),
          pointsHome: parseInt(g.puntiA) || 0,
          pointsAway: parseInt(g.puntiB) || 0,
          status: g.stato?.trim() || "IN_PROGRAMMA",
          day: g.giorno?.trim(),
          phase: g.fase?.trim() || null,
          groupName: g.girone?.trim() || "",
          date: new Date(`${g.data.split("/").reverse().join("-")}T${g.ora || "00:00"}:00`),
        },
      });

      importedCount++;
    }

    return NextResponse.json({
      message: `✅ Import completato con successo (${importedCount} partite importate)`,
      count: importedCount,
    });
  } catch (err: any) {
    console.error("❌ Errore import CSV:", err);
    return NextResponse.json({ error: "Errore durante l'import CSV" }, { status: 500 });
  }
}
