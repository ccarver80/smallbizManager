"use client";

import { useEffect, useState } from "react";
import { Modal, Typography, useOverlayState } from "@heroui/react";
import type { Photo } from "@/lib/generated/prisma/client";

export function GallerySection({
  photos,
  businessName,
}: {
  photos: Photo[];
  businessName: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const overlay = useOverlayState({
    isOpen: activeIndex !== null,
    onOpenChange: (isOpen) => {
      if (!isOpen) setActiveIndex(null);
    },
  });

  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <section id="gallery" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Gallery
        </Typography.Heading>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="aspect-square overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption ?? businessName}
                className="h-full w-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <Modal state={overlay}>
        <Modal.Backdrop variant="opaque" className="bg-black/90">
          <Modal.Container size="full" placement="center">
            <Modal.Dialog className="relative flex h-full w-full items-center justify-center bg-transparent p-0 shadow-none">
              <Modal.CloseTrigger className="absolute top-4 right-4 z-10 text-white" />

              {activePhoto && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption ?? businessName}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                  />

                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={showPrev}
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="Next photo"
                        onClick={showNext}
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
                      >
                        ›
                      </button>
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                        {activeIndex! + 1} / {photos.length}
                      </span>
                    </>
                  )}
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}
