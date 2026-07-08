import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getBusinessBySlug = cache(async (slug: string) => {
  return prisma.business.findFirst({
    where: { slug, published: true },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { sortOrder: "asc" } },
      events: { where: { startsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" } },
    },
  });
});

export type BusinessWithRelations = NonNullable<
  Awaited<ReturnType<typeof getBusinessBySlug>>
>;

export async function incrementPageView(businessId: string) {
  await prisma.business.update({
    where: { id: businessId },
    data: { page_views: { increment: 1 } },
  });
}
