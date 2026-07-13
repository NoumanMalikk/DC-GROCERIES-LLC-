"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { getProductById } from "@data/products";
import { storeConfig } from "@data/store-config";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { Button, buttonVariants } from "@/components/ui/button";
import { isDemoMode } from "@data/store-config";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);

  const products = items
    .map((item) => getProductById(item.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
        className="mb-6"
      />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          as="h1"
          title="Wishlist"
          description={
            products.length > 0
              ? `${products.length} saved ${products.length === 1 ? "item" : "items"}`
              : "Save products you want to revisit later."
          }
        />

        {products.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => items.forEach((i) => removeItem(i.productId))}
          >
            Clear wishlist
          </Button>
        )}
      </div>

      {isDemoMode() && (
        <VerificationNotice
          message={`Demo mode: wishlist is saved locally in your browser on ${storeConfig.brandName}.`}
          className="mb-6"
        />
      )}

      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <EmptyState
          icon={<Heart className="size-5" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          action={
            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "primary", size: "md" }))}
            >
              Browse shop
            </Link>
          }
        />
      )}
    </Container>
  );
}
