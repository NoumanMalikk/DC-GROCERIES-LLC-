import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";

export function FeaturedGroceryGrid() {
  const products = getFeaturedProducts().slice(0, 8);

  return (
    <section className="bg-produce-mist py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title="Featured grocery items." />
          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold text-market-ink underline-offset-4 hover:text-garden-green hover:underline"
          >
            Shop all
          </Link>
        </div>

        <ProductGrid products={products} columns={4} />
      </Container>
    </section>
  );
}
