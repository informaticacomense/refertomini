import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const gameId = formData.get("gameId")?.toString();
    const file = formData.get("file") as File;
    const uploaderEmail = formData.get("uploaderEmail")?.toString();

    if (!gameId || !file) {
      return NextResponse.json(
        { error: "gameId o file mancanti." },
        { status: 400 }
      );
    }

    // Percorso persistente (Render disk)
    const dir = path.join("/data/uploads", gameId);
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, "referto.pdf");
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Trova l'utente che ha caricato il file
    const user = uploaderEmail
      ? await prisma.user.findUnique({ where: { email: uploaderEmail } })
      : null;

    // Salva nel DB
    await prisma.report.upsert({
      where: { gameId },
      update: {
        fileKey: filePath,
        mimeType: file.type,
        uploadedById: user?.id || undefined,
      },
      create: {
        gameId,
        fileKey: filePath,
        mimeType: file.type,
        uploadedById: user?.id || "",
      },
    });

    // Notifica via email l'admin del comitato
    const mailTo = process.env.MAIL_ADMIN_DEFAULT || "admin@test.it";
    await sendMail(
      mailTo,
      `Nuovo referto caricato - Gara ${gameId}`,
      `
        <p>È stato caricato un nuovo referto per la gara <b>${gameId}</b>.</p>
        <p>Utente: ${uploaderEmail || "Sconosciuto"}</p>
        <p><i>REFERTIMINI – powered by Informatica Comense</i></p>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Errore upload referto:", error);
    return NextResponse.json(
      { error: "Errore durante il caricamento del referto." },
      { status: 500 }
    );
  }
}
