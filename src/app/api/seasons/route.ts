import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const seasons = await prisma.season.findMany({
    select: { id: true, name: true },
    orderBy: { name: "desc" }
  });
  return NextResponse.json(seasons);
}
