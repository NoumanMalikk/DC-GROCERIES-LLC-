import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@data/collections";
import {
  getCrossSellProducts,
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@data/products";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoSections } from "@/components/product/ProductInfoSections";
import { ProductJsonLd } from "@/components/product/ProductJsonLd";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const crossSell = getCrossSellProducts(product);
  const primaryCollection = product.collectionSlugs[0];
  const collection = primaryCollection
    ? getCollectionBySlug(primaryCollection)
    : undefined;

  return (
    <>
      <ProductJsonLd product={product} />
      <RecentlyViewedTracker productId={product.id} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(primaryCollection
              ? [
                  {
                    label: collection?.name ?? primaryCollection,
                    href: `/collections/${primaryCollection}`,
                  },
                ]
              : []),
            { label: product.title },
          ]}
          className="mb-6"
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ProductGallery product={product} />
          <ProductPurchasePanel product={product} />
        </div>

        <div className="mt-12 rounded-xl border border-border-sand bg-fresh-white p-6 sm:p-8">
          <ProductInfoSections product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <SectionHeading
              title="Related products"
              description="Items in the same category or collection."
              className="mb-6"
            />
            <ProductGrid products={related} columns={4} />
          </section>
        )}

        {crossSell.length > 0 && (
          <section className="mt-12">
            <SectionHeading
              title="You may also like"
              description="Complementary items for your basket."
              className="mb-6"
            />
            <ProductGrid products={crossSell} columns={4} />
          </section>
        )}
      </Container>
    </>
  );
}
