import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "./lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash("Testpass123", 12);
  await prisma.business.create({
    data: {
      name: "Test Verify Co",
      subdomain: "test-verify-co",
      users: { create: { email: "test-verify@example.com", password: hash } },
    },
  });
  console.log("seeded (unpublished, incomplete)");
}

main().finally(() => prisma.$disconnect());
