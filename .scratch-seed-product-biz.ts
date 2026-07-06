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
      name: "Test Bakery Co",
      subdomain: "test-bakery-co",
      businessType: "PRODUCT",
      published: true,
      tagline: "t",
      aboutText: "t",
      contactEmail: "t@t.com",
      contactPhone: "t",
      address: "t",
      products: { create: { title: "Test Cake", price: 25, description: "A test cake." } },
      users: { create: { email: "test-bakery@example.com", password: hash } },
    },
  });
  console.log("seeded PRODUCT business");
}

main().finally(() => prisma.$disconnect());
