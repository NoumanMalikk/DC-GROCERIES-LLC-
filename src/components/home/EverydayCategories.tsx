import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Breakfast",
    description: "Oats, fruit, eggs and morning beverages.",
    href: "/collections/breakfast",
    className: "sm:col-span-2 sm:row-span-2",
    accent: "from-citrus-orange/20 to-citrus-orange/5",
  },
  {
    title: "Cooking Essentials",
    description: "Oils, rice, pasta and canned goods.",
    href: "/collections/pantry",
    className: "sm:col-span-2",
    accent: "from-corn-yellow/25 to-corn-yellow/5",
  },
  {
    title: "Drinks",
    description: "Bottled beverages with clear volume labels.",
    href: "/collections/beverages",
    className: "",
    accent: "from-berry-plum/15 to-berry-plum/5",
  },
  {
    title: "Snacks",
    description: "Packaged snacks with verified sizes.",
    href: "/collections/snacks",
    className: "",
    accent: "from-tomato-red/10 to-tomato-red/5",
  },
  {
    title: "Cleaning and Household",
    description: "Paper goods and everyday household basics.",
    href: "/collections/household",
    className: "sm:col-span-2",
    accent: "from-soft-graphite/10 to-soft-graphite/5",
  },
  {
    title: "Food Information",
    description: "Allergens, labels and nutrition details.",
    href: "/food-information",
    className: "sm:col-span-2",
    accent: "from-garden-green/15 to-garden-green/5",
  },
] as const;

export function EverydayCategories() {
  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Everyday categories"
          description="Browse by how you shop—not by aisle numbers."
          className="mb-8"
        />

        <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={cn(
                "group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-2xl border border-border-sand bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-card-hover motion-reduce:transition-none",
                category.accent,
                category.className,
              )}
            >
              <div>
                <h3 className="font-heading text-lg font-semibold text-market-ink sm:text-xl">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-soft-graphite">
                  {category.description}
                </p>
              </div>
              <ArrowUpRight className="mt-3 size-4 text-market-ink opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
