import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { formatPrice, getProductMainImage, getProductPrice } from "@/lib/format";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const pantrySlugs = [
  "long-grain-white-rice-5lb",
  "spaghetti-pasta-16oz",
  "black-beans-15oz-can",
  "old-fashioned-rolled-oats-42oz",
  "vegetable-cooking-oil-48fl-oz",
  "diced-tomatoes-14-5oz-can",
] as const;

export function PantryShelf() {
  const items = pantrySlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Pantry shelf"
            description="Everyday staples with package sizes shown on every label."
          />
          <Link
            href="/collections/pantry"
            className="shrink-0 text-sm font-semibold text-market-ink underline-offset-4 hover:text-garden-green hover:underline"
          >
            Restock pantry
          </Link>
        </div>

        <div className="relative rounded-2xl border border-border-sand bg-gradient-to-b from-produce-mist/80 to-fresh-white p-4 shadow-card sm:p-6">
          <div
            className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border-sand/80 sm:inset-x-8"
            aria-hidden="true"
          />

          <ul
            className="relative flex gap-4 overflow-x-auto pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
          >
            {items.map((product) => {
              if (!product) return null;
              const { src, alt } = getProductMainImage(product);
              const price = getProductPrice(product);

              return (
                <li key={product.id} className="shrink-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex w-[120px] flex-col items-center gap-2 sm:w-[140px]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-sand bg-fresh-white p-2 shadow-sm transition-transform group-hover:-translate-y-1 motion-reduce:group-hover:translate-y-0">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="140px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="text-center">
                      <p className="line-clamp-2 text-xs font-medium leading-snug text-market-ink">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-xs tabular-nums text-soft-graphite">
                        {formatPrice(price)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
