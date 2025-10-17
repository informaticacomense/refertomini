import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token mancante." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Token non valido." }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?verified=1`
    );
  } catch (error: any) {
    console.error("Errore verifica email:", error);
    return NextResponse.json(
      { error: "Errore durante la verifica email." },
      { status: 500 }
    );
  }
}
