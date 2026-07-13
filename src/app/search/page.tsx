import type { Metadata } from "next";
import { Suspense } from "react";
import { storeConfig } from "@data/store-config";
import { isDemoMode } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: `Search | ${storeConfig.brandName}`,
  description: "Search the DC Groceries catalog by product name, brand, category or keyword.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
          ...(query ? [{ label: `"${query}"` }] : []),
        ]}
        className="mb-6"
      />

      <SectionHeading
        as="h1"
        title={query ? `Search results for "${query}"` : "Search products"}
        description={
          query
            ? "Refine results with filters for category, package size, price and availability."
            : "Enter a search term to find products across the catalog."
        }
        className="mb-8"
      />

      {isDemoMode() && (
        <VerificationNotice
          message="Demo mode: search results use demonstration pricing and pending verification status."
          className="mb-6"
        />
      )}

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-produce-mist" />}>
        <ShopCatalog
          showQuery
          initialQuery={query}
          emptyTitle={query ? "No matching products" : "Start your search"}
          emptyDescription={
            query
              ? `No products matched "${query}". Try different keywords or clear filters.`
              : "Use the search bar or browse collections to find products."
          }
        />
      </Suspense>
    </Container>
  );
}
