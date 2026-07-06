import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@heroui/react";
import { DashboardHeader } from "./dashboard-header";
import { EditBusinessForm } from "./edit-business-form";
import { PublishedDashboard } from "./published-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    include: {
      photos: { orderBy: { createdAt: "asc" } },
      appointments: {
        where: { requestedAt: { gt: new Date() } },
        orderBy: { requestedAt: "asc" },
      },
      messages: { orderBy: { createdAt: "desc" } },
      products: { orderBy: { sortOrder: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, include: { product: true } },
    },
  });

  if (!business) {
    redirect("/login");
  }

  if (business.published) {
    return <PublishedDashboard business={business} />;
  }

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary px-6 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <DashboardHeader business={business} />

        <Card>
          <Card.Header>
            <Card.Title>Finish setting up your page</Card.Title>
            <Card.Description>
              Fill in every field below to publish your page live.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <EditBusinessForm business={business} />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
