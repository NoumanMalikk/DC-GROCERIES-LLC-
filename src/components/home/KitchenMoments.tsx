import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const moments = [
  {
    title: "Start the Morning",
    description: "Oats, milk, eggs, bananas and breakfast staples.",
    href: "/collections/breakfast",
    image: "/products/cavendish-bananas-2lb-bunch/main.webp",
    accent: "from-[#F28C28]/25 to-oat-cream",
    label: "Breakfast",
  },
  {
    title: "Build the Dinner",
    description: "Rice, pasta, vegetables, beans and cooking essentials.",
    href: "/shop?moment=dinner",
    image: "/products/roma-tomatoes-2lb-pack/main.webp",
    accent: "from-[#D84A3A]/20 to-oat-cream",
    label: "Dinner",
  },
  {
    title: "Refresh the Fridge",
    description: "Produce, dairy and chilled grocery basics.",
    href: "/collections/dairy-refrigerated",
    image: "/products/whole-milk-1-gallon/main.webp",
    accent: "from-[#18332C]/15 to-oat-cream",
    label: "Refrigerated",
  },
  {
    title: "Restock the Pantry",
    description: "Grains, canned items, oils and seasonings.",
    href: "/collections/pantry",
    image: "/products/long-grain-white-rice-5lb/main.webp",
    accent: "from-[#F2C94C]/30 to-oat-cream",
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
              className="group relative flex min-h-[220px] overflow-hidden rounded-2xl border border-border-sand bg-fresh-white shadow-card transition-all hover:shadow-card-hover motion-reduce:transition-none sm:min-h-[240px]"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90",
                  moment.accent,
                )}
              />
              <div className="relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-soft-graphite">
                    {moment.label}
                  </span>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-market-ink sm:text-3xl">
                    {moment.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-soft-graphite">
                    {moment.description}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-market-ink group-hover:text-garden-green">
                  Browse
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              <div className="relative z-10 hidden w-[42%] sm:block">
                <div className="absolute inset-3 overflow-hidden rounded-xl bg-white/80 shadow-sm ring-1 ring-border-sand/60">
                  <Image
                    src={moment.image}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
