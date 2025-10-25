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
  const categories = [
    { name: "Aquilotti", shortName: "AQ", gender: "M" },
    { name: "Esordienti", shortName: "ES", gender: "M" },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        seasonId: season.id,
        committeeId: committee.id,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          seasonId: season.id,
          committeeId: committee.id,
        },
      });
      console.log(`✅ Categoria creata: ${cat.name}`);
    } else {
      console.log(`ℹ️ Categoria già presente: ${cat.name}`);
    }
  }

  // ======================================================
  // CREA GIRONI
  // ======================================================
  const categoryAquilotti = await prisma.category.findFirst({
    where: { name: "Aquilotti", seasonId: season.id },
  });

  if (categoryAquilotti) {
    const groups = ["Girone A", "Girone B"];
    for (const name of groups) {
      const existing = await prisma.group.findFirst({
        where: {
          name,
          categoryId: categoryAquilotti.id,
        },
      });
      if (!existing) {
        await prisma.group.create({
          data: {
            name,
            categoryId: categoryAquilotti.id,
            seasonId: season.id,
            committeeId: committee.id,
          },
        });
        console.log(`✅ Girone creato: ${name}`);
      } else {
        console.log(`ℹ️ Girone già presente: ${name}`);
      }
    }
  }

  // ======================================================
  // CREA SQUADRE
  // ======================================================
  const teamNames = ["Pol. Basket A", "US Minibasket B"];
  const teams: any[] = [];

  for (const name of teamNames) {
    let team = await prisma.team.findFirst({ where: { name } });
    if (!team) {
      team = await prisma.team.create({ data: { name } });
      console.log(`✅ Creata squadra: ${name}`);
    } else {
      console.log(`ℹ️ Squadra già presente: ${name}`);
    }
    teams.push(team);
  }

  // assegna le squadre al Girone A (solo se esiste)
  const gironeA = await prisma.group.findFirst({
    where: { name: "Girone A", seasonId: season.id },
  });

  if (gironeA) {
    for (const t of teams) {
      const existing = await prisma.teamInGroup.findFirst({
        where: { groupId: gironeA.id, teamId: t.id },
      });
      if (!existing) {
        await prisma.teamInGroup.create({
          data: { groupId: gironeA.id, teamId: t.id },
        });
      }
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
