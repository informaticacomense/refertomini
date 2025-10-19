import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const committees = await prisma.committee.findMany({
    select: { id: true, name: true }
  });
  return NextResponse.json(committees);
}
