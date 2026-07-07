"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));

const CustomerSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required.").max(80),
  last_name: z.string().trim().min(1, "Last name is required.").max(80),
  email: z
    .email("Please enter a valid email.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  phone: optionalText(30),
});

export type CustomerState =
  | {
      errors?: {
        first_name?: string[];
        last_name?: string[];
        email?: string[];
        phone?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function addCustomer(
  _state: CustomerState,
  formData: FormData,
): Promise<CustomerState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = CustomerSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.customer.create({
    data: { businessId: session.user.businessId, ...validatedFields.data },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId: session.user.businessId },
  });
  if (!customer) {
    return;
  }

  await prisma.customer.delete({ where: { id: customer.id } });

  revalidatePath("/dashboard");
}
