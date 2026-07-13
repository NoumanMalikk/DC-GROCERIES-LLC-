import Link from "next/link";
import { FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

export function FoodInformationBand() {
  return (
    <section className="border-y border-border-sand bg-market-ink py-12 sm:py-14">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-citrus-orange/20">
            <FileText className="size-7 text-citrus-orange" aria-hidden="true" />
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-fresh-white sm:text-3xl">
              Check the label before you buy.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-fresh-white/75 lg:text-base">
              Ingredients, allergens, nutrition facts and storage instructions
              require physical label verification. Review our food information
              resources before placing an order.
            </p>
          </div>

          <Link
            href="/food-information"
            className={cn(
              buttonVariants({ variant: "citrus", size: "lg" }),
              "shrink-0",
            )}
          >
            Food information
          </Link>
        </div>
      </Container>
    </section>
  );
}
