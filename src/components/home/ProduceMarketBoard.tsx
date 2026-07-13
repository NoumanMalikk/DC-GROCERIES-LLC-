import Link from "next/link";
import { getProductsByCollection } from "@/lib/products";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProduceMarketCard } from "./ProduceMarketCard";

const boardSections = [
  {
    title: "Fruit",
    href: "/collections/fresh-fruit",
    collectionSlug: "fresh-fruit",
    layout: "lg:col-span-7 lg:row-span-2",
    featuredSlugs: [
      "gala-apples-3lb-bag",
      "navel-oranges-4lb-bag",
      "fresh-strawberries-1lb-clamshell",
    ],
  },
  {
    title: "Vegetables",
    href: "/collections/fresh-vegetables",
    collectionSlug: "fresh-vegetables",
    layout: "lg:col-span-5",
    featuredSlugs: ["roma-tomatoes-2lb-pack", "tri-color-bell-peppers-3-count"],
  },
  {
    title: "Herbs",
    href: "/collections/herbs-aromatics",
    collectionSlug: "herbs-aromatics",
    layout: "lg:col-span-5",
    featuredSlugs: ["fresh-cilantro-1-bunch", "fresh-garlic-5-bulb-pack"],
  },
] as const;

export function ProduceMarketBoard() {
  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Fresh produce, clearly presented."
            description="Variety, unit, weight and availability shown for every item—no guesswork at the shelf."
          />
          <Link
            href="/collections/fresh-produce"
            className="shrink-0 text-sm font-semibold text-market-ink underline-offset-4 hover:text-garden-green hover:underline"
          >
            View all produce
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
          {boardSections.map((section) => {
            const products = getProductsByCollection(section.collectionSlug);
            const featured = section.featuredSlugs
              .map((slug) => products.find((p) => p.slug === slug))
              .filter(Boolean);

            return (
              <div
                key={section.collectionSlug}
                className={`flex flex-col gap-4 ${section.layout}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-semibold text-market-ink">
                    {section.title}
                  </h3>
                  <Link
                    href={section.href}
                    className="text-xs font-semibold uppercase tracking-wider text-garden-green hover:underline"
                  >
                    Shop {section.title.toLowerCase()}
                  </Link>
                </div>

                <div
                  className={
                    section.title === "Fruit"
                      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                      : "grid gap-4 sm:grid-cols-2"
                  }
                >
                  {featured.map((product) =>
                    product ? (
                      <ProduceMarketCard key={product.id} product={product} />
                    ) : null,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
