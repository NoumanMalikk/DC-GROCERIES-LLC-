import Image from "next/image";
import Link from "next/link";
import { Snowflake } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { getProductMainImage } from "@/lib/format";
import { canShipRefrigeratedItems } from "@data/shipping-rules";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/product/AddToCartButton";

const refrigeratedSlugs = [
  "grade-a-large-white-eggs-12-count",
  "whole-milk-1-gallon",
  "plain-greek-yogurt-32oz",
] as const;

export function RefrigeratedEssentials() {
  const items = refrigeratedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  const refrigerationReady = canShipRefrigeratedItems();

  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading
            title="Refrigerated essentials"
            description="Eggs, milk and yogurt with clear package sizes. Live shipping for temperature-sensitive items requires cold-chain configuration."
          />
          {!refrigerationReady && (
            <Badge variant="warning" className="shrink-0 self-start">
              <Snowflake className="size-3" />
              Cold-chain pending
            </Badge>
          )}
        </div>

        {!refrigerationReady && (
          <div
            role="status"
            className="mb-8 rounded-xl border border-border-sand bg-fresh-white px-4 py-3 text-sm text-soft-graphite"
          >
            Refrigerated fulfilment remains disabled until cold-chain shipping
            is configured. You can still browse these items in the catalog.
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-3" role="list">
          {items.map((product) => {
            if (!product) return null;
            const { src, alt } = getProductMainImage(product);

            return (
              <li key={product.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-sand bg-fresh-white shadow-card">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-square bg-white ring-1 ring-inset ring-border-sand/50"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-5"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="line-clamp-2 min-h-[2.75rem] font-heading text-base font-semibold text-market-ink hover:text-garden-green">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-soft-graphite">
                      {product.packageSize}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <PriceDisplay product={product} size="sm" />
                      <AvailabilityBadge status={product.availabilityStatus} />
                    </div>
                    <AddToCartButton
                      product={product}
                      size="sm"
                      fullWidth
                      variant="primary"
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
