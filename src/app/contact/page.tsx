import type { Metadata } from "next";
import Link from "next/link";
import { storeConfig, getContactEmail } from "@data/store-config";
import { ContactForm } from "@/components/contact/ContactForm";
import { LegalPage } from "@/components/shared/LegalPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: `Contact ${storeConfig.legalName} by phone or message. Questions about products, allergens, orders, shipping and returns.`,
  path: "/contact",
});

export default function ContactPage() {
  const contactEmail = getContactEmail();

  return (
    <LegalPage
      title="Contact us"
      description="Reach DC Groceries with product, order or website questions."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
    >
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border-sand bg-fresh-white p-6">
            <h2 className="font-heading text-lg font-semibold text-market-ink">
              {storeConfig.legalName}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-soft-graphite">
              <li>
                <span className="block text-xs font-semibold uppercase tracking-wider text-market-ink">
                  Phone
                </span>
                <a
                  href={`tel:${storeConfig.phoneE164}`}
                  className="font-medium text-market-ink underline-offset-2 hover:underline"
                >
                  {storeConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block text-xs font-semibold uppercase tracking-wider text-market-ink">
                  Location
                </span>
                {storeConfig.publicLocationLabel}
              </li>
              {storeConfig.showFullBusinessAddress && (
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-market-ink">
                    Address
                  </span>
                  <address className="not-italic leading-relaxed">
                    {storeConfig.registeredAddress.line1}
                    <br />
                    {storeConfig.registeredAddress.city},{" "}
                    {storeConfig.registeredAddress.state}{" "}
                    {storeConfig.registeredAddress.postalCode}
                    <br />
                    {storeConfig.registeredAddress.country}
                  </address>
                </li>
              )}
              {contactEmail && (
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-market-ink">
                    Email
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-medium text-market-ink underline-offset-2 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-border-sand bg-fresh-white p-6">
            <h2 className="font-heading text-lg font-semibold text-market-ink">
              Helpful links
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/food-information"
                  className="text-market-ink underline-offset-2 hover:underline"
                >
                  Food Information
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-market-ink underline-offset-2 hover:underline"
                >
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-refund-policy"
                  className="text-market-ink underline-offset-2 hover:underline"
                >
                  Returns policy
                </Link>
              </li>
              <li>
                <Link
                  href="/product-allergen-information"
                  className="text-market-ink underline-offset-2 hover:underline"
                >
                  Product and Allergen Information
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <h2 className="font-heading text-xl font-semibold text-market-ink">
            Send a message
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-soft-graphite">
            Include the product name and SKU for product or allergen questions.
            For order inquiries, include your order reference if available.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </LegalPage>
  );
}
