import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function PUT(req: Request, { params }: { params: { committeeId: string } }) {
  try {
    const { committeeId } = params;
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "La password deve avere almeno 8 caratteri" }, { status: 400 });
    }

    // trova l'admin del comitato (isAdmin = true)
    const admin = await prisma.user.findFirst({
      where: { committeeId, isAdmin: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin del comitato non trovato" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: { password: await hash(newPassword, 10) },
    });

    return NextResponse.json({ message: "✅ Password aggiornata con successo" });
  } catch (error) {
    console.error("Errore reset password:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
