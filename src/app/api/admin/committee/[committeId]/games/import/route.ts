import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

// ======================================================
// IMPORT CSV PARTITE – ADMIN COMITATO
// ======================================================

export async function POST(req: Request, { params }: { params: { committeeId: string } }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File CSV mancante" }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
    });

    const games = parsed.data as any[];
    let importedCount = 0;

    for (const g of games) {
      if (!g.categoria || !g.squadraA || !g.squadraB || !g.data) continue;

      const season = await prisma.season.findUnique({
        where: { name: g.stagione },
      });
      if (!season) continue;

      const category = await prisma.category.findFirst({
        where: { name: g.categoria, seasonId: season.id, committeeId: params.committeeId },
      });
      if (!category) continue;

      const group = await prisma.group.findFirst({
        where: { name: g.girone, categoryId: category.id },
      });

      // 🔍 Evita di duplicare partite già esistenti (stessa data + squadre)
      const existing = await prisma.game.findFirst({
        where: {
          date: new Date(g.data),
          categoryId: category.id,
          teamA: { name: g.squadraA },
          teamB: { name: g.squadraB },
        },
      });
      if (existing) continue;

      await prisma.game.create({
        data: {
          number: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          dayName: g.giorno,
          date: new Date(g.data),
          timeStr: g.ora,
          venue: "Campo da definire",
          status: g.stato || "IN_PROGRAMMA",
          result: `${g.puntiA || 0}-${g.puntiB || 0}`,

          // ✅ Relazioni corrette
          category: { connect: { id: category.id } },
          ...(group && { group: { connect: { id: group.id } } }),

          teamA: {
            connectOrCreate: {
              where: {
                committeeId_name: {
                  committeeId: params.committeeId,
                  name: g.squadraA,
                },
              },
              create: {
                name: g.squadraA,
                committeeId: params.committeeId,
              },
            },
          },
          teamB: {
            connectOrCreate: {
              where: {
                committeeId_name: {
                  committeeId: params.committeeId,
                  name: g.squadraB,
                },
              },
              create: {
                name: g.squadraB,
                committeeId: params.committeeId,
              },
            },
          },
        },
      });

      importedCount++;
    }

    return NextResponse.json({
      message: `✅ Import completato con successo (${importedCount} partite importate)`,
    });
  } catch (err: any) {
    console.error("❌ Errore import CSV:", err);
    return NextResponse.json({ error: "Errore durante l'import CSV" }, { status: 500 });
  }
}
