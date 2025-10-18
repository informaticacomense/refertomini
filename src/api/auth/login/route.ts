import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password richieste." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Password errata." }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isSuperAdmin: user.isSuperAdmin },
      process.env.JWT_SECRET || "refertimini_secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        isSuperAdmin: user.isSuperAdmin,
      },
    });

    res.cookies.set({
      name: "refertimini_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });

    return res;
  } catch (error) {
    console.error("Errore login:", error);
    return NextResponse.json({ error: "Errore del server." }, { status: 500 });
  }
}

