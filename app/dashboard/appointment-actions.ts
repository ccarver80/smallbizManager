"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.NEW]: "New",
  [AppointmentStatus.ACCEPTED]: "Accepted",
  [AppointmentStatus.FINISHED]: "Finished",
};

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId: session.user.businessId },
  });
  if (!appointment) {
    return;
  }

  await prisma.appointment.update({ where: { id: appointment.id }, data: { status } });

  await prisma.appointmentNote.create({
    data: {
      appointmentId: appointment.id,
      note: `Status changed to ${statusLabels[status]}.`,
    },
  });

  revalidatePath("/dashboard");
}

const AppointmentNoteSchema = z.object({
  note: z.string().trim().min(1, "Comment can't be empty.").max(1000),
});

export type AppointmentNoteState =
  | { message?: string; success?: boolean }
  | undefined;

export async function addAppointmentNote(
  appointmentId: string,
  _state: AppointmentNoteState,
  formData: FormData,
): Promise<AppointmentNoteState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in." };
  }

  const validatedFields = AppointmentNoteSchema.safeParse({
    note: formData.get("note"),
  });
  if (!validatedFields.success) {
    return {
      message: z.flattenError(validatedFields.error).fieldErrors.note?.[0],
    };
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId: session.user.businessId },
  });
  if (!appointment) {
    return { message: "Appointment not found." };
  }

  await prisma.appointmentNote.create({
    data: { appointmentId: appointment.id, note: validatedFields.data.note },
  });

  revalidatePath("/dashboard");

  return { success: true };
}
