import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const moments = [
  {
    title: "Start the Morning",
    description: "Oats, fruit, eggs and juice for a clear breakfast shop.",
    href: "/collections/breakfast",
    accent: "bg-citrus-orange/15 border-citrus-orange/30 hover:border-citrus-orange/60",
    label: "Breakfast",
  },
  {
    title: "Build the Dinner",
    description: "Produce and pantry items for everyday cooking.",
    href: "/shop?moment=dinner",
    accent: "bg-tomato-red/10 border-tomato-red/25 hover:border-tomato-red/50",
    label: "Dinner",
  },
  {
    title: "Refresh the Fridge",
    description: "Dairy and refrigerated items when fulfilment is ready.",
    href: "/collections/dairy-refrigerated",
    accent: "bg-market-ink/5 border-market-ink/15 hover:border-market-ink/30",
    label: "Refrigerated",
  },
  {
    title: "Restock the Pantry",
    description: "Rice, pasta, beans, oil and canned goods.",
    href: "/collections/pantry",
    accent: "bg-corn-yellow/20 border-corn-yellow/40 hover:border-corn-yellow/70",
    label: "Pantry",
  },
] as const;

export function KitchenMoments() {
  return (
    <section className="bg-produce-mist py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Shop by kitchen moment"
          description="Four starting points for building a basket that matches how you cook and eat."
          className="mb-8"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {moments.map((moment) => (
            <Link
              key={moment.href}
              href={moment.href}
              className={cn(
                "group relative flex min-h-[180px] flex-col justify-between rounded-2xl border p-6 shadow-card transition-all hover:shadow-card-hover motion-reduce:transition-none sm:min-h-[200px] sm:p-8",
                moment.accent,
              )}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-soft-graphite">
                  {moment.label}
                </span>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-market-ink sm:text-3xl">
                  {moment.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-soft-graphite">
                  {moment.description}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-market-ink group-hover:text-garden-green">
                Browse
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
