"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ProductSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(100),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  price: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number("Enter a valid price.").min(0, "Price can't be negative.").optional(),
    )
    .transform((value) => value ?? null),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
});

export type ProductState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        price?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function addProduct(
  _state: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = ProductSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.product.create({
    data: { businessId: session.user.businessId, ...validatedFields.data },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, businessId: session.user.businessId },
  });
  if (!product) {
    return;
  }

  await prisma.product.delete({ where: { id: product.id } });

  revalidatePath("/dashboard");
}
