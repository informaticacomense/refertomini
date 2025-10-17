import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email mancante." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Nessun utente trovato con questa email." },
        { status: 404 }
      );
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExp = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 ore

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/api/auth/reset?token=${resetToken}`;

    await sendMail(
      user.email,
      "Recupero password - REFERTIMINI",
      `
        <p>Ciao <b>${user.firstName}</b>,</p>
        <p>Hai richiesto il reset della password per il portale <b>REFERTIMINI</b>.</p>
        <p>Clicca sul seguente link per impostarne una nuova (valido per 2 ore):</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>Se non hai richiesto questa operazione, puoi ignorare questo messaggio.</p>
        <p><i>REFERTIMINI – powered by Informatica Comense</i></p>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Errore richiesta reset password:", error);
    return NextResponse.json(
      { error: "Errore durante la richiesta di reset." },
      { status: 500 }
    );
  }
}
