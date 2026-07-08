"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const QuoteSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  customerEmail: z.email("Please enter a valid email.").trim(),
  customerPhone: optionalText(30),
  description: z.string().trim().min(10, "Please describe what you need (at least 10 characters).").max(2000),
  serviceAddress: optionalText(200),
  timeline: optionalText(100),
  notes: optionalText(500),
});

export type QuoteState =
  | {
      errors?: {
        customerName?: string[];
        customerEmail?: string[];
        customerPhone?: string[];
        description?: string[];
        serviceAddress?: string[];
        timeline?: string[];
        notes?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function requestQuote(
  businessId: string,
  slug: string,
  _state: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const validatedFields = QuoteSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    description: formData.get("description"),
    serviceAddress: formData.get("serviceAddress"),
    timeline: formData.get("timeline"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.quoteRequest.create({
    data: { businessId, ...validatedFields.data },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your quote request has been sent!" };
}

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
  slug: string,
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

  revalidatePath(`/${slug}`);

  return { success: true, message: "Thanks for your review!" };
}



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
  slug: string,
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

  revalidatePath(`/${slug}`);
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
  slug: string,
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

  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your message has been sent!" };
}

const OrderItemSchema = z.object({
  productId: z.string().trim().min(1, "Choose a product."),
  quantity: z.coerce
    .number("Enter a valid quantity.")
    .int()
    .min(1, "Quantity must be at least 1.")
    .max(999),
});

const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Add at least one item."),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  customerEmail: z.email("Please enter a valid email.").trim(),
  customerPhone: optionalText(30),
  notes: optionalText(500),
});

export type OrderState =
  | {
      errors?: {
        items?: string[];
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
  slug: string,
  _state: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const productIds = formData.getAll("productId[]");
  const quantities = formData.getAll("quantity[]");

  const rawItems = productIds
    .map((productId, index) => ({
      productId,
      quantity: quantities[index],
    }))
    .filter((item) => item.productId);

  const validatedFields = OrderSchema.safeParse({
    items: rawItems,
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { items, ...orderFields } = validatedFields.data;

  const businessProducts = await prisma.product.findMany({
    where: { businessId, id: { in: items.map((item) => item.productId) } },
    select: { id: true },
  });
  const validProductIds = new Set(businessProducts.map((product) => product.id));
  const validItems = items.filter((item) => validProductIds.has(item.productId));

  if (validItems.length === 0) {
    return { errors: { items: ["Choose at least one valid product."] } };
  }

  await prisma.order.create({
    data: {
      businessId,
      ...orderFields,
      items: {
        create: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard");

  return { success: true, message: "Your order request has been sent!" };
}
