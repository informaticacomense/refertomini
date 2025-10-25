import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const season = await prisma.season.create({
      data: {
        name: "2025/2026",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-06-30"),
      },
    });
    return res.status(200).json(season);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore creazione stagione" });
  }
}
