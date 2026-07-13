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
        "group flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border-sand bg-fresh-white p-3 shadow-card transition-[transform,box-shadow] duration-300 motion-reduce:transition-none sm:p-4",
        !reducedMotion &&
          "hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative mb-3">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden rounded-xl bg-white ring-1 ring-border-sand/70"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              priority={priority}
            />
          </div>
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton productId={product.id} size="sm" />
        </div>
        <div className="absolute left-2 top-2">
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-soft-graphite shadow-sm">
            {product.subcategory}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-0.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-garden-green">
          {product.category}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <h3 className="line-clamp-2 min-h-[2.75rem] font-heading text-[15px] font-semibold leading-snug text-market-ink transition-colors group-hover:text-garden-green">
            {product.title}
          </h3>
        </Link>

        <p className="min-h-[1rem] text-xs text-soft-graphite">
          {product.packageSize}
          {product.sellingUnit ? ` · ${product.sellingUnit}` : ""}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex min-h-[1.75rem] items-center justify-between gap-2">
            <PriceDisplay product={product} size="md" showDemoLabel={false} />
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
