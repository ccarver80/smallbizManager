import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@heroui/react";
import { DashboardHeader } from "../dashboard-header";
import { EditBusinessForm } from "../edit-business-form";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
  });

  if (!business) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary px-6 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          ← Back to dashboard
        </Link>

        <DashboardHeader business={business} />

        <Card>
          <Card.Header>
            <Card.Title>Business info</Card.Title>
            <Card.Description>
              Clearing a field unpublishes your page until it&apos;s filled back in.
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
