import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      committeeId,
      companyId,
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email già registrata." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verificationToken,
        committeeId,
        companyId,
      },
    });

    // Invia email di verifica
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;
    await sendMail(
      email,
      "Conferma registrazione - REFERTIMINI",
      `
        <p>Ciao <b>${firstName}</b>,</p>
        <p>Per completare la registrazione al portale <b>REFERTIMINI</b>, 
        clicca sul seguente link per confermare la tua email:</p>
        <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
        <p>Grazie,<br/>Lo staff di Informatica Comense</p>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Errore registrazione:", error);
    return NextResponse.json(
      { error: "Errore durante la registrazione." },
      { status: 500 }
    );
  }
}

