import { Button, Chip, Link as HeroLink, Typography } from "@heroui/react";
import { signOut } from "@/auth";
export function DashboardHeader({
  business,
}: {
  business: { name: string; slug: string; published: boolean };
}) {
  const rootDomain = process.env.ROOT_DOMAIN ?? "mybiz.host";
  const siteUrl = `//${rootDomain}/${business.slug}`;

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
          {rootDomain}/{business.slug}
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
