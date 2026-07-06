import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getBusinessBySubdomain = cache(async (subdomain: string) => {
  return prisma.business.findFirst({
    where: { subdomain, published: true },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
});

export type BusinessWithRelations = NonNullable<
  Awaited<ReturnType<typeof getBusinessBySubdomain>>
>;

export async function incrementPageView(businessId: string) {
  await prisma.business.update({
    where: { id: businessId },
    data: { page_views: { increment: 1 } },
  });
}
