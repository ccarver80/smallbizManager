import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  businessPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }
      return { businessId: session.user.businessId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.photo.create({
        data: {
          businessId: metadata.businessId,
          url: file.ufsUrl,
          key: file.key,
        },
      });
    }),

  productPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }
      return { businessId: session.user.businessId };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
