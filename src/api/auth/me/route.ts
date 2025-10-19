import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("; ").find((c) => c.startsWith("refertimini_token="))?.split("=")[1];
  if (!token) return NextResponse.json({ error: "Token mancante" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "refertimini_secret") as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, isSuperAdmin: true }
    });
    if (!user) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Token non valido" }, { status: 401 });
  }
}
