import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("refertimini_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "refertimini_secret");

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, isSuperAdmin: true },
    });

    if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: "Token non valido" }, { status: 401 });
  }
}
