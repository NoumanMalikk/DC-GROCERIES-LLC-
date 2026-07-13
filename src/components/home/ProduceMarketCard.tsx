import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { getProductMainImage } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ProduceMarketCardProps {
  product: Product;
  className?: string;
}

function formatOrigin(product: Product): string | null {
  if (
    product.labelVerificationStatus === "verified" &&
    product.countryOfOrigin &&
    product.countryOfOrigin !== "Verification required"
  ) {
    return product.countryOfOrigin;
  }
  return null;
}

export function ProduceMarketCard({ product, className }: ProduceMarketCardProps) {
  const { src, alt } = getProductMainImage(product);
  const origin = formatOrigin(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border-sand bg-fresh-white shadow-card transition-shadow hover:shadow-card-hover motion-reduce:transition-none",
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-produce-mist">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h4 className="font-heading text-base font-semibold leading-snug text-market-ink group-hover:text-garden-green">
          {product.title}
        </h4>

        <dl className="grid gap-1 text-xs text-soft-graphite">
          {product.variety && (
            <div className="flex gap-1">
              <dt className="font-medium">Variety:</dt>
              <dd>{product.variety}</dd>
            </div>
          )}
          <div className="flex gap-1">
            <dt className="font-medium">Unit:</dt>
            <dd>{product.sellingUnit}</dd>
          </div>
          {product.netWeight && (
            <div className="flex gap-1">
              <dt className="font-medium">Weight:</dt>
              <dd>{product.netWeight}</dd>
            </div>
          )}
          {origin && (
            <div className="flex gap-1">
              <dt className="font-medium">Origin:</dt>
              <dd>{origin}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceDisplay product={product} size="sm" />
          <AvailabilityBadge status={product.availabilityStatus} />
        </div>
      </div>
    </Link>
  );
}
