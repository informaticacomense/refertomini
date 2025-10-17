import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const gameId = formData.get("gameId")?.toString();
  const file = formData.get("file") as File;
  const userEmail = formData.get("userEmail")?.toString();

  if (!gameId || !file) return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join("/data/uploads", gameId);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, "referto.pdf");
  fs.writeFileSync(filePath, buffer);

  const user = await prisma.user.findUnique({ where: { email: userEmail || "" } });
  await prisma.report.create({
    data: {
      gameId,
      fileKey: filePath,
      mimeType: file.type,
      uploadedById: user?.id || "",
    },
  });

  await sendMail(
    process.env.MAIL_ADMIN_DEFAULT || "admin@test.it",
    "Nuovo referto caricato",
    `<p>È stato caricato un nuovo referto per la gara ${gameId}.</p>`
  );

  return NextResponse.json({ success: true });
}
