import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const season = await prisma.season.upsert({
      where: { name: "2025/2026" },
      update: {},
      create: {
        name: "2025/2026",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-06-30"),
        isActive: true,
      },
    });
    res.status(200).json(season);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Errore creazione stagione" });
  }
}
