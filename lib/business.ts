import type { Business } from "@/lib/generated/prisma/client";

const REQUIRED_FIELDS = [
  "name",
  "subdomain",
  "tagline",
  "aboutText",
  "contactEmail",
  "contactPhone",
  "address",
] as const satisfies readonly (keyof Business)[];

export function isBusinessComplete(business: Pick<Business, (typeof REQUIRED_FIELDS)[number]>) {
  return REQUIRED_FIELDS.every((field) => Boolean(business[field]?.toString().trim()));
}
