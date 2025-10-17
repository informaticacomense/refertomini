import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const u = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!u) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  await prisma.user.update({ where: { id: u.id }, data: { emailVerified: true, verificationToken: null } });
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=1`);
}
