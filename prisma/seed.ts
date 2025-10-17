import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const season = await prisma.season.upsert({
    where: { name: "2024/2025" },
    update: {},
    create: {
      name: "2024/2025",
      startDate: new Date("2024-07-01"),
      endDate: new Date("2025-06-30"),
      committees: {
        create: {
          name: "FIP ComoLecco",
          users: {
            create: {
              email: "admin@test.it",
              password: await bcrypt.hash("Mujanovic1!", 12),
              firstName: "Super",
              lastName: "Admin",
              teamName: "Informatica Comense",
              isAdmin: true,
              isSuperAdmin: true,
              emailVerified: true,
            },
          },
        },
      },
    },
  });
  console.log("✅ Seed completato:", season.name);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
