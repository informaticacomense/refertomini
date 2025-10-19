import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email e password richieste." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Utente non trovato." }, { status: 404 });

    const ok = await comparePassword(password, user.password);
    if (!ok) return NextResponse.json({ error: "Password errata." }, { status: 401 });

    const token = signJwt({ id: user.id, email: user.email, isSuperAdmin: user.isSuperAdmin });
    const res = NextResponse.json({ success: true });

    res.headers.append(
      "Set-Cookie",
      `refertimini_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60 * 60 * 24 * 7}`
    );
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Errore durante il login." }, { status: 500 });
  }
}
