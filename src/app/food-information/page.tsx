import type { Metadata } from "next";
import Link from "next/link";
import {
  foodInformationIntro,
  foodInformationSections,
} from "@data/food-information";
import { LegalPage } from "@/components/shared/LegalPage";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: foodInformationIntro.title,
  description: foodInformationIntro.summary,
  path: "/food-information",
});

export default function FoodInformationPage() {
  return (
    <LegalPage
      title={foodInformationIntro.title}
      description={foodInformationIntro.summary}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Food Information" },
      ]}
    >
      <VerificationNotice
        message="Information on this page is for general guidance only - not medical or dietary advice. Always read the physical product label."
        className="mb-8"
      />

      <div className="space-y-10">
        {foodInformationSections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2
              id={section.id}
              className="font-heading text-xl font-semibold text-market-ink sm:text-2xl"
            >
              {section.title}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-soft-graphite">
              {section.content.map((paragraph, index) => (
                <li key={index}>{paragraph}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border-sand bg-fresh-white p-6">
        <h2 className="font-heading text-lg font-semibold text-market-ink">
          Related resources
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-soft-graphite">
          <li>
            <Link
              href="/product-allergen-information"
              className="font-medium text-market-ink underline-offset-2 hover:underline"
            >
              Product and Allergen Information
            </Link>
          </li>
          <li>
            <Link
              href="/storage-handling"
              className="font-medium text-market-ink underline-offset-2 hover:underline"
            >
              Storage and Handling
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="font-medium text-market-ink underline-offset-2 hover:underline"
            >
              Contact us
            </Link>
          </li>
        </ul>
      </div>
    </LegalPage>
  );
}
