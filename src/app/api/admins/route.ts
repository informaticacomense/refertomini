import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { NextResponse } from "next/server";

// ======================================================
// GET /api/admins
// Ritorna tutti gli admin dei comitati
// ======================================================
export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
        committeeId: true,
        committee: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // il frontend si aspetta un oggetto con { admins: [...] }
    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Errore GET /api/admins:", error);
    return NextResponse.json({ error: "Errore nel caricamento degli admin" }, { status: 500 });
  }
}

// ======================================================
// POST /api/admins
// Crea un nuovo admin di comitato e invia email di accesso
// ======================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, committeeId } = body;

    if (!firstName || !lastName || !email || !committeeId) {
      return NextResponse.json({ error: "Tutti i campi sono obbligatori." }, { status: 400 });
    }

    // controlla se l'email è già registrata
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email già registrata." }, { status: 400 });
    }

    // genera una password casuale
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashed = await hashPassword(randomPassword);

    // crea l'utente admin
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
      include: {
        committee: { select: { id: true, name: true } },
      },
    });

    // invia email con credenziali
    await sendMail(
      email,
      "Accesso Admin Comitato - Refertimini",
      `<p>Ciao ${firstName},</p>
       <p>Sei stato registrato come <b>amministratore del comitato ${admin.committee?.name || ""}</b> su Refertimini.</p>
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
    console.error("Errore POST /api/admins:", err);
    return NextResponse.json(
      { error: "Errore creazione admin", details: err.message },
      { status: 500 }
    );
  }
}

 
