import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatorie." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Password errata." }, { status: 401 });
    }

    // 🔐 Genera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        committeeId: user.committeeId,
      },
      process.env.JWT_SECRET || "supersegreto_refertimini",
      { expiresIn: "7d" }
    );

    // Imposta cookie httpOnly
    const response = NextResponse.json({
      success: true,
      message: "Accesso eseguito con successo.",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperAdmin: user.isSuperAdmin,
      },
    });

    response.cookies.set({
      name: "refertimini_token",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });

    return response;
  } catch (err) {
    console.error("Errore login:", err);
    return NextResponse.json({ error: "Errore interno del server." }, { status: 500 });
  }
}
