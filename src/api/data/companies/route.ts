import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const committeeId = searchParams.get("committeeId");
  if (!committeeId) return NextResponse.json([]);
  const companies = await prisma.company.findMany({
    where: { committeeId },
    select: { id: true, name: true }
  });
  return NextResponse.json(companies);
}
