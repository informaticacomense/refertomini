import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token o nuova password mancanti." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() }, // controlla che non sia scaduto
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token non valido o scaduto." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Errore reset password:", error);
    return NextResponse.json(
      { error: "Errore durante il reset della password." },
      { status: 500 }
    );
  }
}
