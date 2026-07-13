import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@data/products";
import { storeConfig } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { isDemoMode } from "@data/store-config";

export const metadata: Metadata = {
  title: `Shop All Products | ${storeConfig.brandName}`,
  description:
    "Browse the full DC Groceries catalog with filters for category, package size, price, availability and more.",
};

export default function ShopPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        className="mb-6"
      />

      <SectionHeading
        as="h1"
        title="Shop all products"
        description={`Browse all ${products.length} catalog items with filters for category, type, package size, price and availability.`}
        className="mb-8"
      />

      {isDemoMode() && (
        <VerificationNotice
          message="Demo mode: prices shown are for demonstration. Product details are confirmed before fulfilment."
          className="mb-6"
        />
      )}

      <Suspense fallback={<ShopCatalogFallback />}>
        <ShopCatalog />
      </Suspense>
    </Container>
  );
}

function ShopCatalogFallback() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-md bg-produce-mist" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl bg-produce-mist"
          />
        ))}
      </div>
    </div>
  );
}
