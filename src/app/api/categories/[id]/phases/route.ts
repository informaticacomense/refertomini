import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  const { id } = params;
  const { name } = await req.json();
  const phase = await prisma.phase.create({ data: { name, categoryId: id } });
  return NextResponse.json(phase);
}
