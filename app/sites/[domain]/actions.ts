"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const ReviewSchema = z.object({
  authorName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  rating: z.coerce.number("Please select a rating.").int().min(1, "Please select a rating.").max(5),
  body: z.string().trim().min(10, "Review must be at least 10 characters.").max(1000),
});

export type ReviewState =
  | {
      errors?: {
        authorName?: string[];
        rating?: string[];
        body?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function submitReview(
  businessId: string,
  subdomain: string,
  _state: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const validatedFields = ReviewSchema.safeParse({
    authorName: formData.get("authorName"),
    rating: formData.get("rating"),
    body: formData.get("body"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.review.create({
    data: { businessId, ...validatedFields.data },
  });

  revalidatePath(`/sites/${subdomain}`);

  return { success: true, message: "Thanks for your review!" };
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));

const AppointmentSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  customerEmail: z.email("Please enter a valid email.").trim(),
  customerPhone: optionalText(30),
  requestedAt: z.coerce
    .date("Please choose a date and time.")
    .refine((date) => date.getTime() > Date.now(), {
      message: "Please choose a time in the future.",
    }),
  notes: optionalText(500),
});

export type AppointmentState =
  | {
      errors?: {
        customerName?: string[];
        customerEmail?: string[];
        customerPhone?: string[];
        requestedAt?: string[];
        notes?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function requestAppointment(
  businessId: string,
  subdomain: string,
  _state: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const validatedFields = AppointmentSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    requestedAt: formData.get("requestedAt"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.appointment.create({
    data: { businessId, ...validatedFields.data },
  });

  revalidatePath(`/sites/${subdomain}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your appointment request has been sent!" };
}

const MessageSchema = z.object({
  contact_email: z.email("Please enter a valid email.").trim(),
  body: z.string().trim().min(10, "Message must be at least 10 characters.").max(2000),
});

export type MessageState =
  | {
      errors?: {
        contact_email?: string[];
        body?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function sendMessage(
  businessId: string,
  subdomain: string,
  _state: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const validatedFields = MessageSchema.safeParse({
    contact_email: formData.get("contact_email"),
    body: formData.get("body"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.message.create({
    data: { businessId, ...validatedFields.data },
  });

  revalidatePath(`/sites/${subdomain}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your message has been sent!" };
}

const OrderSchema = z.object({
  productId: optionalText(100),
  quantity: z.coerce
    .number("Enter a valid quantity.")
    .int()
    .min(1, "Quantity must be at least 1.")
    .max(999),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  customerEmail: z.email("Please enter a valid email.").trim(),
  customerPhone: optionalText(30),
  notes: optionalText(500),
});

export type OrderState =
  | {
      errors?: {
        productId?: string[];
        quantity?: string[];
        customerName?: string[];
        customerEmail?: string[];
        customerPhone?: string[];
        notes?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function requestOrder(
  businessId: string,
  subdomain: string,
  _state: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const validatedFields = OrderSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { productId, ...rest } = validatedFields.data;

  let validProductId: string | null = null;
  if (productId) {
    const product = await prisma.product.findFirst({
      where: { id: productId, businessId },
    });
    validProductId = product?.id ?? null;
  }

  await prisma.order.create({
    data: { businessId, productId: validProductId, ...rest },
  });

  revalidatePath(`/sites/${subdomain}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your order request has been sent!" };
}
