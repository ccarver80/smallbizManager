import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getBusinessBySubdomain = cache(async (subdomain: string) => {
  return prisma.business.findUnique({
    where: { subdomain },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
});

export type BusinessWithRelations = NonNullable<
  Awaited<ReturnType<typeof getBusinessBySubdomain>>
>;
