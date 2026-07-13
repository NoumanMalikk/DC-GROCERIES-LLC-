"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Maximize2, ZoomIn } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  product: Product;
  className?: string;
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const images = product.imageGallery;
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const activeImage = images[activeIndex] ?? images[0];
  const isPlaceholder = activeImage?.type === "placeholder";

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setActiveIndex(((index % images.length) + images.length) % images.length);
      setZoomed(false);
    },
    [images.length],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goTo(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        goTo(activeIndex + 1);
      }
    },
    [activeIndex, goTo],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border-sand bg-produce-mist">
        <button
          type="button"
          className={cn(
            "relative block aspect-square w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            zoomed && "cursor-zoom-out",
          )}
          onClick={() => setZoomed((z) => !z)}
          onDoubleClick={() => setFullscreenOpen(true)}
          aria-label={
            zoomed
              ? "Zoom out product image"
              : "Zoom in product image. Double-click for fullscreen."
          }
        >
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-contain p-6 transition-transform duration-300 motion-reduce:transition-none",
              zoomed && "scale-150",
            )}
            priority
          />
        </button>

        <div className="absolute right-3 top-3 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            <ZoomIn />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={() => setFullscreenOpen(true)}
            aria-label="View fullscreen"
          >
            <Maximize2 />
          </Button>
        </div>

        {isPlaceholder && (
          <p className="absolute bottom-0 left-0 right-0 bg-market-ink/80 px-3 py-2 text-center text-xs text-fresh-white">
            Placeholder image - exact product photo required
          </p>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              role="listitem"
              onClick={() => goTo(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border bg-produce-mist transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                index === activeIndex
                  ? "border-garden-green"
                  : "border-border-sand hover:border-garden-green/50",
              )}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent
          className="max-w-4xl border-none bg-market-ink/95 p-4 sm:p-6"
          showClose
        >
          <DialogTitle className="sr-only">
            {product.title} - fullscreen image
          </DialogTitle>
          <div className="relative aspect-square w-full">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goTo(activeIndex - 1)}
                className="border-fresh-white/30 text-fresh-white hover:bg-fresh-white/10"
              >
                Previous
              </Button>
              <span className="flex items-center text-sm text-fresh-white/80">
                {activeIndex + 1} / {images.length}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goTo(activeIndex + 1)}
                className="border-fresh-white/30 text-fresh-white hover:bg-fresh-white/10"
              >
                Next
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
