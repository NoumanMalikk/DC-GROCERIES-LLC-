import Link from "next/link";
import { Container } from "@/components/shared/Container";

const colorLanes = [
  {
    name: "Red",
    hex: "#D84A3A",
    href: "/shop?q=tomato",
    description: "Tomatoes, apples and berries",
  },
  {
    name: "Orange",
    hex: "#F28C28",
    href: "/shop?q=orange",
    description: "Citrus, carrots and peppers",
  },
  {
    name: "Green",
    hex: "#386641",
    href: "/shop?q=vegetables",
    description: "Leafy greens and vegetables",
  },
  {
    name: "Yellow",
    hex: "#F2C94C",
    href: "/shop?q=banana",
    description: "Bananas and pantry grains",
  },
  {
    name: "Purple",
    hex: "#70405A",
    href: "/shop?q=grapes",
    description: "Grapes and dark produce",
  },
] as const;

export function ColorOfMarket() {
  return (
    <section
      className="border-y border-border-sand bg-fresh-white py-8"
      aria-label="Shop by produce color"
    >
      <Container>
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-soft-graphite">
          Color of the market
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {colorLanes.map((lane) => (
            <Link
              key={lane.name}
              href={lane.href}
              className="group flex min-w-[140px] flex-1 flex-col items-center gap-2 rounded-xl border border-border-sand bg-oat-cream/50 px-4 py-5 transition-colors hover:bg-oat-cream sm:min-w-[160px]"
            >
              <span
                className="size-10 rounded-full shadow-sm ring-2 ring-fresh-white transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100"
                style={{ backgroundColor: lane.hex }}
                aria-hidden="true"
              />
              <span className="font-heading text-sm font-semibold text-market-ink">
                {lane.name}
              </span>
              <span className="text-center text-[11px] leading-tight text-soft-graphite">
                {lane.description}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
