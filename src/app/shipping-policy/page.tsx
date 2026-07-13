import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";
import {
  shippingPolicyContent,
  LEGAL_PLACEHOLDER,
} from "@data/legal-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { PolicyContent } from "@/components/shared/PolicyContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping Policy",
  description: `Shipping information for ${storeConfig.brandName}. Policy details pending business review.`,
  path: "/shipping-policy",
});

const fulfilmentNotice = [
  !storeConfig.localPickupEnabled && !storeConfig.localDeliveryEnabled
    ? "Local pickup and local delivery are not currently offered through this website."
    : null,
  !storeConfig.localPickupEnabled && storeConfig.localDeliveryEnabled
    ? "Local pickup is not currently offered through this website."
    : null,
  storeConfig.localPickupEnabled && !storeConfig.localDeliveryEnabled
    ? "Local delivery is not currently offered through this website."
    : null,
]
  .filter(Boolean)
  .join(" ");

export default function ShippingPolicyPage() {
  const sections = shippingPolicyContent.sections.map((section) => {
    if (section.heading === "Shipping Areas" && fulfilmentNotice) {
      return {
        ...section,
        body: `${fulfilmentNotice}\n\n${LEGAL_PLACEHOLDER}`,
      };
    }
    return section;
  });

  return (
    <LegalPage
      title={shippingPolicyContent.title}
      description="How orders are shipped from DC Groceries. Full policy pending business review."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shipping Policy" },
      ]}
      lastUpdated={shippingPolicyContent.lastUpdated}
    >
      <p className="mb-8 text-base leading-relaxed text-soft-graphite">
        Shipping rates, carriers, delivery areas and timeframes will be
        published here once approved. Checkout shows estimated shipping based
        on order weight and destination.
      </p>
      <PolicyContent sections={sections} />
    </LegalPage>
  );
}
