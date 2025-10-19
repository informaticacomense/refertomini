import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import formidable from "formidable";

export const runtime = "nodejs"; // per form-data

function isS3Enabled() {
  return !!(process.env.AWS_S3_BUCKET && process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

async function parseForm(req: Request) {
  const data = await req.arrayBuffer();
  const form = formidable({ multiples: false });
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    // @ts-ignore
    form.parse(Buffer.from(data), (err: any, fields: any, files: any) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data"))
      return NextResponse.json({ error: "Content-Type non valido" }, { status: 400 });

    // parse
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const gameId = String(formData.get("gameId") || "");

    if (!file || !gameId) return NextResponse.json({ error: "File PDF e gameId richiesti" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ error: "Caricare solo PDF" }, { status: 400 });

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return NextResponse.json({ error: "Gara non trovata" }, { status: 404 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `reports/${gameId}-${randomUUID()}.pdf`;

    let fileKey = key;

    if (isS3Enabled()) {
      const s3 = new S3Client({ region: process.env.AWS_REGION });
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf"
        })
      );
    } else {
      const base = process.env.DISK_BASE_PATH || "/data/uploads";
      if (!existsSync(base)) await mkdir(base, { recursive: true });
      const full = `${base}/${key}`;
      const dir = full.substring(0, full.lastIndexOf("/"));
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      await writeFile(full, buffer);
      fileKey = full; // su disco salvo path assoluto
    }

    // crea/aggiorna referto + stato gara
    await prisma.report.upsert({
      where: { gameId },
      update: { fileKey, mimeType: "application/pdf" },
      create: { gameId, fileKey, mimeType: "application/pdf", uploadedById: (await prisma.user.findFirst())!.id }
    });

    await prisma.game.update({ where: { id: gameId }, data: { status: "CARICATA" } });

    return NextResponse.json({ success: true, fileKey });
  } catch (e: any) {
    return NextResponse.json({ error: "Errore upload", details: String(e?.message || e) }, { status: 500 });
  }
}
