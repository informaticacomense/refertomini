import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Recupera il token JWT dal cookie
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("refertimini_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    // Verifica il token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "refertimini_secret");

    // Recupera i dati completi dell’utente
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        isSuperAdmin: true,
        committeeId: true,
        committee: {
          select: {
            id: true,
            name: true,
            seasonId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Restituisce l’utente completo al frontend
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        committeeId: user.committeeId,
        committeeName: user.committee?.name ?? null,
        seasonId: user.committee?.seasonId ?? null,
      },
    });
  } catch (err: any) {
    console.error("❌ Errore auth/me:", err);
    return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 401 });
  }
}
