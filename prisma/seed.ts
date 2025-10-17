import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const superEmail = process.env.SUPERADMIN_EMAIL!;
  const superPass  = process.env.SUPERADMIN_PASSWORD!;
  const hash = await bcrypt.hash(superPass, 12);

  const season = await prisma.season.upsert({
    where: { name: "2024/2025" },
    update: {},
    create: { name: "2024/2025", startDate: new Date("2024-07-01"), endDate: new Date("2025-06-30") },
  });

  const comolecco = await prisma.committee.upsert({
    where: { seasonId_name: { seasonId: season.id, name: "FIP ComoLecco" } },
    update: {},
    create: { name: "FIP ComoLecco", seasonId: season.id },
  });

  await prisma.user.upsert({
    where: { email: superEmail },
    update: {},
    create: {
      email: superEmail,
      password: hash,
      firstName: "Super",
      lastName: "Admin",
      teamName: "",
      isSuperAdmin: true,
      emailVerified: true,
      committeeId: null
    },
  });
}

main().finally(() => prisma.$disconnect());
