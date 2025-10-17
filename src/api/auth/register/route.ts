import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, committeeId } = body;

    // ✅ Verifica se l'email è già registrata
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "Email già registrata" }, { status: 400 });

    // ✅ Cripta la password
    const hashed = await hashPassword(password);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // ✅ Crea nuovo utente
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed,
        verificationToken,
        teamName: "Informatica Comense", // obbligatorio in schema.prisma
        ...(committeeId ? { committeeId } : {}), // opzionale
      },
    });

    // ✅ Invia email di conferma
    await sendMail(
      email,
      "Conferma registrazione - REFERTIMINI",
      `
      <p>Ciao ${firstName},</p>
      <p>Conferma la tua registrazione cliccando qui:</p>
      <a href="${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}">
        Conferma Email
      </a>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore nella registrazione:", error);
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }
}


  await sendMail(
    email,
    "Conferma registrazione - REFERTIMINI",
    `<p>Ciao ${firstName},</p>
     <p>Conferma la tua registrazione cliccando qui:</p>
     <a href="${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}">
       Conferma Email
     </a>`
  );

  return NextResponse.json({ success: true });
}
