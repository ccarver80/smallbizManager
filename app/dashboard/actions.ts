"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RESERVED_SLUGS, SLUG_PATTERN } from "@/lib/slug";
import { isBusinessComplete } from "@/lib/business";

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
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "URL must be at least 3 characters.")
    .max(63, "URL must be at most 63 characters.")
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only."),
  appointment_service: z.boolean(),
  quote_service: z.boolean(),
  product_service: z.boolean(),
  message_service: z.boolean(),
  event_service: z.boolean(),
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
        slug?: string[];
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
    slug: formData.get("slug"),
    appointment_service: formData.get("appointment_service") === "on",
    quote_service: formData.get("quote_service") === "on",
    product_service: formData.get("product_service") === "on",
    message_service: formData.get("message_service") === "on",
    event_service: formData.get("event_service") === "on",
    tagline: formData.get("tagline"),
    aboutText: formData.get("aboutText"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { name, slug, appointment_service, quote_service, product_service, message_service, event_service, tagline, aboutText, contactEmail, contactPhone, address } =
    validatedFields.data;

  if (RESERVED_SLUGS.has(slug)) {
    return { errors: { slug: ["This URL is reserved."] } };
  }

  const existingBusiness = await prisma.business.findUnique({ where: { slug } });
  if (existingBusiness && existingBusiness.id !== session.user.businessId) {
    return { errors: { slug: ["This URL is already taken."] } };
  }

  const published = isBusinessComplete({
    name,
    slug,
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
      slug,
      appointment_service,
      quote_service,
      product_service,
      message_service,
      event_service,
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

export type UpdateServicesState =
  | { success?: boolean; message?: string }
  | undefined;

export async function updateServices(
  _state: UpdateServicesState,
  formData: FormData,
): Promise<UpdateServicesState> {
  const session = await auth();
  if (!session?.user) return { message: "You must be signed in." };

  await prisma.business.update({
    where: { id: session.user.businessId },
    data: {
      appointment_service: formData.get("appointment_service") === "on",
      quote_service: formData.get("quote_service") === "on",
      product_service: formData.get("product_service") === "on",
      message_service: formData.get("message_service") === "on",
      event_service: formData.get("event_service") === "on",
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
