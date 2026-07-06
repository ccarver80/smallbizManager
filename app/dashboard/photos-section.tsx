"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Card, EmptyState, Typography } from "@heroui/react";
import { UploadDropzone } from "@/lib/uploadthing";
import { deletePhoto } from "./photo-actions";
import type { Photo } from "@/lib/generated/prisma/client";

export function PhotosSection({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Photos</Card.Title>
        <Card.Description>
          Add photos to show off your work, products, or space.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isDisabled={isPending}
                  onPress={() =>
                    startTransition(async () => {
                      await deletePhoto(photo.id);
                      router.refresh();
                    })
                  }
                  className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
            <Typography.Paragraph size="sm" className="text-muted">
              No photos yet
            </Typography.Paragraph>
          </EmptyState>
        )}

        <UploadDropzone
          endpoint="businessPhoto"
          onClientUploadComplete={() => router.refresh()}
          onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
        />
      </Card.Content>
    </Card>
  );
}
