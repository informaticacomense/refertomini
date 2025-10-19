import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
    }

    // 🔧 (TEMP) prende il primo comitato nel database
    // In futuro, lo sostituiremo con il comitato dell'utente loggato
    const committee = await prisma.committee.findFirst();
    if (!committee) {
      return NextResponse.json({ error: "Nessun comitato trovato nel database" }, { status: 404 });
    }

    // 📁 Percorso in cui salvare il file
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const fileName = `${committee.id}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // ✏️ Salva il file nel filesystem
    await writeFile(filePath, buffer);

    // URL pubblico del file
    const logoUrl = `/uploads/${fileName}`;

    // 🔄 Aggiorna il campo logoUrl nel database
    await prisma.committee.update({
      where: { id: committee.id },
      data: { logoUrl },
    });

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error("Errore upload logo:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
