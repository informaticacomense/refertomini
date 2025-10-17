// ======================================================
// REFERTIMINI – SEED DATABASE
// ======================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Avvio inizializzazione database REFERTIMINI...");

  // ======================================================
  // CREA STAGIONE 2025/2026
  // ======================================================
  const season = await prisma.season.upsert({
    where: { name: "2025/2026" },
    update: {},
    create: {
      name: "2025/2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-06-30"),
    },
  });

  console.log("✅ Stagione creata:", season.name);

  // ======================================================
  // CREA COMITATO FIP COMOLECCO
  // ======================================================
  const committee = await prisma.committee.upsert({
    where: {
      seasonId_name: {
        seasonId: season.id,
        name: "FIP ComoLecco",
      },
    },
    update: {},
    create: {
      name: "FIP ComoLecco",
      logoUrl: null,
      seasonId: season.id,
    },
  });

  console.log("✅ Comitato:", committee.name);

  // ======================================================
  // CREA SUPERADMIN
  // ======================================================
  const hashedPassword = await bcrypt.hash("Mujanovic1!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.it" },
    update: {},
    create: {
      email: "admin@test.it",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      teamName: "Informatica Comense",
      isAdmin: true,
      isSuperAdmin: true,
      emailVerified: true,
      committeeId: committee.id,
    },
  });

  console.log("✅ Superadmin creato:", admin.email);

  console.log("🎉 Seed completato con successo!");
}

// ======================================================
// ESECUZIONE
// ======================================================
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Errore nel seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

