import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getAllCollectionSlugs,
  getCollectionBySlug,
} from "@data/collections";
import { getProductsByCollection } from "@data/products";
import { isDemoMode } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.seoTitle,
    description: collection.seoDescription,
    openGraph: {
      title: collection.seoTitle,
      description: collection.seoDescription,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = getProductsByCollection(slug);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/shop" },
          { label: collection.name },
        ]}
        className="mb-6"
      />

      <div
        className="mb-8 rounded-xl border border-border-sand p-6 sm:p-8"
        style={{
          borderLeftWidth: "4px",
          borderLeftColor: collection.accentColor,
        }}
      >
        <SectionHeading
          as="h1"
          title={collection.name}
          description={collection.description}
        />
        <p className="mt-3 text-sm text-soft-graphite">
          {collectionProducts.length}{" "}
          {collectionProducts.length === 1 ? "product" : "products"} in this
          collection
        </p>
      </div>

      {isDemoMode() && (
        <VerificationNotice
          message="Demo mode: collection items use demonstration pricing until inventory is verified."
          className="mb-6"
        />
      )}

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-produce-mist" />}>
        <ShopCatalog
          collectionSlug={slug}
          sourceProducts={collectionProducts}
          emptyTitle={`No products in ${collection.name}`}
          emptyDescription="Try adjusting filters to see more items in this collection."
        />
      </Suspense>
    </Container>
  );
}