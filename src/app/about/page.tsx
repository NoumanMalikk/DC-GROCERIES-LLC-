import type { Metadata } from "next";
import Link from "next/link";
import { storeConfig } from "@data/store-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: `${storeConfig.brandName} is a Fairburn, Georgia-based grocery retailer offering an online catalog of produce, pantry goods and everyday essentials.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage
      title={`About ${storeConfig.brandName}`}
      description="Who we are and how we approach online grocery retail."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About" },
      ]}
    >
      <div className="space-y-8 text-base leading-relaxed text-soft-graphite">
        <p>
          {storeConfig.legalName} is a {storeConfig.publicLocationLabel}-based
          grocery retailer offering an online catalog of produce, pantry goods
          and other everyday grocery items. We focus on clear product details - 
          package sizes, variety names and straightforward descriptions - so you
          can shop with confidence.
        </p>

        <p>
          {storeConfig.brandConcept} Our catalog spans fresh produce, pantry
          staples, refrigerated items, breakfast foods, snacks, beverages and
          household essentials. Product availability is confirmed before
          fulfilment.
        </p>

        {storeConfig.showOwnerNamePublicly && (
          <p>
            {storeConfig.brandName} is operated by {storeConfig.ownerName}.
          </p>
        )}

        <p>
          Browse the full catalog, build your basket and check out securely.
          Product details, package sizes and availability are confirmed before
          fulfilment.
        </p>

        <div className="rounded-xl border border-border-sand bg-fresh-white p-6">
          <h2 className="font-heading text-lg font-semibold text-market-ink">
            Learn more
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/food-information"
                className="font-medium text-market-ink underline-offset-2 hover:underline"
              >
                Food Information
              </Link>
              <span className="text-soft-graphite">
                {" "}
 - how we present product and label details
              </span>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-medium text-market-ink underline-offset-2 hover:underline"
              >
                Contact
              </Link>
              <span className="text-soft-graphite">
                {" "}
 - questions about products, orders or this website
              </span>
            </li>
            <li>
              <Link
                href="/faq"
                className="font-medium text-market-ink underline-offset-2 hover:underline"
              >
                FAQ
              </Link>
              <span className="text-soft-graphite">
                {" "}
 - common questions about ordering and products
              </span>
            </li>
          </ul>
        </div>
      </div>
    </LegalPage>
  );
}
