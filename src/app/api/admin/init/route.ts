import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1️⃣ Controlla se l'admin esiste già
    const existing = await prisma.user.findUnique({
      where: { email: "admin@test.it" },
    });

    if (existing) {
      return NextResponse.json({ message: "✅ Admin già esistente" });
    }

    // 2️⃣ Crea stagione se non c'è
    let season = await prisma.season.findFirst({
      where: { name: "2025-2026" },
    });
    if (!season) {
      season = await prisma.season.create({
        data: {
          name: "2025-2026",
          startDate: new Date("2025-09-01"),
          endDate: new Date("2026-06-30"),
        },
      });
    }

    // 3️⃣ Crea comitato se non esiste
    let committee = await prisma.committee.findFirst({
      where: { name: "FIP ComoLecco" },
    });
    if (!committee) {
      committee = await prisma.committee.create({
        data: {
          name: "FIP ComoLecco",
          seasonId: season.id,
        },
      });
    }

    // 4️⃣ Crea l'utente admin
    const hashed = await bcrypt.hash("Mujanovic1!", 12);
    const admin = await prisma.user.create({
      data: {
        email: "admin@test.it",
        password: hashed,
        firstName: "Super",
        lastName: "Admin",
        teamName: "N/A",
        isAdmin: true,
        isSuperAdmin: true,
        emailVerified: true,
        committeeId: committee.id,
      },
    });

    return NextResponse.json({
      message: "✅ Admin creato con successo",
      admin,
    });
  } catch (err: any) {
    console.error("❌ Errore creazione admin:", err);
    return NextResponse.json(
      { error: "Errore creazione admin", details: err.message },
      { status: 500 }
    );
  }
}
