import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, committeeId, companyId, teamName } = await req.json();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email già registrata" }, { status: 400 });

    const hashed = await hashPassword(password);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed,
        verificationToken,
        teamName,
        committeeId,
        companyId,
        isAdmin: false,
        isSuperAdmin: false
      }
    });

    await sendMail(
      email,
      "Conferma registrazione - REFERTIMINI",
      `<p>Ciao ${firstName},</p>
       <p>Abbiamo ricevuto la tua richiesta di registrazione come referente per la squadra <b>${teamName}</b>.</p>
       <p>Un amministratore del comitato validerà i tuoi dati a breve.</p>
       <p>Grazie,<br><b>Refertimini</b></p>`
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Errore durante la registrazione", details: e.message });
  }
}

