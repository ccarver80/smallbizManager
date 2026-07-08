import "dotenv/config";
import { PrismaClient, AppointmentStatus } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 12);

  // ── 1. QUOTE — Plumber ────────────────────────────────────────────────────
  const plumber = await prisma.business.upsert({
    where: { slug: "peak-plumbing" },
    update: {},
    create: {
      slug: "peak-plumbing",
      name: "Peak Plumbing Co.",
      tagline: "Licensed, fast, and priced fairly.",
      aboutText:
        "Family-owned plumbing company serving the metro area since 2008. We handle everything from leaky faucets to full pipe replacements — no job too small, no mess left behind. Licensed and insured.",
      contactEmail: "hello@peakplumbing.example",
      contactPhone: "(555) 210-4400",
      address: "Springfield, IL",
      quote_service: true,
      message_service: true,
      published: true,
      users: {
        create: { email: "plumber@example.com", password },
      },
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
            key: "peak-plumbing-1",
            caption: "Pipe installation",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
            key: "peak-plumbing-2",
            caption: "Water heater replacement",
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop",
            key: "peak-plumbing-3",
            caption: "Under-sink repair",
            sortOrder: 2,
          },
        ],
      },
      reviews: {
        create: [
          {
            authorName: "Linda M.",
            rating: 5,
            body: "Showed up within two hours of calling and fixed our burst pipe before it caused any real damage. Incredibly professional and the price was totally fair.",
          },
          {
            authorName: "Tom K.",
            rating: 5,
            body: "We had a mystery leak in the wall for weeks. These guys found it in under an hour and had it patched by the end of the day. Highly recommend.",
          },
          {
            authorName: "Sarah J.",
            rating: 4,
            body: "Good work replacing our water heater. Took a little longer than expected but they kept me updated the whole time.",
          },
        ],
      },
      quoteRequests: {
        create: [
          {
            customerName: "Greg P.",
            customerEmail: "greg@example.com",
            customerPhone: "(555) 310-1122",
            description: "Kitchen sink is draining very slowly and backing up. Also noticing a faint smell.",
            serviceAddress: "42 Maple Ave, Springfield, IL",
            timeline: "This week if possible",
          },
        ],
      },
    },
  });

  console.log("✓ Plumber:", plumber.slug);

  // ── 2. APPOINTMENT — Photographer ─────────────────────────────────────────
  const photographer = await prisma.business.upsert({
    where: { slug: "clara-light-photo" },
    update: {},
    create: {
      slug: "clara-light-photo",
      name: "Clara Light Photography",
      tagline: "Timeless portraits, real moments.",
      aboutText:
        "Hi, I'm Clara — a portrait and lifestyle photographer based in Austin. I specialize in natural-light sessions for families, couples, and small brands. Every gallery is delivered within 5 business days.",
      contactEmail: "clara@claralight.example",
      contactPhone: "(512) 889-3310",
      address: "Austin, TX",
      appointment_service: true,
      message_service: true,
      published: true,
      users: {
        create: { email: "photographer@example.com", password },
      },
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop",
            key: "clara-1",
            caption: "Golden hour portrait",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
            key: "clara-2",
            caption: "Outdoor family session",
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop",
            key: "clara-3",
            caption: "Natural light portrait",
            sortOrder: 2,
          },
          {
            url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop",
            key: "clara-4",
            caption: "Lifestyle couple session",
            sortOrder: 3,
          },
          {
            url: "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=800&auto=format&fit=crop",
            key: "clara-5",
            caption: "Mini session — kids",
            sortOrder: 4,
          },
          {
            url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&auto=format&fit=crop",
            key: "clara-6",
            caption: "Brand shoot",
            sortOrder: 5,
          },
        ],
      },
      reviews: {
        create: [
          {
            authorName: "Mia & Jake",
            rating: 5,
            body: "Clara made us feel so comfortable during our engagement shoot. The photos came back stunning — we could not be happier.",
          },
          {
            authorName: "Rebecca T.",
            rating: 5,
            body: "Booked Clara for our family photos and she was amazing with our kids. Photos were delivered in 4 days and they're absolutely beautiful.",
          },
          {
            authorName: "Priya S.",
            rating: 5,
            body: "Used Clara for my small business brand photos. Professional, quick to communicate, and the images are exactly what I needed for my website.",
          },
          {
            authorName: "Daniel W.",
            rating: 4,
            body: "Great experience overall. The photos are gorgeous. Would have loved a few more from the session but the ones we got are perfect.",
          },
        ],
      },
      appointments: {
        create: [
          {
            customerName: "Anna R.",
            customerEmail: "anna@example.com",
            requestedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            notes: "Looking for a golden hour session for our family of four.",
            status: AppointmentStatus.ACCEPTED,
          },
          {
            customerName: "Marcus L.",
            customerEmail: "marcus@example.com",
            customerPhone: "(512) 440-9982",
            requestedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            notes: "Brand shoot for my coffee roasting business. About 2 hours.",
            status: AppointmentStatus.NEW,
          },
        ],
      },
    },
  });

  console.log("✓ Photographer:", photographer.slug);

  // ── 3. PRODUCT — Craft seller ──────────────────────────────────────────────
  const crafter = await prisma.business.upsert({
    where: { slug: "made-by-molly" },
    update: {},
    create: {
      slug: "made-by-molly",
      name: "Made by Molly",
      tagline: "Handmade with love, shipped with care.",
      aboutText:
        "Everything in my shop is made by hand in my home studio in Vermont. I work with ceramic clay, natural dyes, and reclaimed wood — each piece is one of a kind. Orders ship within 3–5 days.",
      contactEmail: "molly@madebymolly.example",
      contactPhone: "(802) 554-7700",
      address: "Burlington, VT",
      product_service: true,
      message_service: true,
      published: true,
      users: {
        create: { email: "crafter@example.com", password },
      },
      products: {
        create: [
          {
            title: "Speckled Ceramic Mug",
            description: "Wheel-thrown stoneware mug, holds 12 oz. Microwave and dishwasher safe. Each one varies slightly — that's the point.",
            imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop",
            price: 38,
            sortOrder: 0,
          },
          {
            title: "Handwoven Cotton Tote",
            description: "Natural cotton, hand-loomed on a rigid heddle loom. 14\"×16\" with 10\" handles. Holds a week's worth of groceries.",
            imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop",
            price: 55,
            sortOrder: 1,
          },
          {
            title: "Soy Candle — Cedar & Sage",
            description: "8 oz hand-poured soy wax candle with a wood wick. Burns for ~45 hours. Cedar, sage, and a hint of black pepper.",
            imageUrl: "https://images.unsplash.com/photo-1602028915047-37269d369887?w=800&auto=format&fit=crop",
            price: 22,
            sortOrder: 2,
          },
          {
            title: "Wall Hanging — Desert Sun",
            description: "Macramé wall hanging on a reclaimed oak dowel. 18\" wide × 24\" long. Natural undyed cotton cord.",
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
            price: 85,
            sortOrder: 3,
          },
          {
            title: "Linen Napkin Set (4)",
            description: "Stonewashed linen dinner napkins, 18\"×18\". Natural flax color with a hand-stitched border. Gets softer with every wash.",
            imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
            price: 48,
            sortOrder: 4,
          },
          {
            title: "Beeswax Wrap Set (3)",
            description: "Reusable food wraps made with organic cotton, beeswax, and tree resin. Comes in S, M, L. Replaces plastic wrap.",
            imageUrl: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=800&auto=format&fit=crop",
            price: 18,
            sortOrder: 5,
          },
        ],
      },
      reviews: {
        create: [
          {
            authorName: "Hannah B.",
            rating: 5,
            body: "The mug I ordered is the most beautiful thing in my kitchen. Feels substantial in your hand and the glaze is just perfect. Already ordered two more.",
          },
          {
            authorName: "Claire D.",
            rating: 5,
            body: "Bought the tote and candle together as a gift. My friend lost her mind. Packaged so beautifully too — felt very special.",
          },
          {
            authorName: "Jess & Nate",
            rating: 5,
            body: "We ordered the napkin set for our wedding table. They arrived pressed and perfect. Molly even included a handwritten note.",
          },
          {
            authorName: "Ryan O.",
            rating: 4,
            body: "Love the wall hanging. Took about a week to arrive but it was worth the wait. Much larger than I expected — in a good way.",
          },
        ],
      },
    },
  });

  console.log("✓ Crafter:", crafter.slug);
  console.log("\nDone! Login credentials for all three accounts: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
