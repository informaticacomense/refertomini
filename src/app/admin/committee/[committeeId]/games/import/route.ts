import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function POST(req: Request, { params }: { params: { committeeId: string } }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const seasonId = formData.get("seasonId") as string;
    const categoryId = formData.get("categoryId") as string;
    const groupId = formData.get("groupId") as string;
    const phaseId = formData.get("phaseId") as string;

    if (!file) {
      return NextResponse.json({ error: "Nessun file inviato" }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const rows = parsed.data as any[];

    const createdGames = [];

    for (const row of rows) {
      const { giorno, data, ora, squadra_a, squadra_b, punti_a, punti_b, stato } = row;

      // Trova o crea squadre (Company)
      const teamA = await prisma.company.upsert({
        where: {
          committeeId_name: { committeeId: params.committeeId, name: squadra_a.trim() },
        },
        update: {},
        create: {
          name: squadra_a.trim(),
          committeeId: params.committeeId,
        },
      });

      const teamB = await prisma.company.upsert({
        where: {
          committeeId_name: { committeeId: params.committeeId, name: squadra_b.trim() },
        },
        update: {},
        create: {
          name: squadra_b.trim(),
          committeeId: params.committeeId,
        },
      });

      const game = await prisma.game.create({
        data: {
          dayName: giorno.trim(),
          date: new Date(data),
          timeStr: ora.trim(),
          categoryId,
          status: stato?.trim() || "IN_PROGRAMMA",
          teamAId: teamA.id,
          teamBId: teamB.id,
          result: punti_a && punti_b ? `${punti_a}-${punti_b}` : null,
        },
      });

      createdGames.push(game);
    }

    return NextResponse.json({ ok: true, created: createdGames.length });
  } catch (err: any) {
    console.error("❌ Errore import CSV:", err);
    return NextResponse.json({ error: "Errore durante l'importazione CSV" }, { status: 500 });
  }
}
