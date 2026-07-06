"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RESERVED_SUBDOMAINS, SUBDOMAIN_PATTERN } from "@/lib/subdomain";
import { isBusinessComplete } from "@/lib/business";
import { BusinessType } from "@/lib/generated/prisma/enums";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));

const UpdateBusinessSchema = z.object({
  name: z.string().trim().min(2, "Business name must be at least 2 characters."),
  subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Domain must be at least 3 characters.")
    .max(63, "Domain must be at most 63 characters.")
    .regex(SUBDOMAIN_PATTERN, "Use lowercase letters, numbers, and hyphens only."),
  businessType: z.enum(BusinessType, "Choose a business type."),
  tagline: optionalText(140),
  aboutText: optionalText(2000),
  contactEmail: z
    .email("Please enter a valid email.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  contactPhone: optionalText(30),
  address: optionalText(200),
});

export type UpdateBusinessState =
  | {
      errors?: {
        name?: string[];
        subdomain?: string[];
        businessType?: string[];
        tagline?: string[];
        aboutText?: string[];
        contactEmail?: string[];
        contactPhone?: string[];
        address?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateBusiness(
  _state: UpdateBusinessState,
  formData: FormData,
): Promise<UpdateBusinessState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = UpdateBusinessSchema.safeParse({
    name: formData.get("name"),
    subdomain: formData.get("subdomain"),
    businessType: formData.get("businessType"),
    tagline: formData.get("tagline"),
    aboutText: formData.get("aboutText"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { name, subdomain, businessType, tagline, aboutText, contactEmail, contactPhone, address } =
    validatedFields.data;

  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return { errors: { subdomain: ["This domain is reserved."] } };
  }

  const existingBusiness = await prisma.business.findUnique({ where: { subdomain } });
  if (existingBusiness && existingBusiness.id !== session.user.businessId) {
    return { errors: { subdomain: ["This domain is already taken."] } };
  }

  const published = isBusinessComplete({
    name,
    subdomain,
    tagline,
    aboutText,
    contactEmail,
    contactPhone,
    address,
  });

  await prisma.business.update({
    where: { id: session.user.businessId },
    data: {
      name,
      subdomain,
      businessType,
      tagline,
      aboutText,
      contactEmail,
      contactPhone,
      address,
      published,
    },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    message: published
      ? "Changes saved. Your page is live!"
      : "Changes saved. Fill in every field to publish your page.",
  };
}
