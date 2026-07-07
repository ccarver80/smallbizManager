"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { OrderStatus } from "@/lib/generated/prisma/enums";

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.NEW]: "New",
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.FINISHED]: "Finished",
};

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: session.user.businessId },
  });
  if (!order) {
    return;
  }

  await prisma.order.update({ where: { id: order.id }, data: { status } });

  await prisma.orderNote.create({
    data: { orderId: order.id, note: `Status changed to ${statusLabels[status]}.` },
  });

  revalidatePath("/dashboard");
}

export async function markOrderPaid(orderId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: session.user.businessId },
  });
  if (!order) {
    return;
  }

  await prisma.order.update({ where: { id: order.id }, data: { paid: true } });

  await prisma.orderNote.create({
    data: { orderId: order.id, note: "Marked as paid." },
  });

  revalidatePath("/dashboard");
}

export async function markOrderUnpaid(orderId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: session.user.businessId },
  });
  if (!order) {
    return;
  }

  await prisma.order.update({ where: { id: order.id }, data: { paid: false } });

  await prisma.orderNote.create({
    data: { orderId: order.id, note: "Marked as unpaid." },
  });

  revalidatePath("/dashboard");
}

const OrderNoteSchema = z.object({
  note: z.string().trim().min(1, "Comment can't be empty.").max(1000),
});

export type OrderNoteState =
  | { message?: string; success?: boolean }
  | undefined;

export async function addOrderNote(
  orderId: string,
  _state: OrderNoteState,
  formData: FormData,
): Promise<OrderNoteState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = OrderNoteSchema.safeParse({
    note: formData.get("note"),
  });
  if (!validatedFields.success) {
    return {
      message: z.flattenError(validatedFields.error).fieldErrors.note?.[0],
    };
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: session.user.businessId },
  });
  if (!order) {
    return { message: "Order not found." };
  }

  await prisma.orderNote.create({
    data: { orderId: order.id, note: validatedFields.data.note },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

const ReplySchema = z.object({
  message: z.string().trim().min(1, "Message can't be empty.").max(2000),
});

export type OrderReplyState =
  | { message?: string; success?: boolean }
  | undefined;

export async function replyToCustomer(
  orderId: string,
  _state: OrderReplyState,
  formData: FormData,
): Promise<OrderReplyState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = ReplySchema.safeParse({
    message: formData.get("message"),
  });
  if (!validatedFields.success) {
    return {
      message: z.flattenError(validatedFields.error).fieldErrors.message?.[0],
    };
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: session.user.businessId },
  });
  if (!order) {
    return { message: "Order not found." };
  }
  if (!order.customerEmail) {
    return { message: "This order has no customer email on file." };
  }

  await sendMail({
    to: order.customerEmail,
    subject: `Update on your order`,
    text: validatedFields.data.message,
  });

  await prisma.orderNote.create({
    data: {
      orderId: order.id,
      note: `Sent Email Reply: "${validatedFields.data.message}"`,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Reply sent!" };
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));

const CreateOrderItemSchema = z.object({
  productId: z.string().trim().min(1, "Choose a product."),
  quantity: z.coerce
    .number("Enter a valid quantity.")
    .int()
    .min(1, "Quantity must be at least 1.")
    .max(999),
});

const CreateOrderSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1, "Add at least one item."),
  customerName: z
    .string()
    .trim()
    .min(1, "Name can't be empty.")
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || "Walk-in Customer"),
  customerEmail: z
    .email("Please enter a valid email.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  customerPhone: optionalText(30),
  notes: optionalText(500),
  status: z.enum(OrderStatus),
  paid: z.coerce.boolean(),
});

export type CreateOrderState =
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

export async function createOrder(
  _state: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const productIds = formData.getAll("productId[]");
  const quantities = formData.getAll("quantity[]");

  const rawItems = productIds
    .map((productId, index) => ({
      productId,
      quantity: quantities[index],
    }))
    .filter((item) => item.productId);

  const validatedFields = CreateOrderSchema.safeParse({
    items: rawItems,
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
    status: formData.get("status"),
    paid: formData.get("paid"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { items, status, paid, ...orderFields } = validatedFields.data;
  const businessId = session.user.businessId;

  const businessProducts = await prisma.product.findMany({
    where: { businessId, id: { in: items.map((item) => item.productId) } },
    select: { id: true },
  });
  const validProductIds = new Set(businessProducts.map((product) => product.id));
  const validItems = items.filter((item) => validProductIds.has(item.productId));

  if (validItems.length === 0) {
    return { errors: { items: ["Choose at least one valid product."] } };
  }

  const order = await prisma.order.create({
    data: {
      businessId,
      status,
      paid,
      ...orderFields,
      items: {
        create: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  await prisma.orderNote.create({
    data: {
      orderId: order.id,
      note: `Order created via dashboard (status: ${statusLabels[status]}, ${paid ? "paid" : "not paid"}).`,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, message: "Order added!" };
}
