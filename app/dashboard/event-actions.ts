"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const EventSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(120),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  location: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  startsAt: z.coerce.date("Please enter a valid start date."),
  endsAt: z.string().optional().transform((v) => (v ? new Date(v) : null)),
});

export type EventState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        location?: string[];
        startsAt?: string[];
        endsAt?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function createEvent(
  _state: EventState,
  formData: FormData,
): Promise<EventState> {
  const session = await auth();
  if (!session?.user) return { message: "You must be signed in." };

  const validatedFields = EventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  await prisma.event.create({
    data: { businessId: session.user.businessId, ...validatedFields.data },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Event added!" };
}

export async function deleteEvent(eventId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) return;

  await prisma.event.deleteMany({
    where: { id: eventId, businessId: session.user.businessId },
  });

  revalidatePath("/dashboard");
}
