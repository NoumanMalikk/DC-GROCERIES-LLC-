"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { getProductMainImage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

export interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const { src, alt } = getProductMainImage(product);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border-sand bg-fresh-white p-4 shadow-card transition-shadow duration-300 motion-reduce:transition-none",
        !reducedMotion && "hover:shadow-card-hover hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative mb-3">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden rounded-lg bg-produce-mist"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
              priority={priority}
            />
          </div>
        </Link>
        <div className="absolute right-1 top-1">
          <WishlistButton productId={product.id} size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          <h3 className="line-clamp-2 min-h-[2.75rem] font-heading text-sm font-semibold leading-snug text-market-ink transition-colors group-hover:text-garden-green">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-soft-graphite">{product.packageSize}</p>

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between gap-2">
            <PriceDisplay product={product} size="md" />
            <AvailabilityBadge status={product.availabilityStatus} />
          </div>

          <AddToCartButton
            product={product}
            size="sm"
            fullWidth
            variant="primary"
          />
        </div>
      </div>
    </article>
  );
}
