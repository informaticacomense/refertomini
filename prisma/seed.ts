// ======================================================
// REFERTIMINI – SEED DATABASE
// powered by Informatica Comense
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
  console.log("✅ Stagione:", season.name);

  // ======================================================
  // CREA COMITATO FIP COMO-LECCO
  // ======================================================
  const committee = await prisma.committee.upsert({
    where: {
      seasonId_name: {
        seasonId: season.id,
        name: "FIP Como-Lecco",
      },
    },
    update: {},
    create: {
      name: "FIP Como-Lecco",
      logoUrl: null,
      seasonId: season.id,
    },
  });
  console.log("✅ Comitato:", committee.name);

  // ======================================================
  // CREA CATEGORIE
  // ======================================================
  const aquilotti = await prisma.category.create({
    data: {
      name: "Aquilotti",
      shortName: "AQ",
      gender: "M",
      seasonId: season.id,
      committeeId: committee.id,
    },
  });

  const esordienti = await prisma.category.create({
    data: {
      name: "Esordienti",
      shortName: "ES",
      gender: "M",
      seasonId: season.id,
      committeeId: committee.id,
    },
  });

  console.log("✅ Categorie create:", [aquilotti.name, esordienti.name]);

  // ======================================================
  // CREA GIRONI
  // ======================================================
  const gironeA = await prisma.group.create({
    data: {
      name: "Girone A",
      categoryId: aquilotti.id,
      seasonId: season.id,
      committeeId: committee.id,
    },
  });

  const gironeB = await prisma.group.create({
    data: {
      name: "Girone B",
      categoryId: aquilotti.id,
      seasonId: season.id,
      committeeId: committee.id,
    },
  });

  console.log("✅ Gironi creati:", [gironeA.name, gironeB.name]);

  // ======================================================
  // CREA SQUADRE
  // ======================================================
  const team1 = await prisma.team.create({
    data: { name: "Pol. Basket A" },
  });
  const team2 = await prisma.team.create({
    data: { name: "US Minibasket B" },
  });

  await prisma.teamInGroup.createMany({
    data: [
      { groupId: gironeA.id, teamId: team1.id },
      { groupId: gironeA.id, teamId: team2.id },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Squadre e assegnazioni create");

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
