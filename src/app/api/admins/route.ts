import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export async function GET() {
  const admins = await prisma.user.findMany({
    where: { isAdmin: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      committee: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, committeeId } = body;

    if (!firstName || !lastName || !email || !committeeId)
      return NextResponse.json({ error: "Tutti i campi sono obbligatori." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "Email già registrata." }, { status: 400 });

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashed = await hashPassword(randomPassword);

    const admin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed,
        isAdmin: true,
        isSuperAdmin: false,
        emailVerified: true,
        committeeId,
        teamName: "N/A",
      },
    });

    await sendMail(
      email,
      "Accesso Admin Comitato - Refertimini",
      `<p>Ciao ${firstName},</p>
       <p>Sei stato registrato come <b>amministratore del comitato</b> su Refertimini.</p>
       <p>Le tue credenziali sono:</p>
       <ul>
         <li><b>Email:</b> ${email}</li>
         <li><b>Password:</b> ${randomPassword}</li>
       </ul>
       <p>Puoi accedere da: <a href="${process.env.NEXTAUTH_URL}/login">${process.env.NEXTAUTH_URL}/login</a></p>
       <p>Ti consigliamo di cambiare la password dopo il primo accesso.</p>
       <br/>
       <p>– Refertimini Admin</p>`
    );

    return NextResponse.json({ success: true, admin });
  } catch (err: any) {
    return NextResponse.json({ error: "Errore creazione admin", details: err.message }, { status: 500 });
  }
}
