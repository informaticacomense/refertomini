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
    update: { isActive: true },
    create: {
      name: "2025/2026",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });
  console.log(`✅ Stagione attiva: ${season.name}`);

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
  console.log(`✅ Comitato: ${committee.name}`);

  // ======================================================
  // CREA CATEGORIE
  // ======================================================
  const categories = [
    { name: "Aquilotti", shortName: "AQ", gender: "M" },
    { name: "Esordienti", shortName: "ES", gender: "M" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        committeeId_name_seasonId: {
          committeeId: committee.id,
          name: cat.name,
          seasonId: season.id,
        },
      },
      update: {},
      create: {
        ...cat,
        seasonId: season.id,
        committeeId: committee.id,
      },
    });
  }
  console.log(`✅ Categorie create/aggiornate: ${categories.map(c => c.name).join(", ")}`);

  // ======================================================
  // CREA GIRONI
  // ======================================================
  const aquilotti = await prisma.category.findFirst({
    where: { name: "Aquilotti", seasonId: season.id },
  });

  if (aquilotti) {
    const groups = ["Girone A", "Girone B"];
    for (const g of groups) {
      await prisma.group.upsert({
        where: {
          categoryId_name: {
            categoryId: aquilotti.id,
            name: g,
          },
        },
        update: {},
        create: {
          name: g,
          categoryId: aquilotti.id,
          seasonId: season.id,
          committeeId: committee.id,
        },
      });
    }
    console.log("✅ Gironi creati/aggiornati:", groups);
  }

  // ======================================================
  // CREA SQUADRE
  // ======================================================
  const teams = [
    await prisma.team.upsert({
      where: { name: "Pol. Basket A" },
      update: {},
      create: { name: "Pol. Basket A" },
    }),
    await prisma.team.upsert({
      where: { name: "US Minibasket B" },
      update: {},
      create: { name: "US Minibasket B" },
    }),
  ];

  const gironeA = await prisma.group.findFirst({
    where: { name: "Girone A", seasonId: season.id },
  });

  if (gironeA) {
    for (const team of teams) {
      await prisma.teamInGroup.upsert({
        where: {
          groupId_teamId: {
            groupId: gironeA.id,
            teamId: team.id,
          },
        },
        update: {},
        create: {
          groupId: gironeA.id,
          teamId: team.id,
        },
      });
    }
    console.log("✅ Squadre assegnate al Girone A");
  }

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

  console.log(`✅ Superadmin creato/aggiornato: ${admin.email}`);

  console.log("🎉 Seed completato con successo!");
}

// ======================================================
// ESECUZIONE
// ======================================================
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Errore nel seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
