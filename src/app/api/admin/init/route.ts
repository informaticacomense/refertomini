import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: "admin@test.it" },
    });

    if (existing) {
      return NextResponse.json({ message: "Admin già esistente" });
    }

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
      },
    });

    return NextResponse.json({ message: "Admin creato", admin });
  } catch (err) {
    console.error("Errore creazione admin:", err);
    return NextResponse.json({ error: "Errore creazione admin" }, { status: 500 });
  }
}
