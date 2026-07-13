import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Snowflake } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { getProductMainImage } from "@/lib/format";
import { canShipRefrigeratedItems } from "@data/shipping-rules";
import { isDemoMode } from "@data/store-config";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";

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
  const inDevelopment = isDemoMode() || !refrigerationReady;

  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading
            title="Refrigerated essentials"
            description="Eggs, milk and yogurt listings are shown for reference. Purchase is blocked until refrigerated fulfilment is configured."
          />
          {inDevelopment && (
            <Badge variant="warning" className="shrink-0 self-start">
              <Snowflake className="size-3" />
              Development mode
            </Badge>
          )}
        </div>

        {inDevelopment && (
          <div
            role="alert"
            className="mb-8 flex gap-3 rounded-xl border border-citrus-orange/40 bg-citrus-orange/10 px-4 py-3 text-sm text-market-ink"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-citrus-orange" />
            <p>
              Refrigerated items cannot be purchased until cold-chain shipping and
              inventory verification are complete. These listings are visible for
              planning only—add-to-cart and checkout are disabled for this
              section.
            </p>
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-3" role="list">
          {items.map((product) => {
            if (!product) return null;
            const { src, alt } = getProductMainImage(product);

            return (
              <li key={product.id}>
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border-sand bg-fresh-white opacity-90 shadow-card">
                  <div className="relative aspect-[4/3] bg-produce-mist">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-4 grayscale-[30%]"
                    />
                    {inDevelopment && (
                      <div className="absolute inset-0 flex items-center justify-center bg-market-ink/5">
                        <span className="rounded-md bg-market-ink/80 px-2 py-1 text-xs font-semibold text-fresh-white">
                          Not available for purchase
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-heading text-sm font-semibold text-market-ink hover:text-garden-green"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-soft-graphite">
                      {product.sellingUnit}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <PriceDisplay product={product} size="sm" />
                      <AvailabilityBadge status={product.availabilityStatus} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-xs text-soft-graphite">
          Butter is not yet listed in the catalog. Refrigerated fulfilment
          readiness will be announced when available.
        </p>
      </Container>
    </section>
  );
}
