import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Browse with clarity",
    description:
      "Every listing shows package size, selling unit, variety and availability status—before you add to cart.",
  },
  {
    number: "02",
    title: "Build your basket",
    description:
      "Add produce, pantry goods and household items. Quantities and line totals update as you shop.",
  },
  {
    number: "03",
    title: "Review before checkout",
    description:
      "Confirm items, units and demo prices. Product availability is verified before fulfilment begins.",
  },
  {
    number: "04",
    title: "Secure checkout",
    description:
      "Complete your order through secure online payment. Shipping options and timing depend on fulfilment configuration.",
  },
] as const;

export function HowOrderingWorks() {
  return (
    <section className="bg-produce-mist py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="How ordering works"
          description="A straightforward path from browsing to checkout—without delivery promises we cannot yet confirm."
          className="mb-10"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {steps.map((step) => (
            <li
              key={step.number}
              className="relative rounded-xl border border-border-sand bg-fresh-white p-6 shadow-card"
            >
              <span className="font-heading text-3xl font-semibold text-citrus-orange/40">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-market-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-graphite">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
