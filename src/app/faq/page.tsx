import type { Metadata } from "next";
import { faqItems, type FaqItem } from "@data/faq";
import { storeConfig } from "@data/store-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ",
  description: `Frequently asked questions about ordering, products and shipping at ${storeConfig.brandName}.`,
  path: "/faq",
});

const CATEGORY_LABELS: Record<FaqItem["category"], string> = {
  ordering: "Ordering",
  products: "Products",
  shipping: "Shipping",
  account: "Account",
  general: "General",
};

const CATEGORY_ORDER: FaqItem["category"][] = [
  "ordering",
  "products",
  "shipping",
  "general",
  "account",
];

function groupFaqsByCategory(): Array<{
  category: FaqItem["category"];
  items: FaqItem[];
}> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: faqItems.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  const groups = groupFaqsByCategory();

  return (
    <>
      <FaqJsonLd />
      <LegalPage
        title="Frequently asked questions"
        description="Answers to common questions about shopping, products and orders at DC Groceries."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
      >
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`faq-${group.category}`}>
              <h2
                id={`faq-${group.category}`}
                className="font-heading text-xl font-semibold text-market-ink sm:text-2xl"
              >
                {CATEGORY_LABELS[group.category]}
              </h2>
              <dl className="mt-6 space-y-6">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border-sand bg-fresh-white p-5 sm:p-6"
                  >
                    <dt className="font-heading text-base font-semibold text-market-ink sm:text-lg">
                      {item.question}
                    </dt>
                    <dd className="mt-3 text-base leading-relaxed text-soft-graphite">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </LegalPage>
    </>
  );
}
