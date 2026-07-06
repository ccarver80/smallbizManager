import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { subdomain: "acme" },
    update: {},
    create: {
      subdomain: "acme",
      name: "Acme Pottery Studio",
      tagline: "Handcrafted ceramics, made in small batches.",
      aboutText:
        "Acme Pottery Studio has been throwing and glazing functional ceramics since 2015. Every piece is wheel-thrown and fired in our small backyard kiln.",
      contactEmail: "hello@acmepottery.example",
      contactPhone: "+1 (555) 010-1234",
      address: "123 Kiln Street, Springfield",
      products: {
        create: [
          {
            title: "Speckled Stoneware Mug",
            description: "12oz mug in a warm speckled glaze.",
            price: 28,
            sortOrder: 0,
          },
          {
            title: "Wide Serving Bowl",
            description: "10-inch bowl, food-safe glaze, dishwasher safe.",
            price: 64,
            sortOrder: 1,
          },
          {
            title: "Bud Vase Set (3)",
            description: "Three mini vases in complementary earth tones.",
            price: 45,
            sortOrder: 2,
          },
        ],
      },
      reviews: {
        create: [
          {
            authorName: "Jamie R.",
            rating: 5,
            body: "The mugs are even more beautiful in person. Ordering more for gifts.",
          },
          {
            authorName: "Priya K.",
            rating: 4,
            body: "Lovely craftsmanship, shipping took a little longer than expected.",
          },
        ],
      },
    },
  });

  console.log(`Seeded business: ${business.name} (${business.subdomain})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
