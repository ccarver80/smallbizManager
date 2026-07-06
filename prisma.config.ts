import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection; the app uses
    // DATABASE_URL (pooled) at runtime via the driver adapter instead.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
