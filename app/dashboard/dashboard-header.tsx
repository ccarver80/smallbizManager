import { Button, Chip, Link as HeroLink, Typography } from "@heroui/react";
import { signOut } from "@/auth";
import type { Business } from "@/lib/generated/prisma/client";

export function DashboardHeader({ business }: { business: Business }) {
  const siteUrl = `//${business.subdomain}.${process.env.ROOT_DOMAIN}`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <Typography.Heading level={1} className="text-2xl">
            {business.name}
          </Typography.Heading>
          <Chip size="sm" color={business.published ? "success" : "default"}>
            {business.published ? "Published" : "Draft"}
          </Chip>
        </div>
        <HeroLink href={siteUrl} target="_blank" className="text-sm">
          {business.subdomain}.{process.env.ROOT_DOMAIN}
        </HeroLink>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
