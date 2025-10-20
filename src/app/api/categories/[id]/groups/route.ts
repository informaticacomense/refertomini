import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // categoryId
  const { name } = await req.json();

  // Recupera la categoria per ottenere seasonId e committeeId
  const category = await prisma.category.findUnique({
    where: { id },
    select: { seasonId: true, committeeId: true },
  });

  if (!category) {
    return NextResponse.json({ error: "Categoria non trovata" }, { status: 404 });
  }

  // Crea il girone
  const group = await prisma.group.create({
    data: {
      name,
      categoryId: id,
      seasonId: category.seasonId,
      committeeId: category.committeeId,
    },
  });

  return NextResponse.json(group);
}
