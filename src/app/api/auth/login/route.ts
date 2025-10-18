import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email e password richieste." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Password errata." }, { status: 401 });

    const token = jwt.sign(
      { id: user.id, email: user.email, isSuperAdmin: user.isSuperAdmin },
      process.env.JWT_SECRET || "refertimini_secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ success: true });

    // ✅ cookie compatibile con HTTPS + Render
    res.headers.append(
      "Set-Cookie",
      `refertimini_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60 * 60 * 24 * 7}`
    );

    return res;
  } catch (err) {
    console.error("Errore login:", err);
    return NextResponse.json({ error: "Errore durante il login." }, { status: 500 });
  }
}
