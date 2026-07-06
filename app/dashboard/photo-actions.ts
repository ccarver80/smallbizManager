"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const utapi = new UTApi();

export async function deletePhoto(photoId: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, businessId: session.user.businessId },
  });
  if (!photo) {
    return;
  }

  await prisma.photo.delete({ where: { id: photo.id } });
  await utapi.deleteFiles(photo.key);

  revalidatePath("/dashboard");
}
