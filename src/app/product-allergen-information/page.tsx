import type { Metadata } from "next";
import Link from "next/link";
import {
  allergenInformationIntro,
  allergenInformationSections,
  commonAllergens,
} from "@data/allergen-information";
import { LegalPage } from "@/components/shared/LegalPage";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: allergenInformationIntro.title,
  description: allergenInformationIntro.summary,
  path: "/product-allergen-information",
});

export default function ProductAllergenInformationPage() {
  return (
    <LegalPage
      title={allergenInformationIntro.title}
      description={allergenInformationIntro.summary}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Product and Allergen Information" },
      ]}
    >
      <VerificationNotice
        message="This page provides general product information only - not medical advice. If you have a severe food allergy, read every product label and contact us before ordering."
        className="mb-8"
      />

      <section className="mb-10" aria-labelledby="common-allergens">
        <h2
          id="common-allergens"
          className="font-heading text-xl font-semibold text-market-ink sm:text-2xl"
        >
          Common food allergens
        </h2>
        <p className="mt-3 text-base leading-relaxed text-soft-graphite">
          Major allergens recognized under U.S. food labeling requirements
          include the following. Presence varies by product - check the physical
          label on the item you receive.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {commonAllergens.map((allergen) => (
            <li
              key={allergen}
              className="rounded-md border border-border-sand bg-fresh-white px-4 py-2.5 text-sm font-medium text-market-ink"
            >
              {allergen}
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-10">
        {allergenInformationSections.map((section) => (
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
        <p className="text-sm leading-relaxed text-soft-graphite">
          Have a question about a specific product?{" "}
          <Link
            href="/contact"
            className="font-medium text-market-ink underline-offset-2 hover:underline"
          >
            Contact us
          </Link>{" "}
          and select Food or allergen information as the topic.
        </p>
      </div>
    </LegalPage>
  );
}
