import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const storyLinks = [
  {
    title: "Start with produce",
    description:
      "Choose fruit, vegetables and herbs with variety names and pack sizes listed clearly.",
    href: "/collections/fresh-produce",
    accent: "border-garden-green/30 bg-garden-green/5",
  },
  {
    title: "Add pantry basics",
    description:
      "Pair fresh items with rice, pasta, beans and canned goods for complete meals.",
    href: "/collections/pantry",
    accent: "border-corn-yellow/40 bg-corn-yellow/10",
  },
  {
    title: "Round out the basket",
    description:
      "Browse breakfast staples, beverages and household essentials in one place.",
    href: "/shop",
    accent: "border-citrus-orange/30 bg-citrus-orange/5",
  },
] as const;

export function ProduceToPantryStory() {
  return (
    <section className="bg-produce-mist py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="From produce to pantry"
          description="Three paths through the catalog - each linking verified listings with clear package details."
          className="mb-10"
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative hidden overflow-hidden rounded-2xl bg-market-ink lg:block">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(135deg, #386641 0%, #F28C28 50%, #D84A3A 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8">
              <p className="font-heading text-3xl font-semibold leading-tight text-fresh-white">
                Build a basket that moves from the produce aisle to the pantry
                shelf.
              </p>
              <p className="mt-3 max-w-md text-sm text-fresh-white/75">
                Every link below opens a filtered view of the catalog - no
                generic categories, no hidden package sizes.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {storyLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-card-hover motion-reduce:transition-none",
                  link.accent,
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-market-ink font-heading text-sm font-semibold text-fresh-white">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-market-ink group-hover:text-garden-green">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-soft-graphite">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-soft-graphite transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
